import React, { useState } from 'react';
import { 
  Sparkles, 
  Menu, 
  X, 
  ChevronRight,
  HeartHandshake
} from 'lucide-react';
import { Logo } from './Logo';
import { PageRoute } from '../types';

interface HeaderProps {
  currentRoute: PageRoute;
  onNavigate: (route: PageRoute) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute, onNavigate }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks: { label: string; route: PageRoute; badge?: string }[] = [
    { label: 'Home', route: 'home' },
    { label: 'About Us', route: 'about' },
    { label: 'Services', route: 'services' },
    { label: 'Community', route: 'community', badge: 'Helping You' },
    { label: 'FAQs', route: 'faqs' },
    { label: 'Contact', route: 'contact' },
  ];

  const handleNavClick = (route: PageRoute) => {
    onNavigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-50 w-full shadow-md bg-white">
      {/* Top Announcement Bar in Grade 3 English */}
      <div className="bg-[#0F382C] text-slate-100 text-xs py-2 px-4 text-center border-b border-emerald-800 flex items-center justify-center gap-2">
        <HeartHandshake className="w-4 h-4 text-[#D4AF37] flex-shrink-0" />
        <span>
          <strong>OANK Cleaning CIC</strong> – A friendly community Interest Company in Paisley, Scotland
        </span>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={() => handleNavClick('home')} 
          className="text-left cursor-pointer focus:outline-none"
          aria-label="OANK Cleaning Home"
        >
          <Logo size="md" variant="light" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            return (
              <button
                key={link.route}
                onClick={() => handleNavClick(link.route)}
                className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer relative flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#0F382C] bg-emerald-50 font-bold border-b-2 border-[#1B4332]'
                    : 'text-slate-700 hover:text-[#0F382C] hover:bg-slate-100'
                }`}
              >
                <span>{link.label}</span>
                {link.badge && (
                  <span className="bg-[#D4AF37] text-[#0F382C] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Quote CTA on Header */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={() => handleNavClick('quote')}
            className="bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-xl shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            Get Instant Quote
          </button>
        </div>

        {/* Mobile Menu Button with 44px Accessible Touch Target */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center p-2 rounded-xl text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-[#0F382C] cursor-pointer"
          aria-label="Open navigation menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6 text-[#0F382C]" /> : <Menu className="w-6 h-6 text-[#0F382C]" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 shadow-lg animate-fadeIn">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 mb-2">
            <p className="text-xs text-[#0F382C] font-semibold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              OANK Cleaning • Paisley, Scotland
            </p>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#0F382C] text-white font-semibold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{link.label}</span>
                    {link.badge && (
                      <span className="bg-[#D4AF37] text-[#0F382C] text-[9px] font-bold px-1.5 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </div>
                  <ChevronRight className={`w-4 h-4 ${isActive ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
                </button>
              );
            })}

            <button
              onClick={() => handleNavClick('governance')}
              className={`flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentRoute === 'governance'
                  ? 'bg-[#0F382C] text-white font-semibold'
                  : 'text-slate-800 hover:bg-slate-100'
              }`}
            >
              <span>Our Rules & Promises</span>
              <ChevronRight className={`w-4 h-4 ${currentRoute === 'governance' ? 'text-[#D4AF37]' : 'text-slate-400'}`} />
            </button>

            <div className="pt-2">
              <button
                onClick={() => handleNavClick('quote')}
                className="w-full bg-[#D4AF37] hover:bg-[#b8860b] text-[#0F382C] font-bold text-xs uppercase tracking-wider py-3 rounded-xl shadow cursor-pointer text-center"
              >
                Get Instant Quote
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
