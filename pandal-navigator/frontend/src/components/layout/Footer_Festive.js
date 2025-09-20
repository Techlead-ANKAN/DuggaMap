import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Star } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-midnight-blue to-midnight-blue-light text-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-20 text-6xl">🪷</div>
        <div className="absolute top-20 right-32 text-4xl">🐚</div>
        <div className="absolute bottom-20 left-32 text-5xl">🪔</div>
        <div className="absolute bottom-10 right-20 text-3xl">🌺</div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl">🪔</span>
                </div>
                <div>
                  <h3 className="font-festive text-xl font-bold text-gold">
                    Durga Puja Pandals Navigator
                  </h3>
                  <p className="text-sm text-gray-300">
                    Your Puja companion
                  </p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 max-w-md">
                Discover Kolkata's most beautiful pandals and make your Puja journey more joyful. Wishing a safe and blessed festival to all.
              </p>

              <div className="flex items-center space-x-2 text-gold">
                <Heart className="h-4 w-4 fill-current" />
                <span className="text-sm">Made with love for Durga Puja</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-festive text-lg font-semibold text-gold mb-4">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li>
                  <Link 
                    to="/pandals" 
                    className="text-gray-300 hover:text-gold transition-colors duration-300 flex items-center space-x-2"
                  >
                    <Star className="h-4 w-4" />
                    <span>All Pandals</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/eateries" 
                    className="text-gray-300 hover:text-gold transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span>🍽️</span>
                    <span>Eateries</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/plan-route" 
                    className="text-gray-300 hover:text-gold transition-colors duration-300 flex items-center space-x-2"
                  >
                    <span>🗺️</span>
                    <span>Plan Route</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/favorites" 
                    className="text-gray-300 hover:text-gold transition-colors duration-300 flex items-center space-x-2"
                  >
                    <Heart className="h-4 w-4" />
                    <span>Favorites</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-festive text-lg font-semibold text-gold mb-4">
                যোগাযোগ
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gold mt-0.5" />
                  <div>
                    <p className="text-gray-300">Kolkata, West Bengal</p>
                    <p className="text-sm text-gray-400">India</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gold" />
                  <a 
                    href="mailto:info@pandalnavigator.com" 
                    className="text-gray-300 hover:text-gold transition-colors duration-300"
                  >
                    info@pandalnavigator.com
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gold" />
                  <a 
                    href="tel:+919876543210" 
                    className="text-gray-300 hover:text-gold transition-colors duration-300"
                  >
                    +91 98765 43210
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gold/20 bg-black/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              
              {/* Copyright */}
              <div className="text-center md:text-left">
                <p className="text-gray-300 text-sm">
                  © {currentYear} Durga Puja Pandals Navigator. All rights reserved.
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Made with ❤️ for Durga Puja devotees
                </p>
              </div>

              {/* Blessing */}
              <div className="text-center">
                <p className="text-gold font-festive text-lg">
                  May Maa Durga bless everyone 🙏
                </p>
                <p className="text-gray-400 text-xs">
                  Shubho Sharadiya
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-10 opacity-20">
        <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-2xl">🕉️</span>
        </div>
      </div>

      <div className="absolute top-10 right-10 opacity-20">
        <div className="w-12 h-12 bg-vermillion/20 rounded-full flex items-center justify-center animate-pulse" style={{ animationDelay: '1s' }}>
          <span className="text-xl">🌸</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;