/* Özel Ders page — light GSAP motion, sticky WhatsApp button. Works without GSAP. */
(function () {
    'use strict';
    var root = document.documentElement;
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    function $(s, c) { return (c || document).querySelector(s); }
    function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }

    /* Header background on scroll */
    var header = $('.d-header');
    function onScroll() { if (header) header.classList.toggle('is-scrolled', window.scrollY > 12); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* Floating WhatsApp button: visible once the hero button is out of view (and not over the final CTA) */
    var fab = $('.d-fab'), heroBtn = $('.js-wa-main'), cta = $('.d-cta');
    if (fab && 'IntersectionObserver' in window) {
        var heroVisible = true, ctaVisible = false;
        var sync = function () { fab.classList.toggle('is-visible', !heroVisible && !ctaVisible); };
        new IntersectionObserver(function (e) { heroVisible = e[0].isIntersecting; sync(); }).observe(heroBtn);
        if (cta) new IntersectionObserver(function (e) { ctaVisible = e[0].isIntersecting; sync(); }, { threshold: 0.35 }).observe(cta);
    } else if (fab) { fab.classList.add('is-visible'); }

    var hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
    if (!hasGsap || reduced) {
        root.classList.remove('is-loading');
        $$('.d-step').forEach(function (s) { s.classList.add('is-on'); });
        return;
    }
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    /* Hero intro */
    var path = $('.d-hl__mark path');
    var len = path ? path.getTotalLength() : 0;
    if (path) gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
    var tl = gsap.timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 });
    tl.from('.d-line > span', { yPercent: 115, rotate: 4, duration: 1.2, stagger: 0.1 })
      .from('[data-hero]', { y: 28, autoAlpha: 0, duration: 1, stagger: 0.08 }, '-=0.95')
      .from('.d-photo', { clipPath: 'inset(100% 0% 0% 0% round 200px 200px 28px 28px)', duration: 1.3, ease: 'expo.inOut' }, 0.15)
      .from('.d-photo img', { scale: 1.3, duration: 1.6 }, 0.25)
      .from('.d-float', { scale: 0.6, autoAlpha: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.8)' }, 0.8)
      .from('.d-ring', { rotate: -20, autoAlpha: 0, duration: 1.4 }, 0.6)
      .to(path, { strokeDashoffset: 0, duration: 1.1, ease: 'power2.inOut' }, 0.9)
      .add(function () { counters($$('.d-hero .js-count')); }, 0.9);
    root.classList.remove('is-loading');

    /* Floating symbols drift + gentle mouse parallax */
    $$('.d-sym').forEach(function (s, i) {
        gsap.to(s, { y: i % 2 ? 18 : -18, rotate: i % 2 ? -10 : 10, duration: 4 + i * 0.5, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    $$('.d-float').forEach(function (f, i) {
        gsap.to(f, { y: i % 2 ? 8 : -8, duration: 3 + i * 0.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });
    });
    if (finePointer) {
        var bg = $('.d-hero__bg');
        var xTo = gsap.quickTo(bg, 'x', { duration: 1.2, ease: 'power3' }), yTo = gsap.quickTo(bg, 'y', { duration: 1.2, ease: 'power3' });
        $('.d-hero').addEventListener('pointermove', function (e) { xTo((e.clientX / innerWidth - 0.5) * -24); yTo((e.clientY / innerHeight - 0.5) * -24); });
    }

    function counters(els) {
        els.forEach(function (el) {
            var to = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-decimals') || '0', 10), o = { v: 0 };
            gsap.to(o, { v: to, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = o.v.toFixed(dec); } });
        });
    }

    /* Section reveals */
    $$('.d-head').forEach(function (h) {
        gsap.from(h.children, { y: 30, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: h, start: 'top 85%' } });
    });
    gsap.set('.d-subject', { autoAlpha: 0, y: 50 });
    window.ScrollTrigger.batch('.d-subject', {
        start: 'top 90%', once: true,
        onEnter: function (b) { gsap.to(b, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.1, ease: 'power3.out' }); }
    });
    gsap.from('.d-trust__card', {
        y: 40, autoAlpha: 0, duration: 1, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.d-trust', start: 'top 85%', onEnter: function () { counters($$('.d-trust .js-count')); } }
    });

    /* Steps: progress line + numbered dots light up */
    var horizontal = window.matchMedia('(min-width: 860px)').matches;
    var lineVars = { ease: 'none', scrollTrigger: { trigger: '.d-steps', start: 'top 75%', end: horizontal ? 'top 35%' : 'bottom 60%', scrub: 0.6 } };
    lineVars[horizontal ? 'scaleX' : 'scaleY'] = 1;
    gsap.to('.d-steps__line span', lineVars);
    $$('.d-step').forEach(function (step, i) {
        gsap.from(step, { y: 30, autoAlpha: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: horizontal ? '.d-steps' : step, start: horizontal ? 'top 80%' : 'top 88%' }, delay: horizontal ? i * 0.12 : 0 });
        window.ScrollTrigger.create({ trigger: horizontal ? '.d-steps' : step, start: horizontal ? 'top ' + (75 - i * 12) + '%' : 'top 62%', onEnter: function () { step.classList.add('is-on'); }, onLeaveBack: function () { step.classList.remove('is-on'); } });
    });
    gsap.from('.d-info__card', { y: 30, autoAlpha: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '.d-info', start: 'top 90%' } });
    gsap.from('.d-cta', { y: 60, scale: 0.96, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.d-cta', start: 'top 88%' } });
    gsap.from('.d-cta > *:not(.d-cta__sym)', { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08, ease: 'power3.out', clearProps: 'transform', scrollTrigger: { trigger: '.d-cta', start: 'top 75%' } });

    window.addEventListener('load', function () { window.ScrollTrigger.refresh(); });
})();
