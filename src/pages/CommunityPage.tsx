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
      <section className="bg-[#0F382C] text-white py-16 px-4 sm:px-8 rounded-b-3xl border-b-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1B4332] px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 border border-emerald-600/60 shadow-sm">
            <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
            <span>Community Interest Company (CIC) • Paisley, Scotland</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold">
            Community Activities & Social Purpose
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 max-w-3xl mx-auto leading-relaxed">
            OANK Cleaning CIC combines legitimate commercial trading activity with clear, measurable community benefit. As an independent, self-funded social enterprise standing on its own, our mission goes far beyond ordinary cleaning.
          </p>
        </div>
      </section>

      {/* Social Enterprise Model Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-6">
          <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
            Our CIC Philosophy & Mission
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#0F382C]">
            Combining Trading Excellence With Real Community Impact
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            OANK Cleaning CIC was established as a Community Interest Company because its purpose goes beyond providing ordinary commercial cleaning services. We are developing a sustainable social-enterprise model:
          </p>

          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-3 p-3.5 bg-emerald-50 rounded-xl border border-emerald-100">
              <CheckCircle2 className="w-4 h-4 text-[#0F382C] flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-[#0F382C] block">Legitimate Trading Income</strong>
                <span className="text-slate-600">High-end domestic and commercial cleaning contracts generate revenue that supports community interventions.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-100">
              <CheckCircle2 className="w-4 h-4 text-amber-800 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-900 block">Practical Household Reset</strong>
                <span className="text-slate-600">Direct, targeted household cleaning support for individuals facing practical barriers to maintaining their homes.</span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 bg-slate-100 rounded-xl border border-slate-200">
              <CheckCircle2 className="w-4 h-4 text-slate-800 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Employment & Skills Pathways</strong>
                <span className="text-slate-600">Providing training, safeguarding education, and supervised paid work for people facing barriers to employment.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 bg-[#0F382C] text-white p-8 sm:p-10 rounded-3xl border-4 border-[#D4AF37] shadow-2xl space-y-6">
          <div className="border-b border-emerald-800 pb-4">
            <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
              Social Enterprise Framework
            </span>
            <h3 className="text-2xl font-serif font-bold text-white">
              Sustainable Community Benefits
            </h3>
          </div>

          <p className="text-xs text-slate-200 leading-relaxed">
            The intention is not simply to use funding to purchase cleaning equipment. Our longer-term aim is to develop a sustainable CIC that continues creating community benefit through trading income, partnerships, commissioned work, and suitable funding, rather than relying solely on grants.
          </p>

          <div className="space-y-2 text-xs">
            <span className="text-amber-300 font-bold block uppercase tracking-wider">
              Demonstrating Impact Through Rigorous Records:
            </span>
            <ul className="grid grid-cols-2 gap-2 text-slate-300">
              <li className="flex items-center gap-1.5">
                <span className="text-[#D4AF37]">•</span> Referrals logged
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#D4AF37]">•</span> Services delivered
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#D4AF37]">•</span> Hours of support
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-[#D4AF37]">•</span> Training & outcomes
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Planned Community Project: The Two Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block">
            Featured Pilot Initiative
          </span>
          <h2 className="text-3xl font-serif font-bold text-[#0F382C]">
            OANK Home Reset & Employment Pathway Pilot
          </h2>
          <p className="text-xs text-slate-600">
            Our planned community project addresses two critical challenges in our local Scottish communities through structured, dignified interventions.
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
                    Community Project: Element 1
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#0F382C]">
                    OANK Home Reset
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                OANK intends to provide targeted household-cleaning support to people who experience genuine practical barriers to maintaining their homes.
              </p>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                A person may have accommodation and receive support towards housing costs, but this does not necessarily mean they have the practical ability, resources, mobility, confidence, or support required to keep their living environment clean, hygienic, and manageable.
              </div>

              <div className="space-y-2">
                <span className="font-bold text-xs text-[#0F382C] block">What the service does:</span>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Focuses on agreed household-cleaning tasks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>Supports personal dignity, wellbeing, and ability to maintain a suitable living environment</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                <span className="font-bold text-xs text-amber-900 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  What the service does NOT do (Explicit Boundary):
                </span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  It will <strong>not</strong> provide medical treatment, nursing, personal care, or regulated social-care services.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-600">
              <strong>How people access the service:</strong> Access is normally via appropriate referral or assessment. OANK assesses eligibility, safety, and suitability before accepting a case.
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
                    Community Project: Element 2
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-[#0F382C]">
                    OANK Employment Pathway
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Creating opportunities for individuals who face barriers to employment through structured recruitment, comprehensive training, and supervised paid work.
              </p>

              <div className="space-y-2">
                <span className="font-bold text-xs text-[#0F382C] block">Training and development covers:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F382C]" />
                    <span>Safe cleaning practices</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F382C]" />
                    <span>Cleaning equipment & products</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F382C]" />
                    <span>Workplace health & safety (COSHH)</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F382C]" />
                    <span>Professional conduct</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F382C]" />
                    <span>Communication & client boundaries</span>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#0F382C]" />
                    <span>Confidentiality & Safeguarding</span>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-xs text-slate-700 leading-relaxed">
                Workers receive <strong>supervised paid work and constructive feedback</strong>. Progression is measured through competencies, additional work opportunities, further training, or other appropriate employment pathways.
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs text-slate-600">
              <strong>Sustainability Goal:</strong> Building confidence and transferable workplace qualifications to foster long-term employment independence.
            </div>
          </div>
        </div>
      </section>

      {/* Referrals & Partner Enquiries CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#0F382C] text-white rounded-3xl p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-2xl border-4 border-[#D4AF37]">
          <div className="space-y-3 text-center lg:text-left">
            <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
              Partner & Referral Collaboration
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold">
              Connect With the OANK CIC Community Team
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-xl">
              Are you a housing officer, local authority, community group, or social enterprise interested in partnering on the Home Reset or Employment Pathway pilot?
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 flex-shrink-0">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              Submit Community Enquiry
            </button>
            <button
              onClick={() => onNavigate('governance')}
              className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs uppercase tracking-wider px-6 py-4 rounded-xl border border-emerald-600 transition-colors cursor-pointer"
            >
              View CIC Governance & Policies
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
