import { Listing, ListingType, User, UserRole, FeedbackData } from '../types';

// ------------------------------------------------------------------
// MongoDB MOCK Service
// In a real app, these methods would use `fetch()` to call your
// Express/Node.js/Next.js backend connected to MongoDB Atlas.
// ------------------------------------------------------------------

// Initial "Collections"
const USERS_COLLECTION: User[] = [
  {
    uid: 'user_123',
    email: 'demo@agent.com',
    displayName: 'Demo Agent',
    role: UserRole.AGENT,
    photoURL: 'https://picsum.photos/id/64/100/100',
    isVerified: true,
    phoneNumber: '5551234567'
  },
  {
    uid: 'agent_1',
    email: 'sarah.realtor@kejah.com',
    displayName: 'Sarah Jenkins',
    role: UserRole.AGENT,
    photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    isVerified: true,
    phoneNumber: '(555) 123-4567'
  },
  {
    uid: 'agent_2',
    email: 'michael.ross@kejah.com',
    displayName: 'Michael Ross',
    role: UserRole.AGENT,
    photoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
    isVerified: true,
    phoneNumber: '(555) 987-6543'
  }
];

const LISTINGS_COLLECTION: Listing[] = [
  {
    id: 'bs1', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Cozy Downtown Bedsitter',
    description: 'Efficient bedsitter unit perfect for a student or young professional. Includes kitchenette and shared laundry.',
    price: 6500, bedrooms: 0, bathrooms: 1, sqft: 350,
    amenities: ['WiFi', 'Shared Laundry', 'Furnished'],
    imageUrls: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    location: { lat: -1.2921, lng: 36.8219, address: '101 Moi Ave', city: 'Nairobi', state: 'Nairobi', zip: '00100' },
    createdAt: Date.now(), status: 'active', reportCount: 0, views: 120, featured: true
  },
  {
    id: '1b4', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Luxury 1-Bed Highrise',
    description: 'Stunning views from the 10th floor. This 1-bedroom features floor-to-ceiling windows and premium finishes.',
    price: 4200000, bedrooms: 1, bathrooms: 1, sqft: 900,
    amenities: ['Doorman', 'Valet', 'Spa'],
    imageUrls: ['https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800', 'https://images.unsplash.com/photo-1522050212171-61b01dd24579?w=800'],
    location: { lat: -1.2921, lng: 36.8219, address: '99 Westlands Rd', city: 'Nairobi', state: 'Nairobi', zip: '00800' },
    createdAt: Date.now() - 70000, status: 'active', reportCount: 0, views: 300, featured: true
  },
  {
    id: '2b1', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Modern 2-Bed Townhouse',
    description: 'Two-story townhouse with a private patio and attached garage. Ideal for small families.',
    price: 5500000, bedrooms: 2, bathrooms: 2, sqft: 1200,
    amenities: ['Garage', 'Patio', 'Stainless Steel'],
    imageUrls: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800'],
    location: { lat: -0.4169, lng: 36.9510, address: '22 King Ongo', city: 'Nyeri', state: 'Nyeri', zip: '10100' },
    createdAt: Date.now() - 80000, status: 'active', reportCount: 0, views: 90
  }
];

// Current session state
let currentUser: User | null = null;

export const mongoAuth = {
  get currentUser() { return currentUser; },
  
  async login(email?: string, password?: string) {
    // In production: await fetch('/api/auth/login', { method: 'POST', body: ... })
    currentUser = USERS_COLLECTION[0]; // Auto-login as demo user
    return currentUser;
  },

  async signUp(name: string, email?: string, password?: string) {
    // In production: await fetch('/api/auth/signup', { method: 'POST', body: ... })
    const newUser: User = {
        uid: `user_${Date.now()}`, // MongoDB uses _id, mapped here
        email: email || 'user@example.com',
        displayName: name,
        role: UserRole.AGENT,
        isVerified: false
    };
    USERS_COLLECTION.push(newUser);
    currentUser = newUser;
    return newUser;
  },

  async logout() {
    currentUser = null;
  },

  async verifyPhone(phoneNumber: string) {
    await new Promise(r => setTimeout(r, 500));
    if (currentUser) {
        currentUser.phoneNumber = phoneNumber;
        currentUser.isVerified = true;
        // Update in collection
        const idx = USERS_COLLECTION.findIndex(u => u.uid === currentUser?.uid);
        if (idx !== -1) USERS_COLLECTION[idx] = { ...currentUser };
    }
    return currentUser;
  }
};

export const mongoDb = {
  async getUserById(uid: string): Promise<User | null> {
    await new Promise(r => setTimeout(r, 100)); // Simulate network latency
    return USERS_COLLECTION.find(u => u.uid === uid) || null;
  },

  async getAgents(): Promise<User[]> {
    return USERS_COLLECTION.filter(u => u.role === UserRole.AGENT);
  },

  async getListings(filters: any): Promise<Listing[]> {
    await new Promise(r => setTimeout(r, 300));
    let results = LISTINGS_COLLECTION.filter(l => l.status !== 'suspended');

    // MongoDB Query Simulation
    if (filters.type) results = results.filter(l => l.type === filters.type);
    if (filters.minPrice) results = results.filter(l => l.price >= filters.minPrice);
    if (filters.maxPrice) results = results.filter(l => l.price <= filters.maxPrice);
    if (filters.city) results = results.filter(l => l.location.city.toLowerCase().includes(filters.city.toLowerCase()));
    
    if (filters.bedrooms) {
       if (filters.bedrooms === '4+') results = results.filter(l => l.bedrooms >= 4);
       else results = results.filter(l => l.bedrooms === Number(filters.bedrooms));
    } else if (filters.minBeds) {
      results = results.filter(l => l.bedrooms >= filters.minBeds);
    }

    // Sort: Featured first (-1), then Date (-1)
    results.sort((a, b) => {
      const fA = a.featured ? 1 : 0;
      const fB = b.featured ? 1 : 0;
      if (fA !== fB) return fB - fA;
      return b.createdAt - a.createdAt;
    });

    return results;
  },

  async getListingById(id: string): Promise<Listing | null> {
    return LISTINGS_COLLECTION.find(l => l.id === id) || null;
  },

  async incrementListingViews(id: string) {
    const listing = LISTINGS_COLLECTION.find(l => l.id === id);
    if (listing) {
        // Mongo: {$inc: { views: 1 }}
        listing.views = (listing.views || 0) + 1;
    }
  },

  async addListing(listingData: any) {
    await new Promise(r => setTimeout(r, 800));
    const newListing: Listing = {
      ...listingData,
      id: Math.random().toString(36).substr(2, 9), // Simulating ObjectId
      createdAt: Date.now(),
      status: 'active',
      reportCount: 0,
      views: 0
    };
    LISTINGS_COLLECTION.unshift(newListing);
    return newListing;
  },

  async reportListing(listingId: string, reason: string) {
    const listing = LISTINGS_COLLECTION.find(l => l.id === listingId);
    if (listing) {
        listing.reportCount = (listing.reportCount || 0) + 1;
        if (listing.reportCount >= 3) listing.status = 'suspended';
    }
  },

  async addFeedback(feedback: FeedbackData) {
    console.log("[MongoDB] Feedback received:", feedback);
    return { success: true };
  },

  async submitContactMessage(data: any) {
    console.log("[MongoDB] Contact Message:", data);
    return { success: true };
  }
};

export const mongoStorage = {
  async uploadImage(file: File): Promise<string> {
    await new Promise(r => setTimeout(r, 1000));
    // Simulate generic S3/GridFS URL
    return `https://picsum.photos/800/600?random=${Math.random()}`;
  }
};
