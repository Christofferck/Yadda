const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {
  User
} = require("../models/user");
var fileSystem = require("fs");

var mainURL = "http://localhost:3000";


// USER PROFILE
router.get('/u/:username', (req, res) => {

  const username = req.params.username

  User.findOne({
    username: username
  }).exec((err, data) => {
    if (data == null) {
      res.json({
        "status": "error",
        "message": "No user with that username"
      });
    } else {

      data.mainURL = mainURL

      //console.log(data);

      res.render("profile", {
        data: data
      })
    }

  })

  ////console.log(username);


})


router.post('/u/:username', (req, res) => {

const username = req.params.username
const accessToken = req.fields.accessToken

//let followData = follow(req, accessToken)

let owner;

User.findOne({accessToken: accessToken}).exec((err, user) => {
    if (user == null) {
      res.json({
        "status": "error",
        "message": "No user with that username"
      });
    } else {
      ////console.log(user);
      if (user.username == username) {
        owner = true;
      } else {
        owner = false;
      }
    }



    var followers = [];
    var following = [];



    User.findOne({username: req.params.username}).exec((err, profile) => {
        if (profile == null) {
          res.json({
            "status": "error",
            "message": "No user with that username"
          });
        } else {
          following.push(profile.following)
        }

        ////console.log(user.username);
        var followData = {
          isFollowing: false
        }


        User.find().all('following', [username]).exec((err, follower) => {
            for (var i = 0; i < follower.length; i++) {
              followers.push(follower[i].username)
              if (follower[i].username == user.username) {
                console.log("FOSD");
                followData.isFollowing = true;
              }
            }



            followData.followers = followers
            followData.following = following


            res.json({
              "owner": owner,
              "followData": followData
            })



          })
        })



    })

})






//FOLLOW A PROFILE

router.post('/u/:username/follow', async (req, res) => {

  const username = req.params.username
  const accessToken = req.fields.accessToken



  User.findOne({
    accessToken: accessToken
  }).exec((err, user) => {
    if (user == null) {
      res.json({
        "status": "error",
        "message": "No user with that username"
      });
    } else {

      if (user.following.indexOf(username) == -1) {
        //console.log('follow');
        User.updateOne({
          accessToken: accessToken
        }, {

          $push: {
            following: username
          }
        }).exec((err, data) => {





        })
      } else {
        //console.log('unfollow');
        User.updateOne({
          accessToken: accessToken
        }, {
          $pull: {
            following: username
          }
        }).exec((err, data) => {})
      }









    }
  })
})


async function follow(req, accessToken) {


}





//UPDATE PROFILE
router.get('/update', (req, res) => {
  ////console.log(req.user.email);
  res.render('updateprofile');
})


router.post('/update', async (req, res) => {
  var accessToken = req.fields.accessToken;
  var name = req.fields.name;
  var dob = req.fields.dob;
  var city = req.fields.city;
  var country = req.fields.country;
  var aboutMe = req.fields.aboutMe;

  User.findOneAndUpdate({
    accessToken: accessToken
  }, {
    $set: {
      "name": name,
      "dob": dob,
      "city": city,
      "country": country,
      "aboutMe": aboutMe
    }
  }).exec((err, user) => {
    if (user == null) {
      res.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {
      res.json({
        "status": "status",
        "message": "Profile has been updated."
      });
    }
  })
});


//UPLOAD

//COVER PHOTO
router.post('/upload/coverPhoto', async (req, res) => {

  console.log('upload');

  var accessToken = req.fields.accessToken;
  var coverPhoto;

  User.findOne({
    accessToken: accessToken
  }).exec((err, user) => {
    if (user == null) {
      res.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {
      if (req.files.coverPhoto.size > 0 && req.files.coverPhoto.type.includes("image")) {

        if (user.coverPhoto != "") {
          fileSystem.unlink(user.coverPhoto, function(error) {

          });
        }
        coverPhoto = "public/images/" + new Date().getTime() + "-" + req.files.coverPhoto.name;

        // Read the file
        fileSystem.readFile(req.files.coverPhoto.path, function(err, data) {
          if (err) throw err;
          //console.log('File read!');

          // Write the file
          fileSystem.writeFile(coverPhoto, data, function(err) {
            if (err) throw err;
            //console.log('File written!');

            User.findOneAndUpdate({
              accessToken: accessToken
            }, {
              $set: {
                "coverPhoto": coverPhoto
              }
            }, {
              upsert: true
            }, function(err, user) {
              if (user == null) {
                res.json({
                  "status": "error",
                  "message": "User has been logged out. Please login again."
                });
              } else {
                res.json({
                  "status": "status",
                  "message": "Cover photo has been updated.",
                  data: mainURL + "/" + coverPhoto
                });
              }

            });
          });

          // Delete the file
          fileSystem.unlink(req.files.coverPhoto.path, function(err) {
            if (err) throw err;
            //console.log('File deleted!');
          });
        });
      } else {
        res.json({
          "status": "error",
          "message": "Please select valid image."
        });
      }
    }

  })
})


//PROFILE IMAGE


router.post('/upload/profileimg', async (req, res) => {
  //console.log('upload');

  var accessToken = req.fields.accessToken;
  var profileImage = "";

  User.findOne({
    accessToken: accessToken
  }).exec((err, user) => {
    if (user == null) {
      res.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {
      if (req.files.profileImage.size > 0 && req.files.profileImage.type.includes("image")) {

        if (user.profileImage != "") {
          fileSystem.unlink(user.profileImage, function(error) {
            //
          });
        }
        profileImage = "public/images/" + new Date().getTime() + "-" + req.files.profileImage.name;

        // Read the file
        fileSystem.readFile(req.files.profileImage.path, function(err, data) {
          if (err) throw err;
          //console.log('File read!');

          // Write the file
          fileSystem.writeFile(profileImage, data, function(err) {
            if (err) throw err;
            //console.log('File written!');

            User.findOneAndUpdate({
              accessToken: accessToken
            }, {
              $set: {
                "profileImage": profileImage
              }
            }, {
              upsert: true
            }, function(err, user) {
              if (user == null) {
                res.json({
                  "status": "error",
                  "message": "User has been logged out. Please login again."
                });
              } else {
                res.json({
                  "status": "status",
                  "message": "Cover photo has been updated.",
                  data: mainURL + "/" + profileImage
                });
              }

            });
          });

          // Delete the file
          fileSystem.unlink(req.files.profileImage.path, function(err) {
            if (err) throw err;
            //console.log('File deleted!');
          });
        });
      } else {
        res.json({
          "status": "error",
          "message": "Please select valid image."
        });
      }
    }

  })
})






//TIMELINE

router.post("/timeline", function(req, res) {
  var accessToken = req.fields.accessToken;
  ////console.log("token: " + accessToken);


  User.findOne({
    accessToken: accessToken
  }).exec((err, user) => {
    ////console.log(user);
    if (user == null) {
      res.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {

      var ids = [];
      ids.push(user._id);
      Post.find({
        "user._id": {
          $in: ids
        }
      }).sort({
        "createdAt": -1
      }).limit(5).exec((err, data) => {
        ////console.log(data);
        res.json({
          "status": "success",
          "message": "Record has been fetched",
          "data": data
        })
      })
    }
  })
})









module.exports = router;
