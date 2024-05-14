import { useEffect, useState } from 'react';
import { useSocketContext } from '../../Context/SocketContext';
import './Rightbar.css'
import OnlineFriend from '../OnlineFriend/OnlineFriend';
import { useUserContext } from '../../Context/UserContext';
import MyLoader from '../MyLoader';
import { useNavigate } from 'react-router-dom'
import Mostpopular from '../MostPopular/Mostpopular';
import { useThemeContext } from '../../Context/ThemeContext';

const Rightbar = () => {

    const { onlineFollowing } = useSocketContext()
    const { user } = useUserContext()
    const { dark } = useThemeContext()

    const [followings, setFollowings] = useState([])
    const [mostpopular, setMostPopular] = useState([])
    const [ploading, setPloading] = useState(true)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        fetch(`http://localhost:2000/api/user/${user.id}/followingOnline`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${user.access_token}`
            },
            body: JSON.stringify({onlineFollowing})
        }).then(res => res.json())
        .then(data => {
            setFollowings(data.onlinefollowings)
            setLoading(false)
        }).catch(err => {
            console.log(err)
            setLoading(false)
        })
    }, [onlineFollowing, user])

    useEffect(() => {
        setPloading(true)
        fetch(`http://localhost:2000/api/user/mostpopular`, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${user.access_token}`
            }
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            setMostPopular(data.popular)
            setPloading(false)
        }).catch(err => {
            console.log(err)
            setPloading(false)
        })
    }, [user])

    const showProfile = (id => {
        navigate(`/profile/${id}`)
    })

    return (
        <div className={`rightbar ${dark && 'rightbardark'}`}>
            <div className='mostPopular'>
                <div style={{fontWeight: 'bold', marginBottom: '20px', color: '#686868'}}>Most Popular</div>
                {ploading ? <MyLoader /> : 
                <div>
                    {mostpopular.map(popular => (
                        <Mostpopular popular={popular} key={popular._id} showpopularProfile={() => showProfile(popular._id)} />
                    ))}
                </div>
                }
            </div>
            <div className='activeFriends'>
                <div style={{fontWeight: 'bold', marginBottom: '20px', color: '#686868'}}>Active Following</div>
                {loading ? <MyLoader /> : 
                <div>
                    {followings.map(following => (
                    <OnlineFriend following={following} key={following._id} showFollowingProfile={() => showProfile(following._id)} />
                    ))}
                </div>
                }
            </div>
        </div>
    );
}

export default Rightbar;