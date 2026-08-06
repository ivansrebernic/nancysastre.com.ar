// Thin wrapper around GA4 gtag so components fire events without
// re-declaring the global or guarding for its absence at every call site.
type EventParams = Record<string, string | number | boolean | undefined>;

type Gtag = (command: 'event', eventName: string, params?: EventParams) => void;

export function track(eventName: string, params: EventParams = {}): void {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', eventName, params);
}

type Fbq = (command: 'track' | 'trackCustom', eventName: string, params?: EventParams) => void;

/**
 * Eventos estándar del Meta Pixel. No-op mientras META_PIXEL_ID esté vacío,
 * igual que track() cuando no hay gtag: los call sites no se enteran.
 */
export function trackMeta(eventName: string, params: EventParams = {}): void {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq;
  if (typeof fbq !== 'function') return;
  fbq('track', eventName, params);
}
