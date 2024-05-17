import { useEffect, useState } from 'react';
import './ConversationsList.css'
import MyLoader from '../MyLoader';
import { useUserContext } from '../../Context/UserContext';
import Conversation from '../Conversation/Conversation';
import { IconButton, Paper } from '@mui/material';
import { useThemeContext } from '../../Context/ThemeContext';
import AddIcon from '@mui/icons-material/Add';
import Avatar from '@mui/material/Avatar';
import CloseIcon from '@mui/icons-material/Close';
import { callGetApi, callPostApi } from '../../utils/callApi';
import MyModal from '../MyModal';

const ConversationsList = ({setCurrentChat, setSelectedPanel, isTablet}) => {

    const { user } = useUserContext()
    const { dark } = useThemeContext()
    const [loading, setLoading] = useState(true)
    const [conversations, setConversations] = useState([])
    
    const [convoLoading, setConvoLoading] = useState(false)

    const [following, setFollowing] = useState([])
    const [open, setOpen] = useState(false)


    useEffect(() => {
        setLoading(true)
        fetch(`${process.env.REACT_APP_BASE_URL}/api/conversation`, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${user.access_token}`
            }
        }).then(res => res.json())
        .then(data => {
            setConversations(data.conversations)
            setLoading(false)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
    }, [user])

    const addConversation = async () => {
        setConvoLoading(true)
        try {
            const { userfollowings } = await callGetApi(`api/user/${user.id}/following`, user.access_token)
            setFollowing(userfollowings)
            setConvoLoading(false)
            setOpen(true)
        } catch (error) {
            console.log(error)
            setLoading(false)
        }
    }

    const handleConversation = async (following) => {
        try {
            setConvoLoading(true)
            const res = await callPostApi('api/conversation/', user.access_token, {userId: following._id} ,'POST')
            setCurrentChat({
                conversationId: res.id, 
                member: {id: following._id, username: following.username, profilePic: following.profilePic}
            })
            setConvoLoading(false)
            setSelectedPanel('chat')
            setOpen(false)
        } catch (error) {
            console.log(error)
            setConvoLoading(false)
            setOpen(false)
        }
    }

    return (
        <Paper className={`conversationslist ${dark && 'conversationslistdark'}`}>
            {loading ? <MyLoader /> :
            conversations.length === 0 ? <div>No Conversations Yet</div> : 
            conversations.map(con => (
                <Conversation conversation={con} key={con._id} setCurrentChat={setCurrentChat} setSelectedPanel={setSelectedPanel} isTablet={isTablet} />
            ))
            }
            <div className='addConvoIcon' >
                <IconButton onClick={addConversation}>
                    <AddIcon sx={{color: 'white'}} />
                </IconButton>
            </div>
            <MyModal open={open} close={() => setOpen(false)}>
                <div className={`convoModal ${dark && 'convoModaldark'}`}>
                    <div className='convoModalInfo'>
                        <h3 style={{margin: 0}}>Followings</h3>
                        <IconButton aria-label="close" sx={{width: '40px', height: '40px'}} className={dark ? 'closeIcondark' : ''} onClick={() => setOpen(false)} disabled={convoLoading}>
                            <CloseIcon />
                        </IconButton>
                        </div>
                    {following.map(following => (
                    <div key={following._id} className={`convofollowing ${dark && 'convofollowingdark'}`} onClick={() => handleConversation(following)}>
                        {following.profilePic ? <Avatar alt="Remy Sharp" src={following.profilePic} /> : 
                        <Avatar sx={{ bgcolor: 'brown' }}>{following.username[0]}</Avatar>}
                        <div className='convofollowingInfo'>
                            <h3 style={{margin: 0}}>{following.username}</h3>
                            <p style={{margin: 0}}>{following.email}</p>
                        </div>
                    </div>
                    ))}
                </div>
            </MyModal>
        </Paper>
    );
}

export default ConversationsList;