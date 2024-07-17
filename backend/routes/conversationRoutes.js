const router = require('express').Router()
const Conversation = require('../Models/Conversation')
const { authenticate } = require('../middleware/authenticate')

router.use(authenticate)

// Create a new conversation.
router.post('/' , async (req, res) => {
    try {
        const foundConversation = await Conversation.findOne({members: { $all: [req.logged_user, req.body.userId] }})
        if(foundConversation) {
            res.json({status: 404, message: `Already a conversation with: ${req.body.userId}`, _id: foundConversation._id})
        } else {
            const conversation = await Conversation.create({
                members: [req.logged_user, req.body.userId]
            })
            res.json(conversation)
        }
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from server"})
    }
})

// Get all the conversations of a user
router.get('/', async (req, res) => {
    try {
        const conversations = await Conversation.find({members: {$in: [req.logged_user]}})
        res.json({conversations: conversations})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from server"})
    }
})

module.exports = router;