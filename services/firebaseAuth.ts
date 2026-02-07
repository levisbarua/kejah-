import { auth } from "./firebaseConfig";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser
} from "firebase/auth";
import { User, UserRole } from "../types";

const mapFirebaseUser = (user: FirebaseUser): User => {
  return {
    uid: user.uid,
    displayName: user.displayName || "User",
    email: user.email || "",
    role: UserRole.BUYER, // Default role
    photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || "User"}&background=0D8ABC&color=fff`,
    isVerified: user.emailVerified
  };
};

export const firebaseAuth = {
  async signUp(name: string, email: string, pass: string): Promise<User> {
    if (!auth) throw new Error("Firebase Auth is not initialized");

    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    await updateProfile(userCredential.user, { displayName: name });

    const user = mapFirebaseUser(userCredential.user);

    const now = new Date();
    // Create user in Firestore with 'email' provider
    const { default: dbService } = await import("./databaseService");
    await dbService.updateUser(user.uid, {
      ...user,
      role: UserRole.BUYER,
      authProvider: 'email',
      lastLoginISO: now.toISOString(),
      createdAtISO: now.toISOString()
    });

    return user;
  },

  async signIn(email: string, pass: string): Promise<User> {
    if (!auth) throw new Error("Firebase Auth is not initialized");

    const userCredential = await signInWithEmailAndPassword(auth, email, pass);
    const user = mapFirebaseUser(userCredential.user);

    // RESTRICTION CHECK:
    const { default: dbService } = await import("./databaseService");
    const existingProfile = await dbService.getUserById(user.uid);

    if (existingProfile && existingProfile.authProvider === 'google') {
      await signOut(auth); // Kick them out immediately
      throw new Error("This account was created with Google. Please sign in with Google.");
    }

    // Track login activity
    const now = new Date();
    await dbService.updateUser(user.uid, {
      lastLoginISO: now.toISOString()
    });

    return user;
  },

  async logout() {
    if (!auth) return;
    await signOut(auth);
  },

  async setupRecaptcha(elementId: string) {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    const { RecaptchaVerifier } = await import("firebase/auth");

    const existingVerifier = (window as any).recaptchaVerifier;
    if (existingVerifier) {
      existingVerifier.clear();
    }

    const verifier = new RecaptchaVerifier(auth, elementId, {
      'size': 'normal',
      'callback': (response: any) => { }
    });

    (window as any).recaptchaVerifier = verifier;
    return verifier;
  },

  async verifyPhone(phoneNumber: string): Promise<User> {
    if (!auth?.currentUser) throw new Error("No user logged in");

    const user = mapFirebaseUser(auth.currentUser);
    const updatedUser = { ...user, phoneNumber, isVerified: true };
    const { default: dbService } = await import("./databaseService");
    await dbService.updateUser(user.uid, { phoneNumber, isVerified: true });

    return updatedUser;
  },

  async startPhoneVerification(phoneNumber: string, verifier: any) {
    if (!auth?.currentUser) throw new Error("No user logged in");
    const { linkWithPhoneNumber } = await import("firebase/auth");

    try {
      const confirmationResult = await linkWithPhoneNumber(auth.currentUser, phoneNumber, verifier);
      return confirmationResult;
    } catch (error: any) {
      console.error("Error sending SMS code:", error);
      throw error;
    }
  },

  async signInWithGoogle(): Promise<User> {
    if (!auth) throw new Error("Firebase Auth is not initialized");
    const { GoogleAuthProvider, signInWithPopup } = await import("firebase/auth");
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = mapFirebaseUser(result.user);

    const { default: dbService } = await import("./databaseService");
    const existingProfile = await dbService.getUserById(user.uid);

    // RESTRICTION CHECK:
    // If profile exists AND provider is NOT google -> BLOCK
    if (existingProfile && existingProfile.authProvider === 'email') {
      await signOut(auth); // Kick them out
      throw new Error("This account was created with Email/Password. Please sign in with that.");
    }

    // If new user (no existence of profile) OR existing google user, update/create doc
    const now = new Date();
    const updateData: any = {
      ...user,
      authProvider: 'google',
      lastLoginISO: now.toISOString()
    };

    if (!existingProfile) {
      updateData.createdAtISO = now.toISOString();
    }

    await dbService.updateUser(user.uid, updateData);

    return user;
  }
};
