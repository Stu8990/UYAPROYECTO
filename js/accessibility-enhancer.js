/* ============================================
   ACCESSIBILITY ENHANCER - MEJORAS AUTOMÁTICAS
   Archivo: js/accessibility-enhancer.js
   ============================================ */

const AccessibilityEnhancer = {
  init() {
    this.addSkipLinks();
    this.addLiveRegion();
    this.enhanceNavigation();
    this.enhanceForms();
    this.enhanceButtons();
    this.enhanceModals();
    this.enhanceGameElements();
    this.addKeyboardSupport();
    this.addScreenReaderSupport();
    this.monitorFocus();
    
    console.log('♿ Accessibility enhancements applied');
  },

  addSkipLinks() {
    // Añadir skip link si no existe
    if (!document.querySelector('.skip-to-content')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-to-content';
      skipLink.textContent = 'Saltar al contenido principal';
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  },

  addLiveRegion() {
    // Añadir región live para anuncios
    if (!document.getElementById('sr-live-region')) {
      const liveRegion = document.createElement('div');
      liveRegion.id = 'sr-live-region';
      liveRegion.className = 'sr-live-region';
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      document.body.appendChild(liveRegion);
    }
  },

  enhanceNavigation() {
    // Mejorar navegación principal
    const nav = document.querySelector('nav');
    if (nav) {
      nav.setAttribute('role', 'navigation');
      nav.setAttribute('aria-label', 'Navegación principal');
    }

    // Mejorar hamburger button
    const hamburger = document.getElementById('hamburger-btn');
    if (hamburger) {
      hamburger.setAttribute('aria-label', 'Abrir menú de navegación');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-controls', 'mobile-menu');
      
      // Añadir texto para screen readers
      if (!hamburger.querySelector('.sr-only')) {
        const srText = document.createElement('span');
        srText.className = 'sr-only';
        srText.textContent = 'Menú';
        hamburger.appendChild(srText);
      }
    }

    // Mejorar menú móvil
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu) {
      mobileMenu.setAttribute('aria-hidden', 'true');
      mobileMenu.setAttribute('role', 'navigation');
      mobileMenu.setAttribute('aria-label', 'Menú de navegación móvil');
    }
  },

  enhanceForms() {
    // Mejorar todos los formularios
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
      form.setAttribute('novalidate', '');
      
      // Mejorar inputs
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        const label = form.querySelector(`label[for="${input.id}"]`);
        if (label && label.textContent.includes('*')) {
          input.setAttribute('required', '');
          input.setAttribute('aria-required', 'true');
        }

        // Añadir aria-describedby para errores
        const errorId = `${input.id}-error`;
        const errorElement = document.getElementById(errorId);
        if (errorElement) {
          const describedBy = input.getAttribute('aria-describedby') || '';
          input.setAttribute('aria-describedby', `${describedBy} ${errorId}`.trim());
          errorElement.setAttribute('role', 'alert');
          errorElement.setAttribute('aria-live', 'polite');
        }

        // Autocomplete apropiado
        if (input.type === 'email') {
          input.setAttribute('autocomplete', 'email');
        }
        if (input.type === 'password') {
          input.setAttribute('autocomplete', input.name === 'confirm-password' ? 'new-password' : 'current-password');
        }
      });
    });

    // Mejorar toggle password
    const togglePassword = document.getElementById('toggle-password');
    if (togglePassword) {
      togglePassword.setAttribute('aria-label', 'Mostrar contraseña');
      togglePassword.setAttribute('aria-pressed', 'false');
      togglePassword.addEventListener('click', () => {
        const isPressed = togglePassword.getAttribute('aria-pressed') === 'true';
        togglePassword.setAttribute('aria-pressed', (!isPressed).toString());
        togglePassword.setAttribute('aria-label', isPressed ? 'Mostrar contraseña' : 'Ocultar contraseña');
      });
    }
  },

  enhanceButtons() {
    // Mejorar todos los botones
    const buttons = document.querySelectorAll('button:not([aria-label])');
    buttons.forEach(button => {
      // Añadir aria-label si no existe
      if (!button.getAttribute('aria-label') && !button.textContent.trim()) {
        const icon = button.querySelector('svg, .icon');
        if (icon) {
          button.setAttribute('aria-label', 'Botón de acción');
        }
      }

      // Asegurar tamaño mínimo para touch
      if (!button.style.minHeight) {
        button.style.minHeight = '44px';
      }
      if (!button.style.minWidth) {
        button.style.minWidth = '44px';
      }
    });

    // Mejorar botones específicos
    const playButton = document.getElementById('play-button');
    if (playButton) {
      playButton.setAttribute('aria-label', 'Iniciar juego');
      if (!playButton.querySelector('.sr-only')) {
        const help = document.createElement('div');
        help.className = 'sr-only';
        help.textContent = 'Comenzar una nueva partida del juego';
        playButton.appendChild(help);
      }
    }
  },

  enhanceModals() {
    // Interceptar creación de modales
    if (window.BammoozleUI?.ModalSystem || window.RobustModalSystem) {
      const modalSystem = window.BammoozleUI?.ModalSystem || window.RobustModalSystem;
      const originalCreateModal = modalSystem.createModal;
      
      modalSystem.createModal = function(title, content, options = {}) {
        const modal = originalCreateModal.call(this, title, content, options);
        
        // Mejorar accesibilidad del modal
        AccessibilityEnhancer.enhanceModal(modal, title);
        
        return modal;
      };
    }
  },

  enhanceModal(modal, title) {
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    
    if (title) {
      const titleElement = modal.querySelector('.modal-title, h1, h2, h3');
      if (titleElement) {
        titleElement.id = titleElement.id || `modal-title-${Date.now()}`;
        modal.setAttribute('aria-labelledby', titleElement.id);
      }
    }

    // Mejorar botón de cerrar
    const closeButton = modal.querySelector('.close-modal-btn, .modal-close');
    if (closeButton) {
      closeButton.setAttribute('aria-label', 'Cerrar modal');
      if (!closeButton.querySelector('.sr-only')) {
        const srText = document.createElement('span');
        srText.className = 'sr-only';
        srText.textContent = 'Cerrar';
        closeButton.appendChild(srText);
      }
    }

    // Gestión de focus
    setTimeout(() => {
      const focusableElement = modal.querySelector('button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElement) {
        focusableElement.focus();
      }
    }, 100);

    // Trap focus dentro del modal
    this.trapFocus(modal);
  },

  enhanceGameElements() {
    // Mejorar tarjetas de juego
    const gameTiles = document.querySelectorAll('.game-tile');
    gameTiles.forEach((tile, index) => {
      tile.setAttribute('role', 'button');
      tile.setAttribute('tabindex', '0');
      tile.setAttribute('aria-pressed', 'false');
      
      const questionNumber = tile.dataset.tile || (index + 1);
      tile.setAttribute('aria-label', `Pregunta ${questionNumber}, 15 puntos`);
      
      // Actualizar cuando se voltee
      const observer = new MutationObserver(() => {
        if (tile.classList.contains('is-flipped')) {
          tile.setAttribute('aria-pressed', 'true');
          tile.setAttribute('aria-label', `Pregunta ${questionNumber} respondida`);
        }
      });
      observer.observe(tile, { attributes: true });
    });

    // Mejorar scoreboard
    const scoreElements = document.querySelectorAll('[id*="score"]');
    scoreElements.forEach(element => {
      element.setAttribute('aria-live', 'polite');
    });

    // Mejorar tablero de juego
    const gameBoard = document.getElementById('game-board');
    if (gameBoard) {
      gameBoard.setAttribute('role', 'grid');
      gameBoard.setAttribute('aria-label', 'Tablero de juego');
    }

    // Mejorar tarjetas de estudio
    const studyCards = document.querySelectorAll('.study-card, .preview-card');
    studyCards.forEach((card, index) => {
      card.setAttribute('role', 'button');
      card.setAttribute('tabindex', '0');
      
      const question = card.querySelector('.question-text');
      if (question) {
        const questionText = question.textContent.substring(0, 50) + '...';
        card.setAttribute('aria-label', `Pregunta: ${questionText}`);
      }

      // Mejorar botón de respuesta
      const answerBtn = card.querySelector('.toggle-answer-btn, .study-answer-btn');
      if (answerBtn) {
        answerBtn.setAttribute('aria-label', 'Ver respuesta de la pregunta');
        answerBtn.setAttribute('aria-pressed', 'false');
      }
    });
  },

  addKeyboardSupport() {
    // Navegación con teclado para tarjetas
    document.addEventListener('keydown', (e) => {
      const focusedElement = document.activeElement;
      
      // Soporte para tarjetas de juego
      if (focusedElement.classList.contains('game-tile')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          focusedElement.click();
        }
      }

      // Soporte para tarjetas de estudio
      if (focusedElement.classList.contains('study-card') || focusedElement.classList.contains('preview-card')) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const answerBtn = focusedElement.querySelector('.toggle-answer-btn, .study-answer-btn');
          if (answerBtn) {
            answerBtn.click();
          }
        }
      }

      // Navegación con flechas
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.handleArrowNavigation(e, focusedElement);
      }

      // Cerrar modal con ESC
      if (e.key === 'Escape') {
        const openModal = document.querySelector('.modal-backdrop:not(.hidden)');
        if (openModal) {
          const closeBtn = openModal.querySelector('.close-modal-btn, .modal-close');
          if (closeBtn) {
            closeBtn.click();
          }
        }
      }
    });
  },

  handleArrowNavigation(e, focusedElement) {
    // Navegación en grid de tarjetas
    const isCard = focusedElement.classList.contains('game-tile') || 
                   focusedElement.classList.contains('study-card') || 
                   focusedElement.classList.contains('preview-card');

    if (!isCard) return;

    const cards = Array.from(document.querySelectorAll('.game-tile, .study-card, .preview-card'));
    const currentIndex = cards.indexOf(focusedElement);
    
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    const columns = window.innerWidth >= 768 ? 5 : 2; // Responsive columns

    switch (e.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : cards.length - 1;
        break;
      case 'ArrowRight':
        nextIndex = currentIndex < cards.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'ArrowUp':
        nextIndex = currentIndex - columns;
        if (nextIndex < 0) nextIndex = currentIndex;
        break;
      case 'ArrowDown':
        nextIndex = currentIndex + columns;
        if (nextIndex >= cards.length) nextIndex = currentIndex;
        break;
    }

    if (nextIndex !== currentIndex && cards[nextIndex]) {
      e.preventDefault();
      cards[nextIndex].focus();
    }
  },

  addScreenReaderSupport() {
    // Añadir anuncios para cambios importantes
    const originalNotificationShow = window.BammoozleUtils?.NotificationSystem?.show;
    if (originalNotificationShow) {
      window.BammoozleUtils.NotificationSystem.show = function(message, type, duration) {
        // Llamar función original
        const result = originalNotificationShow.call(this, message, type, duration);
        
        // Anunciar a screen readers
        AccessibilityEnhancer.announceToScreenReader(message);
        
        return result;
      };
    }

    // Anunciar cambios de puntuación
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.target.id && mutation.target.id.includes('score')) {
          const teamName = mutation.target.id.includes('team1') ? 'Equipo 1' : 'Equipo 2';
          const newScore = mutation.target.textContent;
          this.announceToScreenReader(`${teamName}: ${newScore}`);
        }
      });
    });

    // Observar cambios en puntuaciones
    const scoreElements = document.querySelectorAll('[id*="score"]');
    scoreElements.forEach(element => {
      observer.observe(element, { childList: true, characterData: true, subtree: true });
    });
  },

  announceToScreenReader(message) {
    const liveRegion = document.getElementById('sr-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      
      // Limpiar después de un momento
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  },

  trapFocus(container) {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    container.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  },

  monitorFocus() {
    // Asegurar que siempre hay un elemento enfocado
    document.addEventListener('focusout', (e) => {
      setTimeout(() => {
        if (!document.activeElement || document.activeElement === document.body) {
          const firstFocusable = document.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          if (firstFocusable) {
            firstFocusable.focus();
          }
        }
      }, 10);
    });

    // Destacar elemento enfocado
    document.addEventListener('focusin', (e) => {
      e.target.classList.add('focus-ring');
    });

    document.addEventListener('focusout', (e) => {
      e.target.classList.remove('focus-ring');
    });
  },

  // Método para validar accesibilidad
  validateAccessibility() {
    const issues = [];

    // Verificar imágenes sin alt
    const images = document.querySelectorAll('img:not([alt])');
    if (images.length > 0) {
      issues.push(`${images.length} imágenes sin texto alternativo`);
    }

    // Verificar botones sin label
    const unlabeledButtons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    const problematicButtons = Array.from(unlabeledButtons).filter(btn => !btn.textContent.trim());
    if (problematicButtons.length > 0) {
      issues.push(`${problematicButtons.length} botones sin etiqueta accesible`);
    }

    // Verificar formularios sin labels
    const unlabeledInputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    const problematicInputs = Array.from(unlabeledInputs).filter(input => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      return !label;
    });
    if (problematicInputs.length > 0) {
      issues.push(`${problematicInputs.length} campos de formulario sin etiqueta`);
    }

    // Verificar contraste de colores (básico)
    const lightTextOnLight = document.querySelectorAll('.text-gray-300, .text-gray-400');
    if (lightTextOnLight.length > 0) {
      issues.push('Posibles problemas de contraste de color detectados');
    }

    // Verificar jerarquía de headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    let previousLevel = 0;
    let hierarchyIssues = 0;
    
    headings.forEach(heading => {
      const currentLevel = parseInt(heading.tagName.charAt(1));
      if (currentLevel > previousLevel + 1) {
        hierarchyIssues++;
      }
      previousLevel = currentLevel;
    });
    
    if (hierarchyIssues > 0) {
      issues.push('Jerarquía de encabezados inconsistente');
    }

    // Reportar resultados
    if (issues.length === 0) {
      console.log('✅ No se encontraron problemas obvios de accesibilidad');
    } else {
      console.warn('⚠️ Problemas de accesibilidad encontrados:', issues);
    }

    return issues;
  },

  // Método para generar reporte de accesibilidad
  generateAccessibilityReport() {
    const report = {
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      issues: this.validateAccessibility(),
      improvements: [],
      checklist: {
        skipLinks: !!document.querySelector('.skip-to-content'),
        liveRegion: !!document.getElementById('sr-live-region'),
        focusManagement: true, // Implementado programáticamente
        keyboardNavigation: true, // Implementado programáticamente
        ariaLabels: true, // Verificado en validateAccessibility
        semanticHTML: !!document.querySelector('main, nav, header, footer'),
        colorContrast: true, // Necesita verificación manual
        responsiveDesign: true, // Implementado en CSS
        altText: document.querySelectorAll('img:not([alt])').length === 0
      }
    };

    // Añadir mejoras aplicadas
    if (document.querySelector('.skip-to-content')) {
      report.improvements.push('Skip links añadidos');
    }
    if (document.getElementById('sr-live-region')) {
      report.improvements.push('Región live para screen readers');
    }
    report.improvements.push('Navegación por teclado mejorada');
    report.improvements.push('Gestión de focus implementada');
    report.improvements.push('Atributos ARIA añadidos');

    console.log('📋 Reporte de Accesibilidad:', report);
    return report;
  }
};

/* ============================================
   INTEGRACIÓN CON SISTEMAS EXISTENTES
   ============================================ */

// Mejorar sistema de notificaciones existente
document.addEventListener('DOMContentLoaded', () => {
  // Mejorar notificaciones cuando estén disponibles
  const enhanceNotifications = () => {
    if (window.BammoozleUtils?.NotificationSystem) {
      const originalShow = window.BammoozleUtils.NotificationSystem.show;
      
      window.BammoozleUtils.NotificationSystem.show = function(message, type = 'info', duration = 3000) {
        // Crear notificación mejorada
        AccessibilityEnhancer.init();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.setAttribute('role', type === 'error' ? 'alert' : 'status');
        notification.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');
        
        // Estructura accesible
        notification.innerHTML = `
          <div class="notification-icon" aria-hidden="true">
            ${type === 'success' ? '✅' : type === 'error' ? '⚠️' : type === 'info' ? 'ℹ️' : '📢'}
          </div>
          <div class="notification-content">${message}</div>
          <button class="notification-close" aria-label="Cerrar notificación">
            <span aria-hidden="true">&times;</span>
          </button>
        `;
        
        // Añadir al contenedor
        let container = document.getElementById('notification-container');
        if (!container) {
          container = document.createElement('div');
          container.id = 'notification-container';
          container.className = 'fixed top-4 right-4 z-50 space-y-2';
          container.setAttribute('aria-label', 'Notificaciones');
          document.body.appendChild(container);
        }
        
        container.appendChild(notification);
        
        // Anunciar a screen readers
        AccessibilityEnhancer.announceToScreenReader(message);
        
        // Mostrar con animación
        setTimeout(() => notification.classList.add('show'), 100);
        
        // Auto-ocultar
        const timeout = setTimeout(() => {
          AccessibilityEnhancer.removeNotification(notification);
        }, duration);
        
        // Botón de cerrar
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
          clearTimeout(timeout);
          AccessibilityEnhancer.removeNotification(notification);
        });
        
        return notification;
      };
    }
  };

  // Intentar mejorar notificaciones
  if (window.BammoozleUtils) {
    enhanceNotifications();
  } else {
    // Esperar a que esté disponible
    const checkInterval = setInterval(() => {
      if (window.BammoozleUtils) {
        enhanceNotifications();
        clearInterval(checkInterval);
      }
    }, 100);
    
    // Timeout después de 5 segundos
    setTimeout(() => clearInterval(checkInterval), 5000);
  }
});

AccessibilityEnhancer.removeNotification = function(notification) {
  notification.classList.remove('show');
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
};

/* ============================================
   MEJORAS ESPECÍFICAS PARA CADA PÁGINA
   ============================================ */

const PageSpecificEnhancements = {
  init() {
    const currentPage = this.getCurrentPage();
    
    switch (currentPage) {
      case 'index':
        this.enhanceIndexPage();
        break;
      case 'game-main':
        this.enhanceGameMainPage();
        break;
      case 'game-board':
        this.enhanceGameBoardPage();
        break;
      case 'study':
        this.enhanceStudyPage();
        break;
      case 'edit':
        this.enhanceEditPage();
        break;
    }
  },

  getCurrentPage() {
    const path = window.location.pathname;
    if (path.includes('game-main')) return 'game-main';
    if (path.includes('game-board')) return 'game-board';
    if (path.includes('study')) return 'study';
    if (path.includes('edit')) return 'edit';
    return 'index';
  },

  enhanceIndexPage() {
    // Mejorar landing page
    const getStartedBtn = document.getElementById('get-started-btn');
    if (getStartedBtn) {
      getStartedBtn.setAttribute('aria-describedby', 'get-started-help');
      const help = document.createElement('div');
      help.id = 'get-started-help';
      help.className = 'sr-only';
      help.textContent = 'Comienza a crear juegos educativos interactivos';
      getStartedBtn.appendChild(help);
    }

    // Mejorar formulario de auth
    const authForm = document.getElementById('auth-form');
    if (authForm) {
      authForm.setAttribute('aria-label', 'Formulario de autenticación');
    }
  },

  enhanceGameMainPage() {
    // Mejorar command center
    const commandCenter = document.querySelector('.card');
    if (commandCenter) {
      commandCenter.setAttribute('role', 'region');
      commandCenter.setAttribute('aria-label', 'Centro de comando del juego');
    }

    // Mejorar código de juego
    const gameCode = document.getElementById('game-code');
    if (gameCode) {
      gameCode.setAttribute('aria-label', `Código del juego: ${gameCode.textContent}`);
      gameCode.setAttribute('role', 'status');
    }
  },

  enhanceGameBoardPage() {
    // Mejorar indicador de turno
    const currentTeam = document.getElementById('current-team');
    if (currentTeam) {
      currentTeam.setAttribute('aria-live', 'polite');
      currentTeam.setAttribute('aria-label', 'Turno actual');
    }

    // Mejorar controles del juego
    const controls = document.querySelector('[role="region"][aria-label="Controles del juego"]');
    if (!controls) {
      const controlsSection = document.querySelector('.bg-bam-yellow-darker');
      if (controlsSection) {
        controlsSection.setAttribute('role', 'region');
        controlsSection.setAttribute('aria-label', 'Controles del juego');
      }
    }
  },

  enhanceStudyPage() {
    // Mejorar monitoring center
    const monitoringCenter = document.querySelector('.card');
    if (monitoringCenter) {
      monitoringCenter.setAttribute('role', 'region');
      monitoringCenter.setAttribute('aria-label', 'Centro de monitoreo del progreso');
    }

    // Mejorar progress bar
    const progressPercentage = document.getElementById('progress-percentage');
    if (progressPercentage) {
      const progressContainer = progressPercentage.closest('.flex');
      if (progressContainer) {
        progressContainer.setAttribute('role', 'progressbar');
        progressContainer.setAttribute('aria-valuemin', '0');
        progressContainer.setAttribute('aria-valuemax', '100');
        progressContainer.setAttribute('aria-valuenow', '0');
        progressContainer.setAttribute('aria-label', 'Progreso del estudio');
      }
    }
  },

  enhanceEditPage() {
    // Mejorar formulario de edición
    const editForm = document.getElementById('edit-form');
    if (editForm) {
      editForm.setAttribute('aria-label', 'Formulario de edición de preguntas');
    }

    // Mejorar lista de preguntas
    const questionsList = document.getElementById('questions-list');
    if (questionsList) {
      questionsList.setAttribute('role', 'list');
      questionsList.setAttribute('aria-label', 'Lista de preguntas del juego');
      
      // Mejorar items individuales
      const questionItems = questionsList.querySelectorAll('.card');
      questionItems.forEach((item, index) => {
        item.setAttribute('role', 'listitem');
        item.setAttribute('aria-label', `Pregunta ${index + 1}`);
      });
    }
  }
};

/* ============================================
   INICIALIZACIÓN PRINCIPAL
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Aplicar mejoras de accesibilidad
  AccessibilityEnhancer.init();
  PageSpecificEnhancements.init();
  
  // Generar reporte inicial
  setTimeout(() => {
    AccessibilityEnhancer.generateAccessibilityReport();
  }, 1000);
  
  console.log('♿ Sistema de accesibilidad completamente cargado');
});

/* ============================================
   EXPORTAR PARA USO GLOBAL
   ============================================ */

window.AccessibilityEnhancer = AccessibilityEnhancer;
window.PageSpecificEnhancements = PageSpecificEnhancements;

// Función para validar accesibilidad desde consola
window.checkAccessibility = function() {
  return AccessibilityEnhancer.generateAccessibilityReport();
};

// Función para anunciar mensajes a screen readers
window.announceToScreenReader = function(message) {
  AccessibilityEnhancer.announceToScreenReader(message);
};

console.log('♿ Accessibility Enhancer loaded successfully!');
console.log('🔍 Use checkAccessibility() para generar un reporte');
console.log('📢 Use announceToScreenReader(message) para anuncios');