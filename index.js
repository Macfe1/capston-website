//Index.js
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('hidden');
        section.classList.remove('fade-in', 'slide-in');
    });

    // Show selected section with animation
    const targetSection = document.getElementById(sectionId);
    targetSection.classList.remove('hidden');
    setTimeout(() => {
        targetSection.classList.add('fade-in');

        // Add slide-in animation to specific elements
        const slideElements = targetSection.querySelectorAll('.slide-in');
        slideElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.animation = `slideIn 0.6s ease-out ${index * 0.1}s forwards`;
            }, 100);
        });
    }, 50);

    // Update navigation
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Highlight active nav button
    const clickedBtn = document.querySelector(`button[onclick="showSection('${sectionId}')"]`);
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }
}

// Initialize with hook section
document.addEventListener('DOMContentLoaded', function () {
    const hookBtn = document.querySelector('button[onclick="showSection(\'hook\')"]');
    hookBtn.classList.add('active');
    showSection('hook');
});

// Add smooth scroll behavior
document.querySelectorAll('button[onclick*="showSection"]').forEach(button => {
    button.addEventListener('click', function () {
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
    });
});

// Add loading effect to buttons
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function () {
        this.classList.add('loading');
        setTimeout(() => {
            this.classList.remove('loading');
        }, 1000);
    });
});

document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('dragstart', e => e.preventDefault());

//MOBILE  MENU
// Abrir/cerrar menú móvil
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        menuBtn.setAttribute('aria-expanded', mobileMenu.classList.contains('hidden') ? 'false' : 'true');
    });

    // Cerrar al elegir una opción
    mobileMenu.querySelectorAll('button').forEach(b =>
        b.addEventListener('click', () => mobileMenu.classList.add('hidden'))
    );

    // Cerrar si pasas a desktop
    window.addEventListener('resize', () => {
        if (window.matchMedia('(min-width: 768px)').matches) mobileMenu.classList.add('hidden');
    });
}

// Ajusta --nav-offset para que las anclas no se oculten bajo el nav fijo
function setNavOffset() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    document.documentElement.style.setProperty('--nav-offset', nav.offsetHeight + 'px');
}
window.addEventListener('load', setNavOffset);
window.addEventListener('resize', setNavOffset);
