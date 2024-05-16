import './Chat.css'
import { Paper, Avatar, IconButton, InputBase} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useRef, useState } from 'react';
import { useSocketContext } from '../../Context/SocketContext';
import { useUserContext } from '../../Context/UserContext';
import { useThemeContext } from '../../Context/ThemeContext';
import MyLoader from '../MyLoader';
import UserChat from '../UserChat/UserChat';

const Chat = ({currentChat, setCurrentChat}) => {

    const { user } = useUserContext()
    const { socket } = useSocketContext()
    const { dark } = useThemeContext()
    const {conversationId, member} = currentChat
    const [messageText, setMessageText] = useState('')
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(true)
    const scrollChatRef = useRef()

    const sendMessage = () => {
        setLoading(true)
        const message = {
            sender: user.id,
            reciever: member.id,
            text: messageText,
            conversationId: conversationId
        }
        
        fetch(`http://localhost:2000/api/message/${conversationId}`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "authorization": `Bearer ${user.access_token}`
            },
            body: JSON.stringify(message)
        }).then(res => res.json())
        .then(data => {
            socket.emit("sendMessage", data)
            setMessages(prev => [...prev, data])
            setLoading(false)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
        setMessageText("")
    }

    useEffect(() => {
        socket.on("recieveMessage", data => {
            if(data.conversationId === conversationId) {
                console.log("Inside Me")
                setMessages(prev => [...prev, data])
            } 
        })
        return () => {
            socket.off("recieveMessage")
        }
    }, [conversationId])


    useEffect(() => {
        fetch(`http://localhost:2000/api/message/${conversationId}`, {
            method: 'GET',
            headers: {
                "authorization": `Bearer ${user.access_token}`
            }
        }).then(res => res.json())
        .then(data => {
            setMessages(data.messages)
            setLoading(false)
        }).catch(err => {
            console.error(err)
            setLoading(false)
        })
    }, [conversationId])

    useEffect(() => {
        scrollChatRef.current.scrollTop = scrollChatRef.current.scrollHeight
    }, [messages])

    return (
        <Paper className="chat">
            <div className={`chattopbar ${dark && 'chattopbardark'}`}>
                <div className='currentmemberinfo'>
                    {member.profilePic ? <Avatar alt="Remy Sharp" src={member.profilePic} /> : 
                    <Avatar sx={{ bgcolor: 'brown' }}>{member.username[0]}</Avatar>}
                    <div >
                        <h3 style={{margin: 0, marginLeft: '5px'}}>{member.username}</h3>
                    </div>  
                </div>
                <IconButton aria-label="close" sx={{width: '40px', height: '40px'}} className={dark ? 'closeIcondark' : ''} onClick={() => setCurrentChat(null)}>
                    <CloseIcon />
                </IconButton>
            </div>
            <div className={`currentchatmessages ${dark && 'currentchatmessagesdark'}`} ref={scrollChatRef}>
                {loading ? <MyLoader /> :
                    <>
                    {messages.map(message => <UserChat key={message._id} message={message} own={message.sender === user.id} />)}
                    </>
                }
            </div>
            <div className={`chatInput ${dark && 'chatInputdark'}`}>
                <InputBase endAdornment={<IconButton onClick={sendMessage} className={dark && 'sendIcondark'}><SendIcon /></IconButton>} 
                    sx={{width: '100%', height: '100%', fontSize: dark ? '14px' : '18px'}} 
                    placeholder='Type a Message'
                    value={messageText}
                    onChange={e => setMessageText(e.target.value)}
                    onSubmit={sendMessage}
                    onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />   
            </div>
        </Paper>
    );
}

export default Chat;