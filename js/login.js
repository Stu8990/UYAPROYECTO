 document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('login-form');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const emailError = document.getElementById('email-error');
            const passwordError = document.getElementById('password-error');
            const togglePasswordBtn = document.getElementById('toggle-password');
            const eyeOpen = document.getElementById('eye-open');
            const eyeClosed = document.getElementById('eye-closed');
            const hamburgerBtn = document.getElementById('hamburger-btn');
            const mobileMenu = document.getElementById('mobile-menu');
            const closeMenuBtn = document.getElementById('close-menu-btn');
            
            // --- Notificación ---
            const notification = document.getElementById('notification');
            const notificationMessage = document.getElementById('notification-message');
            let notificationTimer;

            function showNotification(message, isError = true) {
                clearTimeout(notificationTimer);
                notificationMessage.textContent = message;
                notification.className = `fixed top-5 right-5 text-white py-2 px-4 rounded-lg shadow-lg opacity-100 transform translate-y-0 ${isError ? 'bg-red-500' : 'bg-green-500'}`;
                
                notificationTimer = setTimeout(() => {
                    notification.className = notification.className.replace('opacity-100 transform translate-y-0', 'opacity-0 transform translate-y-[-20px]');
                }, 3000);
            }

            // --- Lógica de Navegación Móvil ---
            hamburgerBtn.addEventListener('click', () => {
                mobileMenu.classList.remove('-translate-x-full');
            });
            closeMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.add('-translate-x-full');
            });
            
            // --- Lógica para mostrar/ocultar contraseña ---
            togglePasswordBtn.addEventListener('click', () => {
                const isPassword = passwordInput.type === 'password';
                passwordInput.type = isPassword ? 'text' : 'password';
                eyeOpen.classList.toggle('hidden', isPassword);
                eyeClosed.classList.toggle('hidden', !isPassword);
            });
            
            // --- Funciones de Validación ---
            function validateEmail() {
                const emailValue = emailInput.value.trim();
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (emailValue === '') {
                    emailError.textContent = 'El email es obligatorio.';
                    emailInput.classList.add('border-error');
                    return false;
                } else if (!emailRegex.test(emailValue)) {
                    emailError.textContent = 'Por favor, introduce un email válido.';
                    emailInput.classList.add('border-error');
                    return false;
                } else {
                    emailError.textContent = '';
                    emailInput.classList.remove('border-error');
                    return true;
                }
            }
            
            function validatePassword() {
                if (passwordInput.value.trim() === '') {
                    passwordError.textContent = 'La contraseña es obligatoria.';
                    passwordInput.classList.add('border-error');
                    return false;
                } else {
                    passwordError.textContent = '';
                    passwordInput.classList.remove('border-error');
                    return true;
                }
            }

            // --- Event Listeners para validación en tiempo real ---
            emailInput.addEventListener('blur', validateEmail);
            passwordInput.addEventListener('blur', validatePassword);

            // --- Lógica de envío de formulario ---
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                
                const isEmailValid = validateEmail();
                const isPasswordValid = validatePassword();
                
                if (isEmailValid && isPasswordValid) {
                    console.log('Formulario válido, listo para enviar.');
                    console.log('Email:', emailInput.value);
                    console.log('Recordarme:', document.getElementById('remember').checked);
                    showNotification('¡Inicio de sesión exitoso!', false);
                    // Aquí iría la lógica real de envío al servidor
                } else {
                    console.log('El formulario contiene errores.');
                    showNotification('Por favor, corrige los errores en el formulario.');
                }
            });
        });