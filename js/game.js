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
    NotificationSystem.success("¡Juego iniciado! Selecciona una tarjeta.");
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
    NotificationSystem.info("Juego reiniciado");
  },

  selectQuestion(questionId) {
    if (GameData.gameState !== "playing") {
      const { NotificationSystem } = window.BammoozleUtils;
      NotificationSystem.error("Inicia el juego primero");
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
          <span class="text-sm font-semibold text-gray-500">Pregunta para ${GameData.teams[GameData.currentTeam - 1].name}</span>
        </div>
        <div class="bg-gray-100 p-4 rounded-lg mb-6">
          <p class="text-lg font-medium">${question.question}</p>
        </div>
        <div class="flex justify-center space-x-4">
          <button class="btn btn-success" onclick="BammoozleGame.GameController.answerQuestion(true)">
            Correcto (${question.points} pts)
          </button>
          <button class="btn btn-danger" onclick="BammoozleGame.GameController.answerQuestion(false)">
            Incorrecto
          </button>
        </div>
        <div class="mt-4">
          <button class="btn btn-secondary btn-sm" onclick="BammoozleGame.GameController.showAnswer()">
            Mostrar Respuesta
          </button>
        </div>
      </div>
    `;

    ModalSystem.createModal("Pregunta", content, {
      id: "question-modal",
      closeButtonText: "Cerrar"
    });
  },

  showAnswer() {
    if (!GameData.currentQuestion) return;
    
    const answerDiv = document.createElement('div');
    answerDiv.className = 'mt-4 p-4 bg-blue-50 rounded-lg';
    answerDiv.innerHTML = `
      <p class="font-semibold text-blue-800">Respuesta:</p>
      <p class="text-blue-700">${GameData.currentQuestion.answer}</p>
    `;
    
    const modal = document.getElementById('question-modal');
    const modalBody = modal.querySelector('.modal-body');
    
    // Remover respuesta anterior si existe
    const existingAnswer = modalBody.querySelector('.bg-blue-50');
    if (existingAnswer) {
      existingAnswer.remove();
    }
    
    modalBody.appendChild(answerDiv);
  },

  answerQuestion(isCorrect) {
    if (!GameData.currentQuestion) return;
    
    const currentTeamIndex = GameData.currentTeam - 1;
    const question = GameData.currentQuestion;
    
    if (isCorrect) {
      GameData.teams[currentTeamIndex].score += question.points;
      const { NotificationSystem } = window.BammoozleUtils;
      NotificationSystem.success(`¡Correcto! +${question.points} puntos para ${GameData.teams[currentTeamIndex].name}`);
    }
    
    // Marcar pregunta como contestada
    GameData.answeredQuestions.push(question.id);
    
    // Cambiar turno
    GameData.currentTeam = GameData.currentTeam === 1 ? 2 : 1;
    
    // Actualizar UI
    this.updateUI();
    
    // Marcar tarjeta como usada
    this.markTileAsUsed(question.id);
    
    // Cerrar modal
    const { ModalSystem } = window.BammoozleUI;
    ModalSystem.closeModal();
    
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
    
    NotificationSystem.success(`¡Juego terminado! Ganador: ${winner.name}`);
    
    const content = `
      <div class="text-center">
        <h3 class="text-2xl font-bold mb-4">¡Juego Terminado!</h3>
        <div class="space-y-2 mb-6">
          ${GameData.teams.map(team => `
            <div class="flex justify-between items-center p-2 rounded ${team.id === winner.id ? 'bg-yellow-100' : 'bg-gray-100'}">
              <span class="font-semibold">${team.name}</span>
              <span class="font-bold">${team.score} puntos</span>
            </div>
          `).join('')}
        </div>
        <p class="text-lg font-semibold text-green-600">🏆 Ganador: ${winner.name}</p>
      </div>
    `;
    
    ModalSystem.createModal("Resultados", content, {
      id: "results-modal",
      closeButtonText: "Cerrar"
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
    GameBoard.createGameTiles();
  },

  showTeamEditor() {
    const { ModalSystem } = window.BammoozleUI;
    
    const content = `
      <div class="space-y-4">
        <div>
          <label class="form-label">Nombre del Equipo 1</label>
          <input type="text" id="team1-name-input" class="form-input" value="${GameData.teams[0].name}">
        </div>
        <div>
          <label class="form-label">Nombre del Equipo 2</label>
          <input type="text" id="team2-name-input" class="form-input" value="${GameData.teams[1].name}">
        </div>
        <div class="flex justify-center space-x-4">
          <button class="btn btn-primary" onclick="BammoozleGame.GameController.saveTeamNames()">
            Guardar
          </button>
          <button class="btn btn-secondary" onclick="BammoozleGame.GameController.resetTeamNames()">
            Restaurar
          </button>
        </div>
      </div>
    `;
    
    ModalSystem.createModal("Editar Equipos", content, {
      id: "team-editor-modal",
      closeButtonText: "Cerrar"
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
      
      NotificationSystem.success("Nombres de equipos actualizados");
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
          <p class="font-semibold text-blue-800">Respuesta:</p>
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
    NotificationSystem.success(isCorrect ? "¡YES!" : "keep studying");
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
    NotificationSystem.info("study session restarted");
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
      NotificationSystem.error('La pregunta y respuesta son obligatorias');
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
    NotificationSystem.success('Pregunta guardada correctamente');
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
    if (confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
      GameData.questions = GameData.questions.filter(q => q.id !== questionId);
      this.loadQuestions();
      this.bindQuestionListEvents();
      
      const { NotificationSystem } = window.BammoozleUtils;
      NotificationSystem.success('Pregunta eliminada');
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
      case 'study':
        this.StudyController.init();
        break;
      case 'edit':
        this.EditorController.init();
        break;
      default:
        console.log('Página no reconocida para inicialización del juego');
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