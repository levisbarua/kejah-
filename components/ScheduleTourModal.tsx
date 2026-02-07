import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Video, User, Mail, Phone, X, CheckCircle, Loader2, MapPin } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ScheduleTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle: string;
  onSubmit: (data: any) => Promise<void>;
}

export const ScheduleTourModal: React.FC<ScheduleTourModalProps> = ({ isOpen, onClose, propertyTitle, onSubmit }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    tourType: 'in-person' as 'in-person' | 'video',
    date: '',
    time: '',
    name: '',
    email: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.displayName || '',
        email: user.email || '',
        phone: user.phoneNumber || ''
      }));
    }
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setFormData(prev => ({ ...prev, date: tomorrow.toISOString().split('T')[0] }));
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      setStep('success');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('details');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[80] overflow-y-auto" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900/75 transition-opacity" aria-hidden="true" onClick={handleClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-100 dark:border-gray-700">
            <div className="absolute top-4 right-4 z-10">
                <button onClick={handleClose} className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                    <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                </button>
            </div>

            {step === 'success' ? (
                <div className="p-8 text-center animate-in zoom-in duration-300">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Request Sent!</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        The agent has received your request for <strong>{formData.tourType === 'video' ? 'a video tour' : 'an in-person tour'}</strong> on <strong>{formData.date}</strong> at <strong>{formData.time}</strong>. They will confirm shortly.
                    </p>
                    <button onClick={handleClose} className="w-full bg-brand-600 text-white font-bold py-3 px-4 rounded-xl hover:bg-brand-700 transition-colors">
                        Close
                    </button>
                </div>
            ) : (
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Schedule a Tour</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 line-clamp-1">{propertyTitle}</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Tour Type */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, tourType: 'in-person'})}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                    formData.tourType === 'in-person' 
                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-brand-200'
                                }`}
                            >
                                <MapPin className="h-6 w-6 mb-2" />
                                <span className="text-sm font-bold">In-Person</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData({...formData, tourType: 'video'})}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                                    formData.tourType === 'video' 
                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400' 
                                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-brand-200'
                                }`}
                            >
                                <Video className="h-6 w-6 mb-2" />
                                <span className="text-sm font-bold">Video Chat</span>
                            </button>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input 
                                        type="date" 
                                        required
                                        min={new Date().toISOString().split('T')[0]}
                                        value={formData.date}
                                        onChange={e => setFormData({...formData, date: e.target.value})}
                                        className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-500 focus:border-brand-500 sm:text-sm py-2.5"
                                    />
                                </div>
                             </div>
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Time</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Clock className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <select 
                                        required
                                        value={formData.time}
                                        onChange={e => setFormData({...formData, time: e.target.value})}
                                        className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-500 focus:border-brand-500 sm:text-sm py-2.5"
                                    >
                                        <option value="">Select Time</option>
                                        <option value="09:00">9:00 AM</option>
                                        <option value="10:00">10:00 AM</option>
                                        <option value="11:00">11:00 AM</option>
                                        <option value="12:00">12:00 PM</option>
                                        <option value="13:00">1:00 PM</option>
                                        <option value="14:00">2:00 PM</option>
                                        <option value="15:00">3:00 PM</option>
                                        <option value="16:00">4:00 PM</option>
                                        <option value="17:00">5:00 PM</option>
                                    </select>
                                </div>
                             </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-3">
                             <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1.5">Your Details</label>
                                <div className="relative mb-3">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User className="h-4 w-4 text-gray-400" />
                                    </div>
                                    <input 
                                        type="text" 
                                        required
                                        placeholder="Full Name"
                                        value={formData.name}
                                        onChange={e => setFormData({...formData, name: e.target.value})}
                                        className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-500 focus:border-brand-500 sm:text-sm py-2.5"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input 
                                            type="email" 
                                            required
                                            placeholder="Email"
                                            value={formData.email}
                                            onChange={e => setFormData({...formData, email: e.target.value})}
                                            className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-500 focus:border-brand-500 sm:text-sm py-2.5"
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-4 w-4 text-gray-400" />
                                        </div>
                                        <input 
                                            type="tel" 
                                            required
                                            placeholder="Phone"
                                            value={formData.phone}
                                            onChange={e => setFormData({...formData, phone: e.target.value})}
                                            className="block w-full pl-10 rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-brand-500 focus:border-brand-500 sm:text-sm py-2.5"
                                        />
                                    </div>
                                </div>
                             </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-brand-500/20 text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin h-5 w-5 mr-2" /> Requesting...
                                </>
                            ) : (
                                'Request Tour'
                            )}
                        </button>
                    </form>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};