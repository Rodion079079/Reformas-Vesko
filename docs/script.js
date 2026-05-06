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
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
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
  
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      menuToggle.classList.toggle('active');
      nav.classList.toggle('active');
      
      // Crear menú móvil si no existe
      if (!document.querySelector('.mobile-menu')) {
        const mobileMenu = document.createElement('div');
        mobileMenu.className = 'mobile-menu';
        mobileMenu.innerHTML = `
          <nav class="mobile-nav">
            <a href="#about">Nosotros</a>
            <a href="#services">Servicios</a>
            <a href="#work">Proyectos</a>
            <a href="#contact">Contacto</a>
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
            transform: translateY(-100%);
            opacity: 0;
            transition: all 0.3s ease;
            z-index: 999;
          }
          .mobile-menu.active {
            transform: translateY(0);
            opacity: 1;
          }
          .mobile-nav {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }
          .mobile-nav a {
            font-size: 18px;
            font-weight: 500;
            padding: 10px 0;
            border-bottom: 1px solid #eee;
          }
        `;
        document.head.appendChild(style);
      }
      
      document.querySelector('.mobile-menu').classList.toggle('active');
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
  let itemsPerView = 3;
  let gap = 30;
  let autoSlideInterval;
  let isAutoSliding = true;

  // Detectar items por vista según el tamaño de pantalla
  function updateItemsPerView() {
    if (window.innerWidth <= 768) {
      itemsPerView = 1;
    } else if (window.innerWidth <= 1024) {
      itemsPerView = 2;
    } else {
      itemsPerView = 3;
    }
  }

  // Calcular el desplazamiento
  function calculateTranslate() {
    const itemWidth = track.querySelector('.carousel-item').offsetWidth;
    const displacement = (itemWidth + gap) * currentIndex;
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

  // Actualizar elementos por vista al redimensionar
  window.addEventListener('resize', () => {
    updateItemsPerView();
    updateCarouselPosition();
  });

  // Inicializar
  updateItemsPerView();
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
