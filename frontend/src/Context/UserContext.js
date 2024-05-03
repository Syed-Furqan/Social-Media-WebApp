import { useContext, useState } from "react"
import { createContext } from "react"

const UserContext = createContext()

export const useUserContext = () => useContext(UserContext)

export const UserProvider = ({children}) => {

    const [user, setUser] = useState({access_token: null, name: '', id: '', img: ''})

    return (
        <UserContext.Provider value={{user, setContextUser: setUser}}>
            {children}
        </UserContext.Provider>
    );
}