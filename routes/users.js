const mongoose = require('mongoose');
const plm = require("passport-local-mongoose");
mongoose.connect('mongodb://127.0.0.1:27017/dataassosiation');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String
    },
    post_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    }],
    createdDate: {
        type: Date,
        default: Date.now
    },
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    dp: {
        type: String,
        default: ''
    }
});

userSchema.plugin(plm);
const User = mongoose.model('User', userSchema);

module.exports = User;
