document.addEventListener('DOMContentLoaded', () => {
            // --- Lógica para el Modal de Play ---
            const playButton = document.getElementById('play-button');
            const playModal = document.getElementById('play-modal');
            const closePlayModalButton = document.getElementById('close-play-modal');

            function openPlayModal() {
                playModal.classList.remove('hidden');
            }
            function closePlayModal() {
                playModal.classList.add('hidden');
            }

            playButton.addEventListener('click', openPlayModal);
            closePlayModalButton.addEventListener('click', closePlayModal);

            // --- Lógica para el Modal de Share ---
            const shareButton = document.getElementById('share-button');
            const shareModal = document.getElementById('share-modal');
            const closeShareModalButton = document.getElementById('close-share-modal');
            
            function openShareModal() {
                shareModal.classList.remove('hidden');
            }
            function closeShareModal() {
                shareModal.classList.add('hidden');
            }

            shareButton.addEventListener('click', openShareModal);
            closeShareModalButton.addEventListener('click', closeShareModal);

            // --- Cerrar modales al hacer clic en el fondo ---
            [playModal, shareModal].forEach(modal => {
                if(modal) {
                    modal.addEventListener('click', (event) => {
                        // Si el clic es en el backdrop (el contenedor) y no en el contenido del modal
                        if (event.target === modal) {
                            modal.classList.add('hidden');
                        }
                    });
                }
            });
        });