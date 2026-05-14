import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const api = useAxios();

  useEffect(() => {
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      toast.error("Session expired. Please start over.");
      navigate('/forgot-password');
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const { newPassword, confirmPassword } = formData;

    if (newPassword.length < 8) return toast.error("Password must be at least 8 characters");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");
    
    setLoading(true);
    try {
      const response = await api.post('/auth/resetPassword', { 
        email, 
        newPassword, 
        confirmPassword 
      });
      
      if (response.data.success) {
        toast.success(response.data.message);
        sessionStorage.removeItem('resetEmail'); // Cleanup
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flexCenter flex-col pt-32 pb-14 min-h-screen bg-linear-to-br from-[#fffbee] via-white to-[#f0f9ff]">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-10 transform transition-all hover:shadow-2xl">
        
        <div className="flex justify-center mb-6">
          <div className="bg-secondary/20 p-4 rounded-full flex items-center justify-center shadow-md">
            <FontAwesomeIcon icon={faCheckCircle} className="h-8 w-8 text-secondary" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-2">
          New Password
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Set a secure password for <strong>{email}</strong>
        </p>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
          <div className="relative">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-secondary/50 transition-all"
              required
            />
          </div>

          <div className="relative">
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
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
            {loading ? "Resetting..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
