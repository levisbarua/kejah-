import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Listing } from '../types';
import { ListingCard } from '../components/ListingCard';
import { Heart, Search } from 'lucide-react';

export const SavedListings: React.FC = () => {
  const [savedListings, setSavedListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      // Get IDs from local storage
      const savedIds = JSON.parse(localStorage.getItem('kejah_saved_listings') || '[]');
      
      if (savedIds.length === 0) {
        setSavedListings([]);
        setLoading(false);
        return;
      }

      // Fetch details for each saved ID
      const promises = savedIds.map((id: string) => api.db.getListingById(id));
      const results = await Promise.all(promises);
      
      // Filter out nulls (in case a listing was deleted but ID remained in local storage)
      const validListings = results.filter((l): l is Listing => l !== null);
      setSavedListings(validListings);
      setLoading(false);
    };

    fetchSaved();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <div className="mb-8 border-b border-gray-200 dark:border-gray-700 pb-5">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <Heart className="h-8 w-8 text-red-500 fill-current" />
          Saved Homes
        </h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400 text-lg">
          {savedListings.length} {savedListings.length === 1 ? 'property' : 'properties'} saved to your favorites.
        </p>
      </div>

      {savedListings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {savedListings.map(listing => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700 transition-colors">
          <div className="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600 mb-6 bg-gray-50 dark:bg-gray-700/50 rounded-full flex items-center justify-center">
            <Heart className="h-10 w-10" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">No saved listings yet</h3>
          <p className="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
            When you find a home you love, click the heart icon to save it here for later.
          </p>
          <Link
            to="/explore"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Search className="h-5 w-5 mr-2" />
            Start Exploring
          </Link>
        </div>
      )}
    </div>
  );
};
