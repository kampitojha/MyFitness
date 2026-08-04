export function formatNumber(value: number, maximumFractionDigits = 0): string {
  return value.toLocaleString(undefined, {
    maximumFractionDigits,
  });
}

export function formatCalories(value: number): string {
  return formatNumber(value);
}

export function formatGrams(value: number): string {
  return `${formatNumber(value, 1)}g`;
}

export function formatWaterMl(ml: number): string {
  if (ml >= 1000) {
    const liters = ml / 1000;
    return `${formatNumber(liters, 1)}L`;
  }
  return `${formatNumber(ml)}ml`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function roundTo(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function percent(value: number, total: number): number {
  if (total <= 0) return 0;
  return clamp(Math.round((value / total) * 100), 0, 100);
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}