
import React, { useMemo, useState } from 'react';
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
  Percent,
  Info,
} from 'lucide-react';

import { QuoteFormData } from '../types';
import { telemetry } from '../lib/telemetry';

const BRAND = '#0F382C';
const GOLD = '#D4AF37';

const services = [
  {
    id: 'domestic-regular',
    title: 'Regular Home Cleaning',
    description: 'Keep your home fresh and tidy.',
  },
  {
    id: 'deep-cleaning',
    title: 'Deep Cleaning',
    description: 'A thorough top-to-bottom clean.',
  },
  {
    id: 'end-of-tenancy',
    title: 'End of Tenancy',
    description: 'Detailed cleaning before moving out.',
  },
  {
    id: 'commercial-office',
    title: 'Office & Business',
    description: 'For workplaces and commercial spaces.',
  },
  {
    id: 'healthcare-carehome',
    title: 'Care Home & Healthcare',
    description: 'Cleaning requirements agreed in advance.',
  },
  {
    id: 'carpet-upholstery',
    title: 'Carpet & Upholstery',
    description: 'Refresh carpets and soft furnishings.',
  },
];

const addOns = [
  { id: 'oven', label: 'Oven cleaning', price: 35 },
  { id: 'carpet', label: 'Carpet cleaning', price: 45 },
  { id: 'windows', label: 'Inside windows', price: 25 },
  { id: 'fridge', label: 'Fridge cleaning', price: 20 },
];

const frequencies = [
  { id: 'one-off', label: 'One-off', discount: 'Standard price' },
  { id: 'weekly', label: 'Weekly', discount: 'Save 15%' },
  { id: 'fortnightly', label: 'Every 2 weeks', discount: 'Save 10%' },
  { id: 'monthly', label: 'Monthly', discount: 'Save 5%' },
];

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const initialFormData: QuoteFormData = {
  propertyType: 'house',
  bedrooms: 2,
  bathrooms: 1,
  serviceType: 'domestic-regular',
  frequency: 'one-off',
  addOns: [],
  livingRoomDiningRoom: false,
  suppliesCleaningMaterials: false,
  bestDays: ['Any.'],
  postcode: '',
  preferredDate: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
};

type Feedback = {
  type: 'success' | 'error';
  message: string;
  referenceNo?: string;
};

export const QuoteCalculator: React.FC = () => {
  const [formData, setFormData] =
    useState<QuoteFormData>(initialFormData);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  // Calculate the estimate whenever a selection changes.
  // Existing pricing rules are retained.
  const estimatedPrice = useMemo(() => {
    const basePrices: Record<string, number> = {
      'domestic-regular': 45,
      'deep-cleaning': 85,
      'end-of-tenancy': 145,
      'commercial-office': 65,
      'healthcare-carehome': 95,
      'carpet-upholstery': 70,
    };

    const frequencyDiscounts: Record<string, number> = {
      weekly: 0.15,
      fortnightly: 0.10,
      monthly: 0.05,
    };

    const addOnPrices: Record<string, number> = {
      oven: 35,
      carpet: 45,
      windows: 25,
      fridge: 20,
    };

    let total =
      (basePrices[formData.serviceType] ?? 45) +
      formData.bedrooms * 18 +
      formData.bathrooms * 12;

    // Additional cleaning services.
    total += formData.addOns.reduce(
      (sum, addon) => sum + (addOnPrices[addon] ?? 0),
      0
    );

    // Living room / dining room.
    if (formData.livingRoomDiningRoom) {
      total += 25;
    }

    // Regular cleaning frequency discount.
    total *= 1 - (frequencyDiscounts[formData.frequency] ?? 0);

    // 10% discount when the customer supplies materials/equipment.
    if (formData.suppliesCleaningMaterials) {
      total *= 0.9;
    }

    return Math.round((total + Number.EPSILON) * 100) / 100;
  }, [formData]);

  const updateField = <K extends keyof QuoteFormData>(
    field: K,
    value: QuoteFormData[K]
  ) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const toggleAddOn = (addon: string) => {
    setFormData((previous) => ({
      ...previous,
      addOns: previous.addOns.includes(addon)
        ? previous.addOns.filter((item) => item !== addon)
        : [...previous.addOns, addon],
    }));
  };

  const toggleDay = (day: string) => {
    setFormData((previous) => {
      if (day === 'Any.') {
        return { ...previous, bestDays: ['Any.'] };
      }

      const selected = previous.bestDays.filter(
        (item) => item !== 'Any.' && item !== 'Any'
      );

      const updated = selected.includes(day)
        ? selected.filter((item) => item !== day)
        : [...selected, day];

      return {
        ...previous,
        bestDays: updated.length ? updated : ['Any.'],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setFeedback(null);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();

    if (!name || !email || !phone) {
      setFeedback({
        type: 'error',
        message: 'Please enter your name, email address and phone number.',
      });
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setFeedback({
        type: 'error',
        message: 'Please enter a valid email address.',
      });
      return;
    }

    const phoneDigits = phone.replace(/\D/g, '');

    if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      setFeedback({
        type: 'error',
        message: 'Please enter a valid phone number.',
      });
      return;
    }

    setLoading(true);

    const startTime = performance.now();
    let responseStatus: number | null = null;

    try {
      const response = await fetch('/api/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          name,
          email,
          phone,
        }),
      });

      responseStatus = response.status;

      const responseText = await response.text();

      let payload: any;

      try {
        payload = JSON.parse(responseText);
      } catch {
        console.error(
          'Unexpected API response:',
          response.status,
          responseText.slice(0, 300)
        );

        throw new Error(
          `The server returned an unexpected response (HTTP ${response.status}).`
        );
      }

      const durationMs = Math.round(performance.now() - startTime);

      const isDbSaved =
        payload?.data?.submission?.databaseSaved === true;

      const isEmailSent =
        payload?.data?.submission?.mail?.adminSent === true;

      telemetry.recordNetworkRequest({
        url: '/api/quote',
        method: 'POST',
        status: response.status,
        durationMs,
        success: response.ok && payload.success,
        sizeBytes: JSON.stringify(payload).length,
      });

      if (
        response.ok &&
        payload.success &&
        isDbSaved &&
        isEmailSent
      ) {
        const referenceNo =
          payload.data?.referenceNo || payload.referenceNo;

        window.oankTrackLead?.('quote');

        setFeedback({
          type: 'success',
          referenceNo,
          message:
            `Thank you, ${name}! Your quote request has been received. ` +
            'Our team will contact you to confirm your selections and final price before booking.',
        });

        // Prevent accidental duplicate submissions.
        // Keep the submitted details visible.
      } else {
        setFeedback({
          type: 'error',
          message:
            payload?.message ||
            'We could not confirm your request was successfully delivered. Please try again or call +44 77 3195 6727.',
        });
      }
    } catch (error) {
      console.error('Quote submission failed:', error);

      telemetry.recordNetworkRequest({
        url: '/api/quote',
        method: 'POST',
        status: responseStatus,
        durationMs: Math.round(performance.now() - startTime),
        success: false,
        errorMessage:
          error instanceof Error ? error.message : 'Unknown error',
      });

      setFeedback({
        type: 'error',
        message:
          responseStatus !== null
            ? `We could not process your request (HTTP ${responseStatus}). Please try again or call +44 77 3195 6727.`
            : 'Unable to connect. Please check your internet connection or call +44 77 3195 6727.',
      });
    } finally {
      setLoading(false);
    }
  };

  const sectionTitle =
    'flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-bold text-[#0F382C]';

  const inputClass =
    'w-full min-h-[46px] rounded-xl border border-slate-300 bg-white px-3 py-3 text-base sm:text-sm text-slate-800 outline-none transition focus:border-[#0F382C] focus:ring-2 focus:ring-emerald-100';

  const selectionClass = (selected: boolean) =>
    `flex min-h-[48px] items-center justify-center rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
      selected
        ? 'border-[#0F382C] bg-emerald-50 text-[#0F382C]'
        : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
    }`;

  return (
    <div className="w-full overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">

      {/* HEADER AND ESTIMATED PRICE */}
      <div className="bg-[#0F382C] p-5 text-white sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Calculator className="h-4 w-4" />
              Cleaning Quote
            </div>

            <h2 className="text-2xl font-bold sm:text-3xl">
              Get Your Cleaning Estimate
            </h2>

            <p className="mt-2 max-w-lg text-sm leading-relaxed text-emerald-100">
              Select your cleaning requirements to see your estimated price.
            </p>
          </div>

          {/* SINGLE PRICE DISPLAY */}
          <div
            className="w-full rounded-2xl border border-emerald-700 bg-[#1B4332] p-5 sm:w-64"
            aria-live="polite"
            aria-atomic="true"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Your Estimated Total
            </p>

            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">
                £{estimatedPrice.toFixed(2)}
              </span>
            </div>

            <p className="mt-2 text-xs leading-relaxed text-emerald-100">
              Based on your selected services and discounts.
            </p>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 border-t border-emerald-800 pt-4 text-xs leading-relaxed text-emerald-100">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <p>
            Your estimate is the price foundation for your request.
            Our team will confirm your selections and final price with
            you before your cleaning is booked.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-8 p-5 sm:p-8"
        noValidate
      >

        {/* SECTION 1: PROPERTY */}
        <section className="space-y-4">
          <h3 className={sectionTitle}>
            <Home className="h-4 w-4 text-[#D4AF37]" />
            1. About Your Property
          </h3>

          <fieldset>
            <legend className="mb-3 text-xs font-semibold text-slate-700">
              Property type
            </legend>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { id: 'house', label: 'House', icon: Home },
                { id: 'flat', label: 'Flat', icon: Building },
                { id: 'office', label: 'Office', icon: Building },
                { id: 'commercial', label: 'Business', icon: Building },
              ].map((property) => {
                const Icon = property.icon;
                const selected =
                  formData.propertyType === property.id;

                return (
                  <button
                    key={property.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      updateField(
                        'propertyType',
                        property.id as any
                      )
                    }
                    className={selectionClass(selected)}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {property.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <fieldset>
              <legend className="mb-3 text-xs font-semibold text-slate-700">
                Bedrooms / Large rooms
              </legend>

              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    aria-pressed={formData.bedrooms === num}
                    onClick={() => updateField('bedrooms', num)}
                    className={selectionClass(
                      formData.bedrooms === num
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 text-xs font-semibold text-slate-700">
                Bathrooms / Toilets
              </legend>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    aria-pressed={formData.bathrooms === num}
                    onClick={() => updateField('bathrooms', num)}
                    className={selectionClass(
                      formData.bathrooms === num
                    )}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </section>

        {/* SECTION 2: CLEANING SERVICE */}
        <section className="space-y-4">
          <h3 className={sectionTitle}>
            <Sparkles className="h-4 w-4 text-[#D4AF37]" />
            2. Choose Your Cleaning Service
          </h3>

          <fieldset>
            <legend className="mb-3 text-xs text-slate-500">
              Select the service you need.
            </legend>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {services.map((service) => {
                const selected =
                  formData.serviceType === service.id;

                return (
                  <label
                    key={service.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border-2 p-4 transition-colors ${
                      selected
                        ? 'border-[#0F382C] bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="serviceType"
                      value={service.id}
                      checked={selected}
                      onChange={() =>
                        updateField(
                          'serviceType',
                          service.id as any
                        )
                      }
                      className="mt-1 h-4 w-4 shrink-0 accent-[#0F382C]"
                    />

                    <span>
                      <span className="block text-sm font-bold text-[#0F382C]">
                        {service.title}
                      </span>
                      <span className="mt-1 block text-xs leading-relaxed text-slate-500">
                        {service.description}
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Percent className="h-4 w-4 text-[#D4AF37]" />
              How often?
            </legend>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {frequencies.map((frequency) => {
                const selected =
                  formData.frequency === frequency.id;

                return (
                  <button
                    key={frequency.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() =>
                      updateField(
                        'frequency',
                        frequency.id as any
                      )
                    }
                    className={`rounded-xl border-2 p-3 text-center transition-colors ${
                      selected
                        ? 'border-[#0F382C] bg-[#0F382C] text-white'
                        : 'border-slate-200 text-slate-700 hover:border-slate-400'
                    }`}
                  >
                    <span className="block text-sm font-semibold">
                      {frequency.label}
                    </span>

                    <span
                      className={`mt-1 block text-[11px] ${
                        selected
                          ? 'text-amber-300'
                          : 'text-emerald-700'
                      }`}
                    >
                      {frequency.discount}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-3 flex items-center justify-between gap-2 text-xs font-semibold text-slate-700">
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-[#D4AF37]" />
                Preferred cleaning days
              </span>

              <span className="font-normal text-emerald-700">
                {formData.bestDays.includes('Any.')
                  ? 'Flexible'
                  : `${formData.bestDays.length} selected`}
              </span>
            </legend>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {days.map((day) => {
                const selected = formData.bestDays.includes(day);

                return (
                  <button
                    key={day}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => toggleDay(day)}
                    className={selectionClass(selected)}
                  >
                    {day}
                  </button>
                );
              })}

              <button
                type="button"
                aria-pressed={formData.bestDays.includes('Any.')}
                onClick={() => toggleDay('Any.')}
                className={selectionClass(
                  formData.bestDays.includes('Any.')
                )}
              >
                Any day
              </button>
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Choose one or more days, or select Any day.
            </p>
          </fieldset>
        </section>

        {/* SECTION 3: ADDITIONAL CLEANING */}
        <section className="space-y-4">
          <h3 className={sectionTitle}>
            <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" />
            3. Additional Cleaning
          </h3>

          <fieldset>
            <legend className="mb-3 text-xs text-slate-500">
              Select any extras you need.
            </legend>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {addOns.map((addon) => {
                const selected =
                  formData.addOns.includes(addon.id);

                return (
                  <label
                    key={addon.id}
                    className={`flex min-h-[58px] cursor-pointer items-center justify-between gap-3 rounded-xl border-2 p-3 transition-colors ${
                      selected
                        ? 'border-[#0F382C] bg-emerald-50'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <span>
                      <span className="block text-sm font-semibold text-slate-800">
                        {addon.label}
                      </span>
                      <span className="mt-1 block text-xs font-bold text-emerald-700">
                        +£{addon.price.toFixed(2)}
                      </span>
                    </span>

                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleAddOn(addon.id)}
                      className="h-5 w-5 shrink-0 accent-[#0F382C]"
                    />
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label
            className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 p-4 transition-colors ${
              formData.livingRoomDiningRoom
                ? 'border-[#0F382C] bg-emerald-50'
                : 'border-slate-200'
            }`}
          >
            <span>
              <span className="block text-sm font-semibold text-[#0F382C]">
                Living room / Dining room
              </span>
              <span className="mt-1 block text-xs font-bold text-emerald-700">
                +£25.00
              </span>
            </span>

            <input
              type="checkbox"
              checked={formData.livingRoomDiningRoom}
              onChange={(e) =>
                updateField(
                  'livingRoomDiningRoom',
                  e.target.checked
                )
              }
              className="h-5 w-5 shrink-0 accent-[#0F382C]"
            />
          </label>

          <fieldset className="rounded-xl border border-slate-200 p-4">
            <legend className="px-1 text-sm font-semibold text-[#0F382C]">
              Will you supply the cleaning materials and equipment?
            </legend>

            <p className="mb-3 text-xs leading-relaxed text-slate-500">
              If yes, you receive 10% off your estimate.
            </p>

            <div className="flex flex-wrap gap-6">
              {[
                { value: true, label: 'Yes' },
                { value: false, label: 'No' },
              ].map((option) => (
                <label
                  key={String(option.value)}
                  className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
                >
                  <input
                    type="radio"
                    name="suppliesCleaningMaterials"
                    checked={
                      formData.suppliesCleaningMaterials ===
                      option.value
                    }
                    onChange={() =>
                      updateField(
                        'suppliesCleaningMaterials',
                        option.value
                      )
                    }
                    className="h-4 w-4 accent-[#0F382C]"
                  />
                  {option.label}
                </label>
              ))}
            </div>

            {formData.suppliesCleaningMaterials && (
              <p className="mt-3 text-xs font-semibold text-emerald-700">
                <CheckCircle2 className="mr-1 inline h-4 w-4" />
                Your 10% discount has been applied.
              </p>
            )}
          </fieldset>
        </section>

        {/* SECTION 4: CONTACT DETAILS */}
        <section className="space-y-4">
          <h3 className={sectionTitle}>
            <User className="h-4 w-4 text-[#D4AF37]" />
            4. Your Contact Details
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label
                htmlFor="quote-name"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Full name *
              </label>

              <div className="relative">
                <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="quote-name"
                  type="text"
                  required
                  autoComplete="name"
                  maxLength={100}
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) =>
                    updateField('name', e.target.value)
                  }
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="quote-email"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Email address *
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="quote-email"
                  type="email"
                  required
                  autoComplete="email"
                  maxLength={254}
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    updateField('email', e.target.value)
                  }
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="quote-phone"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Phone number *
              </label>

              <div className="relative">
                <Phone className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="quote-phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  maxLength={25}
                  placeholder="Your phone number"
                  value={formData.phone}
                  onChange={(e) =>
                    updateField('phone', e.target.value)
                  }
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="quote-postcode"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Postcode / Town
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="quote-postcode"
                  type="text"
                  autoComplete="postal-code"
                  maxLength={30}
                  placeholder="Enter your postcode or town"
                  value={formData.postcode}
                  onChange={(e) =>
                    updateField('postcode', e.target.value)
                  }
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="quote-date"
                className="mb-2 block text-xs font-semibold text-slate-700"
              >
                Preferred date
              </label>

              <div className="relative">
                <Calendar className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  id="quote-date"
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) =>
                    updateField('preferredDate', e.target.value)
                  }
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="quote-notes"
              className="mb-2 block text-xs font-semibold text-slate-700"
            >
              Anything else we should know? (Optional)
            </label>

            <textarea
              id="quote-notes"
              rows={3}
              maxLength={1500}
              placeholder="Tell us about any special requirements..."
              value={formData.notes}
              onChange={(e) =>
                updateField('notes', e.target.value)
              }
              className={`${inputClass} min-h-[90px] resize-y`}
            />
          </div>
        </section>

        {/* FEEDBACK */}
        {feedback && (
          <div
            role={feedback.type === 'success' ? 'status' : 'alert'}
            aria-live="polite"
            className={`flex items-start gap-3 rounded-xl border p-4 ${
              feedback.type === 'success'
                ? 'border-emerald-300 bg-emerald-50 text-[#0F382C]'
                : 'border-rose-200 bg-rose-50 text-rose-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
            ) : (
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />
            )}

            <div className="min-w-0">
              <p className="text-sm font-semibold leading-relaxed">
                {feedback.message}
              </p>

              {feedback.referenceNo && (
                <div className="mt-3 rounded-lg bg-white p-3 text-xs">
                  <p className="font-semibold text-slate-700">
                    Your Reference Number
                  </p>

                  <p className="mt-1 break-all text-base font-bold text-[#0F382C]">
                    {feedback.referenceNo}
                  </p>

                  <a
                    href="/track-job"
                    className="mt-2 inline-block font-semibold text-[#0F382C] underline"
                  >
                    Track your job
                  </a>
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRIVACY */}
        <p className="text-xs leading-relaxed text-slate-500">
          Your details will only be used to process and respond to your
          quote request. See our{' '}
          <a
            href="/privacy-policy"
            className="font-semibold text-[#0F382C] underline"
          >
            Privacy Policy
          </a>.
        </p>

        {/* FINAL ESTIMATE SUMMARY */}
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-slate-600">
                Your estimated total
              </p>
              <p className="mt-1 text-2xl font-bold text-[#0F382C]">
                £{estimatedPrice.toFixed(2)}
              </p>
            </div>

            <Calculator className="h-7 w-7 text-emerald-700" />
          </div>

          <p className="mt-2 text-xs leading-relaxed text-slate-600">
            Please review your selections before submitting.
            Our team will contact you to confirm the details and
            agree the final price before booking.
          </p>
        </div>

        {/* SUBMIT */}
        <div className="space-y-3 border-t border-slate-200 pt-5">
          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0F382C] px-6 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-md transition-colors hover:bg-[#1B4332] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Sending Request...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 text-[#D4AF37]" />
                Submit Quote Request
              </>
            )}
          </button>

          <div className="flex items-center justify-center gap-2 text-center text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />
            <span>No booking is confirmed until your details and price are agreed.</span>
          </div>

          <p className="text-center text-xs text-slate-500">
            Need help? Call{' '}
            <a
              href="tel:+447731956727"
              className="font-bold text-[#0F382C] underline"
            >
              +44 77 3195 6727
            </a>
          </p>
        </div>
      </form>
    </div>
  );
};
