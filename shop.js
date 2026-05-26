document.addEventListener('DOMContentLoaded', () => {

    const lightbox        = document.getElementById('lightbox');
    const lightboxImg     = document.getElementById('lightbox-img');
    const lightboxClose   = document.getElementById('lightbox-close');
    const lightboxPrev    = document.getElementById('lightbox-prev');
    const lightboxNext    = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxBuyBtn  = document.getElementById('lightbox-buy-btn');

    let gallery = [];
    let currentIndex = 0;

    function openLightbox(images, index, buyUrl, buyTarget) {
        gallery = images;
        currentIndex = index;
        showImage();
        lightboxBuyBtn.href   = buyUrl || '#';
        lightboxBuyBtn.target = buyTarget || '_self';
        lightbox.classList.add('active');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function showImage() {
        lightboxImg.src = gallery[currentIndex];
        lightboxCounter.textContent = (currentIndex + 1) + ' / ' + gallery.length;
        lightboxPrev.style.opacity = gallery.length > 1 ? '0.6' : '0.2';
        lightboxNext.style.opacity = gallery.length > 1 ? '0.6' : '0.2';
    }

    // Karten öffnen Lightbox
    document.querySelectorAll('.shop-card').forEach(card => {
        card.addEventListener('click', () => {
            const images    = JSON.parse(card.dataset.gallery);
            const buyUrl    = card.dataset.buy;
            const buyTarget = card.dataset.buyTarget;
            openLightbox(images, 0, buyUrl, buyTarget);
        });
    });

    // Navigation
    lightboxNext.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % gallery.length;
        showImage();
    });

    lightboxPrev.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + gallery.length) % gallery.length;
        showImage();
    });

    // Schließen
    lightboxClose.addEventListener('click', closeLightbox);

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Tastatur
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowRight') lightboxNext.click();
        if (e.key === 'ArrowLeft')  lightboxPrev.click();
        if (e.key === 'Escape')     closeLightbox();
    });

});
