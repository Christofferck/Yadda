var express = require("express");
var app = express();

var formidable = require("express-formidable");
app.use(formidable());

var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var mongoose = require("mongoose");

var ObjectId = mongodb.ObjectId;



var http = require("http").createServer(app);
var bcrypt = require("bcrypt");
var fileSystem = require("fs");

var jwt = require("jsonwebtoken");
var accessTokenSecret = "myAccessTokenSecret1234567890";




app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");

var socketIO = require("socket.io")(http);
var socketID = "";
var users = [];

var mainURL = "http://localhost:3000";

socketIO.on("connection", function (socket) {
	socketID = socket.id;
});

//ROUTES
const indexR = require('./routes/index');
app.use("/", indexR);

const loginR = require('./routes/login');
app.use("/login", loginR);

const getUserR = require('./routes/getUser');
app.use("/getUser", getUserR);

const logoutR = require('./routes/logout');
app.use("/logout", logoutR);

const postR = require('./routes/post');
app.use("/post", postR);

const signupR = require('./routes/signup');
app.use("/signup", signupR);

const profileR = require('./routes/profile');
app.use("/profile", profileR);





mongoose.connect("mongodb://localhost:27017/eksamens_projekt", {
    useNewUrlParser: true,
    useUnifiedTopology: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoose'))












app.listen(process.env.PORT || 3000)
