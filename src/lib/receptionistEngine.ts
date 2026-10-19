/**
 * OANK Cleaning CIC - Virtual Receptionist Knowledge Base & Query Engine
 *
 * Source of Truth: /operation.md
 * Strict Mandate: Any question that falls outside operation.md must receive
 * the exact fallback message specified at the bottom of operation.md.
 */

import { PageRoute } from '../types';

export const EXACT_FALLBACK_MESSAGE =
  'Sorry, I cannot answer that question. You might need to visit our contact page to submit your enquiry and a team contact person will be in touch to address your concerns as soon as possible.';

export interface ReceptionistResponse {
  text: string;
  suggestedActions?: {
    label: string;
    route?: PageRoute;
    phone?: string;
    actionType?: 'navigate' | 'call' | 'quote';
  }[];
}

interface KnowledgeTopic {
  id: string;
  keywords: string[];
  patterns: RegExp[];
  answer: string;
  actions?: ReceptionistResponse['suggestedActions'];
}

export const KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  // 1. Overview of Our Services / What do you do / General Services
  {
    id: 'overview_services',
    keywords: [
      'tell me about your service',
      'what services do you offer',
      'what do you do',
      'about your service',
      'services overview',
      'overview',
      'who are you',
      'what is your company',
      'cleaning services',
      'commercial cleaning',
      'domestic cleaning',
    ],
    patterns: [
      /tell\s+me\s+about\s+(your\s+)?service/i,
      /what\s+services\s+do\s+you\s+offer/i,
      /what\s+do\s+you\s+(do|offer|provide)/i,
      /what\s+kind\s+of\s+cleaning/i,
      /about\s+your\s+services/i,
    ],
    answer:
      `We clean homes, offices, and move-out flats across Paisley and Glasgow! We are a Community Interest Company. That means any extra money we make helps fund our two community programs: Home Reset (free cleaning for people who need extra help) and Employment Pathway (paid training and jobs for local workers). When you book with us, you help your community!`,
    actions: [
      { label: 'Check Instant Price', route: 'quote', actionType: 'navigate' },
      { label: 'See All Services', route: 'services', actionType: 'navigate' },
      { label: 'Our Community Work', route: 'community', actionType: 'navigate' },
    ],
  },

  // 2. What is OANK Cleaning CIC / Social Enterprise / Asset Lock
  {
    id: 'about_cic',
    keywords: [
      'what is oank',
      'cic',
      'community interest company',
      'social enterprise',
      'asset lock',
      'non-profit',
      'surplus',
      'reinvestment',
      'scotland company',
      'different from ordinary',
    ],
    patterns: [
      /what\s+is\s+oank/i,
      /what\s+is\s+a\s+cic/i,
      /how\s+is\s+it\s+different/i,
      /community\s+interest\s+company/i,
      /asset\s+lock/i,
      /social\s+enterprise/i,
    ],
    answer:
      `OANK Cleaning CIC is an independent Community Interest Company in Scotland. We are a social business. We do high quality cleaning, and all extra profit is locked by law to help local people. We use that money to clean homes for people having a hard time, and to give local workers good training and paid jobs.`,
    actions: [
      { label: 'About OANK', route: 'about', actionType: 'navigate' },
      { label: 'Our Rules & Promise', route: 'governance', actionType: 'navigate' },
    ],
  },

  // 3. Home Reset Programme
  {
    id: 'home_reset',
    keywords: [
      'home reset',
      'reset',
      'practical barrier',
      'practical barriers',
      'household cleaning support',
      'housing costs',
      'hygiene barrier',
      'living environment',
      'dignity',
    ],
    patterns: [
      /what\s+is.*home\s*reset/i,
      /home\s*reset/i,
      /practical\s+barrier/i,
      /household\s+support/i,
      /help\s+with\s+cleaning\s+home/i,
      /vulnerable\s+cleaning/i,
    ],
    answer:
      `Home Reset is our free community project. Sometimes people have a home, but sickness or hard times make it hard to keep it clean. We send caring cleaners to help them clean up and feel proud of their home again. Note: We only do cleaning; we do not provide medical care or nursing.`,
    actions: [
      { label: 'See Home Reset', route: 'community', actionType: 'navigate' },
      { label: 'Contact Help Team', route: 'contact', actionType: 'navigate' },
    ],
  },

  // 4. What Home Reset does NOT do (Boundaries)
  {
    id: 'medical_boundaries',
    keywords: [
      'medical',
      'nursing',
      'personal care',
      'social care',
      'medication',
      'bathing',
      'dressing',
      'doctor',
      'treatment',
    ],
    patterns: [
      /do\s+you\s+provide\s+medical/i,
      /do\s+you\s+give\s+nursing/i,
      /personal\s+care/i,
      /social\s+care\s+services/i,
      /administer\s+medication/i,
    ],
    answer:
      `We only do home cleaning. We do NOT give medicine, nurse patients, or help with bathing or dressing. Our team only cleans rooms, washes dishes, and mops floors to keep homes safe and fresh.`,
    actions: [
      { label: 'Read Safety Rules', route: 'governance', actionType: 'navigate' },
      { label: 'Send Us a Message', route: 'contact', actionType: 'navigate' },
    ],
  },

  // 5. How to Access Home Reset / Referrals
  {
    id: 'home_reset_access',
    keywords: [
      'referral',
      'refer',
      'how to access',
      'eligibility',
      'apply',
      'qualify',
      'assessment',
      'criteria',
    ],
    patterns: [
      /how\s+to\s+(access|apply|qualify|refer)/i,
      /referral\s+process/i,
      /who\s+is\s+eligible/i,
    ],
    answer:
      `People usually join Home Reset when a housing officer, doctor, or local support group refers them. Our team visits first to make sure the home is safe for our cleaners and that we can truly help.`,
    actions: [
      { label: 'Ask About Referrals', route: 'contact', actionType: 'navigate' },
      { label: 'Call Paisley Team', phone: '+447510911940', actionType: 'call' },
    ],
  },

  // 6. Employment Pathway Programme
  {
    id: 'employment_pathway',
    keywords: [
      'employment pathway',
      'employment',
      'jobs',
      'recruitment',
      'workplace training',
      'training',
      'paid work',
      'work experience',
      'barriers to employment',
      'careers',
      'hiring',
    ],
    patterns: [
      /what\s+is.*employment\s*pathway/i,
      /employment\s*pathway/i,
      /work\s+opportunities/i,
      /job\s+training/i,
      /training\s+programme/i,
    ],
    answer:
      `Our Employment Pathway gives local people a fresh start with real paid jobs. We teach them how to clean like professionals, how to stay safe with soaps and machines, and how to treat clients with respect. Then we give them paid work with friendly team leaders!`,
    actions: [
      { label: 'See Job Training', route: 'community', actionType: 'navigate' },
      { label: 'Ask About Jobs', route: 'contact', actionType: 'navigate' },
    ],
  },

  // 7. Commercial & Domestic Cleaning / Supplies & Equipment
  {
    id: 'cleaning_supplies',
    keywords: [
      'supplies',
      'equipment',
      'products',
      'vacuum',
      'mop',
      'bring products',
      'chemicals',
      'materials',
      'do i need to provide',
    ],
    patterns: [
      /do\s+i\s+need\s+to\s+provide/i,
      /do\s+you\s+bring\s+equipment/i,
      /cleaning\s+supplies/i,
      /cleaning\s+products/i,
    ],
    answer:
      `You do not need to buy anything! Our cleaners bring all the mops, clean cloths, safe soaps, and strong vacuums needed to make your home shine. If you want us to use your own special soap, just let us know!`,
    actions: [
      { label: 'See Cleaning List', route: 'services', actionType: 'navigate' },
      { label: 'Get Instant Price', route: 'quote', actionType: 'navigate' },
    ],
  },

  // 8. End of Tenancy Cleaning & 72-Hour Re-Clean Guarantee
  {
    id: 'deposit_guarantee',
    keywords: [
      'deposit',
      'deposit back',
      'guarantee',
      '72 hour',
      're-clean',
      're clean',
      'end of tenancy',
      'tenancy clean',
      'checkout',
      'landlord',
      'letting agent',
      'inventory',
    ],
    patterns: [
      /deposit\s*back/i,
      /deposit\s*guarantee/i,
      /72\s*hour/i,
      /re-clean/i,
      /end\s+of\s+tenancy/i,
      /inventory\s+check/i,
    ],
    answer:
      `Our move-out clean is made to please landlords and rental agents. We give you a 72-Hour Free Re-Clean Guarantee: if your landlord finds any spot they are not happy with within 72 hours, we will come back and clean it again for free so you get your deposit back!`,
    actions: [
      { label: 'Move Out Price', route: 'quote', actionType: 'navigate' },
      { label: 'See Details', route: 'services', actionType: 'navigate' },
    ],
  },

  // 9. Areas We Cover / Headquarters
  {
    id: 'coverage_areas',
    keywords: [
      'location',
      'where are you based',
      'paisley',
      'glasgow',
      'coverage',
      'areas',
      'postcode',
      'renfrew',
      'johnstone',
      'hillington',
      'erskine',
      'linwood',
      'barrhead',
      'central scotland',
      'scotland',
    ],
    patterns: [
      /where\s+are\s+you\s+based/i,
      /what\s+areas\s+do\s+you\s+cover/i,
      /do\s+you\s+cover/i,
      /areas\s+covered/i,
      /postcode/i,
      /paisley/i,
      /glasgow/i,
    ],
    answer:
      `Our office is in Paisley, Scotland (postcode PA3 2PJ). We clean homes and businesses in Paisley, Renfrew, Johnstone, Hillington, Erskine, Linwood, Barrhead, and all across Glasgow!`,
    actions: [
      { label: 'Check Your Postcode', route: 'quote', actionType: 'navigate' },
      { label: 'Talk to Us', route: 'contact', actionType: 'navigate' },
    ],
  },

  // 10. How to Book or Get a Quote
  {
    id: 'quote_booking',
    keywords: [
      'quote',
      'price',
      'pricing',
      'cost',
      'how much',
      'estimate',
      'calculator',
      'book',
      'booking',
      'hourly rate',
      'rates',
    ],
    patterns: [
      /how\s+much/i,
      /get\s+a\s+quote/i,
      /quote\s+calculator/i,
      /pricing/i,
      /how\s+to\s+book/i,
      /cost\s+of\s+cleaning/i,
    ],
    answer:
      `Getting a price is super easy! You have three choices:\n1. Use our fast Online Price Calculator on this website\n2. Click 'Get in Touch' and send a quick message\n3. Call our friendly Paisley team at +44 75 1091 1940 or +44 75 2244 1379`,
    actions: [
      { label: 'Check Price Online', route: 'quote', actionType: 'navigate' },
      { label: 'Send a Message', route: 'contact', actionType: 'navigate' },
      { label: 'Call +44 75 1091 1940', phone: '+447510911940', actionType: 'call' },
    ],
  },

  // 11. Safeguarding & Professional Boundaries Policy
  {
    id: 'safeguarding',
    keywords: [
      'safeguarding',
      'vetting',
      'dbs',
      'disclosure scotland',
      'background check',
      'police check',
      'trust',
      'safe',
      'client boundaries',
      'confidentiality',
      'protection',
    ],
    patterns: [
      /safeguarding/i,
      /are\s+staff\s+vetted/i,
      /dbs\s+check/i,
      /disclosure\s+scotland/i,
      /client\s+boundaries/i,
      /background\s+check/i,
    ],
    answer:
      `You can feel completely safe with us! Every cleaner has a full police check (Enhanced DBS and Disclosure Scotland). Our staff never ask for gifts or money, and they keep your home and keys safe and private at all times.`,
    actions: [
      { label: 'Our Safety Rules', route: 'governance', actionType: 'navigate' },
      { label: 'Contact Us', route: 'contact', actionType: 'navigate' },
    ],
  },

  // 12. Health, Safety & COSHH Protocols
  {
    id: 'coshh_protocols',
    keywords: [
      'coshh',
      'colour code',
      'color code',
      'cross contamination',
      'chemicals',
      'health and safety',
      'red code',
      'yellow code',
      'blue code',
      'green code',
      'sanitisation',
    ],
    patterns: [
      /coshh/i,
      /colour\s*code/i,
      /color\s*code/i,
      /cross\s*contamination/i,
      /health\s+and\s+safety/i,
    ],
    answer:
      `We keep every room safe and germ-free with our 4-colour cloth rule:\n• 🔴 Red: Only for toilets and urinals\n• 🟡 Yellow: Only for bathroom sinks and tiles\n• 🔵 Blue: For bedrooms, living rooms, and desks\n• 🟢 Green: Only for kitchens and food areas\nThis makes sure toilet germs never touch your kitchen!`,
    actions: [
      { label: 'Our Cleaning Standards', route: 'services', actionType: 'navigate' },
      { label: 'Safety Rules', route: 'governance', actionType: 'navigate' },
    ],
  },

  // 13. Privacy Notice & GDPR Compliance
  {
    id: 'privacy_gdpr',
    keywords: [
      'privacy',
      'gdpr',
      'data protection',
      'data',
      'records',
      'personal information',
      'erase',
      'rectification',
    ],
    patterns: [
      /privacy/i,
      /gdpr/i,
      /data\s+protection/i,
      /how\s+is\s+my\s+data\s+stored/i,
    ],
    answer:
      `We protect your private details carefully. We only keep your name, phone number, and address so we can clean your home. We never sell your details to anyone. You can ask us to see or delete your details anytime by sending us a message via our secure Contact form.`,
    actions: [
      { label: 'Contact Us Safely', route: 'contact', actionType: 'navigate' },
      { label: 'Privacy Policy', route: 'governance', actionType: 'navigate' },
    ],
  },

  // 14. Direct Contact Information & Phone Numbers
  {
    id: 'contact_info',
    keywords: [
      'phone',
      'telephone',
      'call',
      'number',
      'email',
      'contact',
      'hours',
      'opening times',
      'address',
    ],
    patterns: [
      /phone\s*number/i,
      /contact\s*details/i,
      /email\s*address/i,
      /opening\s*hours/i,
      /how\s+to\s+contact/i,
    ],
    answer:
      `Here is how you can talk to us in Paisley:\n• Main Phone: +44 75 1091 1940\n• Second Phone: +44 75 2244 1379\n• Secure Portal: Open Contact Form in Menu\n• Direct Email: info [at] oankcleaning.co.uk\n• Office: Paisley, Scotland (PA3 2PJ)\n• Opening Hours: Monday to Saturday 7:00am - 8:00pm`,
    actions: [
      { label: 'Go to Contact Page', route: 'contact', actionType: 'navigate' },
      { label: 'Call +44 75 1091 1940', phone: '+447510911940', actionType: 'call' },
    ],
  },

  // 15. Company Independence & Governance Structure
  {
    id: 'company_independence',
    keywords: [
      'who owns oank',
      'independent',
      'ownership',
      'company structure',
      'governance',
      'standalone',
    ],
    patterns: [
      /who\s+owns\s+oank/i,
      /is\s+oank\s+independent/i,
      /company\s+structure/i,
    ],
    answer:
      `OANK Cleaning CIC is a fully independent Community Interest Company standing on its own. We earn our own money by doing great cleaning. All extra money stays locked by law to help local families with free home cleaning and paid job training!`,
    actions: [
      { label: 'About Us', route: 'about', actionType: 'navigate' },
      { label: 'Governance & Rules', route: 'governance', actionType: 'navigate' },
    ],
  },
];

/**
 * Smart Question Matcher using operation.md as strict source of truth
 */
export function queryReceptionist(userQuery: string): ReceptionistResponse {
  const query = userQuery.trim().toLowerCase();

  // Basic empty check
  if (!query) {
    return {
      text: EXACT_FALLBACK_MESSAGE,
      suggestedActions: [
        { label: 'Visit Contact Page', route: 'contact', actionType: 'navigate' },
      ],
    };
  }

  // 1. Direct regex pattern matches
  for (const topic of KNOWLEDGE_TOPICS) {
    for (const pattern of topic.patterns) {
      if (pattern.test(query)) {
        return {
          text: topic.answer,
          suggestedActions: topic.actions,
        };
      }
    }
  }

  // 2. Keyword score matching
  let bestTopic: KnowledgeTopic | null = null;
  let highestScore = 0;

  for (const topic of KNOWLEDGE_TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (query.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  // If match score is high enough
  if (bestTopic && highestScore >= 4) {
    return {
      text: bestTopic.answer,
      suggestedActions: bestTopic.actions,
    };
  }

  // Fallback if not recognized
  return {
    text: EXACT_FALLBACK_MESSAGE,
    suggestedActions: [
      { label: 'Go to Contact Page', route: 'contact', actionType: 'navigate' },
      { label: 'Call Paisley Office', phone: '+447510911940', actionType: 'call' },
    ],
  };
}
