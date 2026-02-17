/* ============================================
   ESPACE BEACH AHOUÉ - JAVASCRIPT
   Interactive functionality for the website
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // WhatsApp configuration (à remplacer avec le vrai numéro)
  whatsappNumber: '22507941094', // Format: code pays + numéro sans espaces

  // Messages pré-remplis pour WhatsApp
  messages: {
    general: "Bonjour Espace Beach Ahoué 👋\nJe souhaite avoir des informations.\nMerci 🙂",
    chambre: "Bonjour Espace Beach Ahoué 👋\nJe souhaite avoir des informations sur vos chambres / réserver une chambre.\nMerci 🙂",
    restaurant: "Bonjour 👋\nJe souhaite consulter le menu ou réserver une table à Espace Beach Ahoué.\nMerci 🙂",
    evenement: "Bonjour 👋\nJe souhaite organiser un événement à Espace Beach Ahoué, je voudrais plus d'informations.\nMerci 🙂"
  }
};

// ============================================
// WHATSAPP INTEGRATION
// ============================================
function createWhatsAppLink(messageType = 'general') {
  const message = CONFIG.messages[messageType] || CONFIG.messages.general;
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodedMessage}`;
}

function initWhatsAppButtons() {
  // Bouton flottant
  const floatButton = document.getElementById('whatsappFloat');
  if (floatButton) {
    floatButton.href = createWhatsAppLink('general');
  }

  // Bouton footer
  const footerButton = document.getElementById('whatsappFooter');
  if (footerButton) {
    footerButton.href = createWhatsAppLink('general');
  }

  // Bouton contact
  const contactButton = document.getElementById('whatsappContact');
  if (contactButton) {
    contactButton.href = createWhatsAppLink('general');
  }

  // Tous les boutons avec classe btn-whatsapp
  const whatsappButtons = document.querySelectorAll('.btn-whatsapp');
  whatsappButtons.forEach(button => {
    const href = button.getAttribute('href');

    // Déterminer le type de message selon la section
    let messageType = 'general';
    const buttonText = button.textContent.toLowerCase();

    if (buttonText.includes('chambre')) {
      messageType = 'chambre';
    } else if (buttonText.includes('menu') || buttonText.includes('commander') || buttonText.includes('restaurant')) {
      messageType = 'restaurant';
    } else if (buttonText.includes('événement') || buttonText.includes('organiser')) {
      messageType = 'evenement';
    }

    // Ne modifier que si c'est un lien vers #contact ou vide
    if (href === '#contact' || href === '#' || !href) {
      button.href = createWhatsAppLink(messageType);
      button.target = '_blank';
      button.rel = 'noopener noreferrer';
    }
  });
}

// ============================================
// NAVIGATION
// ============================================
function initNavigation() {
  const navbar = document.getElementById('navbar');
  const mobileMenuToggle = document.getElementById('mobileMenuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Scroll effect sur la navbar
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, { passive: true });

  // Toggle mobile menu
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');

      // Animation de l'icône
      if (navMenu.classList.contains('active')) {
        mobileMenuToggle.textContent = '✕';
      } else {
        mobileMenuToggle.textContent = '☰';
      }
    });
  }

  // Smooth scroll et fermeture du menu mobile
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');

      // Vérifier si c'est un lien d'ancre
      if (href && href.startsWith('#')) {
        e.preventDefault();

        const targetId = href.substring(1);
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          // Calculer l'offset pour la navbar fixe
          const navbarHeight = navbar.offsetHeight;
          const targetPosition = targetSection.offsetTop - navbarHeight;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Fermer le menu mobile
          if (navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileMenuToggle.textContent = '☰';
          }
        }
      }
    });
  });

  // Fermer le menu mobile en cliquant en dehors
  document.addEventListener('click', (e) => {
    if (navMenu && navMenu.classList.contains('active')) {
      if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        mobileMenuToggle.textContent = '☰';
      }
    }
  });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observer tous les éléments avec la classe fade-in
  const fadeElements = document.querySelectorAll('.fade-in');
  fadeElements.forEach(element => {
    observer.observe(element);
  });
}

// ============================================
// GALLERY LIGHTBOX
// ============================================
function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = item.querySelector('img');
      if (img) {
        openLightbox(img.src, img.alt);
      }
    });
  });
}

function initGlobalLightbox() {
  // Select all images within the main content sections
  const sections = document.querySelectorAll('#presentation, #hebergement, #restaurant, #evenements, #actualites, #galerie');
  const candidates = [];

  sections.forEach(section => {
    const images = section.querySelectorAll('img');
    images.forEach(img => {
      // Exclude logic:
      // 1. Icons (often small or svg, or specific classes)
      // 2. Already in a gallery item (handled by initGallery)
      // 3. Explicitly excluded classes (like btn-icon)
      if (img.closest('.gallery-item')) return;
      if (img.classList.contains('logo-img')) return;
      if (img.classList.contains('btn-icon')) return;
      if (img.closest('.event-icon')) return;

      // Filter out small icons based on natural size if loaded, or class naming
      // Assuming content images are larger. 
      // Let's rely on container classes to be safe, but broaden the scope.

      // SIMPLIFIED APPROACH: Include all images in these sections, unless explicitly excluded above.
      candidates.push(img);
    });
  });

  candidates.forEach(img => {
    img.style.cursor = 'pointer';
    img.style.transition = 'transform 0.3s ease';

    img.addEventListener('mouseenter', () => {
      img.style.transform = 'scale(1.02)';
    });
    img.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });

    img.addEventListener('click', (e) => {
      e.stopPropagation();
      openLightbox(img.src, img.alt);
    });
  });
}

function openLightbox(src, alt) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Fermer">✕</button>
      <img src="${src}" alt="${alt}">
    </div>
  `;

  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';

  let closed = false;
  const closeLightbox = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', escapeHandler);
    lightbox.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      try {
        if (lightbox.parentNode) {
          lightbox.parentNode.removeChild(lightbox);
        }
      } catch (e) {
        console.error("Erreur fermeture lightbox:", e);
      } finally {
        // Force restoration of scroll
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }, 300);
  };

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// ============================================
// MENU ITEM MODAL
// ============================================
function initMenuModal() {
  const menuCards = document.querySelectorAll('.menu-card');

  menuCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
      const img = card.querySelector('.menu-card-img');
      const title = card.querySelector('.menu-card-title').textContent;
      const price = card.querySelector('.menu-card-price').textContent;
      const desc = card.querySelector('.menu-card-desc').textContent;

      if (img) {
        openMenuModal(img.src, title, price, desc);
      }
    });
  });
}

function openMenuModal(src, title, price, desc) {
  const isAccommodation = window.location.pathname.includes('hebergement.html');
  const buttonText = isAccommodation ? "Réserver cette chambre" : "Commander ce plat";
  const waMessage = isAccommodation ? "Bonjour, je souhaite réserver la chambre : " : "Bonjour, je souhaite commander : ";

  const modal = document.createElement('div');
  modal.className = 'menu-modal';
  modal.innerHTML = `
    <div class="menu-modal-overlay"></div>
    <div class="menu-modal-content">
      <button class="menu-modal-close" aria-label="Fermer">✕</button>
      <div class="menu-modal-grid">
        <div class="menu-modal-img">
          <img src="${src}" alt="${title}">
        </div>
        <div class="menu-modal-info">
          <h2 class="menu-modal-title">${title}</h2>
          <div class="menu-modal-price">${price}</div>
          <p class="menu-modal-description">${desc}</p>
          <a href="https://wa.me/22507941094?text=${encodeURIComponent(waMessage + title)}" target="_blank" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
            <i class="ph ph-whatsapp-logo"></i> ${buttonText}
          </a>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  let closed = false;
  const closeModal = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', escapeHandler);
    modal.classList.add('closing');
    modal.classList.add('closing');
    setTimeout(() => {
      try {
        if (modal.parentNode) {
          modal.parentNode.removeChild(modal);
        }
      } catch (e) {
        console.error("Erreur fermeture modal:", e);
      } finally {
        // Force restoration of scroll
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }, 300);
  };

  modal.querySelector('.menu-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.menu-modal-overlay').addEventListener('click', closeModal);

  // Close with Escape key
  const escapeHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  };
  document.addEventListener('keydown', escapeHandler);
}

// ============================================
// VIRTUAL TOUR MODAL
// ============================================
function initVirtualTour() {
  const tourBadges = document.querySelectorAll('.virtual-tour-badge a');

  tourBadges.forEach(badge => {
    badge.addEventListener('click', (e) => {
      e.stopPropagation(); // Empêche de déclencher le modal de la chambre
      const tourUrl = badge.getAttribute('data-tour-url');
      if (tourUrl) {
        e.preventDefault();
        openVirtualTourModal(tourUrl);
      }
    });
  });
}

function openVirtualTourModal(url) {
  const modal = document.createElement('div');
  modal.className = 'menu-modal tour-modal';
  modal.innerHTML = `
    <div class="menu-modal-overlay"></div>
    <div class="menu-modal-content tour-modal-content" style="max-width: 90%; width: 1000px; height: 80vh;">
      <button class="menu-modal-close" aria-label="Fermer">✕</button>
      <iframe src="${url}" width="100%" height="100%" style="border:0; border-radius: 8px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  `;

  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';

  const closeModal = () => {
    modal.classList.add('closing');
    setTimeout(() => {
      if (modal.parentNode) modal.parentNode.removeChild(modal);
      document.body.style.overflow = '';
    }, 300);
  };

  modal.querySelector('.menu-modal-close').addEventListener('click', closeModal);
  modal.querySelector('.menu-modal-overlay').addEventListener('click', closeModal);
}

// ============================================
// LAZY LOADING IMAGES
// ============================================
function initLazyLoading() {
  const images = document.querySelectorAll('img[src]');

  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });

  images.forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// SMOOTH SCROLL TO TOP
// ============================================
function initScrollToTop() {
  // Créer un bouton scroll to top (optionnel)
  const scrollButton = document.createElement('button');
  scrollButton.className = 'scroll-to-top';
  scrollButton.innerHTML = '↑';
  scrollButton.setAttribute('aria-label', 'Retour en haut');

  const style = document.createElement('style');
  style.textContent = `
    .scroll-to-top {
      position: fixed;
      bottom: 6rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      background-color: var(--color-ochre);
      color: white;
      border: none;
      border-radius: 50%;
      font-size: 1.5rem;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 199;
      box-shadow: var(--shadow-md);
    }
    
    .scroll-to-top.visible {
      opacity: 1;
      visibility: visible;
    }
    
    .scroll-to-top:hover {
      background-color: var(--color-palm);
      transform: translateY(-3px);
    }
    
    @media (max-width: 768px) {
      .scroll-to-top {
        bottom: 5rem;
        right: 1rem;
        width: 45px;
        height: 45px;
      }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(scrollButton);

  // Afficher/masquer le bouton selon le scroll
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      scrollButton.classList.add('visible');
    } else {
      scrollButton.classList.remove('visible');
    }
  });

  // Scroll to top au clic
  scrollButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// ============================================
// HERO CAROUSEL
// ============================================
function initHeroCarousel() {
  const carousel = document.querySelector('.hero-carousel');
  if (!carousel) return;

  const images = carousel.querySelectorAll('.hero-background');
  if (images.length === 0) return;

  let currentIndex = 0;

  // Fonction pour changer d'image
  function changeImage() {
    // Retirer la classe active de l'image actuelle
    images[currentIndex].classList.remove('active');

    // Passer à l'image suivante
    currentIndex = (currentIndex + 1) % images.length;

    // Ajouter la classe active à la nouvelle image
    images[currentIndex].classList.add('active');
  }

  // Changer d'image toutes les 5 secondes (5000ms)
  setInterval(changeImage, 5000);

  console.log(`🎠 Carrousel initialisé avec ${images.length} images`);
}

// ============================================
// PARALLAX EFFECT (Hero section)
// ============================================
function initParallax() {
  const hero = document.querySelector('.hero');
  const heroBackground = document.querySelector('.hero-background');
  const heroVideo = document.querySelector('.hero-video');
  const staticLayer = document.querySelector('.hero-static-layer');

  if (hero && (heroBackground || staticLayer || heroVideo)) {
    let ticking = false;

    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrolled = window.pageYOffset;
          const heroHeight = hero.offsetHeight;

          if (scrolled < heroHeight) {
            if (heroBackground) {
              heroBackground.style.transform = `translateY(${scrolled * 0.4}px) translateZ(0)`;
            }
            if (heroVideo) {
              heroVideo.style.transform = `translateY(${scrolled * 0.3}px) translateZ(0)`;
            }
            if (staticLayer) {
              staticLayer.style.transform = `translateY(${scrolled * 0.2}px) translateZ(0)`;
            }
          }
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }
}

// ============================================
// PERFORMANCE: Preload critical images
// ============================================
function preloadCriticalImages() {
  const criticalImages = [
    'ressources/images/paysage_0.jpg', // Hero image
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// ============================================
// ANALYTICS (optionnel - à configurer)
// ============================================
function trackEvent(category, action, label) {
  // Placeholder pour Google Analytics ou autre
  console.log('Event:', category, action, label);

  // Exemple avec Google Analytics (décommenter si configuré):
  // if (typeof gtag !== 'undefined') {
  //   gtag('event', action, {
  //     'event_category': category,
  //     'event_label': label
  //   });
  // }
}

// ============================================
// CONTACT FORM
// ============================================
function initContactForm() {
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    // Loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="ph ph-spinner btn-icon animate-spin"></i> Envoi en cours...';
    status.style.display = 'none';

    try {
      const response = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        status.textContent = "Merci ! Votre message a été envoyé avec succès. Nous vous répondrons très prochainement.";
        status.className = "form-status success";
        status.style.display = "block";
        form.reset();
      } else {
        const errorData = await response.json();
        if (errorData && errorData.errors) {
          status.textContent = errorData["errors"].map(error => error["message"]).join(", ");
        } else {
          status.textContent = "Oups ! Un problème est survenu lors de l'envoi.";
        }
        status.className = "form-status error";
        status.style.display = "block";
      }
    } catch (error) {
      status.textContent = "Erreur de connexion. Veuillez vérifier votre accès internet.";
      status.className = "form-status error";
      status.style.display = "block";
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
  console.log('🏖️ Espace Beach Ahoué - Site chargé');

  // Initialiser toutes les fonctionnalités
  initWhatsAppButtons();
  initNavigation();
  initScrollAnimations();
  initGallery();
  initGlobalLightbox();
  initMenuModal();
  initVirtualTour();
  initLazyLoading();
  initScrollToTop();
  // initHeroCarousel(); // Désactivé au profit de la vidéo d'ambiance
  initParallax();
  initVirtualTour();
  initContactForm();
  preloadCriticalImages();

  // Tracker le chargement de la page
  trackEvent('Site', 'Page Load', 'Home');
});

// ============================================
// PERFORMANCE: Load event
// ============================================
window.addEventListener('load', () => {
  console.log('✅ Tous les assets sont chargés');

  // SAFETY NET: Watchdog to unlock scroll if stuck
  setInterval(() => {
    const hasLightbox = document.querySelector('.lightbox');
    const hasModal = document.querySelector('.menu-modal');

    // Si aucun modal n'est ouvert mais que le body est scroll-locked
    if (!hasLightbox && !hasModal && (document.body.style.overflow === 'hidden' || document.documentElement.style.overflow === 'hidden')) {
      console.warn('⚠️ Scroll bloqué détecté sans modal - Déblocage forcé');
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }
  }, 2000);

  // Mesurer les performances (optionnel)
  if ('performance' in window) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`⚡ Temps de chargement: ${pageLoadTime}ms`);
  }
});

// ============================================
// ERROR HANDLING
// ============================================
window.addEventListener('error', (e) => {
  console.error('Erreur détectée:', e.message);
  // Vous pouvez envoyer les erreurs à un service de monitoring ici
});

// ============================================
// EXPORT (si utilisé comme module)
// ============================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createWhatsAppLink,
    trackEvent
  };
}
