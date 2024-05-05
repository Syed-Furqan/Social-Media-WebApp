const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true
    },
    reciever: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true,
        maxLength: 200
    },
    conversationId: {
        type: String
    },
    sentAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model('Message', messageSchema);