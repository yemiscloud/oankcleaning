export type PageRoute = 
  | 'home' 
  | 'services' 
  | 'service-detail' 
  | 'about' 
  | 'community'
  | 'governance'
  | 'quote' 
  | 'faqs' 
  | 'contact'
  | 'privacy'
  | 'track-job'
  | 'admin-jobs'
  | 'ohkay-group';

export interface CleaningService {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: 'domestic' | 'commercial' | 'specialist';
  shortDesc: string;
  fullDesc: string;
  features: string[];
  checklist: string[];
  priceStart: string;
  estimatedTime: string;
  image: string;
  popular?: boolean;
}

export interface QuoteFormData {
  propertyType: 'house' | 'flat' | 'office' | 'commercial' | null;
  bedrooms: number | null;
  bathrooms: number | null;
  serviceType: string | null;
  frequency: 'one-off' | 'weekly' | 'fortnightly' | 'monthly' | null;
  frequencyCount?: number | null;
  addOns: string[];
  livingRoomDiningRoom: boolean;
  suppliesCleaningMaterials: boolean | null;
  bestDays: string[];
  postcode: string;
  preferredDate: string;
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  postcode: string;
  preferredDate: string;
  preferredDays?: string;
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  referenceNo?: string;
  quoteId?: string;
  frequencyCount?: number;
  databaseDelivered?: boolean;
  emailDelivered?: boolean;
  data?: T;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  service: string;
  rating: number;
  quote: string;
  date: string;
}

export interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'booking' | 'pricing' | 'staff' | 'cic';
}

export interface CommunityProgram {
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
  exclusions?: string[];
  referralInfo?: string;
}
