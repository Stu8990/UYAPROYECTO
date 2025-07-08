/* ============================================
   SISTEMA DE TOOLTIPS AVANZADO
   ============================================ */

const TooltipSystem = {
  init() {
    this.bindTooltipEvents();
    this.createMobileTooltips();
  },

  bindTooltipEvents() {
    // Para dispositivos móviles, convertir hover en click
    if (this.isMobile()) {
      const helpTooltips = document.querySelectorAll('.help-tooltip');
      
      helpTooltips.forEach(tooltip => {
        tooltip.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          this.toggleMobileTooltip(tooltip);
        });
      });

      // Cerrar tooltips al hacer clic fuera
      document.addEventListener('click', () => {
        this.closeAllMobileTooltips();
      });
    }
  },

  isMobile() {
    return window.innerWidth <= 768 || 'ontouchstart' in window;
  },

  toggleMobileTooltip(tooltipElement) {
    const content = tooltipElement.querySelector('.tooltip-content');
    const isVisible = content.style.visibility === 'visible';
    
    // Cerrar otros tooltips abiertos
    this.closeAllMobileTooltips();
    
    if (!isVisible) {
      content.style.visibility = 'visible';
      content.style.opacity = '1';
      tooltipElement.classList.add('active');
    }
  },

  closeAllMobileTooltips() {
    const tooltips = document.querySelectorAll('.help-tooltip');
    tooltips.forEach(tooltip => {
      const content = tooltip.querySelector('.tooltip-content');
      content.style.visibility = 'hidden';
      content.style.opacity = '0';
      tooltip.classList.remove('active');
    });
  },

  createMobileTooltips() {
    if (!this.isMobile()) return;

    // Añadir indicador visual para móviles
    const helpCircles = document.querySelectorAll('.help-circle');
    helpCircles.forEach(circle => {
      circle.setAttribute('title', 'Toca para más información');
      circle.style.cursor = 'pointer';
    });
  },

  // Crear tooltip dinámico
  createTooltip(element, content, position = 'top') {
    const tooltip = document.createElement('div');
    tooltip.className = `help-tooltip tooltip-${position}`;
    
    const circle = document.createElement('div');
    circle.className = 'help-circle';
    circle.textContent = '?';
    
    const tooltipContent = document.createElement('div');
    tooltipContent.className = 'tooltip-content';
    tooltipContent.innerHTML = content;
    
    tooltip.appendChild(circle);
    tooltip.appendChild(tooltipContent);
    
    element.appendChild(tooltip);
    
    return tooltip;
  },

  // Mostrar tooltip temporal (para notificaciones)
  showTemporaryTooltip(element, message, duration = 3000) {
    const existingTooltip = element.querySelector('.temp-tooltip');
    if (existingTooltip) {
      existingTooltip.remove();
    }

    const tooltip = document.createElement('div');
    tooltip.className = 'temp-tooltip';
    tooltip.style.cssText = `
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    tooltip.textContent = message;

    element.style.position = 'relative';
    element.appendChild(tooltip);

    // Mostrar
    setTimeout(() => {
      tooltip.style.opacity = '1';
    }, 10);

    // Ocultar y eliminar
    setTimeout(() => {
      tooltip.style.opacity = '0';
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, 300);
    }, duration);
  }
};

// Inicializar sistema de tooltips cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  TooltipSystem.init();
});

// Exportar para uso global
window.TooltipSystem = TooltipSystem;

// Función helper para crear tooltips rápidamente
window.addTooltip = function(selector, content, position = 'top') {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
    TooltipSystem.createTooltip(element, content, position);
  });
};

// Ejemplos de uso para desarrollo:
// addTooltip('.my-button', 'Este botón hace algo importante');
// TooltipSystem.showTemporaryTooltip(element, 'Acción completada!');