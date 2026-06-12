# Prototipo — rediseño de la homepage

**Pregunta:** ¿Qué estética/estructura debería tener la homepage rediseñada,
manteniendo el embudo de Nancy (hero → videos corporativos → historia compacta →
galería → video 1 min → formulario)?

**Veredicto parcial (2026-06-12):** de 8 direcciones exploradas (Editorial,
Cinemático, Minimal, Orgánica, Brutalista, Lujo, Aurora + el diseño actual), ganó
la **familia Cinemática**. Las demás se eliminaron; quedan en evaluación las
4 paletas de esa estructura. Falta elegir la paleta definitiva.

**Cómo probar:** `npm run dev` → http://localhost:4321/ y alternar con la barra
flotante inferior, las flechas ← → del teclado, o `?variant=A|C|C2|C3|C4`.

- **A — Actual**: el diseño en producción (baseline).
- **C — Cinemático**: oscuro, acento ámbar, Bebas gigante.
- **C2 — Cine Alba**: clave clara cálida; marfil + espresso + cobre, serif Fraunces.
- **C3 — Cine Costa**: blanco + azul de marca (#0186d6) + navy, Anton condensada.
- **C4 — Cine Bosque**: salvia claro + verde bosque + lima, Bricolage Grotesque.

Heros de toda la familia: foto a plena opacidad con scrim lateral izquierdo (la
derecha — Nancy en el pasto — queda 100% limpia), banda de stats debajo del hero,
y en mobile recorte anclado a la derecha + scrim inferior.

Se renderizan en dev y en builds con `PUBLIC_SHOW_PROTOTYPES=true` (seteada solo
en el entorno Preview de Vercel — los deploys de ramas las muestran); producción
muestra únicamente la variante A. Los formularios de las variantes son
ilustrativos (no envían nada).

**Próximo paso:** elegir paleta ganadora → absorberla como diseño real de la
homepage y borrar este directorio junto con los bloques de prototipo en
`index.astro`.
