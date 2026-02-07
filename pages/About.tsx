import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Users, Search, Brain, Map } from 'lucide-react';

export const About: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200">
      {/* Hero Section */}
      <div className="relative bg-brand-900 py-24 sm:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover opacity-20"
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80"
            alt="Modern office building"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-900/90 to-brand-900/90"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            We help you find your <span className="text-brand-400">Kejah.</span>
          </h1>
          <p className="mt-6 text-xl text-brand-100 max-w-3xl mx-auto">
            Kejah combines cutting-edge AI technology with the human touch of real estate to make finding your dream home faster, smarter, and stress-free.
          </p>
        </div>
      </div>

      {/* Our Mission */}
      <div className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-base font-semibold text-brand-600 dark:text-brand-400 tracking-wide uppercase">Our Mission</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Reimagining Real Estate with Intelligence
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 mx-auto">
              We believe that looking for a home shouldn't be a chore. By leveraging Google's Gemini AI, we decode complex listings, provide deep neighborhood insights, and match you with properties that feel like home.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 mb-6">
                  <Brain className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">AI-Powered Search</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Forget checkbox filters. Describe your dream home in plain English, and our AI understands exactly what you're looking for.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 mb-6">
                  <Map className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Neighborhood Insights</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Go beyond the listing. Get real-time, AI-summarized insights about schools, parks, dining, and the vibe of any neighborhood.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-100 dark:bg-brand-900/50 text-brand-600 dark:text-brand-400 mb-6">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Trusted Connections</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  We verify listings and connect you directly with top-rated agents who know the market inside and out.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-brand-700 dark:bg-brand-900">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to find your place?</span>
            <span className="block text-brand-200">Start exploring today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-brand-100">
            Join thousands of happy homeowners who found their perfect match with Kejah.
          </p>
          <Link
            to="/explore"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-brand-600 bg-white hover:bg-brand-50 sm:w-auto"
          >
            <Search className="h-5 w-5 mr-2" />
            Browse Listings
          </Link>
        </div>
      </div>
    </div>
  );
};