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
      `We provide professional commercial and domestic cleaning, including End of Tenancy cleaning, across Paisley, Renfrewshire and Greater Glasgow. As a Community Interest Company we also run Home Reset (cleaning support for people with practical barriers) and an Employment Pathway (paid training and work experience). When you book with us, you support a social enterprise that reinvests surplus into community benefit.`,
    actions: [
      { label: 'Calculate Instant Quote', route: 'quote', actionType: 'navigate' },
      { label: 'Explore Services', route: 'services', actionType: 'navigate' },
      { label: 'View Community Pilots', route: 'community', actionType: 'navigate' },
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
      `OANK Cleaning CIC is incorporated as an independent Community Interest Company (CIC) standing on its own and funded by its own trading revenue. We combine high-standard commercial and domestic cleaning with social purpose: generating trading income to fund community Home Resets and Employment Pathways.\n\nIn compliance with the Community Interest Company Regulations 2005, our assets are permanently locked and cannot be distributed for personal gain. Trading surpluses are reinvested into subsidised cleaning assistance for vulnerable households and structured workforce training.`,
    actions: [
      { label: 'Learn About OANK', route: 'about', actionType: 'navigate' },
      { label: 'Governance & Asset Lock', route: 'governance', actionType: 'navigate' },
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
      `Home Reset is our planned community project providing targeted household-cleaning support to people who experience genuine practical barriers to maintaining their homes. It focuses on agreed cleaning tasks to restore dignity, wellbeing and manageable living conditions. It does not provide medical treatment, nursing, personal care or regulated social care.\n\nPeople normally access Home Reset through an appropriate referral or assessment process. OANK assesses eligibility, safety and suitability before accepting a case.`,
    actions: [
      { label: 'View Community Pilot', route: 'community', actionType: 'navigate' },
      { label: 'Contact Referral Team', route: 'contact', actionType: 'navigate' },
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
      `OANK Cleaning CIC and the Home Reset programme strictly provide domestic and hygiene cleaning support. Home Reset does NOT provide medical treatment, nursing, personal care (such as bathing/dressing), or regulated social-care services. Our staff are strictly prohibited from administering medication or giving medical care.`,
    actions: [
      { label: 'Read Governance & Policies', route: 'governance', actionType: 'navigate' },
      { label: 'Get in Touch', route: 'contact', actionType: 'navigate' },
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
      `People normally access the Home Reset programme through an appropriate referral or assessment process (e.g. via partner agencies, housing officers, or community support teams). OANK assesses eligibility, safety and the suitability of requested work before accepting a case.`,
    actions: [
      { label: 'Submit Referral Enquiry', route: 'contact', actionType: 'navigate' },
      { label: 'Call Paisley HQ', phone: '+447510911940', actionType: 'call' },
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
      `The Employment Pathway creates structured opportunities for individuals facing barriers to employment. OANK plans to recruit suitable individuals, provide induction and cleaning/workplace training, and provide supervised paid cleaning experience.\n\nTraining covers safe cleaning practices, cleaning equipment/products, health & safety, COSHH compliance, professional conduct, client boundaries, confidentiality, and safeguarding awareness.`,
    actions: [
      { label: 'View Employment Pathway', route: 'community', actionType: 'navigate' },
      { label: 'Enquire About Pathway', route: 'contact', actionType: 'navigate' },
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
      `Our cleaners arrive fully equipped with professional-grade, eco-friendly cleaning solutions, microfiber cloths, HEPA vacuums and specialised mop systems. Customers do not need to supply cleaning products unless they prefer us to use their own specialised items.`,
    actions: [
      { label: 'View Cleaning Services', route: 'services', actionType: 'navigate' },
      { label: 'Get an Instant Quote', route: 'quote', actionType: 'navigate' },
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
      `Our End of Tenancy cleaning package is designed to meet the strict inventory checkout standards of UK estate agents and letting authorities. We offer a 72-Hour Free Re-Clean Guarantee: if your landlord, estate agent or inventory clerk notes any cleaning omission on the official inventory report within 72 hours of completion, we will return and rectify the specified item completely free of charge.`,
    actions: [
      { label: 'Get End of Tenancy Quote', route: 'quote', actionType: 'navigate' },
      { label: 'Explore Services', route: 'services', actionType: 'navigate' },
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
      `We cover Paisley, Renfrew, Johnstone, Hillington, Erskine, Linwood, Barrhead, Glasgow City Centre, West End, and the wider Greater Glasgow & Renfrewshire region. Our headquarters are located in Paisley, Scotland (PA3 2PJ).`,
    actions: [
      { label: 'Calculate Postcode Quote', route: 'quote', actionType: 'navigate' },
      { label: 'Contact Paisley Team', route: 'contact', actionType: 'navigate' },
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
      `You can book or get a quote in three easy ways:\n1. Use the interactive Online Quote Calculator on our website\n2. Click 'Get in Touch' and submit an enquiry via our contact form\n3. Call our Paisley team on +44 75 1091 1940 or +44 75 2244 1379`,
    actions: [
      { label: 'Open Quote Calculator', route: 'quote', actionType: 'navigate' },
      { label: 'Submit Contact Form', route: 'contact', actionType: 'navigate' },
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
      `Because our cleaning specialists operate inside private domestic residences, care facilities and community environments, we enforce an uncompromised safeguarding protocol:\n• Enhanced Disclosure Scotland / DBS Vetting on all specialists\n• Strict Client Boundaries: Staff are prohibited from handling client finances, accepting gifts, administering medication, or giving personal care\n• Confidentiality & Discretion: Protected by binding confidentiality agreements\n• Standardized escalation reporting to our Designated Safeguarding Lead.`,
    actions: [
      { label: 'Read Governance Policy', route: 'governance', actionType: 'navigate' },
      { label: 'Contact Team', route: 'contact', actionType: 'navigate' },
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
      `OANK Cleaning CIC complies fully with the Health and Safety at Work etc. Act 1974 and the Control of Substances Hazardous to Health (COSHH) Regulations 2002.\n\nOur Colour-Coded Hygiene System prevents cross-contamination:\n• 🔴 Red Code – Toilets & Washroom Urinals\n• 🟡 Yellow Code – Sinks & Bathroom Tiles\n• 🔵 Blue Code – General Living Areas & Desks\n• 🟢 Green Code – Kitchens & Food Prep Hubs`,
    actions: [
      { label: 'Our Standards & Services', route: 'services', actionType: 'navigate' },
      { label: 'View Governance', route: 'governance', actionType: 'navigate' },
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
      `In accordance with the UK Data Protection Act 2018 and UK GDPR:\n• We only collect personal data necessary to quote, deliver cleaning services, verify safety, or process community referrals.\n• Data is stored in secure, encrypted relational databases and is never sold to commercial marketing brokers.\n• You have the right to request access, rectification, or erasure of your personal records at any time by emailing info@oankcleaning.co.uk.`,
    actions: [
      { label: 'Contact Data Officer', route: 'contact', actionType: 'navigate' },
      { label: 'Governance & Privacy', route: 'governance', actionType: 'navigate' },
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
      `You can reach our Paisley team through:\n• Primary Telephone: +44 75 1091 1940\n• Secondary Telephone: +44 75 2244 1379\n• Email: info@oankcleaning.co.uk\n• Headquarters: Paisley, Scotland (PA3 2PJ)\n• Website: www.oankcleaning.co.uk`,
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
      `OANK Cleaning CIC is a fully independent Community Interest Company (CIC) standing on its own and funded entirely by its own commercial trading revenue (Headquarters: Paisley, Scotland, PA3 2PJ; website: www.oankcleaning.co.uk). We operate under a dedicated CIC board and statutory asset lock, reinvesting trading surpluses into community Home Resets and Employment Pathways across Scotland.`,
    actions: [
      { label: 'About OANK', route: 'about', actionType: 'navigate' },
      { label: 'Governance & Asset Lock', route: 'governance', actionType: 'navigate' },
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

  // Greetings check
  if (
    query === 'hi' ||
    query === 'hello' ||
    query === 'hey' ||
    query === 'good morning' ||
    query === 'good afternoon' ||
    query === 'good evening' ||
    query === 'help'
  ) {
    return {
      text: `Hello! I am Clara, your virtual front-desk receptionist at OANK Cleaning CIC (Paisley PA3 2PJ). I'm here to assist you with questions regarding our cleaning services, instant quotes, deposit back guarantees, or our community Home Reset & Employment Pathway programmes. How may I assist you today?`,
      suggestedActions: [
        { label: 'Instant Quote', route: 'quote', actionType: 'navigate' },
        { label: 'Home Reset Pilot', route: 'community', actionType: 'navigate' },
        { label: 'Contact Us', route: 'contact', actionType: 'navigate' },
      ],
    };
  }

  // Score each knowledge topic
  let bestTopic: KnowledgeTopic | null = null;
  let highestScore = 0;

  for (const topic of KNOWLEDGE_TOPICS) {
    let score = 0;

    // Pattern regex match
    for (const pattern of topic.patterns) {
      if (pattern.test(query)) {
        score += 8;
      }
    }

    // Keyword match
    for (const keyword of topic.keywords) {
      if (query.includes(keyword.toLowerCase())) {
        score += keyword.includes(' ') ? 4 : 2;
      }
    }

    if (score > highestScore) {
      highestScore = score;
      bestTopic = topic;
    }
  }

  // If score exceeds relevance threshold, return grounded answer from operation.md
  if (bestTopic && highestScore >= 2) {
    return {
      text: bestTopic.answer,
      suggestedActions: bestTopic.actions,
    };
  }

  // Strictly return the exact fallback specified in operation.md
  return {
    text: EXACT_FALLBACK_MESSAGE,
    suggestedActions: [
      { label: 'Go to Contact Page', route: 'contact', actionType: 'navigate' },
      { label: 'Call +44 75 1091 1940', phone: '+447510911940', actionType: 'call' },
    ],
  };
}
