import { CleaningService, Testimonial, FAQItem, CommunityProgram } from '../types';

export const COMPANY_WHATSAPP_NUMBER = '+44 77 3195 6727';
export const COMPANY_WHATSAPP_LINK = 'https://wa.me/message/EJKXRLHN7TGKK1';

export const IMAGE_ASSETS = {
  hero: '/images/hero.jpg',
  heroBanner: '/images/hero-banner.jpg',
  heroSecondary: '/images/hero.jpg',
  domestic: '/images/domestic-clean.jpg',
  commercial: '/images/office-commercial.jpg',
  tenancy: '/images/end-of-tenancy.jpg',
  group: '/images/about-hub.jpg',
  aboutTeam: '/images/about-team.jpg',
  serviceRegular: '/images/service-regular.jpg',
  serviceDeep: '/images/service-deep.jpg',
  serviceCommercial: '/images/service-commercial.jpg',
  serviceEot: '/images/service-eot.jpg',
  logo: '/images/logo-emblem.jpg',
  logo3d: '/images/logo-emblem.jpg',
  ohk3d: '/images/ohk-1.jpg',
  ohk1: '/images/ohk-1.jpg',
};

export const CLEANING_SERVICES: CleaningService[] = [
  {
    id: 'domestic-regular',
    slug: 'domestic-cleaning',
    title: 'Regular Home Cleaning',
    tagline: 'Regular home cleaning arranged around your needs',
    category: 'domestic',
    shortDesc: 'Regular home cleaning arranged around your household and preferred schedule.',
    fullDesc: 'We provide regular home cleaning across Renfrewshire and Glasgow. The cleaning plan can include dusting, vacuuming, mopping, kitchen surfaces and bathrooms, based on the agreed requirements.',
    features: [
      'Cleaning schedule discussed before booking',
      'Cleaning tasks agreed with you before the visit'
    ],
    checklist: [
      'Dusting tables, shelves, and skirting boards',
      'Vacuuming all carpets, rugs, and sofas',
      'Mopping all hard floors and tiles',
      'Wiping kitchen worktops, sinks, and cooker tops',
      'Scrubbing showers, baths, sinks, and toilets',
      'Polishing glass mirrors and chrome taps',
      'Emptying waste bins and putting in fresh bags'
    ],
    priceStart: 'From £18.50 / hr',
    estimatedTime: '2 to 4 hours per visit, depending on the property and cleaning scope',
    image: '/images/service-regular.jpg',
    popular: true,
  },
  {
    id: 'deep-cleaning',
    slug: 'deep-cleaning',
    title: 'Deep Spring Cleaning',
    tagline: 'A big, full clean from top to bottom for a fresh home',
    category: 'domestic',
    shortDesc: 'A detailed one-off clean for homes that need extra attention.',
    fullDesc: 'A detailed one-off clean tailored to the property and the work agreed before the appointment. Contact us to discuss the rooms and tasks you would like included.',
    features: [
      'Hard-working team of cleaners',
      'Washing inside windows and window sills',
      'Removing hard limescale on taps and tiles',
      'Cleaning grease off cookers and fans',
      'Cleaning behind and under light furniture',
      'Cleaning tasks agreed before the appointment'
    ],
    checklist: [
      'Dusting light fittings, tall corners, and ceiling edges',
      'Wiping all doors, door handles, and light switches',
      'Scrubbing bath taps, shower heads, and wall tiles',
      'Cleaning grease off cooker fans and kitchen tiles',
      'Deep vacuuming cushions and sofa corners',
      'Wiping down door frames, picture frames, and baseboards'
    ],
    priceStart: 'From £85 one-off',
    estimatedTime: '4 to 7 hours with our team',
    image: '/images/service-deep.jpg',
    popular: true,
  },
  {
    id: 'end-of-tenancy',
    slug: 'end-of-tenancy',
    title: 'Move Out & Tenancy Cleaning',
    tagline: 'Move-out cleaning for renters and landlords',
    category: 'specialist',
    shortDesc: 'A detailed move-out clean for tenants and landlords.',
    fullDesc: 'Moving home? We provide a detailed move-out clean. Contact us to discuss the property, checklist and required cleaning scope.',
    features: [
      'Cleaning scope agreed before the booking',
      'Property-specific requirements discussed in advance',
      'Ask us about receipts and booking availability'
    ],
    checklist: [
      'Deep cleaning inside and outside the oven and cooker',
      'Cleaning inside windows and window ledges',
      'Wiping inside and outside all kitchen cupboards and drawers',
      'Scrubbing and descaling baths, showers, and toilets',
      'Wiping all doors, skirting boards, and switches',
      'Removing cobwebs from ceilings and corners',
      'Deep vacuuming and mopping every floor'
    ],
    priceStart: 'From £145 package',
    estimatedTime: '5 to 8 hours full property clean',
    image: '/images/service-eot.jpg',
    popular: true,
  },
  {
    id: 'commercial-office',
    slug: 'commercial-office',
    title: 'Office & Business Cleaning',
    tagline: 'Clean and tidy workplaces where your team can do their best',
    category: 'commercial',
    shortDesc: 'Cleaning for offices and commercial premises across Renfrewshire and Glasgow.',
    fullDesc: 'We provide office and commercial cleaning. Contact us to discuss your premises, preferred schedule and the cleaning tasks required.',
    features: [
      'Cleaning scope agreed before the contract',
      'Schedule discussed to suit the premises',
      'Contract terms confirmed before work begins'
    ],
    checklist: [
      'Wiping desks, computer screens, keyboards, and phones',
      'Emptying rubbish bins and recycling into fresh bags',
      'Vacuuming busy carpets and mopping hard hallways',
      'Cleaning microwaves, kitchen counters, and kettle areas',
      'Scrubbing toilets, mirrors, and towel holders',
      'Wiping glass doors and entrance mats'
    ],
    priceStart: 'From £19.50 / hr contract',
    estimatedTime: 'Agreed with the organisation',
    image: '/images/service-commercial.jpg',
    popular: false,
  },
  {
    id: 'healthcare-carehome',
    slug: 'healthcare-cleaning',
    title: 'Care Home & Health Cleaning',
    tagline: 'Cleaning for care homes and healthcare settings',
    category: 'specialist',
    shortDesc: 'Cleaning services for care homes and healthcare settings, with requirements discussed before quotation.',
    fullDesc: 'We provide cleaning for care homes and healthcare settings. Please contact us to discuss the premises, cleaning requirements and any site-specific procedures before requesting a quotation.',
    features: [
      'Cleaning scope agreed with the organisation',
      'Site-specific requirements discussed before work begins',
      'Cleaning of agreed touchpoints and shared areas',
      'Scheduling arranged by agreement'
    ],
    checklist: [
      'Cleaning scope and site requirements agreed with the organisation'
    ],
    priceStart: 'Custom Health Care Quote',
    estimatedTime: 'Agreed with the organisation',
    image: '/images/about-team.jpg',
    popular: false,
  },
  {
    id: 'carpet-upholstery',
    slug: 'carpet-upholstery',
    title: 'Carpet & Upholstery Cleaning',
    tagline: 'Cleaning to help refresh carpets and upholstered furniture',
    category: 'specialist',
    shortDesc: 'Carpet and upholstery cleaning with the approach agreed for the material and condition.',
    fullDesc: 'Carpet and upholstery cleaning to help remove everyday dirt and marks. We discuss the fabric, condition and suitable cleaning approach before work begins. Drying times vary by material, ventilation and conditions.',
    features: [
      'Cleaning approach discussed for the material',
      'Drying time depends on fabric and conditions'
    ],
    checklist: [
      'Assessment of the carpet or upholstery material',
      'Discussion of marks, stains and areas of concern',
      'Cleaning method agreed before work begins'
    ],
    priceStart: 'From £45 per room',
    estimatedTime: 'Agreed based on the item and cleaning scope',
    image: '/images/domestic-clean.jpg',
    popular: false,
  }
];

export const COMMUNITY_PROGRAMS: CommunityProgram[] = [
  {
    title: '1. OANK Home Reset',
    tagline: 'Helping local people keep a clean, safe, and happy home',
    description: 'Free or subsidised community cleaning support for people facing difficult circumstances. The support provided depends on each person’s needs and circumstances.',
    bullets: [
      'We agree on a clear cleaning plan for the home',
      'Brings back comfort, pride, and peace of mind',
      'We check to make sure the home is safe for our team',
      'Support arranged according to the agreed cleaning plan'
    ],
    referralInfo: 'Contact OANK to ask about current referral arrangements and whether Home Reset support is available.'
  },
  {
    title: '2. OANK Employment Pathway',
    tagline: 'Employment and job training support for local people',
    description: 'We support local people through employment and job training opportunities connected with our cleaning work. Contact us to ask about current opportunities and availability.',
    bullets: [
      'Employment and job training support',
      'Opportunities to develop cleaning-related skills',
      'Support to explore work opportunities connected with OANK'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [

  {
    id: '1',
    name: 'Fiona MacLeod',
    location: 'Paisley, Renfrewshire',
    service: 'Move Out Cleaning',
    rating: 5,
    quote: 'OANK Cleaning cleaned my 3-bedroom flat near Paisley station. Our letting agent checked every room, said it looked brand new, and gave us our full £1,200 deposit back right away. What a wonderful team!',
    date: '18 July 2026'
  },
  {
    id: '2',
    name: 'Dr. Alistair Campbell',
    location: 'Glasgow West End',
    service: 'Regular Home Cleaning',
    rating: 5,
    quote: 'Having a weekly cleaner from OANK has given our family our weekends back. Our cleaner is on time, so polite, and Oank checked. Our home smells lovely every Friday!',
    date: '02 August 2026'
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    location: 'Renfrew Business Park',
    service: 'Office Cleaning',
    rating: 5,
    quote: 'We hired OANK Cleaning for our offices in Paisley. Their team comes after hours, empties bins, cleans desks, and keeps our washrooms sparkling. We are very happy with their work.',
    date: '29 June 2026'
  }

];

export const FAQS: FAQItem[] = [
  {
    question: 'What is OANK Cleaning CIC and how is it different from other cleaners?',
    answer: 'OANK Cleaning CIC is a Community Interest Company in Paisley, Scotland. That means we run as a social business. We do top-quality cleaning for homes and offices. As a Community Interest Company, we work for community benefit and deliver our Home Reset and Employment Pathway programmes.',
    category: 'cic'
  },
  {
    question: 'What is the OANK Home Reset service?',
    answer: 'Home Reset provides free or subsidised community cleaning support for people facing difficult circumstances. The level of support depends on individual needs and circumstances. Contact OANK to ask about the current programme and whether support is available.',
    category: 'cic'
  },
  {
    question: 'How does the OANK Employment Pathway work?',
    answer: 'Our Employment Pathway supports local people through employment and job training opportunities connected with OANK cleaning work. Contact us to ask about current opportunities.',
    category: 'cic'
  },
  {
    question: 'Where does OANK Cleaning CIC provide cleaning services?',
    answer: 'OANK Cleaning CIC provides cleaning at customers’ homes and workplaces across the whole of Renfrewshire and Glasgow. Customers are not received at a public office.',
    category: 'general'
  },
  {
    question: 'Is OANK Cleaning a Community Interest Company?',
    answer: 'Yes. OANK Cleaning CIC is a Community Interest Company in Scotland.',
    category: 'general'
  },
  {
    question: 'Do I need to supply soaps, vacuums, or cloths?',
    answer: 'No, you do not need to buy anything! Our cleaners bring professional vacuums, clean cloths, mops, and safe cleaning products. But If you have a preferred cleaning product or equipment that you would love to provide, you should indicate during booking to get a 10% discount on the service.',
  category: 'booking'
  },
  {
    question: 'What is included in end-of-tenancy cleaning?',
    answer: 'The cleaning scope can include kitchens, ovens, cupboards, bathrooms, windows, skirting boards and floors. Contact us to agree the requirements for your property.',
    category: 'pricing'
  },
  {
    question: 'How can I get an instant price estimate or book a clean?',
    answer: 'You can use the simple Instant Quote Calculator on this website, send us a quick note on the Contact page, or call our friendly Paisley team at +44 77 3195 6727.',
    category: 'booking'
  }
];

export interface OhkayBrand {
  name: string;
  tagline: string;
  description: string;
}

export const OHKAY_BRANDS: OhkayBrand[] = [
  {
    name: 'OANK Cleaning CIC',
    tagline: 'Friendly community cleaning in Paisley and Scotland',
    description: 'Cleaning for homes and workplaces across Renfrewshire and Glasgow, alongside our Home Reset and Employment Pathway community programmes.',
  },
  {
    name: 'Ohkay Care',
    tagline: 'Kind home care and friendly help',
    description: 'Information about this service should be confirmed directly with the relevant provider.',
  },
  {
    name: 'Ohkay Staffing',
    tagline: 'Fast staffing for care homes and hospitals',
    description: 'Providing helpful, qualified nurses and care workers to Scottish care homes and clinics when they need extra hands.',
  },
  {
    name: 'Ohkay Recruitment',
    tagline: 'Helping good workers find great care jobs',
    description: 'Matching caring nurses, doctors, and healthcare workers with permanent jobs across the United Kingdom.',
  },
];
