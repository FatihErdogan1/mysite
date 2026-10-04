/* =====================================================================
   Project case-study pages — interactions & motion
   (theme, header, lightbox, page-enter, scroll reveals, counters,
   animated architecture diagram). Degrades without GSAP / with reduced motion.
   ===================================================================== */
(function () {
    'use strict';
    var root = document.documentElement;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    var lenis = null;
    function $(s, c) { return (c || document).querySelector(s); }
    function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
    function ready() { root.classList.remove('is-loading'); }

    /* ---------- Theme ---------- */
    var themeBtn = $('#theme-toggle'), metaTheme = $('meta[name="theme-color"]');
    function applyTheme(t) {
        root.setAttribute('data-theme', t);
        if (metaTheme) metaTheme.setAttribute('content', t === 'light' ? '#f7f3ea' : '#0c1524');
        try { localStorage.setItem('theme', t); } catch (e) { /* ignore */ }
    }
    applyTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    if (themeBtn) themeBtn.addEventListener('click', function (e) {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        if (!document.startViewTransition || reduced) { applyTheme(next); return; }
        var r = themeBtn.getBoundingClientRect(), x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
        var rad = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
        document.startViewTransition(function () { applyTheme(next); }).ready.then(function () {
            root.animate({ clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + rad + 'px at ' + x + 'px ' + y + 'px)'] },
                { duration: 750, easing: 'cubic-bezier(0.65, 0, 0.35, 1)', pseudoElement: '::view-transition-new(root)' });
        }).catch(function () {});
    });

    /* ---------- Header / progress / back-to-top ---------- */
    var header = $('.header'), progress = $('.scroll-progress span'), btt = $('.back-to-top'), lastY = scrollY, ticking = false;
    function onScroll() {
        var y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
        if (progress) progress.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, y / max) : 0) + ')';
        if (header) { header.classList.toggle('is-scrolled', y > 24); header.classList.toggle('is-hidden', y > lastY && y > 400); }
        if (btt) btt.classList.toggle('is-visible', y > 700);
        lastY = y; ticking = false;
    }
    addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
    onScroll();
    if (btt) btt.addEventListener('click', function (e) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(0, { duration: 1.2 }); else scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });

    /* ---------- Lightbox ---------- */
    (function lightbox() {
        var lb = $('.lb'); if (!lb) return;
        var items = $$('[data-lb]').map(function (b) { return { el: b, src: b.getAttribute('data-lb'), cap: b.getAttribute('data-cap-key') }; });
        var img = $('.lb__img', lb), cap = $('.lb__cap', lb), count = $('.lb__count', lb), idx = 0, lastFocus = null;
        function caption(i) { var k = items[i].cap, s = k && window.SiteI18n ? window.SiteI18n.t(k) : ''; return s || ''; }
        function show(i) {
            idx = (i + items.length) % items.length;
            img.src = items[idx].src; img.alt = caption(idx).replace(/<[^>]+>/g, '');
            cap.innerHTML = caption(idx); count.textContent = (idx + 1) + ' / ' + items.length;
            if (hasGsap && !reduced) window.gsap.fromTo(img, { autoAlpha: 0, scale: 0.97 }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'power3.out' });
        }
        function open(i) {
            lastFocus = document.activeElement; lb.hidden = false; document.body.style.overflow = 'hidden';
            if (lenis) lenis.stop();
            show(i); $('.lb__btn--close', lb).focus();
            if (hasGsap && !reduced) window.gsap.fromTo(lb, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35 });
        }
        function close() {
            lb.hidden = true; document.body.style.overflow = ''; if (lenis) lenis.start();
            if (lastFocus) lastFocus.focus({ preventScroll: true });
        }
        items.forEach(function (it, i) { it.el.addEventListener('click', function () { open(i); }); });
        $('.lb__btn--close', lb).addEventListener('click', close);
        $('.lb__btn--prev', lb).addEventListener('click', function () { show(idx - 1); });
        $('.lb__btn--next', lb).addEventListener('click', function () { show(idx + 1); });
        lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
        document.addEventListener('keydown', function (e) {
            if (lb.hidden) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowLeft') show(idx - 1);
            else if (e.key === 'ArrowRight') show(idx + 1);
            else if (e.key === 'Tab') { /* keep focus inside */
                var f = $$('button', lb), first = f[0], last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });
        var sx = null;
        img.addEventListener('pointerdown', function (e) { sx = e.clientX; });
        img.addEventListener('pointerup', function (e) { if (sx === null) return; var dx = e.clientX - sx; if (Math.abs(dx) > 50) show(idx + (dx < 0 ? 1 : -1)); sx = null; });
        if (items.length < 2) { $('.lb__btn--prev', lb).hidden = true; $('.lb__btn--next', lb).hidden = true; }
    })();

    /* ---------- Spotlight ---------- */
    if (finePointer) $$('.spot').forEach(function (c) {
        c.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(); c.style.setProperty('--mx', (e.clientX - r.left) + 'px'); c.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
    });

    var diagrams = $$('.dg');
    if (!hasGsap) { ready(); root.classList.add('no-anim'); diagrams.forEach(function (d) { d.classList.add('is-live'); }); return; }
    var gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (reduced) {
        ready();
        diagrams.forEach(function (d) { if (d.pauseAnimations) d.pauseAnimations(); });
        $$('.section-title').forEach(function (el) { el.classList.add('is-drawn'); });
        return;
    }

    /* ---------- Smooth scroll, cursor, magnetic, tilt ---------- */
    if (finePointer && typeof window.Lenis !== 'undefined') {
        lenis = new window.Lenis({ lerp: 0.11 });
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
        gsap.ticker.lagSmoothing(0);
    }
    if (finePointer) {
        var cursor = $('.cursor'), dot = $('.cursor__dot'), ring = $('.cursor__ring');
        if (cursor) {
            root.classList.add('has-cursor');
            var dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
            var rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
            cursor.classList.add('is-hidden');
            addEventListener('pointermove', function (e) { if (e.pointerType && e.pointerType !== 'mouse') return; cursor.classList.remove('is-hidden'); dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY); }, { passive: true });
            document.addEventListener('mouseleave', function () { cursor.classList.add('is-hidden'); });
            addEventListener('pointerdown', function () { cursor.classList.add('is-down'); });
            addEventListener('pointerup', function () { cursor.classList.remove('is-down'); });
            document.addEventListener('pointerover', function (e) {
                var t = e.target; if (!t.closest) return;
                cursor.classList.toggle('is-hover', !!t.closest('a, button, [data-tilt], .magnetic'));
            });
        }
        $$('.magnetic').forEach(function (el) {
            var s = parseFloat(el.getAttribute('data-strength')) || 0.3;
            el.addEventListener('pointermove', function (e) { var r = el.getBoundingClientRect(); gsap.to(el, { x: (e.clientX - r.left - r.width / 2) * s, y: (e.clientY - r.top - r.height / 2) * s, duration: 0.6, ease: 'power3.out', overwrite: 'auto' }); });
            el.addEventListener('pointerleave', function () { gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.4)', overwrite: 'auto' }); });
        });
        $$('[data-tilt]').forEach(function (c) {
            gsap.set(c, { transformPerspective: 1100 });
            var rX = gsap.quickTo(c, 'rotationX', { duration: 0.6, ease: 'power3' }), rY = gsap.quickTo(c, 'rotationY', { duration: 0.6, ease: 'power3' });
            c.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(); rY(((e.clientX - r.left) / r.width - 0.5) * 7); rX(-((e.clientY - r.top) / r.height - 0.5) * 7); });
            c.addEventListener('pointerleave', function () { rX(0); rY(0); });
        });
    }

    /* ---------- Page enter (after the brand wipe uncovers the page) ---------- */
    var enter = gsap.timeline({ paused: true, defaults: { ease: 'expo.out' } });
    enter.from('.p-crumb', { y: 20, autoAlpha: 0, duration: 0.9 })
         .from('.p-num', { xPercent: -20, autoAlpha: 0, duration: 1.2 }, 0.05)
         .from('.p-title .mask > span', { yPercent: 115, rotate: 3, duration: 1.3 }, 0.1)
         .from($$('.p-pitch, .p-meta, .p-hero .tags, .p-links, .p-note'), { y: 30, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.3)
         .from('.p-visual', { y: 60, autoAlpha: 0, scale: 0.96, duration: 1.4 }, 0.25)
         .from($$('.p-chip').length ? '.p-chip' : {}, { scale: 0.6, autoAlpha: 0, duration: 0.8, stagger: 0.12, ease: 'back.out(1.8)' }, 0.9)
         .from('.p-hero .hero__aura, .p-hero .hero__grid-lines', { autoAlpha: 0, duration: 1.6, ease: 'power2.out' }, 0);
    var codeLines = $$('.p-code__line, .p-flow > *');
    if (codeLines.length) enter.from(codeLines, { x: -14, autoAlpha: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }, 0.7);
    ready();
    (window.FEWipe ? window.FEWipe.revealed : Promise.resolve()).then(function () { enter.play(); });

    /* ---------- Scroll reveals ---------- */
    $$('.p-section .section-title .mask > span').forEach(function (el) {
        gsap.from(el, { yPercent: 110, rotate: 2, duration: 1.3, ease: 'expo.out', scrollTrigger: { trigger: el.parentNode, start: 'top 88%' } });
    });
    $$('.p-section .section-tag').forEach(function (el) {
        gsap.from(el, { x: -24, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    $$('.section-title').forEach(function (el) {
        ScrollTrigger.create({ trigger: el, start: 'top 85%', once: true, onEnter: function () { el.classList.add('is-drawn'); } });
    });
    $$('.p-prose p, .p-fact, .p-role p').forEach(function (el) {
        gsap.from(el, { y: 28, autoAlpha: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } });
    });
    ['.p-feature', '.p-stack__group', '.p-hl', '.p-ch', '.p-shot', '.p-next__card, .p-next__all'].forEach(function (sel) {
        if (!$$(sel).length) return;
        gsap.set(sel, { autoAlpha: 0, y: 50 });
        ScrollTrigger.batch(sel, { start: 'top 90%', once: true, onEnter: function (b) { gsap.to(b, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.08, ease: 'power3.out', overwrite: true }); } });
    });
    $$('.p-stack__group').forEach(function (g) {
        gsap.from($$('.tag', g), { y: 10, autoAlpha: 0, duration: 0.5, stagger: 0.03, ease: 'power2.out', scrollTrigger: { trigger: g, start: 'top 88%' } });
    });

    /* ---------- Counters ---------- */
    $$('.p-stat__num[data-count]').forEach(function (el) {
        var to = parseFloat(el.getAttribute('data-count')), o = { v: 0 };
        var fmt = function (v) { return Math.round(v).toLocaleString(root.lang === 'en' ? 'en-US' : 'tr-TR'); };
        ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: function () {
            gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = fmt(o.v); }, onComplete: function () { el.textContent = fmt(to); } });
        } });
    });
    gsap.from('.p-stat', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', scrollTrigger: { trigger: '.p-stats', start: 'top 88%' } });

    /* ---------- Architecture diagram: draw connections, pop nodes, start data packets ---------- */
    diagrams.forEach(function (svg) {
        var edges = $$('.dg-edge', svg), nodes = $$('.dg-node', svg), labels = $$('.dg-elabel, .dg-group', svg);
        if (svg.pauseAnimations) svg.pauseAnimations();
        edges.forEach(function (p) { var l = p.getTotalLength(); gsap.set(p, { strokeDasharray: l + ' ' + l, strokeDashoffset: l }); });
        var tl = gsap.timeline({ paused: true });
        var groups = labels.filter(function (l) { return l.classList.contains('dg-group'); });
        var elabels = labels.filter(function (l) { return l.classList.contains('dg-elabel'); });
        if (groups.length) tl.from(groups, { autoAlpha: 0, duration: 0.6 }, 0);
        tl.from(nodes, { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.07, ease: 'back.out(1.6)' }, 0.1)
          .to(edges, { strokeDashoffset: 0, duration: 0.9, stagger: 0.08, ease: 'power2.inOut' }, 0.45);
        if (elabels.length) tl.from(elabels, { autoAlpha: 0, scale: 0.8, transformOrigin: '50% 50%', duration: 0.5, stagger: 0.05 }, 0.9);
        tl.add(function () {
              edges.forEach(function (p) { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; });
              svg.classList.add('is-live'); if (svg.unpauseAnimations) svg.unpauseAnimations();
          });
        ScrollTrigger.create({ trigger: svg.closest('.p-diagram') || svg, start: 'top 80%', once: true, onEnter: function () { tl.play(); } });
    });

    document.addEventListener('langchange', function () { requestAnimationFrame(function () { ScrollTrigger.refresh(); }); });
    addEventListener('load', function () { ScrollTrigger.refresh(); });
})();
