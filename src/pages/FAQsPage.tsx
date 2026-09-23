import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Search, Phone } from 'lucide-react';
import { PageRoute } from '../types';
import { FAQS } from '../data/cleaningData';

interface FAQsPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const FAQsPage: React.FC<FAQsPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = FAQS.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#0F382C] text-white py-16 px-4 sm:px-8 rounded-b-3xl border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
            Client Knowledge Base
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto">
            Everything you need to know about our domestic, deep, commercial, end-of-tenancy, and CIC community initiatives in Paisley and Scotland.
          </p>
        </div>
      </section>

      {/* Search Input */}
      <div className="max-w-3xl mx-auto px-4 sm:px-8">
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
          <input
            type="text"
            placeholder="Search questions (e.g., DBS checks, deposit guarantee, community pilot, Paisley coverage)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 text-xs sm:text-sm border border-slate-300 rounded-2xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none bg-white shadow-sm"
          />
        </div>
      </div>

      {/* Accordion FAQ list */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <p className="text-sm font-semibold text-slate-700">No matching questions found.</p>
            <p className="text-xs text-slate-500">Call our Paisley office directly for immediate answers: +44 75 1091 1940</p>
          </div>
        ) : (
          filteredFaqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 focus:outline-none cursor-pointer hover:bg-slate-50"
                >
                  <span className="font-serif font-bold text-[#0F382C] text-sm sm:text-base">
                    {faq.question}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#D4AF37] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        )}
      </section>

      {/* Direct Help Banner */}
      <section className="max-w-3xl mx-auto px-4 sm:px-8 text-center bg-emerald-50 rounded-2xl p-8 border border-emerald-200 space-y-4">
        <h3 className="text-xl font-serif font-bold text-[#0F382C]">Still Have Questions?</h3>
        <p className="text-xs text-slate-600">Our customer support team in Paisley is happy to assist you.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => onNavigate('contact')}
            className="bg-[#0F382C] text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl cursor-pointer"
          >
            Get in Touch
          </button>
          <a
            href="tel:+447510911940"
            className="bg-white text-[#0F382C] border border-[#0F382C] text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl flex items-center gap-2"
          >
            <Phone className="w-4 h-4 text-[#D4AF37]" />
            <span>+44 75 1091 1940</span>
          </a>
        </div>
      </section>
    </div>
  );
};
