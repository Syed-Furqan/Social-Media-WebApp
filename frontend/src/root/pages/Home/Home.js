import './Home.css';
import { useEffect, useState } from 'react'
import Timeline from '../../../components/Timeline/Timeline';
import MyLoader from '../../../components/MyLoader';
import CreatePost from '../../../components/CreatePost/CreatePost';
import { useUserContext } from '../../../Context/UserContext';
import Rightbar from '../../../components/Rightbar/Rightbar';

const Home = () => {

    const { user } = useUserContext()

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({message: '', status: false})

    const [timelinePosts, settimelinePosts] = useState([])

    useEffect(() => {
        fetch('http://localhost:2000/api/post/timeline', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${user.access_token}`
            }
        }).then(res => res.json())
        .then(data => {
            if(data?.status === 500) 
                setError({message: data.message, status: true})
            else {
                settimelinePosts(data.timelinePosts)
            }
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
            setError({message: 'Error from Server', status: true})
        })
    }, [user.access_token])

    return (
        <div className='Home'>
            <div className='timelineWrapper'>
                {loading ? <MyLoader size={50} /> : 
                <>
                    <CreatePost />
                    {error.status ? <p>{error.message}</p> : 
                        timelinePosts.length !== 0 ? <Timeline timelinePosts={timelinePosts} /> : <p>No Timeline Posts</p>
                    }
                </>
                }
            </div>
            <Rightbar />
        </div>
    );
}

export default Home;