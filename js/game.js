/* ============================================
   GAME.JS - Lógica del Juego
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
  currentQuestion: null
};

/* ============================================
   CONTROLADOR DEL JUEGO
   ============================================ */

const GameController = {
  init() {
    this.bindEvents();
    this.updateUI();
  },

  bindEvents() {
    // Iniciar juego
    const playButton = document.getElementById('play-button');
    if (playButton) {
      playButton.addEventListener('click', () => {
        this.startGame();
      });
    }

    // Reiniciar juego
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
      restartButton.addEventListener('click', () => {
        this.restartGame();
      });
    }

    // Editar equipos
    const editTeamsButton = document.querySelector('[aria-label="edit teams"]');
    if (editTeamsButton) {
      editTeamsButton.addEventListener('click', () => {
        this.showTeamEditor();
      });
    }
  },

  startGame() {
    GameData.gameState = "playing";
    GameData.answeredQuestions = [];
    this.updateUI();

    const { NotificationSystem } = window.BammoozleUtils;
    NotificationSystem.success("Game started! Select a card.");
  },

  restartGame() {
    GameData.gameState = "waiting";
    GameData.answeredQuestions = [];
    GameData.teams.forEach(team => team.score = 0);
    GameData.currentTeam = 1;
    GameData.currentQuestion = null;

    this.updateUI();
    this.regenerateBoard();

    const { NotificationSystem } = window.BammoozleUtils;
    NotificationSystem.info("Game restarted");
  },

  selectQuestion(questionId) {
    if (GameData.gameState !== "playing") {
      const { NotificationSystem } = window.BammoozleUtils;
      NotificationSystem.error("Start the game first");
      return;
    }

    if (GameData.answeredQuestions.includes(questionId)) {
      return; // Pregunta ya contestada
    }

    const question = GameData.questions.find(q => q.id === questionId);
    if (!question) return;

    GameData.currentQuestion = question;
    this.showQuestion(question);
  },

  showQuestion(question) {
    const { ModalSystem } = window.BammoozleUI;

    const content = `
    <div class="text-center">
      <div class="mb-4">
        <span class="text-sm font-semibold text-gray-500">Question for ${GameData.teams[GameData.currentTeam - 1].name}</span>
      </div>
      <div class="bg-white p-6 rounded-lg mb-6 text-center">
        <p class="text-xl font-medium text-black">${question.question}</p>
      </div>
      <div class="flex justify-center">
        <button class="btn btn-info btn-lg" onclick="BammoozleGame.GameController.showAnswer()" style="background-color: #49C8F0; color: white;">
          🔍 Check
        </button>
      </div>
    </div>
  `;

    ModalSystem.createModal("", content, {
      id: "question-modal",
      closeButtonText: "Close"
    });
  },

  // Reemplazar estas funciones en js/game.js

  // 1. Modificar showAnswer() para evitar modales anidados
  showAnswer() {
    if (!GameData.currentQuestion) return;

    console.log('🔧 showAnswer: Cerrando modal anterior...');

    // Cerrar cualquier modal existente FORZADAMENTE
    const existingModals = document.querySelectorAll('.modal-backdrop:not(.hidden)');
    existingModals.forEach(modal => {
      modal.classList.add('hidden');
      if (modal.id.includes('question-modal') || modal.id.includes('dynamic-modal')) {
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        }, 100);
      }
    });

    // Esperar un momento antes de crear el nuevo modal
    setTimeout(() => {
      const { ModalSystem } = window.BammoozleUI;

      const content = `
      <div class="text-center">
        <div class="bg-white p-6 rounded-lg mb-6 text-center">
          <p class="text-xl font-medium text-black mb-4">${GameData.currentQuestion.question}</p>
          <div class="bg-blue-50 p-4 rounded-lg">
            <p class="font-semibold text-blue-800 mb-2">Answer:</p>
            <p class="text-blue-700 text-lg">${GameData.currentQuestion.answer}</p>
          </div>
        </div>
        <div class="flex justify-center space-x-4">
          <button class="btn btn-success btn-lg" onclick="BammoozleGame.GameController.answerQuestion(true)" style="background-color: #49C8F0; color: white;">
            Yes
          </button>
          <button class="btn btn-danger btn-lg" onclick="BammoozleGame.GameController.answerQuestion(false)" style="background-color: #FB4D3D; color: white;">
            No
          </button>
        </div>
      </div>
    `;

      ModalSystem.createModal("", content, {
        id: "answer-modal",
        closeButtonText: "Close"
      });

      console.log('✅ showAnswer: Nuevo modal creado');
    }, 150);
  },

  // 2. Modificar answerQuestion() para evitar modales anidados
  answerQuestion(isCorrect) {
    if (!GameData.currentQuestion) return;

    console.log('🔧 answerQuestion: Cerrando modal anterior...');

    const currentTeamIndex = GameData.currentTeam - 1;
    const question = GameData.currentQuestion;

    // Cerrar cualquier modal existente FORZADAMENTE
    const existingModals = document.querySelectorAll('.modal-backdrop:not(.hidden)');
    existingModals.forEach(modal => {
      modal.classList.add('hidden');
      if (modal.id.includes('answer-modal') || modal.id.includes('dynamic-modal')) {
        setTimeout(() => {
          if (document.body.contains(modal)) {
            document.body.removeChild(modal);
          }
        }, 100);
      }
    });

    // Esperar un momento antes de crear el nuevo modal
    setTimeout(() => {
      const { ModalSystem } = window.BammoozleUI;

      // Mostrar resultado
      let resultContent;
      if (isCorrect) {
        GameData.teams[currentTeamIndex].score += question.points;
        resultContent = `
        <div class="text-center">
          <h3 class="text-3xl font-bold text-green-600 mb-4">Correct!</h3>
          <p class="text-2xl font-semibold mb-6">${question.points} points</p>
          <button class="btn btn-primary btn-lg" onclick="BammoozleGame.GameController.closeResultModal()" style="background-color: #8453DB; color: white;">
            Close
          </button>
        </div>
      `;
      } else {
        resultContent = `
        <div class="text-center">
          <h3 class="text-3xl font-bold text-red-600 mb-4">Incorrect!</h3>
          <p class="text-2xl font-semibold mb-6">No points</p>
          <button class="btn btn-primary btn-lg" onclick="BammoozleGame.GameController.closeResultModal()" style="background-color: #8453DB; color: white;">
            Close
          </button>
        </div>
      `;
      }

      ModalSystem.createModal("", resultContent, {
        id: "result-modal",
        showFooter: false
      });

      console.log('✅ answerQuestion: Modal de resultado creado');
    }, 200);
  },

  closeResultModal() {
    const { ModalSystem } = window.BammoozleUI;
    ModalSystem.closeModal();

    // Marcar pregunta como contestada
    GameData.answeredQuestions.push(GameData.currentQuestion.id);

    // Cambiar turno
    GameData.currentTeam = GameData.currentTeam === 1 ? 2 : 1;

    // Actualizar UI
    this.updateUI();

    // Marcar tarjeta como usada
    this.markTileAsUsed(GameData.currentQuestion.id);

    // Verificar si el juego terminó
    if (GameData.answeredQuestions.length >= GameData.questions.length) {
      this.endGame();
    }

    GameData.currentQuestion = null;
  },

  markTileAsUsed(questionId) {
    const tile = document.querySelector(`[data-tile="${questionId}"]`);
    if (tile) {
      tile.classList.add('is-flipped');
    }
  },

  endGame() {
    GameData.gameState = "ended";

    const winner = GameData.teams.reduce((a, b) =>
      a.score > b.score ? a : b
    );

    const { NotificationSystem } = window.BammoozleUtils;
    const { ModalSystem } = window.BammoozleUI;

    NotificationSystem.success(`Game finished! Winner: ${winner.name}`);

    const content = `
      <div class="text-center">
        <h3 class="text-2xl font-bold mb-4">Game Finished!</h3>
        <div class="space-y-2 mb-6">
          ${GameData.teams.map(team => `
            <div class="flex justify-between items-center p-2 rounded ${team.id === winner.id ? 'bg-yellow-100' : 'bg-gray-100'}">
              <span class="font-semibold">${team.name}</span>
              <span class="font-bold">${team.score} points</span>
            </div>
          `).join('')}
        </div>
        <p class="text-lg font-semibold text-green-600">🏆 Winner: ${winner.name}</p>
      </div>
    `;

    ModalSystem.createModal("Results", content, {
      id: "results-modal",
      closeButtonText: "Close"
    });
  },

  updateUI() {
    this.updateScoreboard();
    this.updateGameInfo();
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

    // Resaltar equipo actual
    const team1Container = document.getElementById('team1-container');
    const team2Container = document.getElementById('team2-container');

    if (team1Container && team2Container) {
      team1Container.classList.toggle('ring-2', GameData.currentTeam === 1);
      team2Container.classList.toggle('ring-2', GameData.currentTeam === 2);
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

  regenerateBoard() {
    const { GameBoard } = window.BammoozleUI;
    if (GameBoard) {
      GameBoard.createGameTiles();
    }
  },

  showTeamEditor() {
    const { ModalSystem } = window.BammoozleUI;

    const content = `
      <div class="space-y-4">
        <div>
          <label class="form-label">Team 1 Name</label>
          <input type="text" id="team1-name-input" class="form-input" value="${GameData.teams[0].name}">
        </div>
        <div>
          <label class="form-label">Team 2 Name</label>
          <input type="text" id="team2-name-input" class="form-input" value="${GameData.teams[1].name}">
        </div>
        <div class="flex justify-center space-x-4">
          <button class="btn btn-primary" onclick="BammoozleGame.GameController.saveTeamNames()">
            Save
          </button>
          <button class="btn btn-secondary" onclick="BammoozleGame.GameController.resetTeamNames()">
            Reset
          </button>
        </div>
      </div>
    `;

    ModalSystem.createModal("Edit Teams", content, {
      id: "team-editor-modal",
      closeButtonText: "Close"
    });
  },

  saveTeamNames() {
    const team1Input = document.getElementById('team1-name-input');
    const team2Input = document.getElementById('team2-name-input');

    if (team1Input && team2Input) {
      GameData.teams[0].name = team1Input.value.trim() || "Team 1";
      GameData.teams[1].name = team2Input.value.trim() || "Team 2";

      this.updateUI();

      const { NotificationSystem } = window.BammoozleUtils;
      const { ModalSystem } = window.BammoozleUI;

      NotificationSystem.success("Team names updated");
      ModalSystem.closeModal();
    }
  },

  resetTeamNames() {
    GameData.teams[0].name = "Team 1";
    GameData.teams[1].name = "Team 2";

    const team1Input = document.getElementById('team1-name-input');
    const team2Input = document.getElementById('team2-name-input');

    if (team1Input) team1Input.value = GameData.teams[0].name;
    if (team2Input) team2Input.value = GameData.teams[1].name;
  }
};

/* ============================================
   CONTROLADOR DE ESTUDIO
   ============================================ */

const StudyController = {
  currentIndex: 0,
  studyMode: "preview", // preview, practice
  stats: {
    correct: 0,
    wrong: 0,
    seen: 0
  },

  init() {
    this.bindEvents();
    this.updateUI();
  },

  bindEvents() {
    // Botón de reinicio
    const restartButton = document.getElementById('restart-button');
    if (restartButton) {
      restartButton.addEventListener('click', () => {
        this.restart();
      });
    }

    // Botones de las tarjetas de estudio
    const studyCards = document.querySelectorAll('.study-card');
    studyCards.forEach((card, index) => {
      const magnifyingGlass = card.querySelector('button');
      if (magnifyingGlass) {
        magnifyingGlass.addEventListener('click', (e) => {
          e.stopPropagation();
          this.showAnswer(index);
        });
      }
    });
  },

  showAnswer(questionIndex) {
    const question = GameData.questions[questionIndex];
    if (!question) return;

    this.stats.seen++;

    const { ModalSystem } = window.BammoozleUI;

    const content = `
      <div class="text-center">
        <div class="bg-gray-100 p-4 rounded-lg mb-4">
          <p class="text-lg font-medium">${question.question}</p>
        </div>
        <div class="bg-blue-50 p-4 rounded-lg mb-6">
          <p class="font-semibold text-blue-800">Answer:</p>
          <p class="text-blue-700">${question.answer}</p>
        </div>
        <div class="flex justify-center space-x-4">
          <button class="btn btn-success" onclick="BammoozleGame.StudyController.markAnswer(${questionIndex}, true)">
            I knew the answer
          </button>
          <button class="btn btn-danger" onclick="BammoozleGame.StudyController.markAnswer(${questionIndex}, false)">
            I didn't know the answer
          </button>
        </div>
      </div>
    `;

    ModalSystem.createModal("Answer", content, {
      id: "study-answer-modal",
      closeButtonText: "Close"
    });
  },

  markAnswer(questionIndex, isCorrect) {
    if (isCorrect) {
      this.stats.correct++;
    } else {
      this.stats.wrong++;
    }

    this.updateProgressUI();

    const { ModalSystem } = window.BammoozleUI;
    const { NotificationSystem } = window.BammoozleUtils;

    ModalSystem.closeModal();
    NotificationSystem.success(isCorrect ? "Correct!" : "Keep studying");
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
    this.currentIndex = 0;
    this.updateProgressUI();

    const { NotificationSystem } = window.BammoozleUtils;
    NotificationSystem.info("Study session restarted");
  },

  updateUI() {
    this.updateProgressUI();
  }
};

/* ============================================
   CONTROLADOR DE EDITOR
   ============================================ */

const EditorController = {
  currentQuestion: null,

  init() {
    this.bindEvents();
    this.loadQuestions();
  },

  bindEvents() {
    // Formulario de edición
    const editForm = document.getElementById('edit-form');
    if (editForm) {
      editForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.saveQuestion();
      });
    }

    // Botones de acción en la lista
    this.bindQuestionListEvents();
  },

  bindQuestionListEvents() {
    const questionsList = document.getElementById('questions-list');
    if (!questionsList) return;

    // Botones de editar
    const editButtons = questionsList.querySelectorAll('[data-action="edit"]');
    editButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const questionId = parseInt(e.target.closest('[data-question-id]').dataset.questionId);
        this.editQuestion(questionId);
      });
    });

    // Botones de eliminar
    const deleteButtons = questionsList.querySelectorAll('[data-action="delete"]');
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const questionId = parseInt(e.target.closest('[data-question-id]').dataset.questionId);
        this.deleteQuestion(questionId);
      });
    });
  },

  loadQuestions() {
    const questionsList = document.getElementById('questions-list');
    if (!questionsList) return;

    questionsList.innerHTML = '';

    GameData.questions.forEach(question => {
      const questionElement = this.createQuestionElement(question);
      questionsList.appendChild(questionElement);
    });
  },

  createQuestionElement(question) {
    const div = document.createElement('div');
    div.className = 'card';
    div.dataset.questionId = question.id;

    div.innerHTML = `
      <div class="card-body">
        <p class="text-gray-500 mb-2">${question.question}</p>
        <p class="font-bold text-bam-blue">${question.answer}</p>
      </div>
      <div class="card-footer">
        <span class="font-bold text-gray-600">v ${question.points}</span>
        <div class="flex items-center space-x-2 text-gray-600">
          <button data-action="edit" class="hover:text-bam-blue">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/>
            </svg>
          </button>
          <button data-action="delete" class="hover:text-bam-red">
            <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    return div;
  },

  saveQuestion() {
    const form = document.getElementById('edit-form');
    const question = form.querySelector('#question').value.trim();
    const answer = form.querySelector('#answer').value.trim();
    const points = parseInt(form.querySelector('#points').value) || 15;

    if (!question || !answer) {
      const { NotificationSystem } = window.BammoozleUtils;
      NotificationSystem.error('Question and answer are required');
      return;
    }

    if (this.currentQuestion) {
      // Editar pregunta existente
      this.currentQuestion.question = question;
      this.currentQuestion.answer = answer;
      this.currentQuestion.points = points;
    } else {
      // Nueva pregunta
      const newQuestion = {
        id: Date.now(),
        question,
        answer,
        points
      };
      GameData.questions.push(newQuestion);
    }

    this.loadQuestions();
    this.bindQuestionListEvents();
    form.reset();
    this.currentQuestion = null;

    const { NotificationSystem } = window.BammoozleUtils;
    NotificationSystem.success('Question saved successfully');
  },

  editQuestion(questionId) {
    const question = GameData.questions.find(q => q.id === questionId);
    if (!question) return;

    this.currentQuestion = question;

    const form = document.getElementById('edit-form');
    form.querySelector('#question').value = question.question;
    form.querySelector('#answer').value = question.answer;
    form.querySelector('#points').value = question.points;

    // Scroll al formulario
    form.scrollIntoView({ behavior: 'smooth' });
  },

  deleteQuestion(questionId) {
    if (confirm('Are you sure you want to delete this question?')) {
      GameData.questions = GameData.questions.filter(q => q.id !== questionId);
      this.loadQuestions();
      this.bindQuestionListEvents();

      const { NotificationSystem } = window.BammoozleUtils;
      NotificationSystem.success('Question deleted');
    }
  }
};

/* ============================================
   INICIALIZACIÓN PRINCIPAL
   ============================================ */

const BammoozleGame = {
  GameController,
  StudyController,
  EditorController,
  GameData,

  init() {
    // Detectar página actual y inicializar el controlador apropiado
    const currentPage = this.getCurrentPage();

    switch (currentPage) {
      case 'game-main':
        this.GameController.init();
        break;
      case 'game-board':
        this.GameController.init();
        break;
      
      case 'edit':
        this.EditorController.init();
        break;
      default:
        console.log('Page not recognized for game initialization');
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
//navegacion al juego 
function startBaamboozleGame() {
  window.location.href = 'game-board.html';
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  BammoozleGame.init();
});

// Exportar para uso global
window.BammoozleGame = BammoozleGame;