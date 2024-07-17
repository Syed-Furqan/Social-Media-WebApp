import { IconButton } from '@mui/material';
import './AlertNotification.css';
import CloseIcon from '@mui/icons-material/Close';
import { useSocketContext } from '../../Context/SocketContext';
import { useNavigate } from 'react-router-dom';

const AlertNotification = ({data}) => {

    const { setNotificationAlert } = useSocketContext()
    const navigate = useNavigate()

    const handleNotification = () => {
        setNotificationAlert({status: false, data: null})
        navigate('/messages', { state: {
            conversationId: data.notificationType, 
            member: {id: data.sender._id, username: data.sender.username, profilePic: data.sender.profilePic}              
        }})
    }

    return (
        <div className='alertNotification' onClick={handleNotification}>
            <div className='alertNotificationWrapper'>
                <div style={{padding: '15px', marginRight: '40px'}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <img src={data.sender.profilePic} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%'}} />
                        <h4 style={{margin: 0, marginLeft: '10px'}}>{data.text}</h4>
                    </div>
                    <div style={{fontSize: '14px', marginTop: '10px'}}>{data.info}</div>
                </div>
                <IconButton onClick={() => setNotificationAlert({status: false, data: null})} className='notificationclosebtn'>    
                    <CloseIcon />
                </IconButton>
            </div>
        </div>
    );
}

export default AlertNotification;