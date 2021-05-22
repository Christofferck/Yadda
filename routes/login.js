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


      router.post('/', async (req,res)=>{
        var email = req.fields.email;
        var password = req.fields.password;

        User.findOne({email : email}).exec((err,user)=>{
            if(user) {
                console.log(user);

                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        console.log('password correct');
                        console.log(user);

                        if (user.isVerified == true ) {

                            var accessToken = jwt.sign ({ email: email}, accessTokenSecret);
                            console.log('new access '+ accessToken);


                            User.findOneAndUpdate({email : email}, { accessToken: accessToken}, (err, doc) => {
                            if (err) {
                                console.log("Something wrong when updating data!");
                            } else {
                              console.log('succes update');
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


                    } else{
                        console.log('password incorrect');
                        res.json({
                            "status": "error",
                            "message": "Email or password does not exist, or is incorrect"
                        })
                    }
                })
            } else {
              console.log('email incorrect');
              res.json({
                "status": "error",
                "message": "Email or password does not exist, or is incorrect"
            })
            }
          })
      })




      module.exports = router;
