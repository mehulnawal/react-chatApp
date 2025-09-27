import { useContext, useEffect, useState } from "react";
import { Plus, Sun, Moon, LogOut, Settings, Menu, User } from "lucide-react";
import { NewChatModalContext, UserDataContext } from "../Global/GlobalData";
import { getDatabase, onValue, ref } from "firebase/database";
import { Firebase } from "../Global/Firebase";
import { ThemeContext } from "../Global/Theme";
import { Link, useNavigate } from "react-router";
import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { ChatRoomComponent } from "./ChatRoom";
import { ChatDetailsPanel } from "./Details";
import { AddUser } from "./AddUser";

export const UserDetails = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { showNewChatModel, setShowNewChatModel } = useContext(NewChatModalContext);
    const { userData } = useContext(UserDataContext);
    const [userDetails, setUserDetails] = useState(null);
    const { theme, setTheme } = useContext(ThemeContext);

    useEffect(() => {
        async function fetchingUserDetails() {
            if (userData) {
                const db = getDatabase(Firebase);
                const userRef = ref(db, `/usersData/${userData.uid}`);
                onValue(userRef, (res) => {
                    const data = res.val();
                    setUserDetails(data);
                });
            }
        }
        fetchingUserDetails();
    }, [userData]);

    const navigate = useNavigate();
    function handleLogout() {
        if (confirm("Do you want to sign out ?")) {
            const auth = getAuth(Firebase);
            signOut(auth).then(() => {
                toast.success("Logout Successful");
                navigate('/');
            }).catch((error) => console.log(error));
        }
    }

    return (
        <div className={`w-full ${theme === 'light' ? 'bg-white' : 'bg-gray-900'} shadow-lg border-x border-t ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>
            <div className="px-4 py-4 flex items-center justify-between max-w-full">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="relative">
                        <img
                            src={userDetails?.photo}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <h3 className={`font-semibold text-md truncate ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                            {userDetails?.name || "new User"}
                        </h3>
                    </div>
                </div>

                <div className="hidden sm:flex items-center space-x-2">
                    <button
                        className={`p-2 rounded-lg transition-all hover:scale-105 ${theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-800 text-gray-300'}`}
                        title="Add User"
                        onClick={() => setShowNewChatModel(!showNewChatModel)}
                    >
                        <Plus className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`p-2 rounded-lg transition-all hover:scale-105 ${theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-800 text-gray-300'}`}
                        title="Toggle Theme"
                    >
                        {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                    </button>

                    <Link to='/profileSettings'
                        className={`p-2 rounded-lg transition-all hover:scale-105 ${theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-800 text-gray-300'}`}
                        title="Profile Settings"
                    >
                        <Settings className="w-5 h-5" />
                    </Link>

                    <button
                        className={`p-2 rounded-lg transition-all hover:scale-105 ${theme === 'light' ? 'hover:bg-red-50 text-red-600' : 'hover:bg-red-900/20 text-red-400'}`}
                        title="Logout"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>

                <div className="sm:hidden relative">
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className={`p-2 rounded-lg transition-all ${theme === 'light' ? 'hover:bg-gray-100 text-gray-600' : 'hover:bg-gray-800 text-gray-300'}`}
                        aria-label="Menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    {menuOpen && (
                        <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-gray-800 border-gray-700'} border z-50 overflow-hidden`}>
                            <button className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors ${theme === 'light' ? 'hover:bg-gray-50 text-gray-700' : 'hover:bg-gray-700 text-gray-300'}`}
                                onClick={() => setShowNewChatModel(!showNewChatModel)}
                            >
                                <Plus className="w-5 h-5" /> <span>Add User</span>
                            </button>
                            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors ${theme === 'light' ? 'hover:bg-gray-50 text-gray-700' : 'hover:bg-gray-700 text-gray-300'}`}>
                                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />} <span>Theme</span>
                            </button>
                            <button className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors ${theme === 'light' ? 'hover:bg-gray-50 text-gray-700' : 'hover:bg-gray-700 text-gray-300'}`}>
                                <Settings className="w-5 h-5" /> <span>Settings</span>
                            </button>
                            <button className={`w-full px-4 py-3 text-left flex items-center space-x-3 transition-colors ${theme === 'light' ? 'hover:bg-red-50 text-red-600' : 'hover:bg-red-900/20 text-red-400'}`}>
                                <LogOut className="w-5 h-5" /> <span>Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            {showNewChatModel && <AddUser isOpen='true' />}
        </div>
    )
};

export const ChatList = ({ onChatSelect, selectedChatId }) => {
    const { theme } = useContext(ThemeContext);
    const [userChatList, setUserChatList] = useState({ chatDetails: {}, details: {} });
    const { userData } = useContext(UserDataContext);

    useEffect(() => {
        if (!userData?.uid) return; // wait for valid user

        const db = getDatabase(Firebase);
        const chatRef = ref(db, `/userChatList/${userData.uid}`);
        const unsubscribe = onValue(chatRef, (res) => {
            const data = res.val();
            setUserChatList(prev => ({ ...prev, chatDetails: data }));
        });
        return () => unsubscribe();
    }, [userData]);

    return (
        <div className={`w-full h-screen overflow-y-auto ${theme === 'light' ? 'bg-white' : 'bg-gray-900'} rounded-b-xl shadow-lg border-x border-b ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} flex flex-col`}>
            <div className="flex-1">
                <div className="p-4 pb-2">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className={`font-semibold text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-700"} uppercase tracking-wide`}>
                            Recent Chats
                        </h3>
                        <span className={`text-xs px-2 py-1 rounded-full ${theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-900/30 text-blue-400'}`}>
                            {userChatList.chatDetails && Object.keys(userChatList.chatDetails).length > 0
                                ? Object.entries(userChatList?.chatDetails).length
                                : "0"
                            }
                        </span>
                    </div>
                </div>
                <div className="px-4 pb-4 h-80 overflow-y-auto">
                    <div className="space-y-2">
                        {userChatList.chatDetails && Object.keys(userChatList.chatDetails).length > 0
                            ? Object.entries(userChatList.chatDetails).map(([key, chat]) => (
                                <button
                                    key={key}
                                    onClick={() => onChatSelect(chat.chatId || key)}
                                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all hover:scale-[0.98] group ${selectedChatId === chat.chatId
                                        ? theme === 'dark'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-blue-500 text-white'
                                        : theme === "dark"
                                            ? "hover:bg-gray-800 text-white"
                                            : "hover:bg-gray-50 text-gray-900"
                                        }`}
                                >
                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                        <div className="relative">
                                            <img
                                                src={chat.receiverImage}
                                                alt={chat.receiverName}
                                                className="w-12 h-12 rounded-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-semibold truncate text-sm">{chat.receiverName}</p>
                                            </div>
                                            <p className={`text-xs text-start mt-2 truncate ${selectedChatId === chat.chatId
                                                ? 'text-white opacity-75'
                                                : theme === 'light' ? 'text-gray-600' : 'text-gray-400'
                                                }`}>
                                                last message
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))
                            : <div></div>
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function UserComponent() {
    const { theme } = useContext(ThemeContext);
    const [selectedChatId, setSelectedChatId] = useState(null);

    const handleBack = () => {
        setSelectedChatId(null);
    };

    return (
        <div className={`min-h-screen w-screen ${theme === 'light' ? 'bg-gradient-to-br from-blue-50 to-purple-50' : 'bg-gradient-to-br from-gray-900 to-purple-900'}`}>
            <div className="flex flex-col md:flex-row min-h-screen">

                {/* Left Panel */}
                <div className="md:w-1/4 w-full border-r border-gray-300 dark:border-gray-700 overflow-y-auto">
                    <UserDetails theme={theme} />
                    <ChatList theme={theme} selectedChatId={selectedChatId} onChatSelect={setSelectedChatId} />
                </div>

                {/* Middle Panel */}
                <div className="md:flex-1 w-full border-r border-gray-300 dark:border-gray-700">
                    <ChatRoomComponent chatId={selectedChatId} onBack={handleBack} />
                </div>
            </div>
        </div>
    );
}