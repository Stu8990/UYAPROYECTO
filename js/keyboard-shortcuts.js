/* ============================================
   KEYBOARD SHORTCUTS SYSTEM - BAMMOOZLE
   Sistema completo de atajos de teclado
   ============================================ */

const KeyboardShortcuts = {
  // Configuración de atajos por página
  shortcuts: {
    // Atajos globales (funcionan en todas las páginas)
    global: {
      'Alt+H': { action: 'showHelp', description: 'Mostrar ayuda de atajos' },
      'Alt+M': { action: 'toggleMobileMenu', description: 'Alternar menú móvil' },
      'Escape': { action: 'closeModal', description: 'Cerrar modal/menú' },
      'Alt+1': { action: 'goToHome', description: 'Ir a página principal' },
      'Alt+ArrowLeft': { action: 'goBack', description: 'Volver atrás' },
      'F1': { action: 'showHelp', description: 'Ayuda' }
    },
    
    // Página principal (index.html)
    landing: {
      'Enter': { action: 'getStarted', description: 'Comenzar' },
      'Alt+S': { action: 'showSignIn', description: 'Iniciar sesión' },
      'Alt+J': { action: 'showJoin', description: 'Registrarse' },
      'Tab': { action: 'focusNext', description: 'Siguiente elemento' },
      'Shift+Tab': { action: 'focusPrevious', description: 'Elemento anterior' }
    },
    
    // Página principal del juego (game-main.html)
    gameMain: {
      'Alt+P': { action: 'playGame', description: 'Jugar' },
      'Alt+S': { action: 'studyMode', description: 'Modo estudio' },
      'Alt+E': { action: 'editGame', description: 'Editar juego' },
      'Alt+R': { action: 'shareGame', description: 'Compartir juego' },
      'Alt+C': { action: 'copyGameCode', description: 'Copiar código del juego' },
      'Space': { action: 'toggleAllAnswers', description: 'Mostrar/ocultar respuestas' },
      'Alt+1': { action: 'selectGameMode1', description: 'Seleccionar Baamboozle' },
      'Alt+2': { action: 'selectGameMode2', description: 'Seleccionar Spud Game' },
      'Alt+3': { action: 'selectGameMode3', description: 'Seleccionar Bowling' },
      'ArrowUp': { action: 'navigateCardsUp', description: 'Navegar tarjetas arriba' },
      'ArrowDown': { action: 'navigateCardsDown', description: 'Navegar tarjetas abajo' },
      'ArrowLeft': { action: 'navigateCardsLeft', description: 'Navegar tarjetas izquierda' },
      'ArrowRight': { action: 'navigateCardsRight', description: 'Navegar tarjetas derecha' },
      'Enter': { action: 'toggleSelectedCard', description: 'Mostrar/ocultar respuesta de tarjeta seleccionada' }
    },
    
    // Tablero de juego (game-board.html)
    gameBoard: {
      'Alt+R': { action: 'restartGame', description: 'Reiniciar juego' },
      'Alt+B': { action: 'backToSetup', description: 'Volver a configuración' },
      'Alt+T': { action: 'editTeams', description: 'Editar equipos' },
      'Alt+Q': { action: 'quitGame', description: 'Salir del juego' },
      'Alt+Digit1': { action: 'selectTile1', description: 'Seleccionar casilla 1' },
      'Alt+Digit2': { action: 'selectTile2', description: 'Seleccionar casilla 2' },
      'Alt+Digit3': { action: 'selectTile3', description: 'Seleccionar casilla 3' },
      'Alt+Digit4': { action: 'selectTile4', description: 'Seleccionar casilla 4' },
      'Alt+Digit5': { action: 'selectTile5', description: 'Seleccionar casilla 5' },
      'Alt+Digit6': { action: 'selectTile6', description: 'Seleccionar casilla 6' },
      'Alt+Digit7': { action: 'selectTile7', description: 'Seleccionar casilla 7' },
      'Alt+Digit8': { action: 'selectTile8', description: 'Seleccionar casilla 8' },
      'Alt+Digit9': { action: 'selectTile9', description: 'Seleccionar casilla 9' },
      'Alt+Digit0': { action: 'selectTile10', description: 'Seleccionar casilla 10' },
      'Space': { action: 'checkAnswer', description: 'Verificar respuesta' },
      'Y': { action: 'answerYes', description: 'Respuesta correcta' },
      'N': { action: 'answerNo', description: 'Respuesta incorrecta' },
      'Enter': { action: 'closeResultModal', description: 'Cerrar resultado' }
    },
    
    // Modo estudio (study.html)
    study: {
      'Alt+R': { action: 'restartStudy', description: 'Reiniciar estudio' },
      'Alt+B': { action: 'backToGame', description: 'Volver al juego' },
      'Space': { action: 'showAnswer', description: 'Mostrar respuesta' },
      'ArrowUp': { action: 'navigateStudyUp', description: 'Tarjeta anterior' },
      'ArrowDown': { action: 'navigateStudyDown', description: 'Siguiente tarjeta' },
      'ArrowLeft': { action: 'navigateStudyLeft', description: 'Tarjeta izquierda' },
      'ArrowRight': { action: 'navigateStudyRight', description: 'Tarjeta derecha' },
      'Enter': { action: 'showSelectedAnswer', description: 'Ver respuesta de tarjeta seleccionada' },
      'C': { action: 'markCorrect', description: 'Marcar como correcto' },
      'I': { action: 'markIncorrect', description: 'Marcar como incorrecto' },
      'Alt+P': { action: 'showProgress', description: 'Mostrar progreso' }
    },
    
    // Editor (edit.html)
    edit: {
      'Alt+S': { action: 'saveQuestion', description: 'Guardar pregunta' },
      'Alt+C': { action: 'clearForm', description: 'Limpiar formulario' },
      'Alt+N': { action: 'newQuestion', description: 'Nueva pregunta' },
      'Alt+D': { action: 'deleteSelected', description: 'Eliminar pregunta seleccionada' },
      'Alt+B': { action: 'backToGame', description: 'Volver al juego' },
      'Alt+I': { action: 'importQuestions', description: 'Importar preguntas' },
      'F2': { action: 'editSelected', description: 'Editar pregunta seleccionada' },
      'Delete': { action: 'deleteSelected', description: 'Eliminar pregunta seleccionada' },
      'ArrowUp': { action: 'navigateQuestionsUp', description: 'Pregunta anterior' },
      'ArrowDown': { action: 'navigateQuestionsDown', description: 'Siguiente pregunta' },
      'Tab': { action: 'focusNextField', description: 'Siguiente campo' },
      'Shift+Tab': { action: 'focusPreviousField', description: 'Campo anterior' }
    }
  },
  
  // Estado actual
  currentPage: 'landing',
  selectedElement: null,
  selectedIndex: 0,
  isModalOpen: false,
  debugMode: false,
  
  // Inicialización
  init() {
    this.currentPage = this.detectCurrentPage();
    this.normalizeShortcuts();
    this.bindGlobalEvents();
    this.setupFocusManagement();
    this.createHelpOverlay();
    
    console.log(`🎮 Keyboard Shortcuts initialized for page: ${this.currentPage}`);
    
    if (this.debugMode) {
      console.log('🔤 Case-insensitive shortcuts enabled');
      console.log('💡 Both Y/y and N/n work for answers');
      console.log('💡 Both C/c and I/i work for study mode');
    }
  },
  
  // Detectar página actual
  detectCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('game-main') || path.includes('paginaPrincipal')) return 'gameMain';
    if (path.includes('game-board') || path.includes('gameboard')) return 'gameBoard';
    if (path.includes('study')) return 'study';
    if (path.includes('edit')) return 'edit';
    if (path.includes('index') || path === '/') return 'landing';
    return 'landing';
  },
  
  // Normalizar atajos para soporte case-insensitive
  normalizeShortcuts() {
    Object.keys(this.shortcuts).forEach(pageKey => {
      const page = this.shortcuts[pageKey];
      const newShortcuts = {};
      
      Object.keys(page).forEach(shortcut => {
        const action = page[shortcut];
        
        // Si es una letra sola (sin modificadores), crear versión minúscula
        if (shortcut.length === 1 && shortcut.match(/[A-Z]/)) {
          const lowerCase = shortcut.toLowerCase();
          
          // Solo agregar si no existe ya
          if (!page[lowerCase]) {
            newShortcuts[lowerCase] = {
              action: action.action,
              description: action.description
            };
          }
        }
      });
      
      // Agregar los nuevos atajos
      Object.assign(page, newShortcuts);
    });
    
    if (this.debugMode) {
      console.log('🔄 Shortcuts normalized for case-insensitive support');
    }
  },
  
  // Configurar eventos globales
  bindGlobalEvents() {
    document.addEventListener('keydown', (e) => {
      this.handleKeyDown(e);
    });
    
    document.addEventListener('keyup', (e) => {
      this.handleKeyUp(e);
    });
    
    // Detectar modales abiertos
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          this.isModalOpen = document.querySelector('.modal-backdrop:not(.hidden)') !== null;
        }
      });
    });
    
    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  },
  
  // Manejar teclas presionadas
  handleKeyDown(e) {
    const key = this.getKeyString(e);
    
    if (this.debugMode) {
      console.log(`🔑 Key detected: "${key}"`);
    }
    
    // Prevenir atajos en campos de texto (excepto algunos especiales)
    if (this.isInTextInput(e.target) && !this.isSpecialTextShortcut(key)) {
      return;
    }
    
    // Buscar en atajos globales primero
    const globalShortcut = this.shortcuts.global[key];
    if (globalShortcut) {
      if (this.debugMode) {
        console.log(`🌐 Global shortcut found: ${key} -> ${globalShortcut.action}`);
      }
      this.executeAction(globalShortcut.action, e);
      return;
    }
    
    // Buscar en atajos específicos de la página
    const pageShortcuts = this.shortcuts[this.currentPage];
    if (pageShortcuts && pageShortcuts[key]) {
      if (this.debugMode) {
        console.log(`📄 Page shortcut found: ${key} -> ${pageShortcuts[key].action}`);
      }
      this.executeAction(pageShortcuts[key].action, e);
      return;
    }
    
    // Fallback: Buscar versión alternativa de la tecla
    if (this.tryAlternativeKey(key, e)) {
      return;
    }
    
    // Atajos especiales para formularios
    if (this.isInForm(e.target)) {
      this.handleFormShortcuts(e);
    }
  },
  
  // Manejar teclas soltadas
  handleKeyUp(e) {
    // Aquí puedes añadir lógica para teclas soltadas si es necesario
  },
  
  // Obtener string de la tecla
  getKeyString(e) {
    const modifiers = [];
    if (e.ctrlKey) modifiers.push('Ctrl');
    if (e.altKey) modifiers.push('Alt');
    if (e.shiftKey) modifiers.push('Shift');
    if (e.metaKey) modifiers.push('Meta');
    
    let key = e.key;
    
    // Normalizar teclas especiales
    if (key === ' ') key = 'Space';
    if (key === 'ArrowUp') key = 'ArrowUp';
    if (key === 'ArrowDown') key = 'ArrowDown';
    if (key === 'ArrowLeft') key = 'ArrowLeft';
    if (key === 'ArrowRight') key = 'ArrowRight';
    if (key >= '0' && key <= '9') key = `Digit${key}`;
    
    // Convertir letras a mayúsculas para consistencia
    if (key.length === 1 && key.match(/[a-zA-Z]/)) {
      key = key.toUpperCase();
    }
    
    const keyString = modifiers.length > 0 ? `${modifiers.join('+')}+${key}` : key;
    
    if (this.debugMode) {
      console.log(`🔑 Key pressed: "${e.key}" -> normalized: "${keyString}"`);
    }
    
    return keyString;
  },
  
  // Verificar si está en input de texto
  isInTextInput(element) {
    const textInputs = ['input', 'textarea', 'select'];
    const inputTypes = ['text', 'email', 'password', 'search', 'url', 'tel'];
    
    if (textInputs.includes(element.tagName.toLowerCase())) {
      if (element.tagName.toLowerCase() === 'input') {
        return !element.type || inputTypes.includes(element.type.toLowerCase());
      }
      return true;
    }
    
    return element.contentEditable === 'true';
  },
  
  // Verificar si es atajo especial en texto
  isSpecialTextShortcut(key) {
    const specialShortcuts = [
      'Alt+S', 'Alt+C', 'Alt+N', 'Alt+H', 'Escape',
      'Alt+ArrowLeft', 'F1', 'F2', 'Tab', 'Shift+Tab'
    ];
    
    return specialShortcuts.includes(key);
  },
  
  // Intentar clave alternativa
  tryAlternativeKey(key, e) {
    if (key.length === 1 && key.match(/[a-zA-Z]/)) {
      const alternativeKey = key === key.toUpperCase() ? key.toLowerCase() : key.toUpperCase();
      
      // Buscar en atajos globales
      const globalShortcut = this.shortcuts.global[alternativeKey];
      if (globalShortcut) {
        if (this.debugMode) {
          console.log(`🔄 Alternative global shortcut: ${alternativeKey} -> ${globalShortcut.action}`);
        }
        this.executeAction(globalShortcut.action, e);
        return true;
      }
      
      // Buscar en atajos de página
      const pageShortcuts = this.shortcuts[this.currentPage];
      if (pageShortcuts && pageShortcuts[alternativeKey]) {
        if (this.debugMode) {
          console.log(`🔄 Alternative page shortcut: ${alternativeKey} -> ${pageShortcuts[alternativeKey].action}`);
        }
        this.executeAction(pageShortcuts[alternativeKey].action, e);
        return true;
      }
    }
    
    return false;
  },
  
  // Ejecutar acción
  executeAction(action, e) {
    e.preventDefault();
    e.stopPropagation();
    
    console.log(`🎯 Executing action: ${action}`);
    
    switch (action) {
      // Acciones globales
      case 'showHelp':
        this.showHelpOverlay();
        break;
      case 'toggleMobileMenu':
        this.toggleMobileMenu();
        break;
      case 'closeModal':
        this.closeModal();
        break;
      case 'goToHome':
        window.location.href = '../index.html';
        break;
      case 'goBack':
        history.back();
        break;
        
      // Acciones de landing page
      case 'getStarted':
        this.executeGetStarted();
        break;
      case 'showSignIn':
        this.executeShowSignIn();
        break;
      case 'showJoin':
        this.executeShowJoin();
        break;
        
      // Acciones de game-main
      case 'playGame':
        this.executePlayGame();
        break;
      case 'studyMode':
        this.executeStudyMode();
        break;
      case 'editGame':
        this.executeEditGame();
        break;
      case 'shareGame':
        this.executeShareGame();
        break;
      case 'copyGameCode':
        this.executeCopyGameCode();
        break;
      case 'toggleAllAnswers':
        this.executeToggleAllAnswers();
        break;
      case 'selectGameMode1':
        this.executeSelectGameMode(1);
        break;
      case 'selectGameMode2':
        this.executeSelectGameMode(2);
        break;
      case 'selectGameMode3':
        this.executeSelectGameMode(3);
        break;
      case 'navigateCardsUp':
      case 'navigateCardsDown':
      case 'navigateCardsLeft':
      case 'navigateCardsRight':
        this.executeNavigateCards(action);
        break;
      case 'toggleSelectedCard':
        this.executeToggleSelectedCard();
        break;
        
      // Acciones de game-board
      case 'restartGame':
        this.executeRestartGame();
        break;
      case 'backToSetup':
        this.executeBackToSetup();
        break;
      case 'editTeams':
        this.executeEditTeams();
        break;
      case 'quitGame':
        this.executeQuitGame();
        break;
      case 'selectTile1':
      case 'selectTile2':
      case 'selectTile3':
      case 'selectTile4':
      case 'selectTile5':
      case 'selectTile6':
      case 'selectTile7':
      case 'selectTile8':
      case 'selectTile9':
      case 'selectTile10':
        this.executeSelectTile(action);
        break;
      case 'checkAnswer':
        this.executeCheckAnswer();
        break;
      case 'answerYes':
        this.executeAnswerYes();
        break;
      case 'answerNo':
        this.executeAnswerNo();
        break;
      case 'closeResultModal':
        this.executeCloseResultModal();
        break;
        
      // Acciones de study
      case 'restartStudy':
        this.executeRestartStudy();
        break;
      case 'backToGame':
        this.executeBackToGame();
        break;
      case 'showAnswer':
        this.executeShowAnswer();
        break;
      case 'navigateStudyUp':
      case 'navigateStudyDown':
      case 'navigateStudyLeft':
      case 'navigateStudyRight':
        this.executeNavigateStudy(action);
        break;
      case 'showSelectedAnswer':
        this.executeShowSelectedAnswer();
        break;
      case 'markCorrect':
        this.executeMarkCorrect();
        break;
      case 'markIncorrect':
        this.executeMarkIncorrect();
        break;
      case 'showProgress':
        this.executeShowProgress();
        break;
        
      // Acciones de edit
      case 'saveQuestion':
        this.executeSaveQuestion();
        break;
      case 'clearForm':
        this.executeClearForm();
        break;
      case 'newQuestion':
        this.executeNewQuestion();
        break;
      case 'deleteSelected':
        this.executeDeleteSelected();
        break;
      case 'importQuestions':
        this.executeImportQuestions();
        break;
      case 'editSelected':
        this.executeEditSelected();
        break;
      case 'navigateQuestionsUp':
      case 'navigateQuestionsDown':
        this.executeNavigateQuestions(action);
        break;
        
      default:
        console.log(`⚠️ Unknown action: ${action}`);
    }
  },
  
  // Implementaciones de acciones específicas
  executeGetStarted() {
    const btn = document.getElementById('get-started-btn');
    if (btn) btn.click();
  },
  
  executeShowSignIn() {
    const btn = document.getElementById('header-signin-btn');
    if (btn) btn.click();
  },
  
  executeShowJoin() {
    const btn = document.getElementById('header-join-btn');
    if (btn) btn.click();
  },
  
  executePlayGame() {
    const btn = document.getElementById('play-button');
    if (btn) btn.click();
  },
  
  executeStudyMode() {
    const btn = document.querySelector('button[onclick*="study.html"]');
    if (btn) btn.click();
  },
  
  executeEditGame() {
    const btn = document.querySelector('button[onclick*="edit.html"]');
    if (btn) btn.click();
  },
  
  executeShareGame() {
    const btn = document.getElementById('share-button');
    if (btn) btn.click();
  },
  
  executeCopyGameCode() {
    const codeElement = document.getElementById('game-code');
    if (codeElement) {
      navigator.clipboard.writeText(codeElement.textContent);
      this.showNotification('Código copiado al portapapeles');
    }
  },
  
  executeToggleAllAnswers() {
    const showBtn = document.querySelector('.btn.bg-black\\/20');
    const hideBtn = document.querySelector('.btn.bg-black\\/40');
    
    const visibleAnswers = document.querySelectorAll('.answer-text:not(.hidden)');
    
    if (visibleAnswers.length > 0) {
      if (hideBtn) hideBtn.click();
    } else {
      if (showBtn) showBtn.click();
    }
  },
  
  executeSelectGameMode(mode) {
    const modal = document.getElementById('play-modal');
    if (modal && !modal.classList.contains('hidden')) {
      const gameCards = modal.querySelectorAll('.card');
      if (gameCards[mode - 1]) {
        gameCards[mode - 1].click();
      }
    }
  },
  
  executeNavigateCards(direction) {
    const cards = document.querySelectorAll('.preview-card, .study-card');
    if (cards.length === 0) return;
    
    let newIndex = this.selectedIndex;
    
    switch (direction) {
      case 'navigateCardsUp':
        newIndex = Math.max(0, this.selectedIndex - 2);
        break;
      case 'navigateCardsDown':
        newIndex = Math.min(cards.length - 1, this.selectedIndex + 2);
        break;
      case 'navigateCardsLeft':
        newIndex = Math.max(0, this.selectedIndex - 1);
        break;
      case 'navigateCardsRight':
        newIndex = Math.min(cards.length - 1, this.selectedIndex + 1);
        break;
    }
    
    this.selectCard(cards[newIndex], newIndex);
  },
  
  executeToggleSelectedCard() {
    const cards = document.querySelectorAll('.preview-card, .study-card');
    if (cards[this.selectedIndex]) {
      const toggleBtn = cards[this.selectedIndex].querySelector('.toggle-answer-btn');
      if (toggleBtn) toggleBtn.click();
    }
  },
  
  executeRestartGame() {
    const btn = document.getElementById('restart-button');
    if (btn) btn.click();
  },
  
  executeBackToSetup() {
    const btn = document.querySelector('button[onclick*="game-main.html"]');
    if (btn) btn.click();
  },
  
  executeEditTeams() {
    const btn = document.querySelector('[aria-label="edit teams"]');
    if (btn) btn.click();
  },
  
  executeQuitGame() {
    const btn = document.querySelector('button[onclick*="game-main.html"]');
    if (btn) btn.click();
  },
  
  executeSelectTile(action) {
    const tileNumber = action.replace('selectTile', '');
    const tile = document.querySelector(`[data-tile="${tileNumber}"]`);
    if (tile && !tile.classList.contains('is-flipped')) {
      tile.click();
    }
  },
  
  executeCheckAnswer() {
    const checkBtn = document.querySelector('button[onclick*="showAnswer"]');
    if (checkBtn) checkBtn.click();
  },
  
  executeAnswerYes() {
    const yesBtn = document.querySelector('button[onclick*="answerQuestion(true)"]');
    if (yesBtn) yesBtn.click();
  },
  
  executeAnswerNo() {
    const noBtn = document.querySelector('button[onclick*="answerQuestion(false)"]');
    if (noBtn) noBtn.click();
  },
  
  executeCloseResultModal() {
    const closeBtn = document.querySelector('button[onclick*="closeResultModal"]');
    if (closeBtn) closeBtn.click();
  },
  
  executeRestartStudy() {
    const btn = document.getElementById('restart-button');
    if (btn) btn.click();
  },
  
  executeBackToGame() {
    const btn = document.querySelector('button[onclick*="game-main.html"]');
    if (btn) btn.click();
  },
  
  executeShowAnswer() {
    const magnifyingGlass = document.querySelector('.study-answer-btn');
    if (magnifyingGlass) magnifyingGlass.click();
  },
  
  executeNavigateStudy(direction) {
    const cards = document.querySelectorAll('.study-card');
    if (cards.length === 0) return;
    
    let newIndex = this.selectedIndex;
    
    switch (direction) {
      case 'navigateStudyUp':
        newIndex = Math.max(0, this.selectedIndex - 2);
        break;
      case 'navigateStudyDown':
        newIndex = Math.min(cards.length - 1, this.selectedIndex + 2);
        break;
      case 'navigateStudyLeft':
        newIndex = Math.max(0, this.selectedIndex - 1);
        break;
      case 'navigateStudyRight':
        newIndex = Math.min(cards.length - 1, this.selectedIndex + 1);
        break;
    }
    
    this.selectCard(cards[newIndex], newIndex);
  },
  
  executeShowSelectedAnswer() {
    const cards = document.querySelectorAll('.study-card');
    if (cards[this.selectedIndex]) {
      const magnifyingGlass = cards[this.selectedIndex].querySelector('.study-answer-btn');
      if (magnifyingGlass) magnifyingGlass.click();
    }
  },
  
  executeMarkCorrect() {
    const correctBtn = document.querySelector('button[onclick*="markAnswer"][onclick*="true"]');
    if (correctBtn) correctBtn.click();
  },
  
  executeMarkIncorrect() {
    const incorrectBtn = document.querySelector('button[onclick*="markAnswer"][onclick*="false"]');
    if (incorrectBtn) incorrectBtn.click();
  },
  
  executeShowProgress() {
    const progressCard = document.querySelector('.card');
    if (progressCard) {
      progressCard.scrollIntoView({ behavior: 'smooth' });
    }
  },
  
  executeSaveQuestion() {
    const form = document.getElementById('edit-form');
    if (form) {
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.click();
    }
  },
  
  executeClearForm() {
    const clearBtn = document.querySelector('button[onclick*="reset"]');
    if (clearBtn) clearBtn.click();
  },
  
  executeNewQuestion() {
    const form = document.getElementById('edit-form');
    if (form) {
      form.reset();
      const questionInput = document.getElementById('question');
      if (questionInput) questionInput.focus();
    }
  },
  
  executeDeleteSelected() {
    const selectedQuestion = document.querySelector('.question-item.selected');
    if (selectedQuestion) {
      const deleteBtn = selectedQuestion.querySelector('[data-action="delete"]');
      if (deleteBtn) deleteBtn.click();
    }
  },
  
  executeImportQuestions() {
    const importBtn = document.querySelector('button:contains("Import")');
    if (importBtn) importBtn.click();
  },
  
  executeEditSelected() {
    const selectedQuestion = document.querySelector('.question-item.selected');
    if (selectedQuestion) {
      const editBtn = selectedQuestion.querySelector('[data-action="edit"]');
      if (editBtn) editBtn.click();
    }
  },
  
  executeNavigateQuestions(direction) {
    const questions = document.querySelectorAll('#questions-list .card');
    if (questions.length === 0) return;
    
    let newIndex = this.selectedIndex;
    
    if (direction === 'navigateQuestionsUp') {
      newIndex = Math.max(0, this.selectedIndex - 1);
    } else if (direction === 'navigateQuestionsDown') {
      newIndex = Math.min(questions.length - 1, this.selectedIndex + 1);
    }
    
    this.selectQuestion(questions[newIndex], newIndex);
  },
  
  // Utilidades
  selectCard(card, index) {
    // Remover selección anterior
    const prevSelected = document.querySelector('.card.selected');
    if (prevSelected) {
      prevSelected.classList.remove('selected');
    }
    
    // Añadir selección nueva
    card.classList.add('selected');
    this.selectedIndex = index;
    this.selectedElement = card;
    
    // Scroll suave al elemento
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },
  
  selectQuestion(question, index) {
    // Remover selección anterior
    const prevSelected = document.querySelector('.question-item.selected');
    if (prevSelected) {
      prevSelected.classList.remove('selected');
    }
    
    // Añadir selección nueva
    question.classList.add('selected', 'question-item');
    this.selectedIndex = index;
    this.selectedElement = question;
    
    // Scroll suave al elemento
    question.scrollIntoView({ behavior: 'smooth', block: 'center' });
  },
  
  toggleMobileMenu() {
    const hamburger = document.getElementById('hamburger-btn');
    if (hamburger) hamburger.click();
  },
  
  closeModal() {
    // Intentar cerrar cualquier modal abierto
    if (window.closeModal) {
      window.closeModal();
    } else if (window.BammoozleUI?.ModalSystem) {
      window.BammoozleUI.ModalSystem.closeModal();
    }
    
    // Cerrar menú móvil si está abierto
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      const closeBtn = document.getElementById('close-menu-btn');
      if (closeBtn) closeBtn.click();
    }
  },
  
  isInForm(element) {
    return element.closest('form') !== null;
  },
  
  handleFormShortcuts(e) {
    const form = e.target.closest('form');
    if (!form) return;
    
    const key = this.getKeyString(e);
    
    if (key === 'Alt+S' && form.id === 'edit-form') {
      e.preventDefault();
      this.executeSaveQuestion();
    } else if (key === 'Alt+C' && form.id === 'edit-form') {
      e.preventDefault();
      this.executeClearForm();
    }
  },
  
  setupFocusManagement() {
    // Añadir estilos para elementos seleccionados
    const style = document.createElement('style');
    style.textContent = `
      .card.selected {
        border: 3px solid #8453DB !important;
        box-shadow: 0 0 0 3px rgba(132, 83, 219, 0.3) !important;
        transform: translateY(-2px);
      }
      
      .question-item.selected {
        border: 3px solid #8453DB !important;
        box-shadow: 0 0 0 3px rgba(132, 83, 219, 0.3) !important;
        background-color: rgba(132, 83, 219, 0.1) !important;
      }
      
      .keyboard-help-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }
      
      .keyboard-help-overlay.show {
        opacity: 1;
        visibility: visible;
      }
      
      .keyboard-help-content {
        background: white;
        border-radius: 12px;
        padding: 2rem;
        max-width: 90%;
        max-height: 90%;
        overflow-y: auto;
        color: #333;
      }
      
      .keyboard-shortcut-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 0;
        border-bottom: 1px solid #eee;
      }
      
      .keyboard-shortcut-key {
        background: #f5f5f5;
        padding: 0.25rem 0.5rem;
        border-radius: 4px;
        font-family: monospace;
        font-weight: bold;
        border: 1px solid #ddd;
      }
      
      .keyboard-shortcut-description {
        color: #666;
        margin-left: 1rem;
      }
      
      .keyboard-help-section {
        margin-bottom: 1.5rem;
      }
      
      .keyboard-help-section h3 {
        color: #8453DB;
        margin-bottom: 0.5rem;
        font-size: 1.2rem;
        font-weight: bold;
      }
      
      .keyboard-notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #8453DB;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1001;
        transform: translateY(100px);
        opacity: 0;
        transition: all 0.3s ease;
      }
      
      .keyboard-notification.show {
        transform: translateY(0);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  },
  
  createHelpOverlay() {
    const overlay = document.createElement('div');
    overlay.id = 'keyboard-help-overlay';
    overlay.className = 'keyboard-help-overlay';
    
    overlay.innerHTML = `
      <div class="keyboard-help-content">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h2 style="margin: 0; color: #8453DB; font-size: 1.5rem;">Atajos de Teclado</h2>
          <button id="close-help-overlay" style="background: none; border: none; font-size: 1.5rem; cursor: pointer;">&times;</button>
        </div>
        <div id="keyboard-help-shortcuts"></div>
      </div>
    `;
    
    document.body.appendChild(overlay);
    
    // Cerrar overlay
    document.getElementById('close-help-overlay').addEventListener('click', () => {
      this.hideHelpOverlay();
    });
    
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        this.hideHelpOverlay();
      }
    });
  },
  
  showHelpOverlay() {
    const overlay = document.getElementById('keyboard-help-overlay');
    const content = document.getElementById('keyboard-help-shortcuts');
    
    if (!overlay || !content) return;
    
    // Generar contenido de ayuda
    content.innerHTML = this.generateHelpContent();
    
    overlay.classList.add('show');
  },
  
  hideHelpOverlay() {
    const overlay = document.getElementById('keyboard-help-overlay');
    if (overlay) {
      overlay.classList.remove('show');
    }
  },
  
  generateHelpContent() {
    let html = '';
    
    // Atajos globales
    html += this.generateHelpSection('Atajos Globales', this.shortcuts.global);
    
    // Atajos específicos de la página actual
    const currentPageShortcuts = this.shortcuts[this.currentPage];
    if (currentPageShortcuts) {
      const pageNames = {
        landing: 'Página Principal',
        gameMain: 'Juego Principal',
        gameBoard: 'Tablero de Juego',
        study: 'Modo Estudio',
        edit: 'Editor de Preguntas'
      };
      
      html += this.generateHelpSection(pageNames[this.currentPage] || 'Página Actual', currentPageShortcuts);
    }
    
    // Consejos adicionales
    html += `
      <div class="keyboard-help-section">
        <h3>💡 Consejos</h3>
        <ul style="margin: 0; padding-left: 1.5rem; color: #666;">
          <li>Usa <strong>Tab</strong> y <strong>Shift+Tab</strong> para navegar entre elementos</li>
          <li>Presiona <strong>Enter</strong> para activar el elemento seleccionado</li>
          <li>Usa las flechas del teclado para navegar entre tarjetas</li>
          <li>Los atajos con <strong>Alt</strong> funcionan en toda la aplicación</li>
          <li>Presiona <strong>Escape</strong> para cerrar modales o menús</li>
          <li><strong>🔤 Case-insensitive:</strong> Y/y, N/n, C/c, I/i funcionan igual</li>
        </ul>
      </div>
    `;
    
    return html;
  },
  
  generateHelpSection(title, shortcuts) {
    let html = `<div class="keyboard-help-section"><h3>${title}</h3>`;
    
    // Filtrar duplicados case-insensitive para mostrar solo uno
    const uniqueShortcuts = {};
    Object.entries(shortcuts).forEach(([key, shortcut]) => {
      const upperKey = key.toUpperCase();
      if (!uniqueShortcuts[upperKey]) {
        uniqueShortcuts[upperKey] = { key, shortcut };
      }
    });
    
    Object.values(uniqueShortcuts).forEach(({ key, shortcut }) => {
      html += `
        <div class="keyboard-shortcut-item">
          <span class="keyboard-shortcut-key">${key}</span>
          <span class="keyboard-shortcut-description">${shortcut.description}</span>
        </div>
      `;
    });
    
    html += '</div>';
    return html;
  },
  
  showNotification(message, duration = 3000) {
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = 'keyboard-notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Mostrar
    setTimeout(() => {
      notification.classList.add('show');
    }, 100);
    
    // Ocultar y eliminar
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (document.body.contains(notification)) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, duration);
  },
  
  // Métodos públicos para integración
  registerCustomShortcut(page, key, action, description) {
    if (!this.shortcuts[page]) {
      this.shortcuts[page] = {};
    }
    
    // Normalizar la clave
    const normalizedKey = this.normalizeKey(key);
    
    this.shortcuts[page][normalizedKey] = {
      action: action,
      description: description
    };
    
    // Si es una letra sola, crear versión alternativa
    if (normalizedKey.length === 1 && normalizedKey.match(/[A-Z]/)) {
      const lowerCase = normalizedKey.toLowerCase();
      this.shortcuts[page][lowerCase] = {
        action: action,
        description: description
      };
    } else if (normalizedKey.length === 1 && normalizedKey.match(/[a-z]/)) {
      const upperCase = normalizedKey.toUpperCase();
      this.shortcuts[page][upperCase] = {
        action: action,
        description: description
      };
    }
    
    console.log(`✅ Registered custom shortcut: ${normalizedKey} -> ${action} for ${page}`);
  },
  
  // Normalizar clave para registro
  normalizeKey(key) {
    // Si es una letra sola, convertir a mayúscula por defecto
    if (key.length === 1 && key.match(/[a-zA-Z]/)) {
      return key.toUpperCase();
    }
    return key;
  },
  
  unregisterShortcut(page, key) {
    if (this.shortcuts[page] && this.shortcuts[page][key]) {
      delete this.shortcuts[page][key];
      
      // También eliminar versión alternativa si existe
      const alternativeKey = key.length === 1 && key.match(/[a-zA-Z]/) 
        ? (key === key.toUpperCase() ? key.toLowerCase() : key.toUpperCase())
        : null;
        
      if (alternativeKey && this.shortcuts[page][alternativeKey]) {
        delete this.shortcuts[page][alternativeKey];
      }
      
      console.log(`🗑️ Unregistered shortcut: ${key} from ${page}`);
    }
  },
  
  // Método para activar/desactivar debug
  toggleDebugMode() {
    this.debugMode = !this.debugMode;
    console.log(`🔧 Debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
    
    if (this.debugMode) {
      console.log('🔤 Case-insensitive shortcuts enabled');
      console.log('💡 Press any key to see normalization process');
      console.log('💡 Available shortcuts for current page:', Object.keys(this.shortcuts[this.currentPage] || {}));
    }
    
    this.showNotification(`Debug mode ${this.debugMode ? 'activado' : 'desactivado'}`);
  },
  
  // Método para mostrar todos los atajos disponibles
  listAvailableShortcuts() {
    console.log('📝 Available shortcuts for current page:');
    console.log('🌐 Global shortcuts:', Object.keys(this.shortcuts.global));
    
    const pageShortcuts = this.shortcuts[this.currentPage];
    if (pageShortcuts) {
      console.log(`📄 ${this.currentPage} shortcuts:`, Object.keys(pageShortcuts));
    }
    
    // Mostrar atajos case-insensitive
    const caseInsensitiveShortcuts = [];
    Object.keys(pageShortcuts || {}).forEach(key => {
      if (key.length === 1 && key.match(/[a-zA-Z]/)) {
        caseInsensitiveShortcuts.push(key);
      }
    });
    
    if (caseInsensitiveShortcuts.length > 0) {
      console.log('🔤 Case-insensitive shortcuts:', caseInsensitiveShortcuts);
    }
  },
  
  // Método para obtener información sobre atajos
  getShortcutsInfo() {
    const globalShortcuts = Object.keys(this.shortcuts.global);
    const pageShortcuts = Object.keys(this.shortcuts[this.currentPage] || {});
    
    // Identificar atajos case-insensitive
    const caseInsensitiveShortcuts = pageShortcuts.filter(key => 
      key.length === 1 && key.match(/[a-zA-Z]/)
    );
    
    return {
      currentPage: this.currentPage,
      debugMode: this.debugMode,
      totalShortcuts: globalShortcuts.length + pageShortcuts.length,
      availableShortcuts: {
        global: globalShortcuts,
        page: pageShortcuts,
        caseInsensitive: caseInsensitiveShortcuts
      }
    };
  },
  
  // Método para validar funcionamiento
  testShortcut(key) {
    console.log(`🧪 Testing shortcut: "${key}"`);
    
    // Simular evento
    const mockEvent = {
      key: key,
      altKey: key.includes('Alt+'),
      ctrlKey: key.includes('Ctrl+'),
      shiftKey: key.includes('Shift+'),
      preventDefault: () => console.log('preventDefault called'),
      stopPropagation: () => console.log('stopPropagation called'),
      target: document.body
    };
    
    const normalizedKey = this.getKeyString(mockEvent);
    console.log(`🔧 Normalized to: "${normalizedKey}"`);
    
    // Buscar atajo
    const globalShortcut = this.shortcuts.global[normalizedKey];
    const pageShortcuts = this.shortcuts[this.currentPage];
    const pageShortcut = pageShortcuts ? pageShortcuts[normalizedKey] : null;
    
    if (globalShortcut) {
      console.log(`✅ Found global shortcut: ${globalShortcut.action}`);
    } else if (pageShortcut) {
      console.log(`✅ Found page shortcut: ${pageShortcut.action}`);
    } else {
      console.log(`❌ No shortcut found for: ${normalizedKey}`);
      
      // Probar versión alternativa
      if (key.length === 1 && key.match(/[a-zA-Z]/)) {
        const altKey = key === key.toUpperCase() ? key.toLowerCase() : key.toUpperCase();
        const altGlobal = this.shortcuts.global[altKey];
        const altPage = pageShortcuts ? pageShortcuts[altKey] : null;
        
        if (altGlobal || altPage) {
          console.log(`💡 Alternative found: ${altKey} -> ${(altGlobal || altPage).action}`);
        }
      }
    }
  }
};

// Inicializar sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  KeyboardShortcuts.init();
  
  // Mostrar notificación inicial
  setTimeout(() => {
    KeyboardShortcuts.showNotification('Presiona Alt+H para ver todos los atajos disponibles');
  }, 2000);
});

// Exportar para uso global
window.KeyboardShortcuts = KeyboardShortcuts;

// Función helper para registrar atajos personalizados
window.registerShortcut = function(key, action, description) {
  const currentPage = KeyboardShortcuts.currentPage;
  KeyboardShortcuts.registerCustomShortcut(currentPage, key, action, description);
};

// Función helper para mostrar ayuda
window.showKeyboardHelp = function() {
  KeyboardShortcuts.showHelpOverlay();
};

// Funciones helper para debug
window.toggleKeyboardDebug = function() {
  KeyboardShortcuts.toggleDebugMode();
};

window.listShortcuts = function() {
  KeyboardShortcuts.listAvailableShortcuts();
};

window.testShortcut = function(key) {
  KeyboardShortcuts.testShortcut(key);
};

window.getShortcutsInfo = function() {
  return KeyboardShortcuts.getShortcutsInfo();
};

console.log('🎮 Keyboard Shortcuts System loaded successfully!');
console.log('📘 Use Alt+H to see all available shortcuts');
console.log('🔧 Use registerShortcut(key, action, description) to add custom shortcuts');
console.log('🔤 Case-insensitive support enabled: Y/y, N/n, C/c, I/i all work!');
console.log('🛠️ Debug functions: toggleKeyboardDebug(), listShortcuts(), testShortcut("Y")');