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
/* ── FUNCIÓN PARA MOSTRAR IMÁGENES COMPLETAS EN EL CARRUSEL ── */
(function fixCarouselImages() {
    
    // Función para ajustar cada imagen individualmente
    function adjustImageSize(imgElement, slideElement) {
        // Esperar a que la imagen se cargue
        imgElement.addEventListener('load', function() {
            const imgWidth = this.naturalWidth;
            const imgHeight = this.naturalHeight;
            const isPortrait = imgHeight > imgWidth;
            const isLandscape = imgWidth > imgHeight;
            const isSquare = imgWidth === imgHeight;
            
            console.log(`📸 Imagen: ${imgWidth}x${imgHeight}, ${isPortrait ? 'Vertical' : isLandscape ? 'Horizontal' : 'Cuadrada'}`);
            
            // Remover estilos inline previos
            slideElement.style.removeProperty('height');
            slideElement.style.removeProperty('max-height');
            imgElement.style.removeProperty('height');
            imgElement.style.removeProperty('width');
            imgElement.style.removeProperty('max-height');
            imgElement.style.removeProperty('object-fit');
            
            // Aplicar estilos según orientación
            if (isPortrait) {
                // Imagen vertical - se muestra completa con altura limitada
                slideElement.style.height = 'auto';
                slideElement.style.maxHeight = '450px';
                imgElement.style.height = 'auto';
                imgElement.style.maxHeight = '420px';
                imgElement.style.width = 'auto';
                imgElement.style.maxWidth = '100%';
                imgElement.style.objectFit = 'contain';
                imgElement.style.margin = '0 auto';
                imgElement.style.display = 'block';
            } 
            else if (isLandscape) {
                // Imagen horizontal - ocupa todo el ancho
                slideElement.style.height = 'auto';
                slideElement.style.maxHeight = '380px';
                imgElement.style.width = '100%';
                imgElement.style.height = 'auto';
                imgElement.style.maxHeight = '360px';
                imgElement.style.objectFit = 'contain';
                imgElement.style.backgroundColor = '#E7E1D4';
            } 
            else {
                // Imagen cuadrada
                slideElement.style.height = 'auto';
                slideElement.style.maxHeight = '380px';
                imgElement.style.width = '100%';
                imgElement.style.height = 'auto';
                imgElement.style.maxHeight = '360px';
                imgElement.style.objectFit = 'contain';
            }
            
            // Asegurar que el slide tenga fondo consistente
            slideElement.style.backgroundColor = '#E7E1D4';
            slideElement.style.display = 'flex';
            slideElement.style.alignItems = 'center';
            slideElement.style.justifyContent = 'center';
            
        }, { once: true });
        
        // Si la imagen ya está cargada
        if (imgElement.complete) {
            imgElement.dispatchEvent(new Event('load'));
        }
    }
    
    // Función principal
    function initImageAdjustment() {
        const slides = document.querySelectorAll('.carousel-slide');
        
        if (slides.length === 0) {
            console.log('⏳ Esperando carrusel...');
            setTimeout(initImageAdjustment, 500);
            return;
        }
        
        console.log(`🖼️ Ajustando ${slides.length} imágenes del carrusel`);
        
        slides.forEach((slide, index) => {
            const img = slide.querySelector('img');
            if (img) {
                // Aplicar estilos base al slide
                slide.style.display = 'flex';
                slide.style.alignItems = 'center';
                slide.style.justifyContent = 'center';
                slide.style.backgroundColor = '#E7E1D4';
                slide.style.overflow = 'hidden';
                
                // Ajustar la imagen
                adjustImageSize(img, slide);
            }
        });
    }
    
    // Ejecutar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initImageAdjustment);
    } else {
        initImageAdjustment();
    }
    
    // También ejecutar después de que todo cargue completamente
    window.addEventListener('load', function() {
        setTimeout(initImageAdjustment, 200);
    });
    
    // Reajustar cuando cambie el tamaño de la pantalla
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initImageAdjustment, 250);
    });
    
})();
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

/* ── Carrusel de Galería - COMPLETAMENTE CORREGIDO ── */
(function () {
    const track = document.querySelector('.carousel-track');
    const slides = Array.from(document.querySelectorAll('.carousel-slide'));
    const btnPrev = document.querySelector('.carousel-btn--prev');
    const btnNext = document.querySelector('.carousel-btn--next');
    const dotsWrap = document.querySelector('.carousel-dots');

    // Verificar que existan todos los elementos necesarios
    if (!track || !btnPrev || !btnNext || !dotsWrap || slides.length === 0) {
        console.error('❌ Carrusel: faltan elementos necesarios');
        return;
    }

    console.log(`✅ Carrusel iniciado con ${slides.length} imágenes`);

    let currentIndex = 0;
    let slideWidth = 0;
    let gap = 0;

    // Obtener cuántas imágenes mostrar según el ancho de pantalla
    function getSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1024) return 2;
        return 3;
    }

    let slidesPerView = getSlidesPerView();

    // Calcular el ancho de cada slide
    function calculateSlideWidth() {
        const trackContainer = document.querySelector('.carousel-track-container');
        if (!trackContainer) return 0;
        
        const containerWidth = trackContainer.clientWidth;
        const computedStyle = getComputedStyle(track);
        gap = parseFloat(computedStyle.gap) || 20;
        
        slideWidth = (containerWidth - (gap * (slidesPerView - 1))) / slidesPerView;
        
        // Aplicar ancho a cada slide
        slides.forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}px`;
            slide.style.minWidth = `${slideWidth}px`;
        });
        
        console.log(`📐 slidesPerView: ${slidesPerView}, slideWidth: ${slideWidth}px, gap: ${gap}px`);
        return slideWidth;
    }

    // Mover a un índice específico
    function goTo(index) {
        if (!track || slides.length === 0) return;
        
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        let newIndex = index;
        
        if (newIndex < 0) newIndex = 0;
        if (newIndex > maxIndex) newIndex = maxIndex;
        
        currentIndex = newIndex;
        
        const translateX = -(currentIndex * (slideWidth + gap));
        track.style.transform = `translate3d(${translateX}px, 0, 0)`;
        
        updateDots();
        updateButtons();
        
        console.log(`🎯 Moviendo a índice ${currentIndex}, translateX: ${translateX}px`);
    }

    // Siguiente slide
    function nextSlide() {
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        if (currentIndex < maxIndex) {
            goTo(currentIndex + 1);
        } else if (currentIndex === maxIndex && maxIndex > 0) {
            goTo(0);
        }
    }

    // Anterior slide
    function prevSlide() {
        if (currentIndex > 0) {
            goTo(currentIndex - 1);
        } else if (currentIndex === 0 && slides.length > slidesPerView) {
            goTo(Math.max(0, slides.length - slidesPerView));
        }
    }

    // Crear los dots de navegación
    function buildDots() {
        if (!dotsWrap) return;
        
        dotsWrap.innerHTML = '';
        const totalDots = Math.ceil(slides.length / slidesPerView);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            if (i === Math.floor(currentIndex / slidesPerView)) {
                dot.classList.add('active');
            }
            dot.setAttribute('aria-label', `Ir a grupo ${i + 1}`);
            dot.addEventListener('click', () => {
                goTo(i * slidesPerView);
            });
            dotsWrap.appendChild(dot);
        }
        
        console.log(`🎯 Creados ${totalDots} dots para ${slides.length} slides`);
    }

    // Actualizar los dots activos
    function updateDots() {
        const dots = document.querySelectorAll('.carousel-dot');
        const activeDotIndex = Math.floor(currentIndex / slidesPerView);
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === activeDotIndex);
        });
    }

    // Actualizar estado de los botones
    function updateButtons() {
        const maxIndex = Math.max(0, slides.length - slidesPerView);
        
        btnPrev.disabled = currentIndex === 0;
        btnPrev.style.opacity = currentIndex === 0 ? '0.4' : '1';
        btnPrev.style.cursor = currentIndex === 0 ? 'not-allowed' : 'pointer';
        
        btnNext.disabled = currentIndex >= maxIndex;
        btnNext.style.opacity = currentIndex >= maxIndex ? '0.4' : '1';
        btnNext.style.cursor = currentIndex >= maxIndex ? 'not-allowed' : 'pointer';
    }

    // Eventos de los botones
    btnPrev.addEventListener('click', prevSlide);
    btnNext.addEventListener('click', nextSlide);

    // Swipe con touch para móvil
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
    let autoPlayInterval = null;
    let isAutoPlaying = true;
    
    function startAutoPlay() {
        if (autoPlayInterval) clearInterval(autoPlayInterval);
        autoPlayInterval = setInterval(() => {
            if (isAutoPlaying) {
                const maxIndex = Math.max(0, slides.length - slidesPerView);
                if (currentIndex < maxIndex) {
                    goTo(currentIndex + 1);
                } else {
                    goTo(0);
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
    
    const carouselWrapper = document.querySelector('.carousel-wrapper');
    if (carouselWrapper) {
        carouselWrapper.addEventListener('mouseenter', () => {
            if (isAutoPlaying) stopAutoPlay();
        });
        carouselWrapper.addEventListener('mouseleave', () => {
            if (isAutoPlaying) startAutoPlay();
        });
    }

    // Recalcular al cambiar el tamaño de la ventana
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const newPerView = getSlidesPerView();
            if (newPerView !== slidesPerView) {
                slidesPerView = newPerView;
                calculateSlideWidth();
                buildDots();
                goTo(0);
            } else {
                calculateSlideWidth();
                goTo(currentIndex);
            }
        }, 150);
    });

    // Inicializar el carrusel
    function initCarousel() {
        calculateSlideWidth();
        buildDots();
        goTo(0);
        startAutoPlay();
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

/* ── Fix adicional para asegurar que el carrusel se muestre ── */
window.addEventListener('load', function() {
    // Forzar un resize para recalcular el carrusel
    setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        console.log('🔄 Resize forzado después de carga completa');
    }, 100);
});
/* ── FIX PARA ALTURA DE IMÁGENES ── */
window.addEventListener('load', function() {
    setTimeout(function() {
        const slides = document.querySelectorAll('.carousel-slide');
        const images = document.querySelectorAll('.carousel-slide img');
        
        slides.forEach(slide => {
            slide.style.height = 'auto';
            slide.style.maxHeight = '380px';
        });
        
        images.forEach(img => {
            img.style.height = 'auto';
            img.style.maxHeight = '360px';
            img.style.objectFit = 'contain';
        });
        
        console.log('✅ Fix de altura aplicado a ' + images.length + ' imágenes');
    }, 100);
});
