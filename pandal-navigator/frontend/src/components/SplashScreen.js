import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SplashScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [showDhunuchi, setShowDhunuchi] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Show dhunuchi animation after 1 second
    const dhunuchiTimer = setTimeout(() => {
      setShowDhunuchi(true);
    }, 1000);

    // Hide splash screen after 4 seconds
    const splashTimer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        navigate('/');
      }, 500);
    }, 4000);

    return () => {
      clearTimeout(dhunuchiTimer);
      clearTimeout(splashTimer);
    };
  }, [navigate]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-festive opacity-0 transition-opacity duration-500" />
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-festive flex flex-col items-center justify-center z-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 text-6xl opacity-30">🪷</div>
        <div className="absolute top-40 right-16 text-4xl opacity-25">🐚</div>
        <div className="absolute bottom-32 left-20 text-5xl opacity-20">🪔</div>
        <div className="absolute bottom-20 right-12 text-3xl opacity-30">🌺</div>
        <div className="absolute top-60 left-1/3 text-4xl opacity-20">🕉️</div>
        <div className="absolute top-32 right-1/3 text-5xl opacity-25">🪷</div>
      </div>

      {/* Main Content */}
      <div className="text-center z-10 fade-in">
        {/* Maa Durga Eyes Illustration */}
        <div className="relative mb-8">
          <div className="w-32 h-32 mx-auto bg-white rounded-full shadow-2xl flex items-center justify-center dhunuchi-glow">
            <div className="text-6xl">👁️</div>
          </div>
          
          {/* Dhunuchi Smoke Animation */}
          {showDhunuchi && (
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <div className="smoke-animation text-4xl">💨</div>
              <div className="smoke-animation text-3xl opacity-70" style={{ animationDelay: '0.5s' }}>💨</div>
              <div className="smoke-animation text-2xl opacity-50" style={{ animationDelay: '1s' }}>💨</div>
            </div>
          )}
        </div>

        {/* App Title */}
        <div className="mb-6">
          <h1 className="font-festive text-white text-4xl md:text-5xl font-bold mb-2">
            দুর্গা পূজা
          </h1>
          <h2 className="font-festive text-cream text-2xl md:text-3xl font-semibold">
            Pandal Navigator
          </h2>
        </div>

        {/* Subtitle */}
        <p className="text-white text-lg md:text-xl opacity-90 mb-8 max-w-md mx-auto px-4">
          Your divine guide to the most beautiful pandals in Kolkata
        </p>

        {/* Loading Animation */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>

        {/* Quick Start Hint */}
        <div className="mt-8">
          <p className="text-white text-sm opacity-75">
            আসছে আনন্দের দিন... 🙏
          </p>
        </div>
      </div>

      {/* Bottom Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
      
      {/* Floating Marigold Petals */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 text-yellow-300 text-2xl opacity-60 animate-pulse">🌸</div>
        <div className="absolute top-3/4 right-1/4 text-yellow-300 text-xl opacity-50 animate-pulse" style={{ animationDelay: '1s' }}>🌸</div>
        <div className="absolute top-1/2 left-3/4 text-yellow-300 text-lg opacity-40 animate-pulse" style={{ animationDelay: '2s' }}>🌸</div>
      </div>
    </div>
  );
};

export default SplashScreen;