import React from 'react';

export const Privacy: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[60vh]">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Privacy Policy</h1>
      
      <div className="space-y-8 text-gray-600 dark:text-gray-300">
        <section>
          <p className="mb-4 text-sm text-gray-500">Last updated: March 15, 2024</p>
          <p>
            At Kejah, we value your privacy and are committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, and safeguard your information when you use our real estate platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">1. Information We Collect</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Account Information:</strong> Name, email address, and phone number when you register as an agent or user.</li>
            <li><strong>Usage Data:</strong> Information about how you use our website, including search queries, property views, and saved listings.</li>
            <li><strong>Communications:</strong> Records of your interactions with our support team or agents via our contact forms.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">2. How We Use Your Information</h2>
          <p>We use your data to:</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>Provide, maintain, and improve our services.</li>
            <li>Connect buyers with agents securely.</li>
            <li>Personalize your experience and improve our AI-powered search algorithms.</li>
            <li>Send you technical notices, updates, security alerts, and support messages.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">3. Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share your information with third-party service providers (such as payment processors or cloud storage providers) to facilitate our services, or with agents when you explicitly request to contact them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">4. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please contact us at <a href="mailto:privacy@kejah.com" className="text-brand-600 hover:underline">privacy@kejah.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};