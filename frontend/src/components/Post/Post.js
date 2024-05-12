import './Post.css'
import { Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import MyButton from '../MyButton';
import { useEffect, useState } from 'react';
import MyLoader from '../MyLoader';
import { useUserContext } from '../../Context/UserContext';
import { dateAgo } from '../../utils/time';

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
                postUser.profilePic ? <Avatar alt="Remy Sharp" src={postUser.profilePic} sx={{width: '50px', height: '50px'}}/> : 
                <Avatar sx={{ bgcolor: 'brown' }}>{postUser.username[0]}</Avatar>
                }
                action={
                postUser._id === user.id &&
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton>
                }
                title={<p style={{fontWeight: 'bold', fontSize: '18px', margin: '0'}}>{postUser.username}</p>}
                subheader={dateAgo(Date.parse(post.createdAt))}
            />
            <div style={{padding: '0 16px'}}>
                <CardMedia
                    component="img"
                    height="300"
                    image={post.img}
                    alt="Paella dish"
                    sx={{borderRadius: '4px'}}
                />
            </div>
            <CardContent>
                {post.desc}
            </CardContent>
            <CardActions className='cardactions'>
                <IconButton aria-label="like" 
                    style={{width: '40px', height: '40px'}}
                    onClick={likeUnlikePost}
                    disabled={liking || post.userId === user.id}
                >
                    <FavoriteIcon sx={{color: isLiked || post.userId === user.id ? 'red' : 'gray', width: '100%', height: '100%'}} />
                </IconButton>
                <div style={{marginRight: '25px', marginLeft: '0'}}>{totalLikes}</div>
                <MyButton variant='outlined' startIcon={<CommentIcon />}>Comments</MyButton>
            </CardActions>
        </Card>}
        </>
    );
}

export default Post;