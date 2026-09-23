import React from 'react';
import { 
  Phone, 
  MapPin, 
  Mail, 
  Clock, 
  Building2, 
  MessageSquare,
  HeartHandshake
} from 'lucide-react';
import { ContactForm } from '../components/ContactForm';
import { PageRoute } from '../types';
import { COMPANY_WHATSAPP_LINK } from '../data/cleaningData';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#0F382C] text-white py-16 px-4 sm:px-8 rounded-b-3xl border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1B4332] px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 border border-emerald-600/60 shadow-sm">
            <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
            <span>Community Interest Company • Paisley HQ</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">
            Get in Touch With OANK Cleaning CIC
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto">
            We are here to help with your domestic, commercial, specialist cleaning, and community referral enquiries across Scotland.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Contact Cards & Info */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0F382C] text-white p-8 rounded-3xl border-4 border-[#D4AF37] shadow-xl space-y-6">
            <div className="border-b border-emerald-800 pb-4">
              <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
                Paisley HQ Contact
              </span>
              <h2 className="text-2xl font-serif font-bold text-white">
                OANK Cleaning CIC
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white text-sm">Head Office Location:</strong>
                  <span className="text-slate-200 text-xs">Paisley, Scotland, PA3 2PJ</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white text-sm">Phone Lines:</strong>
                  <a href="tel:+447510911940" className="hover:text-amber-300 font-bold block text-xs mt-0.5">+44 75 1091 1940</a>
                  <a href="tel:+447522441379" className="hover:text-amber-300 font-bold block text-xs">+44 75 2244 1379</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white text-sm">Email Address:</strong>
                  <a href="mailto:info@oankcleaning.co.uk" className="hover:text-amber-300 block text-xs mt-0.5">info@oankcleaning.co.uk</a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white text-sm">Operating Hours:</strong>
                  <span className="text-slate-200 block text-xs mt-0.5">Monday - Saturday: 07:00 - 20:00</span>
                  <span className="text-emerald-300 block text-[11px]">24/7 Out-of-hours commercial response available</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Action */}
            <div className="pt-4 border-t border-emerald-800">
              <a
                href={COMPANY_WHATSAPP_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-amber-200 font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl shadow transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Need urgent help? Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Regional Service Map Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-[#0F382C] font-bold text-sm">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Coverage Areas Across Scotland</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We provide rapid cleaning dispatch across <strong>Paisley (PA1 - PA3)</strong>, Johnstone, Renfrew, Hillington, Erskine, Linwood, Barrhead, Glasgow City Centre, and West End.
            </p>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="lg:col-span-7">
          <ContactForm />
        </div>
      </section>
    </div>
  );
};
