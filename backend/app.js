const express = require('express')
const app = express()

const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')

dotenv.config()

// Socket Server
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000'
    }
})

io.on('connection', (socket) => {
    console.log(`User with socket ID: ${socket.id} connected`)

    // Rest of the events go here.
    socket.on('disconnect', () => {
        console.log(`User with socket ID: ${socket.id} disconnected`)
    })
})

mongoose.connect(process.env.MONGO_DB_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log(err))

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)
app.use('/api/post', postRoutes)


server.listen(2000, () => {
    console.log("Server has started.")
})