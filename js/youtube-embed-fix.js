/* ============================================
   CORRECCIÓN PARA EMBEDS DE YOUTUBE BLOQUEADOS
   ============================================ */

// Función mejorada para crear iframe de YouTube que evita bloqueos
function createYouTubeIframe(videoId, container) {
    console.log('🎬 Creando iframe de YouTube para:', videoId);
    
    // Limpiar container
    const existingIframe = container.querySelector('#youtube-iframe');
    if (existingIframe) {
        existingIframe.remove();
    }
    
    // Crear iframe con configuración optimizada
    const iframe = document.createElement('iframe');
    iframe.id = 'youtube-iframe';
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.minHeight = '315px';
    iframe.style.border = 'none';
    iframe.style.borderRadius = '8px';
    
    // CLAVE: Usar nocookie.youtube.com para mejor compatibilidad
    iframe.src = `https://www.youtube-nocookie.com/embed/${videoId}?` + new URLSearchParams({
        // Parámetros para mejor compatibilidad
        enablejsapi: '1',
        modestbranding: '1',
        rel: '0',                // No mostrar videos relacionados
        showinfo: '0',           // No mostrar info del video
        iv_load_policy: '3',     // No mostrar anotaciones
        disablekb: '0',          // Permitir controles de teclado
        controls: '1',           // Mostrar controles
        autoplay: '0',           // No autoplay
        mute: '0',               // No silenciar
        loop: '0',               // No loop
        fs: '1',                 // Permitir pantalla completa
        cc_load_policy: '0',     // No cargar subtítulos automáticamente
        playsinline: '1',        // Para móviles
        origin: window.location.origin  // Especificar origen
    }).toString();
    
    // Atributos importantes para compatibilidad
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    
    // Agregar al container
    container.appendChild(iframe);
    
    // Manejar errores de carga
    iframe.onerror = function() {
        console.error('❌ Error cargando iframe de YouTube');
        showYouTubeFallback(videoId, container);
    };
    
    // Timeout para detectar bloqueos
    setTimeout(() => {
        if (!iframe.contentWindow) {
            console.warn('⚠️ Posible bloqueo detectado, mostrando fallback');
            showYouTubeFallback(videoId, container);
        }
    }, 3000);
    
    return iframe;
}

// Fallback cuando el embed es bloqueado
function showYouTubeFallback(videoId, container) {
    console.log('🔄 Mostrando fallback para video bloqueado:', videoId);
    
    const fallbackDiv = document.createElement('div');
    fallbackDiv.className = 'youtube-fallback bg-gray-900 text-white p-8 rounded-lg flex flex-col items-center justify-center min-h-[315px]';
    fallbackDiv.innerHTML = `
        <div class="text-6xl mb-4">🚫</div>
        <h3 class="text-xl font-bold mb-4">Video no disponible en embed</h3>
        <p class="text-gray-300 mb-6 text-center">
            Este video no puede reproducirse directamente aquí debido a restricciones de YouTube.
        </p>
        <div class="space-y-3">
            <a href="https://www.youtube.com/watch?v=${videoId}" 
               target="_blank" 
               class="btn btn-red flex items-center space-x-2 px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors">
                <span>🎬</span>
                <span>Ver en YouTube</span>
                <span>↗️</span>
            </a>
            <button onclick="continueWithoutVideo('${videoId}')" 
                    class="btn btn-secondary px-6 py-3 rounded-lg bg-gray-600 hover:bg-gray-700 transition-colors">
                ⏭️ Continuar sin ver video
            </button>
        </div>
        <p class="text-xs text-gray-400 mt-4 text-center">
            💡 Tip: Algunos videos tienen restricciones del propietario
        </p>
    `;
    
    // Limpiar container y agregar fallback
    container.innerHTML = '';
    container.appendChild(fallbackDiv);
}

// Función para continuar sin ver el video
function continueWithoutVideo(videoId) {
    console.log('⏭️ Continuando sin video:', videoId);
    
    // Mostrar directamente la pregunta
    const questionContent = document.getElementById('video-question-content');
    if (questionContent) {
        questionContent.classList.remove('hidden');
        
        // Agregar nota explicativa
        const noteDiv = document.createElement('div');
        noteDiv.className = 'bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-4';
        noteDiv.innerHTML = `
            <div class="flex items-center space-x-2 text-yellow-800">
                <span>⚠️</span>
                <span class="font-medium">Respondiendo sin ver el video</span>
            </div>
            <p class="text-sm text-yellow-700 mt-1">
                Puedes responder basándote en el conocimiento general o abrir el video en YouTube.
            </p>
        `;
        
        questionContent.insertBefore(noteDiv, questionContent.firstChild);
    }
}

// Función para probar si un video es embeddable
async function testVideoEmbeddability(videoId) {
    try {
        const testUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
        const response = await fetch(testUrl, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.warn('No se pudo probar embeddability:', error);
        return false;
    }
}

// Función mejorada para extraer ID de YouTube con más patrones
function extractYouTubeVideoId(url) {
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/v\/([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]+)/
    ];
    
    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1]) {
            return match[1];
        }
    }
    
    return null;
}

// Función principal para mostrar video con manejo de errores mejorado
function showVideoWithFallback(video, container) {
    const videoId = extractYouTubeVideoId(video.videoUrl);
    
    if (!videoId) {
        console.error('❌ No se pudo extraer ID del video:', video.videoUrl);
        showYouTubeFallback('invalid', container);
        return;
    }
    
    console.log('🎬 Intentando cargar video:', videoId);
    
    // Intentar crear iframe
    try {
        createYouTubeIframe(videoId, container);
    } catch (error) {
        console.error('❌ Error creando iframe:', error);
        showYouTubeFallback(videoId, container);
    }
}

// Estilos CSS para el fallback
const fallbackStyles = document.createElement('style');
fallbackStyles.textContent = `
.youtube-fallback {
    background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    border: 2px dashed #666;
}

.youtube-fallback .btn {
    transition: all 0.3s ease;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    border: none;
    cursor: pointer;
}

.youtube-fallback .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.btn-red {
    background-color: #dc2626 !important;
    color: white !important;
}

.btn-red:hover {
    background-color: #b91c1c !important;
}

.btn-secondary {
    background-color: #6b7280 !important;
    color: white !important;
}

.btn-secondary:hover {
    background-color: #4b5563 !important;
}
`;

document.head.appendChild(fallbackStyles);

// Exportar funciones
window.YouTubeEmbedFix = {
    createYouTubeIframe,
    showYouTubeFallback,
    continueWithoutVideo,
    testVideoEmbeddability,
    extractYouTubeVideoId,
    showVideoWithFallback
};

console.log('🎬 YouTube Embed Fix cargado - maneja videos bloqueados');