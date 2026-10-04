document.addEventListener('DOMContentLoaded', () => {

    // --- SCROLL PROGRESS BAR ---
    const progressBar = document.querySelector('.scroll-progress-bar');
    const updateProgress = () => {
        const total = document.documentElement.scrollHeight - window.innerHeight;
        if (progressBar && total > 0) {
            progressBar.style.width = (window.scrollY / total * 100) + '%';
        }
    };
    window.addEventListener('scroll', updateProgress, { passive: true });

    // --- THEME TOGGLE ---
    const themeBtn  = document.getElementById('theme-toggle');
    const htmlEl    = document.documentElement;

    const applyTheme = (theme) => {
        htmlEl.setAttribute('data-theme', theme);
        try { localStorage.setItem('theme', theme); } catch (e) { /* storage unavailable */ }
    };

    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch (e) { /* storage unavailable */ }
    applyTheme(saved || 'dark');

    themeBtn.addEventListener('click', () => {
        applyTheme(htmlEl.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    // --- MOBILE MENU ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks  = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('open');
        navLinks.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('open');
            navLinks.classList.remove('active');
        });
    });

    // --- HEADER AUTO-HIDE ON SCROLL ---
    const header = document.querySelector('.header');
    let lastY = 0;
    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y > lastY && y > header.offsetHeight) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        lastY = y < 0 ? 0 : y;
    }, { passive: true });

    // --- TYPEWRITER ---
    const el = document.querySelector('.typewriter');
    if (el) {
        const fallbackTexts = [
            'Full-Stack Developer.',
            'Android Developer.',
            'Problem Çözücüyüm.'
        ];
        // Texts come from i18n.js for the active language (TR / EN)
        const getTexts = () => {
            const list = window.SiteI18n && window.SiteI18n.t('typewriter');
            return Array.isArray(list) && list.length ? list : fallbackTexts;
        };
        let texts = getTexts();
        let ti = 0, ci = 0, erasing = false;

        // On language change restart typing with the new texts
        document.addEventListener('langchange', () => {
            texts = getTexts();
            ti = 0; ci = 0; erasing = false;
            el.textContent = '';
        });

        const tick = () => {
            if (ti >= texts.length) ti = 0;
            const text = texts[ti];
            if (!erasing) {
                el.textContent = text.slice(0, ++ci);
                if (ci === text.length) { erasing = true; setTimeout(tick, 2000); return; }
                setTimeout(tick, 75);
            } else {
                el.textContent = text.slice(0, --ci);
                if (ci === 0) {
                    erasing = false;
                    ti = (ti + 1) % texts.length;
                    setTimeout(tick, 380);
                    return;
                }
                setTimeout(tick, 38);
            }
        };
        tick();
    }

    // --- BACK TO TOP ---
    const btt = document.querySelector('.back-to-top');
    if (btt) {
        window.addEventListener('scroll', () => {
            btt.classList.toggle('visible', window.scrollY > 320);
        }, { passive: true });
        btt.addEventListener('click', e => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- SCROLL SPY ---
    const sections  = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    const spy = () => {
        let current = '';
        sections.forEach(s => {
            if (window.scrollY >= s.offsetTop - header.offsetHeight - 60) {
                current = s.id;
            }
        });
        navAnchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
        });
    };
    window.addEventListener('scroll', spy, { passive: true });
    spy();

    // --- GSAP ANIMATIONS ---
    gsap.registerPlugin(ScrollTrigger);

    // Hero entrance — staggered from bottom
    gsap.from([
        '.hero-badge',
        '.hero-greeting',
        '.hero-name',
        '.hero-role',
        '.hero-bio',
        '.hero-cta',
        '.hero-socials'
    ], {
        y: 36,
        opacity: 0,
        duration: 0.85,
        stagger: 0.11,
        ease: 'power3.out',
        delay: 0.15
    });

    gsap.from('.stat-card', {
        x: 32,
        opacity: 0,
        duration: 0.75,
        stagger: 0.12,
        ease: 'power3.out',
        delay: 0.5
    });

    // Scroll-triggered reveals
    const revealTargets = [
        '.section-header',
        '.about-photo-wrap',
        '.about-body',
        '.timeline-item',
        '.skill-category',
        '.lang-item',
        '.project-card',
        '.projects-more',
        '.contact-box'
    ];

    revealTargets.forEach(selector => {
        gsap.utils.toArray(selector).forEach(el => {
            gsap.from(el, {
                y: 40,
                opacity: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            });
        });
    });

    // Text length changes with the language -> recalculate trigger positions
    document.addEventListener('langchange', () => {
        requestAnimationFrame(() => ScrollTrigger.refresh());
        spy();
    });

});
