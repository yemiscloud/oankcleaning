import React, { useState } from 'react';
import { ArrowRight, Camera } from 'lucide-react';
import { PageRoute, CleaningService } from '../types';
import { CLEANING_SERVICES, IMAGE_ASSETS } from '../data/cleaningData';
import { ServiceCard } from '../components/ServiceCard';

interface ServicesPageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectService: (service: CleaningService) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onNavigate, onSelectService }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'domestic' | 'commercial' | 'specialist'>('all');

  const filteredServices = CLEANING_SERVICES.filter((s) => {
    if (activeCategory === 'all') return true;
    return s.category === activeCategory;
  });

  return (
    <div className="space-y-12 pb-16">
      {/* Page Header */}
      <section className="bg-[#0F382C] text-white py-16 px-4 sm:px-8 rounded-b-3xl border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
            Paisley & Scotland Services Catalog
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">
            Cleaning Services Offered by OANK Cleaning CIC
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto">
            From meticulous domestic housekeeping to 100% deposit-backed end of tenancy cleans and CQC clinical sanitisation. Fully insured with DBS checked personnel.
          </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-100 p-2 rounded-2xl border border-slate-200">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'domestic', label: 'Domestic Housekeeping' },
            { id: 'commercial', label: 'Commercial & Office' },
            { id: 'specialist', label: 'End of Tenancy & Specialist' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as any)}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-[#0F382C] text-white shadow'
                  : 'text-slate-700 hover:text-[#0F382C] hover:bg-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onSelect={onSelectService}
            onQuickQuote={() => onNavigate('quote')}
          />
        ))}
      </section>

      {/* Cleaning Excellence In Action Gallery */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block mb-1 flex items-center justify-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-[#D4AF37]" />
            Real Service Results
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F382C]">
            OANK Cleaning In Action Across Scotland
          </h2>
          <p className="text-xs text-slate-600">
            A glimpse into our professional cleaning deployments across residential flats, corporate offices, and end-of-tenancy inspections.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-video sm:aspect-square">
            <img src={IMAGE_ASSETS.domestic} alt="Domestic Cleaning Pro" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex items-end">
              <div>
                <span className="text-amber-300 text-[10px] font-bold uppercase block">Domestic Clean</span>
                <p className="text-white text-xs font-semibold">Vetted Housekeeping Professionals</p>
              </div>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-video sm:aspect-square">
            <img src={IMAGE_ASSETS.commercial} alt="Commercial Office Clean" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex items-end">
              <div>
                <span className="text-amber-300 text-[10px] font-bold uppercase block">Commercial Hub</span>
                <p className="text-white text-xs font-semibold">Corporate Office & Facility Hygiene</p>
              </div>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-video sm:aspect-square">
            <img src={IMAGE_ASSETS.tenancy} alt="End of Tenancy Guarantee Clean" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex items-end">
              <div>
                <span className="text-amber-300 text-[10px] font-bold uppercase block">End of Tenancy</span>
                <p className="text-white text-xs font-semibold">100% Deposit Release Guarantee</p>
              </div>
            </div>
          </div>

          <div className="group relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-video sm:aspect-square">
            <img src={IMAGE_ASSETS.heroSecondary} alt="Sparkling Clean Luxury Home" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 flex items-end">
              <div>
                <span className="text-amber-300 text-[10px] font-bold uppercase block">Deep & Spring Clean</span>
                <p className="text-white text-xs font-semibold">Intensive Property Restoration</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-[#0F382C] font-bold text-xs uppercase tracking-wider block">
              100% Satisfaction Guarantee
            </span>
            <h3 className="text-2xl font-serif font-bold text-[#0F382C]">
              Need a Custom Cleaning Package for Paisley or Glasgow?
            </h3>
            <p className="text-xs text-slate-600">
              We tailor custom cleaning frequencies, team sizes, and shift times for residential properties, care facilities, and office hubs.
            </p>
          </div>

          <button
            onClick={() => onNavigate('quote')}
            className="flex-shrink-0 bg-[#0F382C] hover:bg-[#1B4332] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow cursor-pointer flex items-center gap-2"
          >
            <span>Configure Custom Quote</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>
      </section>
    </div>
  );
};
