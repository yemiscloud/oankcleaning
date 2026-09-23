import domesticImg from '../assets/images/domestic_cleaning_pro_1786385237318.jpg';
import commercialImg from '../assets/images/office_commercial_clean_1786385251204.jpg';
import tenancyImg from '../assets/images/end_of_tenancy_clean_1786385264213.jpg';
import heroImg from '../assets/images/hero_cleaning_banner_1786385221170.jpg';
import groupImg from '../assets/images/EjzLF.jpg';
import aboutTeamImg from '../assets/images/about-team.jpg';
import heroWebpImg from '../assets/images/hero.webp';
import serviceRegularImg from '../assets/images/service-regular.jpg';
import serviceDeepImg from '../assets/images/service-deep.webp';
import serviceCommercialImg from '../assets/images/service-commercial.webp';
import serviceEotImg from '../assets/images/service-eot.jpg';
import serviceLaundryImg from '../assets/images/service-laundry.jpg';

import { CleaningService, Testimonial, FAQItem, CommunityProgram } from '../types';

export const COMPANY_WHATSAPP_NUMBER = '+44 75 1091 1940';
export const COMPANY_WHATSAPP_LINK = 'https://wa.me/447510911940';

export const IMAGE_ASSETS = {
  hero: heroImg,
  heroSecondary: heroWebpImg,
  domestic: domesticImg,
  commercial: commercialImg,
  tenancy: tenancyImg,
  group: groupImg,
  aboutTeam: aboutTeamImg,
  serviceRegular: serviceRegularImg,
  serviceDeep: serviceDeepImg,
  serviceCommercial: serviceCommercialImg,
  serviceEot: serviceEotImg,
  serviceLaundry: serviceLaundryImg,
};

export const CLEANING_SERVICES: CleaningService[] = [
  {
    id: 'domestic-regular',
    slug: 'domestic-cleaning',
    title: 'Regular Domestic Cleaning',
    tagline: 'Tailored weekly or fortnightly housekeeping for your sanctuary',
    category: 'domestic',
    shortDesc: 'Trustworthy, DBS-checked local cleaners who take care of your home on a schedule that fits your lifestyle perfectly.',
    fullDesc: 'Our regular domestic cleaning service in Paisley and Greater Glasgow is designed around your individual preferences. We assign a dedicated, vetted cleaner to your home for consistent quality, handling everything from dusting and vacuuming to bathroom deep-cleans and kitchen sanitisation.',
    features: [
      'Same dedicated cleaner every visit',
      'Flexible weekly or fortnightly schedules',
      'Full insurance & DBS verified staff',
      'Eco-friendly non-toxic cleaning agents',
      'Keyholding service with secure protocols',
      'Customized room-by-room checklist'
    ],
    checklist: [
      'Dusting and wiping all accessible surfaces & skirting boards',
      'Vacuuming all carpets, rugs, and soft upholstery',
      'Mopping all hard flooring & tile surfaces',
      'Sanitising kitchen worktops, hobs, sink & exterior appliances',
      'Scrubbing shower cubicles, bath tubs, sinks & toilets',
      'Polishing mirrors, chrome fixtures & glass tables',
      'Emptying bins & replacing liners'
    ],
    priceStart: 'From £18.50 / hr',
    estimatedTime: '2 - 4 hours per visit',
    image: serviceRegularImg,
    popular: true,
  },
  {
    id: 'deep-cleaning',
    slug: 'deep-cleaning',
    title: 'Deep & Spring Cleaning',
    tagline: 'Comprehensive top-to-bottom refreshing for complete peace of mind',
    category: 'domestic',
    shortDesc: 'Intensive restoration clean targeting hidden dust, limescale, grease, and built-up grime in every corner of your property.',
    fullDesc: 'An exhaustive, detail-driven deep clean suitable for seasonal refreshes, pre-event preparations, or reviving a home that needs extra care. Our specialist team moves light furniture, tackles limescale in wet rooms, and degreases kitchen hoods.',
    features: [
      'Intensive multi-person team deployment',
      'Includes internal window & frame polishing',
      'Limescale removal in bathrooms & taps',
      'Kitchen degreasing & appliance exterior detailing',
      'Behind and under accessible furniture',
      'Hospital-grade sanitization treatments'
    ],
    checklist: [
      'Detailed dusting of high-level fixtures, light fittings & ceiling corners',
      'Wiping down all doors, handles, switches & sockets',
      'Deep descaling of bath taps, shower heads, and tiles',
      'Degreasing extractor fans, hob surrounds & splashbacks',
      'Deep vacuuming including furniture cushions & crevices',
      'Wiping down internal door frames & picture frames'
    ],
    priceStart: 'From £85 one-off',
    estimatedTime: '4 - 7 hours team deployment',
    image: serviceDeepImg,
    popular: true,
  },
  {
    id: 'end-of-tenancy',
    slug: 'end-of-tenancy',
    title: 'End of Tenancy Cleaning',
    tagline: '100% Deposit Back Guarantee for landlords & tenants',
    category: 'specialist',
    shortDesc: 'Approved by top UK estate agencies and letting managers. Rigorous inventory-standard deep clean guarantees deposit release.',
    fullDesc: 'Moving home in Paisley, Renfrewshire, or Glasgow? Our End of Tenancy cleaning adheres strictly to leading UK letting agent inventory checklists. We guarantee our work for 72 hours—if your landlord or agent raises any issues, we re-clean free of charge.',
    features: [
      '100% Deposit Back Guarantee (72-hour re-clean safety net)',
      'Agency & Landlord approved checklist',
      'Oven deep clean included in package options',
      'Invoice provided for deposit claim submission',
      'Same-day emergency availability options',
      'Professional team with full equipment supplied'
    ],
    checklist: [
      'Deep oven & hob degreasing (internal & external)',
      'Internal window & ledge cleaning throughout',
      'Inside and outside of all kitchen cupboards & drawers',
      'Full descaling of all sanitary ware, glass screens & tiles',
      'Skirting boards, doors, architraves & light switches',
      'Cobweb removal and high dusting across all rooms',
      'Deep vacuuming & floor sanitization'
    ],
    priceStart: 'From £145 package',
    estimatedTime: '5 - 8 hours complete property clean',
    image: serviceEotImg,
    popular: true,
  },
  {
    id: 'commercial-office',
    slug: 'commercial-office',
    title: 'Commercial & Office Cleaning',
    tagline: 'Spotless corporate environments that foster health & productivity',
    category: 'commercial',
    shortDesc: 'Bespoke commercial hygiene contracts for offices, retail hubs, showrooms, and corporate headquarters across Paisley & Scotland.',
    fullDesc: 'First impressions matter. Oank Cleaning delivers flexible out-of-hours commercial cleaning that keeps your workplace pristine, hygienic, and compliant. We customize cleaning frequencies to fit your business operations seamlessly.',
    features: [
      'Out-of-hours / overnight cleaning schedules',
      'COSHH compliant chemicals & risk assessments',
      'Touchpoint disinfection (keyboards, phones, door handles)',
      'Communal kitchen, canteen & washroom maintenance',
      'Dedicated Account Manager & regular audits',
      'Flexible short-term or long-term commercial contracts'
    ],
    checklist: [
      'Sanitising work desks, monitors, keyboards & telephones',
      'Emptying waste bins, recycling & replacing liners',
      'Vacuuming high-traffic carpets and mopping hard floors',
      'Disinfecting office kitchen, microwaves & coffee hubs',
      'Deep cleaning washroom cubicles, mirrors & towel dispensers',
      'Glass partition wiping & entryway mat maintenance'
    ],
    priceStart: 'From £19.50 / hr contract',
    estimatedTime: 'Tailored commercial schedule',
    image: serviceCommercialImg,
    popular: false,
  },
  {
    id: 'healthcare-carehome',
    slug: 'healthcare-cleaning',
    title: 'Healthcare & Care Home Cleaning',
    tagline: 'CQC compliant infection control & clinical hygiene standards',
    category: 'specialist',
    shortDesc: 'Specialized bio-sanitisation and clinical hygiene standards to protect vulnerable residents and clinical spaces.',
    fullDesc: 'Oank Cleaning understands clinical hygiene demands. We deploy strict infection prevention protocols, colour-coded microfiber systems, and hospital-grade germicides.',
    features: [
      'CQC & NHS guideline compliant cleaning methods',
      'Strict color-coded cross-contamination prevention',
      'Enhanced viral & bacterial touchpoint disinfection',
      'Enhanced DBS checked staff with care training',
      'Daily resident room & communal lounge maintenance',
      'Emergency spill & sanitisation response team'
    ],
    checklist: [
      'Hospital-grade surface disinfection across all resident areas',
      'Mopping floors with EN1276 certified anti-microbial solutions',
      'Sanitising handrails, call bells, door handles & grab bars',
      'Deep clean of ensuite bathrooms & care equipment surfaces',
      'Sluice room & waste management area sanitisation',
      'Air freshening & odour neutralization treatment'
    ],
    priceStart: 'Custom Healthcare Quote',
    estimatedTime: 'Daily or continuous shift contract',
    image: serviceLaundryImg,
    popular: false,
  },
  {
    id: 'carpet-upholstery',
    slug: 'carpet-upholstery',
    title: 'Carpet & Upholstery Care',
    tagline: 'Deep steam extraction restoring pile, removing stains & allergens',
    category: 'specialist',
    shortDesc: 'High-powered hot water extraction machines eliminate deep-seated dirt, dust mites, pet dander, and tough stains.',
    fullDesc: 'Extend the lifespan of your carpets and fabric sofas. Our trained technicians inspect fiber types, apply targeted stain pre-treatments, and utilize industrial hot water extraction to lift stubborn marks and leave carpets fresh and fast-drying.',
    features: [
      'Industrial steam & hot water extraction machinery',
      'Stain protection treatment (Scotchgard protection optional)',
      'Pet stain & stubborn odour removal specialist',
      'Safe on wool, synthetic, velvet & delicate upholstery',
      'Quick-drying technology (ready in 2-4 hours)',
      'Non-allergenic child & pet safe solutions'
    ],
    checklist: [
      'Pre-inspection & fiber identification testing',
      'High-power HEPA pre-vacuuming',
      'Targeted pre-spray treatment for high-traffic soil',
      'Agitation & stain lifting treatment',
      'Hot water extraction rinse & deep soil suction',
      'Grooming carpet pile for accelerated drying'
    ],
    priceStart: 'From £45 per room',
    estimatedTime: '1 - 3 hours depending on size',
    image: domesticImg,
    popular: false,
  }
];

export const COMMUNITY_PROGRAMS: CommunityProgram[] = [
  {
    title: '1. OANK Home Reset',
    tagline: 'Restoring dignity, hygiene & wellbeing for people facing practical barriers at home',
    description: 'A structured community cleaning intervention for individuals and families who have accommodation but experience genuine practical, physical, mobility, or confidence barriers to keeping their home clean and manageable.',
    bullets: [
      'Targeted, agreed household-cleaning support tailored to the client’s living space',
      'Supports personal dignity, mental health, and tenancy sustainment',
      'Assessed by OANK for eligibility, health & safety, and suitability',
      'Delivered by trained, empathetic, DBS-checked community cleaning specialists'
    ],
    exclusions: [
      'Does NOT provide medical treatment or nursing care',
      'Does NOT provide personal care or regulated social-care services'
    ],
    referralInfo: 'Accessed via referral or structured assessment through local partners, housing officers, or community support teams.'
  },
  {
    title: '2. OANK Employment Pathway',
    tagline: 'Creating real workplace opportunities, paid experience & accredited skills training',
    description: 'A structured progression pathway designed for people facing barriers to employment in Renfrewshire and Greater Glasgow, providing skills, mentorship, and paid work.',
    bullets: [
      'Rigorous induction and workplace cleaning skills development',
      'Comprehensive training: Safe cleaning practices, chemical handling (COSHH), equipment usage',
      'Health & safety, professional conduct, client boundaries, and confidentiality',
      'Safeguarding awareness (protecting vulnerable adults and children)',
      'Supervised paid cleaning work with ongoing supportive feedback',
      'Competency-based progression into permanent roles, supervisor pathways, or external jobs'
    ]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Fiona MacLeod',
    location: 'Paisley, Renfrewshire',
    service: 'End of Tenancy Cleaning',
    rating: 5,
    quote: 'Oank Cleaning delivered a flawless end of tenancy clean on my 3-bedroom flat near Paisley station. Our letting agent passed the inventory inspection without a single complaint and refunded our full £1,200 deposit. Exceptional service!',
    date: '18 July 2026'
  },
  {
    id: '2',
    name: 'Dr. Alistair Campbell',
    location: 'Glasgow West End',
    service: 'Regular Domestic Cleaning',
    rating: 5,
    quote: 'Having a weekly cleaner from Oank Cleaning has transformed our family weekend time. Our dedicated cleaner is punctual, thoroughly DBS-checked, and so polite. The green and gold brand ethos truly shines through!',
    date: '02 August 2026'
  },
  {
    id: '3',
    name: 'Sarah Jenkins',
    location: 'Renfrew Business Park',
    service: 'Commercial Office Cleaning',
    rating: 5,
    quote: 'We contracted Oank Cleaning for our corporate office facilities in Paisley. Their professional standards, DBS-vetted cleaners, and out-of-hours service keep our offices spotless.',
    date: '29 June 2026'
  }
];

export const FAQS: FAQItem[] = [
  {
    question: 'What is OANK Cleaning CIC and how is it different from ordinary cleaning companies?',
    answer: 'OANK Cleaning CIC is incorporated as an independent Community Interest Company (CIC) standing on its own and funded by its own trading revenue. We combine high-standard commercial and domestic cleaning with social purpose: generating trading income to fund community Home Resets (hygiene support for individuals with practical barriers) and Employment Pathways (paid training and work for people facing barriers to employment).',
    category: 'cic'
  },
  {
    question: 'What is the OANK Home Reset service?',
    answer: 'Home Reset is our planned community project providing targeted household-cleaning support to people who experience genuine practical barriers to maintaining their homes. It focuses on agreed cleaning tasks to restore dignity, wellbeing, and manageable living conditions. Note: It does NOT provide medical treatment, nursing, personal care, or regulated social care.',
    category: 'cic'
  },
  {
    question: 'How does the OANK Employment Pathway work?',
    answer: 'The Employment Pathway recruits individuals facing employment barriers, providing them with structured induction, professional training (safe cleaning, COSHH, health & safety, conduct, client boundaries, confidentiality, safeguarding), and supervised paid cleaning experience with competency-based progression.',
    category: 'cic'
  },
  {
    question: 'Where is Oank Cleaning CIC based and what areas do you cover?',
    answer: 'Our headquarters are located in Paisley, Scotland (PA3 2PJ). We cover Paisley, Renfrew, Johnstone, Hillington, Erskine, Linwood, Barrhead, Glasgow City Centre, West End, and the wider Greater Glasgow & Renfrewshire region.',
    category: 'general'
  },
  {
    question: 'Is OANK Cleaning an independent Community Interest Company?',
    answer: 'Yes. OANK Cleaning CIC is a fully independent Community Interest Company (CIC) registered in Scotland, operating on its own trading revenue and governed by our dedicated CIC board and statutory asset lock.',
    category: 'general'
  },
  {
    question: 'Are your cleaning staff vetted and insured?',
    answer: 'Every member of the Oank Cleaning team undergoes strict background verification, including enhanced DBS / Disclosure Scotland checks, identity validation, and comprehensive in-house training in health, safety, and COSHH compliance.',
    category: 'staff'
  },
  {
    question: 'Do I need to provide cleaning supplies and equipment?',
    answer: 'No, unless you prefer us to use your specialized products. Our cleaners arrive fully equipped with professional-grade, eco-friendly cleaning solutions, microfiber cloths, HEPA vacuums, and specialized mop systems.',
    category: 'booking'
  },
  {
    question: 'How does your 100% Deposit Back Guarantee work for End of Tenancy?',
    answer: 'Our End of Tenancy service follows strict UK letting agency inventory standards. If your landlord or estate agent notes any cleaning deficiency on the inventory report within 72 hours of completion, we will return and re-clean the flagged area free of charge.',
    category: 'pricing'
  },
  {
    question: 'How can I get an instant quote or book a service?',
    answer: 'You can use our interactive Online Quote Calculator on this website, click "Get in Touch" to submit an enquiry via our secure contact form, or speak directly to our Paisley team at +44 75 1091 1940 or +44 75 2244 1379.',
    category: 'booking'
  }
];
