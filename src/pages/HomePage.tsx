import React from 'react';
import { 
  CheckCircle2, 
  Phone, 
  MapPin, 
  ArrowRight, 
  Star, 
  Award, 
  CalendarCheck,
  HeartHandshake,
  Home,
  Briefcase
} from 'lucide-react';
import { PageRoute, CleaningService } from '../types';
import { CLEANING_SERVICES, TESTIMONIALS, IMAGE_ASSETS } from '../data/cleaningData';
import { ServiceCard } from '../components/ServiceCard';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
  onSelectService: (service: CleaningService) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onSelectService }) => {
  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative bg-[#0F382C] text-white overflow-hidden rounded-b-[2.5rem] shadow-2xl">
        {/* Background Image Overlay with Performance Optimization */}
        <div className="absolute inset-0 z-0">
          <img
            src={IMAGE_ASSETS.hero}
            alt="OANK Clean Living Room"
            width={1920}
            height={1080}
            loading="eager"
            fetchPriority="high"
            decoding="async"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 filter brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#082019] via-[#0F382C]/90 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy in Grade 3 English */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 bg-[#1B4332] border border-emerald-600/60 px-4 py-1.5 rounded-full text-xs font-semibold text-amber-300 shadow-sm">
              <HeartHandshake className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Community Interest Company (CIC) • Paisley & Scotland</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold text-white leading-tight tracking-tight">
              Sparkling Clean Homes <br className="hidden sm:inline" />
              <span className="text-[#D4AF37] italic">From Cleaners You Trust.</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-200 leading-relaxed max-w-2xl font-medium">
              We clean houses, move-out flats, and workplaces across Paisley and Glasgow. All our cleaners are friendly and police checked. When you hire us, you also help fund free cleaning for local people in need!
            </p>

            {/* Key Trust Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-emerald-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Police-Checked Cleaners</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>100% Deposit Back</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
                <span>Safe, Eco Soaps</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onNavigate('quote')}
                className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs sm:text-sm uppercase tracking-wider px-7 py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Get Instant Price</span>
              </button>

              <button
                onClick={() => onNavigate('community')}
                className="flex items-center gap-2 bg-[#1B4332] hover:bg-[#2D6A4F] text-amber-200 border border-emerald-600 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 text-[#D4AF37]" />
                <span>Our Community Work</span>
              </button>
            </div>
          </div>

          {/* Right Hero Badge Card */}
          <div className="lg:col-span-5">
            <div className="bg-[#1B4332]/90 backdrop-blur-md border-2 border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 text-white space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-emerald-800 pb-4">
                <div>
                  <span className="text-amber-300 font-bold text-[10px] uppercase tracking-wider block">Paisley Office</span>
                  <h3 className="text-xl font-serif font-bold text-white">Call Us Anytime</h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#0F382C] flex items-center justify-center text-[#D4AF37]">
                  <Phone className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 text-slate-200">
                  <MapPin className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Our Main Office:</strong>
                    <span>Paisley, Scotland, PA3 2PJ</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-slate-200">
                  <Phone className="w-4 h-4 text-[#D4AF37] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-white">Friendly Phone Help:</strong>
                   <a href="tel:+447731956727" className="hover:underline font-semibold block">+44 77 3195 6727</a>
                    <a href="tel:+447510911940" className="hover:underline font-semibold block">+44 75 1091 1940</a>
                   
                  </div>
                 
                </div>
              </div>

              <div className="pt-2 border-t border-emerald-800 flex items-center justify-between text-xs text-emerald-200">
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                  Rated 4.9/5 by Families
                </span>
                <span className="font-semibold text-amber-300">Mon - Sat 7am - 8pm</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#0F382C]">100%</span>
            <span className="text-xs font-semibold text-slate-600 block">Deposit Back Guarantee</span>
          </div>
          <div className="space-y-1 border-l border-slate-200 pl-4">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#0F382C]">5,000+</span>
            <span className="text-xs font-semibold text-slate-600 block">Clean Hours in Scotland</span>
          </div>
          <div className="space-y-1 border-l border-slate-200 pl-4">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#0F382C]">100%</span>
            <span className="text-xs font-semibold text-slate-600 block">Police-Checked Staff</span>
          </div>
          <div className="space-y-1 border-l border-slate-200 pl-4">
            <span className="text-3xl sm:text-4xl font-serif font-bold text-[#0F382C]">CIC</span>
            <span className="text-xs font-semibold text-slate-600 block">Community-Interest Company</span>
          </div>
        </div>
      </section>

      {/* Community Spotlight Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-gradient-to-br from-[#0F382C] to-[#1B4332] text-white p-8 sm:p-12 rounded-3xl border-4 border-[#D4AF37] shadow-2xl space-y-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-emerald-700/80 pb-6">
            <div>
              <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
                How We Help Our Town
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold">
                 {/*Free Home Cleans & Paid Job Training */}
                OANK Home Reset & Employment Pathway
              </h2>
            </div>
            <button
              onClick={() => onNavigate('community')}
              className="bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap shadow"
            >
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#082019]/70 p-6 rounded-2xl border border-emerald-700/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center flex-shrink-0">
                  <Home className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-white">1. Home Reset</h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                Free home cleaning for people who are having a hard time keeping their house tidy due to illness, age, or stress. We help them get back on track.
              </p>
            </div>

            <div className="bg-[#082019]/70 p-6 rounded-2xl border border-emerald-700/60 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-800 text-amber-200 flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-5 h-5" />
                </div>
                <h3 className="font-serif font-bold text-lg text-white">2. Employment Pathway</h3>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed">
                We give local people friendly training on safe cleaning and health rules, and then give them real paid jobs with friendly team leaders!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Services Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
          <div>
            <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block mb-1">
              Top Quality Work
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-[#0F382C]">
              Our Main Cleaning Services
            </h2>
          </div>

          <button
            onClick={() => onNavigate('services')}
            className="flex items-center gap-2 text-xs font-bold text-[#0F382C] hover:text-[#1B4332] uppercase tracking-wider cursor-pointer"
          >
            <span>See All Services</span>
            <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CLEANING_SERVICES.slice(0, 3).map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onSelect={onSelectService}
              onQuickQuote={() => onNavigate('quote')}
            />
          ))}
        </div>
      </section>

      {/* Why Choose OANK Cleaning Section */}
      <section className="bg-emerald-950 text-white py-16 rounded-3xl shadow-xl border-y-4 border-[#D4AF37]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
              Why People Love Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white leading-tight">
              Why Families & Offices Choose OANK Cleaning
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              We combine friendly, professional cleaning with a real community heart.
            </p>

            <div className="space-y-4 pt-2">
              {[
                { title: 'Careful Cleaner Checks', desc: 'Every cleaner passes full police background checks before they enter your home.' },
                { title: 'Safe For Kids & Pets', desc: 'We bring gentle, eco-friendly soaps that clean deep and leave fresh air.' },
                { title: '72-Hour Free Re-Clean', desc: 'If your landlord is not happy with a move-out clean, we come back and clean it again free.' },
                { title: 'Extra Germ-Stopping Power', desc: 'We use colour-coded cloths so bathroom germs never touch your kitchen counters.' }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-[#0F382C] p-3.5 rounded-xl border border-emerald-800">
                  <div className="w-6 h-6 rounded-full bg-[#D4AF37] text-[#0F382C] font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[11px] text-slate-300">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl">
              <img
                src={IMAGE_ASSETS.domestic}
                alt="Friendly OANK Cleaning Team"
                width={800}
                height={400}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#082019] via-transparent to-transparent flex items-end p-6">
                <div className="bg-[#0F382C]/90 backdrop-blur-md border border-emerald-700/80 p-4 rounded-2xl w-full text-xs space-y-1">
                  <span className="font-bold text-amber-300 uppercase tracking-wider block">Paisley HQ Team</span>
                  <p className="text-slate-200">Our cleaners are trained to make your home shine.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block mb-1">
              Happy Customers
            </span>
            <h2 className="text-3xl font-serif font-bold text-[#0F382C]">
              What Our Scottish Clients Say
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-[#0F382C] block">{t.name}</span>
                    <span className="text-[11px] text-slate-500">{t.location}</span>
                  </div>
                  <span className="bg-emerald-50 text-[#0F382C] font-semibold text-[10px] px-2 py-1 rounded-md">
                    {t.service}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Direct Contact Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="bg-[#0F382C] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl border-4 border-[#D4AF37]">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-amber-300 font-bold text-xs uppercase tracking-wider block">
              Want a Clean Home?
            </span>
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Talk to Our Paisley Team Today
            </h2>
            <p className="text-xs sm:text-sm text-slate-200">
              Paisley, Scotland PA3 2PJ • Phone: +44 77 3195 6727 | +44 75 1091 1940 
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('contact')}
              className="bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl shadow cursor-pointer transition-transform hover:scale-105 flex items-center justify-center whitespace-nowrap"
            >
              Send Message
            </button>

            <a
              href="tel:+447510911940"
              className="bg-[#1B4332] hover:bg-[#2D6A4F] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border border-emerald-600 flex items-center justify-center gap-2 transition-transform hover:scale-105 whitespace-nowrap"
              title="Call +44 75 1091 1940"
            >
              <Phone className="w-4 h-4 text-[#D4AF37]" />
              <span>Call +44 75 1091 1940</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};
