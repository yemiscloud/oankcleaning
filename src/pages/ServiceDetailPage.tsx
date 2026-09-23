import React from 'react';
import { 
  Clock, 
  ShieldCheck, 
  ArrowLeft, 
  CalendarCheck
} from 'lucide-react';
import { PageRoute, CleaningService } from '../types';

interface ServiceDetailPageProps {
  service: CleaningService;
  onNavigate: (route: PageRoute) => void;
}

export const ServiceDetailPage: React.FC<ServiceDetailPageProps> = ({ service, onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Breadcrumb & Navigation Back */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        <button
          onClick={() => onNavigate('services')}
          className="flex items-center gap-2 text-xs font-bold text-[#0F382C] hover:underline cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#D4AF37]" />
          <span>Back to All Services</span>
        </button>
      </div>

      {/* Hero Service Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#0F382C] text-white rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 lg:grid-cols-12 border-4 border-[#D4AF37]">
          <div className="lg:col-span-7 p-8 sm:p-12 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
                {service.category.toUpperCase()} CLEANING SPECIFICATION
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white">
                {service.title}
              </h1>
              <p className="text-sm text-emerald-100 font-medium italic">
                "{service.tagline}"
              </p>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {service.fullDesc}
              </p>
            </div>

            <div className="pt-4 border-t border-emerald-800/80 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-amber-300 uppercase font-bold block">Starting Investment</span>
                <span className="text-2xl font-serif font-bold text-white">{service.priceStart}</span>
              </div>
              <div>
                <span className="text-[10px] text-emerald-200 uppercase font-bold block">Typical Duration</span>
                <span className="text-xs text-white font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  {service.estimatedTime}
                </span>
              </div>
              <button
                onClick={() => onNavigate('quote')}
                className="bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl shadow cursor-pointer flex items-center gap-2"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Get Instant Quote</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-64 lg:h-auto bg-slate-900">
            <img
              src={service.image}
              alt={service.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Detailed Checklist & Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Full Checklist */}
        <div className="lg:col-span-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
              Inclusions & Standards
            </span>
            <h2 className="text-2xl font-serif font-bold text-[#0F382C]">
              Comprehensive Cleaning Checklist
            </h2>
          </div>

          <div className="space-y-3">
            {service.checklist.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-5 h-5 rounded-full bg-[#0F382C] text-white flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  ✓
                </div>
                <span className="text-xs font-semibold text-slate-800 leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Key Features & Contact Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0F382C] text-white p-6 rounded-3xl border-2 border-[#D4AF37] space-y-4 shadow-xl">
            <h3 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              Service Guarantees
            </h3>

            <ul className="space-y-3 text-xs text-slate-200">
              {service.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-300 font-bold">•</span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4 border-t border-emerald-800 text-xs space-y-3">
              <div className="bg-[#1B4332] p-3 rounded-xl">
                <span className="font-bold text-amber-300 block mb-1">Paisley Scotland Office</span>
                <p className="text-[11px] text-slate-300">Call our local team for fast scheduling or enquiries.</p>
                <a href="tel:+447510911940" className="text-white font-bold block mt-1 hover:underline">+44 75 1091 1940</a>
              </div>

              <button
                onClick={() => onNavigate('contact')}
                className="w-full bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-colors cursor-pointer"
              >
                Get in Touch
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
