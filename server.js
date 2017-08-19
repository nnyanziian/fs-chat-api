const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const app = express();
const usersModel = require('./models/users.js');
app.use(bodyParser.json());
app.use(fileUpload());

app.post("/api/user", function (req, res) {
    //var newUser = req.body;
    usersModel.registerNewUser(req, res);
});

app.get("/api/users", function (req, res) {
    usersModel.getAllUsers(req, res);
});

app.get("/api/user/:id", function (req, res) {
    usersModel.getUserById(req, res);
});

app.put("/api/user/:id", function (req, res) {
    usersModel.editUser(req, res);
});

app.delete("/api/user/:id", function (req, res) {
    usersModel.deleteUser(req, res);
});

app.post("/api/setUserPic/:id", function (req, res) {
usersModel.setProfile(req, res);
});
// losten to aport on a set sever
const server = app.listen(process.env.PORT || 8080, function () {

    const port = server.address().port;
    console.log("App now running...");
});