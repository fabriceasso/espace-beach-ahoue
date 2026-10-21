# Espace Beach Ahoué - Site Web One-Page

## 🏖️ Description

Site web vitrine premium pour **Espace Beach Ahoué**, un complexe hôtelier, restaurant et bar en bord de plage situé à Ahoué, Côte d'Ivoire.

Le site présente :
- Hébergement avec chambres équipées
- Restaurant et bar avec cuisine moderne
- Espace de détente en plein air
- Organisation d'événements
- Galerie photos

## 🎨 Caractéristiques

### Design
- **Esthétique premium** avec inspiration Afrique de l'Ouest contemporaine
- **Palette de couleurs** : beige sable, ocre chaud, vert palmier, bleu lagon, charbon
- **Typographie** : Playfair Display (titres) + Poppins (corps)
- **Animations douces** et micro-interactions
- **Design mobile-first** entièrement responsive

### Fonctionnalités
- ✅ Navigation fluide avec smooth scroll
- ✅ Bouton WhatsApp flottant avec messages pré-remplis
- ✅ Galerie photos avec lightbox
- ✅ Animations au scroll (Intersection Observer)
- ✅ Menu mobile responsive
- ✅ Intégration Facebook
- ✅ Optimisation SEO
- ✅ Lazy loading des images
- ✅ Effet parallaxe sur le hero

## 📁 Structure du Projet

```
ESPACE BEACH AHOUÉ/
├── index.html              # Page principale
├── assets/
│   ├── css/
│   │   └── styles.css      # Design system complet
│   └── js/
│       └── script.js       # Fonctionnalités interactives
├── ressources/
│   ├── images/             # Images du complexe
│   │   ├── chambre_*.jpg   # Photos des chambres
│   │   ├── paysage_*.jpg   # Photos de la plage/paysage
│   │   ├── repas_*.jpg     # Photos des plats
│   │   ├── pub_*.jpg       # Photos d'événements
│   │   └── restaurant.jpg  # Photo du restaurant
│   └── ESPACE BEACH AHOUÉ_contenu.docx
└── README.md               # Ce fichier
```

## 🚀 Installation et Utilisation

### Méthode 1 : Ouvrir directement
1. Double-cliquez sur `index.html`
2. Le site s'ouvrira dans votre navigateur par défaut

### Méthode 2 : Serveur local (recommandé)
```bash
# Avec Python 3
python -m http.server 8000

# Avec Node.js (npx)
npx http-server -p 8000

# Avec PHP
php -S localhost:8000
```

Puis ouvrez : `http://localhost:8000`

### Méthode 3 : Live Server (VS Code)
1. Installez l'extension "Live Server" dans VS Code
2. Clic droit sur `index.html` → "Open with Live Server"

## ⚙️ Configuration

### WhatsApp
Pour configurer le numéro WhatsApp, éditez `assets/js/script.js` :

```javascript
const CONFIG = {
  whatsappNumber: '2250000000000', // Remplacez par votre numéro
  // Format: code pays (225 pour CI) + numéro sans espaces
  // Exemple: 2250709123456
};
```

### Google Maps
Pour ajouter la carte exacte, éditez `index.html` section Contact :

```html
<iframe 
  src="https://www.google.com/maps/embed?pb=VOTRE_CODE_EMBED"
  ...
</iframe>
```

Pour obtenir le code embed :
1. Allez sur Google Maps
2. Recherchez "Ahoué, Côte d'Ivoire"
3. Cliquez sur "Partager" → "Intégrer une carte"
4. Copiez le code iframe

## 📱 Sections du Site

1. **Hero** - Image plein écran avec titre et CTAs
2. **Présentation** - Introduction au complexe
3. **Hébergement** - Chambres et points forts
4. **Restaurant & Bar** - Cuisine et ambiance
5. **Événements** - Types d'événements accueillis
6. **Actualités** - Lien vers Facebook
7. **Galerie** - Photos du complexe
8. **Contact** - Informations et localisation
9. **Footer** - Réseaux sociaux et mentions légales

## 🎯 Messages WhatsApp Pré-remplis

Le site utilise 3 types de messages selon le contexte :

### Réservation chambre
```
Bonjour Espace Beach Ahoué 👋
Je souhaite avoir des informations / réserver une chambre.
Merci 🙂
```

### Restaurant / Bar
```
Bonjour 👋
Je souhaite consulter le menu ou réserver une table à Espace Beach Ahoué.
Merci 🙂
```

### Événements
```
Bonjour 👋
Je souhaite organiser un événement à Espace Beach Ahoué et avoir plus d'informations.
Merci 🙂
```

## 🌐 SEO

Le site inclut :
- Meta tags optimisés (description, keywords)
- Open Graph pour Facebook
- Structure sémantique HTML5
- Balises alt sur toutes les images
- Hiérarchie de titres appropriée
- Mots-clés locaux : Ahoué, Abidjan, hôtel, plage, restaurant

## 📱 Responsive Design

Breakpoints :
- **Mobile** : < 768px
- **Tablet** : 768px - 1024px
- **Desktop** : > 1024px

Le design est optimisé mobile-first avec :
- Menu hamburger sur mobile
- Boutons pleine largeur
- Images adaptatives
- Texte redimensionnable

## 🎨 Palette de Couleurs

```css
--color-sand: #E8D5C4        /* Beige sable */
--color-ochre: #D4A574       /* Ocre chaud */
--color-palm: #2D5016        /* Vert palmier */
--color-lagoon: #4A90A4      /* Bleu lagon */
--color-charcoal: #2C2C2C    /* Charbon */
```

## ✨ Animations

- Fade-in au scroll sur toutes les sections
- Hover effects sur les cartes et images
- Parallaxe sur le hero
- Pulse animation sur le bouton WhatsApp
- Transitions fluides sur tous les éléments interactifs

## 🔧 Technologies Utilisées

- **HTML5** - Structure sémantique
- **CSS3** - Design system avec variables CSS
- **JavaScript Vanilla** - Pas de dépendances
- **Polices auto-hébergées** - Cormorant Garamond & Montserrat (sous-ensemble latin)
- **Intersection Observer API** - Animations au scroll
- **WhatsApp Business API** - Intégration messaging

## 📊 Performance

- Lazy loading des images et chargement progressif du carrousel
- CSS critique inline et feuilles de styles complètes non bloquantes
- En-tête pré-rendu dans la page d'accueil pour un affichage immédiat
- Polices et icônes auto-hébergées, en sous-ensembles (icônes : 144 Ko → 5 Ko)
- CSS optimisé avec variables
- JavaScript modulaire
- Pas de frameworks lourds
- Images optimisées pour le web (WebP, redimensionnement, dimensions explicites)

## 🌍 Déploiement

### Option 1 : Hébergement gratuit

**Netlify** (Recommandé)
1. Créez un compte sur netlify.com
2. Glissez-déposez le dossier du projet
3. Votre site est en ligne !

**Vercel**
```bash
npm i -g vercel
vercel
```

**GitHub Pages**
1. Créez un repo GitHub
2. Uploadez les fichiers
3. Activez GitHub Pages dans Settings

### Option 2 : Hébergement payant
- OVH
- Hostinger
- Ionos
- O2switch

## 📞 Support

Pour toute question ou modification :
- Éditez les fichiers HTML/CSS/JS directement
- Les commentaires dans le code expliquent chaque section
- Structure claire et modulaire

## 📝 Licence

© 2026 Espace Beach Ahoué - Tous droits réservés

---

**Développé avec ❤️ pour Espace Beach Ahoué**

🏖️ Séjour, détente et convivialité au bord de l'océan
