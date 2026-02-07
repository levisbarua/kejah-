import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import { api } from '../services/api';
import { supabase } from '../services/supabaseClient';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  verifyPhone: (phoneNumber: string) => Promise<void>;
  setupRecaptcha: (elementId: string) => Promise<any>;
  sendVerificationCode: (phoneNumber: string, verifier: any) => Promise<void>;
  confirmVerificationCode: (code: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loading: boolean;
  isNewSignup: boolean;
  clearNewSignupParams: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren<{}>) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isNewSignup, setIsNewSignup] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      // Listen for auth changes with Firebase
      if (api.isLive) {
        // Using direct import to avoid circular dependency or extensive refactoring for now
        const { auth } = await import('../services/firebaseConfig');
        const { onAuthStateChanged } = await import('firebase/auth');

        if (auth) {
          const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
              // Map initial firebase user
              const mappedUser: User = {
                uid: user.uid,
                displayName: user.displayName || "User",
                email: user.email || "",
                role: UserRole.BUYER,
                photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=0D8ABC&color=fff`,
                isVerified: user.emailVerified
              };

              // Fetch additional profile data from Firestore (e.g. phoneNumber, verified status)
              try {
                // Dynamically import to avoid circular dependency
                const { default: dbService } = await import('../services/databaseService');
                const userProfile = await dbService.getUserById(user.uid);

                if (userProfile) {
                  // Merge auth data with profile data
                  setUser({ ...mappedUser, ...userProfile });
                } else {
                  setUser(mappedUser);
                }
              } catch (err) {
                console.error("Error fetching user profile:", err);
                setUser(mappedUser);
              }
            } else {
              setUser(null);
            }
          });
          return () => unsubscribe();
        }
        setLoading(false);
      } else {
        // Mock
        // @ts-ignore - currentUser only exists on mockAuth
        setUser(api.auth.currentUser);
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    const user = await api.auth.signIn(email, password);
    if (!api.isLive) setUser(user); // Mock needs manual set
  };

  const signUp = async (name: string, email: string, password: string) => {
    const user = await api.auth.signUp(name, email, password);
    if (!api.isLive) setUser(user); // Mock needs manual set
    setIsNewSignup(true);
  };

  const signOut = async () => {
    await api.auth.logout();
    if (!api.isLive) setUser(null); // Mock needs manual set
    setIsNewSignup(false);
  };

  const verifyPhone = async (phoneNumber: string) => {
    const updatedUser = await api.auth.verifyPhone(phoneNumber);
    setUser(prev => prev ? { ...prev, ...updatedUser } : updatedUser);
  };

  const signInWithGoogle = async () => {
    // @ts-ignore - signInWithGoogle doesn't exist on mockAuth yet
    const user = await api.auth.signInWithGoogle();
    if (!api.isLive) setUser(user);
  };

  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const setupRecaptcha = async (elementId: string) => {
    if (!api.isLive) return null; // Mock
    return await api.auth.setupRecaptcha(elementId);
  };

  const sendVerificationCode = async (phoneNumber: string, verifier: any) => {
    if (!api.isLive) return; // Mock
    const result = await api.auth.startPhoneVerification(phoneNumber, verifier);
    setConfirmationResult(result);
  };

  const confirmVerificationCode = async (code: string) => {
    if (!api.isLive) return; // Mock
    if (!confirmationResult) throw new Error("No verification code sent");

    // Confirm code
    const result = await confirmationResult.confirm(code);
    const firebaseUser = result.user;

    // Update DB with verified status
    const { default: dbService } = await import("../services/databaseService");
    // Ensure we update using the UID from the result (should match current user)
    await dbService.updateUser(firebaseUser.uid, {
      phoneNumber: firebaseUser.phoneNumber,
      isVerified: true
    });

    // Update local state
    setUser(prev => prev ? { ...prev, phoneNumber: firebaseUser.phoneNumber, isVerified: true } : null);
  };

  const clearNewSignupParams = () => setIsNewSignup(false);

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, verifyPhone, signInWithGoogle, setupRecaptcha, sendVerificationCode, confirmVerificationCode, loading, isNewSignup, clearNewSignupParams }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
