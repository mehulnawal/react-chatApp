// ErrorPage.jsx - Dynamic error page for both 404 and access denied
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Home,
    ArrowLeft,
    AlertTriangle,
    Lock,
    Search,
    RefreshCw,
    Mail
} from 'lucide-react';
import { ThemeContext } from './Theme';

export const ErrorPage = ({
    errorType = '404',
    customMessage = null,
    showBackButton = true,
    showHomeButton = true,
    showSearchButton = false,
}) => {
    const navigate = useNavigate();
    const location = useLocation();

    const { theme } = useContext(ThemeContext)

    // Error configurations
    const errorConfig = {
        '404': {
            title: '404',
            subtitle: 'Page Not Found',
            message: "Sorry, we couldn't find the page you're looking for.",
            icon: AlertTriangle,
            color: 'blue',
            suggestions: [
                'Check the URL for typos',
                'Go back to the previous page',
                'Visit our homepage',
                'Use the search feature'
            ]
        },
        'access-denied': {
            title: '403',
            subtitle: 'Access Denied',
            message: "You don't have permission to access this resource.",
            icon: Lock,
            color: 'red',
            suggestions: [
                'Check if you\'re logged in',
                'Contact your administrator',
                'Return to the previous page',
                'Go to your dashboard'
            ]
        },
        'server-error': {
            title: '500',
            subtitle: 'Server Error',
            message: 'Something went wrong on our end. Please try again later.',
            icon: RefreshCw,
            color: 'orange',
            suggestions: [
                'Refresh the page',
                'Try again in a few minutes',
                'Contact support if the problem persists',
                'Return to homepage'
            ]
        }
    };

    const config = errorConfig[errorType] || errorConfig['404'];
    const IconComponent = config.icon;

    // Color schemes based on error type
    const getColorClasses = (colorType) => {
        const colors = {
            blue: {
                primary: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
                secondary: theme === 'dark' ? 'text-blue-300' : 'text-blue-500',
                bg: theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-50',
                border: theme === 'dark' ? 'border-blue-800' : 'border-blue-200',
                button: 'bg-blue-600 hover:bg-blue-700'
            },
            red: {
                primary: theme === 'dark' ? 'text-red-400' : 'text-red-600',
                secondary: theme === 'dark' ? 'text-red-300' : 'text-red-500',
                bg: theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50',
                border: theme === 'dark' ? 'border-red-800' : 'border-red-200',
                button: 'bg-red-600 hover:bg-red-700'
            },
            orange: {
                primary: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
                secondary: theme === 'dark' ? 'text-orange-300' : 'text-orange-500',
                bg: theme === 'dark' ? 'bg-orange-900/20' : 'bg-orange-50',
                border: theme === 'dark' ? 'border-orange-800' : 'border-orange-200',
                button: 'bg-orange-600 hover:bg-orange-700'
            }
        };
        return colors[colorType] || colors.blue;
    };

    const colorScheme = getColorClasses(config.color);

    // Navigation handlers
    const handleGoBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate('/');
        }
    };

    const handleGoHome = () => {
        navigate('/');
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    const handleContactSupport = () => {
        window.location.href = 'mailto:support@yourcompany.com';
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
            }`}>
            <div className="max-w-2xl w-full text-center">

                {/* Error Icon and Code */}
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-8 ${colorScheme.bg} ${colorScheme.border} border-2`}>
                    <IconComponent className={`w-12 h-12 ${colorScheme.primary}`} />
                </div>

                {/* Error Title */}
                <h1 className={`text-8xl md:text-9xl font-bold mb-4 ${colorScheme.primary}`}>
                    {config.title}
                </h1>

                {/* Error Subtitle */}
                <h2 className={`text-3xl md:text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}>
                    {config.subtitle}
                </h2>

                {/* Error Message */}
                <p className={`text-lg md:text-xl mb-8 max-w-md mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    {customMessage || config.message}
                </p>

                {/* Current Path Info */}
                {errorType === '404' && (
                    <div className={`mb-8 p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
                        } border inline-block`}>
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                            Requested path:
                        </p>
                        <code className={`text-sm font-mono ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                            {location.pathname}
                        </code>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                    {showBackButton && (
                        <button
                            onClick={handleGoBack}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-colors ${theme === 'dark'
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Go Back</span>
                        </button>
                    )}

                    {showHomeButton && (
                        <button
                            onClick={handleGoHome}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white transition-colors ${colorScheme.button}`}
                        >
                            <Home className="w-5 h-5" />
                            <span>Go Home</span>
                        </button>
                    )}

                    {showSearchButton && (
                        <button
                            onClick={() => navigate('/search')}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-colors ${theme === 'dark'
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <Search className="w-5 h-5" />
                            <span>Search</span>
                        </button>
                    )}

                    {errorType === 'server-error' && (
                        <button
                            onClick={handleRefresh}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg border transition-colors ${theme === 'dark'
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-800'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <RefreshCw className="w-5 h-5" />
                            <span>Refresh</span>
                        </button>
                    )}
                </div>

                {/* Helpful Suggestions */}
                <div className={`p-6 rounded-lg ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
                    } border shadow-sm`}>
                    <h3 className={`text-lg font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}>
                        What can you do?
                    </h3>
                    <ul className="space-y-2">
                        {config.suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                className={`flex items-center space-x-2 text-left ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                    }`}
                            >
                                <div className={`w-1.5 h-1.5 rounded-full ${colorScheme.secondary.replace('text-', 'bg-')}`} />
                                <span>{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact Support */}
                <div className="mt-8">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        Still need help?{' '}
                        <button
                            onClick={handleContactSupport}
                            className={`${colorScheme.secondary} hover:underline font-medium`}
                        >
                            Contact Support
                        </button>
                    </p>
                </div>

                {/* Footer Info */}
                <div className="mt-12">
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                        Error ID: {Date.now().toString(36)} • {new Date().toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
