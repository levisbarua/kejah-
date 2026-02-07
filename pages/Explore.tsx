import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Listing, ListingType } from '../types';
import { ListingCard } from '../components/ListingCard';
import { Filter, X, Search } from 'lucide-react';

const KENYAN_CITIES = ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika", "Malindi", "Naivasha"];

export const Explore: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    city: searchParams.get('city') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    bedrooms: searchParams.get('bedrooms') || '',
    type: searchParams.get('type') || ''
  });

  const fetchData = async () => {
    setLoading(true);
    const apiFilters: any = {};
    if (filters.city) apiFilters.city = filters.city;
    if (filters.minPrice) apiFilters.minPrice = Number(filters.minPrice);
    if (filters.maxPrice) apiFilters.maxPrice = Number(filters.maxPrice);
    if (filters.bedrooms) apiFilters.bedrooms = filters.bedrooms;
    if (filters.type) apiFilters.type = filters.type;

    const results = await api.db.getListings(apiFilters);
    setListings(results);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  const applyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 sticky top-24">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
              <Filter className="h-4 w-4 mr-2" /> Filters
            </h3>
            <form onSubmit={applyFilters} className="space-y-4">
              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                <select
                  value={filters.city}
                  onChange={e => setFilters({...filters, city: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-brand-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Any City</option>
                  {KENYAN_CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>

              {/* Listing Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Listing Type</label>
                <select
                  value={filters.type}
                  onChange={e => setFilters({...filters, type: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-brand-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Any Type</option>
                  <option value={ListingType.SALE}>For Sale</option>
                  <option value={ListingType.RENT}>For Rent</option>
                </select>
              </div>

              {/* Bedrooms Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bedrooms</label>
                <select
                  value={filters.bedrooms}
                  onChange={e => setFilters({...filters, bedrooms: e.target.value})}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-brand-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Any</option>
                  <option value="0">Bedsitter (Studio)</option>
                  <option value="1">1 Bedroom</option>
                  <option value="2">2 Bedrooms</option>
                  <option value="3">3 Bedrooms</option>
                  <option value="4+">4+ Bedrooms</option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price Range (Ksh)</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={e => setFilters({...filters, minPrice: e.target.value})}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-brand-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 dark:text-white"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={e => setFilters({...filters, maxPrice: e.target.value})}
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:ring-brand-500 sm:text-sm p-2 border bg-white dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700 transition-colors"
              >
                Apply Filters
              </button>
            </form>
          </div>
        </div>

        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
            </div>
          ) : listings.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map(l => <ListingCard key={l.id} listing={l} />)}
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
              <Search className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No properties found</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Try adjusting your filters.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
