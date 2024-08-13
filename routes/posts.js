const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    imageText: {
        type: String,
        required: true
    },
    image:{
        type:String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createDate: {
        type: Date,
        default: Date.now
    },
    likesCount: {
        type: Number,
        default: 0
    }
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;
