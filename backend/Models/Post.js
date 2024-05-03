const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    desc: {
        type: String,
        maxLength: 100,
        required: true
    },
    img: {
        type: String
    },
    likes: {
        type: Array,
        default: []
    },
    userId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model('Post', postSchema);