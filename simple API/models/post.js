const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }


}, {timestamps: true});


//timestamps -> mongoose will then automatically add timestamps when a new version is added to the database when a new object is added to the database So we automatically get a createdAt and updatedAt timestamp out of the box then

module.exports = mongoose.model("Post", postSchema );