/* ============================================
   ESPACE BEACH AHOUÉ - PDF MENU GENERATOR
   Pure jsPDF approach - no html2canvas
   ============================================ */

const MenuPDF = {

  imageCache: {},

  imgToBase64(imgEl) {
    try {
      const c = document.createElement('canvas');
      c.width = imgEl.naturalWidth;
      c.height = imgEl.naturalHeight;
      c.getContext('2d').drawImage(imgEl, 0, 0);
      return c.toDataURL('image/jpeg', 0.85);
    } catch (e) {
      return null;
    }
  },

  findDomImage(src) {
    const filename = src.split('/').pop().toLowerCase();
    const imgs = document.querySelectorAll('img');
    for (const el of imgs) {
      if (el.src && el.src.toLowerCase().includes(filename)) {
        return el;
      }
    }
    return null;
  },

  async loadAllImages() {
    const srcs = [
      'assets/images/logo.png',
      'assets/images/menu/marmite_pecheur_1.jpg',
      'assets/images/menu/la_villageoise.jpg',
      'assets/images/menu/brochette_agouti.jpg',
      'assets/images/menu/soupe_machoiron.jpg',
      'assets/images/menu/poisson_braise.jpg',
      'assets/images/menu/poisson_fumé.jpg',
      'assets/images/menu/gambas_sauté.jpg',
      'assets/images/menu/ecrevisses.jpg',
      'assets/images/menu/escargot_sauté.jpg',
      'assets/images/menu/choukouya_mouton.jpg',
      'assets/images/menu/kedjenou_herisson.jpg',
      'assets/images/menu/rat_palmiste.jpg',
      'assets/images/menu/riz_soumara_poulet.jpg',
      'assets/images/menu/kedjenou_pintade_2.jpg',
      'assets/images/menu/poulet_braisé.jpg',
      'assets/images/menu/frites.jpg',
      'assets/images/menu/alloco_1.jpg',
      'assets/images/menu/igname_bouillie.jpg',
      'assets/images/menu/attiéké.jpg',
      'assets/images/menu/spiritueux.jpg',
      'assets/images/menu/vins.jpg',
      'assets/images/menu/bieres.jpg',
      'assets/images/menu/sucreries.jpg',
    ];

    // Make hidden drinks tab visible temporarily
    const drinksPanel = document.getElementById('boissons-content');
    const wasHidden = drinksPanel && !drinksPanel.classList.contains('tab-active');
    if (wasHidden) {
      drinksPanel.style.position = 'relative';
      drinksPanel.style.width = 'auto';
      drinksPanel.style.height = 'auto';
      drinksPanel.style.overflow = 'visible';
      drinksPanel.style.clip = 'auto';
      drinksPanel.style.opacity = '1';
    }

    // Wait for layout
    await new Promise(r => setTimeout(r, 300));

    // Convert all DOM images to base64
    srcs.forEach(src => {
      if (this.imageCache[src]) return;
      const el = this.findDomImage(src);
      if (el && el.complete && el.naturalWidth > 0) {
        const b64 = this.imgToBase64(el);
        if (b64) this.imageCache[src] = b64;
      }
    });

    // Restore hidden tab
    if (wasHidden && drinksPanel) {
      drinksPanel.style.position = '';
      drinksPanel.style.width = '';
      drinksPanel.style.height = '';
      drinksPanel.style.overflow = '';
      drinksPanel.style.clip = '';
      drinksPanel.style.opacity = '';
    }

    // Force-load any remaining missing images via fetch blob
    const missing = srcs.filter(s => !this.imageCache[s]);
    await Promise.all(missing.map(async (src) => {
      try {
        const resp = await fetch(src);
        const blob = await resp.blob();
        const dataUrl = await new Promise((res) => {
          const r = new FileReader();
          r.onloadend = () => res(r.result);
          r.readAsDataURL(blob);
        });
        this.imageCache[src] = dataUrl;
      } catch (e) { /* skip */ }
    }));
  },

  img(src) { return this.imageCache[src] || null; },

  // Color palette
  BG: [18, 18, 18],
  CARD: [30, 30, 30],
  ALT: [26, 26, 26],
  GOLD: [255, 215, 0],
  TEXT: [245, 237, 229],
  MUTED: [212, 196, 176],

  menuData: {
    specialites: [
      { name: 'Marmite du pecheur', price: '15 000', img: 'assets/images/menu/marmite_pecheur_1.jpg', desc: 'Crevettes, poisson carpe, servi avec du riz ou de l\'attiéké.' },
      { name: 'La Villageoise', price: '15 000', img: 'assets/images/menu/la_villageoise.jpg', desc: 'Escargots, écrevisses, champignons. Un incontournable généreux.' },
      { name: 'Brochettes d\'Agoutis', price: '7 000', img: 'assets/images/menu/brochette_agouti.jpg', desc: 'Marinés avec une sauce locale, grillés pour une cuisson parfaite.' },
    ],
    poissons: [
      { name: 'Soupe de Machoiron', price: '7 000', img: 'assets/images/menu/soupe_machoiron.jpg', desc: 'Délicieux plat à base d\'ingrédients frais.' },
      { name: 'Carpe Braisée', price: '5 000', img: 'assets/images/menu/poisson_braise.jpg', desc: 'Poisson carpe charnu braisé, avec accompagnement au choix.' },
      { name: 'Poisson Fumé', price: '5 000', img: 'assets/images/menu/poisson_fumé.jpg', desc: 'Classique du littoral ivoirien, avec attiéké et garniture.' },
    ],
    poissonsExtra: [
      { name: 'Poisson Sosso sauté ou au four', price: '5 000 - 8 000' },
      { name: 'Poisson Sole braisé ou sautée', price: '5 000' },
    ],
    crustaces: [
      { name: 'Gambas sautées', price: '10 000', img: 'assets/images/menu/gambas_sauté.jpg', desc: 'Gambas fraîches marinées, poêlées ou au four.' },
      { name: 'Ecrevisses au four', price: '5 000', img: 'assets/images/menu/ecrevisses.jpg', desc: 'Ecrevisses fraîches, cuites au four avec épices.' },
      { name: 'Escargot sauté', price: '5 000', img: 'assets/images/menu/escargot_sauté.jpg', desc: 'Un "Must to see", une saveur sans commentaires.' },
    ],
    crustacesExtra: [
      { name: 'Brochettes d\'escargots', price: 'Sur demande' },
    ],
    viandes: [
      { name: 'Choukouya de mouton', price: '10 000', img: 'assets/images/menu/choukouya_mouton.jpg', desc: 'Mijotée patiemment, tendresse et goût succulent.' },
      { name: '1/4 Kedjenou hérisson', price: '7 000', img: 'assets/images/menu/kedjenou_herisson.jpg', desc: 'Gibier local noble, saveur sauvage exaltée.' },
      { name: 'Rat palmiste braisé', price: '6 000', img: 'assets/images/menu/rat_palmiste.jpg', desc: 'Chair douce et savoureuse, un vrai délice.' },
    ],
    viandesExtra: [
      { name: 'Côtelette d\'agneau', price: '10 000' },
      { name: 'Côte de bœuf', price: '10 000' },
      { name: 'Côte de porc grillé', price: '9 000' },
      { name: 'Choukouya de porc', price: '9 000' },
      { name: 'Sauté de queue de bœuf', price: '9 000' },
      { name: '¼ Agoutif', price: '7 000' },
      { name: 'Mangouste', price: '7 000' },
      { name: 'Rat de brousse', price: '6 000' },
      { name: 'Ecureuil', price: '4 000' },
    ],
    volailles: [
      { name: 'Riz Soumara au Poulet', price: '9 000', img: 'assets/images/menu/riz_soumara_poulet.jpg', desc: 'Saveur atypique du soumara qui fouettera vos papilles.' },
      { name: 'Kedjenou de pintade', price: '8 000', img: 'assets/images/menu/kedjenou_pintade_2.jpg', desc: 'Volaille mijotée avec les meilleurs épices locales.' },
      { name: 'Poulet braisé', price: '7 000', img: 'assets/images/menu/poulet_braisé.jpg', desc: 'L\'incontournable local, saveur exaltée par les flammes.' },
    ],
    volaillesExtra: [
      { name: 'Riz Soumara pintade', price: '10 000' },
      { name: 'Riz cantonnais pintade', price: '10 000' },
      { name: 'Riz cantonnais au poulet', price: '9 000' },
      { name: 'Pintade braisée', price: '8 000' },
      { name: 'Pintade sautée', price: '8 000' },
      { name: 'Poulet sauté', price: '7 000' },
      { name: 'Kédjénou de poulet', price: '7 000' },
      { name: 'Caille braisée', price: '5 000' },
      { name: 'Caille sautée', price: '5 000' },
      { name: 'Kedjenou de Caille', price: '5 000' },
      { name: 'Perdrix braisée', price: '4 000' },
      { name: 'Perdrix sautée', price: '4 000' },
      { name: 'Kedjenou de Perdrix', price: '4 000' },
    ],
    accompagnements: [
      { name: 'Frites Pommes de terre', price: '2 000', img: 'assets/images/menu/frites.jpg' },
      { name: 'Alloco', price: '1 000', img: 'assets/images/menu/alloco_1.jpg' },
      { name: 'Igname Bouillie', price: '1 000', img: 'assets/images/menu/igname_bouillie.jpg' },
      { name: 'Attiéké ou Riz', price: '500', img: 'assets/images/menu/attiéké.jpg' },
    ],
    accompagnementsExtra: [
      { name: 'Igname Frite', price: '1 500' },
      { name: 'Sauce Graine', price: '1 000' },
      { name: 'Sauce Arachide', price: '1 000' },
      { name: 'Sauce Gnangnan', price: '1 000' },
      { name: 'Sauce Aubergine', price: '1 000' },
    ],
    spiritueux: [
      { name: 'Champagne', price: '25 000' },
      { name: 'Martini', price: '13 000' },
      { name: 'Campari', price: '10 000' },
      { name: 'Vin mousseux', price: '7 000' },
    ],
    vins: [
      { name: 'Vin Bordeaux', price: '3 000 - 8 000' },
      { name: 'Vin Valpierre', price: '2 500' },
    ],
    bieres: [
      { name: 'Beaufort', price: '800' },
      { name: 'Téquila', price: '700' },
      { name: 'Bock 66', price: '700' },
      { name: 'Despérado', price: '700' },
      { name: 'Racine', price: '700' },
      { name: 'Dopel', price: '700' },
      { name: 'Heineken', price: '700' },
    ],
    cafes: [
      { name: 'Café', price: '1 000' },
      { name: 'Expresso', price: '1 000' },
      { name: 'Orangina', price: '1 000' },
      { name: 'Cody\'s', price: '1 000' },
      { name: 'Sanbitter', price: '1 000' },
      { name: 'Sucreries (Fanta, Coca...)', price: '800' },
      { name: 'Rhino', price: '700' },
    ],
  },

  // --- Drawing helpers ---

  drawBg(pdf) {
    pdf.setFillColor(...this.BG);
    pdf.rect(0, 0, 210, 297, 'F');
  },

  drawSectionTitle(pdf, text, y) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(16);
    pdf.setTextColor(...this.GOLD);
    pdf.text(text, 105, y, { align: 'center' });
    pdf.setDrawColor(...this.GOLD);
    pdf.setLineWidth(0.5);
    pdf.line(85, y + 2, 125, y + 2);
    return y + 8;
  },

  drawSubTitle(pdf, text, y) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(11);
    pdf.setTextColor(...this.GOLD);
    pdf.text(text, 105, y, { align: 'center' });
    return y + 6;
  },

  drawCard(pdf, item, x, y, w, h) {
    const cardW = w;
    const cardH = h;
    const imgH = 38;
    const imgSrc = item.img ? this.img(item.img) : null;

    // Card background
    pdf.setFillColor(...this.CARD);
    pdf.roundedRect(x, y, cardW, cardH, 2, 2, 'F');

    // Gold border
    pdf.setDrawColor(255, 215, 0, 40);
    pdf.setLineWidth(0.2);
    pdf.roundedRect(x, y, cardW, cardH, 2, 2, 'S');

    // Image
    if (imgSrc) {
      try {
        pdf.addImage(imgSrc, 'JPEG', x + 1, y + 1, cardW - 2, imgH);
      } catch (e) { console.warn('Image error:', item.name, e); }
    }

    // Title
    const textY = y + imgH + 5;
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(...this.TEXT);
    const nameText = item.name.length > 28 ? item.name.substring(0, 26) + '...' : item.name;
    pdf.text(nameText, x + 3, textY);

    // Price
    pdf.setFontSize(7);
    pdf.setTextColor(...this.GOLD);
    pdf.text(item.price + ' FCFA', x + cardW - 3, textY, { align: 'right' });

    // Description
    if (item.desc) {
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(6);
      pdf.setTextColor(...this.MUTED);
      const lines = pdf.splitTextToSize(item.desc, cardW - 6);
      pdf.text(lines.slice(0, 2), x + 3, textY + 4);
    }
  },

  drawListItem(pdf, item, x, y, w) {
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(...this.TEXT);
    pdf.text(item.name, x, y);

    // Dots
    const nameW = pdf.getTextWidth(item.name);
    const priceW = pdf.getTextWidth(item.price + ' FCFA');
    const dotsStart = x + nameW + 2;
    const dotsEnd = x + w - priceW - 2;
    if (dotsEnd > dotsStart) {
      pdf.setDrawColor(255, 255, 255, 30);
      pdf.setLineWidth(0.1);
      pdf.setLineDashPattern([0.5, 1], 0);
      pdf.line(dotsStart, y - 0.5, dotsEnd, y - 0.5);
      pdf.setLineDashPattern([], 0);
    }

    // Price
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(7);
    pdf.setTextColor(...this.GOLD);
    pdf.text(item.price + ' FCFA', x + w, y, { align: 'right' });

    return y + 4;
  },

  drawBox(pdf, title, items, x, y, w) {
    // Box background
    const lineH = 4;
    const boxH = items.length * lineH + 8;
    pdf.setFillColor(...this.ALT);
    pdf.roundedRect(x, y, w, boxH, 2, 2, 'F');
    pdf.setDrawColor(212, 175, 55, 50);
    pdf.setLineWidth(0.2);
    pdf.setLineDashPattern([1, 1], 0);
    pdf.roundedRect(x, y, w, boxH, 2, 2, 'S');
    pdf.setLineDashPattern([], 0);

    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(...this.GOLD);
    pdf.text(title, x + w / 2, y + 4, { align: 'center' });

    // Items
    let iy = y + 8;
    items.forEach(item => {
      iy = this.drawListItem(pdf, item, x + 4, iy, w - 8);
    });

    return y + boxH + 3;
  },

  drawDrinkBanner(pdf, imgSrc, x, y, w) {
    if (!imgSrc) return y;
    try {
      pdf.addImage(imgSrc, 'JPEG', x, y, w, 16);
    } catch (e) { console.warn('Banner image error', e); }
    return y + 17;
  },

  drawDrinkSection(pdf, title, items, bannerSrc, x, y, w) {
    const lineH = 4;
    const boxH = items.length * lineH + 10;
    pdf.setFillColor(...this.ALT);
    pdf.roundedRect(x, y, w, boxH, 2, 2, 'F');
    pdf.setDrawColor(212, 175, 55, 50);
    pdf.setLineWidth(0.2);
    pdf.setLineDashPattern([1, 1], 0);
    pdf.roundedRect(x, y, w, boxH, 2, 2, 'S');
    pdf.setLineDashPattern([], 0);

    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.setTextColor(...this.GOLD);
    pdf.text(title, x + w / 2, y + 5, { align: 'center' });

    // Banner
    let iy = y + 8;
    if (bannerSrc) {
      iy = this.drawDrinkBanner(pdf, bannerSrc, x + 2, iy, w - 4);
    }

    // Items
    items.forEach(item => {
      iy = this.drawListItem(pdf, item, x + 4, iy, w - 8);
    });

    return y + boxH + 3;
  },

  // --- Pages ---

  buildCoverPage(pdf) {
    this.drawBg(pdf);

    // Logo
    const logo = this.img('assets/images/logo.png');
    if (logo) {
      try { pdf.addImage(logo, 'PNG', 80, 60, 50, 50); } catch (e) { console.warn('Logo error', e); }
    }

    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(26);
    pdf.setTextColor(...this.GOLD);
    pdf.text('Espace Beach Ahoué', 105, 125, { align: 'center' });

    // Line
    pdf.setDrawColor(...this.GOLD);
    pdf.setLineWidth(0.5);
    pdf.line(85, 130, 125, 130);

    // Subtitle
    pdf.setFontSize(20);
    pdf.setTextColor(...this.TEXT);
    pdf.text('Carte du Menu', 105, 142, { align: 'center' });

    // Tag
    pdf.setFontSize(9);
    pdf.setTextColor(...this.MUTED);
    pdf.text('RESTAURANT & BAR', 105, 152, { align: 'center' });

    // Border box
    pdf.setDrawColor(...this.GOLD);
    pdf.setLineWidth(0.3);
    pdf.roundedRect(60, 162, 90, 10, 1, 1, 'S');
    pdf.setFontSize(8);
    pdf.setTextColor(...this.GOLD);
    pdf.text('CUISINE IVOIRIENNE MODERNE', 105, 168.5, { align: 'center' });

    // Contact
    pdf.setFontSize(7);
    pdf.setTextColor(...this.MUTED);
    pdf.text("Route d'Alépé, Ahoué  |  +225 27 33 76 43 59", 105, 190, { align: 'center' });
    pdf.setFontSize(6);
    pdf.setTextColor(150, 150, 150);
    pdf.text('ahouebeach.net', 105, 196, { align: 'center' });
  },

  buildFoodPage(pdf) {
    const d = this.menuData;
    let y = 12;
    const lm = 10;
    const pageW = 190;
    const cardW = (pageW - 6) / 2;
    const cardH = 52;

    // --- Spécialités ---
    y = this.drawSectionTitle(pdf, 'Nos Spécialités', y);
    d.specialites.forEach((item, i) => {
      const col = i % 2;
      this.drawCard(pdf, item, lm + col * (cardW + 6), y, cardW, cardH);
    });
    y += cardH + 4;

    // --- Poissons & Crustacés ---
    y = this.drawSectionTitle(pdf, 'Nos Poissons & Crustacés', y);
    y = this.drawSubTitle(pdf, 'Poissons', y);
    d.poissons.forEach((item, i) => {
      const col = i % 2;
      this.drawCard(pdf, item, lm + col * (cardW + 6), y, cardW, cardH);
    });
    y += cardH + 3;
    y = this.drawBox(pdf, 'Suite Poissons', d.poissonsExtra, lm, y, pageW);

    y = this.drawSubTitle(pdf, 'Les Crustacés', y);
    d.crustaces.forEach((item, i) => {
      const col = i % 2;
      this.drawCard(pdf, item, lm + col * (cardW + 6), y, cardW, cardH);
    });
    y += cardH + 3;
    y = this.drawBox(pdf, 'Suite des Crustacés', d.crustacesExtra, lm, y, pageW);

    // --- Viandes & Volailles ---
    y = this.drawSectionTitle(pdf, 'Nos Viandes & Volailles', y);
    y = this.drawSubTitle(pdf, 'Les Viandes', y);
    d.viandes.forEach((item, i) => {
      const col = i % 2;
      this.drawCard(pdf, item, lm + col * (cardW + 6), y, cardW, cardH);
    });
    y += cardH + 3;
    y = this.drawBox(pdf, 'Suites Viandes', d.viandesExtra, lm, y, pageW);

    y = this.drawSubTitle(pdf, 'Les Volailles', y);
    d.volailles.forEach((item, i) => {
      const col = i % 2;
      this.drawCard(pdf, item, lm + col * (cardW + 6), y, cardW, cardH);
    });
    y += cardH + 3;
    y = this.drawBox(pdf, 'Suite Volailles', d.volaillesExtra, lm, y, pageW);

    // --- Accompagnements ---
    y = this.drawSectionTitle(pdf, 'Nos Accompagnements', y);
    const accW = (pageW - 12) / 4;
    const accH = 36;
    d.accompagnements.forEach((item, i) => {
      this.drawCard(pdf, item, lm + i * (accW + 4), y, accW, accH);
    });
    y += accH + 3;
    y = this.drawBox(pdf, 'Extras', d.accompagnementsExtra, lm, y, pageW);
  },

  buildDrinksPage(pdf) {
    const d = this.menuData;
    let y = 12;
    const lm = 10;
    const pageW = 190;

    y = this.drawSectionTitle(pdf, 'Les Boissons', y);

    y = this.drawDrinkSection(pdf, 'Spiritueux', d.spiritueux, this.img('assets/images/menu/spiritueux.jpg'), lm, y, pageW);
    y = this.drawDrinkSection(pdf, 'Vins', d.vins, this.img('assets/images/menu/vins.jpg'), lm, y, pageW);
    y = this.drawDrinkSection(pdf, 'Bières', d.bieres, this.img('assets/images/menu/bieres.jpg'), lm, y, pageW);
    y = this.drawDrinkSection(pdf, 'Cafés & Sucreries', d.cafes, this.img('assets/images/menu/sucreries.jpg'), lm, y, pageW);

    // Footer
    y += 4;
    pdf.setDrawColor(255, 215, 0, 50);
    pdf.setLineWidth(0.2);
    pdf.roundedRect(lm, y, pageW, 14, 2, 2, 'S');
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.setTextColor(...this.GOLD);
    pdf.text('Pour commander ou réserver', 105, y + 5, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.setTextColor(...this.MUTED);
    pdf.text('WhatsApp : +225 07 94 10 94', 105, y + 10, { align: 'center' });
  },

  async generate() {
    const btn = document.getElementById('pdfDownloadBtn');
    if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Génération en cours...'; }

    try {
      await this.loadAllImages();

      if (typeof window.jspdf === 'undefined') {
        throw new Error('jsPDF pas chargé. Vérifiez votre connexion internet et rechargez la page.');
      }
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });

      // Page 1: Cover
      this.buildCoverPage(pdf);

      // Page 2: Food
      pdf.addPage();
      this.buildFoodPage(pdf);

      // Page 3: Drinks
      pdf.addPage();
      this.buildDrinksPage(pdf);

      pdf.save('Espace_Beach_Ahoue_Menu.pdf');

    } catch (err) {
      console.error('PDF error:', err);
      alert('Erreur : ' + err.message);
    } finally {
      if (btn) { btn.disabled = false; btn.innerHTML = '<i class="ph ph-file-pdf btn-icon"></i> Télécharger le Menu (PDF)'; }
    }
  },

  init() {
    const btn = document.getElementById('pdfDownloadBtn');
    if (btn) btn.addEventListener('click', (e) => { e.preventDefault(); this.generate(); });
  },
};

document.addEventListener('DOMContentLoaded', () => MenuPDF.init());
