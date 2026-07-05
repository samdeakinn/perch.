# perch. website redesign — the observatory

**date**: 2026-07-05
**status**: approved
**approach**: approach 1 — the observatory

## overview

a complete visual redesign of the perch. website. preserves the existing identity (dark mode, lowercase copy, anti-fintech-bro voice, amber accent, serif+sans pairing) but elevates every visual layer — design tokens, typography, motion, components, and page layouts — into a cohesive, cinematic, editorial, and interactive experience. the observatory metaphor: your financial life seen through a precision instrument, with reverence and clarity.

conversion goal: join the waitlist.
experience goal: leave an impression.

## design system

### palette

```
--obsidian:     #060a08        background — deeper than current, near-ink
--graphite:     #0c1110        elevated surfaces
--slate:        #141a18        cards, panels
--mist:         rgba(255,255,255,0.04)    hairline borders
--fog:          rgba(255,255,255,0.08)    stronger borders
--paper:        #e8e4dd        text primary — warm, not clinical white
--pencil:       #9da39f        secondary text
--dust:         #5c645f        faint/meta text
--ember:        #d4984a        primary accent — amber-gold at page top
--rose-gold:    #c48255        secondary accent — shifts in as you scroll
--sage:         #5c8f78        success/verdict color
--ember-soft:   rgba(212,152,74,0.10)    accent backgrounds
```

the accent shifts from `--ember` to `--rose-gold` via a gradient timeline:
- hero: pure amber
- halfway down page: 50/50 blend
- footer: pure rose-gold

set via css custom properties that update with scroll position.

### light mode
light mode is retained but simplified. the observatory aesthetic is dark-first; light mode inverts the palette (paper background, obsidian text) and disables the scroll-driven accent shift (accent stays ember throughout). the lens cursor is disabled in light mode. the gravitational scroll and section handoffs remain active. this avoids the full 30+ token parity of the current implementation while keeping the toggle functional.

### typography

| Role | Family | Usage |
|------|--------|-------|
| display | playfair display (google fonts) | hero headings, section anchors. 4 uses max per page |
| body serif | source serif 4 (google fonts) | editorial content, section headings |
| ui sans | inter (already loaded) | buttons, labels, nav, data |
| mono | jetbrains mono (google fonts) | numbers, data, timestamps |

**scale** (viewport-responsive):
```
--text-hero:    clamp(52px, 7vw, 88px)     hero heading
--text-section: clamp(30px, 4vw, 56px)     section headings
--text-body:    15px                       body copy
--text-meta:    12px                       meta/labels
```

all visible text on the site uses lowercase. "perch." uses the period as the only sentence-ending punctuation outside body copy.

### spacing
- section padding: 140px vertical
- side margins: 100px on desktop, 24px on mobile
- max content width: 960px (single column focused)

### motion language
- **gravitational scroll**: sections descend with `translateY(40px)` + `cubic-bezier(0.16,1,0.3,1)` over 1.2s
- **lens cursor**: 60px radial gradient at cursor position, `backdrop-filter: brightness(1.35)`, reveals brighter text beneath. shrinks to 8px amber dot over interactive elements
- **section handoffs**: 200ms overlap between exiting and entering sections
- **reduced motion**: all degrades to instant, no-animation presentation

## global components

### navigation
- **desktop**: floating text links, no background. on scroll, frosted panel descends (`backdrop-filter: blur(30px)`, `rgba(6,10,8,0.75)`). logo is display serif at 22px. active link gets thin amber underline that extends on hover with 300ms spring. no pill backgrounds
- **mobile**: hamburger opens full-screen panel sliding up from bottom. links centered, large, generous spacing. close is × in top-right
- **links**: problem, how it works, demo, app, pricing, blog (6 links)

### buttons
- **primary (cta)**: pill (`border-radius: 999px`), `padding: 16px 32px`, background gradient from ember with subtle rose-gold shift on hover. 2px inset highlight on top edge. `font-weight: 500`. hover: lifts 2px with deeper shadow
- **secondary**: text-only with subtle underline that extends from center on hover. no border, no background. accent color underline
- **tertiary (ghost)**: `padding: 10px 20px`, transparent, `border: 1px solid --fog`. hover: border shifts to accent, background fills with `--ember-soft`

### cards
- no border-radius. no box-shadow
- defined by 1px hairline border (`--mist`) + `--slate` background + 28px internal padding
- hover: lifts 2px + border brightens to `--fog`. no shadow — purely `translateY` + border change
- ledger treatment — clean, precise, archival

### footer
- three-column grid: logo + tagline (left), primary links (center), social + legal (right)
- separated by single 1px horizontal rule (`--mist`)
- tagline: "track what renews. decide what stays." in body serif
- links: 12px ui sans, `--dust`, brighten to `--pencil` on hover

### lens cursor
- hidden on touch devices
- 60px diameter div, `backdrop-filter: brightness(1.35) contrast(1.05)`, masked by `clip-path: circle()` following cursor
- only activates over text content. over buttons/cards/nav: shrinks to 8px amber dot
- trails with lerp(`0.08`) for liquid feel

## page layouts

### index.ejs

**hero**: centered single column (720px max). eyebrow + display serif headline (88px max) + body-paragraph subhead (17px) + inline waitlist form + microcopy (11px). no 3d scene, no cards. ambient background: css radial gradient simulating reading lamp at center-top of viewport, fading to obsidian at edges.

**sections** (4, centered single column, 720px max):
1. the cost — single massive stat (`£4bn` at 120px mono), context sentence, two secondary stats (`£560m`, `47%`) at 48px side by side. no cards. just numbers and prose
2. how it works — four horizontal steps (01, 02, 03, 04) in mono face, each a single sentence. hairline divider between. minimal, editorial
3. what it tracks — four categories in 2x2 grid of compact cards. each: icon, name, one sentence, one stat. hairline borders
4. proof — two testimonials, large pull-quote style, centered. body serif at 18px quote. 12px dust attribution. auto-rotating

**pricing**: inline within scroll. three compact cards in row. tier name, price, 3-4 bullets, cta. popular card gets 2px accent border instead of elevation. no shadows, no pill badges

**final cta**: centered single column. heading + email input + button + microcopy. accent is fully rose-gold at this scroll depth

### demo.ejs + app.ejs

shed macos window frames. content renders directly in page — no frame, no titlebar traffic lights. scanning animation becomes centered ambient ring with text beneath. items slide in with gravitational ease. app add panel becomes full-width section with subtle border top. item cards become ledger-style. verdict tag is only colored element. calendar and digest views inherit same treatment.

### content pages (all 18)

single editorial template:
- **header**: centered, narrow column (600px). eyebrow + display serif heading + single body paragraph. 120px top padding
- **body**: generous side margins (100px desktop, 24px mobile). max-width 680px for prose, wider for grids. hairline dividers between sections. body serif at 15px, 1.7 line-height. subheadings in body serif at 20px
- **cards**: ledger treatment throughout — no radius, hairline borders, hover lift, icon as only colored element
- **blog articles**: narrow measure (600px), body serif 16px, generous leading. display serif title + mono date + dust read time. single hairline rule between header and body. related articles in ledger cards
- **changelog**: timeline — date badge (mono, accent) on left, entry on right. hairline rules between entries. no card wrappers
- **comparison**: ledger table — alternating `--slate` / transparent rows, hairline dividers, sage checkmarks, dust crosses
- **pricing page**: expanded three-column cards + comparison table + expandable faq accordions

### special pages

**waitlist**: two-column. left: heading + description + trust badges. right: form (name, email, segment selector as inline chips). no steps, no carousel

**download**: centered column. display serif heading + single download button (primary style) + version/date/size in mono face + 3 instructional steps

**404**: centered, sparse. display serif "this page doesn't exist." + "return home" link. amber-to-rose-gold gradient background

## technical architecture

### what gets replaced
- `style.css`: full rewrite — new design tokens, ledger cards, hairline borders, shifting accent, gravitational motion
- `motion.js`: rewrite — gravitational scroll engine, lens cursor, section handoff transitions
- `hero-scene.js`: deleted. hero uses pure css
- `particles.js`: deleted
- fonts: inter + playfair display + source serif 4 + jetbrains mono (all google fonts cdn)

### what stays
- `server.js`: zero changes. all 25 routes, 5 api endpoints, articles array, waitlist logic
- `public/app.js`: parsing engine, localstorage crud, calendar, digest. only css class names update
- `public/demo.js`: scanning animation, item reveal, tab switching. only css class names update
- all blog article snippets (`views/articles/*.ejs`): content unchanged, inherit new typography
- all inline page logic: waitlist form js, pricing toggle, dashboard auth gate, theme toggle — untouched

### build order
1. foundation: `style.css` (tokens, typography, spacing, motion) + `head.ejs` (new fonts) + `motion.js` (gravitational scroll, lens cursor)
2. shell: `nav.ejs` + nav css + `footer.ejs` + footer css + `newsletter-cta.ejs`
3. index: `index.ejs` (hero, sections, inline pricing, final cta) + hero css
4. demo + app: `demo.ejs` + `app.ejs` (unframed, ledger items/cards)
5. content pages: one editorial pass for all 18 templates
6. special pages: `waitlist.ejs` + `download.ejs` + `404.ejs`
7. cleanup: delete `hero-scene.js`, `particles.js`, remove old css rules

### files
- modified: ~22 template files, 2 js files, 1 css file, 1 head partial
- created: 0
- deleted: 2 (`hero-scene.js`, `particles.js`)
- untouched: `server.js`, `app.js` (logic), `demo.js` (logic), 11 blog snippets

## implementation notes
- all visible text lowercase throughout
- dark mode is primary; light mode available via toggle with simplified palette
- reduced motion respected at every animation layer
- touch devices: lens cursor disabled, gravitational scroll becomes instant
- google fonts loaded async via existing font-loading pattern in `head.ejs`
- existing `var(--accent)` etc tokens renamed to new palette names; all component css that references old tokens will reference new ones
- the 3d hero scene (`hero-scene.js`) and particle canvas (`particles.js`) are removed entirely — the hero is pure css typography with ambient gradient
- accent shift mechanism: `motion.js` reads `window.scrollY` and sets a `--scroll-pct` css variable (0.0 to 1.0). css uses `color-mix(in srgb, var(--ember) calc(100% - var(--scroll-pct) * 100%), var(--rose-gold) calc(var(--scroll-pct) * 100%))` to interpolate the accent across the page
