import { useUserLocation } from '@/contexts/LocationContext.jsx';
import React, { useState, useEffect } from 'react';

const LocationModal = () => {
  const { location, requestLocation, isLoading } = useUserLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [dontAskAgain, setDontAskAgain] = useState(false);

useEffect(() => {
  const suppressPrompt = localStorage.getItem('suppressLocationPrompt');
  if (!isLoading && !location.lat && !suppressPrompt) {
    const timer = setTimeout(() => setIsOpen(true), 1500); 
    return () => clearTimeout(timer);
  }
}, [location, isLoading]);

  const handleAllow = () => {
    requestLocation();
    setIsOpen(false);
  };

  const handleClose = () => {
    if (dontAskAgain) {
      localStorage.setItem('suppressLocationPrompt', 'true');
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    // Overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden transform transition-all scale-100">
        
        {/* Header / Icon */}
        <div className="bg-green-50 p-6 flex justify-center">
          <div className="bg-green-100 p-4 rounded-full">
            {/* Simple Map Pin SVG Icon */}
            <svg 
              className="w-8 h-8 text-[#0A6C6D]" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Enable Location Services?
          </h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            To show you the closest vendors, best deals, and accurate delivery times, we need access to your location.
          </p>

          {/* Checkbox */}
          <div className="flex items-center justify-center space-x-2 mb-6">
            <input 
              type="checkbox" 
              id="dontAsk" 
              className="w-4 h-4 text-[#0A6C6D] border-gray-300 rounded focus:ring-[#0A6C6D] cursor-pointer"
              checked={dontAskAgain}
              onChange={(e) => setDontAskAgain(e.target.checked)}
            />
            <label htmlFor="dontAsk" className="text-sm text-gray-600 cursor-pointer select-none">
              Don't ask me again
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button 
              onClick={handleClose}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors"
            >
              Not Now
            </button>
            <button 
              onClick={handleAllow}
              className="flex-1 px-4 py-2.5 bg-[#0A6C6D] text-white text-sm font-semibold rounded-lg hover:bg-[#08577C] shadow-md transition-colors"
            >
              Allow Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;