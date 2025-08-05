/* ============================================
   GAME.JS - VERSIÓN CORREGIDA Y COMPLETA
   ============================================ */

/* ============================================
   DATOS DEL JUEGO
   ============================================ */

const GameData = {
  questions: [
    {
      id: 1,
      question: "I didn't even bother ______ (ask).",
      answer: "I didn't even bother TO ASK / ASKING.",
      points: 15
    },
    {
      id: 2,
      question: "I hate ______ (do) the dishes!",
      answer: "I hate TO DO / DOING the dishes!",
      points: 15
    },
    {
      id: 3,
      question: "I prefer ______ (work) in teams.",
      answer: "I prefer TO WORK / WORKING in teams.",
      points: 15
    },
    {
      id: 4,
      question: "We can't continue ______ (ignore) the Earth's issues.",
      answer: "We can't continue TO IGNORE / IGNORING the Earth's issues.",
      points: 15
    },
    {
      id: 5,
      question: "Chris likes ______ (go out).",
      answer: "Chris likes TO GO OUT / GOING OUT.",
      points: 15
    },
    {
      id: 6,
      question: "You need to start ______ (study) harder.",
      answer: "You need to start TO STUDY / STUDYING harder.",
      points: 15
    },
    {
      id: 7,
      question: "I can't bear ______ (see) homeless people or animals.",
      answer: "I can't bear TO SEE / SEEING homeless people or animals.",
      points: 15
    },
    {
      id: 8,
      question: "They decided ______ (postpone) the meeting.",
      answer: "They decided TO POSTPONE the meeting.",
      points: 15
    },
    {
      id: 9,
      question: "She enjoys ______ (read) mystery novels.",
      answer: "She enjoys READING mystery novels.",
      points: 15
    },
    {
      id: 10,
      question: "We hope ______ (visit) Paris next year.",
      answer: "We hope TO VISIT Paris next year.",
      points: 15
    }
  ],

  gameConfig: {
    title: "The Verb Journey",
    gameCode: "1054334",
    instruction: "Say the two possible forms.",
    totalQuestions: 10,
    defaultPoints: 15
  },

  teams: [
    { id: 1, name: "Team 1", score: 0, color: "bg-bam-pink" },
    { id: 2, name: "Team 2", score: 0, color: "bg-bam-blue" }
  ],

  currentTeam: 1,
  gameState: "waiting", // waiting, playing, ended
  answeredQuestions: [],
  currentQuestion: null,
  gameMode: "baamboozle" // baamboozle, spud, bowling, etc.
};

/* ============================================
   SISTEMA DE MODALES ROBUSTO
   ============================================ */

const RobustModalSystem = {
  currentModal: null,
  
  init() {
    this.bindGlobalEvents();
  },

  bindGlobalEvents() {
    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
      }
    });

    // Cerrar clickeando fuera
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        this.closeModal();
      }
    });
  },

  createModal(title, content, options = {}) {
    // Cerrar modal existente
    this.closeModal();
    
    const modalId = options.id || `modal-${Date.now()}`;
    
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50';
    modal.id = modalId;
    
    modal.innerHTML = `
      <div class="modal bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 m-4 relative">
        ${title ? `
        <div class="modal-header flex justify-between items-center mb-4">
          <h2 class="modal-title text-xl font-bold">${title}</h2>
          <button class="close-modal-btn text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
        </div>
        ` : ''}
        <div class="modal-body">
          ${content}
        </div>
      </div>
    `;
    
    // Añadir eventos de cierre
    const closeBtn = modal.querySelector('.close-modal-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }
    
    document.body.appendChild(modal);
    this.currentModal = modal;
    
    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    return modal;
  },

  closeModal() {
    if (this.currentModal) {
      document.body.removeChild(this.currentModal);
      this.currentModal = null;
    }
    
    // Cerrar cualquier modal huérfano
    const orphanModals = document.querySelectorAll('.modal-backdrop');
    orphanModals.forEach(modal => {
      if (document.body.contains(modal)) {
        document.body.removeChild(modal);
      }
    });
    
    // Restaurar scroll
    document.body.style.overflow = '';
  }
};

/* ============================================
   CONTROLADOR DEL JUEGO PRINCIPAL
   ============================================ */

const GameController = {
  init() {
    this.bindEvents();
    this.updateUI();
    RobustModalSystem.init();
  },

  bindEvents() {
    // Botones principales
    this.bindButton('play-button', () => this.showGameModeSelection());
    this.bindButton('restart-button', () => this.restartGame());
    
    // Editar equipos
    const editTeamsBtn = document.querySelector('[aria-label="edit teams"]');
    if (editTeamsBtn) {
      editTeamsBtn.addEventListener('click', () => this.showTeamEditor());
    }

    // Eventos del tablero
    this.bindBoardEvents();
  },

  bindButton(id, handler) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', handler);
    }
  },

  bindBoardEvents() {
    const tiles = document.querySelectorAll('.game-tile');
    tiles.forEach(tile => {
      const questionId = parseInt(tile.dataset.tile);
      tile.addEventListener('click', () => {
        if (!tile.classList.contains('is-flipped')) {
          this.selectQuestion(questionId);
        }
      });
    });
  },

  showGameModeSelection() {
    const content = `
    <div class="text-center">
      <h3 class="text-2xl font-bold mb-6">Choose Game Mode</h3>
      <button class="game-mode-btn bg-purple-200 hover:bg-purple-300 p-4 rounded-lg transition-colors" data-mode="baamboozle">
        <div class="text-4xl mb-2">🎯</div>
        <div class="font-bold">The Verb Journey</div>
      </button>
    </div>
  `;

    const modal = RobustModalSystem.createModal("Select Game Mode", content);

    // Solo un botón
    const modeButton = modal.querySelector('.game-mode-btn');
    modeButton.addEventListener('click', () => {
      this.startGame('baamboozle');
    });
  },

  startGame(mode = 'baamboozle') {
    GameData.gameMode = mode;
    GameData.gameState = "playing";
    GameData.answeredQuestions = [];
    GameData.currentTeam = 1;
    
    // Cerrar modal
    RobustModalSystem.closeModal();
    
    // Redirigir al tablero si estamos en game-main
    if (window.location.pathname.includes('game-main')) {
      window.location.href = 'game-board.html';
      return;
    }
    
    this.updateUI();
    this.showNotification("Game started! Select a card.", "success");
  },

  selectQuestion(questionId) {
    if (GameData.gameState !== "playing") {
      this.showNotification("Start the game first!", "error");
      return;
    }

    if (GameData.answeredQuestions.includes(questionId)) {
      return;
    }

    const question = GameData.questions.find(q => q.id === questionId);
    if (!question) return;

    GameData.currentQuestion = question;
    this.showQuestion(question);
  },

  showQuestion(question) {
    const currentTeamName = GameData.teams[GameData.currentTeam - 1].name;
    
    const content = `
      <div class="text-center">
        <div class="mb-4">
          <span class="text-sm font-semibold text-gray-500">Question for ${currentTeamName}</span>
        </div>
        <div class="bg-blue-50 p-6 rounded-lg mb-6">
          <p class="text-xl font-medium text-black">${question.question}</p>
        </div>
        <button id="check-answer-btn" class="btn bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold">
          🔍 Check Answer
        </button>
      </div>
    `;

    const modal = RobustModalSystem.createModal("", content, { id: "question-modal" });
    
    const checkBtn = modal.querySelector('#check-answer-btn');
    checkBtn.addEventListener('click', () => this.showAnswer());
  },

  showAnswer() {
    if (!GameData.currentQuestion) return;

    const content = `
      <div class="text-center">
        <div class="bg-gray-100 p-4 rounded-lg mb-4">
          <p class="text-lg font-medium">${GameData.currentQuestion.question}</p>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <p class="font-semibold text-blue-800 mb-2">Answer:</p>
          <p class="text-blue-700 text-lg">${GameData.currentQuestion.answer}</p>
        </div>
        <div class="flex justify-center space-x-4">
          <button id="correct-btn" class="btn bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
            ✅ Correct
          </button>
          <button id="incorrect-btn" class="btn bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold">
            ❌ Incorrect
          </button>
        </div>
      </div>
    `;

    const modal = RobustModalSystem.createModal("", content, { id: "answer-modal" });
    
    const correctBtn = modal.querySelector('#correct-btn');
    const incorrectBtn = modal.querySelector('#incorrect-btn');
    
    correctBtn.addEventListener('click', () => this.answerQuestion(true));
    incorrectBtn.addEventListener('click', () => this.answerQuestion(false));
  },

  answerQuestion(isCorrect) {
    if (!GameData.currentQuestion) return;

    const currentTeamIndex = GameData.currentTeam - 1;
    const question = GameData.currentQuestion;

    if (isCorrect) {
      GameData.teams[currentTeamIndex].score += question.points;
    }

    // Marcar pregunta como contestada
    GameData.answeredQuestions.push(question.id);
    
    // Marcar tarjeta como usada
    this.markTileAsUsed(question.id);

    // Cambiar turno
    GameData.currentTeam = GameData.currentTeam === 1 ? 2 : 1;

    // Actualizar UI
    this.updateUI();

    // Mostrar resultado
    this.showResult(isCorrect, question.points);

    // Verificar fin de juego
    if (GameData.answeredQuestions.length >= GameData.questions.length) {
      setTimeout(() => this.endGame(), 2000);
    }

    GameData.currentQuestion = null;
  },

  showResult(isCorrect, points) {
    const content = `
      <div class="text-center">
        <div class="text-6xl mb-4">${isCorrect ? '🎉' : '😔'}</div>
        <h3 class="text-3xl font-bold mb-4 ${isCorrect ? 'text-green-600' : 'text-red-600'}">
          ${isCorrect ? 'Correct!' : 'Incorrect!'}
        </h3>
        <p class="text-2xl font-semibold mb-6">
          ${isCorrect ? `+${points} points` : 'No points'}
        </p>
        <button id="continue-btn" class="btn bg-purple-500 hover:bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold">
          Continue
        </button>
      </div>
    `;

    const modal = RobustModalSystem.createModal("", content, { id: "result-modal" });
    
    const continueBtn = modal.querySelector('#continue-btn');
    continueBtn.addEventListener('click', () => {
      RobustModalSystem.closeModal();
    });
  },

  markTileAsUsed(questionId) {
    const tile = document.querySelector(`[data-tile="${questionId}"]`);
    if (tile) {
      tile.classList.add('is-flipped');
      // Añadir animación
      tile.style.transform = 'rotateY(180deg)';
      tile.style.opacity = '0.3';
      tile.style.pointerEvents = 'none';
    }
  },

  endGame() {
    GameData.gameState = "ended";
    
    const winner = GameData.teams.reduce((a, b) => a.score > b.score ? a : b);
    const isTie = GameData.teams[0].score === GameData.teams[1].score;

    const content = `
      <div class="text-center">
        <div class="text-6xl mb-4">🏆</div>
        <h3 class="text-2xl font-bold mb-4">Game Finished!</h3>
        <div class="space-y-2 mb-6">
          ${GameData.teams.map(team => `
            <div class="flex justify-between items-center p-3 rounded-lg ${team.id === winner.id && !isTie ? 'bg-yellow-100 border-2 border-yellow-400' : 'bg-gray-100'}">
              <span class="font-semibold">${team.name}</span>
              <span class="font-bold">${team.score} points</span>
            </div>
          `).join('')}
        </div>
        <p class="text-lg font-semibold ${isTie ? 'text-blue-600' : 'text-green-600'} mb-4">
          ${isTie ? '🤝 It\'s a tie!' : `🏆 Winner: ${winner.name}`}
        </p>
        <div class="flex justify-center space-x-4">
          <button id="play-again-btn" class="btn bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
            Play Again
          </button>
          <button id="back-setup-btn" class="btn bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
            Back to Setup
          </button>
        </div>
      </div>
    `;

    const modal = RobustModalSystem.createModal("🎮 Game Results", content, { id: "game-end-modal" });
    
    const playAgainBtn = modal.querySelector('#play-again-btn');
    const backSetupBtn = modal.querySelector('#back-setup-btn');
    
    playAgainBtn.addEventListener('click', () => {
      this.restartGame();
      RobustModalSystem.closeModal();
    });
    
    backSetupBtn.addEventListener('click', () => {
      window.location.href = 'game-main.html';
    });
  },

  restartGame() {
    GameData.gameState = "waiting";
    GameData.answeredQuestions = [];
    GameData.teams.forEach(team => team.score = 0);
    GameData.currentTeam = 1;
    GameData.currentQuestion = null;

    // Restaurar todas las tarjetas
    const tiles = document.querySelectorAll('.game-tile');
    tiles.forEach(tile => {
      tile.classList.remove('is-flipped');
      tile.style.transform = '';
      tile.style.opacity = '';
      tile.style.pointerEvents = '';
    });

    this.updateUI();
    this.showNotification("Game restarted!", "info");
  },

  showTeamEditor() {
    const content = `
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Team 1 Name</label>
          <input type="text" id="team1-name-input" class="w-full p-3 border border-gray-300 rounded-lg" value="${GameData.teams[0].name}">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Team 2 Name</label>
          <input type="text" id="team2-name-input" class="w-full p-3 border border-gray-300 rounded-lg" value="${GameData.teams[1].name}">
        </div>
        <div class="flex justify-center space-x-4 pt-4">
          <button id="save-teams-btn" class="btn bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
            Save Teams
          </button>
          <button id="reset-teams-btn" class="btn bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold">
            Reset
          </button>
        </div>
      </div>
    `;

    const modal = RobustModalSystem.createModal("Edit Teams", content, { id: "team-editor-modal" });
    
    const saveBtn = modal.querySelector('#save-teams-btn');
    const resetBtn = modal.querySelector('#reset-teams-btn');
    
    saveBtn.addEventListener('click', () => this.saveTeamNames(modal));
    resetBtn.addEventListener('click', () => this.resetTeamNames(modal));
  },

  saveTeamNames(modal) {
    const team1Input = modal.querySelector('#team1-name-input');
    const team2Input = modal.querySelector('#team2-name-input');

    GameData.teams[0].name = team1Input.value.trim() || "Team 1";
    GameData.teams[1].name = team2Input.value.trim() || "Team 2";

    this.updateUI();
    this.showNotification("Team names updated!", "success");
    RobustModalSystem.closeModal();
  },

  resetTeamNames(modal) {
    const team1Input = modal.querySelector('#team1-name-input');
    const team2Input = modal.querySelector('#team2-name-input');
    
    team1Input.value = "Team 1";
    team2Input.value = "Team 2";
  },

  updateUI() {
    this.updateScoreboard();
    this.updateGameInfo();
    this.updateCurrentTeam();
  },

  updateScoreboard() {
    const team1Score = document.getElementById('team1-score');
    const team2Score = document.getElementById('team2-score');
    const team1Name = document.getElementById('team1-name');
    const team2Name = document.getElementById('team2-name');

    if (team1Score) team1Score.textContent = this.formatScore(GameData.teams[0].score);
    if (team2Score) team2Score.textContent = this.formatScore(GameData.teams[1].score);
    if (team1Name) team1Name.textContent = GameData.teams[0].name;
    if (team2Name) team2Name.textContent = GameData.teams[1].name;
  },

  updateCurrentTeam() {
    const currentTeamElement = document.getElementById('current-team');
    if (currentTeamElement) {
      const currentTeamName = GameData.teams[GameData.currentTeam - 1].name;
      currentTeamElement.textContent = currentTeamName;
      currentTeamElement.className = `font-bold ${GameData.currentTeam === 1 ? 'text-pink-600' : 'text-blue-600'}`;
    }

    // Resaltar equipo actual en scoreboard
    const team1Container = document.getElementById('team1-container');
    const team2Container = document.getElementById('team2-container');

    if (team1Container && team2Container) {
      team1Container.classList.toggle('ring-4', GameData.currentTeam === 1);
      team1Container.classList.toggle('ring-pink-400', GameData.currentTeam === 1);
      team2Container.classList.toggle('ring-4', GameData.currentTeam === 2);
      team2Container.classList.toggle('ring-blue-400', GameData.currentTeam === 2);
    }
  },

  updateGameInfo() {
    const gameCode = document.getElementById('game-code');
    const gameTitle = document.getElementById('game-title');
    const gameInstruction = document.getElementById('game-instruction');

    if (gameCode) gameCode.textContent = GameData.gameConfig.gameCode;
    if (gameTitle) gameTitle.textContent = GameData.gameConfig.title;
    if (gameInstruction) gameInstruction.textContent = GameData.gameConfig.instruction;
  },

  formatScore(score) {
    return score === 1 ? '1 point' : `${score} points`;
  },

  showNotification(message, type = "info") {
    if (window.BammoozleUtils?.NotificationSystem) {
      window.BammoozleUtils.NotificationSystem[type](message);
    } else {
      console.log(`[${type.toUpperCase()}] ${message}`);
    }
  }
};

/* ============================================
   CONTROLADOR DE ESTUDIO
   ============================================ */

const StudyController = {
  stats: {
    correct: 0,
    wrong: 0,
    seen: 0
  },

  init() {
    this.bindEvents();
    this.updateUI();
    RobustModalSystem.init();
  },

  bindEvents() {
    const restartBtn = document.getElementById('restart-button');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restart());
    }

    // Binds para botones de respuesta
    const answerButtons = document.querySelectorAll('.study-answer-btn');
    answerButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(btn.dataset.index);
        this.showAnswer(index);
      });
    });
  },

  showAnswer(questionIndex) {
    const question = GameData.questions[questionIndex];
    if (!question) return;

    this.stats.seen++;

    const content = `
      <div class="text-center">
        <div class="bg-gray-100 p-4 rounded-lg mb-4">
          <p class="text-lg font-medium">${question.question}</p>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <p class="font-semibold text-blue-800 mb-2">Answer:</p>
          <p class="text-blue-700 text-lg">${question.answer}</p>
        </div>
        <div class="flex justify-center space-x-4">
          <button id="knew-btn" class="btn bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
            ✅ I knew it
          </button>
          <button id="didnt-know-btn" class="btn bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold">
            ❌ I didn't know
          </button>
        </div>
      </div>
    `;

    const modal = RobustModalSystem.createModal("Study Answer", content, { id: "study-modal" });
    
    const knewBtn = modal.querySelector('#knew-btn');
    const didntKnowBtn = modal.querySelector('#didnt-know-btn');
    
    knewBtn.addEventListener('click', () => this.markAnswer(questionIndex, true));
    didntKnowBtn.addEventListener('click', () => this.markAnswer(questionIndex, false));
  },

  markAnswer(questionIndex, isCorrect) {
    if (isCorrect) {
      this.stats.correct++;
    } else {
      this.stats.wrong++;
    }

    this.updateProgressUI();
    RobustModalSystem.closeModal();

    const message = isCorrect ? "Great! Keep it up! 🎉" : "Keep studying! 💪";
    GameController.showNotification(message, isCorrect ? "success" : "info");
  },

  updateProgressUI() {
    const correctElement = document.getElementById('correct-count');
    const wrongElement = document.getElementById('wrong-count');
    const seenElement = document.getElementById('seen-count');
    const progressElement = document.getElementById('progress-percentage');

    if (correctElement) correctElement.textContent = this.stats.correct;
    if (wrongElement) wrongElement.textContent = this.stats.wrong;
    if (seenElement) seenElement.textContent = this.stats.seen;

    if (progressElement) {
      const progress = Math.round((this.stats.seen / GameData.questions.length) * 100);
      progressElement.textContent = `${progress}%`;
    }
  },

  restart() {
    this.stats = { correct: 0, wrong: 0, seen: 0 };
    this.updateProgressUI();
    GameController.showNotification("Study session restarted!", "info");
  },

  updateUI() {
    this.updateProgressUI();
  }
};

/* ============================================
   FUNCIONES GLOBALES PARA NAVEGACIÓN
   ============================================ */

function startBaamboozleGame() {
  window.location.href = 'game-board.html';
}

function goToStudy() {
  window.location.href = 'study.html';
}

function goToEdit() {
  window.location.href = 'edit.html';
}

/* ============================================
   INICIALIZACIÓN PRINCIPAL
   ============================================ */

const BammoozleGame = {
  GameController,
  StudyController,
  GameData,
  RobustModalSystem,

  init() {
    const currentPage = this.getCurrentPage();

    switch (currentPage) {
      case 'game-main':
      case 'game-board':
        this.GameController.init();
        break;
      case 'study':
        this.StudyController.init();
        break;
      default:
        console.log('Game system ready for:', currentPage);
    }
  },

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('game-main') || path.includes('paginaPrincipal')) return 'game-main';
    if (path.includes('game-board') || path.includes('gameboard')) return 'game-board';
    if (path.includes('study')) return 'study';
    if (path.includes('edit')) return 'edit';
    return 'unknown';
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  BammoozleGame.init();
});

// Exportar para uso global
window.BammoozleGame = BammoozleGame;

/* ============================================
   ENHANCED GAME CONTROLLER - CON VIDEOS E IMÁGENES
   Añadir este código al final de js/game.js
   ============================================ */

// Enhanced Game Data with different game types
const EnhancedGameData = {
  ...GameData, // Mantener los datos originales
  
  // Nuevos tipos de juego
  gameTypes: {
    text: {
      name: "Text Challenge",
      icon: "📝",
      color: "purple",
      url: "game-board.html",
      description: "Answer text-based questions"
    },
    video: {
      name: "Video Challenge", 
      icon: "🎬",
      color: "purple",
      url: "video-game-board.html",
      description: "Watch videos & answer questions"
    },
    image: {
      name: "Visual Discovery",
      icon: "🖼️", 
      color: "blue",
      url: "image-game-board.html",
      description: "Analyze images & answer questions"
    }
  }
};

// Enhanced Modal System for Game Selection
const EnhancedGameController = {
  ...GameController, // Mantener funcionalidad original
  
  // Sobrescribir el método de selección de modo de juego
  showGameModeSelection() {
    const content = `
      <div class="text-center">
        <h3 class="text-2xl font-bold mb-6 text-purple-800">Choose Your Game Type</h3>
        <p class="text-gray-600 mb-6">Select the type of challenge you want to play:</p>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Text-based Game -->
          <div class="game-type-card bg-gradient-to-br from-purple-400 to-purple-600 text-white rounded-xl p-6 cursor-pointer hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl" 
               data-game-type="text" data-url="game-board.html">
            <div class="text-5xl mb-4">📝</div>
            <h4 class="font-bold text-xl mb-2">Text Challenge</h4>
            <p class="text-sm opacity-90 mb-4">Answer text-based questions</p>
            <div class="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
              Classic Mode
            </div>
          </div>
          
          <!-- Video-based Game -->
          <div class="game-type-card bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl p-6 cursor-pointer hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
               data-game-type="video" data-url="video-game-board.html">
            <div class="text-5xl mb-4">🎬</div>
            <h4 class="font-bold text-xl mb-2">Video Challenge</h4>
            <p class="text-sm opacity-90 mb-4">Watch videos & answer questions</p>
            <div class="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
              Interactive Media
            </div>
          </div>
          
          <!-- Image-based Game -->
          <div class="game-type-card bg-gradient-to-br from-pink-500 to-orange-500 text-white rounded-xl p-6 cursor-pointer hover:scale-105 transform transition-all duration-300 shadow-lg hover:shadow-xl"
               data-game-type="image" data-url="image-game-board.html">
            <div class="text-5xl mb-4">🖼️</div>
            <h4 class="font-bold text-xl mb-2">Picture Perfect</h4>
            <p class="text-sm opacity-90 mb-4">Analyze images & answer questions</p>
            <div class="bg-white/20 px-3 py-1 rounded-full text-sm font-semibold">
              Visual Learning
            </div>
          </div>
        </div>
        
        <div class="mt-8 p-4 bg-blue-50 rounded-lg">
          <h5 class="font-bold text-blue-800 mb-2">💡 How to Choose:</h5>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-blue-700">
            <div>
              <strong>📝 Text:</strong> Traditional Q&A format, great for vocabulary and concepts
            </div>
            <div>
              <strong>🎬 Video:</strong> Multimedia learning, perfect for demonstrations and context
            </div>
            <div>
              <strong>🖼️ Image:</strong> Visual analysis, ideal for art, science, and observation skills
            </div>
          </div>
        </div>
      </div>
    `;

    const modal = RobustModalSystem.createModal("🎮 Select Game Type", content, {
      id: "game-type-selection-modal",
      size: "large"
    });

    // Bind click events to game type cards
    const gameTypeCards = modal.querySelectorAll('.game-type-card');
    gameTypeCards.forEach(card => {
      card.addEventListener('click', () => {
        const gameType = card.dataset.gameType;
        const gameUrl = card.dataset.url;
        this.startEnhancedGame(gameType, gameUrl);
      });
      
      // Add hover effects
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05) translateY(-5px)';
        card.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1) translateY(0)';
        card.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
      });
    });
  },

  startEnhancedGame(gameType, gameUrl) {
    // Save game type selection
    localStorage.setItem('selectedGameType', gameType);
    
    // Update game data
    EnhancedGameData.gameMode = gameType;
    EnhancedGameData.gameState = "playing";
    
    // Close modal
    RobustModalSystem.closeModal();
    
    // Show transition animation
    this.showGameTransition(gameType, gameUrl);
  },

  showGameTransition(gameType, gameUrl) {
    const gameTypeInfo = EnhancedGameData.gameTypes[gameType];
    
    const transitionContent = `
      <div class="text-center py-8">
        <div class="text-8xl mb-6 animate-bounce">${gameTypeInfo.icon}</div>
        <h3 class="text-3xl font-bold mb-4 text-${gameTypeInfo.color}-600">
          ${gameTypeInfo.name}
        </h3>
        <p class="text-xl text-gray-600 mb-6">Starting your game...</p>
        <div class="flex justify-center">
          <div class="loading-spinner"></div>
        </div>
        <p class="text-sm text-gray-500 mt-4">Get ready for an amazing learning experience!</p>
      </div>
    `;

    const transitionModal = RobustModalSystem.createModal("", transitionContent, {
      id: "game-transition-modal",
      closable: false
    });

    // Redirect after animation
    setTimeout(() => {
      window.location.href = gameUrl;
    }, 2500);
  },

  // Enhanced share functionality
  showEnhancedShare() {
    const currentGameType = localStorage.getItem('selectedGameType') || 'text';
    const gameTypeInfo = EnhancedGameData.gameTypes[currentGameType];
    
    const shareContent = `
      <div class="text-center">
        <div class="text-6xl mb-4">${gameTypeInfo.icon}</div>
        <h3 class="text-2xl font-bold mb-4">Share Your ${gameTypeInfo.name}</h3>
        
        <div class="bg-gray-50 p-4 rounded-lg mb-6">
          <h4 class="font-bold mb-2">Game Details:</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="text-gray-600">Type:</span>
              <div class="font-semibold">${gameTypeInfo.name}</div>
            </div>
            <div>
              <span class="text-gray-600">Code:</span>
              <div class="font-semibold">${EnhancedGameData.gameConfig.gameCode}</div>
            </div>
            <div>
              <span class="text-gray-600">Questions:</span>
              <div class="font-semibold">${EnhancedGameData.questions.length}</div>
            </div>
            <div>
              <span class="text-gray-600">Teams:</span>
              <div class="font-semibold">${EnhancedGameData.teams.length}</div>
            </div>
          </div>
        </div>
        
        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 mb-2">Share Link:</label>
          <div class="flex items-center space-x-2">
            <input 
              type="text" 
              id="enhanced-share-link" 
              readonly 
              value="https://bamboozle.com/game/${EnhancedGameData.gameConfig.gameCode}?type=${currentGameType}"
              class="form-input flex-1 text-sm"
            >
            <button id="copy-enhanced-link" class="btn btn-primary btn-sm">
              📋 Copy
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button class="btn btn-sm bg-blue-500 hover:bg-blue-600 text-white">
            📧 Email
          </button>
          <button class="btn btn-sm bg-green-500 hover:bg-green-600 text-white">
            💬 WhatsApp
          </button>
          <button class="btn btn-sm bg-blue-400 hover:bg-blue-500 text-white">
            🐦 Twitter
          </button>
          <button class="btn btn-sm bg-purple-500 hover:bg-purple-600 text-white">
            📱 QR Code
          </button>
        </div>
      </div>
    `;

    const shareModal = RobustModalSystem.createModal("🚀 Share Your Game", shareContent);
    
    // Copy link functionality
    const copyButton = shareModal.querySelector('#copy-enhanced-link');
    const linkInput = shareModal.querySelector('#enhanced-share-link');
    
    copyButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(linkInput.value);
        copyButton.innerHTML = '✅ Copied!';
        copyButton.classList.remove('btn-primary');
        copyButton.classList.add('btn-success');
        
        setTimeout(() => {
          copyButton.innerHTML = '📋 Copy';
          copyButton.classList.remove('btn-success');
          copyButton.classList.add('btn-primary');
        }, 2000);
      } catch (err) {
        // Fallback for older browsers
        linkInput.select();
        document.execCommand('copy');
        copyButton.innerHTML = '✅ Copied!';
      }
    });
  }
};

// Enhanced UI Controller for Game Main Page
const EnhancedUI = {
  ...window.BammoozleUI, // Mantener funcionalidad original
  
  init() {
    // Call original init
    if (window.BammoozleUI?.init) {
      window.BammoozleUI.init();
    }
    
    // Add enhanced functionality
    this.enhanceGameMainPage();
    this.addGameTypeIndicators();
  },

  enhanceGameMainPage() {
    // Only enhance if we're on game-main page
    if (!window.location.pathname.includes('game-main')) return;

    // Replace the original play button functionality
    const playButton = document.getElementById('play-button');
    if (playButton) {
      // Remove existing event listeners by cloning the element
      const newPlayButton = playButton.cloneNode(true);
      playButton.parentNode.replaceChild(newPlayButton, playButton);
      
      // Add enhanced functionality
      newPlayButton.addEventListener('click', () => {
        EnhancedGameController.showGameModeSelection();
      });
    }

    // Enhance share button
    const shareButton = document.getElementById('share-button');
    if (shareButton) {
      const newShareButton = shareButton.cloneNode(true);
      shareButton.parentNode.replaceChild(newShareButton, shareButton);
      
      newShareButton.addEventListener('click', () => {
        EnhancedGameController.showEnhancedShare();
      });
    }
  },

  addGameTypeIndicators() {
    // Add visual indicators for different game types available
    const commandCenter = document.querySelector('.card .card-body');
    if (!commandCenter) return;

    const gameTypesIndicator = document.createElement('div');
    gameTypesIndicator.className = 'mt-4 p-3 bg-blue-50 rounded-lg';
    gameTypesIndicator.innerHTML = `
      <h4 class="font-bold text-blue-800 mb-2 text-sm">🎮 Available Game Types:</h4>
      <div class="flex justify-between text-xs">
        <span class="flex items-center">📝 Text</span>
        <span class="flex items-center">🎬 Video</span>
        <span class="flex items-center">🖼️ Images</span>
      </div>
    `;

    // Insert before the buttons
    const buttonContainer = commandCenter.querySelector('.grid');
    if (buttonContainer) {
      commandCenter.insertBefore(gameTypesIndicator, buttonContainer);
    }
  }
};

// Game Type Navigation Functions
function startTextGame() {
  EnhancedGameController.startEnhancedGame('text', 'game-board.html');
}

function startVideoGame() {
  EnhancedGameController.startEnhancedGame('video', 'video-game-board.html');
}

function startImageGame() {
  EnhancedGameController.startEnhancedGame('image', 'image-game-board.html');
}

// Enhanced Editor Controller for Different Game Types
const EnhancedEditorController = {
  currentGameType: 'text',
  
  init() {
    this.detectGameType();
    this.setupGameTypeSelector();
    this.enhanceQuestionForm();
  },
  
  detectGameType() {
    this.currentGameType = localStorage.getItem('selectedGameType') || 'text';
  },
  
  setupGameTypeSelector() {
    const editForm = document.getElementById('edit-form');
    if (!editForm) return;
    
    // Add game type selector at the top of the form
    const gameTypeSelector = document.createElement('div');
    gameTypeSelector.className = 'form-group';
    gameTypeSelector.innerHTML = `
      <label class="form-label">Game Type</label>
      <select id="game-type-selector" class="form-input">
        <option value="text" ${this.currentGameType === 'text' ? 'selected' : ''}>📝 Text Questions</option>
        <option value="video" ${this.currentGameType === 'video' ? 'selected' : ''}>🎬 Video Questions</option>
        <option value="image" ${this.currentGameType === 'image' ? 'selected' : ''}>🖼️ Image Questions</option>
      </select>
    `;
    
    editForm.insertBefore(gameTypeSelector, editForm.firstChild);
    
    // Add event listener for game type changes
    const selector = document.getElementById('game-type-selector');
    selector.addEventListener('change', (e) => {
      this.currentGameType = e.target.value;
      localStorage.setItem('selectedGameType', this.currentGameType);
      this.updateFormForGameType();
    });
    
    // Initial form update
    this.updateFormForGameType();
  },
  
  updateFormForGameType() {
    const questionInput = document.getElementById('question');
    const answerInput = document.getElementById('answer');
    const mediaContainer = document.querySelector('[name="media"]')?.closest('.form-group');
    
    if (!questionInput || !answerInput) return;
    
    switch (this.currentGameType) {
      case 'text':
        questionInput.placeholder = 'Enter your text question here...';
        answerInput.placeholder = 'Enter the correct answer...';
        if (mediaContainer) {
          mediaContainer.style.display = 'none';
        }
        break;
        
      case 'video':
        questionInput.placeholder = 'What question should students answer after watching the video?';
        answerInput.placeholder = 'Enter the correct answer about the video content...';
        if (mediaContainer) {
          mediaContainer.style.display = 'block';
          const mediaInput = mediaContainer.querySelector('input');
          const mediaLabel = mediaContainer.querySelector('label');
          if (mediaInput) mediaInput.placeholder = 'Enter video URL (MP4, YouTube, etc.)';
          if (mediaLabel) mediaLabel.textContent = '🎬 Video URL';
        }
        break;
        
      case 'image':
        questionInput.placeholder = 'What should students identify or analyze in this image?';
        answerInput.placeholder = 'Enter what students should observe or conclude...';
        if (mediaContainer) {
          mediaContainer.style.display = 'block';
          const mediaInput = mediaContainer.querySelector('input');
          const mediaLabel = mediaContainer.querySelector('label');
          if (mediaInput) mediaInput.placeholder = 'Enter image URL (JPG, PNG, etc.)';
          if (mediaLabel) mediaLabel.textContent = '🖼️ Image URL';
        }
        break;
    }
  },
  
  enhanceQuestionForm() {
    const editForm = document.getElementById('edit-form');
    if (!editForm) return;
    
    // Add preview functionality
    const previewButton = document.createElement('button');
    previewButton.type = 'button';
    previewButton.className = 'btn btn-info btn-lg';
    previewButton.innerHTML = '👁️ Preview';
    previewButton.addEventListener('click', () => this.showPreview());
    
    // Add to button container
    const buttonContainer = editForm.querySelector('.md\\:col-span-2 .flex');
    if (buttonContainer) {
      buttonContainer.appendChild(previewButton);
    }
  },
  
  showPreview() {
    const question = document.getElementById('question').value;
    const answer = document.getElementById('answer').value;
    const mediaUrl = document.querySelector('[name="media"]')?.value;
    const points = document.getElementById('points').value || 15;
    
    if (!question.trim()) {
      alert('Please enter a question first');
      return;
    }
    
    let previewContent = '';
    
    switch (this.currentGameType) {
      case 'text':
        previewContent = `
          <div class="bg-white p-6 rounded-lg">
            <h4 class="text-xl font-bold mb-4 text-purple-800">📝 Text Question Preview</h4>
            <div class="bg-purple-50 p-4 rounded-lg mb-4">
              <p class="text-lg font-medium">${question}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg mb-4">
              <p class="font-semibold text-green-800 mb-2">Answer:</p>
              <p class="text-green-700">${answer || 'No answer provided yet'}</p>
            </div>
            <div class="text-center">
              <span class="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-bold">
                ${points} points
              </span>
            </div>
          </div>
        `;
        break;
        
      case 'video':
        previewContent = `
          <div class="bg-white p-6 rounded-lg">
            <h4 class="text-xl font-bold mb-4 text-purple-800">🎬 Video Question Preview</h4>
            ${mediaUrl ? `
              <div class="mb-4">
                <video class="w-full h-64 bg-black rounded-lg" controls>
                  <source src="${mediaUrl}" type="video/mp4">
                  Video preview not available
                </video>
              </div>
            ` : `
              <div class="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4">
                <div class="text-gray-500 text-center">
                  <div class="text-4xl mb-2">🎬</div>
                  <p>No video URL provided</p>
                </div>
              </div>
            `}
            <div class="bg-purple-50 p-4 rounded-lg mb-4">
              <p class="text-lg font-medium">${question}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg mb-4">
              <p class="font-semibold text-green-800 mb-2">Answer:</p>
              <p class="text-green-700">${answer || 'No answer provided yet'}</p>
            </div>
            <div class="text-center">
              <span class="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-bold">
                ${points} points
              </span>
            </div>
          </div>
        `;
        break;
        
      case 'image':
        previewContent = `
          <div class="bg-white p-6 rounded-lg">
            <h4 class="text-xl font-bold mb-4 text-pink-800">🖼️ Image Question Preview</h4>
            ${mediaUrl ? `
              <div class="mb-4">
                <img src="${mediaUrl}" alt="Preview" class="w-full h-64 object-contain bg-gray-100 rounded-lg">
              </div>
            ` : `
              <div class="bg-gray-100 h-64 rounded-lg flex items-center justify-center mb-4">
                <div class="text-gray-500 text-center">
                  <div class="text-4xl mb-2">🖼️</div>
                  <p>No image URL provided</p>
                </div>
              </div>
            `}
            <div class="bg-pink-50 p-4 rounded-lg mb-4">
              <p class="text-lg font-medium">${question}</p>
            </div>
            <div class="bg-green-50 p-4 rounded-lg mb-4">
              <p class="font-semibold text-green-800 mb-2">Answer:</p>
              <p class="text-green-700">${answer || 'No answer provided yet'}</p>
            </div>
            <div class="text-center">
              <span class="bg-pink-100 text-pink-800 px-4 py-2 rounded-full font-bold">
                ${points} points
              </span>
            </div>
          </div>
        `;
        break;
    }
    
    const modal = RobustModalSystem.createModal('Question Preview', previewContent, {
      size: 'large'
    });
  }
};

// Initialize Enhanced Controllers based on current page
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;
  
  if (currentPath.includes('game-main')) {
    // Replace original controller with enhanced version
    Object.assign(window.BammoozleGame.GameController, EnhancedGameController);
    
    // Initialize enhanced UI
    EnhancedUI.init();
  }
  
  if (currentPath.includes('edit')) {
    EnhancedEditorController.init();
  }
});

// Export enhanced controllers
window.EnhancedGameController = EnhancedGameController;
window.EnhancedGameData = EnhancedGameData;
window.EnhancedUI = EnhancedUI;
window.EnhancedEditorController = EnhancedEditorController;

// Helper functions for navigation
window.startTextGame = startTextGame;
window.startVideoGame = startVideoGame;
window.startImageGame = startImageGame;

console.log('🚀 Enhanced Game Controller loaded with Video and Image support!');