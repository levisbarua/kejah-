import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

export const ContactUs: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.db.submitContactMessage(formData);
      setIsSuccess(true);
    } catch (error) {
      console.error("Error sending message", error);
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
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            Thanks for reaching out. Our team will get back to you within 24 hours.
          </p>
          <button
            onClick={() => {
              setIsSuccess(false);
              setFormData({ name: '', email: '', subject: '', message: '' });
            }}
            className="w-full bg-brand-600 text-white font-medium py-3 px-4 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
            Get in touch
          </h1>
          <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            Have questions about buying, selling, or just want to say hello? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="bg-brand-700 rounded-2xl p-8 lg:p-12 text-white shadow-xl flex flex-col justify-between overflow-hidden relative">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-brand-600 opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-brand-800 opacity-50 blur-3xl"></div>

            <div className="relative z-10">
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

              <div className="space-y-8">
                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-brand-200" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-100 mb-1">Phone</p>
                    <p className="text-lg font-semibold">+254 715 773 232</p>
                    <p className="text-sm text-brand-200 mt-1">Mon-Sun 9am-6pm EAT</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-brand-200" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-100 mb-1">Email</p>
                    <p className="text-lg font-semibold">barualevis@gmail.com</p>
                    <p className="text-sm text-brand-200 mt-1">We reply within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-white/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-brand-200" />
                  </div>
                  <div>
                    <p className="font-medium text-brand-100 mb-1">Office</p>
                    <p className="text-lg font-semibold">Mt. View</p>
                    <p className="text-brand-200">Nairobi, Kenya</p>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Contact Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 lg:p-12 shadow-xl border border-gray-100 dark:border-gray-700">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white px-4 py-3"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white px-4 py-3"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <select
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white px-4 py-3"
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Property Listing">Property Listing Help</option>
                  <option value="Account Support">Account Support</option>
                  <option value="Report Issue">Report Technical Issue</option>
                  <option value="Feedback">Feedback & Suggestions</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="block w-full rounded-lg border-gray-300 dark:border-gray-600 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white px-4 py-3"
                  placeholder="Your message..."
                />
              </div>

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
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
