import './Post.css'
import { Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import MyButton from '../MyButton';
import { useEffect, useState } from 'react';
import MyLoader from '../MyLoader';
import { useUserContext } from '../../Context/UserContext';

const Post = ({post}) => {

    const { user } = useUserContext()
    const [loading, setLoading] = useState(true)
    const [postUser, setPostUser] = useState(null)
    const [liking, setLiking] = useState(false)
    const [isLiked, setIsLiked] = useState(post.likes.includes(user.id))
    const [totalLikes, setTotalLikes] = useState(post.likes.length)

    useEffect(() => {
        fetch(`http://localhost:2000/api/user/${post.userId}`, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${user.access_token}`
            }
        }).then(res => res.json())
        .then(user => {
            setPostUser(user)
            setLoading(false)
        })
        .catch(err => {
            console.error(err)
            setLoading(false)
        })
    }, [])

    const likeUnlikePost = () => {
        setLiking(true)
        const like = isLiked ? 'unlike' : 'like'
        fetch(`http://localhost:2000/api/post/${post._id}/${like}`, {
            method: 'PUT',
            headers: {
                "authorization": `Bearer ${user.access_token}`
            }
        }).then(res => res.json())
        .then(data => {
            setTotalLikes(totalLikes =>  isLiked ? totalLikes - 1 : totalLikes + 1)
            setIsLiked(isLiked => !isLiked)
            setLiking(false)
        })
        .catch(err => {
            console.error(err)
            setLiking(false)
        })
    }

    return (
        <>
        {loading ? <MyLoader size={20} /> : 
        <Card className='Post'>
            <CardHeader
                avatar={
                <Avatar sx={{ bgcolor: 'green' }} aria-label="postUserImg">
                    {postUser.username[0]}
                </Avatar>
                }
                action={
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton>
                }
                title={postUser.username}
                subheader={post.createdAt}
            />
            <div>
                <CardMedia
                    component="img"
                    height="300"
                    image={post?.img}
                    alt="Paella dish"
                />
            </div>
            <CardContent>
                {post.desc}
            </CardContent>
            <CardActions className='cardactions'>
                <IconButton aria-label="like" style={{display: post.userId === user.id ? 'none' : 'block'}}
                    onClick={likeUnlikePost}
                    disabled={liking}
                >
                    <FavoriteIcon sx={{color: isLiked ? 'red' : 'gray'}} />
                </IconButton>
                <div style={{marginRight: '15px'}}>{totalLikes} likes</div>
                <MyButton variant='outlined' startIcon={<CommentIcon />}>Comments</MyButton>
            </CardActions>
        </Card>}
        </>
    );
}

export default Post;