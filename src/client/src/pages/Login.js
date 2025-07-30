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

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');

  const handleResendVerification = async () => {
    try {
      setIsSubmitting(true);
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/auth/resend-verification`,
        { email: unverifiedEmail },
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      
      if (response.data.success) {
        setServerError('Verification email resent. Please check your inbox.');
        setUnverifiedEmail('');
      } else {
        setServerError(response.data.message || 'Failed to resend verification email.');
      }
    } catch (error) {
      setServerError(error.response?.data?.message || 'An error occurred while resending the verification email.');
      console.error('Resend verification error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (formData) => {
    setIsSubmitting(true);
    setServerError('');
    setUnverifiedEmail('');
    
    // Log the form data exactly as received
    console.log('Form data from form:', formData);
    
    // Create the request data object explicitly
    const requestData = {
      email: formData.email,
      password: formData.password
    };
    
    console.log('Prepared request data:', requestData);
    
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5001'}/api/auth/login`;
      console.log('API URL:', apiUrl);
      
      console.log('Sending login request to:', apiUrl);
      console.log('Request data:', requestData);
      
      const response = await axios({
        method: 'post',
        url: apiUrl,
        data: requestData,
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 seconds timeout
      });
      
      console.log('Login response:', response);
      
      if (response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      // Log the complete error object with all its properties
      const errorDetails = {
        name: error.name,
        message: error.message,
        code: error.code,
        status: error.response?.status,
        responseData: error.response?.data,
        request: {
          method: error.config?.method,
          url: error.config?.url,
          data: error.config?.data,
          headers: error.config?.headers
        },
        stack: error.stack
      };
      
      console.error('=== LOGIN ERROR DETAILS ===');
      console.error(JSON.stringify(errorDetails, null, 2));
      console.error('==========================');
      
      // Log the raw error for full details
      const allErrorProperties = {};
      Object.getOwnPropertyNames(error).forEach(key => {
        allErrorProperties[key] = error[key];
      });
      console.error('Complete error object:', allErrorProperties);
      
      if (error.response) {
        // Handle 400 Bad Request
        if (error.response.status === 400) {
          setServerError(
            error.response.data.message || 
            error.response.data.msg || 
            'Invalid request. Please check your email and password.'
          );
          return;
        }
        
        // Handle 403 Forbidden (unverified email)
        if (error.response.status === 403 && error.response.data.unverified) {
          setUnverifiedEmail(error.response.data.email);
          setServerError('Please verify your email before logging in.');
          return;
        }
        
        // Handle other error responses
        setServerError(
          error.response.data.message || 
          error.response.data.msg || 
          `An error occurred during login. (Status: ${error.response.status})`
        );
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        setServerError('No response from server. Please check your connection and try again.');
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
        setServerError(`An error occurred: ${error.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderForm = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-400">Email</label>
          <input
            type="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full px-4 py-3 mt-1 bg-blue-900 border border-blue-800 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-white"
            placeholder="Enter your email"
          />
          {errors.email && <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>}
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