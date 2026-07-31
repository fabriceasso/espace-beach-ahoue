function injectHeader() {
  const isIndex = location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname.endsWith('ESCAPE%20BEACH%20AHOU%C3%89/');
  const prefix = isIndex ? '' : 'index.html';
  const currentPath = location.pathname.split('/').pop() || 'index.html';

  function navLink(href, label, active) {
    return `<a href="${href}" class="nav-link${active ? ' active' : ''}">${label}</a>`;
  }

  function dropdown(href, label, active, items) {
    return `
    <div class="nav-item-dropdown">
      <a href="${href}" class="nav-link${active ? ' active' : ''}">${label} <i class="ph ph-caret-down caret-icon"></i></a>
      <div class="dropdown-menu">
        ${items.map(i => `<a href="${i.href}" class="dropdown-link">${i.label}</a>`).join('')}
      </div>
    </div>`;
  }

  const links = [
    navLink(`${prefix}#presentation`, 'À propos', false),
    dropdown(`${prefix}#hebergement`, 'Hébergement', currentPath === 'hebergement.html', [
      { href: 'hebergement.html', label: 'Nos Chambres' }
    ]),
    dropdown(`${prefix}#restaurant`, 'Restaurant & Bar', currentPath === 'menu.html', [
      { href: 'menu.html', label: 'Notre Carte' }
    ]),
    dropdown(`${prefix}#evenements`, 'Événements', currentPath === 'evenements.html', [
      { href: 'evenements.html', label: 'Nos Offres' }
    ]),
    navLink(`${prefix}#galerie`, 'Galerie', false),
    navLink(`${prefix}#contact`, 'Contact', false)
  ].join('');

  const logoHref = isIndex ? '#hero' : 'index.html';

  const html = `
  <nav class="navbar" id="navbar" aria-label="Navigation principale">
    <div class="container-wide">
      <a href="${logoHref}" class="logo">
        <img src="assets/images/logo.png" alt="Espace Beach Ahoué Logo" class="logo-img">
        <span>Complexe Hôtelier Ahoué Beach</span>
      </a>
      <div class="header-phone">
        <a href="tel:+2252733764359"><i class="ph ph-phone"></i> 27 33 76 43 59</a>
        <a href="tel:+2250102630733"><i class="ph ph-phone"></i> 01 02 63 07 33</a>
      </div>
      <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Menu">
        <i class="ph ph-list"></i>
      </button>
    </div>
    <div class="nav-menu" id="navMenu">
      <div class="nav-links">
        ${links}
      </div>
    </div>
  </nav>`;

  const placeholder = document.getElementById('header-placeholder');
  if (placeholder) {
    placeholder.outerHTML = html;
  }

  const whatsappHTML = `
  <a href="https://wa.me/22507941094" class="whatsapp-float" id="whatsappFloat" aria-label="Contacter sur WhatsApp">
    <i class="ph ph-whatsapp-logo"></i>
  </a>`;
  const whatsappPlaceholder = document.getElementById('whatsapp-placeholder');
  if (whatsappPlaceholder) {
    whatsappPlaceholder.outerHTML = whatsappHTML;
  }
}

document.addEventListener('DOMContentLoaded', injectHeader);
