export type PageRoute = 
  | 'home' 
  | 'services' 
  | 'service-detail' 
  | 'about' 
  | 'community'
  | 'governance'
  | 'quote' 
  | 'faqs' 
  | 'contact';

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
  propertyType: 'house' | 'flat' | 'office' | 'commercial';
  bedrooms: number;
  bathrooms: number;
  serviceType: string;
  frequency: 'one-off' | 'weekly' | 'fortnightly' | 'monthly';
  addOns: string[];
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
  message: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  referenceNo?: string;
  quoteId?: string;
  estimatedPrice?: number;
  breakdown?: any;
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
