(() => {
  const selector = '.social-gallery__wide, .social-gallery__wide img';
  for (const type of ['contextmenu', 'dragstart']) {
    document.addEventListener(type, event => {
      if (event.target instanceof Element && event.target.closest(selector)) event.preventDefault();
    }, {capture:true});
  }
})();
