/* ============================================
   UI.JS - Manejo de UI e Interacciones
   ============================================ */

/* ============================================
   NAVEGACIÓN MÓVIL
   ============================================ */

const MobileNavigation = {
  init() {
    this.hamburger = document.getElementById('hamburger-btn');
    this.mobileMenu = document.getElementById('mobile-menu');
    this.closeBtn = document.getElementById('close-menu-btn');
    
    this.bindEvents();
  },

  bindEvents() {
    // Abrir menú móvil
    if (this.hamburger) {
      this.hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openMenu();
      });
    }

    // Cerrar menú móvil
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => {
        this.closeMenu();
      });
    }

    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
      if (this.mobileMenu && 
          !this.mobileMenu.contains(e.target) && 
          !this.hamburger.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Cerrar menú con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeMenu();
      }
    });
  },

  openMenu() {
    if (this.mobileMenu) {
      this.mobileMenu.classList.add('open');
      this.mobileMenu.classList.remove('-translate-x-full');
      document.body.style.overflow = 'hidden'; // Prevenir scroll
    }
  },

  closeMenu() {
    if (this.mobileMenu) {
      this.mobileMenu.classList.remove('open');
      this.mobileMenu.classList.add('-translate-x-full');
      document.body.style.overflow = ''; // Restaurar scroll
    }
  }
};

/* ============================================
   SISTEMA DE MODALES
   ============================================ */

const ModalSystem = {
  currentModal: null,
  
  init() {
    this.bindModalEvents();
  },

  bindModalEvents() {
    // Cerrar modal al hacer clic en el backdrop
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('modal-backdrop')) {
        this.closeModal();
      }
    });

    // Cerrar modal con tecla ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.currentModal) {
        this.closeModal();
      }
    });

    // Manejar botones de cerrar específicos (para modales estáticos)
    document.addEventListener('click', (e) => {
      // Botones con IDs específicos de cierre
      if (e.target.id === 'close-play-modal') {
        this.closeModalById('play-modal');
      } else if (e.target.id === 'close-share-modal') {
        this.closeModalById('share-modal');
      }
      // También manejar clases genéricas de cierre
      else if (e.target.classList.contains('close-modal-btn') || 
               e.target.closest('.close-modal-btn')) {
        e.preventDefault();
        e.stopPropagation();
        this.closeModal();
      }
    });
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      this.currentModal = modal;
      modal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      
      // Enfocar el modal para accesibilidad
      const focusableElement = modal.querySelector('button, input, select, textarea');
      if (focusableElement) {
        focusableElement.focus();
      }
    }
  },

  closeModal() {
    if (this.currentModal) {
      this.currentModal.classList.add('hidden');
      document.body.style.overflow = '';
      
      // Si es un modal dinámico, eliminarlo del DOM
      if (this.currentModal.id.includes('dynamic-modal') || 
          this.currentModal.id.includes('study-modal') || 
          this.currentModal.id.includes('question-modal') ||
          this.currentModal.id.includes('results-modal') ||
          this.currentModal.id.includes('team-editor-modal')) {
        document.body.removeChild(this.currentModal);
      }
      
      this.currentModal = null;
    }
  },

  // Cerrar modal específico por ID
  closeModalById(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      
      // Si es un modal dinámico, eliminarlo del DOM
      if (modalId.includes('dynamic-modal') || 
          modalId.includes('study-modal') || 
          modalId.includes('question-modal') ||
          modalId.includes('results-modal') ||
          modalId.includes('team-editor-modal')) {
        document.body.removeChild(modal);
      }
      
      if (this.currentModal === modal) {
        this.currentModal = null;
      }
    }
  },

  // Crear modal dinámico
  createModal(title, content, options = {}) {
    // Eliminar modal previo si existe
    const existingModal = document.getElementById(options.id || 'dynamic-modal');
    if (existingModal) {
      document.body.removeChild(existingModal);
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-backdrop fixed inset-0 flex items-center justify-center hidden';
    modal.id = options.id || 'dynamic-modal';
    
    const modalContent = `
      <div class="modal bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 m-4">
        <div class="modal-header">
          <div class="flex justify-between items-center mb-4">
            <h2 class="modal-title text-xl font-bold">${title}</h2>
            ${title ? '<button class="close-modal-btn text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>' : ''}
          </div>
        </div>
        <div class="modal-body">
          ${content}
        </div>
        ${options.showFooter !== false ? `
        <div class="modal-footer mt-6 text-center">
          <button class="btn btn-primary close-modal-btn">
            ${options.closeButtonText || 'Close'}
          </button>
        </div>
        ` : ''}
      </div>
    `;
    
    modal.innerHTML = modalContent;
    document.body.appendChild(modal);
    
    // Añadir event listeners específicos para este modal
    const closeButtons = modal.querySelectorAll('.close-modal-btn');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.closeModal();
      });
    });
    
    this.openModal(modal.id);
    
    return modal;
  }
};

/* ============================================
   MANEJO DE FORMULARIOS
   ============================================ */

const FormHandler = {
  init() {
    this.bindFormEvents();
  },

  bindFormEvents() {
    // Manejo de formularios de autenticación
    const authForm = document.getElementById('auth-form');
    const loginForm = document.getElementById('login-form');
    const editForm = document.getElementById('edit-form');
    
    if (authForm) this.bindAuthForm(authForm);
    if (loginForm) this.bindLoginForm(loginForm);
    if (editForm) this.bindEditForm(editForm);
  },

  bindAuthForm(form) {
    const { ValidationUtils, NotificationSystem } = window.BammoozleUtils;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = form.querySelector('#email');
      const passwordInput = form.querySelector('#password');
      const confirmPasswordInput = form.querySelector('#confirm-password');
      const isLoginMode = confirmPasswordInput?.classList.contains('hidden');
      
      // Limpiar errores previos
      ValidationUtils.clearFormErrors(form);
      
      let isValid = true;
      
      // Validar email
      const emailValidation = ValidationUtils.validateEmail(emailInput.value);
      if (!emailValidation.isValid) {
        ValidationUtils.showFieldError('email', emailValidation.message);
        isValid = false;
      }
      
      // Validar contraseña
      const passwordValidation = ValidationUtils.validatePassword(passwordInput.value);
      if (!passwordValidation.isValid) {
        ValidationUtils.showFieldError('password', passwordValidation.message);
        isValid = false;
      }
      
      // Validar confirmación de contraseña (solo en modo registro)
      if (!isLoginMode && confirmPasswordInput) {
        const confirmValidation = ValidationUtils.validatePasswordConfirmation(
          passwordInput.value, 
          confirmPasswordInput.value
        );
        if (!confirmValidation.isValid) {
          ValidationUtils.showFieldError('confirm-password', confirmValidation.message);
          isValid = false;
        }
      }
      
      if (isValid) {
        const message = isLoginMode ? '¡Inicio de sesión exitoso!' : '¡Cuenta creada exitosamente!';
        NotificationSystem.success(message);
        
        // Simular redirección
        setTimeout(() => {
          window.location.href = 'html/game-main.html';
        }, 1500);
      } else {
        NotificationSystem.error('Por favor, corrige los errores en el formulario.');
      }
    });
  },

  bindLoginForm(form) {
    const { ValidationUtils, NotificationSystem } = window.BammoozleUtils;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = form.querySelector('#email');
      const passwordInput = form.querySelector('#password');
      
      ValidationUtils.clearFormErrors(form);
      
      let isValid = true;
      
      if (!emailInput.value.trim()) {
        ValidationUtils.showFieldError('email', 'El email es obligatorio.');
        isValid = false;
      }
      
      if (!passwordInput.value.trim()) {
        ValidationUtils.showFieldError('password', 'La contraseña es obligatoria.');
        isValid = false;
      }
      
      if (isValid) {
        NotificationSystem.success('¡Inicio de sesión exitoso!');
        setTimeout(() => {
          window.location.href = 'game-main.html';
        }, 1500);
      } else {
        NotificationSystem.error('Por favor, corrige los errores en el formulario.');
      }
    });
  },

  bindEditForm(form) {
    const { NotificationSystem } = window.BammoozleUtils;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const question = form.querySelector('#question').value;
      const answer = form.querySelector('#answer').value;
      const points = form.querySelector('#points').value;
      
      if (!question.trim() || !answer.trim()) {
        NotificationSystem.error('La pregunta y respuesta son obligatorias.');
        return;
      }
      
      console.log('Guardando pregunta:', { question, answer, points });
      NotificationSystem.success('¡Pregunta guardada exitosamente!');
      
      // Limpiar formulario
      form.reset();
    });
  }
};

/* ============================================
   CONTROLES DE JUEGO
   ============================================ */

const GameControls = {
  init() {
    this.bindGameEvents();
  },

  bindGameEvents() {
    // Botón de play
    const playButton = document.getElementById('play-button');
    if (playButton) {
      playButton.addEventListener('click', () => {
        ModalSystem.openModal('play-modal');
      });
    }

    // Botón de share
    const shareButton = document.getElementById('share-button');
    if (shareButton) {
      shareButton.addEventListener('click', () => {
        ModalSystem.openModal('share-modal');
      });
    }

    // Cerrar modales - ya no necesitamos estos eventos específicos
    // porque se manejan en bindModalEvents()

    // Alternar contraseña
    const togglePasswordBtn = document.getElementById('toggle-password');
    if (togglePasswordBtn) {
      togglePasswordBtn.addEventListener('click', () => {
        this.togglePassword();
      });
    }
  },

  togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeOpen = document.getElementById('eye-open');
    const eyeClosed = document.getElementById('eye-closed');
    
    if (passwordInput) {
      const isPassword = passwordInput.type === 'password';
      passwordInput.type = isPassword ? 'text' : 'password';
      
      if (eyeOpen && eyeClosed) {
        eyeOpen.classList.toggle('hidden', isPassword);
        eyeClosed.classList.toggle('hidden', !isPassword);
      }
    }
  }
};

/* ============================================
   TABLERO DE JUEGO
   ============================================ */

const GameBoard = {
  init() {
    this.createGameTiles();
  },

  createGameTiles() {
    const gameBoard = document.getElementById('game-board');
    const numberOfTiles = 10;
    
    if (!gameBoard) return;
    
    // Limpiar tablero existente
    gameBoard.innerHTML = '';
    
    for (let i = 1; i <= numberOfTiles; i++) {
      const tile = this.createTile(i);
      gameBoard.appendChild(tile);
    }
  },

  createTile(number) {
    const tile = document.createElement('div');
    tile.className = 'game-tile';
    tile.textContent = number;
    tile.setAttribute('data-tile', number);
    
    // Evento de clic
    tile.addEventListener('click', () => {
      this.handleTileClick(tile, number);
    }, { once: true });
    
    return tile;
  },

  handleTileClick(tile, number) {
    const { NotificationSystem } = window.BammoozleUtils;
    
    // Voltear tarjeta
    tile.classList.add('is-flipped');
    
    // Simular pregunta
    setTimeout(() => {
      ModalSystem.createModal(
        `Pregunta ${number}`,
        `<p>Esta sería la pregunta número ${number}</p>`,
        { closeButtonText: 'Continuar' }
      );
    }, 300);
    
    NotificationSystem.info(`Tarjeta ${number} seleccionada`);
  }
};

/* ============================================
   SWITCHER DE FORMULARIOS
   ============================================ */

const FormSwitcher = {
  init() {
    this.isLoginMode = false;
    this.bindSwitchEvents();
  },

  bindSwitchEvents() {
    const formSwitcher = document.getElementById('form-switcher');
    const headerSigninBtn = document.getElementById('header-signin-btn');
    const headerJoinBtn = document.getElementById('header-join-btn');
    
    if (formSwitcher) {
      formSwitcher.addEventListener('click', () => {
        this.toggleMode();
      });
    }
    
    if (headerSigninBtn) {
      headerSigninBtn.addEventListener('click', () => {
        this.setMode(true);
      });
    }
    
    if (headerJoinBtn) {
      headerJoinBtn.addEventListener('click', () => {
        this.setMode(false);
      });
    }
  },

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
    this.updateFormUI();
  },

  setMode(isLogin) {
    this.isLoginMode = isLogin;
    this.updateFormUI();
  },

  updateFormUI() {
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const formSwitcher = document.getElementById('form-switcher');
    const confirmPasswordField = document.getElementById('confirm-password-field');
    
    // Limpiar errores
    const form = document.getElementById('auth-form');
    if (form) {
      window.BammoozleUtils.ValidationUtils.clearFormErrors(form);
    }
    
    if (this.isLoginMode) {
      if (formTitle) formTitle.textContent = 'Iniciar Sesión';
      if (submitButton) submitButton.textContent = 'Iniciar Sesión';
      if (confirmPasswordField) confirmPasswordField.classList.add('hidden');
      if (formSwitcher) {
        formSwitcher.innerHTML = `¿No tienes cuenta? <span class="text-bam-purple cursor-pointer hover:underline">Registrarse</span>`;
      }
    } else {
      if (formTitle) formTitle.textContent = 'Únete Gratis';
      if (submitButton) submitButton.textContent = 'Crear Cuenta';
      if (confirmPasswordField) confirmPasswordField.classList.remove('hidden');
      if (formSwitcher) {
        formSwitcher.innerHTML = `¿Ya tienes cuenta? <span class="text-bam-purple cursor-pointer hover:underline">Iniciar Sesión</span>`;
      }
    }
  }
};

/* ============================================
   INICIALIZACIÓN PRINCIPAL
   ============================================ */

const BammoozleUI = {
  MobileNavigation,
  ModalSystem,
  FormHandler,
  GameControls,
  GameBoard,
  FormSwitcher,

  init() {
    // Inicializar todos los componentes
    this.MobileNavigation.init();
    this.ModalSystem.init();
    this.FormHandler.init();
    this.GameControls.init();
    this.GameBoard.init();
    this.FormSwitcher.init();
    
    console.log('Bammoozle UI iniciado correctamente');
  }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  BammoozleUI.init();
});

// Exportar para uso global
window.BammoozleUI = BammoozleUI;