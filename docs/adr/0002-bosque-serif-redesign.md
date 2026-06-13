# Homepage redesigned to "Bosque Serif" via multi-variant prototype

The recruitment funnel kept its structure (ADR-0001) but the visual design was rebuilt.
We ran a dev-only prototype on `/` with a floating variant switcher and let Nancy choose
in three rounds: structure (8 directions → cinematic full-bleed), palette (4 options →
"Bosque" greens: sage `#eef1e9`, forest `#182c21`, pine `#2e5e41`, lime `#9bc53d`),
and typography (4 options → Fraunces serif display + Albert Sans body). The winning
variant ("Bosque Serif") was then rewritten as production sections, not promoted as-is.

## Considered Options

- **Keep the blue Scandia/Poppins theme, only reorder sections** — rejected: Nancy asked
  to reimagine the site, and the prototype rounds showed clear preference for the greens.
- **Promote the prototype component directly** — rejected: prototype code had stub forms
  and no real header/footer/FAQ; sections were rewritten keeping production behavior
  (FormSubmit AJAX form, gallery lightbox, nav anchors).

## Consequences

- `primary` in Tailwind is now pine green (`#2e5e41`); the whole site (blog included)
  follows automatically. The hero photo (gallery-01) is fully visible behind a left-side
  scrim — Nancy sits on the right — with a right-anchored crop on mobile.
- The Scandia font never shipped (404s); `font-scandia*` classes now alias Albert Sans.
- Dropped from the homepage: About (Fuxion cards), BusinessPresentation (4-min video),
  FunnelCTA (scarcity block) — the scarcity line moved under the form's submit button.
  Components remain in the repo, unused. The 4-min presentation video config remains in
  `src/data/videos.ts` for a future placement.
- Lifestyle Gallery is a horizontal snap strip (all 30 photos, lightbox kept) instead of
  a masonry grid with "Ver más".
- AboutMe dropped the 16/4/+20 stats — the new casa-de-té story no longer references them.
