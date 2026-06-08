# nancysastre.com.ar

Marketing site for Nancy Sastre, an independent Fuxion distributor in Argentina. The homepage is being rebuilt from a store+recruit hybrid into a single-purpose recruitment funnel (see [ADR-0001](docs/adr/0001-homepage-as-recruitment-funnel.md)).

## Language

**Recruitment Funnel**:
The homepage (`src/pages/index.astro`), rebuilt as a single-goal lead-capture landing aimed at prospective business partners. It does not sell product.
_Avoid_: Landing page (too generic), store, catalog.

**Microfranquicia Digital**:
Nancy's canonical framing of the Fuxion opportunity — a low-investment, leveraged, dropshipping-backed (37 countries) network-marketing model with weekly commission payouts.
_Avoid_: MLM, "Únete al equipo" framing, multinivel.

**Entrevista personalizada**:
The funnel's single conversion goal — a 1:1 call Nancy books with qualified leads who complete the form. Framed with scarcity ("cupo medido de incorporaciones mensuales").
_Avoid_: Consulta, demo, meeting.

**El Vehículo Comercial**:
The landing section presenting two institutional videos — a product video and a corporate-backing video — before Nancy's personal pitch.

**Qualifying form**:
The funnel's lead-capture form. Captures name, email, WhatsApp, país de residencia, plus three diagnostic multiple-choice questions: perfil, tiempo semanal disponible, objetivo principal. Submits to FormSubmit (email to nancysastre@gmail.com) with all fields included.
_Avoid_: Contact form (it is no longer a generic contact form).

## Relationships

- A **Recruitment Funnel** drives the visitor to complete one **Qualifying form**.
- A completed **Qualifying form** is how a lead requests an **Entrevista personalizada**.
- The **Microfranquicia Digital** is the offer; the **Entrevista personalizada** is the only call-to-action on the page.

## Site map after the rebuild

- `/` — the **Recruitment Funnel** (rebuilt).
- `/blog` — kept (live and linked).
- `/productos` — removed entirely (catalog + `[id]` routes deleted; all links to it dropped).
- `/bienvenido/[token]` — member welcome flow, untouched (out of scope).

## Build decisions (this rebuild)

- **Videos**: all four (product, corporate, Nancy's 1-min personal, business presentation) built as swappable placeholders — no YouTube IDs available yet.
- **Nancy photo**: placeholder for now; the existing Ivan photo (`ivan-4.png`) is removed from the story block.
- **Copy fidelity**: COPY.md lines 445–560 reproduced verbatim, fixing only clear typos. Figures normalized to 37 countries where the funnel sections already use it.
- **Sections dropped from homepage**: MedicalEndorsements, Dr. La Rosa, Dr. Arrieta.
- **Sections kept**: TrustIndicators, About (Fuxion company), Blog teaser, JoinTeamModal (left wired as a secondary trigger).

## Flagged ambiguities

- The repo is forked from an "Ivan" site: `ivan-*` images and a "desarrollador de software" FAQ answer describe a different person. Resolved: this is Nancy's site — all first-person identity is Nancy; Ivan assets are removed or replaced as surviving sections are touched.
- Dropshipping country count appears as 16/31/34/37 across COPY.md. Resolved: the funnel uses **37**.

## Operative spec

Actionable page changes live in **COPY.md lines 445–560**. Lines 1–444 are raw marketing material (audience-specific pitches, WhatsApp scripts, powerlinks, print-folder spec) — reference only.
