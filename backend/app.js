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

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err))


// Socket Server
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

const online_users = {}

io.on('connection', (socket) => {
    // Push User to online_users hashmap.
    const userId = socket.handshake.query.userId
    console.log(`User with socket ID: ${socket.id} and User ID: ${userId} connected`)
    online_users[userId] = socket.id
    
    // Send message to specific user.
    socket.on('sendMessage', (data) => {
        console.log(data)
        const recieverSID = online_users[data.reciever]
        console.log(recieverSID)
        io.to(recieverSID).emit('recieveMessage', data)
    })

    socket.on('disconnect', () => {
        // Remove user from online_users hashmap
        console.log(`User with socket ID: ${socket.id} disconnected`)
        delete online_users[userId]
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