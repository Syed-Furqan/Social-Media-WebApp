import { useState, useEffect } from 'react';
import './UserPosts.css';
import MyLoader from '../MyLoader';
import Post from '../Post/Post';

const UserPosts = ({profileId, token}) => {

    const [loading, setLoading] = useState(true)
    const [posts, setPosts] = useState([])

    useEffect(() => {
        console.log(profileId)
        fetch(`${process.env.REACT_APP_BASE_URL}/api/post/${profileId}/posts`, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${token}`
            }
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            setPosts(data.userposts)
            setLoading(false)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
    }, [profileId])

    return (
        <div className='userposts'>
            {loading ? <MyLoader /> : 
            posts.length === 0 ?  <p>No Posts Yet </p> :
            posts.map(post => <div className='userpost' key={post._id}><Post post={post} /></div>)
            }
        </div>
    );
}

export default UserPosts;