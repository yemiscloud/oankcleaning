import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Twitter, 
  ArrowUpRight,
  HeartHandshake,
  Scale
} from 'lucide-react';
import { Logo } from './Logo';
import { PageRoute } from '../types';
import { CLEANING_SERVICES } from '../data/cleaningData';

interface FooterProps {
  onNavigate: (route: PageRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  const handleNav = (route: PageRoute) => {
    onNavigate(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#082019] text-slate-300 font-sans border-t-4 border-[#D4AF37] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        {/* Top Group & CIC Banner */}
        <div className="bg-[#0F382C] border border-[#1B4332] rounded-2xl p-6 sm:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#1B4332] flex items-center justify-center text-[#D4AF37] flex-shrink-0 border border-emerald-800">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-wider block">
                Social Enterprise & Governance
              </span>
              <h3 className="text-xl font-serif font-bold text-white">
                OANK Cleaning CIC (Community Interest Company)
              </h3>
              <p className="text-xs text-slate-300 mt-0.5 max-w-2xl">
                Combining high-standard commercial trading with our <strong>Home Reset & Employment Pathway</strong> community initiatives. Headquartered in Paisley, Scotland.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={() => handleNav('community')}
              className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-lg transition-colors whitespace-nowrap cursor-pointer shadow-md"
            >
              <span>Community (CIC)</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleNav('governance')}
              className="flex items-center gap-1.5 bg-[#1B4332] hover:bg-[#2D6A4F] text-amber-200 font-bold text-xs uppercase tracking-wider px-4 py-3 rounded-lg transition-colors whitespace-nowrap cursor-pointer border border-emerald-700"
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Policies</span>
            </button>
          </div>
        </div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900">
          {/* Column 1: Brand & Contact Info */}
          <div className="space-y-4">
            <Logo variant="dark" size="lg" />
            <p className="text-xs text-slate-300 leading-relaxed pt-2">
              Community Interest Company (CIC) providing high-end domestic, deep, commercial, and end-of-tenancy cleaning across Scotland.
            </p>

            <div className="space-y-2.5 pt-2 text-xs">
              <div className="flex items-start gap-2.5 text-slate-300">
                <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                <span>Paisley, Scotland, PA3 2PJ</span>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+447510911940" className="hover:text-amber-300 transition-colors">+44 75 1091 1940</a>
                  <a href="tel:+447522441379" className="hover:text-amber-300 transition-colors">+44 75 2244 1379</a>
                </div>
              </div>
              <div className="flex items-center gap-2.5 text-slate-300">
                <Mail className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
                <a href="mailto:info@oankcleaning.co.uk" className="hover:text-amber-300 transition-colors">info@oankcleaning.co.uk</a>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2">
              <span className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider block mb-2">
                Connect With Us
              </span>
              <div className="flex items-center gap-2">
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-[#1B4332] hover:bg-[#D4AF37] hover:text-[#0F382C] flex items-center justify-center text-slate-200 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-[#1B4332] hover:bg-[#D4AF37] hover:text-[#0F382C] flex items-center justify-center text-slate-200 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-[#1B4332] hover:bg-[#D4AF37] hover:text-[#0F382C] flex items-center justify-center text-slate-200 transition-all"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="w-8 h-8 rounded-lg bg-[#1B4332] hover:bg-[#D4AF37] hover:text-[#0F382C] flex items-center justify-center text-slate-200 transition-all"
                  aria-label="Twitter X"
                >
                  <Twitter className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Our Cleaning Services */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              Our Services
            </h4>
            <ul className="space-y-2 text-xs">
              {CLEANING_SERVICES.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => handleNav('services')}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-left text-slate-300"
                  >
                    <span className="text-[#D4AF37]">•</span>
                    <span>{s.title}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Quick Navigation & Governance */}
          <div>
            <h4 className="font-serif font-bold text-white text-base mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D4AF37]" />
              Navigation & Governance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('home')} className="hover:text-amber-300 transition-colors">Home Page</button>
              </li>
              <li>
                <button onClick={() => handleNav('community')} className="hover:text-amber-300 transition-colors font-semibold text-amber-200">Community & CIC Pilot</button>
              </li>
              <li>
                <button onClick={() => handleNav('governance')} className="hover:text-amber-300 transition-colors">Governance & Policies</button>
              </li>
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-amber-300 transition-colors">About Oank Cleaning</button>
              </li>
              <li>
                <button onClick={() => handleNav('quote')} className="hover:text-amber-300 transition-colors">Instant Quote Calculator</button>
              </li>
              <li>
                <button onClick={() => handleNav('faqs')} className="hover:text-amber-300 transition-colors">Help & FAQs</button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-amber-300 transition-colors">Get in Touch (Contact)</button>
              </li>
            </ul>
          </div>

          {/* Column 4: Guarantees & Coverage */}
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-white text-base flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              Service Guarantees
            </h4>
            
            <div className="bg-[#1B4332]/80 border border-emerald-800/80 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-amber-300 font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>100% Deposit Guarantee</span>
              </div>
              <p className="text-[11px] text-slate-300">
                End of tenancy cleans come with a 72-hour re-clean guarantee adhering to UK letting agency inventories.
              </p>
            </div>

            <div className="bg-[#1B4332]/80 border border-emerald-800/80 rounded-xl p-3.5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-300 font-semibold">
                <MapPin className="w-4 h-4 text-[#D4AF37]" />
                <span>Scotland Coverage</span>
              </div>
              <p className="text-[11px] text-slate-300">
                Paisley • Glasgow • Renfrewshire • Johnstone • Erskine • Hillington • Greater Glasgow.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Legal Links */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} <strong>OanK Cleaning CIC</strong> (oankcleaning.co.uk). All rights reserved.</p>
          
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
            <button onClick={() => handleNav('governance')} className="hover:text-amber-300 transition-colors">
              Safeguarding & COSHH
            </button>
            <span className="text-emerald-700">•</span>
            <button onClick={() => handleNav('governance')} className="hover:text-amber-300 transition-colors">
              Privacy & GDPR Notice
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
