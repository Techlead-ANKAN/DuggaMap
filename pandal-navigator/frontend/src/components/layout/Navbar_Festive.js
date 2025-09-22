import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import { Menu, X, Home, MapPin, Utensils, Route, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Home, public: true },
    { name: 'Pandals', href: '/pandals', icon: MapPin, public: true },
    { name: 'Food Places', href: '/eateries', icon: Utensils, public: true },
    { name: 'Plan Route', href: '/plan-route', icon: Route, public: false },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-200/50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-vermillion-500 to-gold-500 rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-vermillion">
                <span className="text-white text-xl">🪔</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-400 rounded-full animate-pulse-soft"></div>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-xl font-bold bg-gradient-to-r from-vermillion-600 to-gold-600 bg-clip-text text-transparent">
                দুর্গা পূজা
              </span>
              <span className="text-sm text-neutral-600 font-medium -mt-1">
                Navigator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              
              // Show all public items, and private items only when signed in
              if (!item.public) {
                return (
                  <SignedIn key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-vermillion-500 to-gold-500 text-white shadow-vermillion'
                          : 'text-neutral-700 hover:bg-neutral-100 hover:text-vermillion-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SignedIn>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-vermillion-500 to-gold-500 text-white shadow-vermillion'
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-vermillion-600'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="px-6 py-2.5 bg-gradient-to-r from-vermillion-500 to-gold-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-200 flex items-center space-x-2">
                  <Sparkles className="h-4 w-4" />
                  <span>Sign In</span>
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 border-2 border-gold-400 hover:border-vermillion-500 transition-colors duration-300 shadow-soft",
                    userButtonPopoverCard: "shadow-large border border-neutral-200 rounded-2xl",
                    userButtonPopoverActionButton: "hover:bg-neutral-50 rounded-xl",
                    userButtonPopoverActionButtonText: "text-neutral-700"
                  }
                }}
              />
            </SignedIn>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2.5 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-neutral-200/50 animate-slide-down">
          <div className="px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              
              if (!item.public) {
                return (
                  <SignedIn key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                        isActive(item.href)
                          ? 'bg-gradient-to-r from-vermillion-500 to-gold-500 text-white shadow-vermillion'
                          : 'text-neutral-700 hover:bg-neutral-100'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </SignedIn>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3.5 rounded-xl font-medium transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-vermillion-500 to-gold-500 text-white shadow-vermillion'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile Auth */}
            <div className="pt-4 border-t border-neutral-200 mt-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full px-4 py-3.5 bg-gradient-to-r from-vermillion-500 to-gold-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2">
                    <Sparkles className="h-5 w-5" />
                    <span>Sign In</span>
                  </button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <div className="flex items-center space-x-3 px-4 py-3.5 text-neutral-700">
                  <UserButton />
                  <span className="font-medium">Your Profile</span>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;