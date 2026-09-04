function injectFooter() {
  const isIndex = location.pathname.endsWith('index.html') || location.pathname === '/' || location.pathname.endsWith('ESCAPE%20BEACH%20AHOU%C3%89/');
  const prefix = isIndex ? '' : 'index.html';

  const isSimplePage = ['mentions-legales.html', '404.html'].includes(location.pathname.split('/').pop());

  let navItems;
  if (isSimplePage) {
    navItems = `
      <li><a href="index.html">Accueil</a></li>
      <li><a href="hebergement.html">Hébergement</a></li>
      <li><a href="menu.html">Restaurant & Bar</a></li>
      <li><a href="evenements.html">Événements</a></li>`;
  } else {
    navItems = `
      <li><a href="${prefix}#presentation">À propos</a></li>
      <li><a href="hebergement.html">Hébergement</a></li>
      <li><a href="menu.html">Restaurant & Bar</a></li>
      <li><a href="evenements.html">Événements</a></li>
      <li><a href="${prefix}#galerie">Galerie</a></li>
      <li><a href="${prefix}#contact">Contact</a></li>`;
  }

  const html = `
  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-col brand-col">
          <div class="footer-logo">
            <img src="assets/images/logo.png" alt="Logo Espace Beach Ahoué" class="footer-logo-img">
            <h3>Complexe Hôtelier Ahoué Beach</h3>
          </div>
          <p class="footer-tagline">Séjour, restauration africaine & loisirs en plein air, dans un cadre naturel
            d'exception en bordure d'eau à Ahoué, près d'Abidjan.</p>
          <div class="social-links">
            <a href="https://www.facebook.com/espace.beachahoue" target="_blank" rel="noopener noreferrer"
              class="social-link" aria-label="Facebook">
              <i class="ph ph-facebook-logo"></i>
            </a>
            <a href="https://wa.me/22507941094" class="social-link" id="whatsappFooter"
              aria-label="WhatsApp">
              <i class="ph ph-whatsapp-logo"></i>
            </a>
          </div>
        </div>

        <div class="footer-col">
          <h4>Navigation</h4>
          <ul class="footer-links">
            ${navItems}
          </ul>
        </div>

        <div class="footer-col">
          <h4>Infos & Accès</h4>
          <ul class="footer-info-list">
            <li><i class="ph ph-map-pin"></i> Route d'Alépé, Ahoué – près d'Abidjan</li>
            <li><i class="ph ph-mailbox"></i> 01 BP 1233 Abidjan 01, Côte d'Ivoire</li>
            <li><i class="ph ph-phone"></i> <a href="tel:+2252733764359">27 33 76 43 59</a> / <a
                href="tel:+2250102630733">01 02 63 07 33</a></li>
            <li><i class="ph ph-clock"></i> Ouvert 7j/7 - 24h/24</li>
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>© 2026 | Complexe Hôtelier Ahoué Beach | Tous droits réservés | powered by <a
            href="mailto:nivaquine&#64;yahoo&#46;com">nivaQuine</a> | <a href="mentions-legales.html">Mentions
            Légales</a></p>
      </div>
    </div>
  </footer>`;

  const placeholder = document.getElementById('footer-placeholder');
  if (placeholder) {
    placeholder.outerHTML = html;
  }
}

document.addEventListener('DOMContentLoaded', injectFooter);
