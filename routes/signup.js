const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose')
const {User} = require("../models/user");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

router.get('/', (req,res)=>{
    res.render('signup');
})

router.post('/', (req,res)=>{
  var name = req.fields.name;
  var username = req.fields.username;
  var email = req.fields.email;
  var password = req.fields.password;
  var gender = req.fields.gender;
  //checker hvis en bruger allerede existerer


  User.findOne({$or:[{email : email}, {username : username}]}).exec((err,user)=>{
      if (user == null) {
          var userObj = {
              "name": name,
              "username": username,
              "email": email,
              "password": password,
              "gender": gender,
              "emailToken": crypto.randomBytes(64).toString("hex"),
              "isVerified": false,
          }


      var newUser = new User(userObj);

      bcrypt.genSalt(10,(err,salt)=>
      bcrypt.hash(newUser.password,salt,
          (err,hash)=> {
              if(err) throw err;
                  //save pass to hash
                  newUser.password = hash;
              //save user
              newUser.save()
              .then((value)=>{
                  console.log(value)
                  //req.flash('success_msg','You have now registered!');
                  //res.redirect(`/verify-email?token=${userObj.emailToken}`);
              })
              .catch(value=> console.log(value));

          }));


      } else {
           res.json({
                  "status": "error",
                  "message": "Email or username already exist."

              });
          };
  })

})


module.exports = router;
