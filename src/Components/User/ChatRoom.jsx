import { Send, Paperclip, ArrowLeft, MessageCircle } from 'lucide-react';
import { ThemeContext } from '../Global/Theme';
import { useContext, useState, useEffect, useRef } from 'react';
import { getDatabase, onValue, push, ref, set } from 'firebase/database';
import { Firebase } from '../Global/Firebase';
import { UserDataContext } from '../Global/GlobalData';

export const ChatRoomComponent = ({ chatId, onBack }) => {
    const { theme } = useContext(ThemeContext);
    const { userData } = useContext(UserDataContext);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [currentChat, setCurrentChat] = useState(null);
    const [messages, setMessages] = useState({});
    const [messageText, setMessageText] = useState('');

    const messagesEndRef = useRef(null);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Detect mobile resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Fetch chat metadata
    useEffect(() => {
        if (!chatId) {
            setCurrentChat(null);
            return;
        }

        const db = getDatabase(Firebase);
        const chatMetaRef = ref(db, `/userChatList/${userData.uid}/${chatId}`);

        const unsubscribeMeta = onValue(chatMetaRef, (snap) => {
            if (snap.exists()) setCurrentChat(snap.val());
            else setCurrentChat(null);
        });

        return () => unsubscribeMeta();
    }, [chatId, userData?.uid]);

    // Fetch chat messages (single shared path)
    useEffect(() => {
        if (!chatId) return;

        const db = getDatabase(Firebase);
        const messagesRef = ref(db, `/userMessages/${chatId}`);

        const unsubscribeMsgs = onValue(messagesRef, (snap) => {
            setMessages(snap.val() || {});
        });

        return () => unsubscribeMsgs();
    }, [chatId]);

    const handleSendMessage = () => {
        if (!messageText.trim()) return;

        const createdAt = Date.now(); // timestamp in ms

        const messageData = {
            text: messageText,
            senderId: userData.uid,
            imageUrl: userData.photo || "https://res.cloudinary.com/doxycgig/image/upload/v1758604889/chat-avatart_ifaiiz.png",
            timestamp: createdAt,
            type: "text",
        };

        const db = getDatabase(Firebase);

        // Save message under shared chatId
        const newMessageRef = push(ref(db, `/userMessages/${chatId}`));
        set(newMessageRef, messageData);

        // Update last message in chat metadata for both users
        set(ref(db, `/userChatList/${userData.uid}/${chatId}/lastMessage`), messageText);
        set(ref(db, `/userChatList/${userData.uid}/${chatId}/lastTimestamp`), createdAt);

        set(ref(db, `/userChatList/${currentChat.receiverId}/${chatId}/lastMessage`), messageText);
        set(ref(db, `/userChatList/${currentChat.receiverId}/${chatId}/lastTimestamp`), createdAt);

        setMessageText('');
    };

    if (!chatId || !currentChat) {
        return (
            <div className={`min-h-screen flex flex-col items-center justify-center p-8 ${theme === "dark" ? "bg-gray-900" : "bg-gray-50"}`}>
                <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${theme === "dark" ? "bg-gray-800" : "bg-white"} shadow-lg`}>
                    <MessageCircle className={`w-12 h-12 ${theme === "dark" ? "text-gray-600" : "text-gray-400"}`} />
                </div>
                <h2 className={`text-2xl font-semibold mb-3 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>
                    No chat selected
                </h2>
                <p className={`text-lg mb-8 text-center max-w-md ${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>
                    Choose a conversation from the sidebar
                </p>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"}`}>
            {/* Chat header */}
            <div className={`flex items-center justify-between p-4 border-b ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <div className="flex items-center space-x-4">
                    {isMobile && onBack && (
                        <button onClick={onBack} className={`p-2 rounded-full transition-all duration-200 hover:scale-110 ${theme === "dark" ? "text-gray-300 hover:bg-gray-700 hover:text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"}`}>
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                    )}
                    <img src={currentChat.receiverImage} alt={currentChat.receiverName} className="w-10 h-10 rounded-full object-cover border border-gray-300" />
                    <div className="flex flex-col">
                        <h2 className="font-semibold text-lg truncate">{currentChat.receiverName}</h2>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages && Object.keys(messages).length > 0 ? (
                    Object.entries(messages).map(([key, msg]) => {
                        const isSender = msg.senderId === userData.uid;
                        return (
                            <div key={key} className={`w-full flex ${isSender ? "justify-end" : "justify-start"}`}>
                                {!isSender && (
                                    <img src={msg.imageUrl} alt="avatar" className="w-8 h-8 rounded-full mr-2 self-end" />
                                )}
                                <div className={`max-w-[70%] px-4 py-2 rounded-2xl shadow ${isSender ? "bg-blue-600 text-white rounded-br-none" : "bg-gray-200 text-gray-900 rounded-bl-none"}`}>
                                    <p className="break-words">{msg.text}</p>
                                    <span className={`block text-xs mt-1 text-right ${isSender ? "text-white/70" : "text-gray-500"}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                                {isSender && (
                                    <img src={msg.imageUrl} alt="avatar" className="w-8 h-8 rounded-full ml-2 self-end" />
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-gray-500">Start a conversation now!</div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${theme === "dark" ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
                <div className="flex items-center space-x-3">
                    <button className={`p-2 rounded-lg transition-colors ${theme === "dark" ? "text-gray-400 hover:text-white hover:bg-gray-700" : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"}`}>
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        type="text"
                        placeholder="Enter your message"
                        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${theme === "dark" ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"}`}
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button onClick={handleSendMessage} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};