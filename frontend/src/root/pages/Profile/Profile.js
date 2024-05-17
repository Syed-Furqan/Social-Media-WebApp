import { useParams } from 'react-router-dom';
import './Profile.css';
import { useEffect, useState } from 'react';
import MyLoader from '../../../components/MyLoader';
import { useUserContext } from '../../../Context/UserContext';
import UserCard from '../../../components/UserCard/UserCard';
import CreatePost from '../../../components/CreatePost/CreatePost';
import UserPosts from '../../../components/UserPosts/UserPosts';

const Profile = () => {

    const { id } = useParams()
    const { user } = useUserContext()
    const [loading, setLoading] = useState(true)
    const [profileUser, setProfileUser] = useState(null)

    useEffect(() => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_BASE_URL}/api/user/${id}`, {
            method: 'GET', 
            headers: {
                "authorization": `Bearer ${user.access_token}`
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            setProfileUser(data)
            setLoading(false)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
    }, [id])

    return (   
        <>
        {loading ? <MyLoader /> : 
        <div className='profile'>
            <UserCard profileUser={profileUser} />
            <div className='profilePosts'>
                {user.id === id && <CreatePost />}
                <UserPosts profileId={id} token={user.access_token} />
            </div>
        </div>}
        </>    
    );
}

export default Profile;