import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  propertyTitle: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({ phoneNumber, propertyTitle }) => {
  if (!phoneNumber) return null;

  const handleClick = () => {
    // 1. Remove non-numeric characters from phone number
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    
    // 2. Create message
    const message = `Hi, I am interested in ${propertyTitle} listed on your app.`;
    
    // 3. Encode message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // 4. Construct WhatsApp API URL
    const url = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    
    // 5. Open in new tab
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleClick}
      className="w-full bg-[#25D366] text-white font-bold py-3 px-4 rounded-xl hover:bg-[#20bd5a] transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all flex justify-center items-center"
    >
      <MessageCircle className="h-5 w-5 mr-2" />
      Chat on WhatsApp
    </button>
  );
};