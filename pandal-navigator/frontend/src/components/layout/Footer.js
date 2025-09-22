import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Star } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-neutral-800 to-neutral-900 text-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
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
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-vermillion-500 to-gold-500 rounded-2xl flex items-center justify-center shadow-gold">
                  <span className="text-white text-2xl">🪔</span>
                </div>
                <div>
                  <h3 className="font-heading text-xl font-bold text-white">
                    Durga Puja Pandals Navigator
                  </h3>
                  <p className="text-sm text-neutral-400">
                    Your Puja companion
                  </p>
                </div>
              </div>
              
              <p className="text-neutral-300 mb-6 max-w-md leading-relaxed">
                Discover Kolkata's most beautiful pandals and make your Puja journey more joyful. Wishing a safe and blessed festival to all.
              </p>

              <div className="flex items-center space-x-2 text-gold-400">
                <Heart className="h-4 w-4 fill-current" />
                <span className="text-sm font-medium">Made with love for Durga Puja</span>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-heading text-lg font-semibold text-gold-400 mb-6">
                Quick Links
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link 
                    to="/pandals" 
                    className="text-neutral-300 hover:text-gold-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <Star className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>All Pandals</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/foodplaces" 
                    className="text-neutral-300 hover:text-gold-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">🍽️</span>
                    <span>Food Places</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/plan-route" 
                    className="text-neutral-300 hover:text-gold-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span className="group-hover:scale-110 transition-transform duration-200">🗺️</span>
                    <span>Plan Route</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/favorites" 
                    className="text-neutral-300 hover:text-gold-400 transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <Heart className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                    <span>Favorites</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-heading text-lg font-semibold text-gold-400 mb-6">
                Contact
              </h4>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gold-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-neutral-300 font-medium">Kolkata, West Bengal</p>
                    <p className="text-sm text-neutral-400">India</p>
                  </div>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-gold-400 flex-shrink-0" />
                  <a 
                    href="mailto:info@pandalnavigator.com" 
                    className="text-neutral-300 hover:text-gold-400 transition-colors duration-200 break-all"
                  >
                    info@pandalnavigator.com
                  </a>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-gold-400 flex-shrink-0" />
                  <a 
                    href="tel:+919876543210" 
                    className="text-neutral-300 hover:text-gold-400 transition-colors duration-200"
                  >
                    +91 98765 43210
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-neutral-700 bg-neutral-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              
              {/* Copyright */}
              <div className="text-center md:text-left">
                <p className="text-neutral-300 text-sm font-medium">
                  © {currentYear} Durga Puja Pandals Navigator. All rights reserved.
                </p>
                <p className="text-neutral-400 text-xs mt-1">
                  Made with ❤️ for Durga Puja devotees
                </p>
              </div>

              {/* Blessing */}
              <div className="text-center">
                <p className="text-gold-400 font-heading text-lg font-semibold">
                  May Maa Durga bless everyone 🙏
                </p>
                <p className="text-neutral-400 text-xs mt-1">
                  শুভ শারদীয়া
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-10 opacity-10">
        <div className="w-16 h-16 bg-gold-400/20 rounded-full flex items-center justify-center animate-pulse-soft">
          <span className="text-2xl">🕉️</span>
        </div>
      </div>

      <div className="absolute top-10 right-10 opacity-10">
        <div className="w-12 h-12 bg-vermillion-400/20 rounded-full flex items-center justify-center animate-pulse-soft" style={{ animationDelay: '1s' }}>
          <span className="text-xl">🌸</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;