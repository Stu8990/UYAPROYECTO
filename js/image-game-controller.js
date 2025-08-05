/* ============================================
   IMAGE GAME CONTROLLER - VERSIÓN COMPLETA
   Archivo: js/image-game-controller.js
   ============================================ */

// 🔧 Image Game Controller - VERSIÓN COMPLETA Y CORREGIDA
const ImageGameController = {
    currentQuestion: null,
    zoomLevel: 1,
    hintModeActive: false,
    imageLoadTimeout: null,
    
    // 🔧 MEJORES IMÁGENES - URLs más estables y específicas
    imageData: [
        {
            id: 1,
            title: "Nature Scene",
            imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=entropy&q=80",
            question: "What is the main element in the center of this mountain landscape?",
            answer: "A serene mountain lake reflecting the surrounding peaks and forest.",
            points: 15,
            isUsed: false,
            category: "nature"
        },
        {
            id: 2,
            title: "Urban Architecture", 
            imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop&crop=entropy&q=80",
            question: "What architectural style is prominently featured in this building?",
            answer: "Modern glass and steel skyscraper architecture with geometric patterns.",
            points: 15,
            isUsed: false,
            category: "architecture"
        },
        {
            id: 3,
            title: "Historical Monument",
            imageUrl: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop&crop=entropy&q=80",
            question: "What historical period does this architecture represent?",
            answer: "Ancient Roman or Greek classical architecture with prominent columns.",
            points: 15,
            isUsed: false,
            category: "history"
        },
        {
            id: 4,
            title: "Wildlife Photography",
            imageUrl: "https://images.unsplash.com/photo-1549366021-9f761d040a94?w=800&h=600&fit=crop&crop=entropy&q=80",
            question: "What type of animal behavior is being shown in this image?",
            answer: "A bird in its natural habitat, possibly hunting or foraging for food.",
            points: 15,
            isUsed: false,
            category: "wildlife"
        },
        {
            id: 5,
            title: "Artistic Creation",
            imageUrl: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop&crop=entropy&q=80",
            question: "What artistic medium is being used in this creation?",
            answer: "Watercolor or acrylic painting with vibrant colors and brush techniques.",
            points: 15,
            isUsed: false,
            category: "art"
        },
        {
            id: 6,
            title: "Technology Scene",
            imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&crop=entropy&q=80",
            question: "What modern technology is featured in this image?",
            answer: "Computer programming or coding environment with multiple screens and code.",
            points: 15,
            isUsed: false,
            category: "technology"
        }
    ],
    
    teams: [
        { id: 1, name: "Team 1", score: 0 },
        { id: 2, name: "Team 2", score: 0 }
    ],
    
    currentTeam: 1,
    gameState: "playing",
    
    init() {
        this.createImageTiles();
        this.bindEvents();
        this.updateUI();
        this.updateStats();
        console.log("🖼️ Image Game Controller initialized - FIXED VERSION");
    },
    
    createImageTiles() {
        const board = document.getElementById('image-game-board');
        if (!board) return;
        
        board.innerHTML = '';
        
        this.imageData.forEach((image, index) => {
            const tile = document.createElement('div');
            tile.className = `image-tile cursor-pointer transition-all duration-300 transform hover:scale-105 ${image.isUsed ? 'opacity-75' : 'hover:shadow-xl'}`;
            tile.dataset.imageId = image.id;
            
            tile.innerHTML = `
                <div class="relative bg-gradient-to-br from-pink-400 to-orange-400 rounded-xl shadow-lg overflow-hidden min-h-[250px] ${image.isUsed ? 'ring-4 ring-green-400' : ''}">
                    ${image.isUsed ? `
                        <img src="${image.imageUrl}" alt="${image.title}" class="w-full h-48 object-cover" loading="lazy">
                        <div class="absolute top-2 right-2 bg-emerald-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">✓</div>
                    ` : `
                        <div class="absolute inset-0 bg-gradient-to-br from-blue-600 to-teal-600 flex items-center justify-center">
                            <div class="text-center text-white">
                                <div class="text-6xl mb-4">🖼️</div>
                                <h3 class="font-bold text-xl mb-2">${image.title}</h3>
                                <p class="text-sm opacity-90">Click to reveal</p>
                                <div class="mt-4 bg-white/20 px-3 py-1 rounded-full">
                                    <span class="text-sm font-bold">${image.points} pts</span>
                                </div>
                            </div>
                        </div>
                    `}
                    <div class="p-4 bg-white">
                        <h3 class="font-bold text-gray-800 mb-1">${image.title}</h3>
                        <p class="text-sm text-gray-600 capitalize">📁 ${image.category}</p>
                        ${image.isUsed ? '<p class="text-xs text-emerald-600 font-semibold mt-1">✅ Completed</p>' : ''}
                    </div>
                </div>
            `;
            
            tile.addEventListener('click', () => this.selectImage(image.id));
            
            board.appendChild(tile);
        });
    },
    
    selectImage(imageId) {
        const image = this.imageData.find(img => img.id === imageId);
        if (!image || image.isUsed) return;
        
        this.currentQuestion = image;
        this.showImageModal(image);
    },
    
    // 🔧 FUNCIÓN MEJORADA - Mejor manejo de imágenes
    showImageModal(image) {
        const modal = document.getElementById('image-modal');
        const imageElement = document.getElementById('challenge-image');
        const imageOverlay = document.getElementById('image-overlay');
        const questionText = document.getElementById('image-question-text');
        const modalTitle = document.getElementById('image-modal-title');
        
        modalTitle.textContent = `🖼️ ${image.title} - Team ${this.currentTeam}`;
        questionText.textContent = image.question;
        
        // Reset modal state
        document.getElementById('image-question-content').classList.remove('hidden');
        document.getElementById('image-answer-content').classList.add('hidden');
        this.zoomLevel = 1;
        this.resetZoom();
        
        // 🔧 MEJOR MANEJO DE CARGA DE IMÁGENES
        imageOverlay.classList.remove('hidden');
        imageElement.classList.add('hidden');
        
        // Limpiar timeout previo
        if (this.imageLoadTimeout) {
            clearTimeout(this.imageLoadTimeout);
        }
        
        // Configurar eventos de carga
        imageElement.onload = () => {
            console.log('✅ Image loaded successfully:', image.imageUrl);
            imageOverlay.classList.add('hidden');
            imageElement.classList.remove('hidden');
            
            // Mostrar controles de zoom cuando la imagen carga
            const zoomControls = document.getElementById('zoom-controls');
            zoomControls.classList.remove('hidden');
        };
        
        imageElement.onerror = () => {
            console.error('❌ Error loading image:', image.imageUrl);
            imageOverlay.innerHTML = `
                <div class="text-gray-600 text-center">
                    <div class="text-6xl mb-4">⚠️</div>
                    <p class="text-xl">Image not available</p>
                    <p class="text-sm mt-2">Using fallback - continue with question</p>
                    <button class="btn btn-primary mt-4" onclick="document.getElementById('image-overlay').classList.add('hidden')">Continue Anyway</button>
                </div>
            `;
        };
        
        // Timeout para mostrar imagen alternativa
        this.imageLoadTimeout = setTimeout(() => {
            if (!imageElement.complete || imageElement.naturalHeight === 0) {
                console.warn('⏰ Image load timeout, showing fallback');
                imageOverlay.innerHTML = `
                    <div class="text-gray-600 text-center">
                        <div class="text-6xl mb-4">🖼️</div>
                        <p class="text-xl">${image.title}</p>
                        <p class="text-sm mt-2 text-gray-500">Category: ${image.category}</p>
                        <p class="text-xs mt-4 bg-yellow-100 text-yellow-800 p-2 rounded">Image preview not available, but you can still answer the question!</p>
                    </div>
                `;
            }
        }, 5000); // 5 segundos timeout
        
        // Intentar cargar la imagen
        imageElement.src = image.imageUrl;
        imageElement.alt = `${image.title} - ${image.category}`;
        
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },
    
    showImageAnswer() {
        if (!this.currentQuestion) return;
        
        const answerText = document.getElementById('image-answer-text');
        answerText.textContent = this.currentQuestion.answer;
        
        document.getElementById('image-question-content').classList.add('hidden');
        document.getElementById('image-answer-content').classList.remove('hidden');
    },
    
    answerImageQuestion(isCorrect) {
        if (!this.currentQuestion) return;
        
        const currentTeamIndex = this.currentTeam - 1;
        const points = isCorrect ? this.currentQuestion.points : 0;
        
        if (isCorrect) {
            this.teams[currentTeamIndex].score += points;
        }
        
        // Mark image as used
        this.currentQuestion.isUsed = true;
        
        // Show result
        this.showImageResult(isCorrect, points);
        
        // Update turn
        this.currentTeam = this.currentTeam === 1 ? 2 : 1;
        
        // Update UI
        this.updateUI();
        this.updateStats();
        this.createImageTiles();
        
        // Check game end
        setTimeout(() => {
            if (this.isGameComplete()) {
                this.endGame();
            }
        }, 2000);
    },
    
    showImageResult(isCorrect, points) {
        const modal = document.getElementById('image-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        
        const resultContent = `
            <div class="text-center">
                <div class="text-8xl mb-6">${isCorrect ? '🎉' : '😔'}</div>
                <h3 class="text-4xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}">
                    ${isCorrect ? 'Correct!' : 'Incorrect!'}
                </h3>
                <p class="text-2xl font-semibold mb-6 text-blue-600">
                    Team ${this.currentTeam}: ${isCorrect ? `+${points} points` : 'No points'}
                </p>
                <button id="continue-image-game" class="btn btn-primary btn-xl">
                    Continue Game
                </button>
            </div>
        `;
        
        const resultModal = this.createDynamicModal('Image Result', resultContent);
        
        const continueBtn = resultModal.querySelector('#continue-image-game');
        continueBtn.addEventListener('click', () => this.closeModal(resultModal));
    },
    
    // Zoom functionality
    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel * 1.2, 3);
        this.applyZoom();
    },
    
    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel / 1.2, 0.5);
        this.applyZoom();
    },
    
    resetZoom() {
        this.zoomLevel = 1;
        this.applyZoom();
    },
    
    applyZoom() {
        const image = document.getElementById('challenge-image');
        if (image) {
            image.style.transform = `scale(${this.zoomLevel})`;
            image.style.transformOrigin = 'center center';
            image.style.transition = 'transform 0.3s ease';
        }
    },
    
    // Gallery functionality
    showGallery() {
        const galleryGrid = document.getElementById('gallery-grid');
        galleryGrid.innerHTML = '';
        
        const usedImages = this.imageData.filter(img => img.isUsed);
        
        if (usedImages.length === 0) {
            galleryGrid.innerHTML = `
                <div class="col-span-full text-center py-8">
                    <div class="text-6xl mb-4">🖼️</div>
                    <p class="text-xl text-gray-600">No images revealed yet</p>
                    <p class="text-sm text-gray-500 mt-2">Start playing to see images in the gallery!</p>
                </div>
            `;
        } else {
            usedImages.forEach(image => {
                const galleryItem = document.createElement('div');
                galleryItem.className = 'gallery-item cursor-pointer';
                galleryItem.innerHTML = `
                    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <img src="${image.imageUrl}" alt="${image.title}" class="w-full h-32 object-cover" loading="lazy">
                        <div class="p-3">
                            <h4 class="font-bold text-sm">${image.title}</h4>
                            <p class="text-xs text-gray-600 capitalize">${image.category}</p>
                            <p class="text-xs text-green-600 mt-1">✅ Completed</p>
                        </div>
                    </div>
                `;
                
                galleryItem.addEventListener('click', () => {
                    this.closeGallery();
                    this.selectImage(image.id);
                });
                
                galleryGrid.appendChild(galleryItem);
            });
        }
        
        document.getElementById('gallery-modal').classList.remove('hidden');
    },
    
    closeGallery() {
        document.getElementById('gallery-modal').classList.add('hidden');
    },
    
    // Reveal all images (special mode)
    revealAllImages() {
        const confirmReveal = confirm('Are you sure you want to reveal all images? This will end the current game mode.');
        if (!confirmReveal) return;
        
        this.imageData.forEach(image => image.isUsed = true);
        this.createImageTiles();
        this.updateStats();
        
        setTimeout(() => {
            this.showGallery();
        }, 500);
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
    
    closeModal(modal) {
        if (modal && document.body.contains(modal)) {
            document.body.removeChild(modal);
        }
        document.body.style.overflow = '';
    },
    
    isGameComplete() {
        return this.imageData.every(image => image.isUsed);
    },
    
    endGame() {
        const winner = this.teams.reduce((a, b) => a.score > b.score ? a : b);
        const isTie = this.teams[0].score === this.teams[1].score;
        
        const endContent = `
            <div class="text-center">
                <div class="text-8xl mb-6">🏆</div>
                <h3 class="text-3xl font-bold mb-6">Game Finished!</h3>
                
                <div class="space-y-3 mb-6">
                    ${this.teams.map(team => `
                        <div class="flex justify-between items-center p-4 rounded-lg ${team.id === winner.id && !isTie ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100'}">
                            <span class="font-semibold text-lg">${team.name}</span>
                            <span class="font-bold text-xl">${team.score} points</span>
                        </div>
                    `).join('')}
                </div>
                
                <p class="text-2xl font-bold ${isTie ? 'text-blue-600' : 'text-green-600'} mb-6">
                    ${isTie ? '🤝 It\'s a tie!' : `🎉 Winner: ${winner.name}!`}
                </p>
                
                <div class="flex justify-center space-x-4 flex-wrap gap-2">
                    <button id="play-again-image" class="btn btn-success btn-lg">
                        🔄 Play Again
                    </button>
                    <button id="view-gallery-final" class="btn btn-info btn-lg">
                        🖼️ View Gallery
                    </button>
                    <button id="back-setup-image" class="btn btn-secondary btn-lg">
                        🏠 Back to Setup
                    </button>
                </div>
            </div>
        `;
        
        const endModal = this.createDynamicModal('🖼️ Visual Discovery Results', endContent);
        
        const playAgainBtn = endModal.querySelector('#play-again-image');
        const viewGalleryBtn = endModal.querySelector('#view-gallery-final');
        const backSetupBtn = endModal.querySelector('#back-setup-image');
        
        playAgainBtn.addEventListener('click', () => {
            this.restartGame();
            this.closeModal(endModal);
        });
        
        viewGalleryBtn.addEventListener('click', () => {
            this.closeModal(endModal);
            this.showGallery();
        });
        
        backSetupBtn.addEventListener('click', () => {
            window.location.href = 'game-main.html';
        });
    },
    
    restartGame() {
        this.imageData.forEach(image => image.isUsed = false);
        this.teams.forEach(team => team.score = 0);
        this.currentTeam = 1;
        this.currentQuestion = null;
        this.zoomLevel = 1;
        this.hintModeActive = false;
        
        // Limpiar timeout si existe
        if (this.imageLoadTimeout) {
            clearTimeout(this.imageLoadTimeout);
            this.imageLoadTimeout = null;
        }
        
        this.updateUI();
        this.updateStats();
        this.createImageTiles();
        
        console.log('🔄 Image game restarted');
    },
    
    updateStats() {
        const revealed = this.imageData.filter(img => img.isUsed).length;
        const left = this.imageData.length - revealed;
        
        const revealedEl = document.getElementById('images-revealed');
        const leftEl = document.getElementById('questions-left');
        
        if (revealedEl) revealedEl.textContent = revealed;
        if (leftEl) leftEl.textContent = left;
    },
    
    updateUI() {
        // Update scores
        const team1Name = document.getElementById('team1-name');
        const team2Name = document.getElementById('team2-name');
        const team1Score = document.getElementById('team1-score');
        const team2Score = document.getElementById('team2-score');
        
        if (team1Name) team1Name.textContent = this.teams[0].name;
        if (team2Name) team2Name.textContent = this.teams[1].name;
        if (team1Score) team1Score.textContent = `${this.teams[0].score} points`;
        if (team2Score) team2Score.textContent = `${this.teams[1].score} points`;
        
        // Update current team
        const currentTeamElement = document.getElementById('current-team');
        if (currentTeamElement) {
            currentTeamElement.textContent = this.teams[this.currentTeam - 1].name;
            currentTeamElement.className = `font-bold ${this.currentTeam === 1 ? 'text-blue-600' : 'text-teal-600'}`;
        }
        
        // Update team containers
        const team1Container = document.getElementById('team1-container');
        const team2Container = document.getElementById('team2-container');
        
        if (team1Container && team2Container) {
            team1Container.classList.toggle('ring-4', this.currentTeam === 1);
            team1Container.classList.toggle('ring-emerald-400', this.currentTeam === 1);
            team2Container.classList.toggle('ring-4', this.currentTeam === 2);
            team2Container.classList.toggle('ring-cyan-400', this.currentTeam === 2);
        }
    },
    
    bindEvents() {
        // Show answer button
        const showAnswerBtn = document.getElementById('show-image-answer-btn');
        if (showAnswerBtn) {
            showAnswerBtn.addEventListener('click', () => {
                this.showImageAnswer();
            });
        }
        
        // Answer buttons
        const correctBtn = document.getElementById('image-correct-btn');
        const incorrectBtn = document.getElementById('image-incorrect-btn');
        
        if (correctBtn) {
            correctBtn.addEventListener('click', () => {
                this.answerImageQuestion(true);
            });
        }
        
        if (incorrectBtn) {
            incorrectBtn.addEventListener('click', () => {
                this.answerImageQuestion(false);
            });
        }
        
        // Zoom controls
        const zoomInBtn = document.getElementById('zoom-in');
        const zoomOutBtn = document.getElementById('zoom-out');
        const zoomResetBtn = document.getElementById('zoom-reset');
        
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
        if (zoomResetBtn) zoomResetBtn.addEventListener('click', () => this.resetZoom());
        
        // Close image modal
        const imageModal = document.getElementById('image-modal');
        if (imageModal) {
            const closeImageModal = () => {
                imageModal.classList.add('hidden');
                document.body.style.overflow = '';
                this.resetZoom();
                
                // Limpiar timeout de carga
                if (this.imageLoadTimeout) {
                    clearTimeout(this.imageLoadTimeout);
                    this.imageLoadTimeout = null;
                }
            };
            
            const modalClose = imageModal.querySelector('.modal-close');
            if (modalClose) {
                modalClose.addEventListener('click', closeImageModal);
            }
            
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal) closeImageModal();
            });
        }
        
        // Gallery
        const galleryBtn = document.getElementById('gallery-view');
        if (galleryBtn) {
            galleryBtn.addEventListener('click', () => this.showGallery());
        }
        
        const galleryModal = document.getElementById('gallery-modal');
        if (galleryModal) {
            const closeGalleryModal = () => this.closeGallery();
            
            const galleryClose = galleryModal.querySelector('.modal-close');
            const galleryCloseBtn = galleryModal.querySelector('.close-modal-btn');
            
            if (galleryClose) galleryClose.addEventListener('click', closeGalleryModal);
            if (galleryCloseBtn) galleryCloseBtn.addEventListener('click', closeGalleryModal);
            
            galleryModal.addEventListener('click', (e) => {
                if (e.target === galleryModal) closeGalleryModal();
            });
        }
        
        // Restart button
        const restartBtn = document.getElementById('restart-button');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => {
                if (confirm('Are you sure you want to restart the game?')) {
                    this.restartGame();
                }
            });
        }
        
        // Reveal all button
        const revealAllBtn = document.getElementById('reveal-all-btn');
        if (revealAllBtn) {
            revealAllBtn.addEventListener('click', () => {
                this.revealAllImages();
            });
        }
        
        // Instructions
        const instructionsBtn = document.getElementById('instructions-btn');
        if (instructionsBtn) {
            instructionsBtn.addEventListener('click', () => {
                document.getElementById('instructions-modal').classList.remove('hidden');
            });
        }
        
        // Close instructions modal
        const instructionsModal = document.getElementById('instructions-modal');
        if (instructionsModal) {
            const closeInstructionsModal = () => {
                instructionsModal.classList.add('hidden');
            };
            
            const instrClose = instructionsModal.querySelector('.modal-close');
            const instrCloseBtn = instructionsModal.querySelector('.close-modal-btn');
            
            if (instrClose) instrClose.addEventListener('click', closeInstructionsModal);
            if (instrCloseBtn) instrCloseBtn.addEventListener('click', closeInstructionsModal);
            
            instructionsModal.addEventListener('click', (e) => {
                if (e.target === instructionsModal) closeInstructionsModal();
            });
        }
        
        // Hint mode toggle
        const hintModeBtn = document.getElementById('hint-mode');
        if (hintModeBtn) {
            hintModeBtn.addEventListener('click', (e) => {
                this.hintModeActive = !this.hintModeActive;
                const btn = e.target;
                btn.textContent = this.hintModeActive ? '💡 Hint: ON' : '💡 Hint Mode';
                btn.classList.toggle('bg-yellow-400', this.hintModeActive);
                btn.classList.toggle('text-black', this.hintModeActive);
                btn.classList.toggle('bg-white/20', !this.hintModeActive);
                btn.classList.toggle('text-white', !this.hintModeActive);
            });
        }
        
        // Fullscreen toggle
        const fullscreenBtn = document.getElementById('fullscreen-toggle');
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.log('Fullscreen not supported or denied');
                    });
                } else {
                    document.exitFullscreen();
                }
            });
        }
        
        // Zoom toggle
        const zoomToggleBtn = document.getElementById('zoom-toggle');
        if (zoomToggleBtn) {
            zoomToggleBtn.addEventListener('click', (e) => {
                const btn = e.target;
                const zoomControls = document.getElementById('zoom-controls');
                
                if (zoomControls && zoomControls.classList.contains('hidden')) {
                    zoomControls.classList.remove('hidden');
                    btn.textContent = '🔍 ON';
                } else if (zoomControls) {
                    zoomControls.classList.add('hidden');
                    btn.textContent = '🔍';
                    this.resetZoom();
                }
            });
        }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    ImageGameController.init();
});

// Global functions for external access
window.ImageGameController = ImageGameController;

// 🔧 Fix para modales (consistente con otros archivos)
function closeAnyModal() {
    console.log('🔧 Cerrando modal...');
    
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(modal => {
        if (!modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            console.log('✅ Modal cerrado:', modal.id);
            
            if (modal.id.includes('dynamic') || modal.classList.contains('dynamic-modal')) {
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                        console.log('🗑️ Modal dinámico eliminado del DOM');
                    }
                }, 300);
            }
        }
    });
    
    document.body.style.overflow = '';
    
    // Limpiar timeouts de imágenes
    if (window.ImageGameController && window.ImageGameController.imageLoadTimeout) {
        clearTimeout(window.ImageGameController.imageLoadTimeout);
        window.ImageGameController.imageLoadTimeout = null;
    }
}

document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-backdrop')) {
        console.log('🖱️ Clic en backdrop detectado');
        closeAnyModal();
        return;
    }
    
    const isCloseButton = 
        e.target.textContent.includes('Close') ||
        e.target.textContent.includes('Cerrar') ||
        e.target.textContent.includes('×') ||
        e.target.classList.contains('close-modal-btn') ||
        e.target.classList.contains('modal-close') ||
        e.target.id.includes('close');
    
    if (isCloseButton) {
        console.log('🖱️ Botón de cerrar detectado');
        e.preventDefault();
        e.stopPropagation();
        closeAnyModal();
    }
});

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        console.log('⌨️ ESC presionado');
        closeAnyModal();
    }
});

window.closeModal = closeAnyModal;

console.log('🚀 Image Game Board cargado exitosamente - VERSIÓN COMPLETA');
console.log('🖼️ Mejoras implementadas:');
console.log('   ✅ URLs de imagen más estables (Unsplash)');
console.log('   ✅ Mejor manejo de errores de carga');
console.log('   ✅ Timeout para imágenes lentas (5s)');
console.log('   ✅ Fallback cuando imagen no carga');
console.log('   ✅ Controles de zoom solo cuando imagen está lista');
console.log('   ✅ Loading states más claros');
console.log('   ✅ Sistema de modales robusto');
console.log('   ✅ Gestión completa de eventos');