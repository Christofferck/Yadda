const express = require('express');
const router  = express.Router();
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const {User} = require("../models/user");


router.get('/', (req,res)=>{
      res.redirect("/login");
})



router.post('/', async (req,res)=>{

})




module.exports = router;
