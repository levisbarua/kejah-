import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { User } from '../types';
import { ShieldCheck, Mail, Phone, Star, X, MapPin, Building, Award } from 'lucide-react';

export const Agents: React.FC = () => {
  const [agents, setAgents] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgent, setSelectedAgent] = useState<User | null>(null);

  useEffect(() => {
    api.db.getAgents().then(data => {
      setAgents(data);
      setLoading(false);
    });
  }, []);

  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const element = document.getElementById('agent-contact-details');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">Meet Our Agents</h1>
        <p className="mt-4 text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          Connect with trusted professionals who can help you navigate your real estate journey.
        </p>


      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {agents.map((agent) => (
          <div key={agent.uid} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
            <div className="p-6 flex flex-col items-center text-center flex-grow">
              <div className="relative mb-4">
                <img
                  src={agent.photoURL || `https://ui-avatars.com/api/?name=${agent.displayName}&background=random`}
                  alt={agent.displayName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-brand-50 dark:border-brand-900/30"
                />
                {agent.isVerified && (
                  <div className="absolute bottom-0 right-0 bg-white dark:bg-gray-800 rounded-full p-1" title="Verified Agent">
                    <ShieldCheck className="w-6 h-6 text-brand-500 fill-brand-100 dark:fill-brand-900/50" />
                  </div>
                )}
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{agent.displayName}</h3>
              <p className="text-brand-600 dark:text-brand-400 font-medium text-sm mb-4">Real Estate Specialist</p>

              <div className="w-full space-y-3">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{agent.email}</span>
                </div>
                {agent.phoneNumber && (
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <Phone className="w-4 h-4" />
                    <span>{agent.phoneNumber}</span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-1 text-yellow-400 text-sm">
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-gray-400 ml-1">(5.0)</span>
                </div>
              </div>
            </div>
            <div className="p-6 pt-0 mt-auto">
              <button
                onClick={() => setSelectedAgent(agent)}
                className="w-full py-2 px-4 border border-brand-600 text-brand-600 dark:border-brand-500 dark:text-brand-500 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 font-medium transition-colors"
              >
                View Profile
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Profile Modal */}
      {selectedAgent && (
        <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setSelectedAgent(null)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-100 dark:border-gray-700">
              {/* Header Image/Banner */}
              <div className="h-32 bg-brand-600 relative">
                <button
                  onClick={() => setSelectedAgent(null)}
                  className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="relative -mt-16 mb-4 flex justify-between items-end">
                  <div className="relative">
                    <img
                      src={selectedAgent.photoURL || `https://ui-avatars.com/api/?name=${selectedAgent.displayName}&background=random`}
                      alt={selectedAgent.displayName}
                      className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 object-cover bg-white dark:bg-gray-800"
                    />
                    {selectedAgent.isVerified && (
                      <div className="absolute bottom-2 right-2 bg-white dark:bg-gray-800 rounded-full p-1 shadow-sm">
                        <ShieldCheck className="h-6 w-6 text-brand-500 fill-brand-100 dark:fill-brand-900/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={scrollToContact}
                      className="bg-brand-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-brand-700 transition-colors shadow-sm"
                    >
                      Contact
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedAgent.displayName}</h2>
                  <p className="text-brand-600 dark:text-brand-400 font-medium">Senior Real Estate Agent</p>

                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 pb-4">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> Nairobi, KE
                    </div>
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" /> Kejah Agency
                    </div>
                    <div className="flex items-center gap-1">
                      <Award className="h-4 w-4" /> Top Rated
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-2">About</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {selectedAgent.displayName} is a dedicated real estate professional with a passion for helping clients find their perfect home. With extensive knowledge of the local market and a commitment to verified, safe listings, they ensure a smooth and secure property journey.
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <span className="block text-xl font-bold text-gray-900 dark:text-white">12</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">Listings</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <span className="block text-xl font-bold text-gray-900 dark:text-white">5.0</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">Rating</span>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                      <span className="block text-xl font-bold text-gray-900 dark:text-white">5+</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">Years Exp.</span>
                    </div>
                  </div>

                  <div id="agent-contact-details" className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700 scroll-mt-24">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-3">Contact Details</h3>
                    <div className="space-y-2">
                      <a href={`mailto:${selectedAgent.email}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                        <div className="bg-brand-100 dark:bg-brand-900/30 p-2 rounded-full text-brand-600 dark:text-brand-400">
                          <Mail className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium">{selectedAgent.email}</span>
                      </a>
                      {selectedAgent.phoneNumber && (
                        <a href={`tel:${selectedAgent.phoneNumber}`} className="flex items-center gap-3 text-gray-600 dark:text-gray-300 hover:text-brand-600 dark:hover:text-brand-400 transition-colors p-2 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg">
                          <div className="bg-brand-100 dark:bg-brand-900/30 p-2 rounded-full text-brand-600 dark:text-brand-400">
                            <Phone className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">{selectedAgent.phoneNumber}</span>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
