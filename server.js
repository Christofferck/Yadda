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
	console.log("User connected", socket.id);
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


mongoose.connection.on('open', function (ref) {
    //get collection names
    mongoose.connection.db.listCollections().toArray(function (err, names) {
        console.log(names);  [{ name: 'dbname.myCollection' }]
        module.exports.Collection = names;
    });
})












app.listen(process.env.PORT || 3000)












/*


http.listen(3000, function () {
	console.log("Server started at " + mainURL);

    mongoClient.connect("mongodb://localhost:27017", function(error, client){
        var database = client.db("eksamens_projekt");
        console.log("Database connected.");

            app.get("/login", function (request, result) {
                result.render("login");
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
					});
				}
			});
		});

		app.get("/post/:id", function (request, result) {
			database.collection("posts").findOne({
				"_id": ObjectId(request.params.id)
			}, function (error, post) {
				if (post == null) {
					result.send({
						"status": "error",
						"message": "Post does not exist."
					});
				} else {
					result.render("postDetail", {
						"post": post
					});
				}
			});
		});

		app.get("/", function (request, result) {
			result.render("index");
		});

		app.post("/addPost", function (request, result) {

			var accessToken = request.fields.accessToken;
			var caption = request.fields.caption;
			var image = "";
			var video = "";
			var type = request.fields.type;
			var createdAt = new Date().getTime();
			var _id = request.fields._id;

			database.collection("users").findOne({
				"accessToken": accessToken
			}, function (error, user) {
				if (user == null) {
					result.json({
						"status": "error",
						"message": "User has been logged out. Please login again."
					});
				} else {

					if (request.files.image.size > 0 && request.files.image.type.includes("image")) {
						image = "public/images/" + new Date().getTime() + "-" + request.files.image.name;

						// Read the file
	                    fileSystem.readFile(request.files.image.path, function (err, data) {
	                        if (err) throw err;
	                        console.log('File read!');

	                        // Write the file
	                        fileSystem.writeFile(image, data, function (err) {
	                            if (err) throw err;
	                            console.log('File written!');
	                        });

	                        // Delete the file
	                        fileSystem.unlink(request.files.image.path, function (err) {
	                            if (err) throw err;
	                            console.log('File deleted!');
	                        });
	                    });
					}

					if (request.files.video.size > 0 && request.files.video.type.includes("video")) {
						video = "public/videos/" + new Date().getTime() + "-" + request.files.video.name;

						// Read the file
	                    fileSystem.readFile(request.files.video.path, function (err, data) {
	                        if (err) throw err;
	                        console.log('File read!');

	                        // Write the file
	                        fileSystem.writeFile(video, data, function (err) {
	                            if (err) throw err;
	                            console.log('File written!');
	                        });

	                        // Delete the file
	                        fileSystem.unlink(request.files.video.path, function (err) {
	                            if (err) throw err;
	                            console.log('File deleted!');
	                        });
	                    });
					}

					database.collection("posts").insertOne({
						"caption": caption,
						"image": image,
						"video": video,
						"type": type,
						"createdAt": createdAt,
						"comments": [],
						"user": {
							"_id": user._id,
							"name": user.name,
							"username": user.username,
							"profileImage": user.profileImage
						}
					}, function (error, data) {

						database.collection("users").updateOne({
							"accessToken": accessToken
						}, {
							$push: {
								"posts": {
									"_id": data.insertedId,
									"caption": caption,
									"image": image,
									"video": video,
									"type": type,
									"createdAt": createdAt,
									"comments": [],
								}
							}
						}, function (error, data) {

							result.json({
								"status": "success",
								"message": "Post has been uploaded."
							});
						});
					});
				}
			});
		});

		app.post("/getNewsfeed", function (request, result) {
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

					var ids = [];
					ids.push(user._id);

					database.collection("posts")
					.find({
						"user._id": {
							$in: ids
						}
					})
					.sort({
						"createdAt": -1
					})
					.limit(5)
					.toArray(function (error, data) {

						result.json({
							"status": "success",
							"message": "Record has been fetched",
							"data": data
						});
					});
				}
			});
		});
		app.post("/postComment", function (request, result) {

			var accessToken = request.fields.accessToken;
			var _id = request.fields._id;
			var comment = request.fields.comment;
			var createdAt = new Date().getTime();

			database.collection("users").findOne({
				"accessToken": accessToken
			}, function (error, user) {
				if (user == null) {
					result.json({
						"status": "error",
						"message": "User has been logged out. Please login again."
					});
				} else {

					database.collection("posts").findOne({
						"_id": ObjectId(_id)
					}, function (error, post) {
						if (post == null) {
							result.json({
								"status": "error",
								"message": "Post does not exist."
							});
						} else {

							var commentId = ObjectId();

							database.collection("posts").updateOne({"_id": ObjectId(_id)}, {
								$push: {
									"comments": {
										"_id": commentId,
										"user": {
											"_id": user._id,
											"name": user.name,
											"profileImage": user.profileImage,
										},
										"comment": comment,
										"createdAt": createdAt,
										"replies": []
									}
								}
							}, function (error, data) {

								if (user._id.toString() != post.user._id.toString()) {
									database.collection("users").updateOne({
										"_id": post.user._id
									}, {
										$push: {
											"notifications": {
												"_id": ObjectId(),
												"type": "new_comment",
												"content": user.name + " commented on your post.",
												"profileImage": user.profileImage,
												"post": {
													"_id": post._id
												},
												"isRead": false,
												"createdAt": new Date().getTime()

											}
										}
									});
								}

								database.collection("users").updateOne({
									$and: [{
										"_id": post.user._id
									}, {
										"posts._id": post._id
									}]
								}, {
									$push: {
										"posts.$[].comments": {
											"_id": commentId,
											"user": {
												"_id": user._id,
												"name": user.name,
												"profileImage": user.profileImage,
											},
											"comment": comment,
											"createdAt": createdAt,
											"replies": []
										}
									}
								});

								database.collection("posts").findOne({
									"_id": ObjectId(_id)
								}, function (error, updatePost) {
									result.json({
										"status": "success",
										"message": "Comment has been posted.",
										"updatePost": updatePost
									});
								});
							});

						}
					});
				}
			});

		});

    });
})

*/
