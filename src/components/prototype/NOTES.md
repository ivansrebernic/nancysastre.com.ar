# Prototipo — rediseño de la homepage

**Pregunta:** ¿Qué estética/estructura debería tener la homepage rediseñada,
manteniendo el embudo de Nancy (hero → videos corporativos → historia compacta →
galería → video 1 min → formulario)?

**Veredicto final (2026-06-12):** ganó **C2 — Bosque Serif**. El camino:
1. De 8 direcciones (Editorial, Cinemático, Minimal, Orgánica, Brutalista, Lujo,
   Aurora + el actual), Nancy eligió la estructura **Cinemática**.
2. De 4 paletas sobre esa estructura, eligió los **verdes "Bosque"** (salvia
   #eef1e9, bosque #182c21/#2e5e41, lima #9bc53d) — se unificó la familia.
3. De 4 tipografías/caracteres, eligió **Bosque Serif**: display Fraunces con
   acentos en itálica verde, cuerpo Albert Sans, esquinas redondeadas.

Titular del hero: "Construye un negocio inteligente / en la industria del
bienestar" (el mismo de producción). Hero con foto a plena opacidad, scrim
lateral izquierdo (Nancy a la derecha queda limpia), stats debajo del hero,
mobile con recorte a la derecha + scrim inferior.

**Cómo probar:** `npm run dev` → barra flotante o `?variant=A|C2`.
Preview pública: rama `prototype/cinematic` en Vercel (gate
`PUBLIC_SHOW_PROTOTYPES=true`, solo entorno Preview).

**Próximo paso:** absorber C2 como diseño real de la homepage — reescribirla
como secciones de producción (el prototipo se escribió sin tests ni manejo de
errores), conectar el formulario real (FormSubmit), Header/Footer/FAQ/Blog,
y borrar este directorio + los bloques de prototipo en `index.astro`.
