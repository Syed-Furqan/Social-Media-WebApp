const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String, 
        required: true,
        maxLength: 25,
        unique: true
    },
    email: {
        type: String,
        required: true,
        maxLength: 30,
        unique: true
    },
    password: {
        type: String,
    },
    profilePic: {
        type: String,
        default: ''
    },
    followers: {
        type: Array,
        default: []
    },
    following: {
        type: Array,
        default: []
    },
    posts: {
        type: Array,
        default: []
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    GoogleUserId: {
        type: String,
        default: null
    }
})

module.exports = mongoose.model('User', userSchema);