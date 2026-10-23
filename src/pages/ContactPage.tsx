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
import { SafeEmail } from '../components/SafeEmail';
import { PageRoute } from '../types';
import { COMPANY_WHATSAPP_LINK } from '../data/cleaningData';

interface ContactPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const ContactPage: React.FC<ContactPageProps> = () => {
  return (
    <div className="space-y-12 pb-16">
      {/* Header Banner */}
      <section className="bg-[#0F382C] text-white py-14 px-4 sm:px-8 rounded-b-3xl border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto space-y-3 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1B4332] px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 border border-emerald-600/60 shadow-sm">
            <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
            <span>Community Interest Company • Paisley Office</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">
            Talk to OANK Cleaning
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
            We are here to help! Whether you need home cleaning, move-out cleaning, or want to ask about our community work, send us a note or call our friendly team.
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
                Paisley Office Details
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

                <div className="space-y-4 min-w-0">
                  <div>
                    <strong className="block text-white text-sm mb-1">
                      Main Office
                    </strong>
                    <address className="not-italic text-slate-200 text-xs leading-relaxed">
                      9 Inchinnan Road, Paisley, Pa3 2pj <br />
                      United Kingdom
                    </address>
                  </div>

                  <div className="pt-3 border-t border-emerald-800/70">
                    <strong className="block text-white text-sm mb-1">
                      Glasgow Office
                    </strong>
                    <address className="not-italic text-slate-200 text-xs leading-relaxed">
                      Office 1856, 3 Fitzroy Place, 1/1, Sauchiehall Street<br />
                      Finnieston, Glasgow Central<br />
                      Glasgow, G3 7RH
                    </address>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white text-sm">Phone Lines:</strong>
                  <a href="tel:+447731956727" className="hover:text-amber-300 font-bold block text-xs">+44 77 3195 6727</a>
                  <a href="tel:+442034324738" className="hover:text-amber-300 font-bold block text-xs mt-0.5">+44 20 3432 4738</a>
                 
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white text-sm">Email Address:</strong>
                  <div className="mt-0.5">
                    <SafeEmail 
                      showIcon={false}
                      className="hover:text-amber-300 block text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#1B4332] text-[#D4AF37] flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-white text-sm">When We Are Open:</strong>
                  <span className="text-slate-200 block text-xs mt-0.5">Monday to Saturday: 7:00am - 8:00pm</span>
                  <span className="text-emerald-300 block text-[11px]">Evening and weekend cleaning available</span>
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
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Regional Service Map Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-[#0F382C] font-bold text-sm">
              <Building2 className="w-4 h-4 text-[#D4AF37]" />
              <span>Where We Clean in Scotland</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              We clean in <strong>Paisley (PA1 - PA3)</strong>, Johnstone, Renfrew, Hillington, Erskine, Linwood, Barrhead, and all of Glasgow!
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
