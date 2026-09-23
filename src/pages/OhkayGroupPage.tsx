import React from 'react';
import { 
  Globe, 
  ExternalLink 
} from 'lucide-react';
import { PageRoute } from '../types';
import { OHKAY_BRANDS, IMAGE_ASSETS } from '../data/cleaningData';

interface OhkayGroupPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const OhkayGroupPage: React.FC<OhkayGroupPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-[#0F382C] text-white py-16 px-4 sm:px-8 rounded-b-3xl border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
            Brand Portfolio Overview
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">
            Ohkay Limited Brands
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto">
            A trusted Scottish group bringing together premier brands across Care, Recruitment, Care Staffing, Food Logistics, alongside the independent, self-funded OANK Cleaning CIC.
          </p>

          <div className="pt-2">
            <a
              href="https://ohkaylimited.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-amber-200 font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl border border-amber-300/40 shadow-lg transition-all"
            >
              <Globe className="w-4 h-4 text-[#D4AF37]" />
              <span>Visit Official Ohkay Limited Website (ohkaylimited.co.uk)</span>
              <ExternalLink className="w-3.5 h-3.5 text-amber-300" />
            </a>
          </div>
        </div>
      </section>

      {/* Corporate Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
            Corporate Architecture
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#0F382C]">
            Multiple Brands, One Commitment to Quality
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Ohkay Limited was founded on the principle that essential services—whether caring for seniors, placing specialized healthcare workers, catering logistics, or cleaning homes and workplaces—deserve unwavering professionalism and empathy.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            By collaborating across the Ohkay Limited family of brands, our network shares centralized compliance, DBS/PVG screening procedures, and quality assurance frameworks.
          </p>

          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 text-xs">
            <span className="font-bold text-[#0F382C] block">Ohkay Limited Group HQ</span>
            <p className="text-slate-600">Paisley, Scotland, PA3 2PJ • Tel: +44 75 1091 1940 | +44 75 2244 1379</p>

            <a
              href="https://ohkaylimited.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#0F382C] hover:text-[#1B4332] font-bold text-xs underline"
            >
              <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>https://ohkaylimited.co.uk</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]">
            <img
              src={IMAGE_ASSETS.group}
              alt="Ohkay Limited Group Overview"
              referrerPolicy="no-referrer"
              className="w-full h-[380px] object-cover"
            />
            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-amber-200 flex items-center gap-3">
              <img src={IMAGE_ASSETS.ohk3d} alt="Ohkay Limited 3D Emblem" className="w-12 h-12 object-contain" />
              <div>
                <span className="font-serif font-bold text-xs text-[#0F382C] block">Ohkay Limited</span>
                <span className="text-[10px] text-amber-800 font-semibold uppercase">Official Crest</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-[#0F382C]/90 text-white p-3 rounded-xl border border-emerald-700/80 text-xs flex items-center gap-2">
              <img src={IMAGE_ASSETS.ohk1} alt="Ohkay Quality Badge" className="w-8 h-8 rounded-full border border-[#D4AF37]" />
              <div>
                <span className="font-bold text-amber-300 block">Paisley HQ Operations</span>
                <span className="text-slate-200 text-[10px]">Serving Scotland & PA3 2PJ</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Showcase Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-3xl font-serif font-bold text-[#0F382C]">
            The Ohkay Limited Brand Portfolio
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {OHKAY_BRANDS.map((brand, i) => (
            <div key={i} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-amber-700 font-bold text-xs uppercase tracking-wider">
                    BRAND 0{i + 1}
                  </span>
                  {brand.name.includes('OANK Cleaning') && (
                    <span className="bg-[#0F382C] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                      Current Site
                    </span>
                  )}
                </div>

                <h3 className="text-2xl font-serif font-bold text-[#0F382C]">{brand.name}</h3>
                <p className="text-xs font-semibold text-emerald-800">{brand.tagline}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{brand.description}</p>
              </div>

              {brand.name.includes('OANK Cleaning') ? (
                <button
                  onClick={() => onNavigate('home')}
                  className="mt-4 w-full bg-[#0F382C] text-white font-bold text-xs uppercase py-3 rounded-xl cursor-pointer"
                >
                  Explore OANK Cleaning Services
                </button>
              ) : (
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Inquiries via Ohkay Limited HQ</span>
                  <a href="tel:+447510911940" className="text-[#0F382C] font-bold hover:underline">+44 75 1091 1940</a>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
