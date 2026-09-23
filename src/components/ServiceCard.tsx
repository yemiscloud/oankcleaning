import React from 'react';
import { Sparkles, Check, ArrowRight, Clock } from 'lucide-react';
import { CleaningService } from '../types';

interface ServiceCardProps {
  service: CleaningService;
  onSelect: (service: CleaningService) => void;
  onQuickQuote?: (service: CleaningService) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect, onQuickQuote }) => {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group h-full relative">
      {/* Popular Badge */}
      {service.popular && (
        <div className="absolute top-4 right-4 z-10 bg-[#D4AF37] text-[#0F382C] font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Most Popular</span>
        </div>
      )}

      {/* Image Container */}
      <div className="relative h-52 sm:h-56 overflow-hidden bg-slate-900">
        <img
          src={service.image}
          alt={service.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#082019]/90 via-[#082019]/30 to-transparent flex items-end p-5">
          <div>
            <span className="text-amber-300 font-bold text-[10px] uppercase tracking-wider block">
              {service.category.toUpperCase()} SERVICE
            </span>
            <h3 className="text-xl font-serif font-bold text-white leading-tight">
              {service.title}
            </h3>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
        <div>
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {service.shortDesc}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
            {service.features.slice(0, 3).map((feat, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#0F382C] flex items-center justify-center flex-shrink-0">
                  <Check className="w-2.5 h-2.5 stroke-[3]" />
                </div>
                <span className="truncate">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Meta & Actions */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-serif font-bold text-[#0F382C] text-sm">
              {service.priceStart}
            </span>
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3 text-[#D4AF37]" />
              {service.estimatedTime}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(service)}
              className="w-full py-2.5 px-3 rounded-xl border-2 border-[#0F382C] text-[#0F382C] font-bold text-xs hover:bg-[#0F382C] hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1"
            >
              <span>Check Checklist</span>
            </button>

            <button
              onClick={() => onQuickQuote && onQuickQuote(service)}
              className="w-full py-2.5 px-3 rounded-xl bg-[#0F382C] text-white font-bold text-xs hover:bg-[#1B4332] transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
            >
              <span>Get Quote</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
