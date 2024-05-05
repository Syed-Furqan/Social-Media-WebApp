const router = require('express').Router()
const Message = require('../Models/Message');
const { authenticate } = require('../middleware/authenticate');

router.use(authenticate)

// Create a message
router.post('/:conversationId', async (req, res) => {
    try {
        const message = await Message.create(req.body)
        res.json(message)
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from the server"})
    }
})

// Get all messages of a conversation.
router.get('/:conversationId', async (req, res) => {
    try {
        const messages = await Message.find({conversationId: req.params.conversationId})
        res.json({messages})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from the server"})
    }
})

module.exports = router;