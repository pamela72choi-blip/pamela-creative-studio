const menuPreview = document.querySelector('.menu-preview');
const menuDetail = document.querySelector('#menu-detail');
menuPreview.addEventListener('click', () => { menuDetail.showModal(); menuDetail.scrollTop = 0; });
menuDetail.querySelector('button').addEventListener('click', () => menuDetail.close());
menuDetail.addEventListener('click', event => {
  if (event.target !== menuDetail) return;
  const box = menuDetail.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) menuDetail.close();
});
