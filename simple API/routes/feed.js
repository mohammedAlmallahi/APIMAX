const express = require('express');
const router = express.Router();
const feedController = require('../controller/feed');
const {body} = require('express-validator/check');
const isAuth = require('../middleware/is-auth');

router.get('/posts', isAuth, feedController.getPosts); // this route to get all posts at once

router.post('/post',isAuth,
[
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})

]
,feedController.createPost);

router.get('/post/:postId', isAuth,feedController.getPost); //we'll encode the ID of the post we want to fetch in the url.
router.put('/post/:postId', isAuth,
[
    body('title').trim().isLength({min: 5}),
    body('content').trim().isLength({min: 5})

]
,feedController.updatePost);// also have a request body also have parameters

router.delete('/post/:postId', isAuth,feedController.deletePost); //there is no body here
module.exports = router;