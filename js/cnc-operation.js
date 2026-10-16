(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 768px)');
  const header = document.querySelector('.site-header');
  const states = [...document.querySelectorAll('[data-cnc-scene]')].map(track => ({
    track, scene: track.querySelector('.cnc-scene'), back: track.querySelector('.cnc-back'),
    front: track.querySelector('.cnc-front'), type: track.dataset.cncScene,
    current: 0, target: 0, velocity: 0, width: 0, height: 0, documentTop: 0, top: 0, travel: 1, lastDrawn: -1
  }));
  let pending = false, previous = 0;
  const clamp = n => Math.max(0, Math.min(1, n));
  let layoutDirty = true, targetsDirty = true;
  function measure() {
    const headerHeight = header?.getBoundingClientRect().height || 0;
    const scroll = window.scrollY;
    // Complete all layout reads before any style writes.
    for (const state of states) {
      state.width = state.scene.clientWidth;
      state.height = state.scene.clientHeight;
      // Keep a wide scene inside short landscape windows as well as below the header.
      const top = Math.min(headerHeight + 16, Math.max(0, innerHeight - state.height - 16));
      state.top = top;
      state.travel = compact.matches ? innerHeight + state.height : Math.max(1, state.track.offsetHeight - state.height);
      state.documentTop = state.track.getBoundingClientRect().top + scroll;
    }
    for (const state of states) state.track.style.setProperty('--cnc-top', state.top + 'px');
    layoutDirty = false;
    targetsDirty = true;
  }
  function updateTargets() {
    const scroll = window.scrollY;
    for (const state of states) state.target = reduced.matches ? 0 : clamp((scroll + (compact.matches ? innerHeight : state.top) - state.documentTop) / state.travel);
    targetsDirty = false;
  }
  function draw(state) {
    const p = state.current;
    if (state.lastDrawn === p) return;
    state.lastDrawn = p;
    if (state.type === 'vertical') {
      const y = reduced.matches ? 0 : (.008 - p * .016) * state.height;
      const x = reduced.matches ? 0 : (.004 - p * .008) * state.width;
      state.front.style.transform = `translate3d(${x}px,${y}px,0) scale(1.08)`;
      state.back.style.transform = `translate3d(0,${p * state.height * .005}px,0) scale(1.04)`;
    } else {
      state.back.style.transform = `translate3d(${p * state.width * .012}px,0,0) scale(${1.08 - p * .04})`;
      state.front.style.transform = `translate3d(${-p * state.width * .022}px,0,0)`;
    }
  }
  function frame(time) {
    if (layoutDirty) measure();
    if (targetsDirty) updateTargets();
    const dt = previous ? Math.min((time - previous) / 1000, .032) : 1 / 60;
    previous = time;
    let moving = false;
    for (const state of states) {
      const scroll = window.scrollY;
      const visible = state.documentTop + state.height + state.travel > scroll && state.documentTop < scroll + innerHeight;
      if (!visible) { state.current = state.target; state.velocity = 0; continue; }
      if (reduced.matches) { state.current = 0; state.velocity = 0; }
      else {
        const step = dt / 4;
        for (let i = 0; i < 4; i++) {
          state.velocity += ((state.target - state.current) * 100 - state.velocity * 20) * step;
          state.current += state.velocity * step;
        }
      }
      if (Math.abs(state.target - state.current) < .00008 && Math.abs(state.velocity) < .0008) {
        state.current = state.target; state.velocity = 0;
      } else moving = true;
      draw(state);
    }
    if (moving) requestAnimationFrame(frame);
    else { pending = false; previous = 0; }
  }
  function update() {
    targetsDirty = true;
    if (!pending) { pending = true; requestAnimationFrame(frame); }
  }
  function resize() { layoutDirty = true; for (const state of states) state.lastDrawn = -1; update(); }
  addEventListener('scroll', update, { passive: true });
  addEventListener('resize', resize, { passive: true });
  addEventListener('pageshow', resize);
  reduced.addEventListener('change', resize);
  compact.addEventListener('change', resize);
  const observer = new ResizeObserver(resize);
  if (header) observer.observe(header);
  for (const state of states) observer.observe(state.scene);
  measure();
  updateTargets();
  for (const state of states) { state.current = state.target; draw(state); }
})();

(() => {
  const artworks = [...document.querySelectorAll('.cnc-artwork')];
  if (!artworks.length) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || !('IntersectionObserver' in window)) return;
  artworks.forEach(art => art.classList.add('scroll-reveal'));
  const reveal = art => {
    if (art.classList.contains('scroll-reveal--visible')) return;
    art.classList.add('scroll-reveal--visible');
    observer.unobserve(art.parentElement);
  };
  const observer = new IntersectionObserver(entries => {
    if (document.documentElement.classList.contains('is-loading')) return;
    entries.forEach(entry => {
      if (entry.isIntersecting) reveal(entry.target.querySelector('.cnc-artwork'));
    });
  }, { threshold: .15, rootMargin: '0px 0px -24px 0px' });
  artworks.forEach(art => observer.observe(art.parentElement));
  function revealVisible() {
    if (document.documentElement.classList.contains('is-loading')) return;
    artworks.forEach(art => {
      const bounds = art.parentElement.getBoundingClientRect();
      if (bounds.top < innerHeight - 24 && bounds.bottom > 0) reveal(art);
    });
    loadingObserver.disconnect();
  }
  const loadingObserver = new MutationObserver(revealVisible);
  loadingObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  revealVisible();
  motion.addEventListener('change', event => {
    if (!event.matches) return;
    observer.disconnect(); loadingObserver.disconnect();
    artworks.forEach(art => art.classList.remove('scroll-reveal', 'scroll-reveal--visible'));
  });
})();
