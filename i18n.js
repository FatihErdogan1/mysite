/* =========================================
   TR / EN LANGUAGE SWITCH (no external libraries)
   -----------------------------------------
   Turkish is the default language and lives in index.html. On load the
   Turkish strings are read from the DOM (elements with data-i18n /
   data-i18n-attr), so only English and non-DOM strings are listed here.
   Priority: ?lang=tr|en in the URL > saved choice (localStorage) > tr.
   Only the inner content of leaf elements is swapped, so the elements
   GSAP animates are never replaced.
   ========================================= */
(function () {
    'use strict';

    var SUPPORTED = ['tr', 'en'];
    var STORAGE_KEY = 'lang';

    var translations = {
        tr: {
            typewriter: ['Full-Stack Developer.', 'Android Developer.', 'Problem Çözücüyüm.']
        },
        en: {
            'meta.title': 'Fatih Erdoğan | Portfolio',
            'meta.description': 'Fatih Erdoğan — 4th-year MIS student at Işık University, ranked #1 in his department; full-stack and Android developer with software internship experience (.NET/C#, Java/Spring Boot, React/TypeScript, Node.js, Kotlin).',
            'meta.ogTitle': 'Fatih Erdoğan | Portfolio',
            'meta.ogDescription': '4th-year MIS student at Işık University, ranked #1 in his department; full-stack and Android developer. Projects, experience and CV.',
            typewriter: ['Full-Stack Developer.', 'Android Developer.', 'Problem Solver.'],

            'nav.home': 'Home',
            'nav.about': 'About',
            'nav.journey': 'Journey',
            'nav.skills': 'Skills',
            'nav.projects': 'Projects',
            'nav.contact': 'Contact',

            'a11y.theme': 'Toggle theme',
            'a11y.menu': 'Open menu',
            'a11y.email': 'E-mail',
            'a11y.scroll': 'Scroll down',
            'a11y.top': 'Back to top',
            'a11y.skip': 'Skip to content',
            'a11y.nav': 'Main menu',
            'nav.tutor': 'Tutoring',
            'nav.tutorLong': 'Private tutoring — middle &amp; high school',

            'hero.badge': 'Open to opportunities',
            'hero.greeting': "Hi, I'm",
            'hero.bio': "I'm a 4th-year Management Information Systems student at Işık University, ranked #1 in my department. I recently completed a software development internship and build end-to-end apps with .NET/C#, Java/Spring Boot, React/TypeScript, Node.js and Kotlin/Android. Based in Istanbul.",
            'hero.cta': 'Get in touch',
            'hero.statRank': 'Dept. Rank',
            'hero.statProjects': 'Projects',
            'hero.statIntern': 'Latest role',
            'hero.explore': 'Explore',
            'cv.download': 'Download CV',

            'about.tag': '01 — About',
            'about.heading': 'Get to Know Me',
            'about.photoAlt': 'Photo of Fatih Erdoğan',
            'about.p1': "Hi! I'm <strong>Fatih Erdoğan</strong>, a 4th-year Management Information Systems student at Işık University on a full scholarship, ranked <strong>#1</strong> in my department (GPA: 3.77/4.00, expected graduation: 2027).",
            'about.p2': 'In summer 2026 I interned as a software developer at <strong>Tahsilist</strong>, a SaaS company, working on their production collections platform with React &amp; Node.js. On the <strong>full-stack</strong> side I build REST APIs with .NET/C# (ASP.NET Core), Java &amp; Spring Boot and Node.js, modern front ends with React &amp; TypeScript, and <strong>Android</strong> apps with Kotlin.',
            'about.chip': 'MIS · Işık University',
            'about.f1': 'Full scholarship',
            'about.f2': 'Software internship — Tahsilist',
            'about.f3': 'TÜBİTAK project',
            'about.f4': 'HesAPP in production',
            'about.p3': 'I also worked on mobile UI prototyping in a TÜBİTAK-funded research project, and HesAPP, the POS system I built, is running in production at a real café. I enjoy turning theory into practical products that solve real problems.',

            'journey.tag': '02 — Education & Experience',
            'journey.heading': 'My Journey',
            'journey.intern.period': 'Jul 2026 – Sep 2026',
            'journey.intern.badge': 'Internship · 3 mo',
            'journey.intern.title': 'Software Development Intern',
            'journey.intern.org': 'Tahsilist Yazılım A.Ş. — Istanbul · SaaS for receivables management &amp; collection automation',
            'journey.intern.desc': 'Worked on the production collections platform with React and Node.js through a pull-request and code-review workflow. Split a large current-account component into sub-components (about a third smaller), merged duplicated SMS / e-mail / voice notification logic into a single extensible service, and cut unnecessary re-renders on the KPI dashboard with React Profiler, useMemo and useCallback. During onboarding I built an end-to-end course-management app with React, Express and MongoDB.',
            'journey.tubitak.alt': 'TÜBİTAK logo',
            'journey.tubitak.period': 'May 2024 – Nov 2024',
            'journey.tubitak.badge': 'Experience · 7 mo',
            'journey.tubitak.title': 'Research Scholar',
            'journey.tubitak.org': 'Işık University — IntalaLAB, Şile/Istanbul',
            'journey.tubitak.desc': 'Designed the mobile app UI and screens for the TÜBİTAK-funded international project "TOP4HoneyChains — Trustable and Sustainable Open Platform for Smart Honey Value Chains", and took part in building digital services that bring transparency and end-to-end traceability to the honey value chain.',
            'journey.uni.alt': 'Işık University logo',
            'journey.uni.period': '2022 – 2027 (expected)',
            'journey.uni.badge': 'In progress',
            'journey.uni.title': 'Işık University',
            'journey.uni.org': 'Management Information Systems (MIS) · Full scholarship · Ranked #1',
            'journey.school.alt': 'FSMAL logo',
            'journey.school.badge': 'Graduated',
            'journey.school.org': 'Anatolian High School',

            'skills.tag': '03 — Skills',
            'skills.heading': 'My Tech Stack',
            'skills.backend': 'Backend &amp; Databases',
            'skills.frontend': 'Frontend &amp; Mobile',
            'skills.tools': 'Tools &amp; Testing',
            'skills.soft': 'Soft Skills',
            'skills.s1': 'Problem Solving',
            'skills.s2': 'Analytical Thinking',
            'skills.s3': 'Teamwork',
            'skills.s4': 'Fast Learner',
            'skills.s5': 'Time Management',
            'skills.languages': 'Languages',
            'skills.turkish': 'Turkish',
            'skills.native': 'Native',
            'skills.english': 'English',
            'skills.spanish': 'Spanish',
            'skills.beginner': 'Beginner',

            'projects.tag': '04 — Projects',
            'projects.heading': "What I've Built",
            'projects.live': 'Live',
            'projects.all': 'All projects',
            'projects.details': 'Details',
            'projects.hint': 'Keep scrolling →',
            'projects.hesapp.role': 'Restaurant &amp; Café POS System · In Production',
            'projects.hesapp.desc': 'A POS system running in production at a real café: table orders from tablets, split payments, customer accounts, Z-reports, ESC/POS thermal printing, real-time sync and a customer menu kiosk. The backend is covered by 208 tests. The source code is private; the GitHub repo is a showcase.',
            'projects.envanter.role': 'Full-Stack Inventory &amp; Asset Management · Team Project',
            'projects.envanter.desc': 'A comprehensive REST API and responsive front end for managing product stock, assets and supplier relationships, using a custom state machine for order tracking. Implemented secure JWT authentication and role-based access control (Admin, Manager, Staff, Supplier), and wrote 119 isolated unit tests with JUnit 5 and Mockito to keep the backend reliable.',
            'projects.yarimada.role': 'Web Design &amp; Development · 5-Person Course Project',
            'projects.yarimada.desc': "A multi-page website about Istanbul's Historic Peninsula, centred on the Spice Bazaar. It features a scroll-driven 3D shop model (model-viewer + GSAP ScrollTrigger) and our team's original photography instead of stock images.",
            'projects.clubchains.role': 'Rust CLI · Hackathon Project',
            'projects.clubchains.desc': 'A command-line tool for university club management — members, voting, events and finances — with token minting on the Stellar testnet via Soroban.',
            'projects.honey.role': 'TÜBİTAK 123N918 — UI/UX Design &amp; Mobile Prototyping',
            'projects.honey.desc': 'Built high-fidelity mobile UI prototypes that served as technical evidence in international TÜBİTAK project reports. Designed user-friendly screens that visualise honey traceability data (hive details, lab test results, etc.) for beekeepers and consumers, and created flow diagrams to streamline UX and navigation.',

            'tutor.tag': 'On the side — Tutoring',
            'tutor.title': 'I tutor middle and high school students.',
            'tutor.text': 'All middle-school subjects, plus high-school maths, Turkish, social studies and TYT exam prep — in person or online (lessons in Turkish).',
            'tutor.cta': 'Tutoring page',

            'contact.tag': '05 — Contact',
            'contact.heading': 'Let\'s <span class="gradient-text">Work Together.</span>',
            'contact.text': "I'm always happy to hear about new opportunities and projects. If you'd like to connect or have a question, just use the button below.",
            'contact.cta': 'Say Hello!',

            'footer.credit': 'Designed &amp; built by',
            'footer.rights': 'All rights reserved.'
        }
    };

    var current = 'tr';
    var metaDesc = document.querySelector('meta[name="description"]');
    var ogTitle = document.querySelector('meta[property="og:title"]');
    var ogDesc = document.querySelector('meta[property="og:description"]');
    var ogLocale = document.querySelector('meta[property="og:locale"]');
    var ogLocaleAlt = document.querySelector('meta[property="og:locale:alternate"]');

    // "aria-label:key; alt:key2" -> [["aria-label","key"], ["alt","key2"]]
    function parseAttrSpec(spec) {
        return (spec || '').split(';').map(function (part) {
            var i = part.indexOf(':');
            return i > 0 ? [part.slice(0, i).trim(), part.slice(i + 1).trim()] : null;
        }).filter(Boolean);
    }

    // Read the Turkish (default) strings straight from the markup.
    function captureDefaults() {
        var tr = translations.tr;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var key = el.getAttribute('data-i18n');
            if (!(key in tr)) tr[key] = el.innerHTML.trim();
        });
        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            parseAttrSpec(el.getAttribute('data-i18n-attr')).forEach(function (pair) {
                if (!(pair[1] in tr)) tr[pair[1]] = el.getAttribute(pair[0]) || '';
            });
        });
        tr['meta.title'] = document.title;
        if (metaDesc) tr['meta.description'] = metaDesc.getAttribute('content');
        if (ogTitle) tr['meta.ogTitle'] = ogTitle.getAttribute('content');
        if (ogDesc) tr['meta.ogDescription'] = ogDesc.getAttribute('content');
    }

    function t(key, lang) {
        var dict = translations[lang || current] || translations.tr;
        return key in dict ? dict[key] : translations.tr[key];
    }

    function apply(lang) {
        current = lang;
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
            var val = t(el.getAttribute('data-i18n'));
            if (typeof val === 'string' && el.innerHTML.trim() !== val) el.innerHTML = val;
        });
        document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
            parseAttrSpec(el.getAttribute('data-i18n-attr')).forEach(function (pair) {
                var val = t(pair[1]);
                if (typeof val === 'string') el.setAttribute(pair[0], val);
            });
        });
        document.documentElement.setAttribute('lang', lang);
        document.title = t('meta.title');
        if (metaDesc) metaDesc.setAttribute('content', t('meta.description'));
        if (ogTitle) ogTitle.setAttribute('content', t('meta.ogTitle'));
        if (ogDesc) ogDesc.setAttribute('content', t('meta.ogDescription'));
        if (ogLocale) ogLocale.setAttribute('content', lang === 'en' ? 'en_US' : 'tr_TR');
        if (ogLocaleAlt) ogLocaleAlt.setAttribute('content', lang === 'en' ? 'tr_TR' : 'en_US');

        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            var on = btn.getAttribute('data-lang') === lang;
            btn.classList.toggle('active', on);
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        });
        document.documentElement.setAttribute('data-lang', lang);
    }

    function urlLang() {
        try {
            var p = new URLSearchParams(window.location.search).get('lang');
            return p && SUPPORTED.indexOf(p.toLowerCase()) !== -1 ? p.toLowerCase() : null;
        } catch (e) { return null; }
    }

    function savedLang() {
        try {
            var s = window.localStorage.getItem(STORAGE_KEY);
            return SUPPORTED.indexOf(s) !== -1 ? s : null;
        } catch (e) { return null; }
    }

    function setLang(lang) {
        if (SUPPORTED.indexOf(lang) === -1 || lang === current) return;
        apply(lang);
        try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage unavailable */ }
        // Keep a ?lang= override in the address bar in sync with the choice.
        try {
            var url = new URL(window.location.href);
            if (url.searchParams.has('lang')) {
                url.searchParams.set('lang', lang);
                window.history.replaceState(null, '', url.toString());
            }
        } catch (e) { /* ignore */ }
        document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang } }));
    }

    function init() {
        // Pages can add their own English strings (e.g. project case studies) via window.SiteI18nExtra.
        var extra = window.SiteI18nExtra;
        if (extra && extra.en) { for (var k in extra.en) { if (Object.prototype.hasOwnProperty.call(extra.en, k)) translations.en[k] = extra.en[k]; } }
        if (extra && extra.tr) { for (var j in extra.tr) { if (Object.prototype.hasOwnProperty.call(extra.tr, j)) translations.tr[j] = extra.tr[j]; } }
        captureDefaults();
        var initial = urlLang() || savedLang() || 'tr';
        if (initial !== 'tr') apply(initial);
        else document.documentElement.setAttribute('data-lang', 'tr');
        // The <head> script hides the page while a non-default language is applied.
        document.documentElement.classList.remove('lang-pending');

        document.querySelectorAll('.lang-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                setLang(btn.getAttribute('data-lang'));
            });
        });
    }

    window.SiteI18n = {
        t: t,
        setLang: setLang,
        get lang() { return current; }
    };

    // Loaded at the end of <body>: the markup is already parsed, so apply the
    // language right away (before the GSAP entrance animations and first paint).
    if (document.querySelector('.footer')) {
        init();
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }
})();
