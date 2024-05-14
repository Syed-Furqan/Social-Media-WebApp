import { useContext, useState, createContext } from "react"

const UserContext = createContext()

export const useUserContext = () => useContext(UserContext)

export const UserProvider = ({children}) => {
    const initialState = {access_token: null, name: '', img: '', id: ''}
    const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || initialState)

    return (
        <UserContext.Provider value={{user, setContextUser: setUser}}>
            {children}
        </UserContext.Provider>
    );
}