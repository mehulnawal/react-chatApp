// Fixed UserDashBoard with proper mobile responsiveness
import React, { useState, useEffect } from 'react';
import { ThemeContext } from '../Global/Theme';
import { useContext } from 'react';
import { ArrowLeft } from 'lucide-react';
import UserComponent from './ChatList';

export const UserDashBoard = () => {
    const { theme } = useContext(ThemeContext);
    const [selectedChatId, setSelectedChatId] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // Update mobile state on resize
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);

            // Reset selected chat when switching from mobile to desktop
            if (!mobile && selectedChatId) {
                // Keep chat selected on desktop - comment this line if you want to reset
                // setSelectedChatId(null);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [selectedChatId]);

    // Handle chat selection
    const handleChatSelect = (chatId) => {
        setSelectedChatId(chatId);
    };

    // Handle back to chat list (mobile only)
    const handleBackToChatList = () => {
        setSelectedChatId(null);
    };

    return (
        <div className={`relative ${isMobile ? 'h-screen' : 'h-screen'
            } overflow-hidden`}>

            {/* Mobile Layout */}
            {isMobile ? (
                <div className="relative w-full h-full">
                    {/* Chat List - Slides out when chat selected */}
                    <div className={`absolute inset-0 w-full h-full bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out z-10 ${selectedChatId
                        ? '-translate-x-full'
                        : 'translate-x-0'
                        }`}>
                        <UserComponent
                            onChatSelect={handleChatSelect}
                            selectedChatId={selectedChatId}
                        />
                    </div>

                    {/* Chat Room - Slides in when chat selected */}
                    <div className={`absolute inset-0 w-full h-full bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out z-20 ${selectedChatId
                        ? 'translate-x-0'
                        : 'translate-x-full'
                        }`}>
                        {/* Mobile Back Header */}
                        {selectedChatId && (
                            <div className={`flex items-center p-3 border-b backdrop-blur-sm sticky top-0 z-30 ${theme === 'dark'
                                ? 'bg-gray-800/95 border-gray-700'
                                : 'bg-white/95 border-gray-200'
                                }`}>
                                <button
                                    onClick={handleBackToChatList}
                                    className={`p-2 rounded-full mr-3 transition-all duration-200 hover:scale-110 ${theme === 'dark'
                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                        }`}
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h2 className={`font-semibold text-lg ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                                    }`}>
                                    Chats
                                </h2>
                            </div>
                        )}
                    </div>
                </div>
            ) : (

                /* Desktop Layout */
                <div className="flex h-full">

                    {/* Chat List - Fixed left side */}
                    <div className="w-fit flex-shrink-0 border-r border-gray-200 dark:border-gray-700">
                        <UserComponent
                            onChatSelect={handleChatSelect}
                            selectedChatId={selectedChatId}
                        />
                    </div>

                    {/* Chat Room - Flexible right side
                    <div className="flex-1">
                        <ChatRoomComponent
                            chatId={selectedChatId}
                        />
                    </div> */}
                </div>
            )}
        </div>
    );
};
