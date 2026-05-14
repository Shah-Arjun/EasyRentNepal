import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faKey, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const VerifyOtpForReset = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const api = useAxios();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      toast.error("Session expired. Please request OTP again.");
      navigate('/forgot-password');
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return toast.error("Please enter the OTP");
    
    setLoading(true);
    try {
      const response = await api.post('/auth/verifyOtp', { email, otp });
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/reset-password');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flexCenter flex-col pt-32 pb-14 min-h-screen bg-linear-to-br from-[#fffbee] via-white to-[#f0f9ff]">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-10 transform transition-all hover:shadow-2xl">
        <button 
          className="h-5 w-5 mb-4 text-slate-600 hover:text-secondary transition-colors" 
          onClick={() => navigate("/forgot-password")}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        
        <div className="flex justify-center mb-6">
          <div className="bg-secondary/20 p-4 rounded-full flex items-center justify-center shadow-md">
            <img className="h-8 w-8" src="/favicon.svg" alt="logo" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-2">
          Verify OTP
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Enter the 6-digit code sent to <strong>{email}</strong>
        </p>

        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-6">
          <div className="relative">
            <FontAwesomeIcon
              icon={faKey}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              placeholder="Enter OTP Code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 transition-all text-center tracking-widest font-bold text-xl"
              maxLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`btn-secondary w-full rounded-xl py-3 font-bold shadow-lg transition-all 
              ${loading ? "opacity-70 cursor-not-allowed" : "active:scale-[0.98]"}`}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Didn't receive code?{" "}
          <button
            onClick={() => navigate('/forgot-password')}
            className="text-secondary font-bold hover:underline ml-1"
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpForReset;
