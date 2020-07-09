const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator/check');
const Post = require('../models/post');
const User = require('../models/user');


exports.getPosts = (req, res, next) =>{
    const currentPage = req.query.page || 1;
    const perPage = 2;
    let totalItems; // how many items in dataBase
    Post.find().countDocuments()
    .then(count => {
        totalItems = count;
       return  Post.find().skip((currentPage - 1) * perPage).limit(perPage)
    })// end of first then block
    .then(posts => {
        res.status(200).json({message:'featced ', posts: posts, totalItems: totalItems})
    })// end of then
    .catch(err=>{
        if(!err.statusCode){
            err.statusCode = 500;//server side error
          }
          next(err);
    })



}; // end of getPosts route






exports.createPost = (req, res, next) =>{
    const errors = validationResult(req); //use that validation result function on the request;
    if(!errors.isEmpty()){
        const error = new Error('Validation failed'); //1 - create the error object
        error.statusCode = 422; // 2 - set status
        throw error; // 3 - throw that error then will be catch from app.use((error, req, res, next))
    }// end of if block

    if(!req.file){
        const error = new Error('No images');
        error.statusCode = 422;
        throw error
    } 
    //if there is no Error so multer was able to extract a valid file,

    const imageUrl = req.file.path ;// path variable which multer generates which holds the path to the file as it was stored on my server
    const title = req.body.title;
    const content = req.body.content;
    let creator;

    const post = new Post({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId //that will be a string not an object but mongoose will take care about that and convert it,
    });// I don't need to set createdAt because mongoose will do that for me  I don't need to set _id because mongoose will create that for me as well.
    post.save() //to save it to the database
    .then(result => {
     return  User.findById(req.userId)
    })
    .then(user => {
        creator = user;
        user.posts.push(post)
        return user.save()
    })
    .then(result => {
        res.status(200).json({
            message: 'Post created',
            post: post,
            creator: {
                _id: creator._id,
                 name:  creator.name
            }
        }); // end of response
    })
    .catch(err =>{
      if(!err.statusCode){
        err.statusCode = 500;//server side error
      }
      next(err);
    }) // end of catch block
};// end ofcreatePost route





exports.getPost = (req, res, next) => {
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('post not found');
            error.statusCode = 404;
            throw error; //if you throw an error inside of a then block, the next catch block will be reached and that error will be passed as an error to the catch block
        } // end of if block
        res.status(200).json({message: 'post featched', post: post});
    }) // end of then block
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;//server side error
          }
          next(err);
    })
};//end of getPost function




exports.updatePost = (req, res, next) => {
    const errors = validationResult(req); //use that validation result function on the request;
    if(!errors.isEmpty()){
        const error = new Error('Validation failed'); //1 - create the error object
        error.statusCode = 422; // 2 - set status
        throw error; // 3 - throw that error then will be catch from app.use((error, req, res, next))
    }// end of if block

    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl = req.body.image;

    if(req.file){
        imageUrl = req.file.path;
    }

    if(!imageUrl){
        const error = new Error('No File picked');
        error.statusCode = 422;
        throw error;
    }

    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('post not found');
            error.statusCode = 404;
            throw error;
        }
        if(post.creator.toString() !== req.userId){
            const error = new Error('not Authorized');
            error.statusCode = 403;
            throw error;
        }
        if(imageUrl !== post.imageUrl){
            clearImage(post.imageUrl);
        }
        post.title = title;
        post.imageUrl = content;
        return post.save()
    })
    .then(result => {
        res.status(200).json({
            message: "post updated",
            post: result
        });
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;//server side error
          }
          next(err);
    });

}; //end updatePost function 



exports.deletePost = (req, res, next) =>{
    const postId = req.params.postId;
    Post.findById(postId)
    .then(post => {
        if(!post){
            const error = new Error('post not found');
            error.statusCode = 404;
            throw error;
        }
        //check loggin user
        if(post.creator.toString() !== req.userId){
            const error = new Error('not Authorized');
            error.statusCode = 403;
            throw error;
        } 
        clearImage(post.imageUrl);
        return Post.findByIdAndRemove(postId)
    })
    .then(result =>{
        //now we must clear relations
       return  User.findById(req.userId)
        
    })
    .then(user => {
        user.posts.pull(postId); //there I need to pass the ID of the post I want to remove.
        return user.save()
    })
    .then(result => {
        res.status(200).json({ message: "Deleted"});
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;//server side error
          }
          next(err);
    })
}; // end of deletePost function


const clearImage = (filePath) =>{
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log("Error in deleting file "));  //function to delete that file

};





