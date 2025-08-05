/* ============================================
   CORRECCIÓN PARA VIDEO-GAME-CONTROLLER.JS
   ============================================ */

// Función mejorada para mostrar modal de video
// En tu video-game-controller.js, reemplaza la función showVideoModal:
function showVideoModal(video) {
    const modal = document.getElementById('video-modal');
    const container = document.getElementById('video-container');
    
    if (!modal || !container) {
        console.error('❌ Elementos del modal no encontrados');
        return;
    }
    
    // Usar el nuevo sistema de YouTube con fallback
    if (window.YouTubeEmbedFix) {
        window.YouTubeEmbedFix.showVideoWithFallback(video, container);
    } else {
        console.error('❌ YouTubeEmbedFix no está cargado');
    }
    
    // Configurar resto del modal...
    const questionText = document.getElementById('video-question-text');
    const modalTitle = document.getElementById('video-modal-title');
    
    if (modalTitle) modalTitle.textContent = `🎬 ${video.title}`;
    if (questionText) questionText.textContent = video.question;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Función para extraer ID de video de YouTube
function extractYouTubeVideoId(url) {
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/
    ];
    
    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return match[1];
        }
    }
    
    return null;
}

// Función para mostrar error de video de forma segura
function showVideoError(message) {
    console.error('❌ Error de video:', message);
    
    const videoOverlay = document.getElementById('video-overlay');
    const videoElement = document.getElementById('challenge-video');
    
    // Solo mostrar overlay si existe
    if (videoOverlay) {
        videoOverlay.classList.remove('hidden');
        
        // Actualizar mensaje de error si es posible
        const errorText = videoOverlay.querySelector('p');
        if (errorText) {
            errorText.textContent = message;
        }
    }
    
    // Ocultar video element si existe
    if (videoElement) {
        videoElement.classList.add('hidden');
    }
}

// Función para cerrar modal de forma segura
function closeVideoModal() {
    const modal = document.getElementById('video-modal');
    
    if (modal) {
        modal.classList.add('hidden');
    }
    
    document.body.style.overflow = '';
    
    // Limpiar iframe de YouTube
    const iframe = document.getElementById('youtube-iframe');
    if (iframe) {
        iframe.remove();
    }
    
    // Limpiar video element
    const videoElement = document.getElementById('challenge-video');
    if (videoElement) {
        videoElement.src = '';
        videoElement.classList.add('hidden');
    }
}

// Función mejorada para marcar video como completado
function markVideoAsCompleted(videoId) {
    console.log('✅ Marcando video como completado:', videoId);
    
    const tile = document.querySelector(`[data-video-id="${videoId}"]`);
    if (tile) {
        // Agregar clase completed
        tile.classList.add('completed');
        
        // Agregar overlay de completado si no existe
        if (!tile.querySelector('.completed-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'completed-overlay absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white font-bold text-xl rounded-xl z-10';
            overlay.textContent = 'COMPLETED';
            tile.appendChild(overlay);
        }
        
        // Prevenir clicks futuros
        tile.style.pointerEvents = 'none';
        tile.style.cursor = 'not-allowed';
        
        console.log('✅ Video marcado como completado exitosamente');
    } else {
        console.warn('⚠️ No se encontró tile para video:', videoId);
    }
}

// Verificación de elementos DOM al cargar
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Verificando elementos del DOM...');
    
    const requiredElements = [
        'video-modal',
        'video-container', 
        'video-question-text',
        'video-modal-title'
    ];
    
    let missingElements = [];
    
    requiredElements.forEach(elementId => {
        if (!document.getElementById(elementId)) {
            missingElements.push(elementId);
        }
    });
    
    if (missingElements.length > 0) {
        console.error('❌ Elementos faltantes:', missingElements);
    } else {
        console.log('✅ Todos los elementos del DOM están presentes');
    }
    
    // Verificar si video-overlay existe (opcional)
    const videoOverlay = document.getElementById('video-overlay');
    if (!videoOverlay) {
        console.warn('⚠️ video-overlay no encontrado (puede estar comentado)');
    }
});

// Exportar funciones para uso global
window.VideoUtils = {
    showVideoModal,
    closeVideoModal,
    markVideoAsCompleted,
    extractYouTubeVideoId,
    showVideoError
};

console.log('🎬 Video Controller Fix cargado exitosamente');