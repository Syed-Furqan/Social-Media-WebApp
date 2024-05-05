const mongoose = require('mongoose')

const conversationSchema = new mongoose.Schema({
    members: {
        type: Array(2)
    }
})

module.exports = mongoose.model('Conversation', conversationSchema);