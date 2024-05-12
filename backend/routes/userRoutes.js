const User = require('../Models/User')
const bcrypt = require('bcryptjs')
const { authenticate } = require('../middleware/authenticate')

const router = require('express').Router()

router.use(authenticate)

// Get most popular users.
router.get('/mostpopular', async (req, res) => {
    try {
        const popular = await User.aggregate().addFields({'length': {'$size': '$followers'}}).sort({'length': -1}).limit(5)
        res.json({popular: popular.map(item => ({_id: item._id, username: item.username, profilePic: item.profilePic, length: item.length}))})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from server"})
    }
})

// Get a user.
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(user) {
            res.json(user)
        } else {
            res.json({status: 403, message: "User not Found"})
        }
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from server"})
    }
})

// Get a user where username starts with 'name'
router.get('/getUsers/:name', async (req, res) => {
    try {
        const users = await User.find({username: { $regex : `^${req.params.name}`, $options: 'i'}}).select('username email profilePic')
        res.json({users})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from server"})
    }
})

// Update a user.
router.put('/:id', async (req, res) => {
    const user = req.body

    if(req.logged_user === req.params.id) {
        try {
            if(user.password) {
                const salt = await bcrypt.genSalt(10)
                const hashedPassword = await bcrypt.hash(user.password, salt)
                user.password = hashedPassword
            }
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {...user}, {new: true})
            res.json(updatedUser)
        } catch (error) {
            console.error(error)
            res.json({status: 500, message: "Error from server"})
        }
    } else {
        res.json({status: 600, message: "You can only update your information !"})
    }
})

// Delete a user.
router.delete('/:id', async (req, res) => {
    if(req.logged_user === req.params.id) {
        try {
            const resp = await User.findByIdAndDelete(req.params.id)
            if(resp) {
                res.json(`Deleted User ${resp.username}`)
            } else {
                res.json({status: 403, message: "User not found"})
            }
        } catch (error) {
            console.error(error)
            res.json({status: 500, message: "Error from server"})
        }
    } else {
        res.json({status: 600, message: "You can only delete your account !"})
    }
})

// Follow a user.
router.put('/follow/:id', async (req, res) => {
    const logged_user_id = req.logged_user
    if(logged_user_id === req.params.id) {
        res.json({message: "You cannot follow yourself"})
    } else {
        try {
            const following_user = await User.findByIdAndUpdate(req.params.id)
            const logged_user = await User.findByIdAndUpdate(logged_user_id)
            if(following_user && logged_user) {
                // Check for already following.
                if(following_user.followers.includes(logged_user_id)) {
                    res.json({message: `Already following ${following_user.username}`})
                } else {
                    // Update the following and followers arrays.
                    following_user.followers.push(logged_user_id)
                    logged_user.following.push(req.params.id)
        
                    // Save both the users.
                    await following_user.save()
                    await logged_user.save()
                    res.json({message: `Following user ${following_user.username}`})
                }
            } else {
                res.json({status: 403, message: "User not Found"})
            }
        } catch (error) {
            console.error(error)
            res.json({status: 500, message: "Error from server"})
        }
    }
})

// Unfollow a user.
router.put('/unfollow/:id', async (req, res) => {
    const logged_user_id = req.logged_user

    if(logged_user_id === req.params.id) {
        res.json({message: "You cannot follow yourself"})
    } else {
        try {
            const unfollowing_user = await User.findByIdAndUpdate(req.params.id)
            const logged_user = await User.findByIdAndUpdate(logged_user_id)
            if(unfollowing_user && logged_user) {
                // Check for already unfollowed.
                if(!unfollowing_user.followers.includes(logged_user_id)) {
                    res.json({message: `Not following ${unfollowing_user.username}`})
                } else {
                    // Update the following and followers arrays.
                    unfollowing_user.followers = unfollowing_user.followers.filter(userId => userId != logged_user_id)
                    logged_user.following = logged_user.following.filter(userId => userId != req.params.id)
        
                    // Save both the users.
                    await unfollowing_user.save()
                    await logged_user.save()
                    res.json({message: `UnFollowed user ${unfollowing_user.username}`})
                }

            } else {
                res.json({status: 403, message: "User not Found"})
            }
        } catch (error) {
            console.error(error)
            res.json({status: 500, message: "Error from server"})
        }
    }
})

// Get the followers of a user.
router.get('/:userId/followers', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const userfollowers = []
        const followers = await Promise.all(user.followers.map(follower => User.findById(follower).select('username email profilePic')))
        res.json({userfollowers: userfollowers.concat(...followers)})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from server"})
    }    
})

// Get the following of a user.
router.get('/:userId/following', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        const userfollowings = []
        const followings = await Promise.all(user.following.map(following => User.findById(following).select('username email profilePic')))
        res.json({userfollowings: userfollowings.concat(...followings)})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from server"})
    }    
})

// Get the online following of a user.
router.post('/:userId/followingOnline', async (req, res) => {
    const onlineFollowing = req.body.onlineFollowing
    try {
        const onlinefollowings = []
        const followings = await Promise.all(onlineFollowing.map(following => User.findById(following).select('username profilePic')))
        res.json({onlinefollowings: onlinefollowings.concat(...followings)})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from server"})
    }    
})

module.exports = router;