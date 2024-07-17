import { createContext, useContext, useState, useEffect } from "react"
import { io } from "socket.io-client"
import { useUserContext } from "./UserContext"
// import notificationSound from '../../public/assets/sounds/notification.mp3'

const SocketContext = createContext()

export const useSocketContext = () => useContext(SocketContext)

export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null)
    const { user } = useUserContext()
    const [onlineFollowing, setOnlineFollowing] = useState([])
    const [notifications, setNotifications] = useState([])
    const [newNotifications, setNewNotifications] = useState(0)
    const [notificationAlert, setNotificationAlert] = useState({status: false, data: null})

    useEffect(() => {
        if(user.access_token) {
            const socket = io.connect(process.env.REACT_APP_BASE_URL, {
                query: {
                    userId: user.id
                }
            });
            setSocket(socket)

            socket.on('getOnlineFollowing', data => {
                setOnlineFollowing(data.online_following)
            })

            socket.on('recieveNotification', data => {
                setNotifications(prev => [data, ...prev])
                setNewNotifications(prev => prev + 1)
                setNotificationAlert({status: true, data})
                const audio = new Audio('/assets/sounds/notification.mp3')
                audio.muted = false
                audio.play()
            })
        }
    }, [user.access_token])


    return (
        <SocketContext.Provider 
            value={{
                socket, 
                setSocketContext: setSocket, 
                onlineFollowing, 
                notifications, 
                setNotifications, 
                newNotifications,
                setNewNotifications,
                notificationAlert,
                setNotificationAlert
            }}>
            {children}
        </SocketContext.Provider>
    );
}