import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faPhone, faUserPlus, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';


const provinceEnum = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];


const Register = () => {
    const [userData, setUserData] = useState({
        name: '', email: '', password: '', phone: '', role: 'tenant', location: { province: '', district: '', city: '', tole: '' }
    });
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate();
    const api = useAxios();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [name]: value
            }
        }));
    };



    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true)
        
        try {
            const response = await api.post("/auth/register", userData);

            //  Success (OTP sent)
            if (response.data.success) {
                localStorage.setItem("verifyEmail", userData.email);
                localStorage.setItem("verifyRole", userData.role);
                toast.success(response.data.message || "OTP sent to email. Please verify.");
                navigate("/verify-otp", {
                    state: { email: userData.email, role: userData.role },
                });
            }
        } catch (error) {
            setLoading(false)
            // const status = error.response?.status;
            const message = error.response?.data?.message;

            // // If user already exists → still go to OTP page
            // if (status === 400 && message?.includes("already exists")) {
            //     toast.info("User already exists. Please verify OTP sent to your email.");
            //     localStorage.setItem("verifyEmail", userData.email);
            //     localStorage.setItem("verifyRole", userData.role);
            //     navigate("/verify-otp", {
            //         state: { email: userData.email, role: userData.role },
            //     });
            //     return;
            // }

            toast.error(message || "Registration failed");
        } finally {
            setLoading(false)
        }
    };



    return (
    <div className="flex items-center justify-center px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-linear-to-br from-[#fffbee] via-white to-[#f0f9ff]">
        <div className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-6 sm:p-8 md:p-10">

            {/* Icon */}
            <div className="flex justify-center mb-5 sm:mb-6">
            <div className="bg-secondary/20 p-3 sm:p-4 rounded-full">
                <FontAwesomeIcon icon={faUserPlus} className="text-2xl sm:text-3xl text-secondary" />
            </div>
            </div>

            {/* Heading */}
            <h2 className="text-2xl sm:text-3xl font-extrabold text-center text-slate-800 mb-2">
            Join EasyRent
            </h2>
            <p className="text-center text-slate-500 mb-6 sm:mb-8 text-sm sm:text-base">
            Find your perfect home in Nepal
            </p>

            {/* Form */}
            <form onSubmit={handleRegister} className="flex flex-col gap-4 sm:gap-5">

            {/* Input Field Template */}
            {[
                { icon: faUser, name: "name", type: "text", placeholder: "Full Name" },
                { icon: faEnvelope, name: "email", type: "email", placeholder: "Email Address" },
                { icon: faPhone, name: "phone", type: "text", placeholder: "Phone Number" },
            ].map((field) => (
                <div key={field.name} className="relative">
                <FontAwesomeIcon icon={field.icon} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm sm:text-base" />
                <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={userData[field.name]}
                    onChange={handleChange}
                    className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50"
                    required
                />
                </div>
            ))}

            {/* Province */}
            <div className="relative">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <select
                name="province"
                value={userData.location.province}
                onChange={handleLocationChange}
                className="w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 text-sm sm:text-base bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50"
                required
                >
                <option value="">Select Province</option>
                {provinceEnum.map((province) => (
                    <option key={province} value={province}>{province}</option>
                ))}
                </select>
            </div>

            {/* District & City in grid (responsive) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                type="text"
                name="district"
                placeholder="District"
                value={userData.location.district}
                onChange={handleLocationChange}
                className="w-full px-3 py-2.5 sm:py-3 text-sm sm:text-base border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50"
                required
                />

                <input
                type="text"
                name="city"
                placeholder="City"
                value={userData.location.city}
                onChange={handleLocationChange}
                className="w-full px-3 py-2.5 sm:py-3 text-sm sm:text-base border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50"
                required
                />
            </div>

            {/* Password */}
            <div className="relative">
                <FontAwesomeIcon icon={faLock} className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                type="password"
                name="password"
                placeholder="Password"
                value={userData.password}
                onChange={handleChange}
                className="w-full pl-10 sm:pl-12 pr-3 py-2.5 sm:py-3 text-sm sm:text-base border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50"
                required
                />
            </div>

            {/* Button */}
            <button
                type="submit"
                disabled={loading}
                className="btn-secondary w-full rounded-xl py-2.5 sm:py-3 text-sm sm:text-base font-bold shadow-lg shadow-secondary/20 active:scale-[0.98]"
            >
                {loading ? "Registering..." : "Register"}
            </button>
            </form>

            {/* Footer */}
            <div className="mt-6 sm:mt-8 text-center text-xs sm:text-sm text-gray-500">
            Already have an account?
            <Link to="/login" className="text-secondary font-bold hover:underline ml-1">
                Login here
            </Link>
            </div>

        </div>
    </div>
    );
};

export default Register;
