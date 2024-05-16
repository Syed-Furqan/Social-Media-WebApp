import { useEffect, useState } from 'react';
import './Conversation.css';
import { useUserContext } from '../../Context/UserContext';
import MyLoader from '../MyLoader';
import { Avatar } from '@mui/material';
import { useThemeContext } from '../../Context/ThemeContext';

const Conversation = ({conversation, setCurrentChat, setSelectedPanel}) => {

    const { user } = useUserContext()
    const { dark } = useThemeContext()
    const [loading, setLoading] = useState(true)
    const [member, setMember] = useState(null)

    useEffect(() => {
        const memberId = getMemberId()
        fetch(`http://localhost:2000/api/user/${memberId}`, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${user.access_token}`
            }
        }).then(res => res.json())
        .then(data => {
            console.log(data)
            setMember(data)
            setLoading(false)
        })
        .catch(err => {
            console.error(err)
            setLoading(false)
        })
    }, [user])

    const getMemberId = () => {
        if(conversation.members[0] !== user.id) 
            return conversation.members[0]
        return conversation.members[1]
    }

    const handleConversation = () => {
        setSelectedPanel('chat')
        setCurrentChat({
            conversationId: conversation._id, 
            member: {id: member._id, username: member.username, profilePic: member.profilePic}
        })
    }

    return (
        <>
            {loading ? <MyLoader /> : 
            <div onClick={handleConversation} className={`conversation ${dark && 'conversationdark'}`}>
                {member.profilePic ? <Avatar alt="Remy Sharp" src={member.profilePic} /> : 
                <Avatar sx={{ bgcolor: 'brown' }}>{member.username[0]}</Avatar>}
                <div className='conversationInfo'>
                    <h3 style={{margin: 0}}>{member.username}</h3>
                    <p style={{margin: 0}}>{member.email}</p>
                </div>
            </div>
            }
        </>
    );
};

export default Conversation;