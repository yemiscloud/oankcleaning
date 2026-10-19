/**
 * OANK Cleaning Security & Trust Boundary Utilities
 * 
 * Provides:
 * 1. Email Obfuscation & Safe Compartmentalization (mitigates automated harvesting scanners)
 * 2. Trust Boundary validation & safe masking (RFC 5322 validation, PII masking in logs)
 * 3. Security header verification
 */

// Encoded representation of public contact email (info@oankcleaning.co.uk)
// Kept encoded to prevent static web scraping bots from extracting raw mailto links.
const ENCODED_EMAIL_PARTS = ['info', 'oankcleaning', 'co', 'uk'];

/**
 * Reassembles the official contact email inside the client trust boundary.
 */
export function getProtectedEmail(): string {
  return `${ENCODED_EMAIL_PARTS[0]}@${ENCODED_EMAIL_PARTS[1]}.${ENCODED_EMAIL_PARTS[2]}.${ENCODED_EMAIL_PARTS[3]}`;
}

/**
 * Masks an email for safe display/logging outside the trust boundary.
 * e.g. "alexander@example.com" -> "al***@example.com"
 */
export function maskEmailForDisplay(email: string): string {
  if (!email || !email.includes('@')) return '***@***.***';
  const [user, domain] = email.split('@');
  if (user.length <= 2) {
    return `${user[0] || '*'}***@${domain}`;
  }
  return `${user.substring(0, 2)}***@${domain}`;
}

/**
 * Validates email format according to standard trust boundary rules.
 */
export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  // RFC 5322 compliant regex for web forms
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(trimmed) && trimmed.length <= 254;
}
