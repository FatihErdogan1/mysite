/* Skills accordion: one category open at a time, arrow-key navigation, reveal on first view. */
(function () {
    'use strict';
    var root = document.querySelector('.stack');
    if (!root) return;
    var items = [].slice.call(root.querySelectorAll('.stack__item'));
    var btns = items.map(function (i) { return i.querySelector('.stack__btn'); });

    function setOpen(item, open) {
        item.classList.toggle('is-open', open);
        item.querySelector('.stack__btn').setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    items.forEach(function (item) {
        item.querySelector('.stack__btn').addEventListener('click', function () {
            var open = !item.classList.contains('is-open');
            items.forEach(function (o) { setOpen(o, false); });
            setOpen(item, open);
        });
    });
    btns.forEach(function (b, i) {
        b.addEventListener('keydown', function (e) {
            var t = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? btns.length - 1 : -1;
            if (t < 0) return;
            e.preventDefault(); btns[(t + btns.length) % btns.length].focus();
        });
    });

    root.classList.add('is-ready');
    if ('IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (es) {
            es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
        }, { threshold: 0.12 });
        items.forEach(function (i, n) { i.style.transitionDelay = (n * 70) + 'ms'; io.observe(i); });
    } else { items.forEach(function (i) { i.classList.add('is-in'); }); }
})();
