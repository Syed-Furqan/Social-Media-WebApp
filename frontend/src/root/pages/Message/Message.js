import './Message.css'
import { useState } from 'react'
import ConversationsList from '../../../components/ConversationsList/ConversationsList'
import Chat from '../../../components/Chat/Chat'
import { useMediaQuery } from 'react-responsive'
import { useThemeContext } from '../../../Context/ThemeContext'

const Message = () => {

    const [currentChat, setCurrentChat] = useState(null)
    const [selectedPanel, setSelectedPanel] = useState('conversation')

    const isTablet = useMediaQuery({query: '(max-width: 800px)'})
    const { dark } = useThemeContext()

    return (
        <div className='message'>
            {!isTablet ? 
                <>
                <ConversationsList setCurrentChat={setCurrentChat} />
                {!currentChat ? <div className='noConvoContainer'>Open a Conversation</div> :
                <Chat currentChat={currentChat} setCurrentChat={setCurrentChat} />
                }
                </>
            :
            <>
            <div className={`conversationPanel ${dark && 'conversationPaneldark'}`}>
                <div className={`conversationPanelconvos ${selectedPanel === 'conversation' ? !dark ? 'selectedPanel' : 'selectedPaneldark' : !dark ? 'unselectedPanel' : 'unselectedPaneldark'}`} 
                    onClick={() => setSelectedPanel('conversation')}>
                    Conversations
                </div>
                <div className={`conversationPanelchat ${selectedPanel === 'chat' ? !dark ? 'selectedPanel' : 'selectedPaneldark' : !dark ? 'unselectedPanel' : 'unselectedPaneldark'}`} 
                    onClick={() => setSelectedPanel('chat')}>
                    Chat
                </div>
            </div>
            {selectedPanel === 'conversation' ? <ConversationsList setCurrentChat={setCurrentChat} setSelectedPanel={setSelectedPanel} /> :
            !currentChat ? <div className='noConvoContainer'>Open a Conversation</div> :
            <Chat currentChat={currentChat} setCurrentChat={setCurrentChat} />}
            </>
            }
        </div>
    );
}

export default Message;