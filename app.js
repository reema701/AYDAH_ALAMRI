'use strict';
const menu = document.getElementById('menu-toggle');
const sidebar = document.getElementById('sidebar');
const backdrop = document.querySelector('.nav-backdrop');
const navLinks = [...sidebar.querySelectorAll('nav a')];
function setMenu(open) {
  sidebar.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  backdrop.hidden = !open;
  document.body.style.overflow = open ? 'hidden' : '';
}
menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
backdrop.addEventListener('click', () => setMenu(false));
navLinks.forEach(link => link.addEventListener('click', () => {
  setMenu(false);
  activate(link.hash.slice(1));
}));
function activate(id) {
  navLinks.forEach(link => {
    const active = link.hash === '#' + id;
    link.classList.toggle('active', active);
    if (active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
}
const sections = [...document.querySelectorAll('main > section')];
let scheduled = false;
function updateSection() {
  let current = sections[0];
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= 180) current = section;
    else break;
  }
  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20) current = sections[sections.length - 1];
  activate(current.id);
  scheduled = false;
}
addEventListener('scroll', () => {
  if (!scheduled) { scheduled = true; requestAnimationFrame(updateSection); }
}, {passive: true});
updateSection();
addEventListener('resize', () => { if (innerWidth > 900) setMenu(false); });
const dialog = document.getElementById('image-dialog');
const dialogImage = document.getElementById('dialog-image');
const dialogTitle = document.getElementById('dialog-title');
let previousFocus;
document.querySelectorAll('[data-image]').forEach(button => button.addEventListener('click', () => {
  previousFocus = button;
  dialogTitle.textContent = button.dataset.title;
  dialogImage.src = button.dataset.image;
  dialogImage.alt = button.dataset.title;
  dialog.showModal();
  document.body.style.overflow = 'hidden';
}));
document.getElementById('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
dialog.addEventListener('close', () => {
  document.body.style.overflow = '';
  if (previousFocus) previousFocus.focus({preventScroll:true});
});
addEventListener('keydown', event => {
  if (event.key === 'Escape' && sidebar.classList.contains('open')) { setMenu(false); menu.focus(); }
});
