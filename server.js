var express = require("express");
var app = express();

var formidable = require("express-formidable");
app.use(formidable());

var mongodb = require("mongodb");
var mongoClient = mongodb.MongoClient;
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
	console.log("User connected", socket.id);
	socketID = socket.id;
});

http.listen(3000, function () {
	console.log("Server started at " + mainURL);

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
							"reset_token": reset_token,
							"profileImage": "",
							"coverPhoto": "",
							"dob": "",
							"city": "",
							"country": "",
							"aboutMe": "",
							"friends": [],
							"pages": [],
							"notifications": [],
							"groups": [],
							"posts": []
						}, function (error, data) {
							result.json({
								"status": "success",
								"message": "Signed up successfully. You can login now."
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
                        bcrypt.compare(password, user.password, function (error, isVerify) {
                            if (isVerify) {
                                var accessToken = jwt.sign({ email: email }, accessTokenSecret);
                                database.collection("users").findOneAndUpdate({
                                    "email": email
                                }, {
                                    $set: {
                                        "accessToken": accessToken
                                    }
                                }, function (error, data) {
                                    result.json({
                                        "status": "success",
                                        "message": "Login successfully",
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
                     app.get("/updateProfile", function (request, result) {
                        result.render("updateProfile");
                    });
                  });

                  app.post("/getUser", function (request, result) {
                    var accessToken = request.fields.accessToken;
                    database.collection("users").findOne({
                        "accessToken": accessToken
                    }, function (error, user) {
                        if (user == null) {
                            result.json({
                                "status": "error",
                                "message": "User has been logged out. Please login again."
                            });
                        } else {
                            result.json({
                                "status": "success",
                                "message": "Record has been fetched.",
                                "data": user
                            });
                          }
                      });   
                  });
                  app.get("/logout", function (request, result) {
                    result.redirect("/login");
                });

                app.post("/uploadCoverPhoto", function (request, result) {
                    var accessToken = request.fields.accessToken;
                    var coverPhoto = "";

                    database.collection("users").findOne({
                        "accessToken": accessToken
                    }, function (error, user) {
                        if (user == null) {
                            result.json({
                                "status": "error",
                                "message": "User has been logged out. Please login again."
                            });
                        } else {

                            if (request.files.coverPhoto.size > 0 && request.files.coverPhoto.type.includes("image")) {

                                if (user.coverPhoto != "") {
                                    fileSystem.unlink(user.coverPhoto, function (error) {
                                        //
                                    });
                                }
                                coverPhoto = "public/images/" + new Date().getTime() + "-" + request.files.coverPhoto.name;

                                // Read the file
                                fileSystem.readFile(request.files.coverPhoto.path, function (err, data) {
                                    if (err) throw err;
                                    console.log('File read!');
        
                                    // Write the file
                                    fileSystem.writeFile(coverPhoto, data, function (err) {
                                        if (err) throw err;
                                        console.log('File written!');
        
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
	                        });

	                        // Delete the file
                            fileSystem.unlink(request.files.coverPhoto.path, function (err) {
	                            if (err) throw err;
	                            console.log('File deleted!');
	                        });
	                    });
					} else {
						result.json({
							"status": "error",
							"message": "Please select valid image."
						});
					}
				}
			});
		});

		app.post("/uploadProfileImage", function (request, result) {
			var accessToken = request.fields.accessToken;
			var profileImage = "";

			database.collection("users").findOne({
				"accessToken": accessToken
			}, function (error, user) {
				if (user == null) {
					result.json({
						"status": "error",
						"message": "User has been logged out. Please login again."
					});
				} else {

					if (request.files.profileImage.size > 0 && request.files.profileImage.type.includes("image")) {

						if (user.profileImage != "") {
							fileSystem.unlink(user.profileImage, function (error) {
								//
							});
						}

						profileImage = "public/images/" + new Date().getTime() + "-" + request.files.profileImage.name;

						// Read the file
	                    fileSystem.readFile(request.files.profileImage.path, function (err, data) {
	                        if (err) throw err;
	                        console.log('File read!');

	                        // Write the file
	                        fileSystem.writeFile(profileImage, data, function (err) {
	                            if (err) throw err;
	                            console.log('File written!');

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
	                        });

	                        // Delete the file
	                        fileSystem.unlink(request.files.profileImage.path, function (err) {
	                            if (err) throw err;
	                            console.log('File deleted!');
	                        });
	                    });
					} else {
						result.json({
							"status": "error",
							"message": "Please select valid image."
						});
					}
				}
			});
		});

		app.post("/updateProfile", function (request, result) {
			var accessToken = request.fields.accessToken;
			var name = request.fields.name;
			var dob = request.fields.dob;
			var city = request.fields.city;
			var country = request.fields.country;
			var aboutMe = request.fields.aboutMe;

			database.collection("users").findOne({
				"accessToken": accessToken
			}, function (error, user) {
				if (user == null) {
					result.json({
						"status": "error",
						"message": "User has been logged out. Please login again."
					});
				} else {
					database.collection("users").updateOne({
						"accessToken": accessToken
					}, {
						$set: {
							"name": name,
							"dob": dob,
							"city": city,
							"country": country,
							"aboutMe": aboutMe
						}
					}, function (error, data) {
						result.json({
							"status": "status",
							"message": "Profile has been updated."
						});
					}
                    
                    )
			};
		});
     });
})
})