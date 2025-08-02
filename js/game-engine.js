/* ============================================
   GAME ENGINE - MOTOR DE JUEGO COMPLETO
   ============================================ */

const GameEngine = {
  // Estado del juego
  state: {
    currentGame: null,
    isPlaying: false,
    isPaused: false,
    gameMode: null, // 'baamboozle', 'study', 'slideshow'
    currentTeam: 1,
    round: 1,
    questionsAnswered: 0,
    startTime: null,
    endTime: null
  },

  // Datos del juego
  gameData: {
    title: "Verbs followed by gerunds or infinitive (no diff...)",
    gameCode: "1054334",
    instruction: "Say the two possible forms.",
    questions: [
      {
        id: 1,
        question: "I didn't even bother ______ (ask).",
        answer: "I didn't even bother TO ASK / ASKING.",
        points: 15,
        category: "gerund-infinitive",
        isAnswered: false,
        answeredBy: null
      },
      {
        id: 2,
        question: "I hate ______ (do) the dishes!",
        answer: "I hate TO DO / DOING the dishes!",
        points: 15,
        category: "gerund-infinitive",
        isAnswered: false,
        answeredBy: null
      },
      {
        id: 3,
        question: "I prefer ______ (work) in teams.",
        answer: "I prefer TO WORK / WORKING in teams.",
        points: 15,
        category: "gerund-infinitive",
        isAnswered: false,
        answeredBy: null
      },
      {
        id: 4,
        question: "We can't continue ______ (ignore) the Earth's issues.",
        answer: "We can't continue TO IGNORE / IGNORING the Earth's issues.",
        points: 15,
        category: "gerund-infinitive",
        isAnswered: false,
        answeredBy: null
      },
      {
        id: 5,
        question: "Chris likes ______ (go out).",
        answer: "Chris likes TO GO OUT / GOING OUT.",
        points: 15,
        category: "gerund-infinitive",
        isAnswered: false,
        answeredBy: null
      },
      {
        id: 6,
        question: "You need to start ______ (study) harder.",
        answer: "You need to start TO STUDY / STUDYING harder.",
        points: 15,
        category: "gerund-infinitive",
        isAnswered: false,
        answeredBy: null
      },
      {
        id: 7,
        question: "I can't bear ______ (see) homeless people or animals.",
        answer: "I can't bear TO SEE / SEEING homeless people or animals.",
        points: 15,
        category: "gerund-infinitive",
        isAnswered: false,
        answeredBy: null
      },
      {
        id: 8,
        question: "They decided ______ (postpone) the meeting.",
        answer: "They decided TO POSTPONE the meeting.",
        points: 15,
        category: "gerund-infinitive",
        isAnswered: false,
        answeredBy: null
      },
      {
        id: 9,
        question: "She enjoys ______ (read) mystery novels.",
        answer: "She enjoys READING mystery novels.",
        points: 15,
        category: "gerund-infinitive",
        isAnswered: false,
        answeredBy: null
      },
      {
        id: 10,
        question: "We hope ______ (visit) Paris next year.",
        answer: "We hope TO VISIT Paris next year.",
        points: 15,
        category: "gerund-infinitive",
        isAnswered: false,
        answeredBy: null
      }
    ],
    teams: [
      {
        id: 1,
        name: "Team 1",
        score: 0,
        color: "#F0386B", // Rosa
        questionsAnswered: [],
        correctAnswers: 0,
        wrongAnswers: 0
      },
      {
        id: 2,
        name: "Team 2", 
        score: 0,
        color: "#0A91AB", // Azul
        questionsAnswered: [],
        correctAnswers: 0,
        wrongAnswers: 0
      }
    ]
  },

  // Configuración del juego
  config: {
    pointsPerCorrectAnswer: 15,
    pointsPerWrongAnswer: 0,
    enableTimer: false,
    timePerQuestion: 30, // segundos
    maxTeams: 2,
    minTeams: 1,
    autoSave: true,
    autoSaveInterval: 5000 // 5 segundos
  },

  // Callbacks y eventos
  callbacks: {
    onGameStart: [],
    onGameEnd: [],
    onQuestionAnswered: [],
    onTeamScoreChange: [],
    onTurnChange: [],
    onStateChange: []
  },

  // Inicialización
  init() {
    this.loadFromStorage();
    this.setupAutoSave();
    this.bindEvents();
    console.log('🎮 Game Engine initialized');
  },

  // Configurar eventos
  bindEvents() {
    // Escuchar cambios de estado
    document.addEventListener('gameStateChange', (e) => {
      this.handleStateChange(e.detail);
    });

    // Auto-guardar antes de cerrar
    window.addEventListener('beforeunload', () => {
      this.saveToStorage();
    });
  },

  // GESTIÓN DE JUEGO
  
  // Iniciar juego
  startGame(mode = 'baamboozle', options = {}) {
    try {
      // Validar estado
      if (this.state.isPlaying) {
        throw new Error('Game already in progress');
      }

      // Configurar juego
      this.state.currentGame = this.generateGameId();
      this.state.isPlaying = true;
      this.state.isPaused = false;
      this.state.gameMode = mode;
      this.state.currentTeam = 1;
      this.state.round = 1;
      this.state.questionsAnswered = 0;
      this.state.startTime = new Date();
      this.state.endTime = null;

      // Aplicar opciones
      Object.assign(this.config, options);

      // Resetear datos de preguntas
      this.gameData.questions.forEach(q => {
        q.isAnswered = false;
        q.answeredBy = null;
      });

      // Resetear equipos
      this.gameData.teams.forEach(team => {
        team.score = 0;
        team.questionsAnswered = [];
        team.correctAnswers = 0;
        team.wrongAnswers = 0;
      });

      // Disparar callbacks
      this.triggerCallbacks('onGameStart', {
        gameId: this.state.currentGame,
        mode: mode,
        teams: this.gameData.teams.length
      });

      // Actualizar UI
      this.updateUI();
      
      // Guardar estado
      this.saveToStorage();

      console.log(`🎮 Game started: ${mode} mode`);
      return this.state.currentGame;

    } catch (error) {
      console.error('❌ Error starting game:', error);
      return null;
    }
  },

  // Terminar juego
  endGame(reason = 'manual') {
    if (!this.state.isPlaying) return;

    try {
      this.state.isPlaying = false;
      this.state.endTime = new Date();
      
      // Calcular estadísticas
      const stats = this.calculateGameStats();
      
      // Determinar ganador
      const winner = this.determineWinner();

      // Disparar callbacks
      this.triggerCallbacks('onGameEnd', {
        gameId: this.state.currentGame,
        reason,
        winner,
        stats,
        duration: this.state.endTime - this.state.startTime
      });

      // Mostrar resultados
      this.showGameResults(winner, stats);

      // Guardar estado final
      this.saveToStorage();

      console.log(`🏁 Game ended: ${reason}`);
      return { winner, stats };

    } catch (error) {
      console.error('❌ Error ending game:', error);
      return null;
    }
  },

  // Pausar/reanudar juego
  togglePause() {
    if (!this.state.isPlaying) return;

    this.state.isPaused = !this.state.isPaused;
    this.updateUI();
    
    console.log(`⏸️ Game ${this.state.isPaused ? 'paused' : 'resumed'}`);
  },

  // Reiniciar juego
  restartGame() {
    const currentMode = this.state.gameMode;
    this.endGame('restart');
    setTimeout(() => {
      this.startGame(currentMode);
    }, 100);
  },

  // GESTIÓN DE PREGUNTAS

  // Seleccionar pregunta
  selectQuestion(questionId) {
    try {
      if (!this.state.isPlaying) {
        throw new Error('Game not started');
      }

      const question = this.getQuestion(questionId);
      if (!question) {
        throw new Error('Question not found');
      }

      if (question.isAnswered) {
        this.showNotification('Esta pregunta ya fue contestada', 'warning');
        return null;
      }

      // Mostrar pregunta
      this.showQuestion(question);
      
      console.log(`❓ Question selected: ${questionId}`);
      return question;

    } catch (error) {
      console.error('❌ Error selecting question:', error);
      this.showNotification(error.message, 'error');
      return null;
    }
  },

  // Responder pregunta
  answerQuestion(questionId, isCorrect, teamId = null) {
    try {
      const question = this.getQuestion(questionId);
      if (!question) throw new Error('Question not found');

      const team = teamId ? this.getTeam(teamId) : this.getCurrentTeam();
      if (!team) throw new Error('Team not found');

      // Marcar pregunta como respondida
      question.isAnswered = true;
      question.answeredBy = team.id;

      // Actualizar puntuación
      const pointsEarned = isCorrect ? question.points : 0;
      team.score += pointsEarned;
      team.questionsAnswered.push(questionId);

      if (isCorrect) {
        team.correctAnswers++;
      } else {
        team.wrongAnswers++;
      }

      // Actualizar estado
      this.state.questionsAnswered++;

      // Disparar callbacks
      this.triggerCallbacks('onQuestionAnswered', {
        questionId,
        teamId: team.id,
        isCorrect,
        pointsEarned,
        totalScore: team.score
      });

      this.triggerCallbacks('onTeamScoreChange', {
        teamId: team.id,
        newScore: team.score,
        change: pointsEarned
      });

      // Mostrar resultado
      this.showAnswerResult(question, isCorrect, pointsEarned);

      // Cambiar turno si no es modo estudio
      if (this.state.gameMode !== 'study') {
        this.nextTurn();
      }

      // Verificar fin de juego
      if (this.isGameComplete()) {
        setTimeout(() => this.endGame('completed'), 2000);
      }

      // Actualizar UI
      this.updateUI();
      this.saveToStorage();

      console.log(`✅ Question answered: ${questionId} by team ${team.id} (${isCorrect ? 'correct' : 'incorrect'})`);
      return { question, team, pointsEarned };

    } catch (error) {
      console.error('❌ Error answering question:', error);
      this.showNotification(error.message, 'error');
      return null;
    }
  },

  // GESTIÓN DE TURNOS

  // Siguiente turno
  nextTurn() {
    if (this.state.gameMode === 'study') return;

    const teamCount = this.gameData.teams.length;
    this.state.currentTeam = (this.state.currentTeam % teamCount) + 1;

    this.triggerCallbacks('onTurnChange', {
      currentTeam: this.state.currentTeam,
      round: this.state.round
    });

    this.updateUI();
    console.log(`🔄 Turn changed to team ${this.state.currentTeam}`);
  },

  // Equipo anterior
  previousTurn() {
    if (this.state.gameMode === 'study') return;

    const teamCount = this.gameData.teams.length;
    this.state.currentTeam = this.state.currentTeam === 1 ? teamCount : this.state.currentTeam - 1;

    this.triggerCallbacks('onTurnChange', {
      currentTeam: this.state.currentTeam,
      round: this.state.round
    });

    this.updateUI();
  },

  // GESTIÓN DE EQUIPOS

  // Agregar equipo
  addTeam(name, color = null) {
    if (this.gameData.teams.length >= this.config.maxTeams) {
      throw new Error('Maximum teams reached');
    }

    const teamId = this.gameData.teams.length + 1;
    const team = {
      id: teamId,
      name: name || `Team ${teamId}`,
      score: 0,
      color: color || this.getRandomColor(),
      questionsAnswered: [],
      correctAnswers: 0,
      wrongAnswers: 0
    };

    this.gameData.teams.push(team);
    this.updateUI();
    this.saveToStorage();

    console.log(`👥 Team added: ${team.name}`);
    return team;
  },

  // Editar equipo
  editTeam(teamId, updates) {
    const team = this.getTeam(teamId);
    if (!team) throw new Error('Team not found');

    Object.assign(team, updates);
    this.updateUI();
    this.saveToStorage();

    console.log(`✏️ Team edited: ${team.name}`);
    return team;
  },

  // Eliminar equipo
  removeTeam(teamId) {
    const index = this.gameData.teams.findIndex(t => t.id === teamId);
    if (index === -1) throw new Error('Team not found');

    if (this.gameData.teams.length <= this.config.minTeams) {
      throw new Error('Minimum teams required');
    }

    this.gameData.teams.splice(index, 1);
    this.updateUI();
    this.saveToStorage();

    console.log(`❌ Team removed: ${teamId}`);
    return true;
  },

  // MÉTODOS DE UTILIDAD

  // Obtener pregunta por ID
  getQuestion(questionId) {
    return this.gameData.questions.find(q => q.id === questionId);
  },

  // Obtener equipo por ID
  getTeam(teamId) {
    return this.gameData.teams.find(t => t.id === teamId);
  },

  // Obtener equipo actual
  getCurrentTeam() {
    return this.getTeam(this.state.currentTeam);
  },

  // Verificar si el juego está completo
  isGameComplete() {
    return this.gameData.questions.every(q => q.isAnswered);
  },

  // Determinar ganador
  determineWinner() {
    if (!this.isGameComplete()) return null;

    const sortedTeams = [...this.gameData.teams].sort((a, b) => b.score - a.score);
    
    // Verificar empate
    if (sortedTeams.length > 1 && sortedTeams[0].score === sortedTeams[1].score) {
      return {
        type: 'tie',
        teams: sortedTeams.filter(t => t.score === sortedTeams[0].score)
      };
    }

    return {
      type: 'winner',
      team: sortedTeams[0]
    };
  },

  // Calcular estadísticas del juego
  calculateGameStats() {
    const totalQuestions = this.gameData.questions.length;
    const answeredQuestions = this.gameData.questions.filter(q => q.isAnswered).length;
    const totalPoints = this.gameData.teams.reduce((sum, team) => sum + team.score, 0);
    const averageScore = totalPoints / this.gameData.teams.length;

    return {
      totalQuestions,
      answeredQuestions,
      completionRate: (answeredQuestions / totalQuestions) * 100,
      totalPoints,
      averageScore,
      duration: this.state.endTime ? this.state.endTime - this.state.startTime : null,
      teams: this.gameData.teams.map(team => ({
        id: team.id,
        name: team.name,
        score: team.score,
        correctAnswers: team.correctAnswers,
        wrongAnswers: team.wrongAnswers,
        accuracy: team.questionsAnswered.length > 0 ? 
          (team.correctAnswers / team.questionsAnswered.length) * 100 : 0
      }))
    };
  },

  // Generar ID único de juego
  generateGameId() {
    return `game_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Obtener color aleatorio
  getRandomColor() {
    const colors = ['#F0386B', '#0A91AB', '#95DB53', '#FAC663', '#8453DB'];
    return colors[Math.floor(Math.random() * colors.length)];
  },

  // INTERFAZ DE USUARIO

  // Mostrar pregunta
  showQuestion(question) {
    const currentTeam = this.getCurrentTeam();
    
    const content = `
      <div class="question-modal">
        <div class="team-indicator" style="background-color: ${currentTeam.color}">
          <h3>Pregunta para ${currentTeam.name}</h3>
        </div>
        <div class="question-content">
          <p class="question-text">${question.question}</p>
          <div class="question-points">
            <span class="points-badge">${question.points} puntos</span>
          </div>
        </div>
        <div class="question-actions">
          <button class="btn btn-primary btn-lg" onclick="GameEngine.showAnswer(${question.id})">
            🔍 Ver Respuesta
          </button>
        </div>
      </div>
    `;

    window.ModalSystem.create('', content, {
      id: 'question-modal',
      size: 'medium',
      closable: false,
      className: 'question-modal-container'
    });
  },

  // Mostrar respuesta
  showAnswer(questionId) {
    const question = this.getQuestion(questionId);
    if (!question) return;

    window.ModalSystem.close();

    const content = `
      <div class="answer-modal">
        <div class="question-recap">
          <p class="question-text">${question.question}</p>
        </div>
        <div class="answer-content">
          <h4>Respuesta correcta:</h4>
          <p class="answer-text">${question.answer}</p>
        </div>
        <div class="answer-actions">
          <button class="btn btn-success btn-lg" onclick="GameEngine.answerQuestion(${questionId}, true)">
            ✅ Correcto
          </button>
          <button class="btn btn-danger btn-lg" onclick="GameEngine.answerQuestion(${questionId}, false)">
            ❌ Incorrecto
          </button>
        </div>
      </div>
    `;

    window.ModalSystem.create('Respuesta', content, {
      id: 'answer-modal',
      size: 'medium',
      closable: false,
      className: 'answer-modal-container'
    });
  },

  // Mostrar resultado de respuesta
  showAnswerResult(question, isCorrect, pointsEarned) {
    window.ModalSystem.close();

    const currentTeam = this.getCurrentTeam();
    const icon = isCorrect ? '🎉' : '😞';
    const title = isCorrect ? '¡Correcto!' : 'Incorrecto';
    const message = isCorrect ? 
      `${currentTeam.name} gana ${pointsEarned} puntos` : 
      `${currentTeam.name} no gana puntos`;

    const content = `
      <div class="result-modal ${isCorrect ? 'correct' : 'incorrect'}">
        <div class="result-icon">${icon}</div>
        <h2 class="result-title">${title}</h2>
        <p class="result-message">${message}</p>
        <div class="team-score">
          <span style="color: ${currentTeam.color}">
            ${currentTeam.name}: ${currentTeam.score} puntos
          </span>
        </div>
        <button class="btn btn-primary btn-lg" onclick="GameEngine.continueGame()">
          Continuar
        </button>
      </div>
    `;

    window.ModalSystem.create('', content, {
      id: 'result-modal',
      size: 'small',
      closable: false,
      className: 'result-modal-container'
    });
  },

  // Continuar juego (cerrar modal de resultado)
  continueGame() {
    window.ModalSystem.close();
  },

  // Mostrar resultados finales
  showGameResults(winner, stats) {
    let winnerContent = '';
    
    if (winner.type === 'tie') {
      winnerContent = `
        <h2>🤝 ¡Empate!</h2>
        <p>Los siguientes equipos empataron con ${winner.teams[0].score} puntos:</p>
        <ul>
          ${winner.teams.map(team => `<li style="color: ${team.color}">${team.name}</li>`).join('')}
        </ul>
      `;
    } else {
      winnerContent = `
        <h2>🏆 ¡Tenemos un ganador!</h2>
        <div class="winner-team" style="border-color: ${winner.team.color}">
          <h3 style="color: ${winner.team.color}">${winner.team.name}</h3>
          <p class="winner-score">${winner.team.score} puntos</p>
        </div>
      `;
    }

    const content = `
      <div class="game-results">
        ${winnerContent}
        <div class="game-stats">
          <h4>Estadísticas del juego:</h4>
          <div class="stats-grid">
            <div class="stat">
              <span class="stat-label">Preguntas respondidas:</span>
              <span class="stat-value">${stats.answeredQuestions}/${stats.totalQuestions}</span>
            </div>
            <div class="stat">
              <span class="stat-label">Tasa de completitud:</span>
              <span class="stat-value">${stats.completionRate.toFixed(1)}%</span>
            </div>
            ${stats.duration ? `
            <div class="stat">
              <span class="stat-label">Duración:</span>
              <span class="stat-value">${this.formatDuration(stats.duration)}</span>
            </div>
            ` : ''}
          </div>
          <div class="teams-summary">
            ${stats.teams.map(team => `
              <div class="team-summary" style="border-left: 4px solid ${this.getTeam(team.id).color}">
                <strong>${team.name}</strong>: ${team.score} puntos 
                (${team.correctAnswers}✅ ${team.wrongAnswers}❌)
              </div>
            `).join('')}
          </div>
        </div>
        <div class="results-actions">
          <button class="btn btn-primary" onclick="GameEngine.restartGame()">
            🔄 Jugar de nuevo
          </button>
          <button class="btn btn-secondary" onclick="GameEngine.backToMain()">
            🏠 Menú principal
          </button>
        </div>
      </div>
    `;

    window.ModalSystem.create('¡Juego terminado!', content, {
      id: 'final-results-modal',
      size: 'large',
      closable: true,
      className: 'results-modal-container'
    });
  },

  // Volver al menú principal
  backToMain() {
    window.location.href = window.location.pathname.includes('/html/') ? 
      'game-main.html' : 'html/game-main.html';
  },

  // Actualizar interfaz
  updateUI() {
    this.updateScoreboard();
    this.updateGameInfo();
    this.updateGameBoard();
    this.updateCurrentTeamIndicator();
  },

  // Actualizar marcador
  updateScoreboard() {
    this.gameData.teams.forEach((team, index) => {
      const scoreElement = document.getElementById(`team${index + 1}-score`);
      const nameElement = document.getElementById(`team${index + 1}-name`);
      
      if (scoreElement) {
        scoreElement.textContent = this.formatScore(team.score);
      }
      if (nameElement) {
        nameElement.textContent = team.name;
      }
    });
  },

  // Actualizar información del juego
  updateGameInfo() {
    const elements = {
      'game-code': this.gameData.gameCode,
      'game-title': this.gameData.title,
      'game-instruction': this.gameData.instruction
    };

    Object.entries(elements).forEach(([id, value]) => {
      const element = document.getElementById(id);
      if (element) element.textContent = value;
    });
  },

  // Actualizar tablero de juego
  updateGameBoard() {
    this.gameData.questions.forEach(question => {
      const tile = document.querySelector(`[data-tile="${question.id}"]`);
      if (tile) {
        if (question.isAnswered) {
          tile.classList.add('answered');
          tile.style.opacity = '0.5';
          tile.style.pointerEvents = 'none';
        } else {
          tile.classList.remove('answered');
          tile.style.opacity = '1';
          tile.style.pointerEvents = 'auto';
        }
      }
    });
  },

  // Actualizar indicador de equipo actual
  updateCurrentTeamIndicator() {
    const indicator = document.getElementById('current-team');
    if (indicator && this.state.isPlaying) {
      const currentTeam = this.getCurrentTeam();
      indicator.textContent = currentTeam.name;
      indicator.style.color = currentTeam.color;
    }

    // Actualizar contenedores de equipos
    this.gameData.teams.forEach((team, index) => {
      const container = document.getElementById(`team${index + 1}-container`);
      if (container) {
        if (team.id === this.state.currentTeam) {
          container.classList.add('active-team');
          container.style.borderColor = team.color;
        } else {
          container.classList.remove('active-team');
          container.style.borderColor = 'transparent';
        }
      }
    });
  },

  // Formatear puntuación
  formatScore(score) {
    return score === 1 ? '1 punto' : `${score} puntos`;
  },

  // Formatear duración
  formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    if (minutes > 0) {
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
    return `${seconds}s`;
  },

  // PERSISTENCIA DE DATOS

  // Guardar en localStorage
  saveToStorage() {
    if (!this.config.autoSave) return;

    try {
      const gameState = {
        state: this.state,
        gameData: this.gameData,
        config: this.config,
        timestamp: new Date().toISOString()
      };

      localStorage.setItem('bammoozle_game_state', JSON.stringify(gameState));
      console.log('💾 Game state saved');
    } catch (error) {
      console.error('❌ Error saving game state:', error);
    }
  },

  // Cargar desde localStorage
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('bammoozle_game_state');
      if (!saved) return;

      const gameState = JSON.parse(saved);
      
      // Validar datos guardados
      if (gameState.state && gameState.gameData) {
        Object.assign(this.state, gameState.state);
        Object.assign(this.gameData, gameState.gameData);
        Object.assign(this.config, gameState.config || {});
        
        console.log('📁 Game state loaded from storage');
      }
    } catch (error) {
      console.error('❌ Error loading game state:', error);
      localStorage.removeItem('bammoozle_game_state');
    }
  },

  // Limpiar datos guardados
  clearStorage() {
    localStorage.removeItem('bammoozle_game_state');
    console.log('🗑️ Game state cleared from storage');
  },

  // Configurar auto-guardado
  setupAutoSave() {
    if (this.config.autoSave && this.config.autoSaveInterval > 0) {
      setInterval(() => {
        if (this.state.isPlaying) {
          this.saveToStorage();
        }
      }, this.config.autoSaveInterval);
    }
  },

  // SISTEMA DE CALLBACKS

  // Registrar callback
  on(event, callback) {
    if (this.callbacks[event]) {
      this.callbacks[event].push(callback);
    }
  },

  // Eliminar callback
  off(event, callback) {
    if (this.callbacks[event]) {
      const index = this.callbacks[event].indexOf(callback);
      if (index > -1) {
        this.callbacks[event].splice(index, 1);
      }
    }
  },

  // Disparar callbacks
  triggerCallbacks(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`❌ Error in ${event} callback:`, error);
        }
      });
    }

    // Disparar evento del DOM
    document.dispatchEvent(new CustomEvent(event, { detail: data }));
  },

  // Manejar cambio de estado
  handleStateChange(data) {
    this.triggerCallbacks('onStateChange', data);
  },

  // UTILIDADES

  // Mostrar notificación
  showNotification(message, type = 'info') {
    if (window.BammoozleUtils?.NotificationSystem) {
      window.BammoozleUtils.NotificationSystem[type](message);
    } else {
      console.log(`📢 ${type.toUpperCase()}: ${message}`);
    }
  },

  // Mezclar array
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // API pública simplificada
  api: {
    start: (mode, options) => GameEngine.startGame(mode, options),
    end: (reason) => GameEngine.endGame(reason),
    restart: () => GameEngine.restartGame(),
    pause: () => GameEngine.togglePause(),
    selectQuestion: (id) => GameEngine.selectQuestion(id),
    answerQuestion: (id, correct, team) => GameEngine.answerQuestion(id, correct, team),
    addTeam: (name, color) => GameEngine.addTeam(name, color),
    editTeam: (id, updates) => GameEngine.editTeam(id, updates),
    getState: () => ({ ...GameEngine.state }),
    getData: () => ({ ...GameEngine.gameData }),
    isPlaying: () => GameEngine.state.isPlaying
  }
};

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => GameEngine.init());
} else {
  GameEngine.init();
}

// Exportar para uso global
window.GameEngine = GameEngine;
window.Game = GameEngine.api; // API simplificada

console.log('🎮 Game Engine loaded successfully!');