import React from 'react';
import blazeTradeLogo from '../assets/blazetrade-logo.png';

const AuthHeader = ({ title, subtitle }) => {
  return (
    <header className="w-full py-4 bg-gray-900">
      <div className="container-custom flex flex-col items-center justify-center text-center">
        <img src={blazeTradeLogo} alt="BlazeTrade Logo" className="h-12 object-contain mb-4" />
        <h1 className="text-3xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
      </div>
    </header>
  );
};

export default AuthHeader;
