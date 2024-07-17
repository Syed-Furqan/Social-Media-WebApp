import './Post.css'
import { Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CommentIcon from '@mui/icons-material/Comment';
import MyButton from '../MyButton';
import { useEffect, useState } from 'react';
import { useUserContext } from '../../Context/UserContext';
import { useThemeContext } from '../../Context/ThemeContext';
import { dateAgo } from '../../utils/time';
import { useMediaQuery } from 'react-responsive';
import { PostSkeleton } from '../Skeletons';


const Post = ({ post }) => {

    const { user } = useUserContext()
    const { dark } = useThemeContext()
    const [loading, setLoading] = useState(true)
    const [postUser, setPostUser] = useState(null)
    const [liking, setLiking] = useState(false)
    const [isLiked, setIsLiked] = useState(post.likes.includes(user.id))
    const [totalLikes, setTotalLikes] = useState(post.likes.length)

    const isSmallDevice = useMediaQuery({query: '(max-width: 430px)'})

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BASE_URL}/api/user/${post.userId}`, {
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
        fetch(`${process.env.REACT_APP_BASE_URL}/api/post/${post._id}/${like}`, {
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

    const avatarStyles = {
        width: isSmallDevice ? '40px' : '50px',
        height: isSmallDevice ? '40px' : '50px'
    }

    return (
        <>
        {loading ? <PostSkeleton /> : 
        <Card className={`Post ${dark && 'Postdark'}`}>
            <CardHeader
                avatar={
                postUser.profilePic ? <Avatar alt="Remy Sharp" src={postUser.profilePic} sx={avatarStyles}/> : 
                <Avatar sx={{ bgcolor: 'brown' }}>{postUser.username[0]}</Avatar>
                }
                action={
                postUser._id === user.id &&
                <IconButton aria-label="postsettings">
                    <MoreVertIcon />
                </IconButton>
                }
                title={<p style={{fontWeight: 'bold', fontSize: isSmallDevice ? '14px' : '18px', margin: '0'}}>
                    {postUser.username}
                </p>}
                subheader={<span className={`time ${dark && 'timedark'}`}>{dateAgo(Date.parse(post.createdAt))}</span>}
            />
            <div style={{padding: '0 16px'}}>
                {post.img && 
                <CardMedia
                    component="img"
                    height={`${isSmallDevice ? '250px' : '300px'}`}
                    image={post.img}
                    alt="Paella dish"
                    sx={{borderRadius: '4px'}}
                />}
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