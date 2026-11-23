import React, { useMemo, useRef, useState } from 'react';
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

/* ------------------------------------------------------------------ */
/* Constants                                                           */
/* ------------------------------------------------------------------ */

const SUPPORT_PHONE = '+44 77 3195 6727';

const PROPERTY_TYPES = [
  { id: 'house', label: 'House', icon: Home },
  { id: 'flat', label: 'Flat', icon: Building },
  { id: 'office', label: 'Office', icon: Building },
  { id: 'commercial', label: 'Business', icon: Building },
] as const;

const SERVICES = [
  { id: 'domestic-regular', title: 'Regular Home Clean', sub: 'Every week or two', base: 0 }, // £10 when House is selected, £0 otherwise
  { id: 'deep-cleaning', title: 'Deep Spring Clean', sub: 'Top-to-bottom fresh clean', base: 85 },
  { id: 'end-of-tenancy', title: 'Move Out Clean', sub: '100% Deposit Back Guarantee', base: 125 },
  { id: 'commercial-office', title: 'Office & Business Clean', sub: 'For shops, desks and offices', base: 50 },
  { id: 'healthcare-carehome', title: 'Care Home & Health Clean', sub: 'Extra careful, germ-free clean', base: 95 },
  { id: 'carpet-upholstery', title: 'Carpet & Sofa Clean', sub: 'Hot water steam cleaning', base: 50 },
] as const;

const FREQUENCIES = [
  { id: 'one-off', label: 'One Time', note: 'Standard price', discount: 0 },
  { id: 'weekly', label: 'Every Week', note: 'Save 15%', discount: 0.15 },
  { id: 'fortnightly', label: 'Every 2 Weeks', note: 'Save 10%', discount: 0.1 },
  { id: 'monthly', label: 'Once a Month', note: 'Save 5%', discount: 0.05 },
] as const;

const ADD_ONS = [
  { id: 'oven', label: 'Oven Deep Clean', price: 30 },
  { id: 'carpet', label: 'Carpet Steam', price: 35 },
  { id: 'windows', label: 'Inside Windows', price: 25 },
  { id: 'fridge', label: 'Fridge Clean', price: 20 },
] as const;

const LIVING_ROOM_PRICE = 26;
const BATHROOM_RATE = 12;
const OWN_MATERIALS_DISCOUNT = 0.1;

const DAYS = [
  { value: 'Monday', label: 'Mon' },
  { value: 'Tuesday', label: 'Tue' },
  { value: 'Wednesday', label: 'Wed' },
  { value: 'Thursday', label: 'Thu' },
  { value: 'Friday', label: 'Fri' },
  { value: 'Saturday', label: 'Sat' },
  { value: 'Sunday', label: 'Sun' },
  { value: 'Any.', label: 'Any day' }, // value kept as 'Any.' for the API
] as const;

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const money = (n: number) => `£${n.toFixed(2)}`;

/* ------------------------------------------------------------------ */
/* Shared styles                                                       */
/* ------------------------------------------------------------------ */

const sectionTitle =
  'flex items-center gap-2 border-b border-slate-200 pb-3 text-sm font-bold text-[#0F382C]';

const labelClass = 'mb-1.5 block text-sm font-semibold text-slate-700';

const inputClass =
  'w-full min-h-[48px] rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-3 text-base text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#0F382C] focus:ring-2 focus:ring-emerald-200 aria-[invalid=true]:border-rose-400 aria-[invalid=true]:ring-rose-100';

const selectionClass = (selected: boolean) =>
  `flex min-h-[48px] w-full items-center justify-center rounded-xl border-2 px-3 py-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
    selected
      ? 'border-[#0F382C] bg-emerald-50 text-[#0F382C]'
      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
  }`;

const solidSelectionClass = (selected: boolean) =>
  `flex min-h-[48px] w-full flex-col items-center justify-center rounded-xl border-2 px-2 py-2.5 text-center text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
    selected
      ? 'border-[#0F382C] bg-[#0F382C] text-white'
      : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
  }`;

const initialForm: QuoteFormData = {
  propertyType: null,
  bedrooms: null,
  bathrooms: null,
  serviceType: null,
  frequency: 'one-off' as QuoteFormData['frequency'],
  addOns: [],
  livingRoomDiningRoom: false,
  suppliesCleaningMaterials: false,
  bestDays: [],
  postcode: '',
  preferredDate: '',
  name: '',
  email: '',
  phone: '',
  notes: '',
};

type FieldErrors = Partial<Record<'name' | 'email' | 'phone', string>>;

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export const QuoteCalculator: React.FC = () => {
  const [formData, setFormData] = useState<QuoteFormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'error';
    message: string;
    referenceNo?: string;
  } | null>(null);

  const feedbackRef = useRef<HTMLDivElement>(null);

  const updateField = <K extends keyof QuoteFormData>(field: K, value: QuoteFormData[K]) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
  };

  const showFeedback = (next: NonNullable<typeof feedback>) => {
    setFeedback(next);
    // Wait for render, then bring the message into view (important on mobile).
    requestAnimationFrame(() =>
      feedbackRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    );
  };

  /* ---------------------------- Pricing ---------------------------- */

  const priceCalculation = useMemo(() => {
    const service = SERVICES.find((s) => s.id === formData.serviceType);
    const base =
      formData.serviceType === 'domestic-regular'
        ? formData.propertyType === 'house'
          ? 10
          : 0
        : (service?.base ?? 0);

    const isBusiness = formData.propertyType === 'office' || formData.propertyType === 'commercial';
    const roomRate = isBusiness ? 22 : 18.5;

    const addOnsTotal = ADD_ONS.filter((a) => formData.addOns.includes(a.id)).reduce(
      (sum, a) => sum + a.price,
      0
    );

    const undiscounted =
      base +
      (formData.bedrooms ?? 0) * roomRate +
      (formData.bathrooms ?? 0) * BATHROOM_RATE +
      addOnsTotal +
      (formData.livingRoomDiningRoom ? LIVING_ROOM_PRICE : 0);

    const frequency = FREQUENCIES.find((f) => f.id === formData.frequency);
    const frequencyDiscount = frequency?.discount ?? 0;

    let discounted = undiscounted * (1 - frequencyDiscount);
    if (formData.suppliesCleaningMaterials === true) {
      discounted *= 1 - OWN_MATERIALS_DISCOUNT;
    }

    const originalPerVisit = round2(undiscounted);
    const pricePerVisit = round2(discounted);
    const savingsPerVisit = Math.max(0, round2(originalPerVisit - pricePerVisit));

    const appliedDiscounts: string[] = [];
    if (frequencyDiscount > 0) {
      appliedDiscounts.push(`${Math.round(frequencyDiscount * 100)}% ${frequency?.id} discount`);
    }
    if (formData.suppliesCleaningMaterials === true) {
      appliedDiscounts.push('10% own materials discount');
    }

    return { pricePerVisit, originalPerVisit, savingsPerVisit, appliedDiscounts };
  }, [formData]);

  const isOneOff = formData.frequency === 'one-off';

  /* --------------------------- Handlers ---------------------------- */

  const handleToggleAddOn = (addon: string) => {
    setFormData((prev) => ({
      ...prev,
      addOns: prev.addOns.includes(addon)
        ? prev.addOns.filter((a) => a !== addon)
        : [...prev.addOns, addon],
    }));
  };

  const handleToggleDay = (day: string) => {
    setFormData((prev) => {
      if (day === 'Any.') {
        return { ...prev, bestDays: prev.bestDays.includes('Any.') ? [] : ['Any.'] };
      }
      const withoutAny = prev.bestDays.filter((d) => d !== 'Any.' && d !== 'Any');
      return {
        ...prev,
        bestDays: withoutAny.includes(day)
          ? withoutAny.filter((d) => d !== day)
          : [...withoutAny, day],
      };
    });
  };

  const clearFieldError = (field: keyof FieldErrors) => {
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setFeedback(null);
    setFieldErrors({});

    if (!formData.propertyType) {
      showFeedback({
        type: 'error',
        message: 'Please choose a property type in Step 1 (House, Flat, Office or Business).',
      });
      return;
    }

    if (!formData.serviceType) {
      showFeedback({
        type: 'error',
        message: 'Please choose a cleaning service in Step 2.',
      });
      return;
    }

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const postcode = formData.postcode.trim();
    const notes = formData.notes.trim();

    const errors: FieldErrors = {};
    if (!name) errors.name = 'Please enter your name.';

    if (!email) {
      errors.email = 'Please enter your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Please enter a valid email address.';
    }

    const phoneDigits = phone.replace(/\D/g, '');
    if (!phone) {
      errors.phone = 'Please enter your phone number.';
    } else if (phoneDigits.length < 7 || phoneDigits.length > 15) {
      errors.phone = 'Please enter a valid phone number.';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      showFeedback({
        type: 'error',
        message: 'Please check your contact details so we can call you to confirm.',
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
        body: JSON.stringify({
          ...formData,
          bedrooms: formData.bedrooms ?? 0,
          bathrooms: formData.bathrooms ?? 0,
          frequency: formData.frequency ?? 'one-off',
          frequencyCount: 1,
          suppliesCleaningMaterials: formData.suppliesCleaningMaterials === true,
          postcode,
          name,
          email,
          phone,
          notes,
          pricePerVisit: priceCalculation.pricePerVisit,
          originalPerVisit: priceCalculation.originalPerVisit,
          savingsPerVisit: priceCalculation.savingsPerVisit,
          estimatedPrice: priceCalculation.pricePerVisit,
          originalTotal: priceCalculation.originalPerVisit,
          savings: priceCalculation.savingsPerVisit,
        }),
      });

      responseStatus = response.status;
      const responseText = await response.text();
      let payload: any;

      try {
        payload = JSON.parse(responseText);
      } catch {
        console.error('API returned a non-JSON response:', response.status, responseText.slice(0, 300));
        throw new Error(
          `The server returned an unexpected response (HTTP ${response.status}). Please contact support.`
        );
      }

      telemetry.recordNetworkRequest({
        url: '/api/quote',
        method: 'POST',
        status: response.status,
        durationMs: Math.round(performance.now() - startTime),
        success: response.ok && payload.success,
        sizeBytes: JSON.stringify(payload).length,
      });

      const isDbSaved = payload?.data?.submission?.databaseSaved === true;
      const isEmailSent = payload?.data?.submission?.mail?.adminSent === true;

      // Show success only when BOTH the database save and the admin email succeeded.
      if (response.ok && payload.success && isDbSaved && isEmailSent) {
        (window as any).oankTrackLead?.('quote');
        const referenceNo = payload.data?.referenceNo || payload.referenceNo;
        showFeedback({
          type: 'success',
          message: `Thank you, ${name}! Your request has been received. One of our team will call you shortly.`,
          referenceNo,
        });
        setFormData(initialForm);
      } else {
        showFeedback({
          type: 'error',
          message:
            payload.message ||
            `We could not confirm your request. Please call us on ${SUPPORT_PHONE}.`,
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
      showFeedback({
        type: 'error',
        message:
          responseStatus !== null
            ? `The server could not process your request (HTTP ${responseStatus}). Please try again or call ${SUPPORT_PHONE}.`
            : `Could not connect to the server. Please check your connection or call ${SUPPORT_PHONE}.`,
      });
    } finally {
      setLoading(false);
    }
  };

  const roomsLabel =
    formData.propertyType === 'office' || formData.propertyType === 'commercial'
      ? 'Rooms / Large areas'
      : 'Bedrooms / Large rooms';

  const today = new Date().toISOString().slice(0, 10);

  /* ----------------------------- Render ----------------------------- */

  return (
    <div className="w-full rounded-3xl border border-slate-200 bg-white shadow-xl">
      {/* Banner */}
      <div className="rounded-t-3xl bg-[#0F382C] p-5 text-white sm:p-8">
        <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-300">
          <Calculator className="h-4 w-4" aria-hidden="true" />
          <span>Cleaning Quote</span>
        </div>
        <h2 className="text-2xl font-bold sm:text-3xl">Get Your Cleaning Estimate</h2>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-emerald-100">
          Choose your requirements and see your price update as you go.
        </p>

        <div className="mt-5 flex items-start gap-2 border-t border-emerald-800 pt-4 text-xs leading-relaxed text-emerald-100">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" aria-hidden="true" />
          <p>We will confirm your selections and the final price with you before booking.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 p-5 pb-0 sm:p-8 sm:pb-0" noValidate>
        {/* STEP 1: PROPERTY */}
        <section className="space-y-5" aria-labelledby="step-property">
          <h3 id="step-property" className={sectionTitle}>
            <Home className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
            1. About Your Property
          </h3>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold text-slate-700">Property type</legend>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {PROPERTY_TYPES.map(({ id, label, icon: Icon }) => {
                const selected = formData.propertyType === id;
                return (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => updateField('propertyType', id as QuoteFormData['propertyType'])}
                    className={selectionClass(selected)}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-slate-700">{roomsLabel}</legend>
              <div className="grid grid-cols-6 gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    aria-pressed={formData.bedrooms === num}
                    onClick={() => updateField('bedrooms', num)}
                    className={selectionClass(formData.bedrooms === num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-slate-700">Bathrooms / Toilets</legend>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    aria-pressed={formData.bathrooms === num}
                    onClick={() => updateField('bathrooms', num)}
                    className={selectionClass(formData.bathrooms === num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>
        </section>

        {/* STEP 2: SERVICE & FREQUENCY */}
        <section className="space-y-6" aria-labelledby="step-service">
          <h3 id="step-service" className={sectionTitle}>
            <Sparkles className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
            2. Choose Your Cleaning Service
          </h3>

          <fieldset>
            <legend className="mb-2 text-sm text-slate-500">Select the service you need.</legend>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2" role="radiogroup">
              {SERVICES.map((s) => {
                const selected = formData.serviceType === s.id;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => updateField('serviceType', s.id as QuoteFormData['serviceType'])}
                    className={`flex min-h-[60px] items-center gap-3 rounded-xl border-2 p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                      selected
                        ? 'border-[#0F382C] bg-emerald-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        selected ? 'border-[#0F382C]' : 'border-slate-300'
                      }`}
                    >
                      {selected && <span className="h-2.5 w-2.5 rounded-full bg-[#0F382C]" />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-bold text-[#0F382C]">{s.title}</span>
                      <span className="block text-xs text-slate-500">{s.sub}</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
              <Percent className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
              How often? Regular visits cost less.
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="radiogroup">
              {FREQUENCIES.map((f) => {
                const selected = formData.frequency === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => updateField('frequency', f.id as QuoteFormData['frequency'])}
                    className={solidSelectionClass(selected)}
                  >
                    <span>{f.label}</span>
                    <span
                      className={`text-xs font-semibold ${
                        selected ? 'text-amber-300' : 'text-emerald-700'
                      }`}
                    >
                      {f.note}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 flex w-full items-center justify-between gap-2 text-sm font-semibold text-slate-700">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#D4AF37]" aria-hidden="true" />
                Best days for cleaning
              </span>
              <span className="text-xs font-normal text-amber-700">
                {formData.bestDays.length === 0
                  ? 'None selected'
                  : formData.bestDays.includes('Any.')
                    ? 'Any day'
                    : `${formData.bestDays.length} selected`}
              </span>
            </legend>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {DAYS.map((day) => {
                const selected = formData.bestDays.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => handleToggleDay(day.value)}
                    className={solidSelectionClass(selected)}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
            <p className="mt-1.5 text-xs text-slate-500">Pick one or more days, or choose Any day.</p>
          </fieldset>
        </section>

        {/* STEP 3: EXTRAS */}
        <section className="space-y-5" aria-labelledby="step-extras">
          <h3 id="step-extras" className={sectionTitle}>
            <CheckCircle2 className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
            3. Extras
          </h3>

          <fieldset>
            <legend className="mb-2 text-sm text-slate-500">Select any extras you need.</legend>
            <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
              {[
                ...ADD_ONS.map((a) => ({
                  id: a.id as string,
                  label: a.label,
                  price: a.price,
                  checked: formData.addOns.includes(a.id),
                  onToggle: () => handleToggleAddOn(a.id),
                })),
                {
                  id: 'living-dining',
                  label: 'Living / Dining room',
                  price: LIVING_ROOM_PRICE,
                  checked: formData.livingRoomDiningRoom,
                  onToggle: () => updateField('livingRoomDiningRoom', !formData.livingRoomDiningRoom),
                },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="checkbox"
                  aria-checked={item.checked}
                  onClick={item.onToggle}
                  className={`flex min-h-[60px] items-center justify-between gap-3 rounded-xl border-2 p-3.5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 ${
                    item.checked
                      ? 'border-[#0F382C] bg-emerald-50 text-[#0F382C]'
                      : 'border-slate-200 text-slate-700 hover:border-slate-400'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold leading-snug">{item.label}</span>
                    <span className="mt-0.5 block text-xs font-bold text-amber-700">+£{item.price}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${
                      item.checked ? 'border-[#0F382C] bg-[#0F382C]' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {item.checked && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
            <legend className="sr-only">Cleaning materials</legend>
            <p className="text-sm font-bold text-[#0F382C]">
              Will you supply the cleaning materials and equipment?
            </p>
            <p className="mt-0.5 text-xs text-slate-500">If yes, you get 10% off your estimate.</p>

            <div className="mt-3 grid grid-cols-2 gap-2.5 sm:max-w-xs" role="radiogroup">
              {[
                { value: true, label: 'Yes (10% off)' },
                { value: false, label: 'No' },
              ].map((option) => {
                const selected = formData.suppliesCleaningMaterials === option.value;
                return (
                  <button
                    key={String(option.value)}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => updateField('suppliesCleaningMaterials', option.value)}
                    className={solidSelectionClass(selected)}
                  >
                    {option.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        </section>

        {/* STEP 4: CONTACT */}
        <section className="space-y-5" aria-labelledby="step-contact">
          <h3 id="step-contact" className={sectionTitle}>
            <User className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
            4. Your Contact Details
          </h3>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label htmlFor="qc-name" className={labelClass}>
                Full name *
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="qc-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Fiona MacLeod"
                  value={formData.name}
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? 'qc-name-error' : undefined}
                  onChange={(e) => {
                    updateField('name', e.target.value);
                    clearFieldError('name');
                  }}
                  className={inputClass}
                />
              </div>
              {fieldErrors.name && (
                <p id="qc-name-error" className="mt-1 text-xs font-medium text-rose-700">
                  {fieldErrors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="qc-email" className={labelClass}>
                Email address *
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="qc-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="name@example.co.uk"
                  value={formData.email}
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? 'qc-email-error' : undefined}
                  onChange={(e) => {
                    updateField('email', e.target.value);
                    clearFieldError('email');
                  }}
                  className={inputClass}
                />
              </div>
              {fieldErrors.email && (
                <p id="qc-email-error" className="mt-1 text-xs font-medium text-rose-700">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="qc-phone" className={labelClass}>
                Phone number *
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="qc-phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  placeholder="Your phone number"
                  value={formData.phone}
                  aria-invalid={!!fieldErrors.phone}
                  aria-describedby={fieldErrors.phone ? 'qc-phone-error' : undefined}
                  onChange={(e) => {
                    updateField('phone', e.target.value);
                    clearFieldError('phone');
                  }}
                  className={inputClass}
                />
              </div>
              {fieldErrors.phone && (
                <p id="qc-phone-error" className="mt-1 text-xs font-medium text-rose-700">
                  {fieldErrors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="qc-postcode" className={labelClass}>
                Postcode or town
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="qc-postcode"
                  type="text"
                  autoComplete="postal-code"
                  placeholder="e.g. M1 1AE"
                  maxLength={50}
                  value={formData.postcode}
                  onChange={(e) => updateField('postcode', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label htmlFor="qc-date" className={labelClass}>
                Preferred date
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <input
                  id="qc-date"
                  type="date"
                  min={today}
                  value={formData.preferredDate}
                  onChange={(e) => updateField('preferredDate', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="qc-notes" className={labelClass}>
              Anything else we should know? (optional)
            </label>
            <textarea
              id="qc-notes"
              rows={4}
              maxLength={1500}
              placeholder="Parking, keys, pets or special requests"
              value={formData.notes}
              onChange={(e) => updateField('notes', e.target.value)}
              className="w-full resize-y rounded-xl border border-slate-300 bg-white px-3 py-3 text-base text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-[#0F382C] focus:ring-2 focus:ring-emerald-200"
            />
          </div>
        </section>

        {/* Feedback */}
        <div ref={feedbackRef} aria-live="polite" className="scroll-mt-24">
          {feedback && (
            <div
              role={feedback.type === 'error' ? 'alert' : 'status'}
              className={`flex items-start gap-3 rounded-xl border p-4 ${
                feedback.type === 'success'
                  ? 'border-emerald-300 bg-emerald-50 text-[#0F382C]'
                  : 'border-rose-200 bg-rose-50 text-rose-800'
              }`}
            >
              {feedback.type === 'success' ? (
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" aria-hidden="true" />
              ) : (
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" aria-hidden="true" />
              )}
              <div>
                <p className="text-sm font-semibold">{feedback.message}</p>
                {feedback.referenceNo && (
                  <p className="mt-1 text-xs text-slate-600">
                    Booking reference: <strong>{feedback.referenceNo}</strong> ·{' '}
                    <a href="/track-job" className="font-semibold text-[#0F382C] underline">
                      Track your job
                    </a>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sticky price + submit bar (single price display) */}
        <div className="sticky bottom-0 z-10 -mx-5 rounded-b-3xl border-t border-emerald-200 bg-white/95 px-5 py-4 shadow-[0_-8px_20px_-12px_rgba(15,56,44,0.25)] backdrop-blur sm:-mx-8 sm:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-w-0" aria-live="polite" aria-atomic="true">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-600">
                {isOneOff ? 'Estimated price' : 'Estimated price per visit'}
              </p>
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
                <span className="text-3xl font-extrabold tabular-nums tracking-tight text-[#0F382C]">
                  {money(priceCalculation.pricePerVisit)}
                </span>
                {priceCalculation.savingsPerVisit > 0 && (
                  <>
                    <span className="text-sm font-semibold tabular-nums text-slate-400 line-through">
                      {money(priceCalculation.originalPerVisit)}
                    </span>
                    <span className="rounded-md border border-emerald-200 bg-emerald-100 px-2 py-0.5 text-xs font-bold tabular-nums text-emerald-800">
                      Save {money(priceCalculation.savingsPerVisit)}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {!formData.serviceType
                  ? 'Choose a service to see your price.'
                  : priceCalculation.pricePerVisit === 0
                    ? 'Add rooms or extras to calculate your price.'
                    : priceCalculation.appliedDiscounts.length > 0
                      ? `Applied: ${priceCalculation.appliedDiscounts.join(' + ')}`
                      : 'No hidden fees.'}
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#0F382C] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-[#1B4332] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? (
                <span>Sending…</span>
              ) : (
                <>
                  <Send className="h-4 w-4 text-[#D4AF37]" aria-hidden="true" />
                  <span>Send Booking Request</span>
                </>
              )}
            </button>
          </div>

          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="h-4 w-4 shrink-0 text-[#D4AF37]" aria-hidden="true" />
            100% Deposit Back Guarantee on move out cleans
          </p>
        </div>
      </form>
    </div>
  );
};
