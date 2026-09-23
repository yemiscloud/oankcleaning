import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  HeartHandshake, 
  Phone, 
  Mail, 
  Scale, 
  Leaf, 
  UserCheck, 
  Award,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { PageRoute } from '../types';

interface GovernancePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const GovernancePage: React.FC<GovernancePageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'cic' | 'safeguarding' | 'coshh' | 'privacy' | 'terms'>('all');

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="bg-[#0F382C] text-white py-16 px-4 sm:px-8 rounded-b-3xl border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1B4332] px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 border border-emerald-600/60 shadow-sm">
            <Scale className="w-4 h-4 text-[#D4AF37]" />
            <span>Official Corporate Standards & Legal Disclosures</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">
            Governance, Policies & Compliance
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto">
            OANK Cleaning CIC operates under strict Scottish and UK regulatory standards, statutory CIC requirements, enhanced safeguarding protocols, and transparent customer charters.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        {/* Document 1: Community Interest Company (CIC) & Asset Lock Statement */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0F382C] flex items-center justify-center flex-shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
                Statutory Governance Document
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0F382C]">
                1. Community Interest Company (CIC) Statement & Asset Lock
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              OANK Cleaning CIC is a registered Community Interest Company incorporated under the laws of Scotland and the United Kingdom, operating as an independent, self-funded social enterprise standing on its own (Paisley HQ: PA3 2PJ).
            </p>
            <p>
              <strong>Community Interest Purpose:</strong> OANK Cleaning CIC was established because its purpose transcends ordinary commercial profit extraction. We combine legitimate commercial cleaning trading activity with community-focused Home Reset interventions and Employment Pathway pilots.
            </p>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 space-y-2 text-xs">
              <strong className="text-[#0F382C] block">Statutory Asset Lock & Surplus Reinvestment:</strong>
              <p className="text-slate-700">
                In compliance with the Community Interest Company Regulations 2005, OANK Cleaning CIC maintains a permanent statutory Asset Lock. Company assets cannot be distributed for personal gain and must be dedicated to community purposes. Trading surpluses are reinvested into subsidised cleaning assistance for vulnerable households and structured workforce training.
              </p>
            </div>
          </div>
        </div>

        {/* Document 2: Safeguarding & Client Boundaries Policy */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
                Duty of Care Standards
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0F382C]">
                2. Safeguarding & Professional Boundaries Policy
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Because our cleaning specialists operate inside private domestic residences, care facilities, and community environments, we enforce an uncompromised safeguarding protocol:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-[#0F382C] block">Enhanced Disclosure Scotland / DBS Vetting</strong>
                <p className="text-slate-600">All personnel undergo full criminal history disclosure checks and employment verification prior to client deployment.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-[#0F382C] block">Strict Client Boundaries</strong>
                <p className="text-slate-600">Staff are forbidden from handling client financial matters, accepting gifts, administering medication, or giving personal care.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-[#0F382C] block">Confidentiality & Discretion</strong>
                <p className="text-slate-600">All client information, personal living conditions, and keyholding access codes are protected by binding confidentiality agreements.</p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <strong className="text-[#0F382C] block">Escalation & Referral Protocols</strong>
                <p className="text-slate-600">Staff are trained to identify signs of abuse or neglect and follow standardized reporting to our Designated Safeguarding Lead.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Document 3: Health, Safety & COSHH Compliance Policy */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0F382C] flex items-center justify-center flex-shrink-0">
              <Leaf className="w-6 h-6" />
            </div>
            <div>
              <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
                Health & Safety Management
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0F382C]">
                3. Health, Safety & COSHH Protocols
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              OANK Cleaning CIC complies fully with the <strong>Health and Safety at Work etc. Act 1974</strong> and the <strong>Control of Substances Hazardous to Health (COSHH) Regulations 2002</strong>.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs pt-2">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-center">
                <span className="font-bold text-rose-800 block">🔴 Red Code</span>
                <span className="text-[11px] text-rose-700">Toilets & Washroom Urinals</span>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-center">
                <span className="font-bold text-amber-800 block">🟡 Yellow Code</span>
                <span className="text-[11px] text-amber-700">Sinks & Bathroom Tiles</span>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-center">
                <span className="font-bold text-blue-800 block">🔵 Blue Code</span>
                <span className="text-[11px] text-blue-700">General Living Areas & Desks</span>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                <span className="font-bold text-emerald-800 block">🟢 Green Code</span>
                <span className="text-[11px] text-emerald-700">Kitchens & Food Prep Hubs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Document 4: Data Protection, GDPR & Privacy Notice */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center flex-shrink-0">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
                Information Governance
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0F382C]">
                4. Privacy Notice & GDPR Compliance
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              In accordance with the <strong>UK Data Protection Act 2018</strong> and <strong>UK GDPR</strong>:
            </p>
            <ul className="space-y-2 text-xs list-disc list-inside text-slate-700">
              <li>We only collect personal data necessary to quote, deliver cleaning services, verify safety, or process community referrals.</li>
              <li>Data is stored in secure, encrypted relational databases and never sold to commercial marketing brokers.</li>
              <li>You have the right to request access, rectification, or erasure of your personal records at any time by emailing <code>info@oankcleaning.co.uk</code>.</li>
            </ul>
          </div>
        </div>

        {/* Document 5: 100% Deposit Guarantee & Terms */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-lg space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-800 flex items-center justify-center flex-shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
                Customer Guarantee & Terms
              </span>
              <h2 className="text-2xl font-serif font-bold text-[#0F382C]">
                5. Service Terms & 100% Deposit Back Guarantee
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
            <p>
              Our End of Tenancy cleaning package is designed to satisfy the rigorous inventory checkout standards of UK estate agents and letting authorities.
            </p>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <strong className="text-[#0F382C] block">72-Hour Free Re-Clean Guarantee Terms:</strong>
              <p className="text-slate-700">
                If your landlord, estate agent, or inventory clerk notes any cleaning omission on the official inventory report within 72 hours of completion, OANK Cleaning CIC will return and rectify the specified item completely free of charge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Direct Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#0F382C] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border-4 border-[#D4AF37]">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
              Governance & Compliance Enquiries
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
              Questions Regarding Our Governance or Standards?
            </h2>
            <p className="text-xs sm:text-sm text-slate-200">
              Contact our compliance officers in Paisley: +44 75 1091 1940 | info@oankcleaning.co.uk
            </p>
          </div>

          <button
            onClick={() => onNavigate('contact')}
            className="bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow cursor-pointer whitespace-nowrap"
          >
            Contact Compliance Team
          </button>
        </div>
      </section>
    </div>
  );
};
