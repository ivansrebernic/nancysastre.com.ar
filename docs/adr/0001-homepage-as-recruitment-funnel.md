# Homepage repositioned from store+recruit to a single-purpose recruitment funnel

The homepage previously served two goals at once — selling Fuxion products (hero "Comprar productos" CTA, `/productos` catalog) and recruiting partners. Per the COPY.md directive (line 453, "la landing no debe dar la opción de comprar cajas de Prunex en la primera pantalla"), we rebuilt `/` as a single-goal funnel that drives every visitor to one action: complete a qualifying form to request an *entrevista personalizada*. We removed the `/productos` route entirely and dropped the medical/doctor trust sections, because a focused funnel converts better for the paid-traffic audience (emprendedores) than a hybrid store.

## Considered Options

- **Update copy in place** (keep store + recruit, swap text) — rejected: contradicts the directive and keeps the page unfocused.
- **Funnel but keep doctor/medical sections** — rejected: those sections target product buyers, not recruits, and lengthen the path to the form.

## Consequences

- `/blog` is kept (live and linked); `/productos` and its `[id]` route are deleted — verify nothing else (blog posts, member flow) hard-links to them before removal.
- The page now depends on four videos and a Nancy portrait that don't exist yet; all are built as swappable placeholders.
