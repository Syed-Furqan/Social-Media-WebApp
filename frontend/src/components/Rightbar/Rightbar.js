import { useEffect } from 'react';
import { useSocketContext } from '../../Context/SocketContext';
import './Rightbar.css'
import OnlineFriend from '../OnlineFriend/OnlineFriend';

const Rightbar = () => {

    const { onlineFollowing } = useSocketContext()

    return (
        <div className='rightbar'>
            <div className='activeFriends'>
                <div style={{fontWeight: 'bold'}}>Active Friends</div>
                {onlineFollowing.map(friend => <OnlineFriend friend={friend} key={friend} />)}
            </div>
        </div>
    );
}

export default Rightbar;