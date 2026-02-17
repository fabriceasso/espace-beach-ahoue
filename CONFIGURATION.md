# 🔧 Guide de Configuration - Espace Beach Ahoué

Ce guide vous aide à configurer rapidement les éléments essentiels du site.

## 📲 1. Configuration WhatsApp

### Étape 1 : Obtenir votre numéro au format international

Votre numéro WhatsApp doit être au format international **sans espaces, tirets ou symboles** :

**Format** : `[Code pays][Numéro]`

**Exemple pour la Côte d'Ivoire** :
- Numéro local : `07 09 12 34 56`
- Code pays : `225`
- Format final : `2250709123456`

### Étape 2 : Modifier le fichier JavaScript

Ouvrez le fichier : `assets/js/script.js`

Trouvez la ligne 16 :
```javascript
whatsappNumber: '2250000000000', // Format: code pays + numéro sans espaces
```

Remplacez par votre numéro :
```javascript
whatsappNumber: '2250709123456', // Votre numéro ici
```

### Étape 3 : Tester

1. Sauvegardez le fichier
2. Rafraîchissez la page dans votre navigateur (F5)
3. Cliquez sur un bouton WhatsApp
4. Vérifiez que WhatsApp s'ouvre avec le bon numéro

---

## 🗺️ 2. Configuration Google Maps

### Étape 1 : Obtenir les coordonnées GPS

**Option A : Utiliser Google Maps**
1. Allez sur [Google Maps](https://www.google.com/maps)
2. Recherchez "Ahoué, Côte d'Ivoire" ou votre adresse exacte
3. Clic droit sur l'emplacement → "Plus d'infos sur cet endroit"
4. Notez les coordonnées (ex: `5.3000, -4.0000`)

**Option B : Utiliser un GPS**
- Relevez les coordonnées GPS sur place

### Étape 2 : Obtenir le code d'intégration

1. Sur Google Maps, cliquez sur **Partager**
2. Sélectionnez **Intégrer une carte**
3. Copiez le code iframe complet

### Étape 3 : Modifier le fichier HTML

Ouvrez le fichier : `index.html`

Trouvez la ligne 410 (section Contact) :
```html
<iframe 
    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.4!2d-4.0!3d5.3!..."
    ...
</iframe>
```

Remplacez tout le bloc `<iframe>` par le code copié depuis Google Maps.

### Étape 4 : Tester

1. Sauvegardez le fichier
2. Rafraîchissez la page
3. Scrollez jusqu'à la section Contact
4. Vérifiez que la carte affiche le bon emplacement

---

## 🎨 3. Personnalisation des Couleurs (Optionnel)

Si vous souhaitez modifier les couleurs du site :

Ouvrez le fichier : `assets/css/styles.css`

Trouvez les lignes 10-24 (variables CSS) :
```css
:root {
  --color-sand: #E8D5C4;        /* Beige sable */
  --color-ochre: #D4A574;       /* Ocre chaud */
  --color-palm: #2D5016;        /* Vert palmier */
  --color-lagoon: #4A90A4;      /* Bleu lagon */
  --color-charcoal: #2C2C2C;    /* Charbon */
}
```

Modifiez les codes couleur hexadécimaux selon vos préférences.

**Outil recommandé** : [Coolors.co](https://coolors.co) pour créer une palette harmonieuse.

---

## 📝 4. Modification des Textes

Tous les textes sont dans le fichier `index.html`.

### Modifier le slogan principal

Ligne 59-64 (Hero section) :
```html
<h1>Espace Beach Ahoué</h1>
<p class="subtitle">Votre nouveau sous-titre ici</p>
```

### Modifier les descriptions

Cherchez les sections par leur ID :
- `id="presentation"` - Présentation du complexe
- `id="hebergement"` - Hébergement
- `id="restaurant"` - Restaurant & Bar
- etc.

---

## 🖼️ 5. Ajouter/Remplacer des Images

### Structure actuelle

Les images sont dans : `ressources/images/`

### Ajouter une nouvelle image

1. Placez votre image dans `ressources/images/`
2. Dans `index.html`, ajoutez :
```html
<div class="gallery-item">
    <img src="ressources/images/votre-image.jpg" alt="Description">
</div>
```

### Remplacer une image existante

Remplacez simplement le fichier dans `ressources/images/` en gardant le même nom.

**Recommandations** :
- Format : JPG ou WebP
- Taille max : 1920px de largeur
- Poids : < 500 KB par image
- Optimisation : [TinyPNG.com](https://tinypng.com)

---

## 🌐 6. Déploiement en Ligne

### Option 1 : Netlify (Gratuit et Simple)

1. Créez un compte sur [netlify.com](https://netlify.com)
2. Glissez-déposez le dossier complet du projet
3. Votre site est en ligne en quelques secondes !
4. Netlify vous donne une URL (ex: `espace-beach-ahoue.netlify.app`)

### Option 2 : Vercel (Gratuit)

```bash
# Installer Vercel CLI
npm i -g vercel

# Dans le dossier du projet
vercel
```

Suivez les instructions à l'écran.

### Option 3 : GitHub Pages (Gratuit)

1. Créez un compte GitHub
2. Créez un nouveau repository
3. Uploadez tous les fichiers
4. Dans Settings → Pages, activez GitHub Pages
5. Votre site sera à : `votre-username.github.io/nom-du-repo`

### Option 4 : Hébergement traditionnel

Pour OVH, Hostinger, Ionos, etc. :
1. Achetez un hébergement web
2. Connectez-vous via FTP (FileZilla)
3. Uploadez tous les fichiers dans le dossier `public_html` ou `www`
4. Votre site sera accessible via votre nom de domaine

---

## 🔍 7. Vérifications Finales

### Checklist avant mise en ligne

- [ ] Numéro WhatsApp configuré et testé
- [ ] Google Maps affiche le bon emplacement
- [ ] Toutes les images se chargent correctement
- [ ] Les liens Facebook fonctionnent
- [ ] Le site est responsive (testé sur mobile)
- [ ] Tous les textes sont corrects (pas de fautes)
- [ ] Les boutons WhatsApp ouvrent l'application
- [ ] Le menu de navigation fonctionne
- [ ] La galerie lightbox fonctionne

### Test sur mobile

1. Ouvrez le site sur votre smartphone
2. Testez tous les boutons
3. Vérifiez le menu hamburger
4. Testez le bouton WhatsApp flottant

---

## 📞 Support

### Fichiers importants

- `index.html` - Structure et contenu
- `assets/css/styles.css` - Design et couleurs
- `assets/js/script.js` - Fonctionnalités interactives
- `README.md` - Documentation générale

### Modifications courantes

**Changer le numéro WhatsApp** → `assets/js/script.js` ligne 16  
**Changer la carte** → `index.html` ligne 410  
**Changer les couleurs** → `assets/css/styles.css` lignes 10-24  
**Changer les textes** → `index.html` (cherchez la section concernée)

---

## 🚀 Commandes Utiles

### Lancer un serveur local

```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server -p 8000

# PHP
php -S localhost:8000
```

Puis ouvrez : `http://localhost:8000`

### Optimiser les images

Utilisez [TinyPNG](https://tinypng.com) ou :

```bash
# Avec ImageMagick
magick convert image.jpg -quality 85 -resize 1920x image-optimized.jpg
```

---

## ✅ C'est Prêt !

Une fois ces configurations effectuées, votre site est **100% opérationnel** et prêt à être déployé !

**Bon lancement ! 🎉**

---

**Questions ?** Consultez le [README.md](README.md) pour plus de détails.
