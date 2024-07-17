const Redis = require('redis')

const redisClient = Redis.createClient({ 
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_ENDPOINT,
        port: process.env.REDIS_PORT
    }
})

redisClient.on('error', err => console.log(err))
if(!redisClient.isOpen) redisClient.connect()

module.exports = redisClient