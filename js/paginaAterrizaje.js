document.addEventListener('DOMContentLoaded', function() {
            const hamburgerBtn = document.getElementById('hamburger-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            const closeMenuBtn = document.getElementById('close-menu-btn');
            
            // --- Lógica de Navegación Móvil ---
            if(hamburgerBtn) {
                hamburgerBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    mobileMenu.classList.remove('-translate-x-full');
                });
            }
            if(closeMenuBtn) {
                closeMenuBtn.addEventListener('click', () => {
                    mobileMenu.classList.add('-translate-x-full');
                });
            }
            // Opcional: Cerrar menú si se hace clic fuera de él
            document.addEventListener('click', (e) => {
                if (mobileMenu && !mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
                    mobileMenu.classList.add('-translate-x-full');
                }
            })
        });