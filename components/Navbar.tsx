import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import { Home, Search, PlusCircle, LogIn, LogOut, User as UserIcon, Sun, Moon, Heart, Info, Menu, X, Users, UserPlus, Phone, MessageSquare } from 'lucide-react';
import { AuthModal } from './AuthModal';

export const Navbar: React.FC = () => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

  const isActive = (path: string) => location.pathname === path;

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${isActive(path)
      ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/50 dark:text-brand-400'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
    }`;

  const mobileLinkClass = (path: string) =>
    `block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2 ${isActive(path)
      ? 'text-brand-600 bg-brand-50 dark:bg-brand-900/50 dark:text-brand-400'
      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
    }`;

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  const openSignup = () => {
    setAuthMode('signup');
    setAuthModalOpen(true);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="fixed w-full top-0 z-50 transition-all duration-300 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center gap-2 mr-6" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="bg-brand-600 p-1.5 rounded-lg">
                  <Home className="h-6 w-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500 dark:from-white dark:to-gray-200 tracking-tight hidden sm:block leading-none">
                    Kejah
                  </span>
                </div>
              </Link>

              <div className="hidden md:flex items-center space-x-1">
                <Link to="/explore" className={linkClass('/explore')}>
                  <Search className="h-4 w-4" />
                  Explore
                </Link>
                <Link to="/saved" className={linkClass('/saved')}>
                  <Heart className="h-4 w-4" />
                  Saved
                </Link>
                <Link to="/agents" className={linkClass('/agents')}>
                  <Users className="h-4 w-4" />
                  Agents
                </Link>
                <Link to="/about" className={linkClass('/about')}>
                  <Info className="h-4 w-4" />
                  About
                </Link>
                <Link to="/contact" className={linkClass('/contact')}>
                  <Phone className="h-4 w-4" />
                  Contact
                </Link>
                <Link to="/feedback" className={linkClass('/feedback')}>
                  <MessageSquare className="h-4 w-4" />
                  Feedback
                </Link>
                {user && (
                  <Link to="/create" className={linkClass('/create')}>
                    <PlusCircle className="h-4 w-4" />
                    List Property
                  </Link>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>

              {user ? (
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200">
                    <UserIcon className="h-4 w-4" />
                    <span>{user.displayName}</span>
                  </div>
                  <button
                    onClick={signOut}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="hidden md:flex items-center gap-2">
                  <button
                    onClick={openLogin}
                    className="inline-flex items-center px-4 py-2 border border-brand-200 dark:border-brand-700 text-sm font-bold rounded-full text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 hover:border-brand-300 transition-all"
                  >
                    <LogIn className="h-4 w-4 mr-2" />
                    Login
                  </button>
                  <button
                    onClick={openSignup}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-bold rounded-full text-white bg-brand-600 hover:bg-brand-700 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Sign Up
                  </button>
                </div>
              )}

              <div className="flex md:hidden items-center">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-500"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {isMobileMenuOpen ? (
                    <X className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Menu className="block h-6 w-6" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-lg max-h-[85vh] overflow-y-auto">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link to="/explore" className={mobileLinkClass('/explore')} onClick={() => setIsMobileMenuOpen(false)}>
                <Search className="h-5 w-5" />
                Explore
              </Link>
              <Link to="/saved" className={mobileLinkClass('/saved')} onClick={() => setIsMobileMenuOpen(false)}>
                <Heart className="h-5 w-5" />
                Saved Properties
              </Link>
              <Link to="/agents" className={mobileLinkClass('/agents')} onClick={() => setIsMobileMenuOpen(false)}>
                <Users className="h-5 w-5" />
                Agents
              </Link>
              <Link to="/about" className={mobileLinkClass('/about')} onClick={() => setIsMobileMenuOpen(false)}>
                <Info className="h-5 w-5" />
                About Us
              </Link>
              <Link to="/contact" className={mobileLinkClass('/contact')} onClick={() => setIsMobileMenuOpen(false)}>
                <Phone className="h-5 w-5" />
                Contact
              </Link>
              <Link to="/feedback" className={mobileLinkClass('/feedback')} onClick={() => setIsMobileMenuOpen(false)}>
                <MessageSquare className="h-5 w-5" />
                Feedback
              </Link>
              {user && (
                <Link to="/create" className={mobileLinkClass('/create')} onClick={() => setIsMobileMenuOpen(false)}>
                  <PlusCircle className="h-5 w-5" />
                  List Property
                </Link>
              )}
            </div>

            <div className="pt-4 pb-4 border-t border-gray-200 dark:border-gray-800">
              {user ? (
                <div className="px-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <UserIcon className="h-8 w-8 bg-brand-100 dark:bg-brand-900 rounded-full p-1.5 text-brand-600 dark:text-brand-400" />
                    </div>
                    <div className="text-base font-medium text-gray-800 dark:text-white">
                      {user.displayName}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="px-5 space-y-3">
                  <button
                    onClick={openLogin}
                    className="w-full flex items-center justify-center px-4 py-3 border border-brand-200 dark:border-brand-700 rounded-xl text-base font-bold text-brand-700 dark:text-brand-300 bg-brand-50 dark:bg-brand-900/20 hover:bg-brand-100 dark:hover:bg-brand-900/40 transition-all"
                  >
                    <LogIn className="h-5 w-5 mr-2" />
                    Login
                  </button>
                  <button
                    onClick={openSignup}
                    className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-xl shadow-lg text-base font-bold text-white bg-brand-600 hover:bg-brand-700 transition-all"
                  >
                    <UserPlus className="h-5 w-5 mr-2" />
                    Sign Up
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};
