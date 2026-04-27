import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone, faUserPlus } from '@fortawesome/free-solid-svg-icons';
import VerifyOtp from '../components/VerifyOtp';

const Register = () => {
    const [userData, setUserData] = useState({
        name: '', email: '', password: '', phone: '', role: 'tenant'
    });
    const navigate = useNavigate();
    const api = useAxios();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/register', userData);
            
            if (response.data.success || response.data.message) {
                navigate('/verify-otp', {
                    state: { email: userData.email},
                });
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="flexCenter flex-col pt-32 pb-14 min-h-screen bg-linear-to-br from-[#fffbee] via-white to-[#f0f9ff]">
            <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-10 transform transition-all hover:shadow-2xl">
                <div className="flexCenter mb-6">
                    <div className="bg-secondary/20 p-4 rounded-full">
                        <FontAwesomeIcon icon={faUserPlus} className="text-3xl text-secondary" />
                    </div>
                </div>
                <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-2">Join EasyRent</h2>
                <p className="text-center text-slate-500 mb-8 regular-14">Find your perfect home in Nepal</p>
                
                <form onSubmit={handleRegister} className="flex flex-col gap-5">
                    <div className="relative">
                        <FontAwesomeIcon icon={faUser} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            name="name" 
                            placeholder="Full Name"
                            value={userData.name}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-medium"
                            required 
                        />
                    </div>
                    <div className="relative">
                        <FontAwesomeIcon icon={faEnvelope} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="email" 
                            name="email" 
                            placeholder="Email Address"
                            value={userData.email}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-medium"
                            required 
                        />
                    </div>
                    <div className="relative">
                        <FontAwesomeIcon icon={faLock} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="password" 
                            name="password" 
                            placeholder="Password"
                            value={userData.password}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-medium"
                            required 
                        />
                    </div>
                    <div className="relative">
                        <FontAwesomeIcon icon={faPhone} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="text" 
                            name="phone" 
                            placeholder="Phone Number"
                            value={userData.phone}
                            onChange={handleChange}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 transition-all font-medium"
                            required 
                        />
                    </div>
                    
                    <button onClick={handleRegister} type="submit" className="btn-secondary w-full rounded-xl py-3 font-bold shadow-lg shadow-secondary/20 active:scale-[0.98] transition-all">
                        Register
                    </button>
                </form>
                
                <div className="mt-8 text-center text-sm text-gray-500">
                    Already have an account? <Link to="/login" className="text-secondary font-bold hover:underline ml-1">Login here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
