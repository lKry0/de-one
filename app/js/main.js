document.addEventListener('DOMContentLoaded', function () {
    // Services page menu items
    const menuItems = document.querySelectorAll('.services-page__menu-item');
    const headerItems = document.querySelectorAll('.header__inner');
    const menuLinks = document.querySelectorAll('.header__menu-item');
    
    // Services page menu toggle functionality
    menuItems.forEach(item => {
        const header = item.querySelector('.services-page__menu-header');
        const icon = item.querySelector('.services-page__menu-icon');
        
        if (header && icon) {
            header.addEventListener('click', function () {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                menuItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                        const otherIcon = otherItem.querySelector('.services-page__menu-icon');
                        if (otherIcon) {
                            otherIcon.textContent = '+';
                        }
                    }
                });
        
                // Toggle current item
                if (isActive) {
                    item.classList.remove('active');
                    icon.textContent = '+';
                } else {
                    item.classList.add('active');
                    icon.textContent = '−';
                }
            });
        }
    });
    
    // Check if current page is Services
    function isServicesPage() {
        const currentPage = window.location.pathname;
        return currentPage.includes('services') ||
               currentPage.includes('service') ||
               currentPage.endsWith('services.html');
    }
    
    // Check if current page is About
    function isAboutPage() {
        const currentPage = window.location.pathname;
        return currentPage.includes('about') ||
               currentPage.endsWith('about.html');
    }
    
    // Check if Services section is in view (for single-page sites)
    function checkServicesInView() {
        const servicesSection = document.querySelector('.services-page');
        if (!servicesSection) return false;
        
        const rect = servicesSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        return rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.5;
    }
    
    // Check if About section is in view (for single-page sites)
    function checkAboutInView() {
        const aboutSection = document.querySelector('.about-page');
        if (!aboutSection) return false;
        
        const rect = aboutSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        return rect.top < windowHeight * 0.5 && rect.bottom > windowHeight * 0.5;
    }
   
    // Apply classes based on current page/section
    function applyWhiteClass() {
        const shouldAddWhite = isServicesPage() || 
                              isAboutPage() || 
                              checkServicesInView() || 
                              checkAboutInView();
        
        // Add 'white' class to menu links
        menuLinks.forEach(link => {
            if (shouldAddWhite) {
                link.classList.add('white');
            } else {
                link.classList.remove('white');
            }
        });
        
        // Add 'lined' class to header inner
        headerItems.forEach(item => {
            if (shouldAddWhite) {
                item.classList.add('lined');
            } else {
                item.classList.remove('lined');
            }
        });
    }
    
    // Run on page load
    applyWhiteClass();
    
    // Run on scroll (for single-page navigation)
    window.addEventListener('scroll', applyWhiteClass);
    
    // Run on hash change (for anchor navigation)
    window.addEventListener('hashchange', applyWhiteClass);
});