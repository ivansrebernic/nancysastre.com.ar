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

type Clarity = (command: 'set' | 'upgrade', ...args: string[]) => void;

function clarityApi(): Clarity | undefined {
  const clarity = (window as unknown as { clarity?: Clarity }).clarity;
  return typeof clarity === 'function' ? clarity : undefined;
}

/**
 * Etiqueta la sesión de Clarity. Las etiquetas son filtrables desde el
 * dashboard, así que sirven para aislar grabaciones por etapa del embudo
 * en vez de revisarlas a ojo. Una misma clave acumula varios valores.
 */
export function tagClarity(key: string, value: string): void {
  clarityApi()?.('set', key, value);
}

/**
 * Saca la sesión del sampleo de Clarity: se guarda sí o sí. Reservado para
 * los tramos de bajo volumen y alto valor — sin esto, las pocas sesiones que
 * llegan al formulario se pierden entre las que Clarity descarta.
 */
export function keepClaritySession(reason: string): void {
  clarityApi()?.('upgrade', reason);
}
