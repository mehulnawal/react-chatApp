import { useContext, useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import { Firebase } from "../Global/Firebase";
import { UserDataContext } from "../Global/GlobalData";
import { ThemeContext } from "../Global/Theme";

export const ChatDetailsPanel = ({ chatId }) => {
    const { theme } = useContext(ThemeContext);
    const [currentChat, setCurrentChat] = useState(null);
    const { userData } = useContext(UserDataContext);

    useEffect(() => {
        if (!chatId || !userData?.uid) {
            setCurrentChat(null);
            return;
        }

        const db = getDatabase(Firebase);
        const chatRef = ref(db, `/userChatList/${userData.uid}/${chatId}`);

        const unsubscribe = onValue(chatRef, (res) => {
            const data = res.val();
            if (data) setCurrentChat(data);
            else setCurrentChat(null);
        });

        return () => unsubscribe();
    }, [chatId, userData?.uid]);

    return (
        <div
            className={`h-screen rounded-xl shadow-lg border flex flex-col overflow-hidden
      ${theme === "dark" ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"}
      ${!chatId ? "hidden" : "block"}`}
        >
            {/* User Profile Section */}
            <div
                className={`h-full w-full p-4 border-b 
        ${theme === "dark" ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"}`}
            >
                <div className="text-center">
                    <div className="relative inline-block">
                        <img
                            src={currentChat?.receiverImage}
                            alt={currentChat?.receiverName}
                            className="w-15 h-15 rounded-full object-cover mx-auto mb-4"
                        />
                    </div>
                    <h2
                        className={`text-xl font-bold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
                    >
                        {currentChat?.receiverName}
                    </h2>
                </div>
            </div>
            {/* Add more details here as needed */}
        </div>
    );
};
