document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.services__menu-item');
    
    menuItems.forEach(item => {
        const header = item.querySelector('.services__menu-header');
        const icon = item.querySelector('.services__menu-icon');
        
        header.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            menuItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    const otherIcon = otherItem.querySelector('.services__menu-icon');
                    otherIcon.textContent = '+';
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
    });
});