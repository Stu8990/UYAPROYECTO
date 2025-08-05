// Video Game Controller
const VideoGameController = {
    currentQuestion: null,
    videoData: [
        {
            id: 1,
            title: "Video 1",
            videoUrl: "https://youtu.be/7V8oFI4GYMY",
            question: "What is the main topic discussed in this video?",
            answer: "The main topic is sustainable development and environmental protection.",
            points: 15,
            isUsed: false
        },
        {
            id: 2,
            title: "Video 2", 
            videoUrl: "https://youtu.be/DHAI_gR0HgA",
            question: "Which technique was demonstrated in the video?",
            answer: "The video demonstrates active listening techniques for better communication.",
            points: 15,
            isUsed: false
        },
        {
            id: 3,
            title: "Video 3",
            videoUrl: "https://youtu.be/19bsbbyklOc",
            question: "What was the conclusion of the experiment shown?",
            answer: "The experiment concluded that collaborative learning improves retention by 40%.",
            points: 15,
            isUsed: false
        },
        {
            id: 4,
            title: "Video 4",
            videoUrl: "https://youtu.be/iONDebHX9qk",
            question: "What problem was solved in the video?",
            answer: "The video solved the problem of effective time management in academic settings.",
            points: 15,
            isUsed: false
        },
        {
            id: 5,
            title: "Video 5",
            videoUrl: "https://youtu.be/75GFzikmRY0",
            question: "What new concept was introduced?",
            answer: "The concept of growth mindset was introduced as a learning strategy.",
            points: 15,
            isUsed: false
        },
        {
            id: 6,
            title: "Video 6",
            videoUrl: "https://youtu.be/fV-F8FVH868",
            question: "What was the key takeaway from the presentation?",
            answer: "The key takeaway is that practice and feedback are essential for skill development.",
            points: 15,
            isUsed: false
        }
    ],
    teams: [
        { id: 1, name: "Team 1", score: 0 },
        { id: 2, name: "Team 2", score: 0 }
    ],
    currentTeam: 1,
    gameState: "playing",
    init() {
        this.createVideoTiles();
        this.bindEvents();
        this.updateUI();
        console.log("🎬 Video Game Controller initialized");
    },
    createVideoTiles() {
        const board = document.getElementById('video-game-board');
        if (!board) return;
        board.innerHTML = '';
        this.videoData.forEach((video, index) => {
            const tile = document.createElement('div');
            tile.className = `video-tile cursor-pointer transition-all duration-300 transform hover:scale-105 ${video.isUsed ? 'opacity-50 pointer-events-none' : ''}`;
            tile.dataset.videoId = video.id;
            tile.innerHTML = `
                <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl min-h-[200px] flex flex-col items-center justify-center">
                    <div class="text-6xl mb-4">🎬</div>
                    <h3 class="font-bold text-xl mb-2">${video.title}</h3>
                    <p class="text-sm opacity-90 text-center">Click to watch video</p>
                    <div class="mt-4 bg-white/20 px-3 py-1 rounded-full">
                        <span class="text-sm font-bold">${video.points} pts</span>
                    </div>
                    ${video.isUsed ? '<div class="absolute inset-0 bg-black bg-opacity-50 rounded-xl flex items-center justify-center"><span class="text-white font-bold">COMPLETED</span></div>' : ''}
                </div>
            `;
            if (!video.isUsed) {
                tile.addEventListener('click', () => this.selectVideo(video.id));
            }
            board.appendChild(tile);
        });
    },
    selectVideo(videoId) {
        const video = this.videoData.find(v => v.id === videoId);
        if (!video || video.isUsed) return;
        this.currentQuestion = video;
        this.showVideoModal(video);
    },
    showVideoModal(video) {
        const modal = document.getElementById('video-modal');
        const videoElement = document.getElementById('challenge-video');
        const videoOverlay = document.getElementById('video-overlay');
        const questionText = document.getElementById('video-question-text');
        const modalTitle = document.getElementById('video-modal-title');
        modalTitle.textContent = `🎬 ${video.title} - Team ${this.currentTeam}`;
        questionText.textContent = video.question;
        document.getElementById('video-question-content').classList.remove('hidden');
        document.getElementById('video-answer-content').classList.add('hidden');

        // YouTube support
        let iframe = document.getElementById('youtube-iframe');
        if (iframe) iframe.remove();

        if (video.videoUrl && video.videoUrl.trim() !== '') {
            if (video.videoUrl.includes('youtube.com') || video.videoUrl.includes('youtu.be')) {
                // Extract video ID
                let videoId = '';
                if (video.videoUrl.includes('youtu.be/')) {
                    videoId = video.videoUrl.split('youtu.be/')[1].split(/[?&]/)[0];
                } else {
                    const match = video.videoUrl.match(/v=([^&]+)/);
                    videoId = match ? match[1] : '';
                }
                // Create iframe
                iframe = document.createElement('iframe');
                iframe.id = 'youtube-iframe';
                iframe.width = '100%';
                iframe.height = '100%';
                iframe.style.minHeight = '300px';
                iframe.src = `https://www.youtube.com/embed/${videoId}`;
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                videoElement.classList.add('hidden');
                videoOverlay.classList.add('hidden');
                document.getElementById('video-container').appendChild(iframe);
            } else {
                videoElement.src = video.videoUrl;
                videoElement.classList.remove('hidden');
                videoOverlay.classList.add('hidden');
            }
        } else {
            videoElement.classList.add('hidden');
            videoOverlay.classList.remove('hidden');
        }
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    },
    showVideoAnswer() {
        if (!this.currentQuestion) return;
        const answerText = document.getElementById('video-answer-text');
        answerText.textContent = this.currentQuestion.answer;
        document.getElementById('video-question-content').classList.add('hidden');
        document.getElementById('video-answer-content').classList.remove('hidden');
    },
    answerVideoQuestion(isCorrect) {
        if (!this.currentQuestion) return;
        const currentTeamIndex = this.currentTeam - 1;
        const points = isCorrect ? this.currentQuestion.points : 0;
        if (isCorrect) {
            this.teams[currentTeamIndex].score += points;
        }
        this.currentQuestion.isUsed = true;
        this.showVideoResult(isCorrect, points);
        this.currentTeam = this.currentTeam === 1 ? 2 : 1;
        this.updateUI();
        this.createVideoTiles();
        setTimeout(() => {
            if (this.isGameComplete()) {
                this.endGame();
            }
        }, 2000);
    },
    showVideoResult(isCorrect, points) {
        const modal = document.getElementById('video-modal');
        modal.classList.add('hidden');
        document.body.style.overflow = '';
        const resultContent = `
            <div class="text-center">
                <div class="text-8xl mb-6">${isCorrect ? '🎉' : '😔'}</div>
                <h3 class="text-4xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}">
                    ${isCorrect ? 'Correct!' : 'Incorrect!'}
                </h3>
                <p class="text-2xl font-semibold mb-6 text-purple-600">
                    Team ${this.currentTeam}: ${isCorrect ? `+${points} points` : 'No points'}
                </p>
                <button id="continue-video-game" class="btn btn-primary btn-xl">
                    Continue Game
                </button>
            </div>
        `;
        const resultModal = this.createDynamicModal('Video Result', resultContent);
        const continueBtn = resultModal.querySelector('#continue-video-game');
        continueBtn.addEventListener('click', () => this.closeModal(resultModal));
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
        return this.videoData.every(video => video.isUsed);
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
                <div class="flex justify-center space-x-4">
                    <button id="play-again-video" class="btn btn-success btn-lg">
                        🔄 Play Again
                    </button>
                    <button id="back-setup-video" class="btn btn-secondary btn-lg">
                        🏠 Back to Setup
                    </button>
                </div>
            </div>
        `;
        const endModal = this.createDynamicModal('🎬 Video Game Results', endContent);
        const playAgainBtn = endModal.querySelector('#play-again-video');
        const backSetupBtn = endModal.querySelector('#back-setup-video');
        playAgainBtn.addEventListener('click', () => {
            this.restartGame();
            this.closeModal(endModal);
        });
        backSetupBtn.addEventListener('click', () => {
            window.location.href = 'game-main.html';
        });
    },
    restartGame() {
        this.videoData.forEach(video => video.isUsed = false);
        this.teams.forEach(team => team.score = 0);
        this.currentTeam = 1;
        this.currentQuestion = null;
        this.updateUI();
        this.createVideoTiles();
    },
    updateUI() {
        document.getElementById('team1-name').textContent = this.teams[0].name;
        document.getElementById('team2-name').textContent = this.teams[1].name;
        document.getElementById('team1-score').textContent = `${this.teams[0].score} points`;
        document.getElementById('team2-score').textContent = `${this.teams[1].score} points`;
        const currentTeamElement = document.getElementById('current-team');
        if (currentTeamElement) {
            currentTeamElement.textContent = this.teams[this.currentTeam - 1].name;
            currentTeamElement.className = `font-bold ${this.currentTeam === 1 ? 'text-pink-600' : 'text-blue-600'}`;
        }
        const team1Container = document.getElementById('team1-container');
        const team2Container = document.getElementById('team2-container');
        if (team1Container && team2Container) {
            team1Container.classList.toggle('ring-4', this.currentTeam === 1);
            team1Container.classList.toggle('ring-pink-400', this.currentTeam === 1);
            team2Container.classList.toggle('ring-4', this.currentTeam === 2);
            team2Container.classList.toggle('ring-blue-400', this.currentTeam === 2);
        }
    },
    bindEvents() {
        document.getElementById('show-video-answer-btn').addEventListener('click', () => {
            this.showVideoAnswer();
        });
        document.getElementById('video-correct-btn').addEventListener('click', () => {
            this.answerVideoQuestion(true);
        });
        document.getElementById('video-incorrect-btn').addEventListener('click', () => {
            this.answerVideoQuestion(false);
        });
        const videoModal = document.getElementById('video-modal');
        const closeVideoModal = () => {
            videoModal.classList.add('hidden');
            document.body.style.overflow = '';
            const video = document.getElementById('challenge-video');
            video.pause();
        };
        videoModal.querySelector('.modal-close').addEventListener('click', closeVideoModal);
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) closeVideoModal();
        });
        document.getElementById('restart-button').addEventListener('click', () => {
            this.restartGame();
        });
        document.getElementById('instructions-btn').addEventListener('click', () => {
            document.getElementById('instructions-modal').classList.remove('hidden');
        });
        const instructionsModal = document.getElementById('instructions-modal');
        const closeInstructionsModal = () => {
            instructionsModal.classList.add('hidden');
        };
        instructionsModal.querySelector('.modal-close').addEventListener('click', closeInstructionsModal);
        instructionsModal.querySelector('.close-modal-btn').addEventListener('click', closeInstructionsModal);
        instructionsModal.addEventListener('click', (e) => {
            if (e.target === instructionsModal) closeInstructionsModal();
        });
        document.getElementById('sound-toggle').addEventListener('click', (e) => {
            const btn = e.target;
            const video = document.getElementById('challenge-video');
            video.muted = !video.muted;
            btn.textContent = video.muted ? '🔇' : '🔊';
        });
        document.getElementById('pause-all-videos').addEventListener('click', () => {
            const video = document.getElementById('challenge-video');
            video.pause();
        });
        document.getElementById('fullscreen-toggle').addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
        });
    }
};
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    VideoGameController.init();
});
// Global functions for external access
window.VideoGameController = VideoGameController;
// Fix para modales (igual que en game-board)
function closeAnyModal() {
    const modals = document.querySelectorAll('.modal-backdrop');
    modals.forEach(modal => {
        if (!modal.classList.contains('hidden')) {
            modal.classList.add('hidden');
            if (modal.id.includes('dynamic') || modal.classList.contains('dynamic')) {
                setTimeout(() => {
                    if (document.body.contains(modal)) {
                        document.body.removeChild(modal);
                    }
                }, 300);
            }
        }
    });
    document.body.style.overflow = '';
}
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal-backdrop')) {
        closeAnyModal();
        return;
    }
    const isCloseButton = 
        e.target.textContent.includes('Close') ||
        e.target.textContent.includes('×') ||
        e.target.classList.contains('close-modal-btn') ||
        e.target.classList.contains('modal-close');
    if (isCloseButton) {
        e.preventDefault();
        e.stopPropagation();
        closeAnyModal();
    }
});
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeAnyModal();
    }
});