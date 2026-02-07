import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import * as ReactRouterDOM from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { Navbar } from '../components/Navbar';
import { Home } from '../pages/Home';
import { Explore } from '../pages/Explore';
import { CreateListing } from '../pages/CreateListing';
import { ListingDetails } from '../pages/ListingDetails';
import { SavedListings } from '../pages/SavedListings';
import { About } from '../pages/About';
import { Agents } from '../pages/Agents';
import { Feedback } from '../pages/Feedback';
import { ContactUs } from '../pages/ContactUs';
import { Privacy } from '../pages/Privacy';
import { Terms } from '../pages/Terms';
import { ChatBot } from '../components/ChatBot';
import { LiveAssistant } from '../components/LiveAssistant';

const { HashRouter, Routes, Route, Outlet, Link } = ReactRouterDOM;

const Layout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Navbar />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <ChatBot />
      <LiveAssistant />
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 mt-auto transition-colors duration-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Brand & Social */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500 dark:from-white dark:to-gray-200">
                  Kejah
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm leading-relaxed">
                Find your dream home with the power of AI. We connect you with the best properties, verified agents, and deep neighborhood insights to make your decision easier.
              </p>
              <div className="flex gap-4 pt-2">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" aria-label="Twitter">
                  <Twitter className="h-6 w-6 text-[#1DA1F2] fill-current" />
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" aria-label="Facebook">
                  <Facebook className="h-6 w-6 text-[#1877F2] fill-current" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" aria-label="Instagram">
                  <Instagram className="h-6 w-6 text-[#E1306C]" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110" aria-label="LinkedIn">
                  <Linkedin className="h-6 w-6 text-[#0A66C2] fill-current" />
                </a>
              </div>
            </div>

            {/* Column 2: Discover */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Discover</h3>
              <ul className="space-y-3">
                <li><Link to="/explore" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors">Properties</Link></li>
                <li><Link to="/agents" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors">Find an Agent</Link></li>
                <li><Link to="/saved" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors">Saved Homes</Link></li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors">Contact</Link></li>
                <li><Link to="/feedback" className="text-sm text-gray-500 hover:text-brand-600 dark:text-gray-400 dark:hover:text-brand-400 transition-colors">Feedback</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 font-medium text-center md:text-left">
              © 2024 Kejah. Built with React & Gemini.
            </p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-xs text-gray-600 dark:text-gray-400">
              <Link to="/privacy" className="hover:text-gray-900 dark:hover:text-white cursor-pointer font-medium transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-gray-900 dark:hover:text-white cursor-pointer font-medium transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="saved" element={<SavedListings />} />
              <Route path="agents" element={<Agents />} />
              <Route path="create" element={<CreateListing />} />
              <Route path="listing/:id" element={<ListingDetails />} />
              <Route path="about" element={<About />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="contact" element={<ContactUs />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="terms" element={<Terms />} />
            </Route>
          </Routes>
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;