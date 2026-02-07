import { firebaseAuth } from './firebaseAuth';
import databaseService from './databaseService'; // Ensure this exists or use a real implementation
import { mockStorage } from './mockFirebase'; // Keep mock storage for now or update if ready
import { firebaseStorage } from './firebaseStorage';

// The application is now configured to use REAL Firebase Service.
export const api = {
  auth: firebaseAuth,
  db: databaseService, // Assuming databaseService is the real implementation wrapper
  storage: firebaseStorage,
  isLive: true
};