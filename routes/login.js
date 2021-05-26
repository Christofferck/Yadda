const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {
  User
} = require("../models/user");



var accessTokenSecret = "myAccessTokenSecret1234567890";



router.get('/', (req, res) => {
  res.render("login");
})


router.post('/', async (req, res) => {
  var email = req.fields.email;
  var password = req.fields.password;

  User.findOne({
    email: email
  }).exec((err, user) => {
    if (user) {

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        if (isMatch) {
          if (user.isVerified == true) {

            var accessToken = jwt.sign({
              email: email
            }, accessTokenSecret);

            User.findOneAndUpdate({
              email: email
            }, {
              accessToken: accessToken
            }, (err, doc) => {
              if (err) {

              } else {
                res.json({
                  "status": "success",
                  "message": "Login Successful",
                  "accessToken": accessToken,
                  "profileImage": user.profileImage
                })
              }
            });


          } else {
            res.json({
              "status": "error",
              "message": "Your profile is not verified"
            })
          }


        } else {
          res.json({
            "status": "error",
            "message": "Email or password does not exist, or is incorrect"
          })
        }
      })
    } else {
      res.json({
        "status": "error",
        "message": "Email or password does not exist, or is incorrect"
      })
    }
  })
})




module.exports = router;
