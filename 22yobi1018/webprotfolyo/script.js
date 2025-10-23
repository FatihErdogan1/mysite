document.addEventListener('DOMContentLoaded', () => {

    // --- TEMA DEĞİŞTİRME LOGİĞİ ---
    const themeToggle = document.querySelector('#theme-toggle');
    const body = document.body;

    // Sayfa yüklendiğinde mevcut temayı uygula
    const applyTheme = (theme) => {
        body.setAttribute('data-theme', theme);
        themeToggle.checked = theme === 'dark';
    };

    // Kullanıcının sistem tercihini kontrol et (koyu/açık mod)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    // localStorage'da kayıtlı temayı al
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light'); // Varsayılan tema
    }

    // Butona tıklandığında temayı değiştir ve kaydet
    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });
    // --- TEMA DEĞİŞTİRME LOGİĞİ BİTİŞİ ---


    // Mobil Navigasyon Menüsü
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        // İkonu değiştir (bars <-> times)
        const icon = hamburger.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Menü linkine tıklanınca menüyü kapat
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            }
        });
    });


    // Daktilo Efekti
    const typewriterElement = document.querySelector('.typewriter');
    const textsToType = [
        "Yönetim Bilişim Sistemleri Öğrencisi.",
        "Mobil Geliştirici Adayı.",
        "Problem Çözücüyüm."
    ];
    let textIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textsToType[textIndex].length) {
            typewriterElement.innerHTML += textsToType[textIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, 100);
        } else {
            setTimeout(erase, 2000);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typewriterElement.innerHTML = textsToType[textIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, 50);
        } else {
            textIndex = (textIndex + 1) % textsToType.length;
            setTimeout(type, 500);
        }
    }
    
    // Sadece typewriter elementi varsa başlat
    if (typewriterElement) {
        // Daktilo imlecini ekle
        const cursorSpan = document.createElement('span');
        cursorSpan.classList.add('typewriter-cursor');
        cursorSpan.innerHTML = '|';
        typewriterElement.parentNode.appendChild(cursorSpan);
        type();
    }


    // Kaydırınca beliren animasyonlar
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                entry.target.classList.remove('hidden');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    function observeElements(elements) {
         elements.forEach(el => {
            el.classList.add('hidden');
            observer.observe(el);
        });
    }
    
    observeElements(document.querySelectorAll('.section-title, .about-content > div, .project-card, .contact-content, .skill-card'));


    // Header'ı kaydırınca gizle/göster
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
            // Aşağı kaydır
            header.style.top = `-${header.offsetHeight}px`;
        } else {
            // Yukarı kaydır
            header.style.top = "0";
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);
});