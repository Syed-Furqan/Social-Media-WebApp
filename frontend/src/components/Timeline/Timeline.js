import './Timeline.css'
import Post from '../Post/Post';

const Timeline = ({timelinePosts}) => {
    return (
        <div className='timeline'>
            {timelinePosts.map(post => (
                <div className='timelinePost' key={post._id}>
                    <Post post={post} />
                </div>
            ))}
        </div>
    );
}

export default Timeline;