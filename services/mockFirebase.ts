import { Listing, ListingType, User, UserRole, FeedbackData } from '../types';

// ... (Security Rules comments remain conceptually same)

const MOCK_USER: User = {
  uid: 'user_123',
  email: 'demo@agent.com',
  displayName: 'Demo Agent',
  role: UserRole.AGENT,
  photoURL: 'https://picsum.photos/id/64/100/100',
  isVerified: true, // Mock user is a Verified Agent
  phoneNumber: '5551234567' // Initially empty to demonstrate verification flow
};

// Generating 16 listings as requested: 4 Bedsitters, 4 1-Bed, 4 2-Bed, 4 3-Bed
// Added default status: 'active', reportCount: 0, and views: 0
export const MOCK_LISTINGS: Listing[] = [
  // --- 4 BEDSITTERS (Studios) ---
  {
    id: 'bs1', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Cozy Downtown Bedsitter',
    description: 'Efficient bedsitter unit perfect for a student or young professional. Includes kitchenette and shared laundry.',
    price: 6500, bedrooms: 0, bathrooms: 1,
    amenities: ['WiFi', 'Shared Laundry', 'Furnished'],
    imageUrls: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    location: { lat: -1.2921, lng: 36.8219, address: '101 Moi Ave', city: 'Nairobi', state: 'Nairobi', zip: '00100' },
    createdAt: Date.now(), status: 'active', reportCount: 0, views: 120, featured: true
  },
  {
    id: 'bs2', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Modern Micro-Studio',
    description: 'Compact living at its finest. This bedsitter features smart storage solutions and a fold-away Murphy bed.',
    price: 7500, bedrooms: 0, bathrooms: 1,
    amenities: ['Smart Home', 'Bike Storage', 'Gym'],
    imageUrls: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800'],
    location: { lat: -4.0435, lng: 39.6682, address: '55 Nyali Rd', city: 'Mombasa', state: 'Mombasa', zip: '80100' },
    createdAt: Date.now() - 10000, status: 'active', reportCount: 0, views: 45
  },
  {
    id: 'bs3', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Sunny Garden Bedsitter',
    description: 'A bright and airy bedsitter with direct access to a community garden. Quiet neighborhood.',
    price: 5500, bedrooms: 0, bathrooms: 1,
    amenities: ['Garden Access', 'Pet Friendly', 'Parking'],
    imageUrls: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 'https://images.unsplash.com/photo-1505693314120-0d443867891c?w=800'],
    location: { lat: -0.0917, lng: 34.7680, address: '88 Milimani', city: 'Kisumu', state: 'Kisumu', zip: '40100' },
    createdAt: Date.now() - 20000, status: 'active', reportCount: 0, views: 32
  },
  {
    id: 'bs4', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Industrial Loft Bedsitter',
    description: 'Converted warehouse space with high ceilings and exposed brick. Open plan bedsitter layout.',
    price: 8500, bedrooms: 0, bathrooms: 1,
    amenities: ['Elevator', 'Roof Deck', 'AC'],
    imageUrls: ['https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800&auto=format&fit=crop'],
    location: { lat: -0.3031, lng: 36.0800, address: '404 Industrial Area', city: 'Nakuru', state: 'Nakuru', zip: '20100' },
    createdAt: Date.now() - 30000, status: 'active', reportCount: 0, views: 88
  },

  // --- 4 ONE BEDROOMS ---
  {
    id: '1b1', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Chic City 1-Bed Apartment',
    description: 'Beautifully renovated 1-bedroom apartment in the heart of the business district. Great investment.',
    price: 2800000, bedrooms: 1, bathrooms: 1,
    amenities: ['Balcony', 'Concierge', 'Pool'],
    imageUrls: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop'],
    location: { lat: -3.2192, lng: 40.1169, address: '12 Beach Rd', city: 'Malindi', state: 'Kilifi', zip: '80200' },
    createdAt: Date.now() - 40000, status: 'active', reportCount: 0, views: 150, featured: true
  },
  {
    id: '1b2', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Spacious 1-Bedroom Condo',
    description: 'Large 1-bedroom unit with a walk-in closet and updated kitchen appliances.',
    price: 12000, bedrooms: 1, bathrooms: 1.5,
    amenities: ['Dishwasher', 'In-unit Laundry', 'Gym'],
    imageUrls: ['https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=800', 'https://images.unsplash.com/photo-1484101403633-562f891dc89a?w=800'],
    location: { lat: 0.5143, lng: 35.2698, address: '303 Uganda Rd', city: 'Eldoret', state: 'Uasin Gishu', zip: '30100' },
    createdAt: Date.now() - 50000, status: 'active', reportCount: 0, views: 60
  },
  {
    id: '1b3', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Vintage 1-Bed Walkup',
    description: 'Charming 1-bedroom in a historic building. Hardwood floors and original crown molding.',
    price: 10000, bedrooms: 1, bathrooms: 1,
    amenities: ['Hardwood Floors', 'Cat Friendly', 'Heat Included'],
    imageUrls: ['https://images.unsplash.com/photo-1499916078039-922301b0eb9b?w=800', 'https://images.unsplash.com/photo-1503174971373-b1f69850bded?w=800'],
    location: { lat: -1.0388, lng: 37.0834, address: '76 Section 9', city: 'Thika', state: 'Kiambu', zip: '01000' },
    createdAt: Date.now() - 60000, status: 'active', reportCount: 0, views: 25
  },
  {
    id: '1b4', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Luxury 1-Bed Highrise',
    description: 'Stunning views from the 10th floor. This 1-bedroom features floor-to-ceiling windows and premium finishes.',
    price: 4200000, bedrooms: 1, bathrooms: 1,
    amenities: ['Doorman', 'Valet', 'Spa'],
    imageUrls: ['https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800', 'https://images.unsplash.com/photo-1522050212171-61b01dd24579?w=800'],
    location: { lat: -1.2921, lng: 36.8219, address: '99 Westlands Rd', city: 'Nairobi', state: 'Nairobi', zip: '00800' },
    createdAt: Date.now() - 70000, status: 'active', reportCount: 0, views: 300, featured: true
  },

  // --- 4 TWO BEDROOMS ---
  {
    id: '2b1', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Modern 2-Bed Townhouse',
    description: 'Two-story townhouse with a private patio and attached garage. Ideal for small families.',
    price: 5500000, bedrooms: 2, bathrooms: 2,
    amenities: ['Garage', 'Patio', 'Stainless Steel'],
    imageUrls: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 'https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=800'],
    location: { lat: -0.4169, lng: 36.9510, address: '22 King Ongo', city: 'Nyeri', state: 'Nyeri', zip: '10100' },
    createdAt: Date.now() - 80000, status: 'active', reportCount: 0, views: 90
  },
  {
    id: '2b2', creatorId: 'user_123', type: ListingType.RENT,
    title: '2-Bedroom Garden Apartment',
    description: 'Quiet 2-bedroom unit in a garden complex. Features a renovated kitchen and large living area.',
    price: 18000, bedrooms: 2, bathrooms: 1.5,
    amenities: ['Pool', 'Tennis Court', 'Playground'],
    imageUrls: ['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800', 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?w=800'],
    location: { lat: -0.4569, lng: 39.6583, address: '88 Kismayu Rd', city: 'Garissa', state: 'Garissa', zip: '70100' },
    createdAt: Date.now() - 90000, status: 'active', reportCount: 0, views: 40
  },
  {
    id: '2b3', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Historic 2-Bed Bungalow',
    description: 'Charming bungalow with original details, large front porch, and updated systems.',
    price: 3500000, bedrooms: 2, bathrooms: 1,
    amenities: ['Porch', 'Fireplace', 'Fenced Yard'],
    imageUrls: ['https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800', 'https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800'],
    location: { lat: -1.5177, lng: 37.2634, address: '45 Katoloni', city: 'Machakos', state: 'Machakos', zip: '90100' },
    createdAt: Date.now() - 100000, status: 'active', reportCount: 0, views: 75
  },
  {
    id: '2b4', creatorId: 'user_123', type: ListingType.RENT,
    title: 'Sleek 2-Bed Condo',
    description: 'Contemporary 2-bedroom condo with floor-to-ceiling glass and high-end finishes.',
    price: 25000, bedrooms: 2, bathrooms: 2,
    amenities: ['Gym', 'Concierge', 'Rooftop'],
    imageUrls: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'https://images.unsplash.com/photo-1512915922686-57c11dde9b6b?w=800'],
    location: { lat: -0.6773, lng: 34.7796, address: '909 Hospital Rd', city: 'Kisii', state: 'Kisii', zip: '40200' },
    createdAt: Date.now() - 110000, status: 'active', reportCount: 0, views: 55
  },

  // --- 4 THREE BEDROOMS ---
  {
    id: '3b1', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Spacious 3-Bed Family Home',
    description: 'Large 3-bedroom house in a great school district. Features a huge backyard and open kitchen.',
    price: 8500000, bedrooms: 3, bathrooms: 2.5,
    amenities: ['Backyard', 'School District', 'Double Garage'],
    imageUrls: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800', 'https://images.unsplash.com/photo-1556912173-3db9963ee790?w=800'],
    location: { lat: 0.0463, lng: 37.6559, address: '50 Makutano', city: 'Meru', state: 'Meru', zip: '60200' },
    createdAt: Date.now() - 120000, status: 'active', reportCount: 0, views: 110
  },
  {
    id: '3b2', creatorId: 'user_123', type: ListingType.RENT,
    title: '3-Bed Penthouse Suite',
    description: 'Exclusive penthouse with 3 bedrooms, wrap-around balcony, and panoramic city views.',
    price: 85000, bedrooms: 3, bathrooms: 3,
    amenities: ['Penthouse', 'Views', 'Private Elevator'],
    imageUrls: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    location: { lat: -1.2921, lng: 36.8219, address: '1 Kileleshwa Dr', city: 'Nairobi', state: 'Nairobi', zip: '00100' },
    createdAt: Date.now() - 130000, status: 'active', reportCount: 0, views: 500, featured: true
  },
  {
    id: '3b3', creatorId: 'user_123', type: ListingType.SALE,
    title: 'Renovated 3-Bed Farmhouse',
    description: 'Beautifully updated farmhouse on 2 acres of land. 3 bedrooms, modern kitchen, and rustic charm.',
    price: 6500000, bedrooms: 3, bathrooms: 2,
    amenities: ['Acreage', 'Barn', 'Renovated'],
    imageUrls: ['https://images.unsplash.com/photo-1516156008625-3a9d6067fab5?w=800', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'],
    location: { lat: -0.7172, lng: 36.4310, address: '888 Lakeview', city: 'Naivasha', state: 'Nakuru', zip: '20117' },
    createdAt: Date.now() - 140000, status: 'active', reportCount: 0, views: 95
  },
  {
    id: '3b4', creatorId: 'user_123', type: ListingType.RENT,
    title: '3-Bedroom Suburban Retreat',
    description: 'Quiet suburban home with 3 bedrooms, perfect for a growing family. Close to parks and shops.',
    price: 35000, bedrooms: 3, bathrooms: 2,
    amenities: ['Quiet Street', 'Deck', 'Central Air'],
    imageUrls: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&auto=format&fit=crop', 'https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop'],
    location: { lat: -0.3677, lng: 35.2831, address: '777 Tea Road', city: 'Kericho', state: 'Kericho', zip: '20200' },
    createdAt: Date.now() - 150000, status: 'active', reportCount: 0, views: 45
  }
];

export const mockAuth = {
  currentUser: null as User | null,
  login: async (email?: string, password?: string) => {
    // Mock login ignores credentials but signatures are updated for the modal
    mockAuth.currentUser = MOCK_USER;
    return MOCK_USER;
  },
  signUp: async (name: string, email?: string, password?: string) => {
    mockAuth.currentUser = {
      ...MOCK_USER,
      displayName: name,
      email: email || MOCK_USER.email,
      uid: 'user_' + Date.now()
    };
    return mockAuth.currentUser;
  },
  logout: async () => {
    mockAuth.currentUser = null;
  },
  verifyPhone: async (phoneNumber: string) => {
    await new Promise(resolve => setTimeout(resolve, 400)); // Simulate SMS Code (Reduced from 1000)
    if (mockAuth.currentUser) {
      mockAuth.currentUser = { ...mockAuth.currentUser, phoneNumber };
      return mockAuth.currentUser;
    }
    throw new Error("No user logged in");
  },
  signInWithGoogle: async () => {
    mockAuth.currentUser = {
      ...MOCK_USER,
      displayName: "Mock Google User",
      email: "google@demo.com",
      uid: 'google_user_' + Date.now()
    };
    return mockAuth.currentUser;
  }
};

export const mockFirestore = {
  getUserById: async (uid: string): Promise<User | null> => {
    await new Promise(resolve => setTimeout(resolve, 50)); // Reduced from 200
    if (uid === MOCK_USER.uid) return MOCK_USER;
    // Return current mock user if IDs match (supports dynamic signup ID)
    if (mockAuth.currentUser && uid === mockAuth.currentUser.uid) return mockAuth.currentUser;

    return {
      uid,
      email: 'agent@kejah.com',
      displayName: 'Sarah Realtor',
      role: UserRole.AGENT,
      photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=100',
      isVerified: true,
      phoneNumber: '5551234567'
    };
  },

  getAgents: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 600
    const agents: User[] = [
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
      },
      {
        uid: 'agent_3',
        email: 'priya.patel@kejah.com',
        displayName: 'Priya Patel',
        role: UserRole.AGENT,
        photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
        isVerified: true,
        phoneNumber: '(555) 456-7890'
      },
      {
        uid: 'agent_4',
        email: 'david.kim@kejah.com',
        displayName: 'David Kim',
        role: UserRole.AGENT,
        photoURL: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400',
        isVerified: false,
        phoneNumber: '(555) 222-3333'
      }
    ];
    if (mockAuth.currentUser) {
      agents.push(mockAuth.currentUser);
    } else {
      agents.push(MOCK_USER);
    }
    return agents;
  },

  getListings: async (filters: any) => {
    await new Promise(resolve => setTimeout(resolve, 150)); // Reduced from 600
    // Filter out suspended listings for the feed
    let results = MOCK_LISTINGS.filter(l => l.status !== 'suspended');

    // Simulate Firestore Compound Queries
    if (filters.type) {
      results = results.filter(l => l.type === filters.type);
    }
    if (filters.minPrice) {
      results = results.filter(l => l.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      results = results.filter(l => l.price <= filters.maxPrice);
    }
    if (filters.city) {
      results = results.filter(l => l.location.city.toLowerCase().includes(filters.city.toLowerCase()));
    }

    // Updated Bedrooms Filter Logic
    if (filters.bedrooms) {
      if (filters.bedrooms === '4+') {
        results = results.filter(l => l.bedrooms >= 4);
      } else {
        const beds = Number(filters.bedrooms);
        results = results.filter(l => l.bedrooms === beds);
      }
    } else if (filters.minBeds) {
      // Fallback to min beds if no specific bedroom filter is set (e.g. from AI)
      results = results.filter(l => l.bedrooms >= filters.minBeds);
    }

    // PREMIUM SORTING LOGIC:
    // Sort by Featured (Premium) DESC (true > false), then CreatedAt DESC
    results.sort((a, b) => {
      // Convert boolean to number (true=1, false=0) for sorting
      const featuredA = a.featured ? 1 : 0;
      const featuredB = b.featured ? 1 : 0;

      if (featuredA !== featuredB) {
        return featuredB - featuredA; // Featured first
      }
      return b.createdAt - a.createdAt; // Newest first
    });

    return results;
  },

  getListingById: async (id: string) => {
    await new Promise(resolve => setTimeout(resolve, 100)); // Reduced from 500
    // Even if suspended, we might want to return it but handle UI differently, 
    // but for now, we'll return it as is.
    return MOCK_LISTINGS.find(l => l.id === id) || null;
  },

  // Simulating Firestore FieldValue.increment(1)
  incrementListingViews: async (id: string) => {
    const listing = MOCK_LISTINGS.find(l => l.id === id);
    if (listing) {
      listing.views = (listing.views || 0) + 1;
      return listing.views;
    }
    return 0;
  },

  addListing: async (listing: Omit<Listing, 'id' | 'createdAt' | 'status' | 'reportCount' | 'views'>) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Reduced from 800
    const newListing: Listing = {
      ...listing,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      status: 'active',
      reportCount: 0,
      views: 0
    };
    MOCK_LISTINGS.unshift(newListing);
    return newListing;
  },

  reportListing: async (listingId: string, reason: string) => {
    await new Promise(resolve => setTimeout(resolve, 200)); // Reduced from 600
    const listingIndex = MOCK_LISTINGS.findIndex(l => l.id === listingId);

    if (listingIndex !== -1) {
      const listing = MOCK_LISTINGS[listingIndex];
      listing.reportCount += 1;

      // Trust & Safety: Automatic Suspension rule
      if (listing.reportCount >= 3) {
        listing.status = 'suspended';
      }
      return listing;
    }
    throw new Error("Listing not found");
  },

  addFeedback: async (feedback: FeedbackData) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Reduced from 1000
    console.log("Feedback submitted:", feedback);
    return { success: true };
  },

  submitContactMessage: async (data: any) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Reduced from 1000
    console.log("Contact message submitted:", data);
    return { success: true };
  },

  updateUser: async (uid: string, data: Partial<User>) => {
    console.log("Mock update user:", uid, data);
  },

  seedAgents: async () => {
    console.log("Mock seed agents called");
  },

  seedListings: async () => {
    console.log("Mock seed listings called");
  }
};

export const mockStorage = {
  uploadImage: async (file: File): Promise<string> => {
    await new Promise(resolve => setTimeout(resolve, 500)); // Reduced from 1500
    // Return a random image since we can't actually host user files
    const id = Math.floor(Math.random() * 100);
    return `https://picsum.photos/id/${id}/800/600`;
  }
};