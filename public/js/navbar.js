const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.getElementById('nav-menu');
const overlay = document.getElementById('overlay');
const closeBtn = document.querySelector('.close-btn');

// Abrir menú
menuToggle.addEventListener('click', () => {
    navMenu.classList.add('open');
    overlay.classList.add('active');
});

// Cerrar al hacer clic en overlay o en la X
overlay.addEventListener('click', closeMenu);
closeBtn.addEventListener('click', closeMenu);

function closeMenu() {
    navMenu.classList.remove('open');
    overlay.classList.remove('active');
}

const submenuToggles = document.querySelectorAll('.submenu-toggle');

submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        const parent = toggle.closest('.has-submenu');
        parent.classList.toggle('open');
    });
});