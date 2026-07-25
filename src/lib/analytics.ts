// Thin wrapper around GA4 gtag so components fire events without
// re-declaring the global or guarding for its absence at every call site.
type EventParams = Record<string, string | number | boolean | undefined>;

type Gtag = (command: 'event', eventName: string, params?: EventParams) => void;

export function track(eventName: string, params: EventParams = {}): void {
  const gtag = (window as unknown as { gtag?: Gtag }).gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', eventName, params);
}
