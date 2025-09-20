import React from 'react';
import { SignIn } from '@clerk/clerk-react';

const CustomSignIn = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access the Durga Puja Navigator
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <SignIn 
            appearance={{
              theme: "classic",
              variables: {
                colorPrimary: "#f97316", // Orange theme
              }
            }}
            redirectUrl="/dashboard"
            routing="path"
            path="/sign-in"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomSignIn;