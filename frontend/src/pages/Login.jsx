import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import useAxios from '../hooks/useAxios';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';



const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '', role: 'tenant' });
  const [loading, setLoading] = useState(false);
  const { loadUserData } = useAppContext();
  const navigate = useNavigate();
  const api = useAxios();




  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };



  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await api.post('/auth/login', credentials);

      if (response.data.success) {
        const user = await loadUserData();
        const currentRole = user?.currentActiveRole || 
          (Array.isArray(user?.role) ? user?.role?.[0] : user?.role);
        const userRole = currentRole || response?.data?.user?.role;

        toast.success('Logged in successfully');

        // Redirect based on role
        if (userRole === 'owner') navigate('/owner');
        else if (userRole === 'tenant') navigate('/listing');
        else navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flexCenter flex-col pt-32 pb-14 min-h-screen bg-linear-to-br from-[#fffbee] via-white to-[#f0f9ff]">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 p-10 transform transition-all hover:shadow-2xl">
        <button className="h-5 w-5 mb-4" onClick={() => navigate("/")}>
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <div className="flex justify-center mb-6">
          <div className="bg-secondary/20 p-4 rounded-full flex items-center justify-center shadow-md">
            <img className="h-8 w-8" src="/favicon.svg" alt="logo" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-center text-slate-500 mb-8">
          Login to access your property dashboard
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div className="relative">
            <FontAwesomeIcon
              icon={faEnvelope}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
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
            <FontAwesomeIcon
              icon={faLock}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
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

          <button
            type="submit"
            disabled={loading}
            className={`btn-secondary w-full rounded-xl py-3 font-bold shadow-lg transition-all 
              ${loading ? "opacity-70 cursor-not-allowed" : "active:scale-[0.98]"}`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-secondary font-bold hover:underline ml-1"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;