// Full-screen centered spinner loader with theme support
import { Loader2 } from 'lucide-react';
import { useContext } from 'react';
import { ThemeContext } from './Theme';

export const LoaderComponent = () => {

    const { theme } = useContext(ThemeContext)

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
            <div className="flex flex-col items-center space-y-4">
                <Loader2 className={`w-8 h-8 md:w-12 md:h-12 animate-spin ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                <p className={`text-sm md:text-base font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    Loading...
                </p>
            </div>
        </div>
    );
};
