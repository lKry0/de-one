document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;
    const currentPage =
        path.substring(path.lastIndexOf('/') + 1) || 'index.html';

    document.querySelectorAll('.header__menu-link').forEach(link => {
        const href = link.getAttribute('href');

        // Skip Contact completely
        if (href.includes('#contact')) {
            link.classList.remove('active');
            return;
        }

        // Extract filename only (ignore #hash)
        const linkPage =
            href.substring(href.lastIndexOf('/') + 1).split('#')[0];

        link.classList.remove('active');

        // Index page → Home active
        if (currentPage === 'index.html' && href.includes('#home')) {
            link.classList.add('active');
        }

        // Other pages
        if (linkPage === currentPage && currentPage !== 'index.html') {
            link.classList.add('active');
        }
    });
});
