import React from 'react';
import { FaMapMarkerAlt, FaHeart, FaGithub, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <FaMapMarkerAlt className="h-8 w-8 text-orange-600" />
              <span className="text-xl font-bold">
                Dugga<span className="text-orange-600">Map</span>
              </span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Your ultimate guide to exploring Durga Puja pandals in Kolkata. 
              Discover amazing pandals, plan efficient routes, and find the best food spots 
              during the festive season.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaGithub className="h-6 w-6" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaTwitter className="h-6 w-6" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <FaInstagram className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/pandals" className="text-gray-300 hover:text-white transition-colors">
                  Browse Pandals
                </a>
              </li>
              <li>
                <a href="/eateries" className="text-gray-300 hover:text-white transition-colors">
                  Food Spots
                </a>
              </li>
              <li>
                <a href="/plan-route" className="text-gray-300 hover:text-white transition-colors">
                  Plan Route
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="/help" className="text-gray-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="/contact" className="text-gray-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2024 DuggaMap. All rights reserved.
          </div>
          <div className="flex items-center text-gray-400 text-sm">
            Made with <FaHeart className="h-4 w-4 text-red-500 mx-1" /> for Durga Puja devotees
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;