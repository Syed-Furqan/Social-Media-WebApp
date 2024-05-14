import { createContext, useContext, useMemo, useState } from "react"

const ThemeContext = createContext()

export const useThemeContext = () => useContext(ThemeContext)

export const ThemeProvider = ({children}) => {

    const [dark, setDark] = useState(() => JSON.parse(localStorage.getItem('dark') || false))

    return (
        <ThemeContext.Provider value={useMemo(() => ({dark, setContextDark: setDark}), [dark])}>
            {children}
        </ThemeContext.Provider>
    );
}