/* ── WhatsApp Centralizado ── */
const WA_CONFIG = {
    base: 'https://wa.me',
    defaultNumber: '50240917878',
    altNumber: '50253196848',
    messages: {
        general: 'Hola, quiero reservar en Hostal El Portal.',
        'info-oficina': 'Hola, quiero más información sobre Hostal El Portal.',
        'info-celular': 'Hola, quiero más información sobre Hostal El Portal.',
        suite: 'Hola, quiero reservar la Suite Privada en Hostal El Portal.',
        semi: 'Hola, quiero reservar la habitación Semi-Privada en Hostal El Portal.',
        dorm: 'Hola, quiero reservar el Dormitorio en Hostal El Portal.',
        'general-alt': 'Hola, quiero reservar en Hostal El Portal.'
    }
};

function buildWaLink(key) {
    const msg = WA_CONFIG.messages[key] || WA_CONFIG.messages.general;
    const number = (key === 'info-celular' || key === 'general-alt') ? WA_CONFIG.altNumber : WA_CONFIG.defaultNumber;
    return `${WA_CONFIG.base}/${number}?text=${encodeURIComponent(msg)}`;
}

document.querySelectorAll('[data-whatsapp]').forEach((el) => {
    el.setAttribute('href', buildWaLink(el.dataset.whatsapp));
});

/* ── Menú Móvil ── */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const navBackdrop = document.querySelector('.nav-backdrop');

if (menuToggle && navLinks && navBackdrop) {
    function closeMenu() {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        navBackdrop.classList.remove('is-active');
        document.body.classList.remove('scroll-lock');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Abrir menú');
    }

    function openMenu() {
        menuToggle.classList.add('active');
        navLinks.classList.add('active');
        navBackdrop.classList.add('is-active');
        document.body.classList.add('scroll-lock');
        menuToggle.setAttribute('aria-expanded', 'true');
        menuToggle.setAttribute('aria-label', 'Cerrar menú');
    }

    menuToggle.addEventListener('click', () => {
        const isOpen = menuToggle.classList.contains('active');
        if (isOpen) {
            closeMenu();
            return;
        }
        openMenu();
    });

    navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    navBackdrop.addEventListener('click', closeMenu);

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

/* ── Hero Background Carousel ── */
(function () {
    const heroSlides = Array.from(document.querySelectorAll('.hero-slide'));
    const autoplayBtn = document.querySelector('.hero-autoplay-btn');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (heroSlides.length < 2) {
        if (autoplayBtn) {
            autoplayBtn.style.display = 'none';
        }
        return;
    }

    let current = 0;
    let intervalId = 0;
    let isPlaying = !prefersReducedMotion;

    function showSlide(index) {
        heroSlides[current].classList.remove('is-active');
        current = index;
        heroSlides[current].classList.add('is-active');
    }

    function startAutoplay() {
        if (prefersReducedMotion) return;
        intervalId = window.setInterval(() => {
            showSlide((current + 1) % heroSlides.length);
        }, 5000);
    }

    function stopAutoplay() {
        window.clearInterval(intervalId);
    }

    function toggleAutoplay() {
        if (isPlaying) {
            stopAutoplay();
            isPlaying = false;
            if (autoplayBtn) {
                autoplayBtn.setAttribute('aria-label', 'Reproducir carrusel');
                autoplayBtn.setAttribute('aria-pressed', 'true');
            }
        } else {
            isPlaying = true;
            startAutoplay();
            if (autoplayBtn) {
                autoplayBtn.setAttribute('aria-label', 'Pausar carrusel');
                autoplayBtn.setAttribute('aria-pressed', 'false');
            }
        }
    }

    if (autoplayBtn) {
        autoplayBtn.addEventListener('click', toggleAutoplay);
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            stopAutoplay();
            return;
        }
        if (isPlaying) {
            stopAutoplay();
            startAutoplay();
        }
    });

    if (isPlaying) {
        startAutoplay();
    }
})();

/* ── Carrusel de Galería ── */
(function () {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const btnPrev = document.querySelector('.carousel-btn--prev');
    const btnNext = document.querySelector('.carousel-btn--next');
    const dotsWrap = document.querySelector('.carousel-dots');

    if (!track || !btnPrev || !btnNext || !dotsWrap || slides.length === 0) {
        return;
    }

    let perView = getPerView();
    let current = 0;
    const total = slides.length;

    function getPerView() {
        return window.innerWidth <= 768 ? 1 : window.innerWidth <= 1024 ? 2 : 3;
    }

    function buildDots() {
        dotsWrap.innerHTML = '';
        const count = total - perView + 1;

        for (let i = 0; i < count; i += 1) {
            const btn = document.createElement('button');
            btn.className = `carousel-dot${i === current ? ' active' : ''}`;
            btn.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
            btn.addEventListener('click', () => goTo(i));
            dotsWrap.appendChild(btn);
        }
    }

    function updateDots() {
        document.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === current);
        });
    }

    function goTo(index) {
        const maxIndex = total - perView;
        current = Math.max(0, Math.min(index, maxIndex));
        const gap = parseFloat(getComputedStyle(track).gap || 0);
        const slideWidth = slides[0].getBoundingClientRect().width + gap;
        track.style.transform = `translate3d(-${current * slideWidth}px, 0, 0)`;
        updateDots();
    }

    btnPrev.addEventListener('click', () => goTo(current - 1));
    btnNext.addEventListener('click', () => goTo(current + 1));

    let touchStartX = 0;
    track.addEventListener(
        'touchstart',
        (event) => {
            touchStartX = event.touches[0].clientX;
        },
        { passive: true }
    );
    track.addEventListener('touchend', (event) => {
        const diff = touchStartX - event.changedTouches[0].clientX;
        if (Math.abs(diff) > 50) {
            goTo(current + (diff > 0 ? 1 : -1));
        }
    });

    let resizeFrame = 0;
    let lastPerView = perView;
    window.addEventListener('resize', () => {
        cancelAnimationFrame(resizeFrame);
        resizeFrame = requestAnimationFrame(() => {
            perView = getPerView();
            if (perView !== lastPerView) {
                lastPerView = perView;
                current = 0;
                buildDots();
            }
            goTo(current);
        });
    });

    buildDots();
    goTo(0);
})();

/* ── Lightbox ── */
const lightbox = document.getElementById('lightbox');
const lbImg = document.getElementById('lightbox-img');
const lbCap = document.getElementById('lightbox-caption');
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightboxCloseBtn = document.querySelector('.lightbox-close');
const lightboxPrevBtn = document.querySelector('.lightbox-prev');
const lightboxNextBtn = document.querySelector('.lightbox-next');
let lbCurrent = 0;
let lastFocusedElement = null;

function syncLightbox(index) {
    lbCurrent = index;
    const img = galleryItems[index].querySelector('img');
    const caption = galleryItems[index].querySelector('.gallery-overlay span');
    lbImg.src = img.src;
    lbImg.alt = img.alt;
    lbCap.textContent = caption ? caption.textContent : '';
}

function preloadAdjacent(index) {
    const prevIndex = (index - 1 + galleryItems.length) % galleryItems.length;
    const nextIndex = (index + 1) % galleryItems.length;
    [prevIndex, nextIndex].forEach((i) => {
        if (i !== index) {
            const img = galleryItems[i].querySelector('img');
            if (img) {
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.as = 'image';
                link.href = img.src;
                if (!document.querySelector(`link[href="${img.src}"]`)) {
                    document.head.appendChild(link);
                }
            }
        }
    });
}

function openLightbox(index) {
    if (!lightbox.classList.contains('is-open')) {
        lastFocusedElement = document.activeElement;
    }

    syncLightbox(index);
    lightbox.classList.add('is-open');
    document.body.classList.add('scroll-lock');
    lightboxCloseBtn.focus();
    preloadAdjacent(index);
}

function closeLightbox() {
    lightbox.classList.remove('is-open');
    document.body.classList.remove('scroll-lock');
    if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
    }
}

function lbNavigate(dir) {
    lbCurrent = (lbCurrent + dir + galleryItems.length) % galleryItems.length;
    syncLightbox(lbCurrent);
    preloadAdjacent(lbCurrent);
}

galleryItems.forEach((item, i) => {
    item.addEventListener('click', () => openLightbox(i));
    item.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            openLightbox(i);
        }
    });
});

if (lightboxCloseBtn) {
    lightboxCloseBtn.addEventListener('click', closeLightbox);
}
if (lightboxPrevBtn) {
    lightboxPrevBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        lbNavigate(-1);
    });
}
if (lightboxNextBtn) {
    lightboxNextBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        lbNavigate(1);
    });
}
if (lightbox) {
    lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
            closeLightbox();
        }
    });
}

document.addEventListener('keydown', (event) => {
    if (menuToggle && menuToggle.classList.contains('active') && event.key === 'Escape') {
        menuToggle.click();
        return;
    }

    if (!lightbox || !lightbox.classList.contains('is-open')) {
        return;
    }

    if (event.key === 'Tab') {
        const focusable = [lightboxCloseBtn, lightboxPrevBtn, lightboxNextBtn].filter(Boolean);
        const currentIndex = focusable.indexOf(document.activeElement);
        const nextIndex = event.shiftKey
            ? (currentIndex <= 0 ? focusable.length - 1 : currentIndex - 1)
            : (currentIndex === focusable.length - 1 ? 0 : currentIndex + 1);

        event.preventDefault();
        focusable[nextIndex].focus();
        return;
    }

    if (event.key === 'Escape') {
        closeLightbox();
    }
    if (event.key === 'ArrowLeft') {
        lbNavigate(-1);
    }
    if (event.key === 'ArrowRight') {
        lbNavigate(1);
    }
});

/* ── Reveal on Scroll ── */
const revealEls = document.querySelectorAll(
    '.service-card, .room-card, ' +
        '.experience-text, .experience-image, ' +
        '.contact-info, ' +
        '.section-title, .section-subtitle'
);

revealEls.forEach((el) => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

revealEls.forEach((el) => revealObserver.observe(el));
