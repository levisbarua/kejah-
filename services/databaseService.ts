import { db, isFirebaseConfigured } from "./firebaseConfig";
import { mockFirestore, MOCK_LISTINGS } from "./mockFirebase";
import {
    collection,
    getDoc,
    getDocs,
    doc,
    query,
    where,
    addDoc,
    updateDoc,
    setDoc,
    deleteDoc, // Imported for removal
    increment,
    DocumentSnapshot
} from "firebase/firestore/lite";
import { User, Listing, FeedbackData } from "../types";

// Helper to handle the service toggle
const useMock = !isFirebaseConfigured || !db;

const firestoreService = {
    getUserById: async (uid: string): Promise<User | null> => {
        if (!db) return null;
        try {
            const userDoc = await getDoc(doc(db, "users", uid));
            if (userDoc.exists()) {
                return userDoc.data() as User;
            }
            return null;
        } catch (e) {
            console.error("Error fetching user:", e);
            return null;
        }
    },

    updateUser: async (uid: string, data: Partial<User>) => {
        if (!db) return;
        try {
            const userRef = doc(db, "users", uid);
            await setDoc(userRef, data, { merge: true });
        } catch (e) {
            console.error("Error updating user:", e);
        }
    },

    getAgents: async (): Promise<User[]> => {
        if (!db) return [];
        try {
            const usersRef = collection(db, "users");
            const q = query(usersRef, where("role", "==", "agent"));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(d => d.data() as User);
        } catch (e) {
            console.error("Error fetching agents:", e);
            return [];
        }
    },

    seedAgents: async () => {
        if (!db) return;
        const agents = [
            {
                uid: 'agent_1',
                email: 'sarah.realtor@kejah.com',
                displayName: 'Sarah Jenkins',
                role: 'agent', // UserRole.AGENT
                photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
                isVerified: true,
                phoneNumber: '+254 712 345 678'
            },
            {
                uid: 'agent_2',
                email: 'michael.ross@kejah.com',
                displayName: 'Michael Ross',
                role: 'agent',
                photoURL: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400',
                isVerified: true,
                phoneNumber: '+254 722 987 654'
            },
            {
                uid: 'agent_3',
                email: 'priya.patel@kejah.com',
                displayName: 'Priya Patel',
                role: 'agent',
                photoURL: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400',
                isVerified: true,
                phoneNumber: '+254 733 456 789'
            }
        ];

        // Explicitly delete David Kim (agent_4) if he exists
        try {
            await deleteDoc(doc(db, "users", "agent_4"));
        } catch (e) {
            // Ignore
        }

        for (const agent of agents) {
            // Always update to ensure latest data (like phone numbers) is applied
            const agentRef = doc(db, "users", agent.uid);
            await setDoc(agentRef, agent, { merge: true });
            console.log(`Seeded/Updated agent: ${agent.displayName}`);
        }
    },

    seedListings: async () => {
        if (!db) return;

        for (const listing of MOCK_LISTINGS) {
            // Check if exists
            const listingRef = doc(db, "listings", listing.id);
            const docSnap = await getDoc(listingRef);

            if (!docSnap.exists()) {
                await setDoc(listingRef, listing);
                console.log(`Seeded listing: ${listing.title}`);
            }
        }
    },

    getListings: async (filters: any) => {
        if (!db) return [];
        try {
            const listingsRef = collection(db, "listings");
            // Basic query - in real app would build complex query based on filters
            const q = query(listingsRef, where("status", "==", "active"));
            const snapshot = await getDocs(q);
            return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Listing));
        } catch (e) {
            console.error("Error fetching listings:", e);
            return [];
        }
    },

    getListingById: async (id: string) => {
        if (!db) return null;
        try {
            const docRef = await getDoc(doc(db, "listings", id));
            return docRef.exists() ? { id: docRef.id, ...docRef.data() } as Listing : null;
        } catch (e) {
            console.error("Error fetching listing:", e);
            return null;
        }
    },

    incrementListingViews: async (id: string) => {
        if (!db) return 0;
        try {
            const ref = doc(db, "listings", id);
            await updateDoc(ref, { views: increment(1) });
            return 1; // approximate return
        } catch (e) {
            return 0;
        }
    },

    addListing: async (listing: Omit<Listing, 'id' | 'createdAt' | 'status' | 'reportCount' | 'views'>) => {
        if (!db) throw new Error("DB not initialized");
        const newListing = {
            ...listing,
            createdAt: Date.now(),
            status: 'active',
            reportCount: 0,
            views: 0
        };
        const ref = await addDoc(collection(db, "listings"), newListing);
        return { id: ref.id, ...newListing } as Listing;
    },

    reportListing: async (listingId: string, reason: string, reporterId: string) => {
        if (!db) throw new Error("DB not initialized");

        const reportData = {
            listingId,
            reporterId,
            reason,
            createdAt: Date.now(),
            status: 'pending' // pending, reviewed, resolved
        };

        const ref = await addDoc(collection(db, "reports"), reportData);
        return { id: ref.id, ...reportData };
    },

    addFeedback: async (feedback: FeedbackData) => {
        if (!db) return { success: false };
        await addDoc(collection(db, "feedback"), feedback);
        return { success: true };
    },

    submitContactMessage: async (data: any) => {
        if (!db) return { success: false };
        await addDoc(collection(db, "contact_messages"), data);
        return { success: true };
    },


};

const service = useMock ? mockFirestore : firestoreService;

export default service;