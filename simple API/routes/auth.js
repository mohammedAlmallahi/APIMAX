const express = require('express');
const router = express.Router();
const authController = require('../controller/auth');
const User = require('../models/user');
const {body} = require('express-validator/check');

router.put('/signup', [
body('email')
.isEmail()
.withMessage('please Enter a Valid Email Address')
.custom((value, {req}) => {
    return User.findOne({email: value})
        .then(userDoc => {
            if(userDoc){
                return Promise.reject('Email Adress is already exist');
            }// end of if 
        })// end of then block
})// end of custom,
.normalizeEmail(),

body('password')
.trim()
.isLength({min: 5}),

body('name')
.trim()
.not()
.isEmpty()

], authController.signup);

router.post('/login', authController.login);














module.exports = router;