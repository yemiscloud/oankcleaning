import React from 'react';
import { PageRoute } from '../types';

interface GovernancePageProps {
  onNavigate: (route: PageRoute) => void;
}

/**
 * Public-facing overview of OANK's community purpose and customer information.
 * Detailed compliance, vetting and service guarantees are intentionally not
 * stated here unless OANK has verified and approved the supporting evidence.
 */
export const GovernancePage: React.FC<GovernancePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      <section className="bg-[#0F382C] text-white py-14 px-4 sm:px-8 rounded-b-3xl border-b-4 border-[#D4AF37] shadow-xl">
        <div className="max-w-4xl mx-auto space-y-4 text-center">
          <p className="text-amber-300 text-xs font-bold uppercase tracking-wider">OANK Cleaning CIC</p>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">Our Community Purpose & Service Approach</h1>
          <p className="text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
            OANK Cleaning CIC provides cleaning services and delivers community programmes that support people and create employment opportunities.
          </p>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-8 grid gap-6 md:grid-cols-2">
        <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <h2 className="text-xl font-serif font-bold text-[#0F382C]">Home Reset</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Home Reset provides free or subsidised cleaning support for people facing difficult circumstances. The level of support depends on individual needs and circumstances.
          </p>
          <button onClick={() => onNavigate('community')} className="text-sm font-semibold text-[#0F382C] underline underline-offset-4">Learn about our community work</button>
        </article>
        <article className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
          <h2 className="text-xl font-serif font-bold text-[#0F382C]">Employment Pathway</h2>
          <p className="text-sm text-slate-700 leading-relaxed">
            Our Employment Pathway supports employment and job training opportunities connected with OANK's cleaning work. Contact us to ask about current opportunities.
          </p>
          <button onClick={() => onNavigate('contact')} className="text-sm font-semibold text-[#0F382C] underline underline-offset-4">Ask about opportunities</button>
        </article>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-8 bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
        <h2 className="text-xl font-serif font-bold text-[#0F382C]">Customer information and bookings</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          When you contact OANK or request a quotation, we use the information you provide to respond to your enquiry and manage any resulting booking. Please read our Privacy Policy for information about how personal data is handled.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <button onClick={() => onNavigate('privacy')} className="font-semibold text-[#0F382C] underline underline-offset-4">Read our Privacy Policy</button>
          <button onClick={() => onNavigate('contact')} className="font-semibold text-[#0F382C] underline underline-offset-4">Contact OANK</button>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-8 rounded-2xl bg-emerald-50 border border-emerald-100 p-6 space-y-2">
        <h2 className="text-lg font-serif font-bold text-[#0F382C]">Questions about a particular service?</h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          Service requirements, products, access arrangements and any site-specific procedures should be discussed with OANK before a booking is confirmed. We will explain the arrangements relevant to the work requested.
        </p>
        <button onClick={() => onNavigate('contact')} className="mt-2 bg-[#0F382C] text-white rounded-xl px-5 py-3 text-sm font-semibold hover:bg-[#1B4332]">Speak to our team</button>
      </section>
    </div>
  );
};
