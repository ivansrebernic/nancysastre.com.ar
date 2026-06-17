// Video configuration for the recruitment funnel.
//
// All four videos are placeholders until the real assets are ready.
// To go live, set `youtubeId` to the YouTube video ID (the part after
// `watch?v=` or `youtu.be/`). While `youtubeId` is null, the section
// renders a styled "próximamente" placeholder.

export interface FunnelVideo {
  youtubeId: string | null;
  title: string;
  /** Short label shown on the placeholder while the video is pending. */
  placeholderLabel: string;
}

export const videos: Record<string, FunnelVideo> = {
  // "El Vehículo Comercial" — institutional product video (~5 min)
  product: {
    youtubeId: 'lSnOOuYgLnY',
    title: 'Productos Fuxion',
    placeholderLabel: 'Video institucional de productos',
  },
  // "El Vehículo Comercial" — corporate-backing video (~5 min)
  corporate: {
    youtubeId: 'AFv9Iro_NA0',
    title: 'Fuxion — Respaldo corporativo',
    placeholderLabel: 'Video institucional corporativo',
  },
  // Nancy's personal message (~1 min, recorded by her)
  personal: {
    youtubeId: null,
    title: 'Un mensaje de Nancy',
    placeholderLabel: 'Mensaje personal de Nancy',
  },
  // Business presentation (~4 min) — "Presentacion de negocio Fuxion 2020 HD"
  presentation: {
    youtubeId: null,
    title: 'Presentación de negocio Fuxion',
    placeholderLabel: 'Presentación de negocio (4 min)',
  },
};
