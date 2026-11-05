/* =========================================
   SCREENS REEL
   Curved, per-project screenshot strip with a lightbox.
   - Self-contained (no GSAP needed), loads images only when near the viewport
   - Runs its animation loop only while visible and the tab is active
   - prefers-reduced-motion: plain horizontally scrollable strip, no 3D
   - Captions follow the TR/EN language switch
   ========================================= */
(function () {
    'use strict';

    var stage = document.getElementById('screensStage');
    var ring = document.getElementById('screensRing');
    if (!stage || !ring) return;

    var section = document.getElementById('screens');
    var tabs = [].slice.call(section.querySelectorAll('[role="tab"]'));
    var capTitle = section.querySelector('.js-sc-title');
    var capSub = section.querySelector('.js-sc-sub');
    var capN = section.querySelector('.js-sc-n');
    var dialog = document.getElementById('shotDialog');
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var DIR = 'assets/img/reel/';

    var PROJECTS = {
        hesapp: {
            name: 'HesAPP',
            sub: { tr: 'Adisyon ve kiosk sistemi, gerçek bir kafede canlıda', en: 'Point-of-sale and kiosk system, live in a real café' },
            shots: [
                ['hesapp-01-login', 'Giriş', 'Login'],
                ['hesapp-02-tables', 'Masalar', 'Tables'],
                ['hesapp-03-order', 'Sipariş', 'Order'],
                ['hesapp-04-payment', 'Ödeme', 'Payment'],
                ['hesapp-05-customers', 'Müşteriler', 'Customers'],
                ['hesapp-05b-customer-detail', 'Müşteri detayı', 'Customer detail'],
                ['hesapp-06-reports', 'Raporlar', 'Reports'],
                ['hesapp-06b-z-report', 'Z raporu', 'Z report'],
                ['hesapp-07-menu-admin', 'Menü yönetimi', 'Menu admin'],
                ['hesapp-08-history', 'Geçmiş', 'History'],
                ['hesapp-09-kiosk-attract', 'Kiosk karşılama', 'Kiosk welcome'],
                ['hesapp-10-kiosk-menu', 'Kiosk menü', 'Kiosk menu']
            ]
        },
        yarimada: {
            name: 'Tarihi Yarım Ada',
            sub: { tr: 'Mısır Çarşısı merkezli çok sayfalı site', en: 'Multi-page site built around the Spice Bazaar' },
            shots: [
                ['yarimada-index', 'Ana sayfa', 'Home'],
                ['yarimada-bazaar', 'Çarşı hikâyesi', 'Bazaar story'],
                ['yarimada-galeri', 'Galeri', 'Gallery'],
                ['yarimada-tur', 'Kültür turu', 'Culture tour'],
                ['yarimada-urun', 'Ürünler', 'Products'],
                ['yarimada-hikayemiz', 'Hikâyemiz', 'Our story']
            ]
        }
    };

    function lang() { return (document.documentElement.lang || 'tr').slice(0, 2) === 'en' ? 'en' : 'tr'; }
    function mobile() { return window.innerWidth < 761; }

    var current = 'hesapp', cards = [], total = 0, realCount = 0, capIdx = -1;
    var R = 800, cw = 400, step = 20, span = 360, maxA = 50;
    var theta = 0, speed = 0, boost = 0, hover = false, lastY = window.scrollY;
    var loaded = false, visible = false, raf = 0, last = 0;

    function setCaption(i) {
        var p = PROJECTS[current];
        if (reduced) { capTitle.textContent = p.name; capSub.textContent = p.sub[lang()]; capN.textContent = ''; return; }
        i = ((i % realCount) + realCount) % realCount;
        if (i === capIdx && capTitle.dataset.l === lang()) return;
        capIdx = i; capTitle.dataset.l = lang();
        capTitle.textContent = p.shots[i][lang() === 'en' ? 2 : 1];
        capSub.textContent = p.sub[lang()];
        capN.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(realCount).padStart(2, '0');
    }

    function openShot(proj, i) {
        var s = PROJECTS[proj].shots[i % PROJECTS[proj].shots.length];
        var cap = PROJECTS[proj].name + ', ' + s[lang() === 'en' ? 2 : 1];
        var img = dialog.querySelector('img');
        img.src = DIR + s[0] + '.webp'; img.alt = cap;
        dialog.querySelector('p').textContent = cap;
        if (dialog.showModal) dialog.showModal();
    }

    function build(key) {
        current = key; var p = PROJECTS[key];
        ring.innerHTML = ''; capIdx = -1; theta = 0;
        realCount = p.shots.length;
        var list = p.shots.slice();
        if (!reduced) { while (list.length < 10) list = list.concat(p.shots); }
        cards = list.map(function (s, i) {
            var b = document.createElement('button');
            b.type = 'button'; b.className = 'shot';
            if (i >= realCount) { b.tabIndex = -1; b.setAttribute('aria-hidden', 'true'); }
            var img = new Image();
            img.decoding = 'async'; img.width = 960; img.height = 600;
            img.alt = p.name + ', ' + s[lang() === 'en' ? 2 : 1];
            img.src = DIR + s[0] + '.webp';
            b.appendChild(img);
            b.addEventListener('click', function () { openShot(key, i); });
            ring.appendChild(b);
            return b;
        });
        total = cards.length;
        measure(); render(); setCaption(0);
    }

    function measure() {
        if (reduced) return;
        var m = mobile(), w = window.innerWidth;
        cw = m ? Math.round(w * 0.72) : Math.min(470, Math.round(w * 0.3));
        ring.style.setProperty('--cw', cw + 'px');
        R = m ? w * 1.2 : w * 0.72;
        step = (cw * 1.08) / R * 180 / Math.PI;
        span = step * total;
        var need = Math.asin(Math.min(1, (w / 2 + cw * 0.6) / R)) * 180 / Math.PI;
        maxA = Math.min(need, 60, span / 2 - step * 0.6);
    }

    function wrap(a) { return ((a + span / 2) % span + span) % span - span / 2; }

    function render() {
        if (reduced) { return; }
        var best = 0, bestA = 1e9;
        for (var i = 0; i < total; i++) {
            var a = wrap(theta + i * step), c = cards[i], abs = Math.abs(a);
            if (abs < bestA) { bestA = abs; best = i; }
            if (abs > maxA) { c.style.visibility = 'hidden'; continue; }
            c.style.visibility = 'visible';
            c.style.opacity = Math.min(1, (maxA - abs) / (step * 0.7)).toFixed(3);
            var curl = a * 0.35 * Math.min(1, abs / 25);
            c.style.transform = 'translateZ(' + R.toFixed(1) + 'px) rotateY(' + a.toFixed(3) + 'deg) translateZ(' + (-R).toFixed(1) + 'px) rotateY(' + curl.toFixed(2) + 'deg)';
        }
        setCaption(best);
    }

    function frame(now) {
        if (!visible || document.hidden) { raf = 0; return; }
        var dt = Math.min(64, now - (last || now)); last = now;
        var y = window.scrollY, dy = Math.abs(y - lastY); lastY = y;
        boost = Math.min(30, boost + dy * 0.05); boost *= Math.pow(0.9, dt / 16);
        var target = (hover ? 0.45 : 2.4) + boost;
        speed += (target - speed) * Math.min(1, dt / 200);
        theta -= speed * dt / 1000;
        render();
        raf = requestAnimationFrame(frame);
    }
    function kick() { if (!raf && visible && !reduced) { last = 0; raf = requestAnimationFrame(frame); } }

    function init() {
        if (loaded) return; loaded = true;
        stage.classList.toggle('is-static', reduced);
        build('hesapp');
    }

    /* tabs */
    tabs.forEach(function (t) {
        t.addEventListener('click', function () {
            if (t.getAttribute('aria-selected') === 'true') return;
            tabs.forEach(function (o) { o.setAttribute('aria-selected', o === t ? 'true' : 'false'); });
            if (reduced) { build(t.dataset.proj); return; }
            ring.style.transition = 'opacity .3s ease'; ring.style.opacity = '0';
            setTimeout(function () { build(t.dataset.proj); ring.style.opacity = '1'; }, 300);
        });
        t.addEventListener('keydown', function (e) {
            if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
            var i = tabs.indexOf(t) + (e.key === 'ArrowRight' ? 1 : -1);
            var n = tabs[(i + tabs.length) % tabs.length]; n.focus(); n.click();
        });
    });

    /* hover slows the strip down */
    ring.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hover = true; });
    ring.addEventListener('pointerleave', function () { hover = false; });
    ring.addEventListener('focusin', function () { hover = true; });
    ring.addEventListener('focusout', function () { hover = false; });

    /* lightbox */
    dialog.querySelector('.shot-dialog__close').addEventListener('click', function () { dialog.close(); });
    dialog.addEventListener('click', function (e) { if (e.target === dialog) dialog.close(); });

    /* language switch: refresh captions */
    document.addEventListener('langchange', function () { if (!loaded) return; capTitle.dataset.l = ''; if (reduced) setCaption(0); else render(); });

    window.addEventListener('resize', function () { if (loaded) { measure(); render(); } });
    document.addEventListener('visibilitychange', kick);

    /* lazy start: load when near, animate only while visible */
    if ('IntersectionObserver' in window) {
        new IntersectionObserver(function (es) { if (es[0].isIntersecting) init(); }, { rootMargin: '700px 0px' }).observe(section);
        new IntersectionObserver(function (es) { visible = es[0].isIntersecting; if (visible) { init(); kick(); } }, { threshold: 0.05 }).observe(stage);
    } else { init(); visible = true; kick(); }
})();
