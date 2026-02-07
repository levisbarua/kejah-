export enum UserRole {
  BUYER = 'buyer',
  AGENT = 'agent',
  ADMIN = 'admin'
}

export interface User {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
  isVerified?: boolean; // Trust & Safety: Verified Agent Badge
  phoneNumber?: string; // Trust & Safety: Phone Verification required for listing
  authProvider?: 'email' | 'google';
  lastLoginISO?: string;
  createdAtISO?: string;
}

export enum ListingType {
  SALE = 'sale',
  RENT = 'rent'
}

export interface GeoLocation {
  lat: number;
  lng: number;
  address: string;
  city: string;
  state: string;
  zip: string;
}

// Firestore Document Structure for 'listings'
export interface Listing {
  id: string;
  creatorId: string; // Security rule: request.auth.uid == resource.data.creatorId
  title: string;
  description: string;
  price: number;
  type: ListingType;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  imageUrls: string[];
  location: GeoLocation;
  createdAt: number;
  featured?: boolean; // Equivalent to planType: 'premium'
  views?: number; // Analytics: View Counter
  // Trust & Safety Fields
  status: 'active' | 'suspended';
  reportCount: number;
  // Payment Fields
  paymentStatus?: 'paid' | 'pending';
  amountPaid?: number;
}

export interface FilterState {
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  bedrooms?: string; // Exact match or "4+"
  type?: ListingType;
}

export interface Report {
  id: string;
  listingId: string;
  reporterId: string;
  reporterEmail?: string;
  reporterName?: string;
  reason: string;
  createdAt: number;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface FeedbackData {
  userId?: string;
  name: string;
  email: string;
  type: 'general' | 'bug' | 'feature';
  rating: number;
  message: string;
  timestamp: number;
}