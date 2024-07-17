const router = require('express').Router()
const Message = require('../Models/Message');
const { authenticate } = require('../middleware/authenticate');
const redisClient = require('../redis/redis')

router.use(authenticate)

// Create a message
router.post('/:conversationId', async (req, res) => {
    try {
        const message = await Message.create(req.body)
        const messagesString = await redisClient.get(`messages:${req.params.conversationId}`)
        const messages = JSON.parse(messagesString)
        messages.push(message)
        await redisClient.setEx(`messages:${req.params.conversationId}`, 1800, JSON.stringify(messages))
        res.json(message)
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from the server"})
    }
})

// Get all messages of a conversation.
router.get('/:conversationId', async (req, res) => {
    try {
        // Check in cache
        const response = await redisClient.get(`messages:${req.params.conversationId}`)
        if(response) {
            console.log('CACHE HIT')
            res.json({messages: JSON.parse(response)})
        } else {
            console.log('CACHE MISS')
            const messages = await Message.find({conversationId: req.params.conversationId})
            // Store in cache
            await redisClient.setEx(`messages:${req.params.conversationId}`, 1800, JSON.stringify(messages))
            res.json({messages})
        }
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from the server"})
    }
})

module.exports = router;