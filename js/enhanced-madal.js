/* ============================================
   ENHANCED MODAL CONTROLLER
   Archivo: js/enhanced-modal.js
   ============================================ */

const EnhancedModalController = {
    gameTypes: {
        text: { name: "Text Challenge", icon: "📝", color: "purple" },
        video: { name: "Video Challenge", icon: "🎬", color: "purple" },
        image: { name: "Visual Discovery", icon: "🖼️", color: "blue" }
    },

    init() {
        this.enhancePlayButton();
        this.bindModalEvents();
        console.log('🎮 Enhanced Modal Controller initialized');
    },

    enhancePlayButton() {
        const playButton = document.getElementById('play-button');
        if (!playButton) return;

        // Limpiar event listeners existentes clonando el elemento
        const newPlayButton = playButton.cloneNode(true);
        playButton.parentNode.replaceChild(newPlayButton, playButton);
        
        // Añadir nuevo comportamiento
        newPlayButton.addEventListener('click', () => {
            this.openModal();
        });
    },

    bindModalEvents() {
        // Manejar selección de tipo de juego
        const gameTypeCards = document.querySelectorAll('.game-type-card');
        gameTypeCards.forEach(card => {
            card.addEventListener('click', () => {
                const gameType = card.dataset.gameType;
                const gameUrl = card.dataset.url;
                this.selectGameType(gameType, gameUrl);
            });
            
            // Efectos hover mejorados
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05) translateY(-5px)';
                card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1) translateY(0)';
                card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
            });
        });
        
        // Botones de cerrar
        const closeButtons = [
            document.getElementById('close-play-modal'),
            document.getElementById('close-play-modal-footer')
        ];
        
        closeButtons.forEach(btn => {
            if (btn) {
                btn.addEventListener('click', () => this.closeModal());
            }
        });
        
        // Cerrar al hacer clic fuera del modal
        const modal = document.getElementById('play-modal');
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
        
        // Botón de preview (opcional)
        const previewBtn = document.querySelector('.btn.btn-info');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => {
                this.showPreview();
            });
        }
    },

    openModal() {
        const modal = document.getElementById('play-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Enfocar el primer elemento del modal para accesibilidad
            const firstCard = modal.querySelector('.game-type-card');
            if (firstCard) {
                firstCard.focus();
            }
        }
    },

    closeModal() {
        const modal = document.getElementById('play-modal');
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    },

    selectGameType(gameType, gameUrl) {
        // Guardar selección
        localStorage.setItem('selectedGameType', gameType);
        
        // Mostrar animación de transición
        this.showGameTransition(gameType, gameUrl);
    },

    showGameTransition(gameType, gameUrl) {
        // Cerrar modal actual
        this.closeModal();
        
        const gameInfo = this.gameTypes[gameType];
        
        // Crear modal de transición dinámico
        const transitionModal = document.createElement('div');
        transitionModal.className = 'modal-backdrop fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        transitionModal.id = 'transition-modal';
        
        transitionModal.innerHTML = `
            <div class="modal bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 m-4 text-center">
                <div class="text-8xl mb-6 animate-bounce">${gameInfo.icon}</div>
                <h3 class="text-3xl font-bold mb-4 text-${gameInfo.color}-600">
                    ${gameInfo.name}
                </h3>
                <p class="text-xl text-gray-600 mb-6">Starting your game...</p>
                <div class="flex justify-center mb-4">
                    <div class="loading-spinner"></div>
                </div>
                <p class="text-sm text-gray-500">Get ready for an amazing learning experience!</p>
                
                <!-- Información adicional -->
                <div class="mt-6 p-4 bg-gray-50 rounded-lg">
                    <div class="text-sm text-gray-600">
                        <div class="font-semibold mb-2">Game Features:</div>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div>✅ 10 Questions</div>
                            <div>✅ 15 Points Each</div>
                            <div>✅ Team vs Team</div>
                            <div>✅ Real-time Scoring</div>
                        </div>
                    </div>
                </div>
                
                <!-- Barra de progreso -->
                <div class="mt-4">
                    <div class="w-full bg-gray-200 rounded-full h-2">
                        <div class="bg-${gameInfo.color}-600 h-2 rounded-full transition-all duration-3000 loading-bar" style="width: 0%"></div>
                    </div>
                    <p class="text-xs text-gray-500 mt-2">Loading game assets...</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(transitionModal);
        
        // Animar la barra de progreso
        setTimeout(() => {
            const progressBar = transitionModal.querySelector('.loading-bar');
            if (progressBar) {
                progressBar.style.width = '100%';
            }
        }, 100);
        
        // Redirigir después de la animación
        setTimeout(() => {
            window.location.href = gameUrl;
        }, 3200);
    },

    showPreview() {
        const previewContent = `
            <div class="text-center">
                <h3 class="text-2xl font-bold mb-6 text-purple-800">📋 Game Preview</h3>
                <div class="grid grid-cols-1 gap-4 mb-6">
                    <div class="bg-purple-50 p-4 rounded-lg">
                        <h4 class="font-bold text-purple-800 mb-2">Sample Questions:</h4>
                        <div class="text-left space-y-2 text-sm">
                            <p>• I didn't even bother ______ (ask).</p>
                            <p>• I hate ______ (do) the dishes!</p>
                            <p>• I prefer ______ (work) in teams.</p>
                            <p class="text-purple-600 font-semibold">...and 7 more questions!</p>
                        </div>
                    </div>
                    
                    <div class="bg-blue-50 p-4 rounded-lg">
                        <h4 class="font-bold text-blue-800 mb-2">Game Rules:</h4>
                        <div class="text-left space-y-1 text-sm">
                            <p>• Teams take turns selecting questions</p>
                            <p>• Each correct answer = 15 points</p>
                            <p>• Team with most points wins!</p>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary close-preview-btn">Start Playing!</button>
            </div>
        `;

        const previewModal = this.createDynamicModal('Game Preview', previewContent);
        
        const closeBtn = previewModal.querySelector('.close-preview-btn');
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(previewModal);
            this.openModal(); // Reabrir el modal de selección
        });
    },

    createDynamicModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal-backdrop fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="modal bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 m-4">
                <div class="modal-header mb-4">
                    <h2 class="modal-title text-xl font-bold text-center">${title}</h2>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        return modal;
    },

    // Método público para uso externo
    forceGameSelection(gameType) {
        const gameUrls = {
            text: 'game-board.html',
            video: 'video-game-board.html',
            image: 'image-game-board.html'
        };
        
        if (gameUrls[gameType]) {
            this.selectGameType(gameType, gameUrls[gameType]);
        }
    }
};

// Auto-inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // Solo inicializar en game-main.html
    if (window.location.pathname.includes('game-main') || 
        document.getElementById('play-modal')) {
        EnhancedModalController.init();
    }
});

// Exportar para uso global
window.EnhancedModalController = EnhancedModalController;

// Funciones globales de conveniencia
window.openGameSelector = () => EnhancedModalController.openModal();
window.selectGame = (type) => EnhancedModalController.forceGameSelection(type);

console.log('🎮 Enhanced Modal Controller loaded successfully!');