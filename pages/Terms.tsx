import React from 'react';

export const Terms: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Terms of Service</h1>
      
      <div className="space-y-8 text-gray-600 dark:text-gray-300">
        <section>
          <p className="mb-4 text-sm text-gray-500">Last updated: March 15, 2024</p>
          <p>
            Please read these Terms of Service ("Terms") carefully before using the Kejah platform.
            By accessing or using our service, you agree to be bound by these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Use of Service</h2>
          <p>
            You agree to use Kejah only for lawful purposes and in accordance with these Terms.
            Real estate agents are responsible for the accuracy of their property listings.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. User Accounts</h2>
          <p>
            When you create an account with us, you must provide us information that is accurate, complete, and current at all times. 
            You are responsible for safeguarding the password that you use to access the service and for any activities or actions under your password.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Property Listings</h2>
          <p>
            Kejah acts as a venue to connect buyers and agents. We do not own, sell, or manage the properties listed on our site. 
            While we strive for accuracy, we cannot guarantee the availability or condition of any property.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. User Content</h2>
          <p>
            Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). 
            You retain any and all of your rights to any Content you submit, post or display on or through the service and you are responsible for protecting those rights.
          </p>
        </section>

         <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">5. Termination</h2>
          <p>
            We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
          </p>
        </section>
      </div>
    </div>
  );
};