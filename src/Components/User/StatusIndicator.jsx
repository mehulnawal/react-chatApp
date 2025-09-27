import { useContext } from "react";
import { ThemeContext } from "../Global/Theme";

// Small online/offline status dot
const UserStatusIndicatorComponent = ({ isOnline = false, className = "" }) => {

    const { theme } = useContext(ThemeContext)

    return (
        <div
            className={`w-3 h-3 rounded-full border-2 ${theme === 'dark' ? 'border-gray-800' : 'border-white'
                } ${isOnline ? 'bg-green-500' : 'bg-gray-400'} ${className}`}
            title={isOnline ? 'Online' : 'Offline'}
        />
    );
};

export default UserStatusIndicatorComponent;
