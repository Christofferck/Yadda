const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const {User} = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const sgMail = require("@sendgrid/mail");
const security = require('../private/verification');

require('dotenv').config();

router.get('/', (req, res) => {
  res.render('signup');
})


router.post('/', (req, res) => {
  var name = req.fields.name;
  var username = req.fields.username;
  var email = req.fields.email;
  var password = req.fields.password;
  var gender = req.fields.gender;

  var verify = security(req, res)

  if (verify.status == false) {
    res.json({
      "status": "error",
      "message": verify.message
    })
  } else {


    //checker hvis en bruger allerede existerer

    User.findOne({
      $or: [{
        email: email
      }, {
        username: username
      }]
    }).exec((err, user) => {
      if (user == null) {
        var userObj = {
          "name": name,
          "username": username,
          "email": email,
          "password": password,
          "gender": gender,
          "profileImage": "public/img/default_profile.jpg",
          "coverPhoto": "public/img/default_cover.jpg",
          "emailToken": crypto.randomBytes(64).toString("hex"),
          "isVerified": false,
        }


        var newUser = new User(userObj);

        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt,
            async (err, hash) => {
              if (err) throw err;
              //save pass to hash
              newUser.password = hash;
              //save user
              newUser.save()
                .then( async (value) => {
                  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
                const emailmsg = {
                    to: userObj.email,
                    from: "erikhey7@hotmail.com",
                    cc: null,
                    subject: "YaSite - verify your email.",
                    text: `
                    Hello, thanks for registering to our site.
                    Please copy and paste the link below to verify your account.
                    http://${req.headers.host}/verify-email?token=${User.emailToken}
                    `,
                    html:`
                    <h1>Hello!</h1>
                        <p>Thanks for registering on our site.</p>
                        <p>Please click the link below to verify your account.</p>
                        <a>http://${req.headers.host}/verify-email?token=${User.emailToken}</a>
                    `
                }

                  // beskeden der vises til brugeren når de modtager mail

                // funktionen der sender email via grid og enten skriver sucess eller error
                try {
                    sgMail.send(emailmsg);
                    res.json({
                      "status": "success",
                      "message": "thanks for registerings. please check your email to complete your verification."
                    });
                } catch(error) {
                    console.log(error);
                    res.json({
                      "status": "error",
                      "message": "something went wrong, pleace contact service@YaSite.com"
                    });
                }
                })
                .catch(value => console.log(value));

            }));

      } else {
        res.json({
          "status": "error",
          "message": "Email or username already exist."

        });
      };
    })
  }
})


module.exports = router;
