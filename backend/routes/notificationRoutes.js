const router = require('express').Router()
const NewNotifcation = require('../Models/NewNotifcation')
const Notification = require('../Models/Notification')
const { authenticate } = require('../middleware/authenticate')

router.use(authenticate)

router.get('/new', async (req, res) => {
    try {
        const newnot = await NewNotifcation.findOne({userId: req.logged_user})
        res.json({count: newnot.count})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Unable to retrieve new notifications."}) 
    }
})

router.put('/reset', async (req, res) => {
    try {
        const newnot = await NewNotifcation.findOne({userId: req.logged_user})
        newnot.count = 0
        await newnot.save()
        res.json({message: "Notifications reset."})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Unable to reset notifications."}) 
    }
})

router.get('/', async (req, res) => {
    try {
        const notifications = await Notification.find({reciever: req.logged_user}).sort({'createdAt': -1}).populate('sender', 'username email profilePic')
        res.json({notifications})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Unable to retrieve notifications."})   
    }
})

router.post('/', async (req, res) => {
    const { notification } = req.body

    try {
        const createdNotification = await (await Notification.create(notification)).populate('sender', 'username email profilePic')
        const newnot = await NewNotifcation.findOne({userId: notification.reciever})
        newnot.count = newnot.count + 1
        await newnot.save()
        res.json({notification: createdNotification})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Unable to save notification"})   
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id)
        if(req.logged_user === notification.reciever.toString()) {
            await notification.deleteOne()
            res.json({message: "Notification Deleted"})
        } else {
            res.json({status: 600, message: "You can only delete your notification !"})
        }
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Unable to delete notification"})  
    }
})

module.exports = router;