/* =====================================================================
   Brand page transition: a navy panel with the tulip motif wipes up over
   the page before navigating (links with [data-wipe]) and wipes away on
   the next page. Skipped for reduced motion, modified clicks and new tabs.
   window.FEWipe.revealed resolves when the incoming page is uncovered.
   ===================================================================== */
(function () {
    'use strict';
    var root = document.documentElement;
    var wipe = document.querySelector('.page-wipe');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hasGsap = typeof window.gsap !== 'undefined';
    var resolveReveal;
    var revealed = new Promise(function (r) { resolveReveal = r; });
    window.FEWipe = { revealed: revealed, active: root.classList.contains('wipe-in') };

    function drawMark(tl, at) {
        if (!wipe) return;
        var paths = wipe.querySelectorAll('.wp-draw');
        Array.prototype.forEach.call(paths, function (p) {
            var len = p.getTotalLength ? p.getTotalLength() : 0;
            window.gsap.set(p, { strokeDasharray: len + 1, strokeDashoffset: len + 1 });
        });
        tl.to(paths, { strokeDashoffset: 0, duration: 0.55, ease: 'power2.inOut', stagger: 0.05 }, at);
    }

    /* Arriving */
    if (root.classList.contains('wipe-in') && wipe && hasGsap && !reduced) {
        window.gsap.set(wipe, { yPercent: 0 });
        window.gsap.timeline({ delay: 0.12 })
            .to(wipe.querySelector('.page-wipe__inner'), { autoAlpha: 0, y: -20, duration: 0.3, ease: 'power2.in' })
            .add(function () { resolveReveal(); }, '-=0.05')
            .to(wipe, { yPercent: -100, duration: 0.85, ease: 'expo.inOut' }, '-=0.1')
            .add(function () {
                root.classList.remove('wipe-in');
                window.gsap.set(wipe, { yPercent: 100 });
                window.gsap.set(wipe.querySelector('.page-wipe__inner'), { autoAlpha: 1, y: 0 });
            });
    } else {
        root.classList.remove('wipe-in');
        resolveReveal();
    }

    /* Leaving */
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[data-wipe]');
        if (!a || !wipe || !hasGsap || reduced) return;
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || a.target === '_blank') return;
        var href = a.getAttribute('href');
        if (!href) return;
        e.preventDefault();
        try { sessionStorage.setItem('fe-wipe', '1'); } catch (err) { /* no storage: the next page simply appears */ }
        var tl = window.gsap.timeline({ onComplete: function () { window.location.href = a.href; } });
        tl.set(wipe, { visibility: 'visible' })
          .fromTo(wipe, { yPercent: 100 }, { yPercent: 0, duration: 0.6, ease: 'expo.inOut' });
        drawMark(tl, 0.3);
        tl.to({}, { duration: 0.12 });
    });

    /* Back/forward cache: never restore a page that is still covered */
    window.addEventListener('pageshow', function (e) {
        if (!e.persisted || !wipe) return;
        root.classList.remove('wipe-in');
        if (hasGsap) window.gsap.set(wipe, { yPercent: 100, clearProps: 'visibility' });
    });
})();
