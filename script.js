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

/* ── Orientación de imágenes responsive ── */
(function () {
    const responsiveImages = document.querySelectorAll('img[width][height]');

    responsiveImages.forEach((img) => {
        const width = Number(img.getAttribute('width'));
        const height = Number(img.getAttribute('height'));

        if (!width || !height) {
            return;
        }

        if (height > width) {
            img.dataset.orientation = 'portrait';
            return;
        }

        if (width > height) {
            img.dataset.orientation = 'landscape';
            return;
        }

        img.dataset.orientation = 'square';
    });
})();

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
                autoplayBtn.setAttribute('aria-pressed', 'false');
            }
        } else {
            isPlaying = true;
            startAutoplay();
            if (autoplayBtn) {
                autoplayBtn.setAttribute('aria-label', 'Pausar carrusel');
                autoplayBtn.setAttribute('aria-pressed', 'true');
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

    if (autoplayBtn) {
        if (isPlaying) {
            autoplayBtn.setAttribute('aria-label', 'Pausar carrusel');
            autoplayBtn.setAttribute('aria-pressed', 'true');
        } else {
            autoplayBtn.setAttribute('aria-label', 'Reproducir carrusel');
            autoplayBtn.setAttribute('aria-pressed', 'false');
        }
    }

    if (isPlaying) {
        startAutoplay();
    }
})();

/* ── Carrusel de Galería - CORREGIDO TOTALMENTE ── */
(function () {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const btnPrev = document.querySelector('.carousel-btn--prev');
    const btnNext = document.querySelector('.carousel-btn--next');
    const dotsWrap = document.querySelector('.carousel-dots');
    const trackContainer = document.querySelector('.carousel-track-container');

    if (!track || !btnPrev || !btnNext || !dotsWrap || slides.length === 0) {
        console.warn('Carrusel: no se encontraron elementos necesarios');
        return;
    }

    console.log(`📸 Carrusel inicializado con ${slides.length} imágenes`);

    let currentIndex = 0;
    let autoPlayInterval = null;
    let isAutoPlaying = true;

    // Función para obtener cuántas imágenes mostrar según el ancho
    function getSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 992) return 2;
        return 3;
    }

    let slidesPerView = getSlidesPerView();

    // Función para calcular y aplicar el ancho de cada slide
    function updateSlideWidth() {
        if (!trackContainer) return;
        
        const containerWidth = trackContainer.clientWidth;
        const computedStyle = getComputedStyle(track);
        const gap = parseFloat(computedStyle.gap) || 22;
        
        // Calcular ancho de cada slide
        const slideWidth = (containerWidth - (gap * (slidesPerView - 1))) / slidesPerView;
        
        // Aplicar ancho a cada slide
        slides.forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}px`;
            slide.style.minWidth = `${slideWidth}px`;
        });
        
        return slideWidth;
    }

    // Función para mover el carrusel
    function moveToSlide(index) {
        if (!track || slides.length === 0) return;
        
        // Calcular límites
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        let newIndex = index;
        
        if (newIndex < 0) newIndex = 0;
        if (newIndex > maxIndex) newIndex = maxIndex;
        
        currentIndex = newIndex;
        
        // Calcular el desplazamiento
        const computedStyle = getComputedStyle(track);
        const gap = parseFloat(computedStyle.gap) || 22;
        const slideWidth = slides[0].getBoundingClientRect().width;
        
        const translateX = -(currentIndex * (slideWidth + gap));
        track.style.transform = `translateX(${translateX}px)`;
        
        // Actualizar dots
        updateDots();
        
        // Actualizar estado de botones
        updateButtons();
        
        console.log(`📸 Moviendo a índice ${currentIndex}, maxIndex: ${maxIndex}`);
    }

    // Crear dots (UN DOT POR CADA IMAGEN)
    function buildDots() {
        if (!dotsWrap) return;
        
        dotsWrap.innerHTML = '';
        
        // Crear un dot por cada imagen
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === currentIndex) dot.classList.add('active');
            dot.setAttribute('aria-label', `Ir a imagen ${i + 1}`);
            dot.addEventListener('click', () => {
                moveToSlide(i);
                resetAutoPlay();
            });
            dotsWrap.appendChild(dot);
        }
        
        console.log(`📸 Creados ${slides.length} dots`);
    }

    // Actualizar dots activos
    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    // Actualizar botones (prev/next)
    function updateButtons() {
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        
        if (btnPrev) {
            const disabled = currentIndex === 0;
            btnPrev.disabled = disabled;
            btnPrev.style.opacity = disabled ? '0.4' : '1';
            btnPrev.style.cursor = disabled ? 'not-allowed' : 'pointer';
        }
        
        if (btnNext) {
            const disabled = currentIndex >= maxIndex;
            btnNext.disabled = disabled;
            btnNext.style.opacity = disabled ? '0.4' : '1';
            btnNext.style.cursor = disabled ? 'not-allowed' : 'pointer';
        }
    }

    // Siguiente imagen
    function nextSlide() {
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        if (currentIndex < maxIndex) {
            moveToSlide(currentIndex + 1);
        } else if (currentIndex === maxIndex && maxIndex > 0) {
            moveToSlide(0); // Loop infinito
        }
        resetAutoPlay();
    }

    // Anterior imagen
    function prevSlide() {
        if (currentIndex > 0) {
            moveToSlide(currentIndex - 1);
        } else if (currentIndex === 0 && slides.length > slidesPerView) {
            moveToSlide(Math.max(0, slides.length - slidesPerView)); // Ir al final
        }
        resetAutoPlay();
    }

    // Autoplay
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (isAutoPlaying && slides.length > slidesPerView) {
                const maxIndex = Math.max(0, slides.length - slidesPerView);
                if (currentIndex < maxIndex) {
                    moveToSlide(currentIndex + 1);
                } else {
                    moveToSlide(0);
                }
            }
        }, 5000);
    }

    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
            autoPlayInterval = null;
        }
    }

    function resetAutoPlay() {
        if (isAutoPlaying) {
            stopAutoPlay();
            startAutoPlay();
        }
    }

    // Eventos de botones
    btnPrev.addEventListener('click', prevSlide);
    btnNext.addEventListener('click', nextSlide);

    // Swipe touch para móvil
    let touchStartX = 0;
    let touchEndX = 0;
    
    track.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    });

    // Pausar autoplay al hacer hover
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', () => {
            if (isAutoPlaying) stopAutoPlay();
        });
        carouselWrapper.addEventListener('mouseleave', () => {
            if (isAutoPlaying) startAutoPlay();
        });
    }

    // Recalcular al cambiar el tamaño de la pantalla
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newSlidesPerView = getSlidesPerView();
            if (newSlidesPerView !== slidesPerView) {
                slidesPerView = newSlidesPerView;
                updateSlideWidth();
                moveToSlide(0);
            } else {
                updateSlideWidth();
                moveToSlide(currentIndex);
            }
        }, 150);
    });

    // INICIALIZAR CARRUSEL
    function initCarousel() {
        updateSlideWidth();
        buildDots();
        moveToSlide(0);
        startAutoPlay();
        
        // Forzar reflow después de que todas las imágenes carguen
        setTimeout(() => {
            updateSlideWidth();
            moveToSlide(0);
        }, 100);
    }
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCarousel);
    } else {
        initCarousel();
    }
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

const prefetchedSrcs = new Set();

function preloadAdjacent(index) {
    const prevIndex = (index - 1 + galleryItems.length) % galleryItems.length;
    const nextIndex = (index + 1) % galleryItems.length;
    [prevIndex, nextIndex].forEach((i) => {
        if (i !== index) {
            const img = galleryItems[i].querySelector('img');
            if (img && !prefetchedSrcs.has(img.src)) {
                prefetchedSrcs.add(img.src);
                const link = document.createElement('link');
                link.rel = 'prefetch';
                link.as = 'image';
                link.href = img.src;
                document.head.appendChild(link);
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

/* ── Room Thumbnails → Lightbox ── */
document.querySelectorAll('.room-thumb').forEach((thumb) => {
    function openRoomPhoto() {
        const src = thumb.dataset.src;
        const idx = galleryItems.findIndex((item) => {
            const img = item.querySelector('img');
            return img && img.getAttribute('src') === src;
        });
        if (idx !== -1) {
            openLightbox(idx);
        } else {
            if (!lightbox.classList.contains('is-open')) {
                lastFocusedElement = document.activeElement;
            }
            lbCurrent = 0;
            lbImg.src = src;
            lbImg.alt = thumb.querySelector('img').alt;
            lbCap.textContent = '';
            lightbox.classList.add('is-open');
            document.body.classList.add('scroll-lock');
            if (lightboxCloseBtn) lightboxCloseBtn.focus();
        }
    }
    thumb.addEventListener('click', openRoomPhoto);
    thumb.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openRoomPhoto();
        }
    });
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
/* ── FIX DE EMERGENCIA PARA FORZAR EL CARRUSEL ── */
(function forceCarouselFix() {
    // Esperar a que todo cargue
    window.addEventListener('load', function() {
        const track = document.querySelector('.carousel-track');
        const slides = document.querySelectorAll('.carousel-slide');
        const trackContainer = document.querySelector('.carousel-track-container');
        
        if (!track || slides.length === 0) {
            console.error('❌ No se encontró el carrusel');
            return;
        }
        
        console.log(`✅ Forzando carrusel con ${slides.length} imágenes`);
        
        // Forzar estilos inline
        track.style.display = 'flex';
        track.style.flexDirection = 'row';
        track.style.transition = 'transform 0.5s ease-in-out';
        track.style.width = 'auto';
        track.style.minWidth = '100%';
        
        if (trackContainer) {
            trackContainer.style.overflow = 'visible';
            trackContainer.style.width = '100%';
        }
        
        // Forzar que cada slide sea visible
        slides.forEach((slide, index) => {
            slide.style.display = 'block';
            slide.style.visibility = 'visible';
            slide.style.opacity = '1';
            slide.style.flex = '0 0 auto';
            console.log(`✅ Slide ${index + 1} forzado`);
        });
        
        // Calcular ancho total y aplicar estilos específicos
        function applyStyles() {
            const containerWidth = trackContainer ? trackContainer.clientWidth : window.innerWidth;
            let slideWidth;
            
            if (window.innerWidth <= 768) {
                slideWidth = containerWidth - 40;
                slides.forEach(slide => {
                    slide.style.flex = `0 0 ${slideWidth}px`;
                    slide.style.minWidth = `${slideWidth}px`;
                });
            } else if (window.innerWidth <= 992) {
                slideWidth = (containerWidth - 40) / 2;
                slides.forEach(slide => {
                    slide.style.flex = `0 0 ${slideWidth}px`;
                    slide.style.minWidth = `${slideWidth}px`;
                });
            } else {
                slideWidth = (containerWidth - 60) / 3;
                slides.forEach(slide => {
                    slide.style.flex = `0 0 ${slideWidth}px`;
                    slide.style.minWidth = `${slideWidth}px`;
                });
            }
            
            console.log(`📐 Ancho de slide: ${slideWidth}px, Pantalla: ${window.innerWidth}px`);
        }
        
        applyStyles();
        window.addEventListener('resize', applyStyles);
        
        // Pequeño timeout para asegurar
        setTimeout(() => {
            applyStyles();
            console.log('🔄 Re-aplicando estilos después de timeout');
        }, 100);
    });
})();
