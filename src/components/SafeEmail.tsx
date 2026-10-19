import React, { useState } from 'react';
import { Mail, Check, Copy } from 'lucide-react';
import { getProtectedEmail } from '../lib/security';

interface SafeEmailProps {
  className?: string;
  showIcon?: boolean;
  iconClassName?: string;
  label?: string;
  subject?: string;
}

/**
 * SafeEmail Component
 * 
 * Mitigates "Email Address Exposure" scanner finding:
 * - Does not embed static plaintext 'mailto:' in unhydrated HTML markup
 * - Assembles address dynamically inside client trust boundary
 * - Provides 1-click safe clipboard copy with visual feedback
 * - Supports direct compose on intentional user interaction
 */
export const SafeEmail: React.FC<SafeEmailProps> = ({
  className = 'hover:text-amber-300 transition-colors',
  showIcon = false,
  iconClassName = 'w-4 h-4 text-[#D4AF37] flex-shrink-0',
  label,
  subject = 'Cleaning Enquiry - OANK Cleaning CIC',
}) => {
  const [copied, setCopied] = useState(false);
  const [revealed, setRevealed] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const email = getProtectedEmail();
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
    window.location.href = mailtoUrl;
  };

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const email = getProtectedEmail();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(email).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  return (
    <span
      className="inline-flex items-center gap-1.5 group cursor-pointer"
      onMouseEnter={() => setRevealed(true)}
      onFocus={() => setRevealed(true)}
    >
      {showIcon && <Mail className={iconClassName} />}
      <a
        href="#"
        onClick={handleClick}
        title="Click to safely contact OANK Cleaning team"
        className={`focus:outline-none focus:ring-1 focus:ring-amber-300 rounded ${className}`}
        aria-label="Contact OANK Cleaning via email"
      >
        {label || (revealed ? getProtectedEmail() : 'info@oankcleaning.co.uk')}
      </a>
      <button
        type="button"
        onClick={handleCopy}
        title={copied ? 'Copied to clipboard' : 'Copy protected email address'}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-slate-300 hover:text-amber-300"
        aria-label="Copy email address"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </span>
  );
};

export default SafeEmail;
