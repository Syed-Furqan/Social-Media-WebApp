import { createContext, useContext, useState, useEffect } from "react"
import { io } from "socket.io-client"
import { useUserContext } from "./UserContext"

const SocketContext = createContext()

export const useSocketContext = () => useContext(SocketContext)

export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null)
    const { user } = useUserContext()

    useEffect(() => {
        if(user.access_token) {
            const socket = io.connect('http://localhost:2000', {
                query: {
                    userId: user.id
                }
            });
            setSocket(socket)
        }
    }, [user.access_token])


    return (
        <SocketContext.Provider value={{socket, setSocketContext: setSocket}}>
            {children}
        </SocketContext.Provider>
    );
}