import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/clerk-react';
import { Menu, X, Home, MapPin, Utensils, LayoutDashboard, Navigation, Heart } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

    const navigation = [
    { name: 'Home', href: '/', icon: Home, public: true },
    { name: 'Pandals', href: '/pandals', icon: MapPin, public: true },
    { name: 'Foodplaces', href: '/foodplaces', icon: Utensils, public: true },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, public: false },
    { name: 'Plan Route', href: '/plan-route', icon: Navigation, public: false },
    { name: 'Favorites', href: '/favorites', icon: Heart, public: false },
  ];

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gold/20 shadow-festive">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <span className="text-white text-xl font-bold">🪔</span>
            </div>
            <div className="flex flex-col">
              <span className="font-festive text-lg font-bold text-vermillion">
                দুর্গা পূজা
              </span>
              <span className="text-xs text-midnight-blue opacity-75 -mt-1">
                Navigator
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              
              // Show all public items, and private items only when signed in
              if (!item.public) {
                return (
                  <SignedIn key={item.name}>
                    <Link
                      to={item.href}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                        isActive(item.href)
                          ? 'bg-gradient-primary text-white shadow-festive'
                          : 'text-midnight-blue hover:bg-gold/10 hover:text-vermillion'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SignedIn>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-gradient-primary text-white shadow-festive'
                      : 'text-midnight-blue hover:bg-gold/10 hover:text-vermillion'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            <SignedOut>
                <SignInButton mode="modal">
                <button className="btn-festive-outline">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10 border-2 border-gold hover:border-vermillion transition-colors duration-300",
                    userButtonPopoverCard: "shadow-festive border border-gold/20",
                    userButtonPopoverActionButton: "hover:bg-gold/10"
                  }
                }}
              />
            </SignedIn>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-midnight-blue hover:bg-gold/10 transition-colors duration-300"
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
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gold/20">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              
              if (!item.public) {
                return (
                  <SignedIn key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                        isActive(item.href)
                          ? 'bg-gradient-primary text-white'
                          : 'text-midnight-blue hover:bg-gold/10'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  </SignedIn>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive(item.href)
                      ? 'bg-gradient-primary text-white'
                      : 'text-midnight-blue hover:bg-gold/10'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
            
            {/* Mobile Auth */}
            <div className="pt-4 border-t border-gold/20">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="w-full btn-festive text-center">
                    লগিন করুন
                  </button>
                </SignInButton>
              </SignedOut>
              
              <SignedIn>
                <div className="flex items-center space-x-3 px-4 py-3">
                  <UserButton />
                  <span className="text-midnight-blue font-medium">
                    Your Profile
                  </span>
                </div>
              </SignedIn>
            </div>
          </div>
        </div>
      )}

      {/* Decorative Border */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-primary"></div>
    </nav>
  );
};

export default Navbar;