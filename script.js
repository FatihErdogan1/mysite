/* =====================================================================
   Fatih Erdoğan — Portfolio interactions
   GSAP + ScrollTrigger (motion), Lenis (smooth wheel scrolling on desktop).
   Everything degrades: no GSAP -> static page; reduced motion -> no heavy motion;
   touch devices -> no custom cursor / magnetic / tilt effects.
   ===================================================================== */
(function () {
    'use strict';

    var root = document.documentElement;
    var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    var reduced = mqReduce.matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    var lenis = null;

    function $(s, c) { return (c || document).querySelector(s); }
    function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
    function ready() { root.classList.remove('is-loading'); }

    /* ---------------- Theme (with circular View Transition) ---------------- */
    var themeBtn = $('#theme-toggle');
    var metaTheme = $('meta[name="theme-color"]');
    function applyTheme(theme) {
        root.setAttribute('data-theme', theme);
        if (metaTheme) metaTheme.setAttribute('content', theme === 'light' ? '#f7f3ea' : '#0c1524');
        try { localStorage.setItem('theme', theme); } catch (e) { /* storage unavailable */ }
        document.dispatchEvent(new CustomEvent('themechange'));
    }
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    if (themeBtn) {
        themeBtn.addEventListener('click', function (e) {
            var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
            if (!document.startViewTransition || reduced) { applyTheme(next); return; }
            var r = themeBtn.getBoundingClientRect();
            var x = e.clientX || r.left + r.width / 2;
            var y = e.clientY || r.top + r.height / 2;
            var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
            var vt = document.startViewTransition(function () { applyTheme(next); });
            vt.ready.then(function () {
                root.animate(
                    { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
                    { duration: 750, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' }
                );
            }).catch(function () {});
        });
    }

    /* ---------------- Mobile menu ---------------- */
    var menuBtn = $('.menu-btn');
    var menu = $('#mobile-menu');
    var menuOpen = false;
    function setMenu(open) {
        if (!menu || !menuBtn) return;
        menuOpen = open;
        menu.classList.toggle('is-open', open);
        menu.setAttribute('aria-hidden', open ? 'false' : 'true');
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        root.classList.toggle('menu-open', open);
        document.body.style.overflow = open ? 'hidden' : '';
        if (lenis) { open ? lenis.stop() : lenis.start(); }
        $$('a', menu).forEach(function (a) { a.tabIndex = open ? 0 : -1; });
        if (open) { var first = $('a', menu); if (first) setTimeout(function () { first.focus({ preventScroll: true }); }, 350); }
    }
    if (menuBtn) {
        $$('a', menu).forEach(function (a) { a.tabIndex = -1; });
        menuBtn.addEventListener('click', function () { setMenu(!menuOpen); });
        document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && menuOpen) { setMenu(false); menuBtn.focus(); } });
        window.addEventListener('resize', function () { if (menuOpen && innerWidth > 1100) setMenu(false); });
    }

    /* ---------------- Header, progress bar, back-to-top ---------------- */
    var header = $('.header');
    var progress = $('.scroll-progress span');
    var btt = $('.back-to-top');
    var lastY = window.scrollY;
    var ticking = false;
    function onScroll() {
        var y = window.scrollY;
        var max = document.documentElement.scrollHeight - innerHeight;
        if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
        if (header) {
            header.classList.toggle('is-scrolled', y > 24);
            header.classList.toggle('is-hidden', !menuOpen && y > lastY && y > 400);
        }
        if (btt) btt.classList.toggle('is-visible', y > 700);
        lastY = y;
        ticking = false;
    }
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();

    /* ---------------- Anchor links (Lenis-aware) ---------------- */
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[href^="#"]');
        if (!a) return;
        var id = a.getAttribute('href');
        if (!id || id.length < 2) return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        if (menuOpen) setMenu(false);
        if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
        else target.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' });
        if (id === '#main' || id === '#home') { /* keep URL clean */ }
        else try { history.replaceState(null, '', id); } catch (err) { /* ignore */ }
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
    });

    /* ---------------- Typewriter (texts from i18n.js) ---------------- */
    (function typewriter() {
        var el = $('.typewriter');
        if (!el) return;
        var fallback = ['Full-Stack Developer.', 'Android Developer.', 'Problem Çözücüyüm.'];
        function texts() {
            var list = window.SiteI18n && window.SiteI18n.t('typewriter');
            return Array.isArray(list) && list.length ? list : fallback;
        }
        var list = texts(), ti = 0, ci = 0, erasing = false, timer = null;
        function tick() {
            if (ti >= list.length) ti = 0;
            var text = list[ti];
            if (reduced) {
                el.textContent = text;
                ti = (ti + 1) % list.length;
                timer = setTimeout(tick, 3200);
                return;
            }
            if (!erasing) {
                el.textContent = text.slice(0, ++ci);
                if (ci === text.length) { erasing = true; timer = setTimeout(tick, 2100); return; }
                timer = setTimeout(tick, 70);
            } else {
                el.textContent = text.slice(0, --ci);
                if (ci === 0) { erasing = false; ti = (ti + 1) % list.length; timer = setTimeout(tick, 380); return; }
                timer = setTimeout(tick, 34);
            }
        }
        document.addEventListener('langchange', function () {
            clearTimeout(timer); list = texts(); ti = 0; ci = 0; erasing = false; el.textContent = ''; tick();
        });
        el.textContent = '';
        timer = setTimeout(tick, reduced ? 0 : 900);
    })();

    /* ---------------- Hero canvas: drifting constellation ---------------- */
    var canvasCtl = (function heroCanvas() {
        var canvas = $('.hero__canvas');
        if (!canvas || !canvas.getContext) return null;
        var ctx = canvas.getContext('2d');
        var dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        var w = 0, h = 0, pts = [], color = '60,196,178', gold = '211,172,110', running = false, visible = true, raf = 0;
        var mouse = { x: -9999, y: -9999 };

        function rgb(name, fallback) {
            var hex = getComputedStyle(root).getPropertyValue(name).trim();
            var m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return m ? parseInt(m[1], 16) + ',' + parseInt(m[2], 16) + ',' + parseInt(m[3], 16) : fallback;
        }
        function readColor() { color = rgb('--teal', color); gold = rgb('--accent', gold); }
        function resize() {
            var r = canvas.getBoundingClientRect();
            w = r.width; h = r.height;
            canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            var n = Math.max(18, Math.min(72, Math.round(w * h / 17000)));
            pts = [];
            for (var i = 0; i < n; i++) {
                pts.push({ x: Math.random() * w, y: Math.random() * h, vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28, r: Math.random() * 1.6 + 0.5 });
            }
            if (!running) draw(false);
        }
        function draw(move) {
            ctx.clearRect(0, 0, w, h);
            var link = Math.min(140, w / 8), i, j, p, q, dx, dy, d;
            for (i = 0; i < pts.length; i++) {
                p = pts[i];
                if (move) {
                    p.x += p.vx; p.y += p.vy;
                    if (p.x < -20) p.x = w + 20; else if (p.x > w + 20) p.x = -20;
                    if (p.y < -20) p.y = h + 20; else if (p.y > h + 20) p.y = -20;
                    dx = mouse.x - p.x; dy = mouse.y - p.y; d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 180) { p.x -= dx * 0.004; p.y -= dy * 0.004; }
                }
                for (j = i + 1; j < pts.length; j++) {
                    q = pts[j]; dx = p.x - q.x; dy = p.y - q.y; d = dx * dx + dy * dy;
                    if (d < link * link) {
                        ctx.strokeStyle = 'rgba(' + color + ',' + (0.16 * (1 - Math.sqrt(d) / link)).toFixed(3) + ')';
                        ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
                    }
                }
                dx = mouse.x - p.x; dy = mouse.y - p.y; d = Math.sqrt(dx * dx + dy * dy);
                if (d < 200) {
                    ctx.strokeStyle = 'rgba(' + color + ',' + (0.35 * (1 - d / 200)).toFixed(3) + ')';
                    ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
                }
                ctx.fillStyle = 'rgba(' + (i % 3 === 0 ? gold : color) + ',' + (i % 3 === 0 ? '0.9' : '0.7') + ')';
                ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
            }
        }
        function loop() { if (!running) return; draw(true); raf = requestAnimationFrame(loop); }
        function update() {
            var should = visible && !document.hidden && !reduced;
            if (should && !running) { running = true; raf = requestAnimationFrame(loop); }
            else if (!should && running) { running = false; cancelAnimationFrame(raf); }
        }
        readColor(); resize();
        window.addEventListener('resize', function () { clearTimeout(canvas._rt); canvas._rt = setTimeout(resize, 150); });
        document.addEventListener('visibilitychange', update);
        document.addEventListener('themechange', function () { readColor(); if (!running) draw(false); });
        if (finePointer) {
            canvas.parentElement.addEventListener('mousemove', function (e) { var r = canvas.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
            canvas.parentElement.addEventListener('mouseleave', function () { mouse.x = mouse.y = -9999; });
        }
        if ('IntersectionObserver' in window) {
            new IntersectionObserver(function (en) { visible = en[0].isIntersecting; update(); }).observe(canvas);
        }
        return { start: update };
    })();

    /* ---------------- Spotlight cards (pointer-following glow) ---------------- */
    if (finePointer) {
        $$('.spot').forEach(function (card) {
            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
                card.style.setProperty('--my', (e.clientY - r.top) + 'px');
            });
        });
    }

    /* ---------------- No GSAP? Show everything and stop here. ---------------- */
    if (!hasGsap) {
        root.classList.add('no-anim');
        ready();
        root.classList.remove('show-preloader');
        if (canvasCtl) canvasCtl.start();
        return;
    }

    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    /* ---------------- Lenis smooth scrolling (desktop, motion allowed) ---------------- */
    if (!reduced && finePointer && typeof window.Lenis !== 'undefined') {
        lenis = new window.Lenis({ lerp: 0.11, wheelMultiplier: 1 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        gsap.ticker.lagSmoothing(0);
    }

    /* ---------------- Custom cursor ---------------- */
    if (finePointer && !reduced) {
        var cursor = $('.cursor');
        var dot = $('.cursor__dot'), ring = $('.cursor__ring');
        root.classList.add('has-cursor');
        var dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' }), dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
        var rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
        gsap.set([dot, ring], { x: innerWidth / 2, y: innerHeight / 2 });
        cursor.classList.add('is-hidden');
        window.addEventListener('pointermove', function (e) {
            if (e.pointerType && e.pointerType !== 'mouse') return;
            cursor.classList.remove('is-hidden');
            dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
        }, { passive: true });
        document.addEventListener('mouseleave', function () { cursor.classList.add('is-hidden'); });
        window.addEventListener('pointerdown', function () { cursor.classList.add('is-down'); });
        window.addEventListener('pointerup', function () { cursor.classList.remove('is-down'); });
        document.addEventListener('pointerover', function (e) {
            var t = e.target.closest ? e.target : null;
            if (!t) return;
            cursor.classList.toggle('is-hover', !!t.closest('a, button, [data-tilt], .magnetic'));
            cursor.classList.toggle('is-text', !t.closest('a, button') && !!t.closest('p, h1, h2, h3') && !t.closest('[data-tilt], .tutor-card'));
        });
    }

    /* ---------------- Magnetic elements & 3D tilt ---------------- */
    if (finePointer && !reduced) {
        $$('.magnetic').forEach(function (el) {
            var strength = parseFloat(el.getAttribute('data-strength')) || 0.35;
            el.addEventListener('pointermove', function (e) {
                var r = el.getBoundingClientRect();
                gsap.to(el, { x: (e.clientX - (r.left + r.width / 2)) * strength, y: (e.clientY - (r.top + r.height / 2)) * strength, duration: 0.6, ease: 'power3.out', overwrite: 'auto' });
            });
            el.addEventListener('pointerleave', function () {
                gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' });
            });
        });
        $$('[data-tilt]').forEach(function (card) {
            gsap.set(card, { transformPerspective: 1000 });
            var rxTo = gsap.quickTo(card, 'rotationX', { duration: 0.5, ease: 'power3' }), ryTo = gsap.quickTo(card, 'rotationY', { duration: 0.5, ease: 'power3' });
            card.addEventListener('pointermove', function (e) {
                var r = card.getBoundingClientRect();
                var px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
                ryTo(px * 9); rxTo(-py * 9);
            });
            card.addEventListener('pointerleave', function () { rxTo(0); ryTo(0); });
        });
    }

    /* ---------------- Counters ---------------- */
    function runCounters() {
        $$('[data-count]').forEach(function (el) {
            if (reduced) return;
            var to = parseFloat(el.getAttribute('data-count'));
            var from = parseFloat(el.getAttribute('data-from') || '0');
            var dec = parseInt(el.getAttribute('data-decimals') || '0', 10);
            var pre = el.getAttribute('data-prefix') || '', suf = el.getAttribute('data-suffix') || '';
            var o = { v: from };
            gsap.to(o, {
                v: to, duration: 2, ease: 'power3.out',
                onUpdate: function () { el.textContent = pre + (dec ? o.v.toFixed(dec) : Math.round(o.v)) + suf; },
                onComplete: function () { el.textContent = pre + (dec ? to.toFixed(dec) : to) + suf; }
            });
        });
    }

    /* ---------------- Intro: preloader -> hero reveal ---------------- */
    /* Stroke-draw an inline logo / motif SVG. Returns a timeline. */
    function drawSvg(svg, opts) {
        opts = opts || {};
        var tl = gsap.timeline({ paused: !!opts.paused });
        if (!svg) return tl;
        var strokes = [];
        $$('.lg-draw', svg).forEach(function (el) {
            (el.tagName.toLowerCase() === 'path' ? [el] : $$('path', el)).forEach(function (p) { strokes.push(p); });
        });
        strokes.forEach(function (p) {
            var len = p.getTotalLength ? p.getTotalLength() : 0;
            gsap.set(p, { strokeDasharray: len + 1, strokeDashoffset: len + 1 });
        });
        var pops = [];
        $$('.lg-pop', svg).forEach(function (el) { (el.tagName.toLowerCase() === 'circle' ? [el] : $$('circle', el)).forEach(function (c) { pops.push(c); }); });
        var reveal = $('.lg-reveal', svg), name = $('.lg-name', svg), sub = $('.lg-sub', svg);
        tl.to(strokes, { strokeDashoffset: 0, duration: opts.drawDur || 1.4, ease: 'power2.inOut', stagger: 0.06 }, 0)
          .from(pops, { scale: 0, transformOrigin: '50% 50%', duration: 0.6, ease: 'back.out(3)', stagger: 0.04 }, (opts.drawDur || 1.4) * 0.45);
        if (reveal) tl.fromTo(reveal, { attr: { width: 0 } }, { attr: { width: 560 }, duration: 1.5, ease: 'power2.inOut' }, 0.25);
        else if (name) tl.from(name, { autoAlpha: 0, duration: 1.2, ease: 'power2.out' }, 0.3);
        if (sub) tl.from(sub, { autoAlpha: 0, y: 8, duration: 0.9, ease: 'power3.out' }, 0.9);
        return tl;
    }

    function heroIntro(delay) {
        var tl = gsap.timeline({ delay: delay || 0, defaults: { ease: 'expo.out' } });
        tl.add(drawSvg($('.logo--hero')), 0)
          .from('[data-hero]', { y: 34, autoAlpha: 0, duration: 1.1, stagger: 0.09 }, 0.35)
          .from('.hero__aura, .hero__canvas, .hero__grid-lines', { autoAlpha: 0, duration: 1.6, ease: 'power2.out' }, 0)
          .add(runCounters, 1.0);
        ready();
        return tl;
    }

    if (reduced) {
        ready();
        root.classList.remove('show-preloader');
    } else if (root.classList.contains('show-preloader')) {
        var pre = $('.preloader'), count = $('.js-pre-count'), bar = $('.preloader__bar span');
        var o = { v: 0 };
        try { sessionStorage.setItem('fe-intro', '1'); } catch (e) { /* ignore */ }
        var hero = heroIntro(0).pause();
        drawSvg($('.pre-mark'), { drawDur: 1.1 });
        gsap.timeline()
            .to(o, { v: 100, duration: 1.25, ease: 'power2.inOut', onUpdate: function () { count.textContent = Math.round(o.v); } })
            .to(bar, { scaleX: 1, duration: 1.25, ease: 'power2.inOut' }, 0)
            .to('.preloader__inner', { y: -30, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, '+=0.1')
            .fromTo(pre, { clipPath: 'inset(0% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '-=0.15')
            .add(function () { hero.play(); }, '-=0.55')
            .add(function () { root.classList.remove('show-preloader'); });
    } else {
        heroIntro(0.1);
    }
    if (canvasCtl) canvasCtl.start();

    if (reduced) {
        // Minimal, non-moving page: just keep scroll spy and finish here.
        setupSpy();
        return;
    }

    /* ---------------- Hero parallax on scroll ---------------- */
    gsap.to('.hero__inner', { yPercent: 12, autoAlpha: 0.25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero__aura', { yPercent: 25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });

    /* ---------------- Marquee (velocity-reactive) ---------------- */
    var marqueeTweens = [];
    $$('.marquee__row').forEach(function (row) {
        var track = $('.marquee__track', row);
        row.appendChild(track.cloneNode(true));
        var dir = parseFloat(row.getAttribute('data-dir')) || -1;
        var tw = dir < 0
            ? gsap.fromTo(row, { xPercent: 0 }, { xPercent: -50, duration: 38, ease: 'none', repeat: -1 })
            : gsap.fromTo(row, { xPercent: -50 }, { xPercent: 0, duration: 38, ease: 'none', repeat: -1 });
        marqueeTweens.push(tw);
    });
    var skewTo = gsap.quickTo('.marquee__row', 'skewX', { duration: 0.5, ease: 'power3' });
    ScrollTrigger.create({
        trigger: '.marquee', start: 'top bottom', end: 'bottom top',
        onUpdate: function (self) {
            var v = self.getVelocity();
            var boost = 1 + Math.min(Math.abs(v) / 250, 6);
            marqueeTweens.forEach(function (t) { gsap.to(t, { timeScale: boost, duration: 0.2, overwrite: true, onComplete: function () { gsap.to(t, { timeScale: 1, duration: 1.2 }); } }); });
            skewTo(gsap.utils.clamp(-8, 8, v / -300));
        }
    });

    /* ---------------- Generic reveals ---------------- */
    $$('.section-title .mask > span, .contact__heading .mask > span').forEach(function (el) {
        gsap.from(el, { yPercent: 110, rotate: 2, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el.parentNode, start: 'top 88%' } });
    });
    $$('.section-tag').forEach(function (el) {
        gsap.from(el, { x: -24, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });

    // About
    gsap.fromTo('.about__frame', { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', scrollTrigger: { trigger: '.about__media', start: 'top 80%' } });
    gsap.from('.about__frame img', { scale: 1.35, duration: 1.8, ease: 'expo.out', scrollTrigger: { trigger: '.about__media', start: 'top 80%' } });
    gsap.fromTo('.about__frame img', { yPercent: -8 }, { yPercent: 2, ease: 'none', scrollTrigger: { trigger: '.about', start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from('.about__chip', { y: 30, scale: 0.8, autoAlpha: 0, duration: 1, ease: 'back.out(1.8)', scrollTrigger: { trigger: '.about__media', start: 'top 60%' } });
    gsap.from('.about__orbit', { rotate: -8, scale: 0.92, autoAlpha: 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.about__media', start: 'top 70%' } });
    gsap.from('.about__text p', { y: 36, autoAlpha: 0, duration: 1.1, stagger: 0.12, ease: 'power3.out', scrollTrigger: { trigger: '.about__text', start: 'top 82%' } });
    gsap.from('.fact', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.facts', start: 'top 88%' } });

    // Timeline
    gsap.to('.timeline__progress', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.timeline', start: 'top 60%', end: 'bottom 60%', scrub: 0.6 } });
    $$('.timeline-item').forEach(function (item) {
        gsap.from($('.timeline-card', item), { x: 50, autoAlpha: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: item, start: 'top 85%' } });
        gsap.from($('.timeline-icon', item), { scale: 0, rotate: -90, duration: 0.9, ease: 'back.out(2)', scrollTrigger: { trigger: item, start: 'top 85%' } });
        ScrollTrigger.create({ trigger: item, start: 'top 60%', onEnter: function () { item.classList.add('is-active'); }, onLeaveBack: function () { item.classList.remove('is-active'); } });
    });

    // Skills
    gsap.set('.bento__card', { autoAlpha: 0 });
    ScrollTrigger.batch('.bento__card', {
        start: 'top 88%', once: true,
        onEnter: function (batch) {
            gsap.fromTo(batch, { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.1, stagger: 0.1, ease: 'power3.out' });
            batch.forEach(function (card) {
                if (!$$('.tag', card).length) return;
                gsap.fromTo($$('.tag', card), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.025, delay: 0.25, ease: 'power2.out' });
            });
        }
    });
    gsap.from('.lang-bar__fill', { scaleX: 0, duration: 1.6, stagger: 0.15, ease: 'expo.out', scrollTrigger: { trigger: '.languages', start: 'top 85%' } });

    // Projects: horizontal pinned showcase on large screens, stacked reveal elsewhere
    var projSection = $('.projects');
    var track = $('.projects__track');
    var counterEl = $('.js-proj-current');
    var barEl = $('.projects__bar span');
    var cards = $$('.project-card', track);
    var mm = gsap.matchMedia();
    mm.add('(min-width: 1024px) and (min-height: 680px)', function () {
        projSection.classList.add('is-horizontal');
        var distance = function () { return Math.max(0, track.scrollWidth - innerWidth); };
        var tween = gsap.to(track, {
            x: function () { return -distance(); },
            ease: 'none',
            scrollTrigger: {
                trigger: projSection, start: 'top top', end: function () { return '+=' + distance(); },
                pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
                onUpdate: function (self) {
                    if (barEl) barEl.style.transform = 'scaleX(' + self.progress.toFixed(4) + ')';
                    if (counterEl) {
                        var idx = Math.min(5, Math.max(1, Math.round(self.progress * 4) + 1));
                        counterEl.textContent = '0' + idx;
                    }
                }
            }
        });
        gsap.from(cards, { y: 90, rotate: function (i) { return i % 2 ? -3 : 3; }, autoAlpha: 0, duration: 1.1, stagger: 0.09, ease: 'power3.out', scrollTrigger: { trigger: projSection, start: 'top 65%' } });
        $$('.project-card__num', track).forEach(function (num) {
            gsap.fromTo(num, { xPercent: 60 }, { xPercent: -20, ease: 'none', scrollTrigger: { trigger: num.closest('.project-card'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
        });
        return function () { projSection.classList.remove('is-horizontal'); gsap.set(track, { clearProps: 'transform' }); };
    });
    mm.add('not ((min-width: 1024px) and (min-height: 680px))', function () {
        cards.forEach(function (card) {
            gsap.from(card, { y: 60, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: card, start: 'top 90%' } });
        });
    });

    // Tutoring teaser
    gsap.from('.tutor-card', { y: 70, scale: 0.96, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.tutor-card', start: 'top 88%' } });
    $$('.tutor-card__symbols span').forEach(function (s, i) {
        gsap.to(s, { y: i % 2 ? 14 : -14, rotate: i % 2 ? -8 : 8, duration: 3 + i * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });

    // Contact panel grows in like a sheet
    gsap.fromTo('.contact__panel', { scale: 0.94, borderRadius: '80px 80px 0 0' }, { scale: 1, borderRadius: '40px 40px 0 0', ease: 'none', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'top 30%', scrub: true } });
    gsap.from('.contact__text, .contact__cta, .contact__mail, .contact .socials', { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.contact__heading', start: 'top 80%' } });

    /* ---------------- Brand motifs: underline-with-node, circuit dividers, footer logo ---------------- */
    $$('.section-title, .contact__heading').forEach(function (el) {
        ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () { el.classList.add('is-drawn'); } });
    });
    $$('.trace-divider').forEach(function (dv) {
        var paths = $$('.dv-path', dv);
        paths.forEach(function (p) { var len = p.getTotalLength(); gsap.set(p, { strokeDasharray: len + 1, strokeDashoffset: len + 1 }); });
        var tl = gsap.timeline({ scrollTrigger: { trigger: dv, start: 'top 92%', end: 'top 45%', scrub: 0.8 } });
        tl.from($$('.dv-node circle', dv), { scale: 0, transformOrigin: '50% 50%', stagger: 0.05, duration: 0.3 }, 0)
          .to(paths, { strokeDashoffset: 0, ease: 'none', duration: 1 }, 0.1);
    });
    var footLogo = $('.logo--footer');
    if (footLogo) {
        var ftl = drawSvg(footLogo, { paused: true, drawDur: 1.6 });
        ScrollTrigger.create({ trigger: footLogo, start: 'top 92%', once: true, onEnter: function () { ftl.play(); } });
    }

    setupSpy();

    /* ---------------- Language change: refresh layout-dependent triggers ---------------- */
    document.addEventListener('langchange', function () {
        gsap.fromTo('main', { autoAlpha: 0.35 }, { autoAlpha: 1, duration: 0.6, ease: 'power2.out', clearProps: 'opacity,visibility' });
        requestAnimationFrame(function () { ScrollTrigger.refresh(); });
    });
    window.addEventListener('load', function () { ScrollTrigger.refresh(); });

    /* ---------------- Scroll spy ---------------- */
    function setupSpy() {
        var links = $$('.nav__links a');
        function setActive(id) { links.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); }); }
        $$('main section[id]').forEach(function (sec) {
            ScrollTrigger.create({ trigger: sec, start: 'top 45%', end: 'bottom 45%', onToggle: function (self) { if (self.isActive) setActive(sec.id); } });
        });
    }
})();
