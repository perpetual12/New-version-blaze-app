import React from 'react';
import { Link } from 'react-router-dom';
import { FaEnvelopeOpenText } from 'react-icons/fa';

const CheckEmail = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        <FaEnvelopeOpenText className="text-6xl text-blue-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-4">Check Your Inbox</h1>
        <p className="text-gray-300 mb-6">
          We have sent a verification link to your email address. Please click the link to complete your registration.
        </p>
        <p className="text-gray-400 text-sm">
          Didn't receive the email? Check your spam folder or try signing up again.
        </p>
        <Link to="/login" className="mt-8 inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
          Back to Login
        </Link>
      </div>
    </div>
  );
};

export default CheckEmail;
