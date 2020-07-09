const express = require('express');  // npm install --save express
const app = express(); //I want to create my express app by executing express as a function
const mongoose = require('mongoose'); // sudo npm install --save mongoose 1 -- importimg monggose 2 --- mongoose.connect().then().catch() 3 -- go to make schema 4 -- use schema 5;
const bodyParser = require('body-parser');
const path = require('path');
//1- npm install --save multer this module for file uplods
const multer = require('multer'); //2- import it
const feedRoutes = require('./routes/feed');
const authRoutes = require('./routes/auth');


app.use(bodyParser.json()); //we want to use body parser with the json method which is able to parse json data from incoming
app.use('/images', express.static(path.join(__dirname, 'images')));// any request that goes to /images -- __dirname globally in node.js gives us access to the directory path to that file


//3- I will configure the file storage
const fileStorage = multer.diskStorage({
    destination : (req, file, cb) => { //the destination means where do you wabt to store the images
        cb(null, 'images');
        
    },
    filename: (req, file, cb) => {
        cb(null, new Date().toISOString()+'-'+file.originalname);
    }
});
//4- file filter

const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        cb(null, true);
    }else{
        cb(null, false);
    }
};

//5- register multer
app.use(multer({storage: fileStorage, fileFilter: fileFilter}).single('image')); //single('image') -> Accept a single file with the name image. The single file will be stored in req.file.







// configuration to allow acces
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // allow to all endpoints to access 
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');  // allow to all endpoints to access  to dp thers methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); 
    next();
});





//routes
app.use('/feed',feedRoutes); // any incoming request that starts with /feed will make it into feed routes,
app.use('/auth',authRoutes);
// error middleware
app.use((error, req, res, next)=> {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({message: message, data: data});
})



//connection feailed //
const Url = 'mongodb+srv://mohammed:5UhPoeheFLa6i2wx@cluster0-1ihst.mongodb.net/messages?retryWrites=true&w=majority';
mongoose.connect(Url)
.then(result => {
    console.log('connection succeeded');
    app.listen(8080);
})
.catch(err => {
    console.log('connection Failed')
})
