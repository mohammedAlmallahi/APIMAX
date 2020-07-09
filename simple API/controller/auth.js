const User = require('../models/user');
const {validationResult} = require('express-validator/check');
const bcrypt = require('bcryptjs');// 1-npm install --save bcryptjs
const jwt = require('jsonwebtoken'); // 1 - install it npm install --save jsonwebtoken // 2-> import it 



exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty){
        const error = new Error('Validation Failed'); // this create new Object 
        error.statusCode = 422;
        error.data = errors.array();
        throw error;
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;

    //2- method after installing it
    bcrypt.hash(password, 12)
    .then(hashedPw =>{
     
        const user = new User({
            email: email,
            password: hashedPw,
            name: name
        });
       return user.save()
    })
    .then(result => {
        res.status(201).json({
            message: "user Created",
            userId: result._id
        });

    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;//server side error
          }
          next(err);
    })


};//end of signup function


exports.login = (req, res, next) =>{
    const email = req.body.email;
    const password = req.body.password;

    let loadedUser;

    User.findOne({email: email})
    .then(user => {
        if(!user){
            const error = new Error('no founded User!');
            error.statusCode = 404;
            throw error;
        }// end of if 
        loadedUser = user;
      return  bcrypt.compare(password, user.password);//give you a promise with value true or false
    })// end of the first  then -> that found the user
    .then(isEqual => {
        if(!isEqual){ // so user enter wrong password!
            const error = new Error('Wrong password!');
            error.statusCode = 404;
            throw error;
        }//end of if 

        //I want to generate a new token
        const token = jwt.sign({
            email: loadedUser.email,
            userId: loadedUser._id.toString()
        }, 'secret', {expiresIn: '1h'}) //create a new signature and packs that into a new json web token.//secret is the key this token ends in one houer
        return res.status(200).json({token: token, userId: loadedUser._id.toString()});

    })// end of the second then
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;//server side error
          }// end of if 
          next(err);
    });// end of catch
};// end of login function