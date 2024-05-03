const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const authenticate = (req, res, next) => {
    const bearer_token = req.headers.authorization
    if(bearer_token) {
        const access_token = bearer_token.split(' ')[1]
        try {
            const user = jwt.verify(access_token, process.env.SECRET_KEY)
            req.logged_user = user
            next()
        } catch (error) {
            console.error(error)
            res.json({message: "Invalid Token !", status: 500})
        }
    } else {
        res.json({message: "No Bearer Token sent !", status: 500})
    }
}

module.exports = { authenticate };