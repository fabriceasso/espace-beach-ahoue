// Charge uniquement le sous-ensemble d'icônes Phosphor réellement utilisé.
// Le fichier complet contenait les styles des 6 variantes (~700 Ko de CSS).
(function () {
  var head = document.getElementsByTagName('head')[0];
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.type = 'text/css';
  link.href = 'assets/js/vendor/phosphor-used.css';
  head.appendChild(link);
})();
