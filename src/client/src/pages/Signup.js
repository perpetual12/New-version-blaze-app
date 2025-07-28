import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      await axios.post('/api/auth/signup', data);
      navigate('/check-email');
    } catch (error) {
      if (error.response && error.response.data.msg) {
        setServerError(error.response.data.msg);
      } else {
        setServerError('An unexpected error occurred. Please try again.');
      }
      console.error('Signup failed:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          
          {/* Form Section */}
          <div className="w-full max-w-md">
            <h1 className="text-4xl font-bold mb-4">Create an Account</h1>
            {serverError && <p className="mb-4 text-sm text-center text-red-500 bg-red-500/10 p-3 rounded-lg">{serverError}</p>}
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-400">Username</label>
                <input
                  type="text"
                  {...register('username', { required: 'Username is required' })}
                  className="w-full px-4 py-3 mt-1 bg-blue-900 border border-blue-800 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
                  placeholder="Choose a username"
                />
                {errors.username && <p className="mt-2 text-sm text-red-500">{errors.username.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Email</label>
                <input
                  type="email"
                  {...register('email', { required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Email is invalid' } })}
                  className="w-full px-4 py-3 mt-1 bg-blue-900 border border-blue-800 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
                  placeholder="Enter your email"
                />
                {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Password</label>
                <input
                  type="password"
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                  className="w-full px-4 py-3 mt-1 bg-blue-900 border border-blue-800 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
                  placeholder="Create a password"
                />
                {errors.password && <p className="mt-2 text-sm text-red-500">{errors.password.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400">Confirm Password</label>
                <input
                  type="password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === password || 'Passwords do not match'
                  })}
                  className="w-full px-4 py-3 mt-1 bg-blue-900 border border-blue-800 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && <p className="mt-2 text-sm text-red-500">{errors.confirmPassword.message}</p>}
              </div>

              <div className="flex items-start">
                <input
                  id="terms"
                  type="checkbox"
                  {...register('terms', { required: 'You must agree to the terms' })}
                  className="h-4 w-4 mt-1 text-blue-600 bg-blue-900 border-blue-800 rounded focus:ring-blue-500"
                />
                <div className="ml-3 text-sm">
                  <label htmlFor="terms" className="font-medium text-gray-400">
                    I agree to the <Link to="/terms" className="text-blue-400 hover:text-blue-300">Terms and Conditions</Link>
                  </label>
                  {errors.terms && <p className="mt-1 text-sm text-red-500">{errors.terms.message}</p>}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-blue-950 transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            </form>
            
            <p className="mt-6 text-sm text-center text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-blue-400 hover:text-blue-300">
                Log in
              </Link>
            </p>
          </div>

          {/* Info Section */}
          <div className="hidden md:flex flex-col items-center justify-center bg-blue-900/50 p-12 rounded-2xl border border-blue-800">
              <h2 className="text-2xl font-bold mb-4">Join BlazeTrade Today</h2>
              <p className="text-center text-gray-400">Access premium trading tools, real-time data, and a vibrant community. Your journey to smarter trading starts here.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;