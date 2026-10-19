import React from 'react';
import { 
  HeartHandshake, 
  Home, 
  Briefcase, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { PageRoute } from '../types';

interface CommunityPageProps {
  onNavigate: (route: PageRoute) => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="bg-[#0F382C] text-white py-14 px-4 sm:px-8 rounded-b-3xl border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto space-y-3 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1B4332] px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 border border-emerald-600/60 shadow-sm">
            <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
            <span>Community Interest Company • Paisley, Scotland</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">
            Our Community Work & Heart
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-3xl mx-auto leading-relaxed">
            We are a social business in Paisley. We do honest, high-quality cleaning for homes and workplaces. Any extra profit we make goes directly to helping local families with free home cleaning and paid job training!
          </p>
        </div>
      </section>

      {/* Social Enterprise Model Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-5">
          <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
            How We Help Paisley
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#0F382C]">
            Doing Great Cleaning to Help Local Families
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            OANK Cleaning CIC is not like ordinary companies. We run as a social enterprise with three simple steps:
          </p>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-[#0F382C] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0F382C] block">1. Honest Cleaning Work</strong>
                <span className="text-slate-600">We clean homes and businesses, which brings in honest money to support our community.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-100">
              <CheckCircle2 className="w-4 h-4 text-amber-800 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 block">2. Free Home Cleans (Home Reset)</strong>
                <span className="text-slate-600">We send kind cleaners to help people who have a hard time keeping their house tidy due to illness or age.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-slate-100 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">3. Paid Job Training (Employment Pathway)</strong>
                <span className="text-slate-600">We teach local people cleaning and safety skills and give them real, paid jobs with friendly team leaders.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-[#0F382C] text-white p-8 sm:p-10 rounded-3xl border-4 border-[#D4AF37] shadow-2xl space-y-6">
          <div className="border-b border-emerald-800 pb-4">
            <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
              Our Community Promise
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">
              All Profits Stay in the Community
            </h3>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            By UK law, our money is permanently locked for the community. We cannot give profits to private owners. Everything extra we earn is put back into helping Scottish families have clean homes and good jobs.
          </p>

          <div className="space-y-2 text-xs">
            <span className="text-amber-300 font-bold block uppercase tracking-wider">
              We Keep Careful Records of Our Work:
            </span>
            <ul className="grid grid-cols-2 gap-2 text-slate-300">
              <li className="flex items-center gap-1.5">
                <span className="text-[#D4AF37]">•</span> Families helped
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#D4AF37]">•</span> Rooms cleaned
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#D4AF37]">•</span> Hours of support
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#D4AF37]">•</span> Workers trained
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Planned Community Projects */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
            Our Two Big Programs
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#0F382C]">
            Home Reset & Job Training in Paisley
          </h2>
          <p className="text-xs text-slate-600">
            Here is how our two community programs help people live happier, healthier lives.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Element 1: Home Reset */}
          <div className="bg-white p-8 rounded-3xl border-2 border-emerald-200 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#0F382C] flex items-center justify-center flex-shrink-0">
                  <Home className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
                    Program 1
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#0F382C]">
                    OANK Home Reset
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Free home cleaning for people who find it hard to clean their house due to illness, old age, or tough times.
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                Sometimes people have a flat, but sickness or stress makes it very hard to vacuum, mop, or clean dishes. We step in with friendly helpers to clean up and make the home feel peaceful and comfortable again.
              </div>

              <div className="space-y-2">
                <span className="font-bold text-xs text-[#0F382C] block">What we do:</span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>We clean agreed rooms, wash sinks, and mop floors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>We help people feel proud and relaxed in their home again</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <span className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  What we do NOT do:
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  We are only cleaners. We do <strong>not</strong> give medicines, nurse patients, or help with bathing.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-600">
              <strong>How to join:</strong> Housing officers, doctors, and community groups can refer people to our team.
            </div>
          </div>

          {/* Element 2: Employment Pathway */}
          <div className="bg-white p-8 rounded-3xl border-2 border-emerald-200 shadow-xl space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
                    Program 2
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#0F382C]">
                    OANK Employment Pathway
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Real paid jobs and friendly job training for local people who want to work.
              </p>

              <div className="space-y-2">
                <span className="font-bold text-xs text-[#0F382C] block">What workers learn:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F382C]" />
                    <span>Safe cleaning methods</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F382C]" />
                    <span>Safe use of soaps and mops</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F382C]" />
                    <span>Health and safety rules</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F382C]" />
                    <span>Polite customer care</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F382C]" />
                    <span>Client privacy and respect</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F382C]" />
                    <span>Keeping everyone safe</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-slate-700 leading-relaxed">
                Workers get <strong>paid cleaning work with supportive team leaders</strong>. They build real skills that open doors to permanent, full-time jobs!
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-600">
              <strong>Our Goal:</strong> Giving local workers confidence, money in their pocket, and a brighter future.
            </div>
          </div>
        </div>
      </section>

      {/* Referrals & Partner Enquiries CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#0F382C] text-white rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl border-4 border-[#D4AF37]">
          <div className="space-y-3 text-center lg:text-left">
            <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
              Work With Us
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold">
              Want to Partner With OANK Cleaning?
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Are you a housing officer, doctor, community leader, or support team? We would love to talk about helping more local families.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 flex-shrink-0">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              Send Us a Message
            </button>
            <button
              onClick={() => onNavigate('governance')}
              className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl border border-emerald-600 transition-colors cursor-pointer"
            >
              Read Our Promises
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
