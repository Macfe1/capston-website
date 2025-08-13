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

        if (sectionId === 'hook') {
            if (window.pepitoChart && typeof window.pepitoChart.destroy === 'function') {
                window.pepitoChart.destroy();
            }
            initChart();
        }

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
