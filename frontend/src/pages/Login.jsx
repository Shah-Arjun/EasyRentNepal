import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-toastify';
import useAxios from '../hooks/useAxios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faRightToBracket } from '@fortawesome/free-solid-svg-icons';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '', role: 'tenant' });
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [userId, setUserId] = useState(null);

    const { loadUserData } = useAppContext();
    const navigate = useNavigate();
    const api = useAxios();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({ ...prev, [name]: value }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const deviceToken = localStorage.getItem('deviceToken');
            const response = await api.post('/auth/login', { ...credentials, deviceToken });
            if (response.data.isOtpStep) {
                setShowOtp(true);
                setUserId(response.data.userId);
                toast.success(response.data.message || 'OTP sent to your email');
            } else if (response.data.success || response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.deviceToken) {
                    localStorage.setItem('deviceToken', response.data.deviceToken);
                }
                await loadUserData(); // Refresh context
                toast.success(response.data.message || 'Logged in successfully');
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Login failed');
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/verifyLoginOtp', { userId, otp });
            if (response.data.success || response.data.token) {
                localStorage.setItem('token', response.data.token);
                if (response.data.deviceToken) {
                    localStorage.setItem('deviceToken', response.data.deviceToken);
                }
                await loadUserData(); // Refresh context
                toast.success('Logged in successfully');
                navigate('/');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Invalid OTP');
        }
    };

    return (
        <div className="flexCenter flex-col pt-32 pb-14 min-h-screen bg-linear-to-br from-[#fffbee] via-white to-[#f0f9ff]">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-10 transform transition-all hover:shadow-2xl">
                <div className="flexCenter mb-6">
                    <div className="bg-secondary/20 p-4 rounded-full">
                        <FontAwesomeIcon icon={faRightToBracket} className="text-3xl text-secondary" />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-2">Welcome Back</h2>
                <p className="text-center text-slate-500 mb-8 regular-14">
                    {!showOtp ? 'Login to access your property dashboard' : 'Enter the OTP sent to your email'}
                </p>
                
                {!showOtp ? (
                <form onSubmit={handleLogin} className="flex flex-col gap-5">
                    <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email Address"
                            value={credentials.email}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                            required 
                        />
                    </div>
                    <div className="relative">
                        <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password"
                            value={credentials.password}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="btn-secondary w-full rounded-xl py-3 font-bold shadow-lg shadow-secondary/20 active:scale-[0.98] transition-all">
                        Login
                    </button>
                </form>
                ) : (
                <form onSubmit={handleVerifyOtp} className="flex flex-col gap-5">
                    <div className="relative">
                        <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            name="otp" 
                            placeholder="Enter 4-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
                            required 
                        />
                    </div>
                    
                    <button type="submit" className="btn-secondary w-full rounded-xl py-3 font-bold shadow-lg shadow-secondary/20 active:scale-[0.98] transition-all">
                        Verify OTP
                    </button>
                    <button type="button" onClick={() => setShowOtp(false)} className="text-sm text-slate-500 hover:text-secondary font-semibold transition-colors mt-2">
                        Back to Login
                    </button>
                </form>
                )}
                
                <div className="mt-8 text-center text-sm text-gray-500">
                    Don't have an account? <Link to="/register" className="text-secondary font-bold hover:underline ml-1">Create Account</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;
