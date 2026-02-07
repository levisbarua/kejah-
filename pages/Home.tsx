import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Sparkles, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { extractFiltersFromQuery } from '../services/geminiService';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';

const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=60&w=1600",
  "https://images.unsplash.com/photo-1600596542815-e32c630bd1ba?auto=format&fit=crop&q=60&w=1600",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=60&w=1600",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=60&w=1600",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=60&w=1600"
];

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [featuredListings, setFeaturedListings] = useState<Listing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiSearching, setIsAiSearching] = useState(false);
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  useEffect(() => {
    api.db.getListings({}).then(listings => {
      setFeaturedListings(listings.slice(0, 3));
    });

    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const handleAiSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsAiSearching(true);
    const filters = await extractFiltersFromQuery(searchQuery);
    setIsAiSearching(false);

    const params = new URLSearchParams();
    if (filters.city) params.set('city', filters.city);
    if (filters.minPrice) params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice.toString());
    if (filters.minBeds) params.set('minBeds', filters.minBeds.toString());
    if (filters.type) params.set('type', filters.type);

    navigate(`/explore?${params.toString()}`);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <div className="relative bg-brand-900 overflow-hidden">
        <div className="absolute inset-0">
          {HERO_IMAGES.map((img, index) => (
            <img
              key={img}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentHeroIndex ? 'opacity-30' : 'opacity-0'
              }`}
              src={img}
              alt={`Real estate background ${index + 1}`}
              loading={index === 0 ? "eager" : "lazy"}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900 to-brand-800 opacity-90 mix-blend-multiply"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-16 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find your place, <span className="text-brand-300">faster.</span>
          </h1>
          <p className="mt-4 sm:mt-6 text-lg sm:text-xl text-brand-100 max-w-3xl">
            Experience the future of house hunting. Use our AI-powered search to describe exactly what you're looking for, or browse our curated listings.
          </p>
          
          <div className="mt-8 sm:mt-10 max-w-2xl w-full">
            <form onSubmit={handleAiSearch} className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 to-blue-500 rounded-xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-2 gap-2 transition-colors">
                <div className="flex items-center flex-1 px-2">
                   <Sparkles className={`h-5 w-5 flex-shrink-0 ${isAiSearching ? 'text-brand-500 animate-pulse' : 'text-gray-400'}`} />
                   <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="block w-full bg-transparent border-0 focus:ring-0 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 px-4 py-3 text-base"
                    placeholder="Describe your dream home... (e.g. 'Modern 2-bed in Nairobi')"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isAiSearching}
                  className="inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors w-full sm:w-auto shadow-sm"
                >
                  {isAiSearching ? 'Thinking...' : 'Search'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Featured Listings</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">Hand-picked properties just for you.</p>
          </div>
          <Link to="/explore" className="text-brand-600 font-medium hover:text-brand-700 dark:text-brand-500 flex items-center">
            View all <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
        
        <div className="mt-12 flex justify-center">
          <Link 
            to="/explore" 
            className="inline-flex items-center px-8 py-4 border border-brand-200 dark:border-brand-700 text-lg font-bold rounded-xl text-brand-700 dark:text-brand-300 bg-white dark:bg-gray-800 hover:bg-brand-50 dark:hover:bg-brand-900/40 hover:border-brand-300 shadow-sm hover:shadow-md transition-all group"
          >
            View More Listings
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
