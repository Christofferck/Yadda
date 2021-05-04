var express = require("express");
var app = express();

var formidable = require("express-formidable");
app.use(formidable());

//database
var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
var ObjectId = mongodb.ObjectId;

//http starter servern
var http = require("http").createServer(app);
//hasher passwords
var bcrypt = require("bcrypt");
//se filer i dit projekt nemmere
var fileSystem = require("fs");

//bliver brugt til authentication hvor brugeren får en personlig webtoken
var jwt = require("jsonwebtoken");
var accessTokenSecret = "myAccessTokenSecret1234567890";

//ejs er design virker ligesom html css
app.use("/public", express.static(__dirname + "/public"));
app.set("view engine", "ejs");

//socket.io er med til realtime communication så brugeren ikke skal refreshe deres side konstant
var socketIO = require("socket.io")(http);
var socketID = "";
var users = [];


var mainURL = "http://localhost:3000";

socketIO.on("connection", function(socket) {
    console.log("user connected", socket.id);
    socketID = socket.id;
});

http.listen(3000, function () {
    console.log("Server started.");

    mongoClient.connect("mongodb://localhost:27017", function(error, client){
        var database = client.db("eksamens_projekt");
        console.log("Database connected.");

        app.get("/signup", function (request, result){
            result.render("signup");

        });

        app.post("/signup", function (request, result) {
            var name = request.fields.name;
            var username = request.fields.username;
            var email = request.fields.email;
            var password = request.fields.password;
            var gender = request.fields.gender;
            //checker hvis en bruger allerede existerer
            database.collection("users").findOne({
                $or: [{
                    "email": email
                }, {
                    "username": username
                }]

            }, function (error, user){
                if (user == null) {
                    bcrypt.hash(password, 10, function (error, hash){
                        database.collection("users").insertOne({
                            "name": name,
                            "username": username,
                            "email": email,
                            "password": hash,
                            "gender": gender,
                            "profileImage": "",
                            "coverPhoto": "",
                            "dob": "",
                            "city": "",
                            "country": "",
                            "aboutMe": "",
                            "pages": [],
                            "pages": [],
                            "nofications": [],
                            "groups": [],
                            "posts": [],
                        }, function (error, data) {
                            result.json({
                                "status": "success",
                                "message" : "Registered successfully. You can now login."
                            });

                        });
                    });
                } else {
                        result.json({
                            "status": "error",
                            "message": "Email or username already exist."

                        });
                    }
                });
            })
            app.get("/login", function (request, result) {
                result.render("login");
            });
            app.post("/login", function (request, result) {
                var email = request.fields.email;
                var password = request.fields.password;
                database.collection("users").findOne({
                    "email": email
                }, function (error, user) {
                    if (user == null) {
                        result.json({
                            "status": "error",
                            "message": "Email does not exist"
                        });
                    } else {
                        bcrypt.compare(password, user.password, function (error, isVerify){
                            if (isVerify) {
                                var accessToken = jwt.sign ({ email: email}, accessTokenSecret);
                                database.collection("users").findOneAndUpdate({
                                    "email": email
                                }, {
                                    $set: {
                                        "accessToken": accessToken
                                    }
                                    }, function (error, data) {
                                        result.json({
                                            "status": "success",
                                            "message": "Login Successful",
                                            "accessToken": accessToken,
                                            "profileImage": user.profileImage
                                        });
                                    });
                                 } else {
                                     result.json({
                                         "status": "error",
                                         "message": "Password is incorrect"
                                     });
                                 }
                              });
                        }
                     });
                     app.get("/updateProfile", function (request, result){
                         result.render("updateProfile");
                     })
                  });

                  app.post("/getUser", function (request, result) {
                      var accessToken = request.fields.accessToken;
                      database.collection("users").findOne({
                          "accessToken": accessToken
                      }, function (error, user) {
                          if (user == null) {
                              result.json({
                                  "status": "error",
                                  "message": "User has been logged out. Please login again"
                              });
                          } else {
                              result.json({
                                  "status": "sucess",
                                  "message": "Record has been fetched.",
                                  "data": user
                              });
                          }
                      });   
                  });
                  app.get("/logout", function(request, result){
                      result.redirect("/login");
                  });

                  app.post("/uploadCoverPhoto", function (request, result){
                      var accessToken = request.fields.accessToken;
                      var coverPhoto = "";

                      database.collection("users").findOne({
                          "accessToken": accessToken
                      }, function (error, user) {
                          if (user == null) {
                              result.json({
                                  "status": "error",
                                  "message": "User has been logged out. Please try again"
                              });
                          } else {
                              if (request.files.coverPhoto.size > 0 && request.files.coverPhoto.type.includes("image")) {

                                if (user.coverPhoto !="") {
                                    fileSystem.unlink(user.coverPhoto, function (error) {
                                      //  
                                    });
                                }
                                coverPhoto = "public/image/" + new Date().getTime() + "-" + request.files.coverPhoto.name;
                                fileSystem.rename(request.files.coverPhoto.path, coverPhoto, function (error){
                                    
                                });
                              
                              
                              database.collection("users").updateOne({
                                  "accessToken": accessToken
                              }, {
                                  $set: {
                                      "coverPhoto": coverPhoto
                                  }
                              }, function (error, data) {
                                  result.json({
                                      "status": "status",
                                      "message": "Cover photo has been updated.",
                                      data: mainURL + "/" + coverPhoto
                                  }); 
                              });
                            } else {
                                result.json({
                                    "status": "error",
                                    "message": "Please select valid image." 
                                })
                            };
                         
                    };
                });
            });
                    app.post("/uploadProfileImage", function (request, result ) {
                        var accessToken = request.fields.accessToken;
                        var profileImage = "";

                        database.collection("users"). findOne ({
                            "accessToken": accessToken
                        }, function (error, user) {
                            if (user == null) {
                                result.json({
                                    "status": "error",
                                    "message": "User has been logged out please login again."
                                });
                            } else {
                                
                                if (request.files.profileImage.size > 0 && request.files.profileImage.type.includes("image")) {

                                    if (user.profileImage !="") {
                                        fileSystem.unlink(user.profileImage, function (error) {
                                            //
                                        });
                                    }

                                    profileImage = "public/image/" + new Date().getTime() + "-" + request.files.profileImage.name;
                                    fileSystem.rename(request.files.profileImage.path, profileImage, function (error) {

                                    });

                                    database.collection("users").updateOne({
                                        "accessToken": accessToken
                                    }, {

                                        $set: {
                                            "profileImage": profileImage
                                        }
                                    }, function (error, data) {
                                        result.json({
                                            "status": "status",
                                            "message": "Profile image has been updated.",
                                            data: mainURL + "/" + profileImage
                                        });
                                    });
                                } else {
                                    result.json({
                                        "status": "error",
                                        "message": "Please select valid image."
                                    });
                                };
                            };
                            
                        });
                   });
                })
            })