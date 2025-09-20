import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="fixed inset-0 bg-slate-50 flex items-center justify-center z-50">
      {/* Logo Image */}
      <div className="w-full h-full flex flex-col items-center justify-center p-8">
        <img
          src="/durga_image.jpg"
          alt="Durga Puja Logo"
          className="max-w-full max-h-full object-contain w-auto h-auto mb-8 logo-transparent"
          style={{
            maxWidth: '70vw',
            maxHeight: '60vh'
          }}
        />
        
        {/* Always show the button - user must click to continue */}
        <div className="text-center">
          <button
            onClick={playAudioAndContinue}
            className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 transform hover:scale-105 shadow-lg animate-pulse"
          >
            দেবীর আহ্বান
          </button>
          {/* <p className="text-gray-600 text-sm mt-4">
            দেবীর আহ্বান
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;