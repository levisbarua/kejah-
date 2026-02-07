import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore/lite";
import { getStorage, FirebaseStorage } from "firebase/storage";

// --------------------------------------------------------
// LIVE vs DEMO MODE CONFIGURATION
// --------------------------------------------------------
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Check if Firebase is actually configured with real keys
export const isFirebaseConfigured = !!(
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey.length > 20 && 
  !firebaseConfig.apiKey.startsWith("PASTE_")
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

if (isFirebaseConfigured) {
  try {
    const existingApps = getApps();
    app = existingApps.length > 0 ? existingApps[0] : initializeApp(firebaseConfig);
    
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    console.log("✅ Firebase initialized in Live Mode.");
  } catch (error: any) {
    console.error("❌ Firebase failed to initialize (Project might be deleted). Reverting to Demo Mode:", error.message);
    // Explicitly set to undefined to trigger Mock Fallbacks in databaseService
    app = undefined;
    auth = undefined;
    db = undefined;
    storage = undefined;
  }
} else {
  console.log("⚠️ Running in DEMO MODE with Mock Data.");
}

export { auth, db, storage };