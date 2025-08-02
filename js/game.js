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
    title: "Verbs followed by gerunds or infinitive (no diff...)",
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
        <div class="grid grid-cols-2 gap-4">
          <button class="game-mode-btn bg-purple-200 hover:bg-purple-300 p-4 rounded-lg transition-colors" data-mode="baamboozle">
            <div class="text-4xl mb-2">🎯</div>
            <div class="font-bold">Baamboozle</div>
          </button>
          <button class="game-mode-btn bg-orange-200 hover:bg-orange-300 p-4 rounded-lg transition-colors" data-mode="spud">
            <div class="text-4xl mb-2">🥔</div>
            <div class="font-bold">Spud Game</div>
          </button>
          <button class="game-mode-btn bg-pink-200 hover:bg-pink-300 p-4 rounded-lg transition-colors" data-mode="bowling">
            <div class="text-4xl mb-2">🎳</div>
            <div class="font-bold">Bowling</div>
          </button>
          <button class="game-mode-btn bg-red-200 hover:bg-red-300 p-4 rounded-lg transition-colors" data-mode="bball">
            <div class="text-4xl mb-2">🏀</div>
            <div class="font-bold">B-Ball</div>
          </button>
        </div>
      </div>
    `;
    
    const modal = RobustModalSystem.createModal("Select Game Mode", content);
    
    // Añadir eventos a los botones de modo
    const modeButtons = modal.querySelectorAll('.game-mode-btn');
    modeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode;
        this.startGame(mode);
      });
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