import './Message.css'
import { useState } from 'react'
import ConversationsList from '../../../components/ConversationsList/ConversationsList'
import Chat from '../../../components/Chat/Chat'

const Message = () => {

    const [currentChat, setCurrentChat] = useState(null)

    return (
        <div className='message'>
            <ConversationsList setCurrentChat={setCurrentChat} />
            {!currentChat ? <div className='noConvoContainer'>Open a Conversation</div> :
            <Chat currentChat={currentChat} setCurrentChat={setCurrentChat} />
            }
        </div>
    );
}

export default Message;