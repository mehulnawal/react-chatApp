import { Mail, Lock, Eye, EyeOff, MessageCircle, Sun, Moon, AlignStartHorizontal, User } from 'lucide-react';
import { ThemeContext } from './Theme';
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Firebase } from './Firebase';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { toast } from 'react-toastify';

export const LoginComponent = () => {

    const { theme, setTheme } = useContext(ThemeContext)
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const [error, setError] = useState({
        email: '',
        password: ''
    })

    const [check, setCheck] = useState({
        email: false,
        password: false,
    })
    const navigate = useNavigate()

    // handle form data
    function handleFormData(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        // email
        if (name == 'email') {
            const emailRef = /^[a-zA-Z0-9-_+.]+@[a-zA-Z0-9+-]+\.[a-zA-Z]{2,}$/;
            if (value.trim() == '') {
                setError((prev) => ({ ...prev, email: "Enter email" }));
                setCheck((prev) => ({ ...prev, email: false }));
            }
            else if (!emailRef.test(value.trim())) {
                setError((prev) => ({ ...prev, email: "Invalid email" }));
                setCheck((prev) => ({ ...prev, email: false }));
            }
            else {
                setError((prev) => ({ ...prev, email: "" }));
                setCheck((prev) => ({ ...prev, email: true }));
            }
        }

        // password
        if (name == 'password') {
            if (value.trim() == '') {
                setError((prev) => ({ ...prev, password: "Enter password" }));
                setCheck((prev) => ({ ...prev, password: false }));
            }
            else if (String(value.length) < 6) {
                setError((prev) => ({ ...prev, password: "Password should be of 6 digits" }));
                setCheck((prev) => ({ ...prev, password: false }));
            }
            else {
                setError((prev) => ({ ...prev, password: "" }));
                setCheck((prev) => ({ ...prev, password: true }));
            }
        }

    }

    // handle form submit
    function handleFormSubmit(e) {
        e.preventDefault();

        const isValid = Object.values(check).every(v => v == true);

        if (!isValid) {
            Object.entries(check).map(v => {
                if (v[1] == false) {
                    setError((prev) => ({ ...prev, [v[0]]: `Enter ${v[0]}` }));
                }
            })
        }
        else {
            setLoading(true);
            const auth = getAuth(Firebase);
            signInWithEmailAndPassword(auth, formData.email, formData.password)
                .then(() => {
                    toast.success('Login Successful');
                    setFormData({ email: '', password: '' })
                    setLoading(false);
                    navigate('/user')
                })
                .catch((error) => {
                    console.log(error.code);
                    if (error.code == 'auth/user-not-found') {
                        toast.error('User not found.Register yourself');
                        setLoading(false);
                    }
                    else if (error.code == 'auth/wrong-password') {
                        toast.error('Wrong password.');
                        setLoading(false);
                    }
                    else if (error.code == 'auth/too-many-requests') {
                        toast.error('Too many requests');
                        setLoading(false);
                    }
                })
        };
    }

    // handle Google Login
    function handleGoogleLogin() {
        setLoading(true);
        const auth = getAuth(Firebase)
        const provider = new GoogleAuthProvider()
        signInWithPopup(auth, provider)
            .then(async (userCredential) => {
                setLoading(false);
                const db = getDatabase(Firebase)
                const user = userCredential.user
                console.log(user.uid)
                console.log(user)
                await set(ref(db, `/usersData/${user.uid}`), {
                    id: user.uid,
                    email: user.email,
                    name: user.displayName,
                    photo: user.photoURL,
                    blocked: []
                });
                toast.success("Successful");
                navigate('/user');
            })
            .catch((error) => {
                if (error.code) {
                    toast.error(`Something went wrong - ${error.code}`);
                    setLoading(false);
                }
            })
    }

    function handleResetForm() {
        toast.info("Form reset Done")
        setFormData({ email: '', password: '' })
    }

    return (
        <>
            <div className={`min-h-screen flex items-center justify-center px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
                }`}>
                <div className={`relative max-w-md w-full space-y-8 p-8 rounded-xl shadow-lg ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>

                    {/* theme */}
                    <div
                        className={`absolute right-5 cursor-pointer ${theme == 'dark' ? 'text-white' : 'text-black'} `}
                        onClick={() => setTheme(theme == 'dark' ? 'light' : 'dark')}
                    >
                        {theme == 'dark' ? <Sun /> : <Moon />}
                    </div>

                    {/* Header */}
                    <div className="text-center">
                        <MessageCircle className={`mx-auto w-12 h-12 ${theme === 'dark' ? 'text-blue-400' : 'text-blue-600'}`} />
                        <h2 className={`mt-6 text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                            Login to QuickChat
                        </h2>
                        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Welcome back! Please enter your details
                        </p>
                    </div>

                    {/* Google Login Button */}
                    <div>
                        <button
                            disabled={loading}
                            className={`w-full flex items-center justify-center space-x-3 px-4 py-3 border rounded-lg font-medium transition-colors ${theme === 'dark'
                                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                } ${loading ? 'opacity-45 pointer-events-none' : ''} `}
                            onClick={handleGoogleLogin}
                        >
                            {loading
                                ? (<>
                                    <div className='flex justify-center space-x-3'>
                                        <div className='animate-spin rounded-full h-5 w-5 border-b-3'></div>
                                        <div>Please wait Processing...</div>
                                    </div>
                                </>)
                                : (<>
                                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span>Continue with Google</span>
                                </>)}

                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative">
                        <div className={`absolute inset-0 flex items-center ${theme === 'dark' ? 'text-gray-600' : 'text-gray-400'}`}>
                            <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}`} />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className={`px-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    {/* Email/Password Form */}
                    <form className="space-y-6" onSubmit={handleFormSubmit}>

                        {/* Email Field */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                                    }`} />
                                <input
                                    type="email"
                                    name='email'
                                    value={formData.email}
                                    onChange={handleFormData}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                    placeholder="john@example.com"
                                />
                            </div>
                            <span className='text-red-500'>{error && error.email}</span>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                Password
                            </label>
                            <div className="relative">
                                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                                    }`} />
                                <input
                                    type={showPassword == true ? 'text' : 'password'}
                                    name='password'
                                    value={formData.password}
                                    onChange={handleFormData}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${theme === 'dark'
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}

                                </button>
                            </div>
                            <span className='text-red-500'>{error && error.password}</span>
                        </div>

                        {/* Action button */}
                        <div className='flex items-center space-x-3'>

                            {/* Reset button */}
                            <button
                                type="reset"
                                disabled={loading}
                                className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
                            ${loading ? 'opacity-30 pointer-events-none' : ''} `}
                                onClick={handleResetForm}
                            >
                                {loading ? (
                                    <div className='flex items-center justify-center space-x-3'>
                                        <div className='animate-spin rounded-full h-5 w-5 border-b-3'></div>
                                        <div>Reset</div>
                                    </div>)
                                    : 'Reset'
                                }
                            </button>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors
                            ${loading ? 'opacity-30 pointer-events-none' : ''}
                            `}
                            >
                                {loading ? (
                                    <div className='flex items-center justify-center space-x-3'>
                                        <div className='animate-spin rounded-full h-5 w-5 border-b-3'></div>
                                        <div>Processing...</div>
                                    </div>)
                                    : 'Login'
                                }
                            </button>
                        </div>
                    </form>

                    {/* Footer */}
                    <div className="text-center">
                        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Don't have a account?{' '}
                            <Link to='/register' className={`font-medium ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
                                Sign Up
                            </Link>
                        </p>
                    </div>
                </div >
            </div >
        </>
    );
};
