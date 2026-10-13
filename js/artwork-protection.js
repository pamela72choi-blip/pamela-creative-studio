// Protect artwork images and their interactive wrappers, including dynamically opened previews.
(() => {
  const artwork = 'main img, main [data-manuscripts], main .concept-card, .product-modal__content img';
  const isArtwork = target => target instanceof Element && target.closest(artwork);
  document.addEventListener('contextmenu', event => {
    if (isArtwork(event.target)) event.preventDefault();
  }, { capture: true });
  document.addEventListener('dragstart', event => {
    if (isArtwork(event.target)) event.preventDefault();
  }, { capture: true });
})();
