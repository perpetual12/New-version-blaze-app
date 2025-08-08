import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const EmailVerification = () => {
  const { token } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email address...');
  const effectRan = useRef(false);
  
  // Get the token from URL params or search params
  const verificationToken = token || searchParams.get('token');

  useEffect(() => {
    if (effectRan.current === false && verificationToken) {
      const verifyEmail = async () => {
        try {
          // Verify the email using the token
          const response = await axios.get(`/api/verify-email/${verificationToken}`, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true
          });
          
          if (response.data.success) {
            setVerificationStatus('success');
            setMessage('Your email has been verified successfully! You can now log in to your account.');
            
            // Redirect to login after 5 seconds
            setTimeout(() => {
              navigate('/login');
            }, 5000);
          } else {
            throw new Error(response.data.message || 'Verification failed');
          }
          
        } catch (err) {
          console.error('Verification error:', err);
          setVerificationStatus('error');
          
          if (err.response) {
            // Handle different error statuses
            if (err.response.status === 400) {
              setMessage('Invalid or expired verification token.');
            } else if (err.response.status === 500) {
              setMessage('Server error. Please try again later.');
            } else {
              setMessage(err.response.data?.message || 'An error occurred during verification.');
            }
          } else if (err.request) {
            setMessage('Could not connect to the server. Please check your internet connection.');
          } else {
            setMessage('An unexpected error occurred. Please try again.');
          }
        }
      };

      verifyEmail();
      
      // Mark that the effect has run
      return () => {
        effectRan.current = true;
      };
    }
  }, [verificationToken, navigate]);

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center w-full max-w-md">
        {verificationStatus === 'verifying' && (
          <>
            <div className="flex justify-center mb-6">
              <FaSpinner className="animate-spin text-blue-500 text-5xl" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Verifying Your Email</h1>
            <p className="text-gray-300">{message}</p>
          </>
        )}
        
        {verificationStatus === 'success' && (
          <>
            <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Email Verified Successfully!</h1>
            <p className="text-gray-300 mb-6">{message}</p>
            <div className="animate-pulse text-sm text-gray-400">
              Redirecting to login page...
            </div>
          </>
        )}
        
        {verificationStatus === 'error' && (
          <>
            <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-6" />
            <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
            <p className="text-gray-300 mb-6">{message}</p>
            <div className="flex flex-col space-y-3">
              <Link 
                to="/signup" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
              >
                Sign Up Again
              </Link>
              <Link 
                to="/login" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
              >
                Go to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
