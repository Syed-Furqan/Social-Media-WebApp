const mongoose = require('mongoose');

const newNotificationSchema = new mongoose.Schema({
    count: {
        type: Number,
        default: 0
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('NewNotificaiton', newNotificationSchema)