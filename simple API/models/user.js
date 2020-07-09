const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'I am new '
    },
    posts:[
        {
            type:  Schema.Types.ObjectId, // because will be referance to post
            ref: 'Post'
        }
    ]
    


}, {timestamps: true});


//timestamps -> mongoose will then automatically add timestamps when a new version is added to the database when a new object is added to the database So we automatically get a createdAt and updatedAt timestamp out of the box then

module.exports = mongoose.model("User", userSchema );