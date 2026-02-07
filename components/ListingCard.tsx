import React, { useState, useEffect } from 'react';
import { Listing, ListingType, User } from '../types';
import { api } from '../services/api';
import { MapPin, Bed, Bath, Expand, Heart, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ListingCardProps {
  listing: Listing;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [agent, setAgent] = useState<User | null>(null);

  useEffect(() => {
    // Check if saved in localStorage on mount
    const savedListings = JSON.parse(localStorage.getItem('kejah_saved_listings') || '[]');
    setIsSaved(savedListings.includes(listing.id));

    // Fetch Agent Details
    let isMounted = true;
    api.db.getUserById(listing.creatorId).then(fetchedAgent => {
      if (isMounted) setAgent(fetchedAgent);
    });

    let interval: any;
    if (isHovered && listing.imageUrls.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % listing.imageUrls.length);
      }, 2000); // Change image every 2 seconds
    } else {
      setCurrentImageIndex(0);
    }
    return () => {
      clearInterval(interval);
      isMounted = false;
    };
  }, [isHovered, listing.imageUrls.length, listing.id, listing.creatorId]);

  const toggleSave = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to the details page
    e.stopPropagation();

    const savedListings = JSON.parse(localStorage.getItem('kejah_saved_listings') || '[]');
    let newSavedListings;

    if (savedListings.includes(listing.id)) {
      newSavedListings = savedListings.filter((id: string) => id !== listing.id);
      setIsSaved(false);
    } else {
      newSavedListings = [...savedListings, listing.id];
      setIsSaved(true);
    }

    localStorage.setItem('kejah_saved_listings', JSON.stringify(newSavedListings));
  };

  return (
    <Link
      to={`/listing/${listing.id}`}
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all duration-300 overflow-hidden flex flex-col h-full block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 w-full overflow-hidden bg-gray-100 dark:bg-gray-700">
        {/* Flashcard Image Effect */}
        <img
          src={listing.imageUrls[currentImageIndex]}
          alt={listing.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 animate-in fade-in"
          key={currentImageIndex} // Force re-render for animation
        />

        {/* Indicators */}
        {listing.imageUrls.length > 1 && isHovered && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
            {listing.imageUrls.map((_, idx) => (
              <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
              />
            ))}
          </div>
        )}

        <div className="absolute top-3 right-3 flex gap-2 z-10">
          <span className={`px-2 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-md ${listing.type === ListingType.SALE ? 'bg-brand-600' : 'bg-blue-600'
            }`}>
            {listing.type === ListingType.SALE ? 'For Sale' : 'For Rent'}
          </span>
        </div>
        <button
          onClick={toggleSave}
          className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 z-20 focus:outline-none active:scale-95 ${isSaved
              ? 'bg-white text-red-500 shadow-md scale-110'
              : 'bg-white/80 dark:bg-gray-900/80 text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-900 hover:text-red-500 dark:hover:text-red-500 hover:scale-110'
            }`}
          aria-label={isSaved ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">{listing.title}</h3>
        </div>

        <p className="text-2xl font-bold text-brand-600 dark:text-brand-500 mb-2">
          Ksh {listing.price.toLocaleString()}
          {listing.type === ListingType.RENT && <span className="text-sm text-gray-500 dark:text-gray-400 font-normal">/mo</span>}
        </p>

        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-3">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
          <span className="truncate">{listing.location.city}, {listing.location.state}</span>
        </div>

        {/* Agent Info */}
        {agent && (
          <div className="flex items-center gap-2 mb-4 mt-1">
            <img
              src={agent.photoURL || `https://ui-avatars.com/api/?name=${agent.displayName}&background=random`}
              alt={agent.displayName}
              className="w-5 h-5 rounded-full object-cover border border-gray-100 dark:border-gray-600"
            />
            <div className="flex items-center gap-1 min-w-0">
              <span className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate">
                {agent.displayName}
              </span>
              {agent.isVerified && (
                <ShieldCheck className="w-3 h-3 text-brand-500 fill-brand-100 dark:fill-brand-900" aria-label="Verified Agent" />
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2 border-t border-gray-100 dark:border-gray-700 pt-4 mt-auto">
          <div className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-400">
            <div className="flex items-center font-semibold text-gray-900 dark:text-white">
              <Bed className="h-4 w-4 mr-1" />
              {listing.bedrooms}
            </div>
            <span className="text-xs">Beds</span>
          </div>
          <div className="flex flex-col items-center justify-center text-gray-600 dark:text-gray-400 border-l border-gray-100 dark:border-gray-700">
            <div className="flex items-center font-semibold text-gray-900 dark:text-white">
              <Bath className="h-4 w-4 mr-1" />
              {listing.bathrooms}
            </div>
            <span className="text-xs">Baths</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
