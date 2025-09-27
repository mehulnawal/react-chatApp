// Circular avatar component with status dot
import { User } from 'lucide-react';
import { ThemeContext } from '../Global/Theme';
import { useContext } from 'react';

export const ProfileAvatarComponent = ({
    name = "User",
    size = "md",
    showStatus = false,
    isOnline = false,
    imageUrl = null
}) => {

    const { theme } = useContext(ThemeContext)

    const getSizeClasses = () => {
        switch (size) {
            case 'sm': return 'w-8 h-8 text-xs';
            case 'md': return 'w-10 h-10 text-sm';
            case 'lg': return 'w-16 h-16 text-lg';
            case 'xl': return 'w-20 h-20 text-xl';
            default: return 'w-10 h-10 text-sm';
        }
    };

    const getStatusSize = () => {
        switch (size) {
            case 'sm': return 'w-2 h-2';
            case 'md': return 'w-3 h-3';
            case 'lg': return 'w-4 h-4';
            case 'xl': return 'w-5 h-5';
            default: return 'w-3 h-3';
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getBackgroundColor = (name) => {
        const colors = [
            'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
            'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
        ];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <>
            <div className="relative">
                <div className={`
        ${getSizeClasses()} 
        ${getBackgroundColor(name)} 
        rounded-full flex items-center justify-center text-white font-medium relative overflow-hidden
      `}>
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt={name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span>{getInitials(name)}</span>
                    )}
                </div>

                {/* Status Dot */}
                {showStatus && (
                    <div className={`
          absolute -bottom-1 -right-1 
          ${getStatusSize()} 
          ${isOnline ? 'bg-green-500' : 'bg-gray-400'} 
          rounded-full border-2 
          ${theme === 'dark' ? 'border-gray-800' : 'border-white'}
        `}></div>
                )}
            </div>
        </>
    );
};

export default ProfileAvatarComponent;
