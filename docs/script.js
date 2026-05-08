// ========================================
// REFORMAS VESKO - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', () => {
  // Smooth scroll para enlaces internos
  initSmoothScroll();
  
  // Header scroll effect
  initHeaderScroll();
  
  // Animaciones al scroll
  initScrollAnimations();
  
  // Formulario de contacto
  initContactForm();
  
  // Menú móvil
  initMobileMenu();

  // Carrusel de testimonios
  initTestimonialsCarousel();

  // Contador de caracteres del mensaje
  initMessageCounter();

  // Visor ampliado de imagenes (zoom + movimiento)
  initImageViewer();
});

// Smooth scroll
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Header scroll effect
function initHeaderScroll() {
  const header = document.querySelector('.header');
  const hero = document.querySelector('.hero');
  const logoImg = header.querySelector('.logo img');

  if (!hero) return;

  // Usar IntersectionObserver para detectar cuándo salimos del hero
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.target === hero) {
          // Si el hero no está visible en la pantalla
          if (!entry.isIntersecting || entry.boundingClientRect.bottom < window.innerHeight / 2) {
            header.classList.add('scrolled');
            if (logoImg) {
              logoImg.src = 'logo1 - copia.png';
            }
          } else {
            header.classList.remove('scrolled');
            if (logoImg) {
              logoImg.src = 'logo2 - copia.png';
            }
          }
        }
      });
    },
    {
      threshold: 0
    }
  );

  observer.observe(hero);

  // Fallback también con scroll manual para mayor compatibilidad
  window.addEventListener('scroll', () => {
    const heroRect = hero.getBoundingClientRect();

    if (heroRect.bottom < 100) {
      header.classList.add('scrolled');
      if (logoImg && logoImg.src.includes('logo2')) {
        logoImg.src = 'logo1 - copia.png';
      }
    } else {
      header.classList.remove('scrolled');
      if (logoImg && logoImg.src.includes('logo1')) {
        logoImg.src = 'logo2 - copia.png';
      }
    }
  });
}

// Scroll animations con Intersection Observer
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observar elementos
  document.querySelectorAll('.service-card, .gallery-item, .about-content, .contact-info, .contact-form').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
  });

  // Aplicar estilos de animación
  const style = document.createElement('style');
  style.textContent = `
    .animate {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }
    .service-card:nth-child(1) { transition-delay: 0.1s; }
    .service-card:nth-child(2) { transition-delay: 0.2s; }
    .service-card:nth-child(3) { transition-delay: 0.3s; }
    .service-card:nth-child(4) { transition-delay: 0.4s; }
    .gallery-item:nth-child(1) { transition-delay: 0.1s; }
    .gallery-item:nth-child(2) { transition-delay: 0.2s; }
    .gallery-item:nth-child(3) { transition-delay: 0.3s; }
    .gallery-item:nth-child(4) { transition-delay: 0.4s; }
  `;
  document.head.appendChild(style);
}

// Formulario de contacto - Envía a WhatsApp
function initContactForm() {
  const form = document.getElementById('contactForm');
  
  if (form) {
    form.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Recoger datos del formulario
      const formData = new FormData(this);
      const nombre = formData.get('name');
      const telefono = formData.get('phone');
      const email = formData.get('email');
      const servicio = formData.get('service');
      const mensaje = formData.get('message');

      // Traducir servicio a texto
      const servicios = {
        'integral': 'Reforma integral',
        'bano': 'Baño',
        'cocina': 'Cocina',
        'tejado': 'Tejado/Terraza',
        'pintura': 'Pintura',
        'otro': 'Otro'
      };
      
      const servicioTexto = servicios[servicio] || servicio;

      // Construir mensaje SIN iconos
      let textoMensaje = `*NUEVA SOLICITUD DE PRESUPUESTO*\n\n`;
      textoMensaje += `*Nombre:* ${nombre}\n`;
      textoMensaje += `*Telefono:* ${telefono}\n`;
      textoMensaje += `*Tipo de reforma:* ${servicioTexto}\n`;

      // Añadir email solo si existe
      if (email && email.trim()) {
        textoMensaje += `*Email:* ${email}\n`;
      }

      // Añadir mensaje solo si existe
      if (mensaje && mensaje.trim()) {
        textoMensaje += `\n*Mensaje:* ${mensaje}\n`;
      }

      // Codificar el mensaje para URL
      const mensajeEncode = encodeURIComponent(textoMensaje);

      // Número de WhatsApp (sin el +)
      const telefono_whatsapp = '34663693976';

      // Abrir WhatsApp con el mensaje
      const urlWhatsapp = `https://wa.me/${telefono_whatsapp}?text=${mensajeEncode}`;
      window.open(urlWhatsapp, '_blank');
      
      // Feedback visual al usuario
      const btn = this.querySelector('.btn-whatsapp');
      const originalText = btn.innerHTML;
      btn.innerHTML = 'Abriendo WhatsApp...';
      btn.style.opacity = '0.7';

      // Resetear después de 2 segundos
      setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.opacity = '1';
        form.reset();
      }, 2000);
    });
  }
}

function initMessageCounter() {
  const textarea = document.getElementById('message');
  const counter = document.getElementById('messageCounter');

  if (!textarea || !counter) return;

  const max = parseInt(textarea.getAttribute('maxlength') || '200', 10);

  const updateCounter = () => {
    counter.textContent = `${textarea.value.length} / ${max}`;
  };

  textarea.addEventListener('input', updateCounter);
  updateCounter();
}

// Menú móvil
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');
  
  if (menuToggle && nav) {
    // Crear menú móvil una sola vez
    if (!document.querySelector('.mobile-menu')) {
      const navLinks = Array.from(nav.querySelectorAll('.nav-link'))
        .map(link => `<a href="${link.getAttribute('href')}" class="mobile-nav-link">${link.textContent.trim()}</a>`)
        .join('');
      const cta = document.querySelector('.btn-cta');
      const ctaLink = cta ? cta.getAttribute('href') : '#contact';
      const ctaLabel = cta ? cta.textContent.trim() : 'Presupuesto';

      const mobileMenu = document.createElement('div');
      mobileMenu.className = 'mobile-menu';
      mobileMenu.innerHTML = `
        <nav class="mobile-nav">
          ${navLinks}
          <a href="${ctaLink}" class="mobile-btn-presupuesto">${ctaLabel}</a>
        </nav>
      `;
      document.body.appendChild(mobileMenu);

      // Añadir estilos
      const style = document.createElement('style');
      style.textContent = `
        .mobile-menu {
          position: fixed;
          top: 80px;
          left: 0;
          right: 0;
          background: white;
          padding: 30px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.1);
          transform: translateY(-12px);
          opacity: 0;
          transition: all 0.3s ease;
          z-index: 999;
          max-height: calc(100vh - 80px);
          overflow-y: auto;
          pointer-events: none;
        }
        .mobile-menu.active {
          transform: translateY(0);
          opacity: 1;
          pointer-events: auto;
        }
        .mobile-nav {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .mobile-nav-link {
          font-size: 18px;
          font-weight: 500;
          padding: 10px 0;
          color: var(--primary);
          transition: all 0.3s ease;
        }
        .mobile-nav-link:hover {
          color: var(--secondary);
          padding-left: 10px;
        }
        .mobile-nav-link:last-of-type {
          padding-bottom: 10px;
          margin-bottom: 10px;
        }
        .mobile-btn-presupuesto {
          display: block;
          padding: 14px 24px !important;
          background: var(--secondary);
          color: var(--white) !important;
          border-radius: 50px;
          font-size: 16px;
          font-weight: 600;
          text-align: center;
          border: none;
          margin-top: 10px;
          transition: all 0.3s ease;
        }
        .mobile-btn-presupuesto:hover {
          background: #ff8533;
          color: var(--white) !important;
          transform: translateY(-2px);
          padding-left: 24px !important;
        }
      `;
      document.head.appendChild(style);
    }

    const mobileMenu = document.querySelector('.mobile-menu');
    const closeMobileMenu = () => {
      menuToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    };

    const syncMobileMenuOffset = () => {
      const headerHeight = header ? header.offsetHeight : 80;
      mobileMenu.style.top = `${headerHeight}px`;
      mobileMenu.style.maxHeight = `calc(100vh - ${headerHeight}px)`;
    };

    syncMobileMenuOffset();
    window.addEventListener('resize', () => {
      syncMobileMenuOffset();
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    });

    // Toggle del menú
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      menuToggle.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.addEventListener('click', () => {
        closeMobileMenu();
      });
    });

    // Cerrar menú al hacer click en el botón presupuesto
    document.querySelector('.mobile-btn-presupuesto').addEventListener('click', () => {
      closeMobileMenu();
    });

    // Cerrar menú al hacer click fuera de él
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMobileMenu();
      }
    });
  }
}

// Carrusel de Testimonios
function initTestimonialsCarousel() {
  const track = document.querySelector('.carousel-track');
  const items = document.querySelectorAll('.carousel-item');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dots = document.querySelectorAll('.dot');
  const wrapper = document.querySelector('.carousel-wrapper');

  if (!track || !items.length) return;

  let currentIndex = 0;
  let autoSlideInterval;
  
  function getTrackGap() {
    const computedGap = parseFloat(window.getComputedStyle(track).columnGap || window.getComputedStyle(track).gap);
    return Number.isNaN(computedGap) ? 0 : computedGap;
  }

  // Calcular el desplazamiento
  function calculateTranslate() {
    const itemWidth = track.querySelector('.carousel-item').offsetWidth;
    const displacement = (itemWidth + getTrackGap()) * currentIndex;
    return -displacement;
  }

  // Actualizar posición del carrusel
  function updateCarouselPosition() {
    const translateValue = calculateTranslate();
    track.style.transform = `translateX(${translateValue}px)`;

    // Actualizar dots
    dots.forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  // Ir al siguiente
  function nextSlide() {
    currentIndex = (currentIndex + 1) % items.length;
    updateCarouselPosition();
  }

  // Ir al anterior
  function prevSlide() {
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    updateCarouselPosition();
  }

  // Iniciar auto-slide
  function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    autoSlideInterval = setInterval(() => {
      nextSlide();
    }, 4000);
  }

  // Pausar auto-slide
  function pauseAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
  }

  // Event listeners para botones
  prevBtn.addEventListener('click', () => {
    prevSlide();
    pauseAutoSlide();
    startAutoSlide();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    pauseAutoSlide();
    startAutoSlide();
  });

  // Event listeners para dots
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      updateCarouselPosition();
      pauseAutoSlide();
      startAutoSlide();
    });
  });

  // Pausar al pasar el mouse
  wrapper.addEventListener('mouseenter', pauseAutoSlide);
  wrapper.addEventListener('mouseleave', startAutoSlide);

  // Recalibrar en cambios de viewport (evita cortes al activar modo móvil sin recargar)
  function syncCarouselLayout() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        updateCarouselPosition();
      });
    });
  }

  window.addEventListener('resize', syncCarouselLayout);
  window.addEventListener('orientationchange', syncCarouselLayout);
  window.addEventListener('pageshow', syncCarouselLayout);

  // Si la pestaña vuelve a estar visible, revalida medidas del carrusel
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      syncCarouselLayout();
    }
  });

  window.addEventListener('load', () => {
    updateCarouselPosition();
  });

  // Inicializar
  updateCarouselPosition();

  // Iniciar auto-slide automáticamente
  startAutoSlide();
}

// Efecto parallax suave en el hero
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
  }
});

function initImageViewer() {
  const galleryImages = document.querySelectorAll('.project-shot img, .general-gallery-grid img, .gallery-item img');
  if (!galleryImages.length) return;

  const viewer = document.createElement('div');
  viewer.className = 'image-viewer';
  viewer.setAttribute('aria-hidden', 'true');
  viewer.innerHTML = `
    <div class="image-viewer-backdrop"></div>
    <div class="image-viewer-panel">
      <button class="image-viewer-btn" data-action="zoom-out" aria-label="Reducir zoom">-</button>
      <button class="image-viewer-btn" data-action="zoom-in" aria-label="Aumentar zoom">+</button>
      <button class="image-viewer-btn" data-action="reset" aria-label="Restablecer vista">Reset</button>
      <button class="image-viewer-btn close" data-action="close" aria-label="Cerrar">×</button>
    </div>
    <div class="image-viewer-stage">
      <img class="image-viewer-img" alt="">
    </div>
  `;
  document.body.appendChild(viewer);

  const viewerImg = viewer.querySelector('.image-viewer-img');
  const stage = viewer.querySelector('.image-viewer-stage');
  const backdrop = viewer.querySelector('.image-viewer-backdrop');
  const controls = viewer.querySelector('.image-viewer-panel');

  let scale = 1;
  let translateX = 0;
  let translateY = 0;
  let isDragging = false;
  let dragStartX = 0;
  let dragStartY = 0;
  const minScale = 1;
  const maxScale = 4;

  function applyTransform() {
    viewerImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(${scale})`;
    viewerImg.style.cursor = scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in';
  }

  function resetView() {
    scale = 1;
    translateX = 0;
    translateY = 0;
    applyTransform();
  }

  function openViewer(img) {
    viewerImg.src = img.src;
    viewerImg.alt = img.alt || 'Imagen ampliada';
    resetView();
    viewer.classList.add('active');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeViewer() {
    viewer.classList.remove('active');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    isDragging = false;
  }

  function zoom(delta) {
    const nextScale = Math.max(minScale, Math.min(maxScale, scale + delta));
    if (nextScale === minScale) {
      translateX = 0;
      translateY = 0;
    }
    scale = nextScale;
    applyTransform();
  }

  galleryImages.forEach(img => {
    img.addEventListener('click', () => openViewer(img));
  });

  controls.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.getAttribute('data-action');
    if (action === 'zoom-in') zoom(0.25);
    if (action === 'zoom-out') zoom(-0.25);
    if (action === 'reset') resetView();
    if (action === 'close') closeViewer();
  });

  backdrop.addEventListener('click', closeViewer);

  document.addEventListener('keydown', (e) => {
    if (!viewer.classList.contains('active')) return;
    if (e.key === 'Escape') closeViewer();
    if (e.key === '+' || e.key === '=') zoom(0.25);
    if (e.key === '-') zoom(-0.25);
    if (e.key.toLowerCase() === 'r') resetView();
  });

  stage.addEventListener('wheel', (e) => {
    if (!viewer.classList.contains('active')) return;
    e.preventDefault();
    zoom(e.deltaY < 0 ? 0.2 : -0.2);
  }, { passive: false });

  viewerImg.addEventListener('mousedown', (e) => {
    if (scale <= 1) return;
    isDragging = true;
    dragStartX = e.clientX - translateX;
    dragStartY = e.clientY - translateY;
    applyTransform();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    translateX = e.clientX - dragStartX;
    translateY = e.clientY - dragStartY;
    applyTransform();
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    applyTransform();
  });
}
