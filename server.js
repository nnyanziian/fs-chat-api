const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoDB = "mongodb://127.0.0.1:27017/fschat";
const app = express();
mongoose.connect(mongoDB, {
    useMongoClient: true,
});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    // we're connected!
});

app.use(bodyParser.json());

function handlerError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({
        "error": message,
    });
}

function validateInput(eInput, element) {
    //req.body.username
    if (!eInput) {
        // console.log("Invalid user input", "Must provide a " + element);
        res.status(500).json({
            "error": "Invalid user input Must provide a " + element,
        });
    }
}

var userSchema = mongoose.Schema({
    "username": String,
    "userPassword": String,
    "userStatus": String,
    "online": Boolean,
    "created": {
        type: Date,
        default: Date.now
    },
});

app.post("/api/users", function (req, res) {
    //var newUser = req.body;
    validateInput(req.body.username, "Username");
    validateInput(req.body.userPassword, "Password");

    var User = mongoose.model('users', userSchema);

    var newUser = new User({
        "username": req.body.username,
        "userPassword": req.body.userPassword,
        "userStatus": 'Hey I am using fschat',
        "online": false,
    });

    newUser.save(function (err) {
        if (err) {
            handlerError(res, err.message, "Failed to create account");
        } else {
            res.status(201).json(newUser);
        }
    });
});

app.get("/api/users", function (req, res) {
    var User = mongoose.model('users', userSchema);
    //Model.find(query, fields, options, callback)
    User.find(({}), function (err, data) {
        if (err) {
            handlerError(res, err.message, "Failed to get users");
        } else {
            res.status(200).json(data);
        }
    });
});

app.get("/api/user/:id", function (req, res) {
    var User = mongoose.model('users', userSchema);
    //Model.find(query, fields, options, callback)
    User.findById(req.params.id, function (err, data) {
        if (err) {
            handlerError(res, err.message, "User not Found");
        } else {
            res.status(200).json(data);
        }
    });
});

app.put("/api/user/:id", function (req, res) {
    validateInput(req.body.username, "Username");
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
            handlerError(res, err.message, "User not Found");
        } else {
            res.status(200).json({
                "msg": "User Updated"
            });
        }
    });
});

app.delete("/api/user/:id", function (req, res) {
    var User = mongoose.model('users', userSchema);
    var user_id = req.params.id;
    //Model.find(query, fields, options, callback)
    User.findByIdAndRemove(user_id, function (err, data) {
        if (err) {
            handlerError(res, err.message, "User not Found");
        } else {
            res.status(200).json({
                "msg": "User Deleted"
            });
        }
    });
});
const server = app.listen(process.env.PORT || 8080, function () {

    const port = server.address().port;
    console.log("App now running on port", port);
});