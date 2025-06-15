
const navMenuShort = document.getElementById('nav-menu');

// Función para alternar menú
function toggleMenu() {
    navMenuShort.classList.toggle('open');
    overlay.classList.toggle('active');
}

// Función para cerrar menú
function closeMenu() {
    navMenuShort.classList.remove('open');
    overlay.classList.remove('active');
}

// Atajos de teclado
document.addEventListener('keydown', (e) => {
    const isMenuOpen = navMenuShort.classList.contains('open');

    // Tecla ESC: alternar menú
    if (e.key === 'Escape') {
        e.preventDefault();
        toggleMenu();
    }

    // Ejemplo: Ctrl + 1 para ir al home
    if (e.ctrlKey && e.key === '1') {
        window.location.href = '/';
    }

    // Ejemplo: Ctrl + 2 para ir al módulo clientes
    if (e.ctrlKey && e.key === '2') {
        window.location.href = '/clientes';
    }

    // Ejemplo: Ctrl + 3 para ir al módulo casos
    if (e.ctrlKey && e.key === '3') {
        window.location.href = '/casos';
    }

    // Puedes seguir agregando más...
});

