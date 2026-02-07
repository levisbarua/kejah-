import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { useStorage } from '../hooks/useStorage';
import { generateListingDescription } from '../services/geminiService';
import { ListingType } from '../types';
import { Wand2, UploadCloud, Loader2, Smartphone, ShieldCheck, CreditCard, CheckCircle, Lock, Crown, AlertTriangle, X } from 'lucide-react';

const KENYAN_CITIES = [
  "Bungoma", "Busia", "Eldoret", "Embu", "Garissa", "Homa Bay", "Isiolo", "Kajiado",
  "Kakamega", "Kericho", "Kiambu", "Kilifi", "Kirinyaga", "Kisii", "Kisumu", "Kitale",
  "Lamu", "Lodwar", "Machakos", "Malindi", "Mandera", "Maralal", "Marsabit", "Meru",
  "Mombasa", "Moyale", "Mumias", "Murang'a", "Nairobi", "Naivasha", "Nakuru", "Nanyuki",
  "Narok", "Nyahururu", "Nyeri", "Ruiru", "Siaya", "Thika", "Vihiga", "Voi", "Wajir",
  "Watamu", "Webuye", "Wundanyi"
];

export const CreateListing: React.FC = () => {
  const navigate = useNavigate();
  const { user, verifyPhone, setupRecaptcha, sendVerificationCode, confirmVerificationCode } = useAuth();
  const { uploadFile, progress } = useStorage();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    type: ListingType.SALE,
    bedrooms: '',
    bathrooms: '',
    city: '',
    state: '',
    address: '',
    amenities: '' // Comma separated
  });

  const [phoneInput, setPhoneInput] = useState('');
  const [verificationStep, setVerificationStep] = useState<'input' | 'otp' | 'verified'>('input');
  const [otpInput, setOtpInput] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Recaptcha state
  const [isRecaptchaReady, setIsRecaptchaReady] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'done'>('idle');

  // Payment State
  const [selectedPackage, setSelectedPackage] = useState<'standard' | 'premium'>('standard');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-gray-500">Please sign in as an agent to list properties.</p>
      </div>
    );
  }

  const handleSendCode = async () => {
    if (!phoneInput) return;
    setIsVerifying(true);
    try {
      // 1. Setup Recaptcha
      const verifier = await setupRecaptcha('recaptcha-container');

      // 2. Send Code
      await sendVerificationCode(phoneInput, verifier);
      setVerificationStep('otp');
      setIsRecaptchaReady(true);
    } catch (e: any) {
      console.error(e);
      alert("Error sending code: " + e.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput) return;
    setIsVerifying(true);
    try {
      await confirmVerificationCode(otpInput);
      setVerificationStep('verified');
    } catch (e: any) {
      console.error(e);
      alert("Invalid code: " + e.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleAiGenerate = async () => {
    if (!formData.city || !formData.type) {
      alert("Please enter at least City and Type to generate a description.");
      return;
    }
    setIsGenerating(true);
    const amenitiesList = formData.amenities.split(',').filter(s => s.trim());
    const features = [
      `${formData.bedrooms} bed`,
      `${formData.bathrooms} bath`,
      ...amenitiesList
    ];

    const desc = await generateListingDescription(features, formData.type, formData.city);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    // Mock Payment Gateway Delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsPaid(true);
    setIsProcessingPayment(false);
  };



  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadStatus('idle');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPaid || !user.phoneNumber) return;

    if (!selectedFile) {
      alert("Please upload an image for your listing.");
      return;
    }

    setIsSubmitting(true);

    try {
      setUploadStatus('uploading');
      const imageUrl = await uploadFile(selectedFile);
      setUploadStatus('done');

      await api.db.addListing({
        creatorId: user.uid,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        type: formData.type,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),

        amenities: formData.amenities.split(',').map(s => s.trim()),
        imageUrls: [imageUrl],
        location: {
          lat: 0, lng: 0, // Mock lat/lng
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip: '00000'
        },
        featured: selectedPackage === 'premium',
        paymentStatus: 'paid',
        amountPaid: selectedPackage === 'premium' ? 1000 : 500
      });

      navigate('/explore');
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700">
        <div className="bg-brand-600 px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">List a New Property</h2>
            <p className="text-brand-100 text-sm">Fill in the details below to publish your listing.</p>
          </div>
          {user.phoneNumber && (
            <div className="flex items-center gap-1 bg-brand-700/50 px-3 py-1 rounded-full text-xs text-brand-100 border border-brand-500">
              <ShieldCheck className="h-3 w-3" /> Phone Verified
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">

          {/* Phone Verification Section */}
          {!user.phoneNumber && (
            <div className="bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-800/50 rounded-xl p-6 animate-in fade-in slide-in-from-top-2">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="bg-orange-100 dark:bg-orange-900/40 p-3 rounded-full flex-shrink-0">
                  <Smartphone className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div className="flex-1 w-full">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    Verify Your Phone Number
                    <span className="text-xs font-normal text-orange-600 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full border border-orange-200 dark:border-orange-800">Required</span>
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-4">
                    To ensure trust and safety in our community, we will send an SMS code to verify your number.
                  </p>

                  <div className="flex flex-col gap-4 max-w-md">
                    {/* Step 1: Input Phone */}
                    {verificationStep === 'input' && (
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="tel"
                          placeholder="+254 7..."
                          value={phoneInput}
                          onChange={(e) => setPhoneInput(e.target.value)}
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={handleSendCode}
                          disabled={isVerifying || !phoneInput}
                          className="px-6 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 disabled:opacity-50 transition-colors whitespace-nowrap flex items-center justify-center"
                        >
                          {isVerifying ? <Loader2 className="animate-spin h-5 w-5" /> : 'Send Code'}
                        </button>
                      </div>
                    )}

                    {/* Recaptcha Container (Required for Firebase) */}
                    <div id="recaptcha-container"></div>

                    {/* Step 2: Input OTP */}
                    {verificationStep === 'otp' && (
                      <div className="flex flex-col sm:flex-row gap-2 animate-in fade-in">
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="Enter 6-digit code"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value)}
                          className="block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white tracking-widest text-center font-mono text-lg"
                        />
                        <button
                          type="button"
                          onClick={handleVerifyOtp}
                          disabled={isVerifying || otpInput.length < 6}
                          className="px-6 py-2 bg-brand-600 text-white font-bold rounded-lg hover:bg-brand-700 disabled:opacity-50 transition-colors whitespace-nowrap flex items-center justify-center"
                        >
                          {isVerifying ? <Loader2 className="animate-spin h-5 w-5" /> : 'Confirm Code'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Property Title</label>
              <input
                required
                type="text"
                disabled={isPaid}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 disabled:bg-gray-100"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
              <select
                disabled={isPaid}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 disabled:bg-gray-100"
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value as ListingType })}
              >
                <option value={ListingType.SALE}>For Sale</option>
                <option value={ListingType.RENT}>For Rent</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Price (Ksh)</label>
              <input required type="number" disabled={isPaid} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 disabled:bg-gray-100"
                value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bedrooms</label>
              <select
                required
                disabled={isPaid}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 disabled:bg-gray-100"
                value={formData.bedrooms}
                onChange={e => setFormData({ ...formData, bedrooms: e.target.value })}
              >
                <option value="">Select</option>
                <option value="0">Bedsitter (Studio)</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3 Bedrooms</option>
                <option value="4">4 Bedrooms</option>
                <option value="5">5 Bedrooms</option>
                <option value="6">6+ Bedrooms</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Bathrooms</label>
              <input required type="number" disabled={isPaid} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 disabled:bg-gray-100"
                value={formData.bathrooms} onChange={e => setFormData({ ...formData, bathrooms: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
            <select
              required
              disabled={isPaid}
              className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 disabled:bg-gray-100"
              value={formData.city}
              onChange={e => setFormData({ ...formData, city: e.target.value })}
            >
              <option value="">Select a City</option>
              {KENYAN_CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>


          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amenities (comma separated)</label>
            <input type="text" disabled={isPaid} className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 disabled:bg-gray-100"
              placeholder="Pool, Gym, Parking"
              value={formData.amenities} onChange={e => setFormData({ ...formData, amenities: e.target.value })} />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              {!isPaid && (
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={isGenerating}
                  className="text-xs flex items-center gap-1 text-brand-600 hover:text-brand-800 dark:text-brand-400 dark:hover:text-brand-300 bg-brand-50 dark:bg-brand-900/20 px-2 py-1 rounded-md transition-colors"
                >
                  {isGenerating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Wand2 className="h-3 w-3" />}
                  Generate with AI
                </button>
              )}
            </div>
            <textarea
              required
              rows={4}
              disabled={isPaid}
              className="block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:ring-brand-500 focus:border-brand-500 sm:text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white disabled:opacity-70 disabled:bg-gray-100"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the property..."
            />
          </div>

          {/* Image Upload Area */}
          <div className={`border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex justify-center items-center relative min-h-[200px] ${isPaid ? 'opacity-70' : 'hover:border-brand-500 dark:hover:border-brand-500'} transition-colors`}>
            {previewUrl ? (
              <div className="relative w-full h-48">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover rounded-md shadow-sm" />
                <button
                  type="button"
                  onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 shadow-md transition-transform hover:scale-110"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="text-center w-full">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-3" />
                <div className="flex justify-center text-sm text-gray-600 dark:text-gray-400">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-bold text-brand-600 hover:text-brand-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-brand-500">
                    <span>Upload a file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/*" onChange={handleFileSelect} disabled={isPaid} />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
              </div>
            )}

            {uploadStatus === 'uploading' && (
              <div className="absolute inset-0 bg-white/90 dark:bg-gray-800/90 flex flex-col items-center justify-center rounded-lg z-10 backdrop-blur-sm">
                <Loader2 className="h-10 w-10 animate-spin text-brand-600 mb-3" />
                <p className="text-sm font-bold text-brand-600">Uploading Image... {progress}%</p>
              </div>
            )}
          </div>

          {/* Pricing & Payment Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-brand-600" /> Select Listing Package
            </h3>

            {isPaid ? (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center animate-in zoom-in fade-in">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="text-lg font-bold text-green-800 dark:text-green-300">Payment Successful</h4>
                <p className="text-sm text-green-600 dark:text-green-400">You can now publish your listing.</p>
                <p className="text-xs text-gray-500 mt-2 uppercase tracking-wide">
                  {selectedPackage === 'premium' ? 'Premium Package (1,000)' : 'Standard Package (500)'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Package Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Standard Card */}
                  <div
                    onClick={() => setSelectedPackage('standard')}
                    className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 relative ${selectedPackage === 'standard'
                      ? 'border-brand-600 bg-brand-50 dark:bg-brand-900/20 ring-1 ring-brand-600'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900 dark:text-white">Standard</span>
                      {selectedPackage === 'standard' && <CheckCircle className="h-5 w-5 text-brand-600" />}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Ksh 500</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Standard listing visibility. Listed for 30 days.</p>
                  </div>

                  {/* Premium Card */}
                  <div
                    onClick={() => setSelectedPackage('premium')}
                    className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 relative ${selectedPackage === 'premium'
                      ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10 ring-1 ring-yellow-500'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                      }`}
                  >
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                      Recommended
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                        <Crown className="h-4 w-4 text-yellow-500" /> Premium
                      </span>
                      {selectedPackage === 'premium' && <CheckCircle className="h-5 w-5 text-yellow-500" />}
                    </div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Ksh 1,000</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Featured placement. Higher visibility. Listed for 60 days.</p>
                  </div>
                </div>

                {/* Payment Button */}
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isProcessingPayment}
                  className="w-full flex items-center justify-center py-3 px-4 rounded-xl font-bold text-white bg-gray-900 hover:bg-black dark:bg-gray-700 dark:hover:bg-gray-600 transition-colors shadow-lg"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5 mr-2" /> Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-5 w-5 mr-2" /> Pay Ksh {selectedPackage === 'premium' ? '1,000' : '500'} & Unlock Publishing
                    </>
                  )}
                </button>
                <p className="text-center text-xs text-gray-400 mt-2 flex items-center justify-center gap-1">
                  <Lock className="h-3 w-3" /> Secure Payment
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isPaid || !user.phoneNumber}
              className={`inline-flex justify-center py-3 px-6 border border-transparent shadow-sm text-base font-medium rounded-xl text-white transition-all ${!isPaid || !user.phoneNumber
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 hover:-translate-y-0.5 shadow-lg'
                }`}
            >
              {isSubmitting ? (
                <span className="flex items-center"><Loader2 className="animate-spin h-4 w-4 mr-2" /> Publishing...</span>
              ) : !user.phoneNumber ? (
                <span className="flex items-center"><Smartphone className="h-4 w-4 mr-2" /> Verify Phone to Publish</span>
              ) : !isPaid ? (
                <span className="flex items-center"><Lock className="h-4 w-4 mr-2" /> Complete Payment to Publish</span>
              ) : (
                'Publish Listing'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
