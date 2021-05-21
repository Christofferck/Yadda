const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {User} = require("../models/user");


router.get('/', (req,res)=>{

})



router.post('/', async (req,res)=>{

})


//UPDATE PROFILE
router.get('/update', (req,res)=>{
  //console.log(req.user.email);
  res.render('updateprofile');
})


router.post('/update', async (req,res)=>{
  var accessToken = req.fields.accessToken;
  var name = req.fields.name;
  var dob = req.fields.dob;
  var city = req.fields.city;
  var country = req.fields.country;
  var aboutMe = req.fields.aboutMe;
  User.findOne({accessToken : accessToken}).exec((err,user)=>{
    if (user == null) {
      res.json({
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
        res.json({
          "status": "status",
          "message": "Profile has been updated."
        });
      });
    }
  });
})

//UPLOAD

//COVER PHOTO
router.post('/upload/coverphoto', async (req,res)=>{

  var accessToken = req.fields.accessToken;
  var coverPhoto = "";

  database.collection("users").findOne({
      "accessToken": accessToken
  }, function (error, user) {
      if (user == null) {
          res.json({
              "status": "error",
              "message": "User has been logged out. Please login again."
          });
      } else {

          if (req.files.coverPhoto.size > 0 && req.files.coverPhoto.type.includes("image")) {

              if (user.coverPhoto != "") {
                  fileSystem.unlink(user.coverPhoto, function (error) {
                      //
                  });
              }
              coverPhoto = "public/images/" + new Date().getTime() + "-" + req.files.coverPhoto.name;

              // Read the file
              fileSystem.readFile(req.files.coverPhoto.path, function (err, data) {
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
                          res.json({
                              "status": "status",
                              "message": "Cover photo has been updated.",
                              data: mainURL + "/" + coverPhoto
});
});
        });

        // Delete the file
          fileSystem.unlink(req.files.coverPhoto.path, function (err) {
            if (err) throw err;
            console.log('File deleted!');
        });
    });
} else {
res.json({
"status": "error",
"message": "Please select valid image."
});
}
}
});


})


//PROFILE IMAGE


router.post('/upload/profileimg', async (req,res)=>{
  var accessToken = req.fields.accessToken;
  var profileImage = "";

  database.collection("users").findOne({
    "accessToken": accessToken
  }, function (error, user) {
    if (user == null) {
      res.json({
        "status": "error",
        "message": "User has been logged out. Please login again."
      });
    } else {

      if (req.files.profileImage.size > 0 && req.files.profileImage.type.includes("image")) {

        if (user.profileImage != "") {
          fileSystem.unlink(user.profileImage, function (error) {
            //
          });
        }

        profileImage = "public/images/" + new Date().getTime() + "-" + req.files.profileImage.name;

        // Read the file
                  fileSystem.readFile(req.files.profileImage.path, function (err, data) {
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
              res.json({
                "status": "status",
                "message": "Profile image has been updated.",
                data: mainURL + "/" + profileImage
              });
            });
                      });

                      // Delete the file
                      fileSystem.unlink(req.files.profileImage.path, function (err) {
                          if (err) throw err;
                          console.log('File deleted!');
                      });
                  });
      } else {
        res.json({
          "status": "error",
          "message": "Please select valid image."
        });
      }
    }
  });
})










module.exports = router;
