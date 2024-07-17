const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    text: String,
    info: String,
    notificationType: mongoose.Schema.Types.ObjectId,
    opened: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('Notification', notificationSchema)