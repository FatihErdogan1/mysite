document.addEventListener('DOMContentLoaded', () => {

    // --- TEMA DEĞİŞTİRME LOGİĞİ ---
    const themeToggle = document.querySelector('#theme-toggle');
    const body = document.body;

    const applyTheme = (theme) => {
        body.setAttribute('data-theme', theme);
        themeToggle.checked = theme === 'dark';
    };

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (prefersDark) {
        applyTheme('dark');
    } else {
        applyTheme('light');
    }

    themeToggle.addEventListener('change', () => {
        const newTheme = themeToggle.checked ? 'dark' : 'light';
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // --- MOBİL MENÜ LOGİĞİ ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.querySelector('i').classList.remove('fa-times');
                hamburger.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // --- DAKTİLO EFEKTİ ---
    const typewriterElement = document.querySelector('.typewriter');
    if (typewriterElement) {
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

        const cursorSpan = document.createElement('span');
        cursorSpan.classList.add('typewriter-cursor');
        cursorSpan.innerHTML = '|';
        typewriterElement.parentNode.appendChild(cursorSpan);
        type();
    }


    // --- HEADER GİZLEME/GÖSTERME ---
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
            header.style.top = `-${header.offsetHeight}px`;
        } else {
            header.style.top = "0";
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);


    // --- YENİ: BAŞA DÖN BUTONU LOGİĞİ (Madde 4) ---
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        // Tıklayınca yumuşak kaydırma (CSS'teki smooth-scroll'u destekler)
        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // --- YENİ: AKTİF MENÜ VURGULAMA (Scroll Spy) (Madde 1) ---
    const sections = document.querySelectorAll('section[id]');
    const navLinksList = document.querySelectorAll('.nav-links a');
    const headerHeight = document.querySelector('.header').offsetHeight; // Header yüksekliğini al

    function updateActiveNavLink() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // Header yüksekliğini ve ek bir offset (50px) hesaba katarak
            if (window.scrollY >= (sectionTop - headerHeight - 50)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateActiveNavLink);
    updateActiveNavLink(); // Sayfa yüklendiğinde de çalıştır


    // --- YENİ: GSAP İLERİ SEVİYE ANİMASYONLAR (Madde 5) ---
    // (Eski Intersection Observer kodu kaldırıldı)
    gsap.registerPlugin(ScrollTrigger);

    // 1. Hero Bölümü Açılış Animasyonu
    gsap.from(".hero-content > *", {
        delay: 0.2,
        duration: 0.8,
        y: 30,
        opacity: 0,
        stagger: 0.15,
        ease: "power3.out"
    });

    // 2. Kaydırınca Gelen Bölüm Animasyonları
    // Animasyon uygulanacak tüm ortak elemanları seç
    const animatedElements = gsap.utils.toArray([
        ".section-title",
        ".about-text",
        ".about-image",
        ".education-card",
        ".skill-card",
        ".project-card",
        ".contact-content"
    ]);

    animatedElements.forEach(el => {
        gsap.from(el, {
            // Animasyon ayarları
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
            
            // ScrollTrigger ayarları
            scrollTrigger: {
                trigger: el,
                start: "top 85%", // Eleman ekranın %85'ine gelince başla
                toggleActions: "play none none none", // Sadece bir kez oynat
            }
        });
    });

});