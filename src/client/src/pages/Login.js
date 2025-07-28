import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import blazeTradeLogo from '../assets/blazetrade-logo.png';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('/api/auth/login', data);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (error) {
      if (error.response && error.response.data.msg) {
        setServerError(error.response.data.msg);
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
      console.error('Login failed:', error);
    }
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400">Username</label>
          <input
            type="text"
            {...register('username', { required: 'Username is required' })}
            className="w-full px-4 py-3 mt-1 bg-blue-900 border border-blue-800 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
            placeholder="Enter your username"
          />
          {errors.username && <p className="mt-2 text-sm text-red-500">{errors.username.message}</p>}
        </div>
        <div>
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-gray-400">Password</label>
            <Link to="/forgot-password" className="text-sm text-blue-400 hover:text-blue-300">Forgot Password?</Link>
          </div>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="w-full px-4 py-3 mt-1 bg-blue-900 border border-blue-800 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
            placeholder="Enter password"
          />
          {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <div>
          <button
            type="submit"
            className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-blue-950 transition duration-300"
          >
            Log In
          </button>
        </div>
      </form>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          {/* Form Section */}
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold mb-4">Log In</h1>
            {serverError && <p className="mb-4 text-sm text-center text-red-500 bg-red-500/10 p-3 rounded-lg">{serverError}</p>}
            {renderForm()}
            <p className="mt-6 text-sm text-center text-gray-400">
              Don't have an account?{' '}
              <Link to="/signup" className="font-medium text-blue-400 hover:text-blue-300">
                Sign up
              </Link>
            </p>
          </div>

          {/* Logo Section */}
          <div className="hidden md:flex flex-col items-center justify-center">
              <img src={blazeTradeLogo} alt="BlazeTrade Logo" className="w-48 h-48 object-contain"/>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;