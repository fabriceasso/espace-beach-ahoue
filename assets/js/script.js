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
// SECURITY: Input Sanitization
// ============================================
function sanitizeHTML(str) {
  if (typeof str !== 'string') return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

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
  const fadeElements = document.querySelectorAll('.fade-in');

  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Optionnel: arrêter d'observer une fois visible
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  fadeElements.forEach(element => {
    observer.observe(element);

    // Sécurité: Si l'élément est déjà dans le viewport haut (cas du menu par ex)
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      element.classList.add('visible');
    }
  });
}

// ============================================
// GALLERY LIGHTBOX WITH NAVIGATION
// ============================================
let galleryImagesList = [];
let currentLightboxIndex = 0;

function initGallery() {
  const galleryItems = document.querySelectorAll('.gallery-item');

  galleryItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      const img = item.querySelector('img');
      if (img) {
        const section = item.closest('section');
        updateGalleryList(section);
        const index = galleryImagesList.findIndex(gItem => gItem.src === img.src);
        openLightbox(index >= 0 ? index : 0);
      }
    });
  });
}

function initGlobalLightbox() {
  const sections = document.querySelectorAll('#presentation, #hebergement, #restaurant, #evenements, #actualites, #galerie');
  const candidates = [];

  sections.forEach(section => {
    const images = section.querySelectorAll('img');
    images.forEach(img => {
      if (img.closest('.gallery-item')) return;
      if (img.classList.contains('logo-img')) return;
      if (img.classList.contains('btn-icon')) return;
      if (img.closest('.event-icon')) return;
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
      const section = img.closest('section');
      updateGalleryList(section);
      const index = galleryImagesList.findIndex(item => item.src === img.src);
      if (index >= 0) {
        openLightbox(index);
      } else {
        galleryImagesList = [{ src: img.src, alt: img.alt, caption: '' }];
        openLightbox(0);
      }
    });
  });
}

function updateGalleryList(section) {
  let scope;
  if (section) {
    scope = section;
  } else {
    scope = document;
  }

  const allImgs = scope.querySelectorAll('.gallery-item:not(.gallery-extra) img, .gallery-item.gallery-visible img, .content-image img, .feature-card-img');
  galleryImagesList = Array.from(allImgs).map(img => {
    const captionEl = img.closest('.gallery-item')?.querySelector('.gallery-caption');
    return {
      src: img.src,
      alt: img.alt || '',
      caption: captionEl ? captionEl.textContent : (img.alt || '')
    };
  });
}

function openLightbox(index) {
  if (!galleryImagesList || galleryImagesList.length === 0) return;
  currentLightboxIndex = (index + galleryImagesList.length) % galleryImagesList.length;

  const existingLightbox = document.querySelector('.lightbox');
  if (existingLightbox) {
    existingLightbox.remove();
  }

  const currentItem = galleryImagesList[currentLightboxIndex];
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  const safeSrc = sanitizeHTML(currentItem.src);
  const safeAlt = sanitizeHTML(currentItem.alt);
  const safeCaption = sanitizeHTML(currentItem.caption);
  const totalCount = galleryImagesList.length;

  lightbox.innerHTML = `
    <div class="lightbox-overlay"></div>
    ${totalCount > 1 ? '<button class="lightbox-nav lightbox-prev" aria-label="Image précédente">❮</button>' : ''}
    <div class="lightbox-content">
      <button class="lightbox-close" aria-label="Fermer">✕</button>
      <img src="${safeSrc}" alt="${safeAlt}">
      <div class="lightbox-info">
        ${totalCount > 1 ? `<span class="lightbox-counter">${currentLightboxIndex + 1} / ${totalCount}</span>` : ''}
        ${safeCaption ? `<span class="lightbox-caption-text">${safeCaption}</span>` : ''}
      </div>
    </div>
    ${totalCount > 1 ? '<button class="lightbox-nav lightbox-next" aria-label="Image suivante">❯</button>' : ''}
  `;

  document.body.appendChild(lightbox);
  document.body.style.overflow = 'hidden';

  const updateLightboxContent = (newIndex) => {
    currentLightboxIndex = (newIndex + galleryImagesList.length) % galleryImagesList.length;
    const item = galleryImagesList[currentLightboxIndex];
    const imgEl = lightbox.querySelector('.lightbox-content img');
    const counterEl = lightbox.querySelector('.lightbox-counter');
    const captionEl = lightbox.querySelector('.lightbox-caption-text');

    if (imgEl) {
      imgEl.style.opacity = '0';
      setTimeout(() => {
        imgEl.src = sanitizeHTML(item.src);
        imgEl.alt = sanitizeHTML(item.alt);
        imgEl.style.opacity = '1';
      }, 150);
    }
    if (counterEl) counterEl.textContent = `${currentLightboxIndex + 1} / ${totalCount}`;
    if (captionEl) captionEl.textContent = sanitizeHTML(item.caption);
  };

  let closed = false;
  const closeLightbox = () => {
    if (closed) return;
    closed = true;
    document.removeEventListener('keydown', keyboardHandler);
    lightbox.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      try {
        if (lightbox.parentNode) {
          lightbox.parentNode.removeChild(lightbox);
        }
      } catch (e) {
        console.error("Erreur fermeture lightbox:", e);
      } finally {
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      }
    }, 300);
  };

  lightbox.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
  lightbox.querySelector('.lightbox-overlay').addEventListener('click', closeLightbox);

  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');
  if (prevBtn) prevBtn.addEventListener('click', () => updateLightboxContent(currentLightboxIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => updateLightboxContent(currentLightboxIndex + 1));

  // Key navigation (Left / Right / Escape)
  const keyboardHandler = (e) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft' && totalCount > 1) {
      updateLightboxContent(currentLightboxIndex - 1);
    } else if (e.key === 'ArrowRight' && totalCount > 1) {
      updateLightboxContent(currentLightboxIndex + 1);
    }
  };
  document.addEventListener('keydown', keyboardHandler);

  // Touch Swipe navigation for mobile
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50 && totalCount > 1) {
      updateLightboxContent(currentLightboxIndex + 1); // Swipe Left -> Next
    } else if (touchEndX - touchStartX > 50 && totalCount > 1) {
      updateLightboxContent(currentLightboxIndex - 1); // Swipe Right -> Prev
    }
  }, { passive: true });
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

  const safeSrc = sanitizeHTML(src);
  const safeTitle = sanitizeHTML(title);
  const safePrice = sanitizeHTML(price);
  const safeDesc = sanitizeHTML(desc);

  const modal = document.createElement('div');
  modal.className = 'menu-modal';
  modal.innerHTML = `
    <div class="menu-modal-overlay"></div>
    <div class="menu-modal-content">
      <button class="menu-modal-close" aria-label="Fermer">✕</button>
      <div class="menu-modal-grid">
        <div class="menu-modal-img">
          <img src="${safeSrc}" alt="${safeTitle}">
        </div>
        <div class="menu-modal-info">
          <h2 class="menu-modal-title">${safeTitle}</h2>
          <div class="menu-modal-price">${safePrice}</div>
          <p class="menu-modal-description">${safeDesc}</p>
          <a href="https://wa.me/22507941094?text=${encodeURIComponent(waMessage + title)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="width: 100%; margin-top: 1rem;">
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
  const safeUrl = sanitizeHTML(url);
  const modal = document.createElement('div');
  modal.className = 'menu-modal tour-modal';
  modal.innerHTML = `
    <div class="menu-modal-overlay"></div>
    <div class="menu-modal-content tour-modal-content" style="max-width: 90%; width: 1000px; height: 80vh;">
      <button class="menu-modal-close" aria-label="Fermer">✕</button>
      <iframe src="${safeUrl}" width="100%" height="100%" style="border:0; border-radius: 8px;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
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

  // Carrousel initialisé silencieusement
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
    'assets/images/hero/carrousel/11.png', // Hero image
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
  if (typeof gtag !== 'undefined') {
    // gtag('event', action, {
    //   'event_category': category,
    //   'event_label': label
    // });
  }
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
// MENU TABS SWITCHING
// ============================================
function switchTab(tabName) {
  // Remove active class from all tabs
  document.querySelectorAll('.menu-tab').forEach(tab => {
    tab.classList.remove('active');
  });

  // Remove tab-active class from all tab panels
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.classList.remove('tab-active');
  });

  // Add active class to clicked tab
  const clickedTab = document.querySelector(`.menu-tab[onclick="switchTab('${tabName}')"]`);
  if (clickedTab) {
    clickedTab.classList.add('active');
  }

  // Add tab-active class to corresponding panel
  const panel = document.getElementById(`${tabName}-content`);
  if (panel) {
    panel.classList.add('tab-active');

    // Force visibility for fade-in elements
    if (panel.classList.contains('fade-in')) {
      setTimeout(() => {
        panel.classList.add('visible');
      }, 10);
    }
  }
}

// ============================================
// GALLERY TOGGLE (Voir plus / Voir moins)
// ============================================
function toggleGallery() {
  const hiddenItems = document.querySelectorAll('.gallery-extra');
  const btn = document.getElementById('galleryToggle');
  const isExpanded = hiddenItems[0] && hiddenItems[0].classList.contains('gallery-visible');

  hiddenItems.forEach((item, i) => {
    if (isExpanded) {
      item.classList.remove('gallery-visible');
    } else {
      setTimeout(() => {
        item.classList.add('gallery-visible');
      }, i * 50);
    }
  });

  if (btn) {
    if (isExpanded) {
      btn.innerHTML = '<i class="ph ph-images-square btn-icon"></i> Voir plus';
    } else {
      btn.innerHTML = '<i class="ph ph-images-square btn-icon"></i> Voir moins';
    }
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
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
  initHeroCarousel();
  initParallax();
  initContactForm();
  preloadCriticalImages();

  // Tracker le chargement de la page
  trackEvent('Site', 'Page Load', 'Home');
});

// ============================================
// PERFORMANCE: Load event
// ============================================
window.addEventListener('load', () => {
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

  // Mesurer les performances (optionnel) - API moderne
  if ('performance' in window) {
    const navEntry = performance.getEntriesByType('navigation')[0];
    if (navEntry) {
      const pageLoadTime = Math.round(navEntry.loadEventEnd - navEntry.startTime);
      // Performance tracking silencieux
    }
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
