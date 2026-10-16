const menuPreview = document.querySelector('.menu-preview');
const menuDetail = document.querySelector('#menu-detail');
menuPreview.addEventListener('click', () => { menuDetail.showModal(); menuDetail.scrollTop = 0; });
menuDetail.querySelector('button').addEventListener('click', () => menuDetail.close());
menuDetail.addEventListener('click', event => {
  if (event.target !== menuDetail) return;
  const box = menuDetail.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) menuDetail.close();
});

// This page uses compressed WebP for decorative animations as well as artwork.
const menuShortcutImage = document.querySelector('.solution-shortcut img');
if (menuShortcutImage) menuShortcutImage.src = 'assets/images/menu-design/find-the-right-solution.webp?v=20261017';
// Cover image wrappers too, so right-clicking their padding cannot expose a menu.
const protectedMenuImage = 'img, .menu-preview, .menu-detail';
for (const eventName of ['contextmenu', 'dragstart']) {
  document.addEventListener(eventName, event => {
    if (event.target instanceof Element && event.target.closest(protectedMenuImage)) event.preventDefault();
  }, {capture:true});
}
document.querySelectorAll('img').forEach(image => { image.draggable = false; });
