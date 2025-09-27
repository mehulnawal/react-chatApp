import { getAuth, onAuthStateChanged } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { Firebase } from "./Firebase";

// add chat 
export const NewChatModalContext = createContext();
export const NewChatModalProvider = ({ children }) => {

    const [showNewChatModel, setShowNewChatModel] = useState(false);

    return (
        <>
            <NewChatModalContext.Provider value={{ showNewChatModel, setShowNewChatModel }}>
                {children}
            </NewChatModalContext.Provider>
        </>
    )
}

// Get user data on AuthChanged
export const UserDataContext = createContext();
export const UserDataProvider = ({ children }) => {

    const [userData, setUserData] = useState('')

    useEffect(() => {
        const auth = getAuth(Firebase);
        const check = onAuthStateChanged(auth, (res) => {
            if (res) {
                setUserData(res)
                console.log(res);
            }
            else setUserData(null)
        })

        return () => check();
    }, [])

    return <>
        <UserDataContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserDataContext.Provider>
    </>
}