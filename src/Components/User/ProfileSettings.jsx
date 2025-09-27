// User profile settings form with mock data
import { User, Camera, Save, LogOut, Edit } from 'lucide-react';
import ProfileAvatarComponent from './ProfileAvatar';
import { ThemeContext } from '../Global/Theme';
import { useContext } from 'react';

export const UserProfileSettingsComponent = () => {

    const { theme } = useContext(ThemeContext)

    return (
        <div className={`max-w-2xl mx-auto p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-lg`}>

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Profile Settings
                </h1>
                <button className={`p-2 rounded-lg transition-colors ${theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                    }`}>
                    <Edit className="w-5 h-5" />
                </button>
            </div>

            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative">
                    <ProfileAvatarComponent name="John Doe" size="xl" showStatus={true} isOnline={true} />
                    <button className={`absolute bottom-0 right-0 p-2 rounded-full transition-colors ${theme === 'dark'
                        ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        } border-4 ${theme === 'dark' ? 'border-gray-800' : 'border-white'}`}>
                        <Camera className="w-4 h-4" />
                    </button>
                </div>
                <p className={`mt-3 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Click the camera icon to update your photo
                </p>
            </div>

            {/* Profile Form */}
            <form className="space-y-6">
                {/* Username Field */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        Username
                    </label>
                    <div className="relative">
                        <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                            }`} />
                        <input
                            type="text"
                            value="johndoe"
                            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${theme === 'dark'
                                ? 'bg-gray-700 border-gray-600 text-white'
                                : 'bg-white border-gray-300 text-gray-900'
                                }`}
                        />
                    </div>
                </div>

                {/* Display Name Field */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        Display Name
                    </label>
                    <input
                        type="text"
                        value="John Doe"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            }`}
                    />
                </div>

                {/* Status Message Field */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        Status Message
                    </label>
                    <textarea
                        rows={3}
                        value="Available for chat!"
                        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${theme === 'dark'
                            ? 'bg-gray-700 border-gray-600 text-white'
                            : 'bg-white border-gray-300 text-gray-900'
                            }`}
                    />
                </div>

                {/* Email Field (Read-only) */}
                <div>
                    <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                        Email Address
                    </label>
                    <input
                        type="email"
                        value="john@example.com"
                        disabled
                        className={`w-full px-4 py-3 border rounded-lg transition-colors ${theme === 'dark'
                            ? 'bg-gray-800 border-gray-600 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-50 border-gray-300 text-gray-500 cursor-not-allowed'
                            }`}
                    />
                    <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                        Email cannot be changed
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <button
                        type="submit"
                        className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        <Save className="w-5 h-5" />
                        <span>Save Changes</span>
                    </button>

                    <button
                        type="button"
                        className={`flex-1 flex items-center justify-center space-x-2 py-3 px-6 rounded-lg font-medium border transition-colors ${theme === 'dark'
                            ? 'border-red-600 text-red-400 hover:bg-red-900/20'
                            : 'border-red-300 text-red-600 hover:bg-red-50'
                            }`}
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Logout</span>
                    </button>
                </div>
            </form>

            {/* Account Info */}
            <div className={`mt-8 pt-6 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-medium mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    Account Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Member since:
                        </span>
                        <span className={`ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            January 2024
                        </span>
                    </div>
                    <div>
                        <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Last active:
                        </span>
                        <span className={`ml-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Just now
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
