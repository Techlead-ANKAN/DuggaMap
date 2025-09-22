import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Custom CSS for white background removal
const logoStyles = `
  .logo-no-white {
    /* Advanced white background removal */
    background: transparent !important;
    
    /* Method 1: Color-based filtering to make white areas transparent */
    filter: 
      brightness(0.98)     /* Slightly darken to match off-white bg */
      contrast(1.15)       /* Enhance image contrast */
      saturate(1.1)        /* Boost color saturation */
      hue-rotate(2deg);    /* Slight color adjustment */
    
    /* Method 2: Blending mode to merge with background */
    mix-blend-mode: multiply;
    
    /* Method 3: Remove any imposed backgrounds */
    box-shadow: none;
    border: none;
    outline: none;
    
    /* Smooth transitions */
    transition: all 0.3s ease;
  }
  
  .logo-no-white:hover {
    transform: scale(1.02);
    filter: 
      brightness(0.98)
      contrast(1.15)
      saturate(1.1)
      hue-rotate(2deg)
      drop-shadow(0 4px 12px rgba(0,0,0,0.15));
  }
  
  .logo-container {
    background: transparent !important;
    backdrop-filter: none;
    
    /* Create a subtle background that matches the page */
    background: linear-gradient(
      135deg, 
      rgba(254, 252, 243, 0.8) 0%,    /* cream with transparency */
      rgba(250, 248, 241, 0.8) 100%   /* off-white with transparency */
    ) !important;
    
    border-radius: 20px;
    padding: 1.5rem;
    
    /* Subtle shadow for depth */
    box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  }
`;

const SplashScreen = ({ onFinish }) => {
  const playAudioAndContinue = async () => {
    try {
      const audio = new Audio('/splash_screen.mp3');
      await audio.play();
      
      // Wait for audio to finish (4 seconds) then call onFinish
      setTimeout(() => {
        onFinish();
      }, 4000);
    } catch (err) {
      console.log('Audio play failed:', err);
      // If audio fails, still continue after a brief delay
      setTimeout(() => {
        onFinish();
      }, 1000);
    }
  };

  return (
    <>
      {/* Inject custom styles */}
      <style>{logoStyles}</style>
      
      <div className="fixed inset-0 bg-gradient-to-br from-cream to-off-white flex flex-col items-center justify-center z-50 p-8">
        {/* Logo Container */}
        <div className="flex-1 flex items-center justify-center mb-8">
          <div className="relative logo-container">
            <img
              src="/durga_image.jpg"
              alt="Durga Puja Logo"
              className="max-w-full max-h-full object-contain w-auto h-auto logo-no-white"
              style={{
                maxWidth: '80vw',
                maxHeight: '50vh'
              }}
            />
          </div>
        </div>
        
        {/* Button Container */}
        <div className="text-center mb-16">
          <button
            onClick={playAudioAndContinue}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse"
          >
            দেবীর আহ্বান
          </button>
        </div>
      </div>
    </>
  );
};

export default SplashScreen;