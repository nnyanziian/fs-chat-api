const mongoose = require('mongoose');
const mongoDB = "mongodb://127.0.0.1:27017/fschat";
mongoose.connect(mongoDB, {
    useMongoClient: true,
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});
const func = require('./func.js');
var userSchema = mongoose.Schema({
    "username": String,
    "userPassword": String,
    "userStatus": String,
    "online": Boolean,
    "user_dp": String,
    "created": {
        type: Date,
        default: Date.now
    },
});

exports.registerNewUser = function (req, res) {
    func.validateInput(req.body.username, "Username");
    func.validateInput(req.body.userPassword, "Password");

    var User = mongoose.model('users', userSchema);

    var newUser = new User({
        "username": req.body.username,
        "userPassword": req.body.userPassword,
        "userStatus": 'Hey I am using fschat',
        "user_dp": "./userPics/default.png",
        "online": false,
    });

    newUser.save(function (err) {
        if (err) {
            func.handlerError(res, err.message, "Failed to create account");
        } else {
            res.status(201).json(newUser);
        }
    });
}

exports.getAllUsers = function (req, res) {
    var User = mongoose.model('users', userSchema);
    //Model.find(query, fields, options, callback)
    User.find(({}), function (err, data) {
        if (err) {
            func.handlerError(res, err.message, "Failed to get users");
        } else {
            res.status(200).json(data);
        }
    });
}
exports.getUserById = function (req, res) {
    var User = mongoose.model('users', userSchema);
    //Model.find(query, fields, options, callback)
    User.findById(req.params.id, function (err, data) {
        if (err) {
            func.handlerError(res, err.message, "User not Found");
        } else {
            res.status(200).json(data);
        }
    });
}

exports.editUser = function (req, res) {
    func.validateInput(req.body.username, "Username");
    //validateInput(req.body.userPassword, "Password");

    var User = mongoose.model('users', userSchema);

    var userUpdate = {
        "username": req.body.username
        //  "userPassword": req.body.userPassword,
        // "userStatus": req.body.userStatus,
    };
    var user_id = req.params.id;
    //Model.find(query, fields, options, callback)
    User.findByIdAndUpdate(user_id, userUpdate, function (err, data) {
        if (err) {
            func.handlerError(res, err.message, "User not Found");
        } else {
            res.status(200).json({
                "msg": "User Updated"
            });
        }
    });
}

exports.deleteUser = function (req, res) {
    var User = mongoose.model('users', userSchema);
    var user_id = req.params.id;
    //Model.find(query, fields, options, callback)
    User.findByIdAndRemove(user_id, function (err, data) {
        if (err) {
            func.handlerError(res, err.message, "User not Found");
        } else {
            res.status(200).json({
                "msg": "User Deleted"
            });
        }
    });
}

exports.setProfile = function (req, res) {
    if (!req.files) {
        return res.status(400).json({
            'msg': 'Sorry there are no files availale to upload'
        });
    }
    let sampleFile = req.files.user_dp;
    const timeInMs = Date.now();
    // Use the mv() method to place the file somewhere on your server 
    var fileLink = './userPics/'+timeInMs+"_"+sampleFile.name;
    sampleFile.mv(fileLink, function (err) {
        if (err) {
            return res.status(500).send(err);
        }

    var User = mongoose.model('users', userSchema);
    
        var userUpdate = {
            "user_dp": fileLink
            //  "userPassword": req.body.userPassword,
            // "userStatus": req.body.userStatus,
        };
        var user_id = req.params.id;
        //Model.find(query, fields, options, callback)
        User.findByIdAndUpdate(user_id, userUpdate, function (err, data) {
            if (err) {
                func.handlerError(res, err.message, "User not Found");
            } else {
                res.status(200).json({
                    "msg": "Profile Pic is Set"
                });
            }
        });

    });
    
}