const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoDB = "mongodb://127.0.0.1:27017/fschat";
const app = express();

mongoose.connect(mongoDB, {
    useMongoClient: true,
  });

app.use(bodyParser.json());

const db=mongoose.connection;
mongoose.Promise = global.Promise;
db.on('error', console.error.bind(console, " Mongo DB conection error:"));

    console.log("Database Connection ready");

    function handlerError(res, reason, message, code) {
        console.log("ERROR: " + reason);
        res.status(code || 500).json({
            "error": message
        });
    }

app.post("/api/contacts", function (req, res) {
    var newUser = req.body;
    if (!req.body.name) {
        handlerError(res, "Invalid user input", "Must provide a name.", 400);
    }
    db.collection('users').inserOne(newUser, function (err, doc) {
        if (err) {
            handlerError(res, err.message, "Failed to create account");
        } else {
            res.status(201).json(docs.ops[0]);
        }
    });
});

app.get("/api/users", function (req, res) {
    db.collection('users').find({}).toArray(function (err, docs) {
        if (err) {
            handlerError(res, err.message, "Failed to get users");
        } else {
            res.status(200).json(docs);
        }
    });
});

app.put("/api/contacts/:id", function (req, res) {

});
app.delete("/api/contacts/:id", function (req, res) {

});
const server = app.listen(process.env.PORT || 8080, function () {

    const port = server.address().port;
    console.log("App now running on port", port);
});