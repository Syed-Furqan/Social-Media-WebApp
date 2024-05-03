const Post = require('../Models/Post')
const User = require('../Models/User')
const { authenticate } = require('../middleware/authenticate')

const router = require('express').Router()

router.use(authenticate)

// Get timeline Posts.
router.get('/timeline', async (req, res) => {
    try {
        const user = await User.findById(req.logged_user)
        const following = user.following
    
        const posts = await Promise.all(following.map(f_id => (
            Post.find({userId: f_id})
        )))
        const timelinePosts = []
        res.json({timelinePosts: timelinePosts.concat(...posts)})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Unable to retrieve Timeline Posts."})
    }
})

// Get a Post.
router.get('/:id', async (req, res) => {
    const post = await Post.findById(req.params.id)
    try {
        if(post) {
            res.json(post)
        } else {
            res.json({status: 403, message: "Post not found"})
        }
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from server"})
    }
})

// Create a Post.
router.post('/', async (req, res) => {
    const post = req.body

    if(req.logged_user === post.userId) {
        try {
            const createdPost = await Post.create({...post})
            const user = await User.findById(req.logged_user)
            user.posts.push(createdPost._id)
            await user.save()
            res.json({message: "Post Shared."})
        } catch (error) {
            console.error(error)
            res.json({status: 500, message: "Unable to create Post"})
        }
    } else {
        res.json({status: 600, message: "You can only create post for yourself !"})
    }
})

// Update a Post.
router.put('/:id', async (req, res) => {
    const post = req.body
    try {
        const foundPost = await Post.findById(req.params.id)
        if(foundPost) {
            if(req.logged_user === foundPost.userId) {
                await foundPost.updateOne({...post})
                res.json({message: "Post Updated."})
            } else {
                res.json({status: 600, message: "You can only update your post !"})
            }
        } else {
            res.json({status: 403, message: "Post not found"})
        }
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Unable to update post."})
    }
})

// Delete a Post.
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(post) {
            if(req.logged_user === post.userId) {
                await post.deleteOne()
                res.json({message: "Post Deleted"})
            } else {
                res.json({status: 600, message: "You can only delete your post !"})
            }
        } else {
            res.json({status: 403, message: "Post not found"})
        }
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Unable to delete post."})
    }
})

// Like a Post.
router.put('/:id/like', async (req, res) => {
    const logged_user_id = req.logged_user

    try {
        const post = await Post.findById(req.params.id)
        if(post) {
            if(post.userId === logged_user_id) {
                res.json({message: `Cannot Like your own Post`})
            } else if (post.likes.includes(logged_user_id)) {
                res.json({message: `Already Liked post`})
            } else {
                post.likes.push(logged_user_id)
                await post.save()
                res.json({message: "Post Liked"})
            }
        } else {
            res.json({status: 403, message: "Post not found"})
        }
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Unable to like post."})
    }
})

// Unlike a Post.
router.put('/:id/unlike', async (req, res) => {
    const logged_user_id = req.logged_user

    try {
        const post = await Post.findById(req.params.id)
        if(post) {
            if(post.userId === logged_user_id) {
                res.json({message: `Cannot Unlike your own Post`})
            } else if (!post.likes.includes(logged_user_id)) {
                res.json({message: `Already Unliked post`})
            } else {
                post.likes= post.likes.filter(id => logged_user_id !== id)
                await post.save()
                res.json({message: "Post Unliked"})
            }
        } else {
            res.json({status: 403, message: "Post not found"})
        }
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Unable to unlike post."})
    }
})

// Get all posts of a user
router.get('/:userId/posts', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
        
        const posts = await Promise.all(user.posts.map(postId => Post.findById(postId)))
        const userposts = []

        return res.json({userposts: userposts.concat(...posts)})
    } catch (error) {
        console.error(error)
        res.json({status: 500, message: "Error from server"})
    }
})

module.exports = router;