import React from 'react';
import blazeTradeLogo from '../assets/blazetrade-logo.png';

const AuthFooter = () => {
  return (
    <footer className="bg-gray-900 py-4">
      <div className="container-custom flex flex-col items-center justify-center">
        <img src={blazeTradeLogo} alt="BlazeTrade Logo" className="h-8 object-contain mb-2" />
        <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} BlazeTrade. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default AuthFooter;
