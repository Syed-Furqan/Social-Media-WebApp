import './OnlineFriend.css'
import { Avatar } from '@mui/material';

const OnlineFriend = ({following, showFollowingProfile}) => {
    return (
        <div className="following" onClick={showFollowingProfile}>
            {following.profilePic ? <Avatar alt="Remy Sharp" src={following.profilePic} sx={{width: '40px', height: '40px'}}/> : 
            <Avatar sx={{ bgcolor: 'brown' }}>{following.username[0]}</Avatar>}
            <div className='followingInfo'>
                <h4 style={{margin: 0}}>{following.username}</h4>
            </div>
            <div style={{width: '10px', height: '10px', backgroundColor: 'green', borderRadius: '50%'}}></div>
        </div>
    );
}

export default OnlineFriend;