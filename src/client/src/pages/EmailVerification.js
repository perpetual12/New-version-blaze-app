import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const EmailVerification = () => {
  const { token } = useParams();
  const [verificationStatus, setVerificationStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email address...');
  const effectRan = useRef(false);

  useEffect(() => {
    if (effectRan.current === false) {
      const verifyEmail = async () => {
        try {
          const res = await axios.get(`/api/auth/verify-email/${token}`);
          setVerificationStatus('success');
          setMessage(res.data.msg);
        } catch (err) {
          setVerificationStatus('error');
          setMessage(err.response?.data?.msg || 'An error occurred during verification.');
        }
      };

      if (token) {
        verifyEmail();
      }

      // Mark that the effect has run
      return () => {
        effectRan.current = true;
      };
    }
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        {verificationStatus === 'verifying' && (
          <div className="animate-pulse text-blue-500 text-4xl mb-4">...</div>
        )}
        {verificationStatus === 'success' && (
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
        )}
        {verificationStatus === 'error' && (
          <FaTimesCircle className="text-6xl text-red-500 mx-auto mb-6" />
        )}
        <h1 className="text-2xl font-bold mb-4">
          {verificationStatus === 'success' ? 'Verification Successful' : 'Verification Failed'}
        </h1>
        <p className="text-gray-300 mb-8">{message}</p>
        <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          Proceed to Login
        </Link>
      </div>
    </div>
  );
};

export default EmailVerification;
