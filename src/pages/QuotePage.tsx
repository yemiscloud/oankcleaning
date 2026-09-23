import React from 'react';
import { QuoteCalculator } from '../components/QuoteCalculator';
import { PageRoute } from '../types';

interface QuotePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const QuotePage: React.FC<QuotePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header */}
      <section className="bg-[#0F382C] text-white py-16 px-4 sm:px-8 rounded-b-3xl border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
            Instant Online Price Calculation
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">
            Get an Instant Cleaning Estimate
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto">
            Calculate your estimated price in seconds. No hidden fees. Submit your enquiry directly to our Paisley office.
          </p>
        </div>
      </section>

      {/* Embedded Quote Calculator Component */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8">
        <QuoteCalculator />
      </section>
    </div>
  );
};
