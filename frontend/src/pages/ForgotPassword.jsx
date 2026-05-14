import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const api = useAxios();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Please enter your email");
    
    setLoading(true);
    try {
      const response = await api.post('/auth/forgetPassword', { email });
      if (response.data.success) {
        toast.success(response.data.message);
        // Store email in sessionStorage to use in next steps
        sessionStorage.setItem('resetEmail', email);
        navigate('/verify-reset-otp');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flexCenter flex-col pt-32 pb-14 min-h-screen bg-linear-to-br from-[#fffbee] via-white to-[#f0f9ff]">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-10 transform transition-all hover:shadow-2xl">
        <button 
          className="h-5 w-5 mb-4 text-slate-600 hover:text-secondary transition-colors" 
          onClick={() => navigate("/login")}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        
        <div className="flex justify-center mb-6">
          <div className="bg-secondary/20 p-4 rounded-full flex items-center justify-center shadow-md">
            <img className="h-8 w-8" src="/favicon.svg" alt="logo" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-2">
          Forgot Password?
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Enter your email to receive a password reset OTP
        </p>

        <form onSubmit={handleSendOtp} className="flex flex-col gap-6">
          <div className="relative">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-secondary w-full rounded-xl py-3 font-bold shadow-lg transition-all 
              ${loading ? "opacity-70 cursor-not-allowed" : "active:scale-[0.98]"}`}
          >
            {loading ? "Sending OTP..." : "Send OTP"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Remember your password?{" "}
          <Link
            to="/login"
            className="text-secondary font-bold hover:underline ml-1"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
