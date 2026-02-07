import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { getNeighborhoodInsights, NeighborhoodInsight } from '../services/geminiService';
import { Listing, ListingType, User } from '../types';
import { MapPin, Bed, Bath, Expand, ArrowLeft, Check, Share2, Heart, Send, X, ChevronLeft, ChevronRight, Map, ExternalLink, ShieldCheck, Flag, AlertTriangle, Eye } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { SafetyModal } from '../components/SafetyModal';
import { ReportModal } from '../components/ReportModal';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { ScheduleTourModal } from '../components/ScheduleTourModal';

export const ListingDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const [listing, setListing] = useState<Listing | null>(null);
  const [listingAgent, setListingAgent] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carousel State
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);

  // Neighborhood Insights State
  const [insightTopic, setInsightTopic] = useState<string | null>(null);
  const [insightData, setInsightData] = useState<NeighborhoodInsight | null>(null);
  const [insightLoading, setInsightLoading] = useState(false);
  const [mapQuery, setMapQuery] = useState<string>('');

  // Favorite State
  const [isSaved, setIsSaved] = useState(false);

  // Share Feedback State
  const [isCopied, setIsCopied] = useState(false);

  // Trust & Safety State
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [hasReported, setHasReported] = useState(false);

  // Contact Form State
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: '',
    reason: 'General Inquiry'
  });
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Schedule Tour State
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  useEffect(() => {
    if (id) {
      // Fetch Listing Details
      api.db.getListingById(id).then(async (data) => {
        setListing(data);
        if (data) {
          setContactForm(prev => ({ ...prev, message: `Hi, I am interested in ${data.title}. Is it still available?` }));
          setMapQuery(`${data.location.lat},${data.location.lng}`);

          // Fetch Agent Details
          const agent = await api.db.getUserById(data.creatorId);
          setListingAgent(agent);
        }
        setLoading(false);
      });

      // ANALYTICS: Increment View Counter
      api.db.incrementListingViews(id);

      // Check if saved in localStorage
      const savedListings = JSON.parse(localStorage.getItem('kejah_saved_listings') || '[]');
      setIsSaved(savedListings.includes(id));
    }
  }, [id]);

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user) {
      setContactForm(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Auto-play Carousel Effect
  useEffect(() => {
    let interval: any;
    if (listing && listing.imageUrls.length > 1 && !isCarouselHovered) {
      interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % listing.imageUrls.length);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [listing, isCarouselHovered]);

  const toggleSave = () => {
    if (!id) return;

    const savedListings = JSON.parse(localStorage.getItem('kejah_saved_listings') || '[]');
    let newSavedListings;

    if (savedListings.includes(id)) {
      newSavedListings = savedListings.filter((savedId: string) => savedId !== id);
      setIsSaved(false);
    } else {
      newSavedListings = [...savedListings, id];
      setIsSaved(true);
    }

    localStorage.setItem('kejah_saved_listings', JSON.stringify(newSavedListings));
  };

  const handleShare = async () => {
    if (!listing) return;

    const shareData = {
      title: listing.title,
      text: `Check out ${listing.title} on Kejah`,
      url: window.location.href,
    };

    // Use Web Share API if available
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.debug('Share cancelled');
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link', err);
        alert('Failed to copy link. Please manually copy the URL.');
      }
    }
  };

  const handleReportSubmit = async (reason: string, details: string) => {
    if (!listing) return;
    await api.db.reportListing(listing.id, `[${reason}] ${details}`);
    setHasReported(true);
    setShowReportModal(false);

    // Show urgent message if scam
    if (reason === 'scam') {
      alert("Report received. We have prioritized this case. Please stop all communication with this agent. If you sent money, contact your bank immediately.");
    } else {
      alert("Thank you. We have received your report and will investigate.");
    }
  };

  const handleContactClick = () => {
    const hasSeenSafety = localStorage.getItem('kejah_safety_acknowledged');
    if (!hasSeenSafety) {
      setShowSafetyModal(true);
    } else {
      setShowContactForm(true);
    }
  };

  const onSafetyAcknowledge = () => {
    localStorage.setItem('kejah_safety_acknowledged', 'true');
    setShowSafetyModal(false);
    setShowContactForm(true);
  };

  const handleLoadInsight = async (topic: string, addressOverride?: string) => {
    const addr = addressOverride || (listing ? `${listing.location.address}, ${listing.location.city}` : '');
    if (!addr) return;

    setInsightTopic(topic);

    // Update Map Query
    if (listing) {
      setMapQuery(`${topic} near ${listing.location.address}, ${listing.location.city}`);
    }

    setInsightLoading(true);
    setInsightData(null);

    const data = await getNeighborhoodInsights(addr, topic);
    setInsightData(data);
    setInsightLoading(false);
  };

  const resetMap = () => {
    if (listing) {
      setMapQuery(`${listing.location.lat},${listing.location.lng}`);
      setInsightTopic(null);
      setInsightData(null);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    setIsSending(false);
    setIsSent(true);
  };

  const handleScheduleSubmit = async (data: any) => {
    await api.db.submitContactMessage({
      name: data.name,
      email: data.email,
      subject: `Tour Request: ${data.tourType} on ${data.date}`,
      message: `Phone: ${data.phone}. Requesting ${data.tourType} tour on ${data.date} at ${data.time}.`
    });
  };

  const nextImage = () => {
    if (!listing) return;
    setCurrentImageIndex((prev) => (prev === listing.imageUrls.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    if (!listing) return;
    setCurrentImageIndex((prev) => (prev === 0 ? listing.imageUrls.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Listing not found</h2>
        <Link to="/explore" className="text-brand-600 hover:underline mt-4 inline-block">Back to listings</Link>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pb-12 transition-colors duration-200">
      <SafetyModal
        isOpen={showSafetyModal}
        onClose={() => setShowSafetyModal(false)}
        onAcknowledge={onSafetyAcknowledge}
      />

      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportSubmit}
      />

      <ScheduleTourModal
        isOpen={showScheduleModal}
        onClose={() => setShowScheduleModal(false)}
        propertyTitle={listing.title}
        onSubmit={handleScheduleSubmit}
      />

      {/* Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <Link to="/explore" className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Listings
        </Link>
      </div>

      {/* Image Carousel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div
          className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-sm group bg-gray-100 dark:bg-gray-800"
          onMouseEnter={() => setIsCarouselHovered(true)}
          onMouseLeave={() => setIsCarouselHovered(false)}
        >
          <img
            src={listing.imageUrls[currentImageIndex]}
            alt={`${listing.title} view ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-all duration-500"
          />

          {/* Controls */}
          {listing.imageUrls.length > 1 && (
            <>
              <button
                onClick={(e) => { e.preventDefault(); prevImage(); }}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 shadow-md text-gray-800 dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={(e) => { e.preventDefault(); nextImage(); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-900 shadow-md text-gray-800 dark:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>

              {/* Dots Indicator */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/20 p-2 rounded-full backdrop-blur-sm">
                {listing.imageUrls.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/50 hover:bg-white/80'
                      }`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Counter Badge */}
              <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium">
                {currentImageIndex + 1} / {listing.imageUrls.length}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">

        {/* Left Column: Details */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">{listing.title}</h1>
                <div className="flex items-center gap-4 text-gray-500 dark:text-gray-400 mt-2 text-lg">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-1" />
                    {listing.location.address}, {listing.location.city}, {listing.location.state}
                  </div>
                  {/* View Counter Display */}
                  <div className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                    <Eye className="h-3 w-3" />
                    {(listing.views || 0).toLocaleString()} views
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className={`p-2 rounded-full border transition-all duration-200 relative group ${isCopied
                      ? 'bg-green-50 border-green-200 text-green-600 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}
                  title={isCopied ? "Copied!" : "Share"}
                >
                  {isCopied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
                  {isCopied && (
                    <span className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-900 text-white text-xs rounded shadow-lg whitespace-nowrap z-50 animate-in fade-in zoom-in duration-200">
                      Link Copied!
                    </span>
                  )}
                </button>
                <button
                  onClick={toggleSave}
                  className={`p-2 rounded-full border transition-all duration-200 ${isSaved
                      ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 scale-105'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  title={isSaved ? "Remove from saved" : "Save property"}
                >
                  <Heart className={`h-5 w-5 transition-colors duration-200 ${isSaved ? 'fill-red-500 text-red-500' : 'text-gray-600 dark:text-gray-300'
                    }`} />
                </button>
              </div>
            </div>
          </div>

          {/* Key Stats */}
          <div className="grid grid-cols-3 gap-4 py-6 border-y border-gray-100 dark:border-gray-800">
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-1">
                <Bed className="h-6 w-6 mr-2 text-brand-600 dark:text-brand-500" />
                {listing.bedrooms}
              </div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Bedrooms</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
              <div className="flex items-center text-2xl font-bold text-gray-900 dark:text-white mb-1">
                <Bath className="h-6 w-6 mr-2 text-brand-600 dark:text-brand-500" />
                {listing.bathrooms}
              </div>
              <span className="text-gray-500 dark:text-gray-400 font-medium">Bathrooms</span>
            </div>

          </div>

          {/* Description */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About this home</h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{listing.description}</p>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Amenities</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {listing.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 p-3 rounded-lg shadow-sm">
                  <Check className="h-4 w-4 mr-3 text-brand-500 flex-shrink-0" />
                  <span className="font-medium">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Neighborhood Insights (Visual Map + Grounding) */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Map className="h-6 w-6 text-brand-600 dark:text-brand-500" />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Location & Neighborhood</h3>
              </div>
              {insightTopic && (
                <button onClick={resetMap} className="text-sm text-brand-600 dark:text-brand-400 hover:underline">
                  Reset to Property
                </button>
              )}
            </div>

            {/* Visual Map */}
            <div className="relative w-full h-[400px] bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden mb-6 border border-gray-200 dark:border-gray-700">
              <iframe
                title="Property Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=${insightTopic ? 13 : 15}&output=embed`}
                className="w-full h-full"
              ></iframe>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">Select a category to see nearby places on the map and get AI-powered insights.</p>

              <div className="flex flex-wrap gap-2">
                {['schools', 'restaurants', 'parks', 'transit', 'groceries'].map(topic => (
                  <button
                    key={topic}
                    onClick={() => handleLoadInsight(topic)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${insightTopic === topic
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                  >
                    {topic.charAt(0).toUpperCase() + topic.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {insightLoading && (
              <div className="mt-6 flex flex-col items-center justify-center py-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-600 mb-2"></div>
                <span className="text-sm text-gray-500">Analyzing neighborhood...</span>
              </div>
            )}

            {insightData && (
              <div className="mt-6 bg-brand-50 dark:bg-gray-900/50 rounded-xl p-6 border border-brand-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 uppercase tracking-wide">AI Summary</h4>
                <p className="text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-wrap mb-4 text-sm">{insightData.text}</p>

                {insightData.links.length > 0 && (
                  <div className="border-t border-brand-200 dark:border-gray-700 pt-3 mt-3">
                    <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">Sources</h4>
                    <ul className="space-y-1">
                      {insightData.links.map((link, idx) => (
                        <li key={idx}>
                          <a
                            href={link.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center text-xs text-brand-600 dark:text-brand-400 hover:underline"
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {link.title}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Price & Contact */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg p-6 sticky top-24 transition-colors duration-200">
            <div className="mb-6">
              <span className={`inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider text-white rounded-md mb-2 ${listing.type === ListingType.SALE ? 'bg-brand-600' : 'bg-blue-600'
                }`}>
                {listing.type === ListingType.SALE ? 'For Sale' : 'For Rent'}
              </span>
              <div className="flex items-baseline">
                <span className="text-4xl font-bold text-gray-900 dark:text-white">Ksh {listing.price.toLocaleString()}</span>
                {listing.type === ListingType.RENT && <span className="text-gray-500 dark:text-gray-400 ml-2">/month</span>}
              </div>
            </div>

            {/* Interactive Contact Form */}
            <div className="mt-4">
              {isSent ? (
                <div className="text-center py-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-900 animate-in fade-in zoom-in duration-300">
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 mb-3">
                    <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-medium text-green-900 dark:text-green-300">Message Sent!</h3>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1 mb-4">The agent has been notified and will contact you shortly.</p>
                  <button
                    onClick={() => { setIsSent(false); setShowContactForm(false); }}
                    className="text-sm font-medium text-green-700 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 underline"
                  >
                    Close
                  </button>
                </div>
              ) : showContactForm ? (
                <form onSubmit={handleContactSubmit} className="space-y-4 animate-in slide-in-from-bottom-2 fade-in duration-300 bg-gray-50 dark:bg-gray-700 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                  <div className="flex justify-between items-center mb-1">
                    <h3 className="font-bold text-gray-900 dark:text-white">Contact Agent</h3>
                    <button
                      type="button"
                      onClick={() => setShowContactForm(false)}
                      className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wide mb-1">Name</label>
                    <input
                      required
                      type="text"
                      value={contactForm.name}
                      onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2.5 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wide mb-1">Email</label>
                    <input
                      required
                      type="email"
                      value={contactForm.email}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2.5 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wide mb-1">Contact Reason</label>
                    <select
                      value={contactForm.reason}
                      onChange={e => setContactForm({ ...contactForm, reason: e.target.value })}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2.5 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Schedule Viewing">Schedule Viewing</option>
                      <option value="Price Negotiation">Price Negotiation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wide mb-1">Message</label>
                    <textarea
                      required
                      rows={3}
                      value={contactForm.message}
                      onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                      className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-2.5 border bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                      placeholder="I'm interested in this property..."
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full flex justify-center items-center bg-brand-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-700 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <span className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </span>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" /> Send Message
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <button
                    onClick={handleContactClick}
                    className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-700 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex justify-center items-center"
                  >
                    Contact Agent
                  </button>

                  {/* WhatsApp Button Integration */}
                  {listingAgent && listingAgent.phoneNumber && (
                    <WhatsAppButton
                      phoneNumber={listingAgent.phoneNumber}
                      propertyTitle={listing.title}
                    />
                  )}

                  <button
                    onClick={() => setShowScheduleModal(true)}
                    className="w-full bg-white dark:bg-gray-700 text-brand-600 dark:text-brand-400 font-bold py-3 px-4 rounded-xl border-2 border-brand-100 dark:border-brand-900 hover:border-brand-600 dark:hover:border-brand-500 transition-colors"
                  >
                    Schedule Tour
                  </button>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
              <p className="flex items-center justify-between mb-2">
                <span>Listed by</span>
                <span className="font-medium text-gray-900 dark:text-white flex items-center">
                  {listingAgent ? listingAgent.displayName : 'Loading...'}
                  {/* We assume the demo agent is verified for this UI display as per mock data */}
                  <span title="Verified Agent" className="flex items-center ml-1">
                    <ShieldCheck className="h-4 w-4 text-blue-500" />
                  </span>
                </span>
              </p>
              <p className="flex justify-between">
                <span>Listed on</span>
                <span className="font-medium text-gray-900 dark:text-white">{new Date(listing.createdAt).toLocaleDateString()}</span>
              </p>

              {/* Report Button */}
              <button
                onClick={() => setShowReportModal(true)}
                disabled={hasReported}
                className={`mt-6 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border transition-all duration-200 font-medium text-sm ${hasReported
                    ? 'bg-gray-100 text-gray-400 border-transparent cursor-not-allowed'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-800 dark:hover:text-red-400 shadow-sm'
                  }`}
              >
                <Flag className="h-4 w-4" />
                {hasReported ? "Report Received" : "Report this listing"}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
