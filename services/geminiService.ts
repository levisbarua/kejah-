import { GoogleGenAI, Type } from "@google/genai";
import { FilterState, ListingType } from "../types";

// Helper to get fresh instance
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

// Feature 1: Convert natural language to structured filters
export const extractFiltersFromQuery = async (query: string): Promise<FilterState> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Extract housing search filters from this query: "${query}".`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            city: { type: Type.STRING },
            minPrice: { type: Type.NUMBER },
            maxPrice: { type: Type.NUMBER },
            minBeds: { type: Type.NUMBER },
            type: { type: Type.STRING, enum: ["sale", "rent"] }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return {};
    
    const data = JSON.parse(text);
    
    if (data.type === 'sale') data.type = ListingType.SALE;
    else if (data.type === 'rent') data.type = ListingType.RENT;
    else delete data.type;

    return data;
  } catch (error) {
    console.error("Gemini Filter Extraction Error:", error);
    return {};
  }
};

// Feature 2: Generate a compelling description
export const generateListingDescription = async (
  features: string[],
  type: string,
  city: string
): Promise<string> => {
  try {
    const ai = getAI();
    const prompt = `Write a compelling real estate description for a ${type} in ${city}. Features: ${features.join(', ')}.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    return response.text || "Description unavailable.";
  } catch (error) {
    return "Beautiful property waiting for you.";
  }
};

// Feature 3: AI Chatbot
// Use 'any' for chatSession to avoid runtime import issues with TypeScript interfaces
let chatSession: any | null = null;

export interface ChatMessageResponse {
  text: string;
  sources?: { title: string; uri: string }[];
}

export const sendChatMessage = async (message: string): Promise<ChatMessageResponse> => {
  const ai = getAI();
  
  if (!chatSession) {
    chatSession = ai.chats.create({
      model: "gemini-3-flash-preview",
      config: {
        systemInstruction: "You are a professional real estate assistant for 'Kejah'. Keep answers under 3 sentences.",
      }
    });
  }

  try {
    const result = await chatSession.sendMessage({ message });
    return { 
      text: result.text || "I'm not sure how to respond to that."
    };
  } catch (error: any) {
    console.error("Gemini Chat Error:", error);
    chatSession = null;
    return { text: "I'm having trouble connecting. Please try again." };
  }
};

// Feature 4: Neighborhood Insights
export interface GroundingLink {
  title: string;
  uri: string;
}

export interface NeighborhoodInsight {
  text: string;
  links: GroundingLink[];
}

export const getNeighborhoodInsights = async (address: string, topic: string): Promise<NeighborhoodInsight> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Tell me about ${topic} near ${address}.`,
      config: {
        tools: [{ googleMaps: {} }],
      },
    });

    const text = response.text || "No insights available.";
    const links: GroundingLink[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach((chunk: any) => {
      if (chunk.web?.uri && chunk.web?.title) {
        links.push({ title: chunk.web.title, uri: chunk.web.uri });
      } else if (chunk.maps?.uri && chunk.maps?.title) {
        links.push({ title: chunk.maps.title, uri: chunk.maps.uri });
      }
    });

    return { text, links };
  } catch (error: any) {
    return { text: "Unable to load insights right now.", links: [] };
  }
};

export const generateWelcomeMessage = async (userName: string): Promise<string> => {
  try {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short welcome for "${userName}" joining Kejah.`,
    });
    return response.text || `Welcome to Kejah, ${userName}!`;
  } catch (error) {
    return `Welcome to Kejah, ${userName}!`;
  }
};