// Mock registration form with all required fields
import { User, Mail, Lock, Phone, Eye, EyeOff, MessageCircle, Sun, Moon } from 'lucide-react';
import { ThemeContext } from './Theme';
import { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { Firebase } from './Firebase';
import { Link, useNavigate } from 'react-router';
import { getDatabase, ref, set } from 'firebase/database';

export const RegistrationComponent = () => {

    const { theme, setTheme } = useContext(ThemeContext)
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        image: undefined,
        password: ''
    })

    const [error, setError] = useState({
        username: '',
        email: '',
        image: '',
        password: ''
    })

    const [check, setCheck] = useState({
        username: false,
        email: false,
        password: false,
    })
    const navigate = useNavigate()

    // handle form data
    function handleFormData(e) {
        const { name, value } = e.target;

        setFormData((prev) => ({ ...prev, [name]: value }));

        // name
        if (name == 'username') {
            const nameRef = /^[a-zA-Z0-9]+$/;
            if (value.trim() == '') {
                setError((prev) => ({ ...prev, username: "Enter name" }));
                setCheck((prev) => ({ ...prev, username: false }));
            }
            else if (!nameRef.test(value.trim())) {
                setError((prev) => ({ ...prev, username: "Invalid name" }));
                setCheck((prev) => ({ ...prev, username: false }));
            }
            else {
                setError((prev) => ({ ...prev, username: "" }));
                setCheck((prev) => ({ ...prev, username: true }));
            }
        }

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

    async function handleFileUpload(e) {
        const file = e.target.files[0];
        if (!file) return
        const data = new FormData()
        data.append("file", file);
        data.append("upload_preset", "Chat_Application")
        data.append("cloud_name", "doxycgigf")

        const res = await fetch('https://api.cloudinary.com/v1_1/doxycgigf/image/upload', {
            method: "POST",
            body: data
        })

        const uploadedImageUrl = await res.json();
        setFormData({ image: uploadedImageUrl.url });
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
            createUserWithEmailAndPassword(auth, formData.email, formData.password)
                .then(async (userCredential) => {
                    toast.success('Register Successful');
                    const user = userCredential.user
                    const db = getDatabase(Firebase)
                    const profileImage = formData.image != undefined ? formData.image : 'https://res.cloudinary.com/doxycgigf/image/upload/v1758604889/chat-avatart_ifaiiz.png';
                    await set(ref(db, `usersData/${user.uid}`), {
                        id: user.uid,
                        name: formData.username,
                        email: formData.email,
                        photo: profileImage,
                        blocked: []
                    });
                    setFormData({ name: '', email: '', number: '', password: '', image: '' })
                    setLoading(false);
                    navigate('/user')
                })
                .catch((error) => {
                    console.log(error.code);
                    if (error.code == 'auth/email-already-in-use') {
                        toast.error('User Already exists');
                        setLoading(false);
                    }
                    else {
                        toast.error('something went wrong', error.code);
                        setLoading(false);
                    }
                })
        };
    }

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 py-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
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
                        Create Account
                    </h2>
                    <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Join QuickChat and start chatting
                    </p>
                </div>

                {/* Registration Form */}
                <form className="space-y-6" onSubmit={handleFormSubmit}>

                    {/* Username Field */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Username
                        </label>
                        <div className="relative">
                            <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                                }`} />
                            <input
                                type="text"
                                name='username'
                                value={formData.username}
                                onChange={handleFormData}
                                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
                                placeholder="johndoe"
                            />
                        </div>
                        <span className='text-red-500'>{error && error.username}</span>
                    </div>

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
                                placeholder="•••••"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <EyeOff className="w-5 h-5" />
                            </button>
                        </div>
                        <span className='text-red-500'>{error && error.password}</span>
                    </div>

                    {/* profile image */}
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Profile Photo (optional)
                        </label>
                        <div className="relative">
                            <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                                }`} />
                            <input
                                type='file'
                                name='profilePhoto'
                                onChange={handleFileUpload}
                                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${theme === 'dark'
                                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                    }`}
                            />
                        </div>
                    </div>

                    {/* Image preview */}
                    <div className={`items-center space-x-3 ${formData.image == undefined ? 'hidden' : 'flex'}`}>
                        <h3>Image Preview</h3>
                        <img className='h-8 w-8 my-2 rounded-full' src={formData.image} alt="" />
                    </div>

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
                                <div>Creating Account...</div>
                            </div>)
                            : 'Create Account'
                        }
                    </button>
                </form>

                {/* Footer */}
                <div className="text-center">
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        Already have an account?{' '}
                        <Link to="/" className={`font-medium ${theme === 'dark' ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'}`}>
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
