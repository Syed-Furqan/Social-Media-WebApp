import { timeAgo } from '../../utils/moment';
import './UserChat.css';

const UserChat = ({message, own}) => {
    return (
        <div className={`userchat ${own && 'own'}`}>
            {message.text}
            <p className={`timeAgo ${own && 'owntimeAgo'}`}>{timeAgo(message?.createdAt)}</p>
        </div>
    );
}

export default UserChat;