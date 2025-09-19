import React from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { 
  FaMapMarkerAlt, 
  FaRoute, 
  FaUtensils, 
  FaHeart, 
  FaUsers, 
  FaStar,
  FaArrowRight,
  FaMobile,
  FaClock
} from 'react-icons/fa';

const Home = () => {
  const features = [
    {
      icon: <FaMapMarkerAlt className="h-8 w-8 text-orange-600" />,
      title: "Discover Pandals",
      description: "Explore hundreds of beautifully decorated Durga Puja pandals across Kolkata with detailed information and photos."
    },
    {
      icon: <FaRoute className="h-8 w-8 text-orange-600" />,
      title: "Smart Route Planning",
      description: "Plan the most efficient route to visit multiple pandals and save time during your pandal hopping adventure."
    },
    {
      icon: <FaUtensils className="h-8 w-8 text-orange-600" />,
      title: "Food Recommendations",
      description: "Find the best street food and restaurants near pandals to complete your festive experience."
    },
    {
      icon: <FaHeart className="h-8 w-8 text-orange-600" />,
      title: "Save Favorites",
      description: "Bookmark your favorite pandals and create personalized lists for easy access and sharing."
    }
  ];

  const stats = [
    { number: "500+", label: "Pandals Listed" },
    { number: "50+", label: "Food Spots" },
    { number: "10K+", label: "Happy Users" },
    { number: "4.8", label: "User Rating" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 to-yellow-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Your Ultimate <span className="text-orange-600">Durga Puja</span>
              <br />Pandal Navigator
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover the most beautiful pandals, plan efficient routes, find amazing food, 
              and make the most of your Durga Puja celebrations in Kolkata.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <SignedOut>
                <SignInButton mode="modal">
                  <button className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2">
                    Get Started Free
                    <FaArrowRight className="h-5 w-5" />
                  </button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link
                  to="/dashboard"
                  className="bg-orange-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  Go to Dashboard
                  <FaArrowRight className="h-5 w-5" />
                </Link>
              </SignedIn>
              
              <Link
                to="/pandals"
                className="border-2 border-orange-600 text-orange-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 hover:text-white transition-colors"
              >
                Browse Pandals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need for Perfect Pandal Hopping
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From discovering hidden gems to planning efficient routes, 
              we've got all the tools you need for an amazing Durga Puja experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600">
              Start your pandal hopping journey in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaMapMarkerAlt className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                1. Explore Pandals
              </h3>
              <p className="text-gray-600">
                Browse through our extensive database of pandals with photos, 
                ratings, and detailed information about each location.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaRoute className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                2. Plan Your Route
              </h3>
              <p className="text-gray-600">
                Select your favorite pandals and let our smart algorithm 
                create the most efficient route for your visit.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <FaMobile className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                3. Start Exploring
              </h3>
              <p className="text-gray-600">
                Follow your optimized route, discover amazing food spots, 
                and create unforgettable memories during Durga Puja.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-orange-600 to-yellow-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Start Your Pandal Hopping Adventure?
          </h2>
          <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
            Join thousands of devotees who are already using DuggaMap to 
            make their Durga Puja celebrations more memorable and organized.
          </p>
          
          <SignedOut>
            <SignInButton mode="modal">
              <button className="bg-white text-orange-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2 mx-auto">
                Start Planning Now
                <FaArrowRight className="h-5 w-5" />
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <Link
              to="/plan-route"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              Plan Your First Route
              <FaArrowRight className="h-5 w-5" />
            </Link>
          </SignedIn>
        </div>
      </section>
    </div>
  );
};

export default Home;