import React from 'react';
import { 
  ShieldCheck, 
  Leaf,
  HeartHandshake,
  ArrowRight
} from 'lucide-react';
import { PageRoute } from '../types';
import { IMAGE_ASSETS } from '../data/cleaningData';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner in Grade 3 English */}
      <section className="bg-[#0F382C] text-white py-14 px-4 sm:px-8 rounded-b-3xl border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto space-y-3 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1B4332] px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 border border-emerald-600/60 shadow-sm">
            <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
            <span>Friendly Community Interest Company • Paisley & Scotland</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">
            About OANK Cleaning
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-2xl mx-auto leading-relaxed">
            We do great cleaning for homes and workplaces across Paisley and Glasgow. All extra profits fund free home cleans for people in need, and provide friendly job training for local workers.
          </p>
        </div>
      </section>

      {/* Heritage & Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-5">
          <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
            Our Story
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#0F382C]">
            Proudly Started in Paisley, Scotland
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            OANK Cleaning started with a simple, caring dream: provide top-notch cleaning while helping local people in our community.
          </p>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            We are an independent Community Interest Company. That means all our extra profits are locked by law to help local people, not private shareholders. We use that money for free home resets and paid job training!
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-1">
              <span className="font-serif font-bold text-2xl text-[#0F382C]">PA3 2PJ</span>
              <span className="text-xs font-semibold text-slate-600 block">Paisley Office Address</span>
            </div>
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 space-y-1">
              <span className="font-serif font-bold text-2xl text-amber-800">100%</span>
              <span className="text-xs font-semibold text-slate-600 block">Police-Checked Staff</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-[#D4AF37]">
            <img
              src={IMAGE_ASSETS.group}
              alt="OANK Cleaning in Paisley"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-[380px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#082019] via-transparent to-transparent flex items-end p-6">
              <div className="bg-[#0F382C]/90 text-white p-4 rounded-2xl border border-emerald-700/80 w-full text-xs">
                <span className="font-bold text-amber-300 block">Community Help & Good Jobs</span>
                <p className="text-slate-200">Extra profits go right back to free home cleaning and paid worker training across Scotland.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Staff Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center bg-emerald-900/5 p-8 sm:p-12 rounded-3xl border border-emerald-100">
        <div className="lg:col-span-6 order-2 lg:order-1">
          <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-emerald-800/30">
            <img
              src={IMAGE_ASSETS.aboutTeam}
              alt="Our friendly cleaning team"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              className="w-full h-[340px] object-cover"
            />
            <div className="absolute top-4 right-4 w-16 h-16 rounded-full border-2 border-[#D4AF37] shadow-lg bg-[#0F382C] flex flex-col items-center justify-center text-center p-1 text-white">
              <ShieldCheck className="w-5 h-5 text-[#D4AF37]" />
              <span className="text-[9px] font-bold text-amber-200 uppercase tracking-tighter">Vetted</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
          <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
            Our Cleaners
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#0F382C]">
            Friendly, Police-Checked Cleaners
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Every cleaner on our team has a full police check and is insured. We teach each team member how to use safe cleaning soaps, clean mops, and treat your home with gentle care and respect.
          </p>
          <div className="flex items-center gap-3 pt-2">
            <div className="w-10 h-10 rounded-full bg-[#0F382C] text-[#D4AF37] flex items-center justify-center font-bold text-sm">
              100%
            </div>
            <p className="text-xs text-slate-700 font-semibold">
              Background checked, uniformed, and friendly for complete peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block mb-1">
              What We Believe In
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#0F382C]">
              Trust, Community, and Clean Homes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0F382C] text-[#D4AF37] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#0F382C]">1. Police Checks on All Staff</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every cleaner passes full police checks (Enhanced DBS and Disclosure Scotland) before ever visiting your home or office.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0F382C] text-[#D4AF37] flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#0F382C]">2. Helping Our Community</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extra profits fund our free Home Reset program for people who need extra help, and provide paid jobs for local workers.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-md space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#0F382C] text-[#D4AF37] flex items-center justify-center">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-xl text-[#0F382C]">3. Safe, Eco Soaps</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We use safe, eco-friendly cleaning soaps that are gentle for children, pets, and the air you breathe.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 text-center space-y-6">
        <h2 className="text-3xl font-serif font-bold text-[#0F382C]">
          Want to Learn More or Book a Clean?
        </h2>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => onNavigate('community')}
            className="bg-[#0F382C] hover:bg-[#1B4332] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow cursor-pointer flex items-center gap-1.5"
          >
            <span>See Community Projects</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
          <button
            onClick={() => onNavigate('contact')}
            className="bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow cursor-pointer"
          >
            Send Us a Message
          </button>
        </div>
      </section>
    </div>
  );
};
