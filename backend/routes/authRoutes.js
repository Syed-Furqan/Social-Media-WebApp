const router = require('express').Router()
const User = require('../Models/User')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const dotenv = require('dotenv')
const transporter = require('../utils/mail')
const NewNotifcation = require('../Models/NewNotifcation')

dotenv.config()

const userId_uuid = {}

router.post('/login', async (req, res) => {
    const {email, password} = req.body

    try {    
        const foundUser = await User.findOne({email})

        if(!foundUser) {
            res.json({status: 404, message: "Invalid Credentials"})
        } else {
            const same = await bcrypt.compare(password, foundUser.password)

            // Send Access Token
            if(same) {
                access_token = jwt.sign(foundUser._id.toJSON(), process.env.SECRET_KEY)
                res.json({access_token, id: foundUser._id, name: foundUser.username, img: foundUser.profilePic})
            } else {
                res.json({status: 404, message: "Invalid Credentials"})
            }
        }
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error From Server !!!"})
    }
})

router.post('/register', async (req, res) => {
    const {email, username, password} = req.body

    try {
        const foundUser = await User.findOne({$or: [{email}, {username}]})
    
        if(foundUser) {
            res.json({status: 404, message: "User with given credentials already exists"})
        } else {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            const user = await User.create({
                username, email, password: hashedPassword
            })
            await NewNotifcation.create({userId: user.id})
            // Send Access Token
            access_token = jwt.sign(user._id.toJSON(), process.env.SECRET_KEY)
            res.json({access_token, id: user._id, name: user.username, img: user.profilePic})
        }
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error From Server !!!"})
    }
})

router.post('/oauthgoogle', async (req, res) => {
    const { id, email, picture, name } = req.body
    
    try {
        const founduser = await User.findOne({email})
        if(!founduser) {
            // Register this user in the DB.
            const user = await User.create({
                username: name,
                email,
                profilePic: picture,
                GoogleUserId: id
            })
            await NewNotifcation.create({userId: user.id})
            access_token = jwt.sign(user._id.toJSON(), process.env.SECRET_KEY)
            res.json({access_token, id: user._id, name: user.username, img: user.profilePic})
        } else {
            if(founduser.GoogleUserId) {
                access_token = jwt.sign(founduser._id.toJSON(), process.env.SECRET_KEY)
                res.json({access_token, id: founduser._id, name: founduser.username, img: founduser.profilePic})
            } else {
                res.json({status: 404, message: "You have already created an account with this email"})
            }
        }
        
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error From Server !!!"})        
    }
})

router.post('/resetPassword', async (req, res) => {
    const { email } = req.body

    const foundUser = await User.findOne({email})

    if(!foundUser) {
        res.json({status: 404, message: "Email not registered."})
    } else {
        // Create Link
        const uuid = crypto.randomUUID()
        const token = jwt.sign({userId: foundUser._id, uuid}, process.env.SECRET_KEY)
        const resetLink = `${process.env.FRONTEND_URL}/resetPassword/${token}`

        // Send this link via mail
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Password Reset ....',
            text: resetLink
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if(err) {
                console.log(err)
                res.json({status: 500, message: "Error sending email"})
            }
            else {
                userId_uuid[foundUser._id] = uuid
                res.json({message: 'Reset Link Sent to Email'})
            }
        })
    }   
})

router.post('/checkresetlink', async (req, res) => {
    const { token } = req.body
    try {
        const { userId, uuid } = jwt.verify(token, process.env.SECRET_KEY)
        if(userId_uuid[userId]) {
            delete userId_uuid[userId]
            res.json({id: userId})
        } else {
            res.json({status: 404, message: "Link expired!"})
        }
    } catch (error) {
        res.json({status: 404, message: "Link not valid!"})
    }
})

router.post('/resetPassword/:id', async (req, res) => {
    
    const { password } = req.body
    const foundUser = await User.findById(req.params.id)

    if(!foundUser) {
        res.json({message: 'Error from server', status: 404})
    } else {
        if(foundUser.GoogleUserId) 
            res.json({message: 'This account is authenticated via google. Cannot reset its password', status: 404})
        else {
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(password, salt)
            foundUser.password = hashedPassword
            await foundUser.save()
            res.json({message: "Password changed successfully"})
        }
    }
})

module.exports = router;