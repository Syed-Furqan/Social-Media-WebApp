import { useContext, useState } from "react"
import { createContext } from "react"

const UserContext = createContext()

export const useUserContext = () => useContext(UserContext)

export const UserProvider = ({children}) => {
    let initialState = {access_token: null, id: '', name: '', img: ''}
    const userInLocalStorage = JSON.parse(localStorage.getItem('user'))
    if(userInLocalStorage) 
        initialState = userInLocalStorage

    const [user, setUser] = useState(initialState)

    return (
        <UserContext.Provider value={{user, setContextUser: setUser}}>
            {children}
        </UserContext.Provider>
    );
}