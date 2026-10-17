const wallPreview = document.querySelector('.wall-preview');
const wallDetail = document.querySelector('#wall-detail');
wallPreview.addEventListener('click', () => { wallDetail.showModal(); wallDetail.scrollTop = 0; });
wallDetail.querySelector('button').addEventListener('click', () => wallDetail.close());
wallDetail.addEventListener('click', event => {
  if (event.target !== wallDetail) return;
  const box = wallDetail.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) wallDetail.close();
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
