import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Star, Send, MessageSquare, Bug, Lightbulb, CheckCircle } from 'lucide-react';

export const Feedback: React.FC = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'general' as 'general' | 'bug' | 'feature',
    message: '',
    rating: 0
  });
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.db.addFeedback({
        ...formData,
        userId: user?.uid,
        timestamp: Date.now()
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Error submitting feedback", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-gray-100 dark:border-gray-700 animate-in fade-in zoom-in duration-300">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
            <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Thank You!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Your feedback helps us make Kejah better for everyone. We appreciate your thoughts!
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData(prev => ({ ...prev, message: '', rating: 0, type: 'general' }));
            }}
            className="w-full bg-brand-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
          >
            Send Another Response
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            We value your feedback
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400">
            Tell us about your experience with Kejah.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            {/* Rating Section */}
            <div className="text-center">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
                How would you rate your experience?
              </label>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setFormData({ ...formData, rating: star })}
                    className="focus:outline-none transition-transform hover:scale-110 p-1"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredStar || formData.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300 dark:text-gray-600'
                      } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Type Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'general' })}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.type === 'general'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-brand-200 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                <MessageSquare className="h-6 w-6 mb-2" />
                <span className="font-medium text-sm">General</span>
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'bug' })}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.type === 'bug'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-brand-200 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Bug className="h-6 w-6 mb-2" />
                <span className="font-medium text-sm">Bug Report</span>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: 'feature' })}
                className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 ${
                  formData.type === 'feature'
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400'
                    : 'border-gray-200 dark:border-gray-700 hover:border-brand-200 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Lightbulb className="h-6 w-6 mb-2" />
                <span className="font-medium text-sm">Feature Request</span>
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-4 py-3"
                  placeholder="How can we improve?"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-xl shadow-lg shadow-brand-500/20 text-base font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Submit Feedback
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
