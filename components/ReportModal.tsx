import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [reason, setReason] = useState<string>('scam');
  const [details, setDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate slight delay for effect
    setTimeout(() => {
        onSubmit(reason, details);
        setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto" aria-labelledby="report-modal-title" role="dialog" aria-modal="true">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg leading-6 font-bold text-gray-900 dark:text-white" id="report-modal-title">
                  Report this Listing
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    We take reports seriously. Please tell us the issue.
                  </p>
                  
                  <form id="report-form" onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div className="space-y-2">
                       <label className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                           reason === 'scam' 
                           ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
                           : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                       }`}>
                         <input 
                           type="radio" 
                           name="reason" 
                           value="scam" 
                           checked={reason === 'scam'} 
                           onChange={e => setReason(e.target.value)}
                           className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                         />
                         <span className="block text-sm font-bold text-gray-900 dark:text-white">
                           I think it's a scam
                         </span>
                       </label>
                       
                       <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                         <input 
                           type="radio" 
                           name="reason" 
                           value="inaccurate" 
                           checked={reason === 'inaccurate'} 
                           onChange={e => setReason(e.target.value)}
                           className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                         />
                         <span className="block text-sm font-medium text-gray-900 dark:text-white">
                           Inaccurate information
                         </span>
                       </label>

                       <label className="flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                         <input 
                           type="radio" 
                           name="reason" 
                           value="offensive" 
                           checked={reason === 'offensive'} 
                           onChange={e => setReason(e.target.value)}
                           className="h-4 w-4 text-brand-600 focus:ring-brand-500 border-gray-300"
                         />
                         <span className="block text-sm font-medium text-gray-900 dark:text-white">
                           Offensive content
                         </span>
                       </label>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                        Additional Details
                      </label>
                      <textarea
                        required
                        value={details}
                        onChange={e => setDetails(e.target.value)}
                        rows={3}
                        className="shadow-sm focus:ring-brand-500 focus:border-brand-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 dark:text-white p-2"
                        placeholder="Please provide specific details..."
                      />
                    </div>
                    
                    {reason === 'scam' && (
                        <div className="rounded-md bg-red-50 dark:bg-red-900/20 p-3 border border-red-100 dark:border-red-900/50">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <ShieldAlert className="h-5 w-5 text-red-500" aria-hidden="true" />
                                </div>
                                <div className="ml-3">
                                    <h3 className="text-sm font-bold text-red-800 dark:text-red-200">Urgent Safety Advice</h3>
                                    <div className="mt-1 text-xs text-red-700 dark:text-red-300">
                                        <p>If you have been asked to pay via wire transfer before viewing, or if you have already sent money, please stop contact and alert your bank immediately.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="submit"
              form="report-form"
              disabled={isSubmitting}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};