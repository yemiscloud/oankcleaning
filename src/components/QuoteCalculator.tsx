import React, { useState } from 'react';
import { 
  Calculator, 
  Home, 
  Building, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  Phone, 
  Send,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { QuoteFormData } from '../types';
import { submitQuoteRequest, submitContactForm } from '../lib/api';

export const QuoteCalculator: React.FC = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    propertyType: 'house',
    bedrooms: 2,
    bathrooms: 1,
    serviceType: 'domestic-regular',
    frequency: 'one-off',
    addOns: ['oven'],
    postcode: 'PA3 2PJ',
    preferredDate: '',
    name: '',
    email: '',
    phone: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    referenceNo?: string;
  } | null>(null);

  // Live client-side calculation fallback & update
  const calculateEstimate = () => {
    let base = 45;
    if (formData.serviceType === 'deep-cleaning') base = 85;
    if (formData.serviceType === 'end-of-tenancy') base = 145;
    if (formData.serviceType === 'commercial-office') base = 65;
    if (formData.serviceType === 'healthcare-carehome') base = 95;
    if (formData.serviceType === 'carpet-upholstery') base = 70;

    let total = base + (formData.bedrooms * 18) + (formData.bathrooms * 12);

    if (formData.addOns.includes('oven')) total += 35;
    if (formData.addOns.includes('carpet')) total += 45;
    if (formData.addOns.includes('windows')) total += 25;
    if (formData.addOns.includes('fridge')) total += 20;

    let discount = 0;
    if (formData.frequency === 'weekly') discount = 0.15;
    if (formData.frequency === 'fortnightly') discount = 0.10;
    if (formData.frequency === 'monthly') discount = 0.05;

    return Math.round(total - (total * discount));
  };

  const estimatedPrice = calculateEstimate();

  const handleToggleAddOn = (addon: string) => {
    setFormData((prev) => {
      const exists = prev.addOns.includes(addon);
      return {
        ...prev,
        addOns: exists ? prev.addOns.filter((a) => a !== addon) : [...prev.addOns, addon],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!formData.name || !formData.email || !formData.phone) {
      setFeedback({
        type: 'error',
        message: 'Please complete your contact details (Name, Email, and Phone Number) so our Paisley team can confirm your reservation.',
      });
      return;
    }

    setLoading(true);

    try {
      // 1. Get official quote from backend API via Axios
      const quoteRes = await submitQuoteRequest(formData);
      
      // 2. Submit booking request
      const contactRes = await submitContactForm({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: `${formData.serviceType.toUpperCase()} (${formData.frequency}) - Est. £${estimatedPrice}`,
        postcode: formData.postcode || 'PA3 2PJ',
        preferredDate: formData.preferredDate || 'As soon as possible',
        message: `Quote ID: ${quoteRes.quoteId || 'OANK-Q'}. Property: ${formData.bedrooms} Bed, ${formData.bathrooms} Bath ${formData.propertyType}. Add-ons: ${formData.addOns.join(', ')}. Client Notes: ${formData.notes || 'None'}`,
      });

      if (contactRes.success) {
        setFeedback({
          type: 'success',
          message: contactRes.message || `Quote request confirmed! Reference ID: ${contactRes.referenceNo}. Our team in Paisley will call you shortly.`,
          referenceNo: contactRes.referenceNo,
        });
      } else {
        setFeedback({
          type: 'error',
          message: contactRes.message || 'Something went wrong while submitting your request. Please call +44 75 1091 1940 directly.',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: 'An error occurred while connecting to the server. Please check your internet or call +44 75 1091 1940.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
      {/* Header Banner */}
      <div className="bg-[#0F382C] text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-4 border-[#D4AF37]">
        <div>
          <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
            <Calculator className="w-4 h-4 text-[#D4AF37]" />
            <span>Instant Estimate Tool</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-white">
            Custom Cleaning Calculator
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            Get an instant transparent estimate for your Paisley, Glasgow or Scotland property.
          </p>
        </div>

        {/* Live Estimate Badge */}
        <div className="bg-[#1B4332] border border-emerald-700/80 rounded-2xl p-4 text-right flex-shrink-0">
          <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Estimated Price</span>
          <div className="text-3xl font-serif font-bold text-white flex items-baseline gap-1">
            <span>£{estimatedPrice}</span>
            <span className="text-xs text-slate-300 font-normal">inc. VAT</span>
          </div>
          <span className="text-[10px] text-emerald-200 block mt-0.5">Zero hidden fees</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* Step 1: Property Type & Dimensions */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F382C] flex items-center gap-2 border-b border-slate-200 pb-2">
            <Home className="w-4 h-4 text-[#D4AF37]" />
            1. Property & Size Details
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'house', label: 'House', icon: Home },
              { id: 'flat', label: 'Flat / Apartment', icon: Building },
              { id: 'office', label: 'Office Space', icon: Building },
              { id: 'commercial', label: 'Commercial Site', icon: Building },
            ].map((p) => {
              const Icon = p.icon;
              const isSelected = formData.propertyType === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setFormData({ ...formData, propertyType: p.id as any })}
                  className={`flex flex-col items-center justify-center p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[#0F382C] bg-emerald-50 text-[#0F382C] font-semibold'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-[#0F382C]' : 'text-slate-400'}`} />
                  <span className="text-xs">{p.label}</span>
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bedrooms / Key Rooms
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setFormData({ ...formData, bedrooms: num })}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                      formData.bedrooms === num
                        ? 'bg-[#0F382C] text-white border-[#0F382C]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Bathrooms / Washrooms
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setFormData({ ...formData, bathrooms: num })}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                      formData.bathrooms === num
                        ? 'bg-[#0F382C] text-white border-[#0F382C]'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Step 2: Service & Frequency */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F382C] flex items-center gap-2 border-b border-slate-200 pb-2">
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            2. Service Type & Frequency
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'domestic-regular', title: 'Regular Domestic Clean', sub: 'Weekly / Fortnightly maintenance' },
              { id: 'deep-cleaning', title: 'Deep & Spring Clean', sub: 'Thorough top-to-bottom refresh' },
              { id: 'end-of-tenancy', title: 'End of Tenancy Clean', sub: '100% Deposit Back Guarantee' },
              { id: 'commercial-office', title: 'Office & Commercial', sub: 'Corporate hygiene contracts' },
              { id: 'healthcare-carehome', title: 'Healthcare & Care Home', sub: 'CQC infection control protocols' },
              { id: 'carpet-upholstery', title: 'Carpet & Upholstery', sub: 'Hot steam extraction restoration' },
            ].map((s) => {
              const isSelected = formData.serviceType === s.id;
              return (
                <div
                  key={s.id}
                  onClick={() => setFormData({ ...formData, serviceType: s.id })}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex items-start gap-3 ${
                    isSelected
                      ? 'border-[#0F382C] bg-emerald-50/70 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="serviceType"
                    checked={isSelected}
                    onChange={() => {}}
                    className="mt-1 accent-[#0F382C]"
                  />
                  <div>
                    <span className="text-xs font-bold text-[#0F382C] block">{s.title}</span>
                    <span className="text-[11px] text-slate-500">{s.sub}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-[#D4AF37]" />
              Select Frequency (Save with recurring schedules)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'one-off', label: 'One-Off Clean', discount: 'Standard Rate' },
                { id: 'weekly', label: 'Weekly Clean', discount: 'Save 15%' },
                { id: 'fortnightly', label: 'Fortnightly', discount: 'Save 10%' },
                { id: 'monthly', label: 'Monthly Clean', discount: 'Save 5%' },
              ].map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setFormData({ ...formData, frequency: f.id as any })}
                  className={`p-2.5 rounded-xl text-center border-2 transition-all cursor-pointer ${
                    formData.frequency === f.id
                      ? 'border-[#0F382C] bg-[#0F382C] text-white font-bold'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs block">{f.label}</span>
                  <span className={`text-[10px] block font-semibold ${formData.frequency === f.id ? 'text-amber-300' : 'text-emerald-700'}`}>
                    {f.discount}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Add-Ons */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F382C] flex items-center gap-2 border-b border-slate-200 pb-2">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            3. Optional Add-On Services
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'oven', label: 'Oven Deep Clean', price: '+£35' },
              { id: 'carpet', label: 'Carpet Steam', price: '+£45' },
              { id: 'windows', label: 'Internal Windows', price: '+£25' },
              { id: 'fridge', label: 'Fridge Sanitise', price: '+£20' },
            ].map((addon) => {
              const isChecked = formData.addOns.includes(addon.id);
              return (
                <button
                  type="button"
                  key={addon.id}
                  onClick={() => handleToggleAddOn(addon.id)}
                  className={`p-3 rounded-xl border-2 text-left transition-all cursor-pointer flex items-center justify-between ${
                    isChecked
                      ? 'border-[#0F382C] bg-emerald-50 font-semibold text-[#0F382C]'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div>
                    <span className="text-xs block">{addon.label}</span>
                    <span className="text-[10px] text-amber-700 font-bold">{addon.price}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="accent-[#0F382C]"
                  />
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 4: Contact & Submit Details */}
        <div className="space-y-4 pt-2">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F382C] flex items-center gap-2 border-b border-slate-200 pb-2">
            <User className="w-4 h-4 text-[#D4AF37]" />
            4. Confirm Details & Request Reservation
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Fiona MacLeod"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F382C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@domain.co.uk"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F382C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="tel"
                  required
                  placeholder="+44 7500 000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F382C] focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Postcode / Area
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="e.g. Paisley PA3 2PJ"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F382C] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Cleaning Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0F382C] focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Messages */}
        {feedback && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-[#0F382C]'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-bold">{feedback.message}</p>
              {feedback.referenceNo && (
                <p className="text-[11px] text-slate-600 mt-1">
                  Keep reference <strong>{feedback.referenceNo}</strong> for enquiries when contacting Paisley office (+44 75 1091 1940).
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>Fully vetted staff • Insured • Paisley, Scotland HQ</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0F382C] hover:bg-[#1B4332] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Calculating & Sending...</span>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#D4AF37]" />
                <span>Submit Quote & Enquire Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
