import { useEffect, useState } from 'react';
import './ConversationsList.css'
import MyLoader from '../MyLoader';
import { useUserContext } from '../../Context/UserContext';
import Conversation from '../Conversation/Conversation';
import { Paper } from '@mui/material';
import { useThemeContext } from '../../Context/ThemeContext';

const ConversationsList = ({setCurrentChat}) => {

    const { user } = useUserContext()
    const { dark } = useThemeContext()
    const [loading, setLoading] = useState(true)
    const [conversations, setConversations] = useState([])
    

    useEffect(() => {
        fetch('http://localhost:2000/api/conversation', {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${user.access_token}`
            }
        }).then(res => res.json())
        .then(data => {
            console.log(data.conversations)
            setConversations(data.conversations)
            setLoading(false)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
    }, [user])

    return (
        <Paper className={`conversationslist ${dark && 'conversationslistdark'}`}>
            {loading ? <MyLoader /> :
            conversations.length === 0 ? <div>No Conversations Yet</div> : 
            conversations.map(con => (
                <Conversation conversation={con} key={con._id} setCurrentChat={setCurrentChat} />
            ))
            }
        </Paper>
    );
}

export default ConversationsList;