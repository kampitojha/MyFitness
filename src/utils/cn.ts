/**
 * Tiny `classnames`-style helper so component APIs can accept
 * conditional class names without an extra dependency.
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}