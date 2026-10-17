document.querySelectorAll('.wall-preview').forEach(preview => {
  const detail = document.getElementById(preview.getAttribute('aria-controls'));
  if (!detail) return;
  preview.addEventListener('click', () => { detail.showModal(); detail.scrollTop = 0; });
  detail.querySelector('.wall-detail__close').addEventListener('click', () => detail.close());
  detail.addEventListener('click', event => {
    if (event.target !== detail) return;
    const box = detail.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) detail.close();
  });
});

// This page uses compressed WebP for decorative animations as well as artwork.
const menuShortcutImage = document.querySelector('.solution-shortcut img');
if (menuShortcutImage) menuShortcutImage.src = 'assets/images/menu-design/find-the-right-solution.webp?v=20261017';
// Cover image wrappers too, so right-clicking their padding cannot expose a menu.
const protectedMenuImage = 'img, .wall-preview, .wall-detail';
for (const eventName of ['contextmenu', 'dragstart']) {
  document.addEventListener(eventName, event => {
    if (event.target instanceof Element && event.target.closest(protectedMenuImage)) event.preventDefault();
  }, {capture:true});
}
document.querySelectorAll('img').forEach(image => { image.draggable = false; });
