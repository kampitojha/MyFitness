/**
 * Date helpers, all operating on local time and producing
 * ISO date strings (`YYYY-MM-DD`) for stable storage keys.
 */

const DAY_MS = 86_400_000;

export function toISODate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Local, timezone-safe datetime string: `YYYY-MM-DDTHH:mm:ss` (no UTC shift).
 *  Keeps both the local calendar day (slice 0,10) and the local clock time
 *  (slice 11,16) without drift. */
export function toLocalDateTime(d: Date = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${toISODate(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export function fromISODate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function addDays(iso: string, days: number): string {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + days);
  return toISODate(d);
}

export function startOfWeek(iso: string): string {
  const d = fromISODate(iso);
  const day = d.getDay();
  const diff = day === 0 ? 6 : day - 1;
  return addDays(iso, -diff);
}

export function lastNDays(n: number, end: string = toISODate()): string[] {
  return Array.from({ length: n }, (_, i) => addDays(end, -(n - 1 - i)));
}

export function relativeDayLabel(iso: string): string {
  const today = toISODate();
  if (iso === today) return 'Today';
  if (iso === addDays(today, -1)) return 'Yesterday';
  if (iso === addDays(today, 1)) return 'Tomorrow';
  return formatShort(iso);
}

export function formatShort(iso: string): string {
  return fromISODate(iso).toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatLong(iso: string): string {
  return fromISODate(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function formatMonth(iso: string): string {
  return fromISODate(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function formatFull(iso: string): string {
  return fromISODate(iso).toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function hourLabel(iso: string): string {
  return fromISODate(iso).toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

export function daysBetween(a: string, b: string): number {
  const diff = fromISODate(b).getTime() - fromISODate(a).getTime();
  return Math.round(diff / DAY_MS);
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7);
}