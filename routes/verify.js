const express = require('express');
const router = express.Router();
const mongoose = require('mongoose')
const {User} = require("../models/user");

router.get('/', async(req, res, next) => {
    try {
        const user = await User.findOne({ emailToken: req.User.accessToken});
        if (!user) {
            req.flash('error', 'Token is invalid. Contact an admin');
            return res.redirect('/');
        }
        user.emailToken = null;
        user.isVerified = true;
        await user.save();
        req.flash('Success', ' You can now login to YaSite and write your first Yadda!');
        res.redirect('/login')

    } catch (error) {
        console.log(error);
        res.redirect('/')
    }
});
module.exports = router;
