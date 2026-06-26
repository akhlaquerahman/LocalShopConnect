import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-white text-foreground">
      {/* Left Side - Form Area */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10">
        
        {/* Decorative elements or simple background if needed, but keeping it white as per image */}
        <div className="w-full max-w-md bg-white border border-gray-100 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 sm:p-10 z-20">
          <Outlet />
        </div>
        
      </div>

      {/* Right Side - Illustration Area */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#FFF5F2] flex-col items-center justify-center relative overflow-hidden">
        {/* Simple decorative SVG matching the e-commerce/shopping vibe */}
        <div className="relative w-full max-w-lg z-10">
          <svg viewBox="0 0 500 400" className="w-full h-auto drop-shadow-xl" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Background elements */}
            <path d="M50 200 H150 M100 150 H200 M350 250 H450 M300 300 H400 M150 350 H250" stroke="#FCD3C1" strokeWidth="2" strokeLinecap="round"/>
            
            {/* Person */}
            <path d="M350 350 V250 Q350 200 320 200 H300 Q270 200 270 250 V350" fill="#1C1E26"/>
            <circle cx="310" cy="170" r="25" fill="#1C1E26"/>
            <path d="M280 230 L260 280 H360 L340 230 Z" fill="#F47560"/>
            <rect x="290" y="250" width="40" height="50" rx="4" fill="#F9C3B1"/>
            
            {/* Shopping Cart */}
            <path d="M80 350 L120 250 H250 L220 350 H80 Z" stroke="#1C1E26" strokeWidth="3" fill="none"/>
            <path d="M120 250 L100 210 H50" stroke="#1C1E26" strokeWidth="3" fill="none" strokeLinecap="round"/>
            <circle cx="100" cy="370" r="10" fill="#1C1E26"/>
            <circle cx="200" cy="370" r="10" fill="#1C1E26"/>
            
            {/* Items in cart */}
            <rect x="130" y="270" width="60" height="40" fill="#00E676" stroke="#1C1E26" strokeWidth="2" transform="rotate(-15 130 270)"/>
            <circle cx="210" cy="270" r="25" fill="#F47560" stroke="#1C1E26" strokeWidth="2"/>
            <rect x="170" y="300" width="40" height="40" fill="#2979FF" stroke="#1C1E26" strokeWidth="2" transform="rotate(10 170 300)"/>
            
            {/* Grid lines in cart */}
            <path d="M90 320 H230 M100 285 H240 M140 250 L120 350 M190 250 L170 350" stroke="#1C1E26" strokeWidth="2"/>
            
            {/* Leaf decorative */}
            <path d="M50 350 Q70 320 90 350 Q70 380 50 350" fill="#F47560"/>
            <path d="M50 350 Q30 320 10 350 Q30 380 50 350" fill="#1C1E26"/>
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-[#FFF5F2] border-t border-[#FCD3C1]"></div>
      </div>
    </div>
  );
};

export default AuthLayout;
