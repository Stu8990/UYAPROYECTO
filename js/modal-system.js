/* ============================================
   MODAL SYSTEM - SISTEMA ROBUSTO DE MODALES
   ============================================ */

const ModalSystem = {
  // Estado del sistema
  currentModal: null,
  modalStack: [],
  isInitialized: false,
  
  // Configuración
  config: {
    closeOnBackdrop: true,
    closeOnEscape: true,
    stackable: false,
    animation: true,
    restoreFocus: true
  },

  // Inicialización
  init() {
    if (this.isInitialized) return;
    
    this.createModalContainer();
    this.bindGlobalEvents();
    this.isInitialized = true;
    
    console.log('✅ Modal System initialized');
  },

  // Crear contenedor para modales
  createModalContainer() {
    let container = document.getElementById('modal-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'modal-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'true');
      document.body.appendChild(container);
    }
    return container;
  },

  // Eventos globales
  bindGlobalEvents() {
    // Cerrar con ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.config.closeOnEscape && this.currentModal) {
        e.preventDefault();
        this.close();
      }
    });

    // Delegación de eventos para botones de cerrar
    document.addEventListener('click', (e) => {
      // Backdrop click
      if (e.target.classList.contains('modal-backdrop') && this.config.closeOnBackdrop) {
        this.close();
        return;
      }

      // Close button click
      if (e.target.matches('.modal-close, .close-modal-btn, [data-modal-close]') ||
          e.target.closest('.modal-close, .close-modal-btn, [data-modal-close]')) {
        e.preventDefault();
        e.stopPropagation();
        this.close();
      }
    });
  },

  // Abrir modal
  open(modalId, options = {}) {
    try {
      this.init(); // Asegurar inicialización

      // Configurar opciones
      const opts = { ...this.config, ...options };

      // Cerrar modal anterior si no es stackable
      if (!opts.stackable && this.currentModal) {
        this.close(false);
      }

      // Buscar modal existente o crear uno nuevo
      let modal = document.getElementById(modalId);
      if (!modal) {
        console.warn(`Modal ${modalId} not found`);
        return false;
      }

      // Guardar elemento activo para restaurar focus
      if (opts.restoreFocus) {
        modal.dataset.previousFocus = document.activeElement?.id || '';
      }

      // Configurar modal
      this.setupModal(modal, opts);
      
      // Mostrar modal
      this.showModal(modal);

      // Actualizar estado
      if (opts.stackable) {
        this.modalStack.push(this.currentModal);
      }
      this.currentModal = modal;

      // Gestionar focus
      this.manageFocus(modal);

      console.log(`✅ Modal opened: ${modalId}`);
      return true;

    } catch (error) {
      console.error('❌ Error opening modal:', error);
      return false;
    }
  },

  // Configurar modal
  setupModal(modal, options) {
    // Asegurar estructura accesible
    if (!modal.getAttribute('role')) {
      modal.setAttribute('role', 'dialog');
    }
    if (!modal.getAttribute('aria-modal')) {
      modal.setAttribute('aria-modal', 'true');
    }
    
    // Encontrar o crear backdrop
    let backdrop = modal.closest('.modal-backdrop');
    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop';
      backdrop.appendChild(modal);
      document.getElementById('modal-container').appendChild(backdrop);
    }

    // Aplicar estilos base si no existen
    this.ensureModalStyles(backdrop, modal);
  },

  // Mostrar modal
  showModal(modal) {
    const backdrop = modal.closest('.modal-backdrop');
    if (!backdrop) return;

    // Prevenir scroll del body
    document.body.style.overflow = 'hidden';
    
    // Mostrar con animación
    backdrop.classList.remove('hidden');
    backdrop.style.display = 'flex';
    
    if (this.config.animation) {
      // Forzar reflow para animación
      backdrop.offsetHeight;
      backdrop.classList.add('modal-visible');
    }
  },

  // Cerrar modal
  close(restoreFocus = true) {
    if (!this.currentModal) return;

    try {
      const modal = this.currentModal;
      const backdrop = modal.closest('.modal-backdrop');
      
      // Obtener elemento para restaurar focus
      const previousFocusId = restoreFocus ? modal.dataset.previousFocus : null;

      // Ocultar modal
      this.hideModal(backdrop);

      // Limpiar después de animación
      setTimeout(() => {
        this.cleanupModal(modal, backdrop);
        
        // Restaurar focus
        if (previousFocusId && restoreFocus) {
          const previousElement = document.getElementById(previousFocusId);
          if (previousElement) {
            previousElement.focus();
          }
        }
      }, this.config.animation ? 300 : 0);

      // Actualizar estado
      this.currentModal = this.modalStack.pop() || null;
      
      // Restaurar scroll si no hay más modales
      if (!this.currentModal) {
        document.body.style.overflow = '';
      }

      console.log('✅ Modal closed');
      return true;

    } catch (error) {
      console.error('❌ Error closing modal:', error);
      return false;
    }
  },

  // Ocultar modal
  hideModal(backdrop) {
    if (!backdrop) return;

    if (this.config.animation) {
      backdrop.classList.remove('modal-visible');
      backdrop.classList.add('modal-hiding');
    } else {
      backdrop.style.display = 'none';
      backdrop.classList.add('hidden');
    }
  },

  // Limpiar modal
  cleanupModal(modal, backdrop) {
    if (!backdrop) return;

    backdrop.style.display = 'none';
    backdrop.classList.add('hidden');
    backdrop.classList.remove('modal-visible', 'modal-hiding');

    // Remover backdrop si es dinámico
    if (modal.dataset.dynamic === 'true') {
      backdrop.remove();
    }
  },

  // Crear modal dinámico
  create(title, content, options = {}) {
    const modalId = options.id || `modal-${Date.now()}`;
    
    // Configuración por defecto
    const config = {
      size: 'medium',
      closable: true,
      actions: [],
      className: '',
      ...options
    };

    // Crear estructura del modal
    const modal = this.createModalElement(modalId, title, content, config);
    
    // Añadir al contenedor
    const container = this.createModalContainer();
    container.appendChild(modal);

    // Abrir automáticamente si se especifica
    if (config.autoOpen !== false) {
      setTimeout(() => this.open(modalId, config), 10);
    }

    return modalId;
  },

  // Crear elemento modal
  createModalElement(modalId, title, content, config) {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop hidden';
    backdrop.innerHTML = `
      <div id="${modalId}" 
           class="modal modal-${config.size} ${config.className}" 
           role="dialog" 
           aria-modal="true"
           aria-labelledby="${modalId}-title"
           data-dynamic="true">
        <div class="modal-header">
          ${title ? `<h2 id="${modalId}-title" class="modal-title">${title}</h2>` : ''}
          ${config.closable ? '<button class="modal-close" aria-label="Cerrar modal">&times;</button>' : ''}
        </div>
        <div class="modal-body">
          ${content}
        </div>
        ${config.actions.length > 0 ? this.createModalActions(config.actions) : ''}
      </div>
    `;

    return backdrop;
  },

  // Crear acciones del modal
  createModalActions(actions) {
    const actionsHtml = actions.map(action => 
      `<button class="btn ${action.className || 'btn-primary'}" 
               data-action="${action.action}"
               ${action.closes ? 'data-modal-close' : ''}>
         ${action.text}
       </button>`
    ).join('');

    return `<div class="modal-footer">${actionsHtml}</div>`;
  },

  // Gestionar focus
  manageFocus(modal) {
    // Buscar elementos focusables
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    // Enfocar primer elemento
    focusableElements[0].focus();

    // Trap focus
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modal.addEventListener('keydown', function(e) {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    });
  },

  // Asegurar estilos CSS
  ensureModalStyles(backdrop, modal) {
    // Estilos para backdrop
    if (!backdrop.style.position) {
      Object.assign(backdrop.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: '1000',
        opacity: '0',
        transition: 'opacity 0.3s ease'
      });
    }

    // Estilos para modal
    if (!modal.style.backgroundColor) {
      Object.assign(modal.style, {
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'hidden',
        transform: 'scale(0.9)',
        transition: 'transform 0.3s ease'
      });
    }
  },

  // Métodos de utilidad
  isOpen() {
    return !!this.currentModal;
  },

  getCurrentModal() {
    return this.currentModal;
  },

  closeAll() {
    while (this.currentModal) {
      this.close(false);
    }
    this.modalStack = [];
    document.body.style.overflow = '';
  },

  // Configurar opciones globales
  configure(options) {
    Object.assign(this.config, options);
  }
};

// CSS dinámico para modales
const modalCSS = `
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .modal-backdrop.modal-visible {
    opacity: 1;
  }

  .modal-backdrop.modal-visible .modal {
    transform: scale(1);
  }

  .modal {
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    max-width: 90vw;
    max-height: 90vh;
    overflow: hidden;
    transform: scale(0.9);
    transition: transform 0.3s ease;
    outline: none;
  }

  .modal-small { max-width: 400px; }
  .modal-medium { max-width: 600px; }
  .modal-large { max-width: 800px; }
  .modal-xlarge { max-width: 1000px; }

  .modal-header {
    padding: 1.5rem;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-title {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 4px;
    transition: background-color 0.2s;
  }

  .modal-close:hover,
  .modal-close:focus {
    background-color: #f5f5f5;
    outline: 2px solid #007bff;
  }

  .modal-body {
    padding: 1.5rem;
    overflow-y: auto;
    max-height: 60vh;
  }

  .modal-footer {
    padding: 1rem 1.5rem;
    border-top: 1px solid #e5e5e5;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .hidden {
    display: none !important;
  }
`;

// Inyectar CSS si no existe
if (!document.getElementById('modal-system-styles')) {
  const style = document.createElement('style');
  style.id = 'modal-system-styles';
  style.textContent = modalCSS;
  document.head.appendChild(style);
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ModalSystem.init());
} else {
  ModalSystem.init();
}

// Exportar para uso global
window.ModalSystem = ModalSystem;

// Funciones de conveniencia globales
window.openModal = (id, options) => ModalSystem.open(id, options);
window.closeModal = () => ModalSystem.close();
window.createModal = (title, content, options) => ModalSystem.create(title, content, options);

console.log('🚀 Modal System loaded successfully!');