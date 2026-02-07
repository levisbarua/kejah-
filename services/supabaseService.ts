import { supabase } from './supabaseClient';
import { User, Listing, ListingType, UserRole, FeedbackData } from '../types';

// --- AUTH SERVICE ---
export const supabaseAuth = {
  async login(email?: string, password?: string) {
    if (!supabase || !email || !password) throw new Error("Supabase not configured or invalid credentials");
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return await supabaseDb.getUserById(data.user.id);
  },

  async signUp(name: string, email?: string, password?: string) {
    if (!supabase || !email || !password) throw new Error("Supabase not configured");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role: 'agent' } // Default role
      }
    });

    if (error) throw error;
    if (data.user) {
      // Create profile
      await supabase.from('users').insert({
        id: data.user.id,
        display_name: name,
        email: email,
        role: 'agent',
        is_verified: false
      });
      return await supabaseDb.getUserById(data.user.id);
    }
    return null;
  },

  async logout() {
    if (supabase) await supabase.auth.signOut();
  },

  async verifyPhone(phoneNumber: string) {
    if (!supabase) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('users').update({ phone_number: phoneNumber, is_verified: true }).eq('id', user.id);
      return await supabaseDb.getUserById(user.id);
    }
  },

  get currentUser() {
    return null; // State is handled by AuthContext via listeners
  }
};

// --- DB SERVICE ---
export const supabaseDb = {
  async getUserById(uid: string): Promise<User | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('users').select('*').eq('id', uid).single();
    if (error || !data) return null;

    return {
      uid: data.id,
      email: data.email,
      displayName: data.display_name,
      role: data.role as UserRole,
      photoURL: data.photo_url,
      isVerified: data.is_verified,
      phoneNumber: data.phone_number
    };
  },

  async getAgents(): Promise<User[]> {
    if (!supabase) return [];
    const { data } = await supabase.from('users').select('*').eq('role', 'agent');
    return (data || []).map(d => ({
      uid: d.id,
      email: d.email,
      displayName: d.display_name,
      role: d.role as UserRole,
      photoURL: d.photo_url,
      isVerified: d.is_verified,
      phoneNumber: d.phone_number
    }));
  },

  async getListings(filters: any): Promise<Listing[]> {
    if (!supabase) return [];

    let query = supabase.from('listings').select('*').neq('status', 'suspended');

    if (filters.type) query = query.eq('type', filters.type);
    if (filters.minPrice) query = query.gte('price', filters.minPrice);
    if (filters.maxPrice) query = query.lte('price', filters.maxPrice);
    if (filters.city) query = query.ilike('city', `%${filters.city}%`);
    if (filters.bedrooms) {
      if (filters.bedrooms === '4+') query = query.gte('bedrooms', 4);
      else query = query.eq('bedrooms', Number(filters.bedrooms));
    } else if (filters.minBeds) {
      query = query.gte('bedrooms', filters.minBeds);
    }

    // Sort: Featured first, then Newest
    query = query.order('featured', { ascending: false }).order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) {
      console.error(error);
      return [];
    }

    return (data || []).map(mapDbListingToType);
  },

  async getListingById(id: string): Promise<Listing | null> {
    if (!supabase) return null;
    const { data, error } = await supabase.from('listings').select('*').eq('id', id).single();
    if (error || !data) return null;
    return mapDbListingToType(data);
  },

  async incrementListingViews(id: string) {
    if (!supabase) return;
    await supabase.rpc('increment_views', { row_id: id });
  },

  async addListing(listing: any) {
    if (!supabase) return;
    const dbListing = {
      title: listing.title,
      description: listing.description,
      price: listing.price,
      type: listing.type,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      amenities: listing.amenities,
      image_urls: listing.imageUrls,
      city: listing.location.city,
      state: listing.location.state,
      address: listing.location.address,
      lat: listing.location.lat || 0,
      lng: listing.location.lng || 0,
      creator_id: listing.creatorId,
      created_at: new Date().toISOString(),
      status: 'active',
      featured: listing.featured || false,
      views: 0
    };

    const { data, error } = await supabase.from('listings').insert(dbListing).select().single();
    if (error) throw error;
    return mapDbListingToType(data);
  },

  async reportListing(listingId: string, reason: string) {
    if (!supabase) return;
    await supabase.from('reports').insert({ listing_id: listingId, reason });
  },

  async addFeedback(feedback: FeedbackData) {
    if (!supabase) return;
    await supabase.from('feedback').insert({
      user_id: feedback.userId,
      name: feedback.name,
      email: feedback.email,
      type: feedback.type,
      rating: feedback.rating,
      message: feedback.message
    });
  },

  async submitContactMessage(data: any) {
    if (!supabase) return;
    await supabase.from('contact_messages').insert(data);
  }
};

// --- STORAGE SERVICE ---
export const supabaseStorage = {
  async uploadImage(file: File): Promise<string> {
    if (!supabase) throw new Error("Supabase not configured");
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, '_')}`;
    const { data, error } = await supabase.storage.from('listings').upload(fileName, file);

    if (error) throw error;

    const { data: urlData } = supabase.storage.from('listings').getPublicUrl(fileName);
    return urlData.publicUrl;
  }
};

// Helper Mapper
function mapDbListingToType(db: any): Listing {
  return {
    id: db.id,
    creatorId: db.creator_id,
    title: db.title,
    description: db.description,
    price: db.price,
    type: db.type as ListingType,
    bedrooms: db.bedrooms,
    bathrooms: db.bathrooms,
    amenities: db.amenities || [],
    imageUrls: db.image_urls || [],
    location: {
      lat: db.lat,
      lng: db.lng,
      address: db.address,
      city: db.city,
      state: db.state,
      zip: ''
    },
    createdAt: new Date(db.created_at).getTime(),
    featured: db.featured,
    views: db.views,
    status: db.status || 'active',
    reportCount: 0
  };
}
