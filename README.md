# Fatih Erdoğan — Personal Portfolio

Source code of my personal portfolio website, live at **[fatiherdogan.live](https://fatiherdogan.live)**.
A single-page portfolio (Turkish / English) built from scratch with plain HTML, CSS and JavaScript, using GSAP for animations, plus a Turkish tutoring page for parents at [/ders/](https://fatiherdogan.live/ders/).

## Features

- Brand identity from the personal logo (`assets/brand/`): navy, teal and antique-gold palette; dark navy theme and ivory light theme (circular View Transition reveal); Fraunces / Manrope / JetBrains Mono (self-hosted, subset to Latin + Turkish)
- Logo text is outlined to SVG paths (Alex Brush + Manrope, both OFL) so it renders identically everywhere; variants for light/dark backgrounds, a compact header mark and a favicon set
- Logo motifs in motion: stroke-drawn logo in the hero, tulip motif in the loader, circuit-trace section connectors and underline-with-node headings
- Intro preloader (once per session), animated constellation canvas, drifting aura and grain
- Magnetic buttons, custom cursor (desktop only), 3D tilt + pointer spotlight on cards
- Scroll-triggered reveals, animated counters, scroll-scrubbed timeline progress line, velocity-reactive marquee
- Pinned horizontal project showcase on large screens (stacked cards on mobile)
- Lenis smooth scrolling on desktop; `prefers-reduced-motion` turns heavy motion off; no cursor/magnetic effects on touch devices
- TR / EN language switch — Turkish by default, the choice is remembered in `localStorage`; `?lang=en` or `?lang=tr` in the URL overrides it
- `/ders/` — mobile-first tutoring page (Turkish) with WhatsApp contact and a sticky WhatsApp button
- `/ders/ilan.pdf` — printable A4 flyer with a QR code to `/ders/` (source: `ders/ilan.html`)

## Tech Stack

- HTML5, CSS3 (custom properties, media queries), vanilla JavaScript
- [GSAP 3](https://gsap.com/) + ScrollTrigger and [Lenis](https://lenis.darkroom.engineering/) (vendored in `assets/vendor/`)
- Icons: Font Awesome Free SVG paths, inlined as a sprite

## Project Structure

```
index.html        # portfolio markup (all sections)
style.css         # portfolio styles, dark/light design tokens, responsive rules
script.js         # motion & interactions (GSAP, ScrollTrigger, Lenis, cursor, canvas)
i18n.js           # TR / EN switch: English strings + language logic (Turkish lives in index.html)
ders/             # tutoring page (index.html, ders.css, ders.js), flyer (ilan.html / ilan.pdf), qr.svg, og.jpg
assets/brand/     # logo (outlined SVG variants + logo-original.svg), favicons / app icons
assets/fonts/     # self-hosted woff2 fonts
assets/img/       # optimized photo variants (webp / jpg)
assets/vendor/    # gsap, ScrollTrigger, lenis
*.jpg / *.png     # profile photo and logos
fatihcv.pdf       # CV
```

## Running Locally

There is no build step. Open `index.html` in a browser, or serve the folder with any static file server, for example:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Contact

- Website: [fatiherdogan.live](https://fatiherdogan.live)
- LinkedIn: [Fatih Erdoğan](https://www.linkedin.com/in/fatih-erdo%C4%9Fan-381b86311/)
- GitHub: [@FatihErdogan1](https://github.com/FatihErdogan1)

---

**Author:** Fatih Erdoğan
