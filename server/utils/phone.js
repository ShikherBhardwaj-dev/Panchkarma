// Basic phone normalization helper
// - Removes non-digit characters
// - Adds +91 for 10-digit numbers (India) if missing
// - Preserves leading + when present
function normalizePhone(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (s.startsWith('+')) {
    // strip spaces
    return '+' + s.slice(1).replace(/\D/g, '');
  }
  const digits = s.replace(/\D/g, '');
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 11 && digits.startsWith('0')) return `+91${digits.slice(1)}`;
  if (digits.length >= 11) return `+${digits}`;
  return digits; // fallback
}

module.exports = { normalizePhone };
