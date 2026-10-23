import { CleaningService, Testimonial, FAQItem, CommunityProgram } from '../types';

export const COMPANY_WHATSAPP_NUMBER = '+44 77 3195 6727';
export const COMPANY_WHATSAPP_LINK = 'https://wa.me/message/EJKXRLHN7TGKK1';

export const IMAGE_ASSETS = {
  hero: '/images/hero.webp',
  heroBanner: '/images/hero-banner.jpg',
  heroSecondary: '/images/hero.webp',
  domestic: '/images/domestic-clean.jpg',
  commercial: '/images/office-commercial.jpg',
  tenancy: '/images/end-of-tenancy.jpg',
  group: '/images/about-hub.jpg',
  aboutTeam: '/images/about-team.jpg',
  serviceRegular: '/images/service-regular.jpg',
  serviceDeep: '/images/service-deep.webp',
  serviceCommercial: '/images/service-commercial.webp',
  serviceEot: '/images/service-eot.jpg',
  serviceLaundry: '/images/service-laundry.jpg',
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
    tagline: 'We keep your house tidy and clean every week or two',
    category: 'domestic',
    shortDesc: 'Friendly, police-checked cleaners who take care of your home on days that work best for you.',
    fullDesc: 'We clean homes across Paisley and Glasgow. You get the same friendly cleaner every time. We dust surfaces, vacuum carpets, mop floors, wipe kitchen counters, and clean bathrooms until they shine.',
    features: [
      'The same friendly cleaner each visit',
      'Choose weekly or every two weeks',
      'Police-checked and fully insured staff',
      'Safe, eco-friendly cleaning soaps',
      'Safe key holding if you are not home',
      'You tell us what you want cleaned'
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
    estimatedTime: '2 to 4 hours per visit',
    image: '/images/service-regular.jpg',
    popular: true,
  },
  {
    id: 'deep-cleaning',
    slug: 'deep-cleaning',
    title: 'Deep Spring Cleaning',
    tagline: 'A big, full clean from top to bottom for a fresh home',
    category: 'domestic',
    shortDesc: 'We clean away hidden dust, dirt, limescale, and grease from every corner of your home.',
    fullDesc: 'This is a big, thorough clean for homes that need extra love. Our team moves light furniture, scrubs away bathroom limescale, degreases kitchen ovens and fans, and cleans every room so it feels brand new.',
    features: [
      'Hard-working team of cleaners',
      'Washing inside windows and window sills',
      'Removing hard limescale on taps and tiles',
      'Cleaning grease off cookers and fans',
      'Cleaning behind and under light furniture',
      'Strong cleaning soaps that kill germs'
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
    image: '/images/service-deep.webp',
    popular: true,
  },
  {
    id: 'end-of-tenancy',
    slug: 'end-of-tenancy',
    title: 'Move Out & Tenancy Cleaning',
    tagline: '100% deposit back guarantee for renters and landlords',
    category: 'specialist',
    shortDesc: 'Approved by top letting agents. A full clean that helps you get your rental deposit back.',
    fullDesc: 'Moving to a new home in Paisley or Glasgow? We do the big move-out clean so your landlord is happy. If your landlord finds any dirty spot within 72 hours, we will come back and clean it again for free!',
    features: [
      '100% Deposit Back Guarantee (free re-clean within 72 hours)',
      'Follows official letting agency check lists',
      'Oven deep clean included in package deals',
      'Official receipt for your landlord or agent',
      'Quick bookings available when you move fast',
      'We bring all our own mops, cloths, and soaps'
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
    shortDesc: 'Regular cleaning for offices, shops, and work buildings across Paisley and Scotland.',
    fullDesc: 'A clean office helps your team stay healthy and makes a great impression on guests. We clean desks, phones, kitchens, and toilets before or after your work hours so we never get in your way.',
    features: [
      'Cleaning early in the morning or in the evening',
      'Safe cleaning soaps and safe working rules',
      'Wiping high-touch spots like door handles and keyboards',
      'Daily cleaning for office kitchens and staff toilets',
      'Dedicated manager who checks quality regularly',
      'Simple monthly contracts that fit your needs'
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
    estimatedTime: 'Set to your office hours',
    image: '/images/service-commercial.webp',
    popular: false,
  },
  {
    id: 'healthcare-carehome',
    slug: 'healthcare-cleaning',
    title: 'Care Home & Health Cleaning',
    tagline: 'Extra clean spaces to keep residents safe and healthy',
    category: 'specialist',
    shortDesc: 'High-care cleaning that stops germs and protects vulnerable people.',
    fullDesc: 'We follow strict health guidelines for care homes and health clinics. We use colour-coded cloths so germs never move from room to room, and we use strong disinfectants that kill bacteria and viruses.',
    features: [
      'Meets strict NHS and care home cleanliness rules',
      'Colour-coded cloths so germs never spread',
      'Careful cleaning of handrails, buzzers, and door handles',
      'Police-checked cleaners with special care training',
      'Daily cleaning for resident rooms and lounges',
      'Fast response if there is an accidental spill'
    ],
    checklist: [
      'Wiping all surfaces with hospital-grade germ killers',
      'Mopping floors with certified germ-stopping solution',
      'Sanitising handrails, call bells, and door handles',
      'Deep cleaning ensuite bathrooms and care chairs',
      'Washing waste bin areas and laundry spaces',
      'Keeping air fresh and free from bad smells'
    ],
    priceStart: 'Custom Health Care Quote',
    estimatedTime: 'Daily or shift-based cleaning',
    image: '/images/service-laundry.jpg',
    popular: false,
  },
  {
    id: 'carpet-upholstery',
    slug: 'carpet-upholstery',
    title: 'Carpet & Sofa Cleaning',
    tagline: 'Warm water steam cleaning that lifts stains and dirt',
    category: 'specialist',
    shortDesc: 'Big steam cleaning machines that pull out deep dirt, pet hair, and tough spots.',
    fullDesc: 'Make your carpets and sofas look and smell fresh again. Our powerful warm-water extraction machines pull out deep mud, juice spills, and dust mites. The carpets dry quickly in just 2 to 4 hours.',
    features: [
      'Heavy-duty hot water steam machines',
      'Stain treatment for tough spots and spills',
      'Removes pet hair and bad pet smells',
      'Safe for wool, velvet, and soft sofas',
      'Fast drying time of 2 to 4 hours',
      'Safe for kids and family pets'
    ],
    checklist: [
      'Checking the carpet fabric to pick the safest soap',
      'Vacuuming up all loose dust and pet hair first',
      'Spraying tough stains with gentle spot lifters',
      'Brushing deep into the carpet threads',
      'Hot water steam rinse and strong suction pull',
      'Brushing carpet pile so it dries fast and feels soft'
    ],
    priceStart: 'From £45 per room',
    estimatedTime: '1 to 3 hours per room',
    image: '/images/domestic-clean.jpg',
    popular: false,
  }
];

export const COMMUNITY_PROGRAMS: CommunityProgram[] = [
  {
    title: '1. OANK Home Reset',
    tagline: 'Helping local people keep a clean, safe, and happy home',
    description: 'A free community cleaning program. Sometimes people have a home, but illness, age, or hard times make it tough to keep it clean. We send caring cleaners to help them get back on track.',
    bullets: [
      'We agree on a clear cleaning plan for the home',
      'Brings back comfort, pride, and peace of mind',
      'We check to make sure the home is safe for our team',
      'Delivered by kind, police-checked cleaners'
    ],
    exclusions: [
      'We do NOT give medicine or doctor care',
      'We do NOT help with bathing or dressing'
    ],
    referralInfo: 'Local housing officers, doctors, or support groups can help people apply.'
  },
  {
    title: '2. OANK Employment Pathway',
    tagline: 'Real paid jobs and friendly job training for local people',
    description: 'We help local people in Paisley and Glasgow who want to work. We teach them good cleaning skills, help them build confidence, and give them paid jobs.',
    bullets: [
      'Step-by-step training on how to clean like a pro',
      'Learning safe use of soaps, mops, and machines',
      'Learning workplace safety and good customer care',
      'Learning how to protect client privacy and safety',
      'Real paid cleaning work with friendly mentors',
      'Chance to step up into full-time jobs and supervisor roles'
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
    quote: 'Having a weekly cleaner from OANK has given our family our weekends back. Our cleaner is on time, so polite, and police checked. Our home smells lovely every Friday!',
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
    answer: 'OANK Cleaning CIC is a Community Interest Company in Paisley, Scotland. That means we run as a social business. We do top-quality cleaning for homes and offices. Any extra money we make goes right back to helping local people through our Home Reset and job training programmes.',
    category: 'cic'
  },
  {
    question: 'What is the OANK Home Reset service?',
    answer: 'Home Reset is our free community project. We help people who struggle to keep their home clean because of health, age, or hard times. We clean agreed rooms to restore comfort and safety. Note: We only do cleaning; we do not provide medical or personal nursing care.',
    category: 'cic'
  },
  {
    question: 'How does the OANK Employment Pathway work?',
    answer: 'Our Employment Pathway helps local people who want to work. We give them full cleaning training, teach them health and safety, and give them real paid cleaning jobs with supportive team leaders.',
    category: 'cic'
  },
  {
    question: 'Where is OANK Cleaning CIC based and what towns do you visit?',
    answer: 'Our main office is in Paisley, Scotland (postcode PA3 2PJ). We clean across Paisley, Renfrew, Johnstone, Hillington, Erskine, Linwood, Barrhead, and all of Glasgow.',
    category: 'general'
  },
  {
    question: 'Is OANK Cleaning an independent Community Interest Company?',
    answer: 'Yes! OANK Cleaning CIC is an independent company registered in Scotland. All our money is locked by law to benefit the community, not private shareholders.',
    category: 'general'
  },
  {
    question: 'Are your cleaners police-checked and insured?',
    answer: 'Yes, 100%! Every cleaner on our team has a full police check (Enhanced DBS and Disclosure Scotland) and is fully insured. We also train each cleaner thoroughly before they visit your home.',
    category: 'staff'
  },
  {
    question: 'Do I need to supply soaps, vacuums, or cloths?',
    answer: 'No, you do not need to buy anything! Our cleaners bring professional vacuums, clean cloths, mops, and safe cleaning products. If you have a special soap you love, just let us know.',
    category: 'booking'
  },
  {
    question: 'How does your 100% Deposit Back Guarantee work?',
    answer: 'If you move out and your landlord finds any dirty spot within 72 hours of our clean, tell us right away. We will come back and re-clean that spot completely free of charge so you get your deposit back.',
    category: 'pricing'
  },
  {
    question: 'How can I get an instant price estimate or book a clean?',
    answer: 'You can use the simple Instant Quote Calculator on this website, send us a quick note on the Contact page, or call our friendly Paisley team at +44 75 1091 1940 or +44 75 2244 1379.',
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
    description: 'Top-quality cleaning for homes and workplaces. Extra profits fund free home resets and paid job training for local people.',
  },
  {
    name: 'Ohkay Care',
    tagline: 'Kind home care and friendly help',
    description: 'Caring, police-checked helpers who visit seniors and people at home to help with daily living and friendly company.',
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
