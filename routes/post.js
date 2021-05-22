const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {
  User
} = require("../models/user");
const {
  Post
} = require("../models/post");
var fileSystem = require("fs");

router.get('/', (req, res) => {

})



router.post('/', async (req, res) => {

})


//GET POST
router.get("/:id", function (req, res) {

  User.findOne({accessToken : accessToken}).exec((err,user)=>{

    if (post == null) {
      res.send({
        "status": "error",
        "message": "Post does not exist."
      });
    } else {
      res.render("postDetail", {
        "post": post
      });
    }
  });
});



//ADD POST
router.post('/add', async (req, res) => {
  //console.log('post add');
  var accessToken = req.fields.accessToken;
  var caption = req.fields.caption;
  var image = "";
  var video = "";
  var type = req.fields.type;
  var createdAt = new Date().getTime();
  var _id = req.fields._id;

  User.findOne({
    accessToken: accessToken
  }).exec((err, user) => {
    if (user == null) {
      res.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {

      if (req.files.image.size > 0 && req.files.image.type.includes("image")) {
        image = "public/images/" + new Date().getTime() + "-" + req.files.image.name;

        // Read the file
        fileSystem.readFile(req.files.image.path, function(err, data) {
          if (err) throw err;
          //console.log('File read!');

          // Write the file
          fileSystem.writeFile(image, data, function(err) {
            if (err) throw err;
            //console.log('File written!');
          });

          // Delete the file
          fileSystem.unlink(req.files.image.path, function(err) {
            if (err) throw err;
            //console.log('File deleted!');
          });
        });
      }

      if (req.files.video.size > 0 && req.files.video.type.includes("video")) {
        video = "public/videos/" + new Date().getTime() + "-" + req.files.video.name;

        // Read the file
        fileSystem.readFile(req.files.video.path, function(err, data) {
          if (err) throw err;
          //console.log('File read!');

          // Write the file
          fileSystem.writeFile(video, data, function(err) {
            if (err) throw err;
            //console.log('File written!');
          });

          // Delete the file
          fileSystem.unlink(req.files.video.path, function(err) {
            if (err) throw err;
            //console.log('File deleted!');
          });
        });
      }



      var postObj = {
        "caption": caption,
        "image": image,
        "video": video,
        "type": type,
        "createdAt": createdAt,
        "likers": [],
        "comments": [],
        "shares": [],
        "user": {
          "_id": user._id,
          "name": user.name,
          "username": user.username,
          "profileImage": user.profileImage
        }
      }

      var newPost = new Post(postObj);

      newPost.save()
        .then((user) => {
          res.json({
            status: "succes",
            message: "Post has been uploaded"
          })
        })
    };
  })
})

//TIMELINE

router.post("/timeline", function(req, res) {
  var accessToken = req.fields.accessToken;
  //console.log("token: " + accessToken);


  User.findOne({
    accessToken: accessToken
  }).exec((err, user) => {
    //console.log(user);
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
        //console.log(data);
        res.json({
          "status": "success",
          "message": "Record has been fetched",
          "data": data
        })
      })
    }
  })
})


/*REPLY*/



router.post("/comment", async function(req, res) {

  console.log('comment');

  var accessToken = req.fields.accessToken;
  var _id = req.fields._id;
  var comment = req.fields.comment;
  var createdAt = new Date().getTime();

  User.findOne({
    accessToken: accessToken
  }).exec((err, user) => {
    //console.log(user);
    if (user == null) {
      res.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {

      Post.findOne({_id: _id}).exec((err, post) => {
        if (post == null) {
          res.json({
            "status": "error",
            "message": "Post does not exist."
          });
        } else {

          var commentId = mongoose.Types.ObjectId();
          console.log('comment ID ' + commentId);

          Post.updateOne({_id: _id}, {
            $push: {
              comments: {
                _id: commentId,
                user: {
                  _id: user._id,
                  name: user.name,
                  profileImage: user.profileImage,
                },
                comment: comment,
                createdAt: createdAt,
              }
            }

          }).exec((err, data) => {
            if (err) {
              console.log(err);
            }

            User.updateOne({$and: [{  _id: _id}, {"posts._id": post._id}]
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
                }
              }
            });

            Post.findOne({_id: _id}).exec((err, updatePost) => {
              console.log(updatePost);
              res.json({
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






})




module.exports = router;
