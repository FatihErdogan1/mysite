document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Lightbox (Görsel Büyütme) Fonksiyonları

var lightbox = document.getElementById("lightbox");
var lightboxImg = document.getElementById("lightboxImage");
var lightboxCaption = document.getElementById("lightboxCaption");

/**
 * Tıklanan görseli lightbox içinde gösterir.
 * @param {string} src - Görselin tam yolu.
 * @param {string} caption - Görselin alt yazısı.
 */
function openLightbox(src, caption) {
    lightbox.style.display = "block";
    lightboxImg.src = src;
    lightboxCaption.innerHTML = caption;
}

/**
 * Lightbox'ı kapatır.
 */
function closeLightbox() {
    lightbox.style.display = "none";
}