import './Message.css'
import io from 'socket.io-client'
import { useEffect } from 'react'

const socket = io.connect('http://localhost:2000')

const Message = () => {

    useEffect(() => {
        
    }, [])

    return (
        <div>
            This is the messages page.
        </div>
    );
}

export default Message;