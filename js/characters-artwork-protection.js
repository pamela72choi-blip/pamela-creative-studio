(() => {
  const selector = 'main img, main .project-detail-trigger, .product-modal__content img';
  const isArtwork = target => target instanceof Element && target.closest(selector);
  for (const type of ['contextmenu', 'dragstart']) {
    document.addEventListener(type, event => { if (isArtwork(event.target)) event.preventDefault(); }, { capture: true });
  }
})();
