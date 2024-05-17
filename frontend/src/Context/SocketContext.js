import { createContext, useContext, useState, useEffect } from "react"
import { io } from "socket.io-client"
import { useUserContext } from "./UserContext"

const SocketContext = createContext()

export const useSocketContext = () => useContext(SocketContext)

export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null)
    const { user } = useUserContext()
    const [onlineFollowing, setOnlineFollowing] = useState([])

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
        }
    }, [user.access_token])


    return (
        <SocketContext.Provider value={{socket, setSocketContext: setSocket, onlineFollowing}}>
            {children}
        </SocketContext.Provider>
    );
}