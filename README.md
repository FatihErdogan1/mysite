# Fatih Erdoğan — Personal Portfolio

Source code of my personal portfolio website, live at **[fatiherdogan.live](https://fatiherdogan.live)**.
A single-page site (Turkish / English) built from scratch with plain HTML, CSS and JavaScript, using GSAP for animations.

## Features

- Single-page layout: hero, about, education & experience timeline, skills, projects and contact sections
- TR / EN language switch — Turkish by default, the choice is remembered in `localStorage`; `?lang=en` or `?lang=tr` in the URL overrides it
- Dark / light theme toggle — dark by default, the choice is remembered in `localStorage`
- Entrance and scroll-reveal animations with GSAP + ScrollTrigger
- Typewriter effect in the hero section
- Scroll progress bar, auto-hiding header and scroll-spy navigation highlighting
- "Back to top" button with smooth scrolling
- Responsive design with a mobile hamburger menu (breakpoints at 992 / 768 / 480 px)
- Theme colors, radii and fonts defined as CSS custom properties

## Tech Stack

- HTML5, CSS3 (custom properties, media queries)
- Vanilla JavaScript (ES6+)
- [GSAP 3.12](https://gsap.com/) + ScrollTrigger (loaded from cdnjs)
- Font Awesome 6, Google Fonts (Space Grotesk, Inter)

## Project Structure

```
index.html      # page markup (all sections)
style.css       # styles, dark/light theme variables, responsive rules
script.js       # theme toggle, mobile menu, typewriter, scroll effects, GSAP animations
i18n.js         # TR / EN switch: English strings + language logic (Turkish lives in index.html)
*.jpg / *.png   # profile photo and logos
fatihcv.pdf     # CV
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
