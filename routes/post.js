const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const security = require('../private/verification');
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
router.get("/:id", function(req, res) {

  User.findOne({
    accessToken: accessToken
  }).exec((err, user) => {

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

  var accessToken = req.fields.accessToken;
  var caption = req.fields.caption;
  var image = "";
  var video = "";
  var type = req.fields.type;
  var createdAt = new Date().getTime();
  var _id = req.fields._id;



  var verify = security(req, res)

  if (verify.status == false) {
    res.json({
      "status": "error",
      "message": verify.message
    })
  } else {

    User.findOne({accessToken: accessToken}).exec((err, user) => {
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


            // Write the file
            fileSystem.writeFile(image, data, function(err) {
              if (err) throw err;

            });

            // Delete the file
            fileSystem.unlink(req.files.image.path, function(err) {
              if (err) throw err;
            });
          });
        }

        if (req.files.video.size > 0 && req.files.video.type.includes("video")) {
          video = "public/videos/" + new Date().getTime() + "-" + req.files.video.name;

          // Read the file
          fileSystem.readFile(req.files.video.path, function(err, data) {
            if (err) throw err;

            // Write the file
            fileSystem.writeFile(video, data, function(err) {
              if (err) throw err;
            });

            // Delete the file
            fileSystem.unlink(req.files.video.path, function(err) {
              if (err) throw err;
            });
          });
        }


        var postObj = {
          "caption": caption,
          "image": image,
          "video": video,
          "type": type,
          "createdAt": createdAt,
          "user": {
            "_id": user._id,
            "name": user.name,
            "username": user.username,
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
  }
})

//TIMELINE

router.post("/timeline", async function(req, res) {
  var accessToken = req.fields.accessToken;

  console.log(req.fields);

  User.findOne({accessToken: accessToken}).exec((err, user) => {

    if (user == null) {
      res.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });

    } else {


      var userAndFollowing = user.following;
      userAndFollowing.push(user.username)

        console.log(req.fields.profile);

      if (req.fields.profile !== undefined) {
        Post.find({'user.username': {$in: [req.fields.profile]}}).sort({"createdAt": -1}).exec((err, post) => {
          console.log(post);
          returnYaddas(post)
        })
      } else {
        if (user.following.length == 0 || user.following[0] == user.username) {
          Post.find({}).sort({"createdAt": -1}).exec((err, post) => {
            returnYaddas(post)
          })
        } else {

          Post.find({'user.username': {$in: userAndFollowing}}).sort({"createdAt": -1}).exec((err, post) => {
            returnYaddas(post)
          })

        }
      }

      function returnYaddas(post) {
        var dataArr = []
        var data;
        var a = 0;

        for (var i = 0; i < post.length; i++) {
          data = post

          User.find({username: data[i].user.username}).exec((err, userData) => {

            data[a].user.name = userData[0].name
            data[a].user.profileImage = userData[0].profileImage
            data[a].caption = hashTag(data[a].caption);

            a++

            if (a === post.length) {

              res.json({
                "status": "success",
                "message": "Record has been fetched",
                "data": data
              })
            }
          })
        }
      }
    }
  })
})






/*REPLY*/

router.post("/comment", async function(req, res) {



  var accessToken = req.fields.accessToken;
  var _id = req.fields._id;
  var comment = req.fields.comment;
  var createdAt = new Date().getTime();

  User.findOne({
    accessToken: accessToken
  }).exec((err, user) => {

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
            User.updateOne({$and: [{_id: _id}, {"posts._id": post._id}]}, {
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



// Hashtags

const hashTag = function(yadda) {
  const regex = /(\#)(\w+)/g;
  let subst = `<a href='/post/hashtag/$2'> $1$2 </a>`;
  let txt = yadda.replace(regex, subst);
  return txt;
};



router.get('/hashtag/:hashtag', (req, res) => {
  res.render('index');

})

router.post("/hashtag/:hashtag", async function(req, res) {
  var accessToken = req.fields.accessToken;


  User.findOne({accessToken: accessToken}).exec((err, user) => {

    if (user == null) {
      res.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {

      Post.find({"caption": {"$regex": "#" + req.params.hashtag, "$options": "i"}}).sort({"createdAt": -1}).exec((err, data) => {

        var tag = 0;
        for (let i = 0; i < data.length; i++) {

          User.find({username: data[i].user.username}).exec((err, userData) => {
            data[i].user.name = userData[0].name
            data[i].user.profileImage = userData[0].profileImage

            data[i].caption = hashTag(data[i].caption);
            tag++
            console.log(data);
            if (tag == data.length) {
              res.json({
                "status": "success",
                "message": "Record has been fetched",
                "data": data
              })
            }
          })
        }
      })
    }
  })
})































module.exports = router;
