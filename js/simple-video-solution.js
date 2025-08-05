/* ============================================
   SOLUCIÓN SIMPLE Y DIRECTA PARA VIDEOS
   ============================================ */

// Configuración de tus videos específicos
const videoData = [
    {
        id: 1,
        title: "Video 1",
        videoUrl: "https://youtu.be/7V8oFI4GYMY",
        videoId: "7V8oFI4GYMY",
        question: "What is the main topic discussed in this video?",
        answer: "The main topic is sustainable development and environmental protection.",
        points: 15,
        isUsed: false
    },
    {
        id: 2,
        title: "Video 2", 
        videoUrl: "https://youtu.be/DHAI_gR0HgA",
        videoId: "DHAI_gR0HgA",
        question: "Which technique was demonstrated in the video?",
        answer: "The video demonstrates active listening techniques for better communication.",
        points: 15,
        isUsed: false
    },
    {
        id: 3,
        title: "Video 3",
        videoUrl: "https://youtu.be/19bsbbyklOc", 
        videoId: "19bsbbyklOc",
        question: "What was the conclusion of the experiment shown?",
        answer: "The experiment concluded that collaborative learning improves retention by 40%.",
        points: 15,
        isUsed: false
    },
    {
        id: 4,
        title: "Video 4",
        videoUrl: "https://youtu.be/iONDebHX9qk",
        videoId: "iONDebHX9qk", 
        question: "What problem was solved in the video?",
        answer: "The video solved the problem of effective time management in academic settings.",
        points: 15,
        isUsed: false
    },
    {
        id: 5,
        title: "Video 5",
        videoUrl: "https://youtu.be/75GFzikmRY0",
        videoId: "75GFzikmRY0",
        question: "What new concept was introduced?",
        answer: "The concept of growth mindset was introduced as a learning strategy.",
        points: 15,
        isUsed: false
    },
    {
        id: 6,
        title: "Video 6",
        videoUrl: "https://youtu.be/fV-F8FVH868",
        videoId: "fV-F8FVH868",
        question: "What was the key takeaway from the presentation?",
        answer: "The key takeaway is that practice and feedback are essential for skill development.",
        points: 15,
        isUsed: false
    }
];

// Controlador simplificado de video
const SimpleVideoController = {
    currentTeam: 1,
    teams: [
        { id: 1, name: 'Team 1', score: 0 },
        { id: 2, name: 'Team 2', score: 0 }
    ],
    currentVideo: null,

    // Inicializar el juego
    init() {
        console.log('🎬 Inicializando Simple Video Controller');
        this.createVideoGrid();
        this.setupEventListeners();
    },

    // Crear la grilla de videos
    createVideoGrid() {
        const board = document.getElementById('video-game-board');
        if (!board) {
            console.error('❌ No se encontró video-game-board');
            return;
        }

        board.innerHTML = '';

        videoData.forEach(video => {
            const tile = document.createElement('div');
            tile.className = `video-tile cursor-pointer ${video.isUsed ? 'opacity-50 pointer-events-none' : ''}`;
            tile.dataset.videoId = video.id;
            
            tile.innerHTML = `
                <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl min-h-[200px] flex flex-col items-center justify-center transition-all hover:scale-105">
                    <div class="text-6xl mb-4">🎬</div>
                    <h3 class="font-bold text-xl mb-2 text-center">${video.title}</h3>
                    <p class="text-sm opacity-90 text-center mb-3">Click to watch video</p>
                    <div class="bg-white/20 px-3 py-1 rounded-full">
                        <span class="text-sm font-bold">${video.points} pts</span>
                    </div>
                    ${video.isUsed ? '<div class="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center"><span class="text-white font-bold text-xl">COMPLETED</span></div>' : ''}
                </div>
            `;

            if (!video.isUsed) {
                tile.addEventListener('click', () => this.openVideoModal(video));
            }

            board.appendChild(tile);
        });

        console.log('✅ Grilla de videos creada');
    },

    // Abrir modal con video
    openVideoModal(video) {
        console.log('🎬 Abriendo modal para:', video.title);
        this.currentVideo = video;

        // Actualizar elementos del modal
        const modal = document.getElementById('video-modal');
        const modalTitle = document.getElementById('video-modal-title');
        const questionText = document.getElementById('video-question-text');
        const container = document.getElementById('video-container');

        if (!modal || !container) {
            console.error('❌ Elementos del modal no encontrados');
            return;
        }

        // Configurar título y pregunta
        if (modalTitle) {
            modalTitle.textContent = `🎬 ${video.title} - Team ${this.currentTeam}`;
        }
        if (questionText) {
            questionText.textContent = video.question;
        }

        // Limpiar container anterior
        container.innerHTML = '';

        // Crear iframe directamente (método más simple)
        const iframe = document.createElement('iframe');
        iframe.id = 'youtube-iframe';
        iframe.width = '100%';
        iframe.height = '100%';
        iframe.style.minHeight = '315px';
        iframe.style.border = 'none';
        iframe.style.borderRadius = '8px';
        
        // URL de embed simplificada
        iframe.src = `https://www.youtube-nocookie.com/embed/${video.videoId}`;
        iframe.frameBorder = '0';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
        iframe.allowFullscreen = true;

        container.appendChild(iframe);

        // Mostrar sección de pregunta
        const questionContent = document.getElementById('video-question-content');
        const answerContent = document.getElementById('video-answer-content'); 
        
        if (questionContent) questionContent.classList.remove('hidden');
        if (answerContent) answerContent.classList.add('hidden');

        // Mostrar modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';

        console.log('✅ Modal abierto exitosamente');
    },

    // Mostrar respuesta
    showAnswer() {
        if (!this.currentVideo) return;

        const answerText = document.getElementById('video-answer-text');
        const questionContent = document.getElementById('video-question-content');
        const answerContent = document.getElementById('video-answer-content');

        if (answerText) {
            answerText.textContent = this.currentVideo.answer;
        }
        
        if (questionContent) questionContent.classList.add('hidden');
        if (answerContent) answerContent.classList.remove('hidden');
    },

    // Responder pregunta
    answerQuestion(isCorrect) {
        if (!this.currentVideo) return;

        const points = isCorrect ? this.currentVideo.points : 0;
        
        // Actualizar puntuación
        if (isCorrect) {
            this.teams[this.currentTeam - 1].score += points;
        }

        // Marcar video como usado
        this.currentVideo.isUsed = true;
        const videoIndex = videoData.findIndex(v => v.id === this.currentVideo.id);
        if (videoIndex !== -1) {
            videoData[videoIndex].isUsed = true;
        }

        // Mostrar resultado
        this.showResult(isCorrect, points);

        // Cambiar turno
        this.currentTeam = this.currentTeam === 1 ? 2 : 1;

        // Actualizar UI
        this.updateUI();
    },

    // Mostrar resultado
    showResult(isCorrect, points) {
        // Cerrar modal
        this.closeModal();

        // Crear modal de resultado
        const resultModal = document.createElement('div');
        resultModal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        resultModal.innerHTML = `
            <div class="bg-white p-8 rounded-xl max-w-md mx-4 text-center">
                <div class="text-8xl mb-4">${isCorrect ? '🎉' : '😔'}</div>
                <h3 class="text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}">
                    ${isCorrect ? '¡Correcto!' : '¡Incorrecto!'}
                </h3>
                <p class="text-xl mb-6">
                    Team ${this.currentTeam}: ${isCorrect ? `+${points}` : '+0'} puntos
                </p>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
                    Continuar
                </button>
            </div>
        `;

        document.body.appendChild(resultModal);

        // Auto-remover después de 3 segundos
        setTimeout(() => {
            if (resultModal.parentElement) {
                resultModal.remove();
            }
        }, 3000);
    },

    // Cerrar modal
    closeModal() {
        const modal = document.getElementById('video-modal');
        if (modal) {
            modal.classList.add('hidden');
        }
        document.body.style.overflow = '';

        // Limpiar iframe
        const iframe = document.getElementById('youtube-iframe');
        if (iframe) {
            iframe.remove();
        }

        this.currentVideo = null;
    },

    // Actualizar UI
    updateUI() {
        // Actualizar equipo actual
        const currentTeamElement = document.getElementById('current-team');
        if (currentTeamElement) {
            currentTeamElement.textContent = `Team ${this.currentTeam}`;
        }

        // Recrear grilla
        this.createVideoGrid();

        // Actualizar marcador si existe
        this.updateScoreboard();
    },

    // Actualizar marcador
    updateScoreboard() {
        // Crear o actualizar marcador
        let scoreboard = document.getElementById('scoreboard');
        if (!scoreboard) {
            scoreboard = document.createElement('div');
            scoreboard.id = 'scoreboard';
            scoreboard.className = 'text-center mb-6 bg-white p-4 rounded-lg shadow-lg';
            
            const container = document.querySelector('.container');
            if (container && container.firstChild) {
                container.insertBefore(scoreboard, container.firstChild.nextSibling);
            }
        }

        scoreboard.innerHTML = `
            <h3 class="text-xl font-bold mb-3">📊 Marcador</h3>
            <div class="flex justify-center space-x-8">
                <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600">${this.teams[0].score}</div>
                    <div class="text-sm text-gray-600">${this.teams[0].name}</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">${this.teams[1].score}</div>
                    <div class="text-sm text-gray-600">${this.teams[1].name}</div>
                </div>
            </div>
        `;
    },

    // Configurar event listeners
    setupEventListeners() {
        // Botón de mostrar respuesta
        const showAnswerBtn = document.getElementById('show-video-answer-btn');
        if (showAnswerBtn) {
            showAnswerBtn.addEventListener('click', () => this.showAnswer());
        }

        // Botones de respuesta correcta/incorrecta
        const correctBtn = document.getElementById('video-correct-btn');
        const incorrectBtn = document.getElementById('video-incorrect-btn');

        if (correctBtn) {
            correctBtn.addEventListener('click', () => this.answerQuestion(true));
        }
        if (incorrectBtn) {
            incorrectBtn.addEventListener('click', () => this.answerQuestion(false));
        }

        // Cerrar modal
        const closeBtn = document.querySelector('#video-modal .modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // Reiniciar juego
        const restartBtn = document.getElementById('restart-button');
        if (restartBtn) {
            restartBtn.addEventListener('click', () => this.restart());
        }

        console.log('✅ Event listeners configurados');
    },

    // Reiniciar juego
    restart() {
        videoData.forEach(video => video.isUsed = false);
        this.teams.forEach(team => team.score = 0);
        this.currentTeam = 1;
        this.updateUI();
        console.log('🔄 Juego reiniciado');
    }
};

// Auto-inicializar
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        SimpleVideoController.init();
    }, 500);
});

// Exportar para uso global
window.SimpleVideoController = SimpleVideoController;

console.log('🎬 Simple Video Solution cargada - Lista para usar!');