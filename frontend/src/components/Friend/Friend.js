import { useThemeContext } from '../../Context/ThemeContext';
import './Friend.css'
import { Avatar } from '@mui/material';

const Friend = ({friend, showFriendProfile, styles}) => {

    const { dark } = useThemeContext()

    return (
        <div className={`friend ${dark && 'frienddark'}`} onClick={showFriendProfile} style={styles}>
            {friend.profilePic ? <Avatar alt="Remy Sharp" src={friend.profilePic} /> : 
            <Avatar sx={{ bgcolor: 'brown' }}>{friend.username[0]}</Avatar>}
            <div className='friendInfo'>
                <h3 style={{margin: 0}}>{friend.username}</h3>
                <p style={{margin: 0}}>{friend.email}</p>
            </div>
        </div>
    );
}

export default Friend;