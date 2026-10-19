import React, { useState, useMemo } from 'react';
import { 
  HeartHandshake, 
  UserCheck, 
  Leaf, 
  Lock, 
  Award, 
  Scale,
  ShieldCheck,
  CheckCircle2,
  Search,
  Printer,
  FileCheck2,
  Database,
  Building2,
  AlertTriangle
} from 'lucide-react';
import { PageRoute } from '../types';
import { SafeEmail } from '../components/SafeEmail';

interface GovernancePageProps {
  onNavigate: (route: PageRoute) => void;
}

type PolicyCategory = 'all' | 'cic' | 'safeguarding' | 'coshh' | 'data' | 'guarantee' | 'quality';

interface PolicyItem {
  id: string;
  ruleNumber: number;
  category: PolicyCategory;
  title: string;
  tagline: string;
  simpleExplanation: string;
  detailedPoints: { title: string; desc: string }[];
  statutoryStandard: string;
  icon: React.ElementType;
}

const POLICIES: PolicyItem[] = [
  {
    id: 'cic-asset-lock',
    ruleNumber: 1,
    category: 'cic',
    title: 'Community Interest Company (CIC) & Statutory Asset Lock',
    tagline: 'All our profits stay locked for the benefit of Paisley and Scottish communities.',
    icon: HeartHandshake,
    simpleExplanation:
      'We are an independent Scottish Community Interest Company (HQ: Paisley PA3 2PJ). We do not have private owners taking profits. Every extra pound we earn from cleaning goes straight to free home cleaning for local people in need and paid jobs with friendly training for local workers.',
    statutoryStandard:
      'Complies with the Companies (Audit, Investigations and Community Enterprise) Act 2004 and the Community Interest Company Regulations 2005. Annual statutory Form CIC34 submitted to the Regulator of Community Interest Companies.',
    detailedPoints: [
      {
        title: 'Permanent Asset Lock',
        desc: 'Company assets and trading revenues cannot be transferred for personal gain or distributed to private shareholders.',
      },
      {
        title: 'Reinvestment in Home Reset',
        desc: 'Commercial profits directly fund free deep cleans for individuals struggling with illness, disability, or crisis.',
      },
      {
        title: 'Employment Pathway Pilot',
        desc: 'Surpluses provide paid living-wage jobs, COSHH safety training, and progression pathways for local jobseekers.',
      },
    ],
  },
  {
    id: 'safeguarding-vetting',
    ruleNumber: 2,
    category: 'safeguarding',
    title: 'Enhanced Police Checks & Safeguarding Client Boundaries',
    tagline: '100% police-checked cleaners with strict boundaries to protect you and your home.',
    icon: UserCheck,
    simpleExplanation:
      'Because our cleaners enter your private home or workplace, we have strict rules. Every cleaner passes full criminal background checks before their first job. Cleaners can never touch your money, accept financial gifts, give medicine, or look through private rooms.',
    statutoryStandard:
      'Governed by Disclosure Scotland, Enhanced Disclosure and Barring Service (DBS), and Adult Support & Protection (Scotland) Act 2007. Active Designated Safeguarding Lead (DSL) on call.',
    detailedPoints: [
      {
        title: 'Enhanced Background Screening',
        desc: 'Every cleaner passes full police background checks via Disclosure Scotland and Enhanced DBS before working.',
      },
      {
        title: 'Anti-Financial Abuse Protection',
        desc: 'Cleaners are strictly barred from handling client cash, operating bank cards, or accepting valuable personal gifts.',
      },
      {
        title: 'Vulnerable Adult & Child Safety',
        desc: 'Staff undergo regular safeguarding training with immediate reporting to Renfrewshire Social Work for any welfare concerns.',
      },
      {
        title: 'Secure Key Holding',
        desc: 'Customer keys and access codes are stored under double-custody secure protocols with zero identifying labels.',
      },
    ],
  },
  {
    id: 'coshh-colour-coding',
    ruleNumber: 3,
    category: 'coshh',
    title: 'Health, Safety, COSHH & 4-Colour Cloth Hygiene Protocol',
    tagline: 'British Institute of Cleaning Science colour standard keeps germs isolated.',
    icon: Leaf,
    simpleExplanation:
      'We follow official UK Health and Safety rules (COSHH). To guarantee bathroom germs never cross into your kitchen, we use four strict coloured cloths and buckets that never mix.',
    statutoryStandard:
      'Complies with UK Control of Substances Hazardous to Health Regulations 2002 (COSHH), EU REACH standards, and British Institute of Cleaning Science (BICSc) colour coding.',
    detailedPoints: [
      {
        title: '🔴 Red Cloths & Buckets',
        desc: 'Exclusively for toilet bowls, urinals, sanitary bins, and washroom floors. Red cloths never leave the toilet zone.',
      },
      {
        title: '🟡 Yellow Cloths & Buckets',
        desc: 'For bathroom washbasins, tiles, mirrors, shower cubicles, and taps.',
      },
      {
        title: '🔵 Blue Cloths & Buckets',
        desc: 'For general living areas, bedrooms, hallways, office desks, and shelving.',
      },
      {
        title: '🟢 Green Cloths & Buckets',
        desc: 'Exclusively for kitchen surfaces, food prep counters, canteens, and kitchen appliances.',
      },
    ],
  },
  {
    id: 'data-dual-delivery',
    ruleNumber: 4,
    category: 'data',
    title: 'Digital Data Governance & Dual-Delivery Assurance Protocol',
    tagline: 'Strict privacy (UK GDPR) and guaranteed dual-delivery verification for all bookings.',
    icon: Database,
    simpleExplanation:
      'We never lose your booking or message. When you submit a quote or contact request, our system guarantees dual delivery: it saves your details into our secure database with a unique reference number (e.g. OANK-842915) AND instantly confirms delivery to our operations team email.',
    statutoryStandard:
      'Complies with the UK General Data Protection Regulation (UK GDPR), Data Protection Act 2018, and OANK Dual-Delivery Transaction Standard v2.4.',
    detailedPoints: [
      {
        title: 'Dual-Delivery Transmission Protocol',
        desc: 'The website only shows a success receipt when both database persistence and operations email delivery are verified.',
      },
      {
        title: 'Immutable Reference Numbers',
        desc: 'Every quote and enquiry receives a unique tracking code (OANK-XXXXXX) for end-to-end auditability.',
      },
      {
        title: 'Zero Third-Party Data Selling',
        desc: 'Personal details are never sold, rented, or shared with advertisers. Used solely for delivering cleaning services.',
      },
      {
        title: 'Right to Erasure & Portability',
        desc: 'Clients can view, update, or request permanent deletion of their contact records at any time.',
      },
    ],
  },
  {
    id: 'deposit-guarantee',
    ruleNumber: 5,
    category: 'guarantee',
    title: '100% Deposit Back Guarantee & 72-Hour Free Re-Clean',
    tagline: 'Meeting Scottish Letting Association checklists with a free re-clean safety net.',
    icon: Award,
    simpleExplanation:
      'Our move-out cleanings follow the exact inventory standards used by Scottish landlords and letting agents. If your landlord finds any missed cleaning spot within 72 hours, we will return and re-clean that item completely free of charge so your deposit is protected!',
    statutoryStandard:
      'Aligned with Scottish Letting Association tenancy checkout standards, Scottish Private Residential Tenancy (PRT) provisions, and SafeDeposits Scotland guidelines.',
    detailedPoints: [
      {
        title: 'Full Inventory Checklists',
        desc: 'Inside ovens, hobs, extractor fans, window interiors, skirting boards, kitchen cabinets, and descaling bathrooms.',
      },
      {
        title: '72-Hour Free Re-Clean Safety Net',
        desc: 'Any checkout report defect reported within 72 hours triggers an immediate priority free re-clean.',
      },
      {
        title: 'Official Invoicing for Landlords',
        desc: 'We provide itemised invoices with your tracking code as formal proof of professional cleaning.',
      },
    ],
  },
  {
    id: 'quality-complaints',
    ruleNumber: 6,
    category: 'quality',
    title: 'Quality Assurance & 3-Stage Complaints Procedure',
    tagline: 'Transparent dispute resolution and continuous service improvement.',
    icon: Scale,
    simpleExplanation:
      'If you are ever unhappy with any part of our clean, you can reach out to our Paisley team directly. We take every concern seriously and follow a simple 3-stage process to resolve issues fast.',
    statutoryStandard:
      'OANK Quality Assurance Standard ISO 9001-aligned framework with Directorate oversight.',
    detailedPoints: [
      {
        title: 'Stage 1: Direct Resolution (48 Hours)',
        desc: 'Contact our team on +44 75 1091 1940 or info@oankcleaning.co.uk. A supervisor reviews the concern within 24 hours.',
      },
      {
        title: 'Stage 2: Management Site Inspection (3 Days)',
        desc: 'If not resolved, a Senior Operations Officer conducts a site audit and provides a written remediation plan.',
      },
      {
        title: 'Stage 3: Directorate Review',
        desc: 'Unresolved issues are escalated to the Board of Directors of OANK Cleaning CIC for final determination.',
      },
    ],
  },
];

const VERIFICATION_MATRIX = [
  { area: 'Legal Status', standard: 'Community Interest Company (CIC)', authority: 'Companies House & CIC Regulator', status: 'Registered (Scotland)' },
  { area: 'Statutory Asset Lock', standard: '100% Non-Distribution Asset Lock', authority: 'Community Interest Company Regs 2005', status: 'Active & Audited' },
  { area: 'Staff Vetting', standard: 'Enhanced Criminal Record Check', authority: 'Disclosure Scotland / Enhanced DBS', status: '100% Staff Vetted' },
  { area: 'Infection Control', standard: '4-Colour Cloth Hygiene Protocol', authority: 'British Institute of Cleaning Science (BICSc)', status: 'Standard Practice' },
  { area: 'Chemical Safety', standard: 'Eco-Friendly, Non-Toxic Agents', authority: 'UK COSHH & EU REACH Regulations', status: 'MSDS Registered' },
  { area: 'Data Protection', standard: 'Encrypted storage & dual delivery', authority: 'UK GDPR & Data Protection Act 2018', status: 'Fully Compliant' },
  { area: 'Tenancy Guarantee', standard: '100% Deposit Back (72-hr Re-Clean)', authority: 'Scottish Letting Inventory Standard', status: 'Guaranteed' },
  { area: 'Headquarters', standard: 'Paisley PA3 2PJ, Renfrewshire', authority: 'Renfrewshire Local Council Jurisdiction', status: 'Active HQ' },
];

export const GovernancePage: React.FC<GovernancePageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<PolicyCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPolicyId, setExpandedPolicyId] = useState<string | null>(POLICIES[0].id);

  const filteredPolicies = useMemo(() => {
    return POLICIES.filter((p) => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.simpleExplanation.toLowerCase().includes(q) ||
        p.statutoryStandard.toLowerCase().includes(q) ||
        p.detailedPoints.some((pt) => pt.title.toLowerCase().includes(q) || pt.desc.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handlePrintCertificate = () => {
    window.print();
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner in Grade 3 English & Corporate Standard */}
      <section className="bg-[#0F382C] text-white py-14 px-4 sm:px-8 rounded-b-3xl border-b-4 border-[#D4AF37] shadow-xl">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1B4332] px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 border border-emerald-600/60 shadow-sm">
            <Scale className="w-4 h-4 text-[#D4AF37]" />
            <span>Community Interest Company • Governance, Policies & Safeguarding</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
            Our Rules, Safety & Governance Promises
          </h1>

          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
            OANK Cleaning CIC is built on absolute transparency, statutory asset locks, enhanced police checks,
            and reliable dual-delivery digital standards across Paisley and Scotland.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-xs">
            <span className="bg-emerald-950/80 border border-emerald-600/60 px-3 py-1 rounded-full text-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              Disclosure Scotland Vetted
            </span>
            <span className="bg-emerald-950/80 border border-emerald-600/60 px-3 py-1 rounded-full text-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              100% Non-Distribution Asset Lock
            </span>
            <span className="bg-emerald-950/80 border border-emerald-600/60 px-3 py-1 rounded-full text-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#D4AF37]" />
              Dual-Delivery Booking Assurance
            </span>
          </div>
        </div>
      </section>

      {/* Main Governance Content Container */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        {/* Search & Category Filter Controls */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search policies (e.g. DBS, COSHH, Dual Delivery, Deposit)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none"
              />
            </div>

            {/* Quick Action Button: Print Compliance Certificate */}
            <button
              onClick={handlePrintCertificate}
              className="w-full md:w-auto px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-200"
              title="Print official compliance summary for landlords or partner agencies"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print Compliance Certificate</span>
            </button>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-t border-slate-100 pt-3 text-xs">
            {[
              { id: 'all', label: 'All Governance Policies' },
              { id: 'cic', label: '1. CIC & Asset Lock' },
              { id: 'safeguarding', label: '2. Safeguarding & Vetting' },
              { id: 'coshh', label: '3. COSHH & 4-Colour Cloths' },
              { id: 'data', label: '4. Data & Dual-Delivery' },
              { id: 'guarantee', label: '5. 100% Deposit Guarantee' },
              { id: 'quality', label: '6. Complaints & QA' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id as PolicyCategory)}
                className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer font-medium ${
                  selectedCategory === tab.id
                    ? 'bg-[#0F382C] text-white shadow-xs font-semibold'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filtered Policy Cards */}
        <div className="space-y-6">
          {filteredPolicies.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
              <h3 className="font-serif font-bold text-slate-900 text-base">No Matching Policy Found</h3>
              <p className="text-xs text-slate-500">
                Try searching for broader keywords such as "DBS", "COSHH", "Asset Lock", or "Deposit".
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-xs text-[#0F382C] font-bold underline cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredPolicies.map((policy) => {
              const Icon = policy.icon;
              const isExpanded = expandedPolicyId === policy.id;

              return (
                <div
                  key={policy.id}
                  className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6 transition-all hover:shadow-lg"
                >
                  {/* Policy Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0F382C] flex items-center justify-center flex-shrink-0 border border-emerald-100">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
                          Rule {policy.ruleNumber}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#0F382C]">
                          {policy.title}
                        </h2>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedPolicyId(isExpanded ? null : policy.id)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200 transition-colors self-start sm:self-auto cursor-pointer"
                    >
                      {isExpanded ? 'Hide Details' : 'View Full Policy'}
                    </button>
                  </div>

                  {/* Plain Language Summary (Grade 3 English) */}
                  <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-100 space-y-1.5 text-xs">
                    <strong className="text-[#0F382C] block font-serif text-sm">
                      What This Means For You (Plain Summary):
                    </strong>
                    <p className="text-slate-700 leading-relaxed font-medium">
                      {policy.simpleExplanation}
                    </p>
                  </div>

                  {/* Expanded Detailed Breakdown & Statutory Law */}
                  {isExpanded && (
                    <div className="space-y-5 pt-2 animate-fadeIn">
                      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                        Operational Safeguards & Execution Protocols:
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {policy.detailedPoints.map((pt, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              <strong className="text-xs text-slate-900 font-semibold">{pt.title}</strong>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed pl-6">{pt.desc}</p>
                          </div>
                        ))}
                      </div>

                      {/* Statutory Legal Framework */}
                      <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-1 font-mono">
                        <span className="text-amber-300 font-bold block text-[11px] uppercase tracking-wider">
                          Statutory Authority & Compliance Legislation:
                        </span>
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          {policy.statutoryStandard}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Master Governance & Verification Matrix */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-lg space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block mb-1">
              Statutory Transparency
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#0F382C]">
              Master Governance & Verification Matrix
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Independent oversight rules governing OANK Cleaning CIC operations, contracts, and community initiatives.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold">
                  <th className="py-3 px-4">Governance Area</th>
                  <th className="py-3 px-4">Standard / Policy</th>
                  <th className="py-3 px-4">Governing Authority / Act</th>
                  <th className="py-3 px-4 text-right">Verification Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {VERIFICATION_MATRIX.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.area}</td>
                    <td className="py-3 px-4 text-slate-600">{row.standard}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{row.authority}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-full text-[10px] border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Direct Contact & Escalation Banner */}
        <div className="bg-[#0F382C] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border-4 border-[#D4AF37]">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
              Governance, Safety & Safeguarding Inquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Speak to Our Compliance Team
            </h2>
            <p className="text-xs sm:text-sm text-slate-200">
              Paisley, Scotland PA3 2PJ • Phone: +44 75 1091 1940 | +44 75 2244 1379 • Email: <SafeEmail className="hover:text-amber-300 underline" />
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow cursor-pointer whitespace-nowrap transition-all"
            >
              Contact Operations Desk
            </button>
            <button
              onClick={() => onNavigate('quote')}
              className="bg-transparent hover:bg-emerald-800 text-white border-2 border-emerald-400 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl cursor-pointer whitespace-nowrap transition-all"
            >
              Instant Quote
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
