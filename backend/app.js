const express = require('express')
const app = express()

const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')
const conversationRoutes = require('./routes/conversationRoutes')
const messageRoutes = require('./routes/messageRoutes')

dotenv.config()

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const User = require('./Models/User')

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err))


// Socket Server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

let online_users = {} // Mapping of users -> socket_ids
let online_friends = {} // Mapping of users -> followings

io.on('connection', async (socket) => {
    // Push User to online_users hashmap.
    const userId = socket.handshake.query.userId
    console.log(`User with socket ID: ${socket.id} and User ID: ${userId} connected`)
    online_users[userId] = socket.id

    // Get User from DB.
    const user = await User.findById(userId).select('following followers')
    
    online_following = user.following.filter(following => following in online_users)
    online_friends[userId] = online_following
    io.to(socket.id).emit('getOnlineFollowing', {online_following})

    // Send an event to online followers of this user.
    user.followers.map(follower => {
        if(follower in online_users) {
            online_friends[follower] = [...online_friends[follower], userId]
            io.to(online_users[follower]).emit('getOnlineFollowing', {online_following: online_friends[follower]})
        }
    })

    // Send message to specific user.
    socket.on('sendMessage', (data) => {
        const recieverSID = online_users[data.reciever]
        io.to(recieverSID).emit('recieveMessage', data)
    })

    socket.on('disconnect', async () => {
        // Remove user from online_users and online_friends hashmap
        console.log(`User with socket ID: ${socket.id} disconnected`)
        delete online_users[userId]
        delete online_friends[userId]

        // Send an event to all online followers of this user.
        user.followers.map(follower => {
            if(follower in online_users) {
                online_friends[follower] = online_friends[follower].filter(friend => friend !== userId)
                io.to(online_users[follower]).emit('getOnlineFollowing', {online_following: online_friends[follower]})
            }
        })
    })
})


// Api Server
app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)
app.use('/api/conversation', conversationRoutes)
app.use('/api/message', messageRoutes)


server.listen(2000, () => {
    console.log("Server has started.")
});