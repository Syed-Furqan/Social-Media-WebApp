import { useSocketContext } from '../../../Context/SocketContext';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './Notification.css'
import { useEffect, useState } from 'react';
import { callGetApi, callPostApi } from '../../../utils/callApi';
import { useUserContext } from '../../../Context/UserContext';
import { useThemeContext } from '../../../Context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import MyLoader from '../../../components/MyLoader';

const Notification = () => {
    const { user } = useUserContext()
    const { notifications, setNotifications, setNewNotifications } = useSocketContext()
    const { dark } = useThemeContext()

    const [loading, setLoading] = useState(true)
    const [deleting, setDeleting] = useState(false)

    const navigate = useNavigate()

    useEffect(() => {
        setLoading(true)
        if(notifications.length === 0) {
            callGetApi('api/notification', user.access_token)
                .then(res => {
                    resetNotifications()
                        .then(() => {
                            setNewNotifications(0)
                            setNotifications(res.notifications)
                        })
                        .catch(err => console.log(err))
                })
                .catch(err => console.log(err))
                .finally(() => setLoading(false))
        } else {
            resetNotifications()
                .then(() => setNewNotifications(0))
                .catch(err => console.log(err))
            setLoading(false)
        }
    }, [])

    const deleteNotification = (id, e) => {
        e.stopPropagation()
        setDeleting(id)
        callPostApi(`api/notification/${id}`, user.access_token, {}, 'DELETE')
            .then(() => setNotifications(notifications.filter(not => not._id !== id)))
            .catch(err => console.log(err))
            .finally(() => setDeleting(false))
    }

    const resetNotifications = () => {
        return callPostApi('api/notification/reset', user.access_token, {}, 'PUT')
    }

    const handleNotification = (notification) => {
        navigate('/messages', { state: {
            conversationId: notification.notificationType, 
            member: {id: notification.sender._id, username: notification.sender.username, profilePic: notification.sender.profilePic}           
        }})
    }

    return (
        <div className='notifications'>
            {loading ? <MyLoader size={20} /> : 
            <>
            {notifications.map(notification => (
                <div className={`notification ${dark && 'notificationdark'}`} 
                    key={notification._id} 
                    onClick={() => handleNotification(notification)}
                >
                    <div style={{padding: '15px', marginRight: '40px'}}>
                        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                            <img src={notification.sender.profilePic} style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%'}} />
                            <h4 style={{margin: 0, marginLeft: '10px'}}>{notification.text}</h4>
                        </div>
                        <div style={{fontSize: '14px', marginTop: '10px'}}>{notification.info}</div>
                    </div>
                    <IconButton onClick={e => deleteNotification(notification._id, e)} className='notificationclosebtn' disabled={deleting === notification._id}>
                        {deleting === notification._id ? <MyLoader size={10} /> : <DeleteIcon />}    
                    </IconButton>
                </div>
            ))}
            </>
            }
        </div>
    );
}

export default Notification;