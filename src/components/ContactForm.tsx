import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  MessageSquare,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { ContactFormData } from '../types';
import { submitContactForm } from '../lib/api';

interface ContactFormProps {
  defaultService?: string;
}

export const ContactForm: React.FC<ContactFormProps> = ({ defaultService }) => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    service: defaultService || 'General Cleaning Enquiry',
    postcode: 'Paisley PA3 2PJ',
    preferredDate: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: 'success' | 'error';
    message: string;
    refNo?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!formData.name || !formData.email || !formData.message) {
      setStatus({
        type: 'error',
        message: 'Please fill in all mandatory fields: Full Name, Email, and Message.',
      });
      return;
    }

    setLoading(true);

    try {
      const response = await submitContactForm(formData);

      if (response.success) {
        setStatus({
          type: 'success',
          message: response.message,
          refNo: response.referenceNo,
        });
        setFormData({
          name: '',
          email: '',
          phone: '',
          service: 'General Cleaning Enquiry',
          postcode: 'Paisley PA3 2PJ',
          preferredDate: '',
          message: '',
        });
      } else {
        setStatus({
          type: 'error',
          message: response.message || 'Failed to submit message. Please try again or call +44 75 1091 1940.',
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Network error occurred. Please contact us directly at +44 75 1091 1940.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-200">
      <div className="mb-8">
        <span className="text-amber-700 font-bold text-xs uppercase tracking-wider block mb-1">
          Direct Paisley HQ Contact
        </span>
        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-[#0F382C]">
          Get in Touch With Oank Cleaning
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 mt-2">
          Send us your message or enquiry. An Oank Cleaning specialist in Paisley, Scotland will respond within 2 business hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Your Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                required
                placeholder="e.g. Fiona MacLeod"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                placeholder="name@domain.co.uk"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Phone Number */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Telephone Number
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="tel"
                placeholder="+44 7510 911940"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none"
              />
            </div>
          </div>

          {/* Service Dropdown */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Service Interested In
            </label>
            <select
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
              className="w-full px-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none bg-white text-slate-800"
            >
              <option value="General Cleaning Enquiry">General Cleaning Enquiry</option>
              <option value="Regular Domestic Cleaning">Regular Domestic Cleaning</option>
              <option value="Deep & Spring Cleaning">Deep & Spring Cleaning</option>
              <option value="End of Tenancy Cleaning">End of Tenancy Cleaning (100% Deposit Back)</option>
              <option value="Commercial & Office Cleaning">Commercial & Office Cleaning</option>
              <option value="Healthcare & Care Home Cleaning">Healthcare & Care Home Cleaning (CQC)</option>
              <option value="Carpet & Upholstery Care">Carpet & Upholstery Care</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Postcode */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Property Postcode / Area
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="text"
                placeholder="Paisley PA3 2PJ"
                value={formData.postcode}
                onChange={(e) => setFormData({ ...formData, postcode: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none"
              />
            </div>
          </div>

          {/* Preferred Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-800 mb-1.5">
              Preferred Cleaning Date
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
              <input
                type="date"
                value={formData.preferredDate}
                onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-slate-800 mb-1.5">
            Your Message or Request Details *
          </label>
          <div className="relative">
            <MessageSquare className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <textarea
              required
              rows={4}
              placeholder="Tell us about your property size, preferred days, or specific requirements..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0F382C] focus:outline-none"
            />
          </div>
        </div>

        {/* Feedback Alert */}
        {status && (
          <div
            className={`p-4 rounded-xl border flex items-start gap-3 ${
              status.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-[#0F382C]'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {status.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-xs font-bold">{status.message}</p>
              {status.refNo && (
                <p className="text-[11px] text-slate-600 mt-1">
                  Reference Code: <strong>{status.refNo}</strong> (Oank Cleaning CIC Paisley).
                </p>
              )}
            </div>
          </div>
        )}

        {/* Submit button */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Building2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Oank Cleaning CIC • Professional Cleaning Services</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#0F382C] hover:bg-[#1B4332] text-white font-bold text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span>Sending Request...</span>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#D4AF37]" />
                <span>Send Message Now</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
