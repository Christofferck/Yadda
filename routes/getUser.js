const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {User} = require("../models/user");




router.post('/', async (req,res)=>{
  //console.log('getUser');
  var accessToken = req.fields.accessToken;
    User.findOne({accessToken : accessToken}).exec((err,user)=>{
      if (user == null) {
          res.json({
              "status": "error",
              "message": "User has been logged out. Please login again."
          });
      } else {
          //console.log(user);
          res.json({
              "status": "success",
              "message": "Record has been fetched.",
              "data": user
          });
        }
    });

})




module.exports = router;
