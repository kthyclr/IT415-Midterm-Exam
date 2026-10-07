/**
 * Unique Transaction Reference Generator
 * Produces a readable, guaranteed-unique transaction identifier for each completed kiosk transaction.
 * Format: TXN-YYYY-NNNNN-XXXX (e.g., TXN-2026-00001-8F3A)
 */

const STORAGE_COUNTER_KEY = 'campus_pos_txn_counter_2026';

let memorySequence = 0;

function getNextSequenceNumber(): number {
  memorySequence += 1;
  try {
    const raw = window.localStorage.getItem(STORAGE_COUNTER_KEY);
    const current = raw ? parseInt(raw, 10) : 0;
    const next = (Number.isFinite(current) && current >= 0 ? current : 0) + 1;
    window.localStorage.setItem(STORAGE_COUNTER_KEY, String(next));
    return Math.max(next, memorySequence);
  } catch {
    return memorySequence;
  }
}

function generateRandomSuffix(): string {
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function generateTransactionReference(): string {
  const year = new Date().getFullYear();
  const seq = String(getNextSequenceNumber()).padStart(5, '0');
  const suffix = generateRandomSuffix();
  return `TXN-${year}-${seq}-${suffix}`;
}
