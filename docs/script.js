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
      const data = {
        nombre: formData.get('name'),
        telefono: formData.get('phone'),
        email: formData.get('email'),
        servicio: formData.get('service'),
        mensaje: formData.get('message')
      };
      
      // Traducir servicio a texto
      const servicios = {
        'integral': 'Reforma integral',
        'bano': 'Baño',
        'cocina': 'Cocina',
        'tejado': 'Tejado/Terraza',
        'pintura': 'Pintura',
        'otro': 'Otro'
      };
      
      const servicioTexto = servicios[data.servicio] || data.servicio;
      
      // Crear mensaje formateado con iconos de WhatsApp
      const mensaje = `*NUEVA SOLICITUD DE PRESUPUESTO* %0A%0A` +
        `%F0%9F%91%A4 *Nombre:* ${data.nombre}%0A` +
        `%F0%9F%93%8E *Teléfono:* ${data.telefono}%0A` +
        `%F0%9F%93%A7 *Email:* ${data.email || 'No especificado'}%0A` +
        `%F0%9F%94%A7 *Tipo de reforma:* ${servicioTexto}%0A` +
        `%F0%9F%92%AC *Mensaje:* ${data.mensaje || 'Sin mensaje adicional'}%0A%0A` +
        `_Enviado desde la web de Vesko_`;
      
      // Número de WhatsApp (sin el +)
      const telefono = '34663693976';
      
      // Abrir WhatsApp con el mensaje
      const urlWhatsapp = `https://wa.me/${telefono}?text=${mensaje}`;
      window.open(urlWhatsapp, '_blank');
      
      // Feedback visual al usuario
      const btn = this.querySelector('.btn-submit');
      const originalText = btn.textContent;
      btn.innerHTML = '&#128172; Enviando a WhatsApp...';
      btn.style.background = '#25D366';
      
      // Resetear después de 2 segundos
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        form.reset();
      }, 2000);
    });
  }
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

// Efecto parallax suave en el hero
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrolled = window.pageYOffset;
    hero.style.backgroundPositionY = scrolled * 0.5 + 'px';
  }
});