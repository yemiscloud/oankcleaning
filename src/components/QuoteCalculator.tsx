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
import { telemetry } from '../lib/telemetry';

export const QuoteCalculator: React.FC = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    propertyType: 'house',
    bedrooms: 2,
    bathrooms: 1,
    serviceType: 'domestic-regular',
    frequency: 'one-off',
    addOns: ['oven'],
    bestDays: ['Any.'],
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

    total = Math.round(total * (1 - discount));
    return total;
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

  const handleToggleDay = (day: string) => {
    setFormData((prev) => {
      if (day === 'Any.') {
        return {
          ...prev,
          bestDays: ['Any.'],
        };
      }

      const withoutAny = prev.bestDays.filter((d) => d !== 'Any.' && d !== 'Any');
      const isAlreadySelected = withoutAny.includes(day);

      const updated = isAlreadySelected
        ? withoutAny.filter((d) => d !== day)
        : [...withoutAny, day];

      return {
        ...prev,
        bestDays: updated.length > 0 ? updated : ['Any.'],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (!formData.name || !formData.email || !formData.phone) {
      setFeedback({
        type: 'error',
        message: 'Please tell us your name, email, and phone number so we can call you to confirm.',
      });
      return;
    }

    setLoading(true);
    const startTime = performance.now();
    let responseStatus: number | null = null;

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(formData),
      });

      responseStatus = response.status;
      const responseText = await response.text();
      let payload: any;

      try {
        payload = JSON.parse(responseText);
      } catch {
        console.error(
          'API returned a non-JSON response:',
          response.status,
          responseText.slice(0, 300)
        );
        throw new Error(
          `The server returned an unexpected response (HTTP ${response.status}). Please contact support.`
        );
      }
      const durationMs = Math.round(performance.now() - startTime);

      telemetry.recordNetworkRequest({
        url: '/api/quote',
        method: 'POST',
        status: response.status,
        durationMs,
        success: response.ok && payload.success,
        sizeBytes: JSON.stringify(payload).length,
      });

      const isDbSaved = payload?.data?.submission?.databaseSaved === true;
      const isEmailSent = payload?.data?.submission?.mail?.adminSent === true;

      // Strict validation: Only show success when BOTH database and preferred email succeeded
      if (response.ok && payload.success && isDbSaved && isEmailSent) {
        setFeedback({
          type: 'success',
          message: `Thank you, ${formData.name}! Your quote request [${payload.data?.referenceNo || 'Confirmed'}] one of our team will call you within 2 hours`,
          referenceNo: payload.data?.referenceNo || payload.referenceNo,
        });
      } else {
        setFeedback({
          type: 'error',
          message: payload.message || 'Delivery could not be confirmed for database table and preferred email. Please call us directly at +44 75 1091 1940.',
        });
      }
    } catch (error) {
      console.error('API submission failed:', error);
      telemetry.recordNetworkRequest({
        url: '/api/quote',
        method: 'POST',
        status: responseStatus,
        durationMs: Math.round(performance.now() - startTime),
        success: false,
        errorMessage: error instanceof Error ? error.message : 'Unknown request error',
      });
      setFeedback({
        type: 'error',
        message: responseStatus !== null
          ? `The server could not process your quote request (HTTP ${responseStatus}). Please try again or call +44 75 1091 1940.`
          : 'Could not connect to the server. Please check your connection or call +44 75 1091 1940.',
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
            <span>Fast Price Check</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-white">
            Cleaning Price Calculator
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            See your price in seconds. Clear prices for Paisley, Glasgow, and Scotland.
          </p>
        </div>

        {/* Live Estimate Badge */}
        <div className="bg-[#1B4332] border border-emerald-700/80 rounded-2xl p-4 text-right flex-shrink-0">
          <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider block">Estimated Total</span>
          <div className="text-3xl font-serif font-bold text-white flex items-baseline gap-1">
            <span>£{estimatedPrice}</span>
            <span className="text-xs text-slate-300 font-normal">total</span>
          </div>
          <span className="text-[10px] text-emerald-200 block mt-0.5">No hidden fees</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
        {/* Step 1: Property Type & Dimensions */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F382C] flex items-center gap-2 border-b border-slate-200 pb-2">
            <Home className="w-4 h-4 text-[#D4AF37]" />
            1. What kind of building is it?
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { id: 'house', label: 'House', icon: Home },
              { id: 'flat', label: 'Flat', icon: Building },
              { id: 'office', label: 'Office', icon: Building },
              { id: 'commercial', label: 'Business', icon: Building },
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
                Bedrooms or Big Rooms
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setFormData({ ...formData, bedrooms: num })}
                    className={`flex-1 min-h-[44px] flex items-center justify-center py-2 rounded-xl font-bold text-sm sm:text-xs border transition-all cursor-pointer ${
                      formData.bedrooms === num
                        ? 'bg-[#0F382C] text-white border-[#0F382C] shadow-sm'
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
                Bathrooms or Toilets
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    type="button"
                    key={num}
                    onClick={() => setFormData({ ...formData, bathrooms: num })}
                    className={`flex-1 min-h-[44px] flex items-center justify-center py-2 rounded-xl font-bold text-sm sm:text-xs border transition-all cursor-pointer ${
                      formData.bathrooms === num
                        ? 'bg-[#0F382C] text-white border-[#0F382C] shadow-sm'
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
            2. Which clean and how often?
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { id: 'domestic-regular', title: 'Regular Home Clean', sub: 'Every week or two' },
              { id: 'deep-cleaning', title: 'Deep Spring Clean', sub: 'Top-to-bottom fresh clean' },
              { id: 'end-of-tenancy', title: 'Move Out Clean', sub: '100% Deposit Back Guarantee' },
              { id: 'commercial-office', title: 'Office & Business Clean', sub: 'For shops, desks, and offices' },
              { id: 'healthcare-carehome', title: 'Care Home & Health Clean', sub: 'Extra careful germ-free clean' },
              { id: 'carpet-upholstery', title: 'Carpet & Sofa Clean', sub: 'Hot water steam cleaning' },
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
              How often? (Save money when we visit regularly)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'one-off', label: 'One Time', discount: 'Normal Price' },
                { id: 'weekly', label: 'Every Week', discount: 'Save 15%' },
                { id: 'fortnightly', label: 'Every 2 Weeks', discount: 'Save 10%' },
                { id: 'monthly', label: 'Once a Month', discount: 'Save 5%' },
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

          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                When are the best days for cleaning?
              </span>
              <span className="text-[11px] text-amber-700 font-normal">
                {formData.bestDays.includes('Any.') ? 'Flexible: Any day' : `${formData.bestDays.length} day(s) selected`}
              </span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {[
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
                'Any.',
              ].map((day) => {
                const isSelected = formData.bestDays.includes(day);
                return (
                  <button
                    type="button"
                    key={day}
                    onClick={() => handleToggleDay(day)}
                    className={`min-h-[44px] flex items-center justify-center py-2.5 px-2 rounded-xl text-center border-2 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#0F382C] bg-[#0F382C] text-white font-bold shadow-sm'
                        : 'border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-xs block">{day}</span>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Pick one or more days that work best for you, or choose Any.
            </p>
          </div>
        </div>

        {/* Step 3: Add-Ons */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold uppercase tracking-wider text-[#0F382C] flex items-center gap-2 border-b border-slate-200 pb-2">
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            3. Extra items you want cleaned
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: 'oven', label: 'Oven Deep Clean', price: '+£35' },
              { id: 'carpet', label: 'Carpet Steam', price: '+£45' },
              { id: 'windows', label: 'Inside Windows', price: '+£25' },
              { id: 'fridge', label: 'Fridge Clean', price: '+£20' },
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
            4. Your Contact Details
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Fiona MacLeod"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-base sm:text-xs min-h-[44px] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="email"
                  required
                  placeholder="name@example.co.uk"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-base sm:text-xs min-h-[44px] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Phone Number *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="tel"
                  required
                  placeholder="+44 7510 911940"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-base sm:text-xs min-h-[44px] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Postcode or Town
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="e.g. Paisley PA3 2PJ"
                  value={formData.postcode}
                  onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-base sm:text-xs min-h-[44px] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Preferred Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 text-base sm:text-xs min-h-[44px] border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Feedback Alert */}
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
                  Your Booking Reference: <strong>{feedback.referenceNo}</strong>
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>100% Deposit Back Guarantee on move out cleans</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0F382C] hover:bg-[#1B4332] text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl shadow-lg transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Sending Request...</span>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#D4AF37]" />
                <span>Send Booking Request Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
