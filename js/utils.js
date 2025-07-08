/* ============================================
   UTILS.JS - Funciones Utilitarias
   ============================================ */

/* ============================================
   VALIDACIÓN DE FORMULARIOS
   ============================================ */

const ValidationUtils = {
  // Validar email
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return { isValid: false, message: 'El email es obligatorio.' };
    }
    if (!emailRegex.test(email)) {
      return { isValid: false, message: 'Por favor, introduce un email válido.' };
    }
    return { isValid: true, message: '' };
  },

  // Validar contraseña
  validatePassword(password, minLength = 6) {
    if (!password.trim()) {
      return { isValid: false, message: 'La contraseña es obligatoria.' };
    }
    if (password.length < minLength) {
      return { isValid: false, message: `La contraseña debe tener al menos ${minLength} caracteres.` };
    }
    return { isValid: true, message: '' };
  },

  // Validar confirmación de contraseña
  validatePasswordConfirmation(password, confirmPassword) {
    if (!confirmPassword.trim()) {
      return { isValid: false, message: 'Confirma tu contraseña.' };
    }
    if (password !== confirmPassword) {
      return { isValid: false, message: 'Las contraseñas no coinciden.' };
    }
    return { isValid: true, message: '' };
  },

  // Validar campo requerido
  validateRequired(value, fieldName) {
    if (!value.trim()) {
      return { isValid: false, message: `${fieldName} es obligatorio.` };
    }
    return { isValid: true, message: '' };
  },

  // Limpiar errores de formulario
  clearFormErrors(form) {
    const errorElements = form.querySelectorAll('.form-error');
    const inputElements = form.querySelectorAll('.form-input');
    
    errorElements.forEach(el => el.textContent = '');
    inputElements.forEach(el => el.classList.remove('error'));
  },

  // Mostrar error en campo específico
  showFieldError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(`${fieldId}-error`);
    
    if (field) field.classList.add('error');
    if (errorElement) errorElement.textContent = message;
  }
};

/* ============================================
   SISTEMA DE NOTIFICACIONES
   ============================================ */

const NotificationSystem = {
  // Contenedor de notificaciones
  container: null,
  
  // Inicializar sistema
  init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = 'notification-container';
      this.container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        display: flex;
        flex-direction: column;
        gap: 10px;
      `;
      document.body.appendChild(this.container);
    }
  },

  // Mostrar notificación
  show(message, type = 'info', duration = 3000) {
    this.init();
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    this.container.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Ocultar después del tiempo especificado
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 500);
    }, duration);
    
    return notification;
  },

  // Métodos específicos por tipo
  success(message, duration = 3000) {
    return this.show(message, 'success', duration);
  },

  error(message, duration = 4000) {
    return this.show(message, 'error', duration);
  },

  info(message, duration = 3000) {
    return this.show(message, 'info', duration);
  }
};

/* ============================================
   UTILIDADES DE DOM
   ============================================ */

const DOMUtils = {
  // Encontrar elemento por ID con validación
  getElementById(id) {
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Elemento con ID '${id}' no encontrado`);
    }
    return element;
  },

  // Añadir event listener con validación
  addEventListener(elementId, event, callback) {
    const element = this.getElementById(elementId);
    if (element) {
      element.addEventListener(event, callback);
      return true;
    }
    return false;
  },

  // Alternar clase
  toggleClass(elementId, className) {
    const element = this.getElementById(elementId);
    if (element) {
      element.classList.toggle(className);
      return element.classList.contains(className);
    }
    return false;
  },

  // Mostrar/ocultar elemento
  show(elementId) {
    const element = this.getElementById(elementId);
    if (element) {
      element.classList.remove('hidden');
      element.style.display = '';
    }
  },

  hide(elementId) {
    const element = this.getElementById(elementId);
    if (element) {
      element.classList.add('hidden');
    }
  },

  // Limpiar contenido
  clearContent(elementId) {
    const element = this.getElementById(elementId);
    if (element) {
      element.innerHTML = '';
    }
  }
};

/* ============================================
   UTILIDADES DE ALMACENAMIENTO
   ============================================ */

const StorageUtils = {
  // Guardar en localStorage
  save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error('Error guardando en localStorage:', error);
      return false;
    }
  },

  // Cargar desde localStorage
  load(key, defaultValue = null) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch (error) {
      console.error('Error cargando desde localStorage:', error);
      return defaultValue;
    }
  },

  // Eliminar de localStorage
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('Error eliminando de localStorage:', error);
      return false;
    }
  },

  // Limpiar localStorage
  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error('Error limpiando localStorage:', error);
      return false;
    }
  }
};

/* ============================================
   UTILIDADES DE TIEMPO
   ============================================ */

const TimeUtils = {
  // Delay con Promise
  delay(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
  },

  // Debounce
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  },

  // Throttle
  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
};

/* ============================================
   UTILIDADES DE JUEGO
   ============================================ */

const GameUtils = {
  // Generar código de juego aleatorio
  generateGameCode(length = 7) {
    const chars = '0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  },

  // Mezclar array (Fisher-Yates)
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // Calcular progreso
  calculateProgress(completed, total) {
    if (total === 0) return 0;
    return Math.round((completed / total) * 100);
  },

  // Formatear puntuación
  formatScore(score) {
    if (score === 1) return '1 point';
    return `${score} points`;
  }
};

/* ============================================
   UTILIDADES DE ANIMACIÓN
   ============================================ */

const AnimationUtils = {
  // Fade in
  fadeIn(element, duration = 300) {
    element.style.opacity = '0';
    element.style.display = 'block';
    
    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.min(progress / duration, 1);
      
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  },

  // Fade out
  fadeOut(element, duration = 300) {
    let start = null;
    const animate = (timestamp) => {
      if (!start) start = timestamp;
      const progress = timestamp - start;
      const opacity = Math.max(1 - (progress / duration), 0);
      
      element.style.opacity = opacity;
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
        element.style.display = 'none';
      }
    };
    
    requestAnimationFrame(animate);
  },

  // Slide up
  slideUp(element, duration = 300) {
    element.style.transition = `all ${duration}ms ease-in-out`;
    element.style.transform = 'translateY(-100%)';
    element.style.opacity = '0';
    
    setTimeout(() => {
      element.style.transform = 'translateY(0)';
      element.style.opacity = '1';
    }, 10);
  }
};

/* ============================================
   UTILIDADES DE FORMULARIOS
   ============================================ */

const FormUtils = {
  // Serializar formulario
  serialize(form) {
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }
    
    return data;
  },

  // Rellenar formulario con datos
  populate(form, data) {
    Object.keys(data).forEach(key => {
      const field = form.querySelector(`[name="${key}"]`);
      if (field) {
        field.value = data[key];
      }
    });
  },

  // Resetear formulario
  reset(form) {
    form.reset();
    ValidationUtils.clearFormErrors(form);
  },

  // Validar formulario completo
  validateForm(form, validationRules) {
    let isValid = true;
    const errors = {};
    
    Object.keys(validationRules).forEach(fieldName => {
      const field = form.querySelector(`[name="${fieldName}"]`);
      const rules = validationRules[fieldName];
      
      if (field) {
        const value = field.value;
        
        for (let rule of rules) {
          const result = rule.validator(value);
          if (!result.isValid) {
            isValid = false;
            errors[fieldName] = result.message;
            ValidationUtils.showFieldError(fieldName, result.message);
            break;
          }
        }
      }
    });
    
    return { isValid, errors };
  }
};

/* ============================================
   INICIALIZACIÓN
   ============================================ */

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // Inicializar sistema de notificaciones
  NotificationSystem.init();
  
  // Configurar manejo global de errores
  window.addEventListener('error', (e) => {
    console.error('Error global:', e.error);
    // Uncomment para mostrar notificación de error en producción
    // NotificationSystem.error('Ha ocurrido un error inesperado');
  });
});

// Exportar para uso en otros archivos
window.BammoozleUtils = {
  ValidationUtils,
  NotificationSystem,
  DOMUtils,
  StorageUtils,
  TimeUtils,
  GameUtils,
  AnimationUtils,
  FormUtils
};