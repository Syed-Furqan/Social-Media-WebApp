import './Home.css';
import { useEffect, useState } from 'react'
import Timeline from '../../../components/Timeline/Timeline';
import MyLoader from '../../../components/MyLoader';
import CreatePost from '../../../components/CreatePost/CreatePost';
import { useUserContext } from '../../../Context/UserContext';
import Rightbar from '../../../components/Rightbar/Rightbar';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useMediaQuery } from 'react-responsive';
import { useOutletContext } from 'react-router-dom';

const Home = () => {

    const rightbarOpen = useOutletContext()
    const { user } = useUserContext()

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState({message: '', status: false})

    const [page, setPage] = useState(0)
    const [hasMore, setHasMore] = useState(true)

    const [timelinePosts, settimelinePosts] = useState([])

    const isMobile = useMediaQuery({query: '(max-width: 800px)'})

    const getMorePosts = () => {
        fetch(`http://localhost:2000/api/post/timeline?page=${page}`, {
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
                if(data.timelinePosts.length === 0) {
                    setHasMore(false)
                } else {
                    settimelinePosts(prev => [...prev, ...data.timelinePosts])
                    setPage(prev => prev + 1)
                }
                
            }
            console.log(data)
            setLoading(false)
        })
        .catch(err => {
            setLoading(false)
            setError({message: 'Error from Server', status: true})
        })
    }

    useEffect(() => {
        getMorePosts()
    }, [user.access_token])

    return (
        <div className='Home'>
            <div id='timelineWrapper'>
                {loading ? <MyLoader size={50} /> : 
                <>
                    <CreatePost />
                    {error.status ? <p>{error.message}</p> : 
                        timelinePosts.length === 0 && <p>No Timeline Posts</p>
                    }
                    <InfiniteScroll 
                        dataLength={timelinePosts.length} 
                        next={getMorePosts} 
                        hasMore={hasMore} 
                        loader={<MyLoader />}
                        scrollableTarget='timelineWrapper'
                        className='infiniteScroll'
                    >
                        <Timeline timelinePosts={timelinePosts} />
                    </InfiniteScroll>
                </>
                }
            </div>
            {(!isMobile || isMobile && rightbarOpen) && <Rightbar rightbarOpen={rightbarOpen} />}
        </div>
    );
}

export default Home;