/* ============================================
   SCRIPT DE DEBUG PARA VIDEOS DE YOUTUBE
   ============================================ */

// Función para verificar URLs de YouTube
function validateYouTubeURL(url) {
    const patterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
        /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]+)/
    ];
    
    for (let pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return {
                isValid: true,
                videoId: match[1],
                embedUrl: `https://www.youtube.com/embed/${match[1]}`
            };
        }
    }
    
    return { isValid: false, videoId: null, embedUrl: null };
}

// Función para debugging de videos
function debugVideoData() {
    console.log('=== DEBUG VIDEO DATA ===');
    
    // Verificar si existe el controlador de video
    if (typeof VideoGameController !== 'undefined') {
        console.log('✅ VideoGameController encontrado');
        console.log('Videos cargados:', VideoGameController.videoData?.length || 0);
        
        // Verificar cada video
        if (VideoGameController.videoData) {
            VideoGameController.videoData.forEach((video, index) => {
                console.log(`\n--- Video ${index + 1} ---`);
                console.log('ID:', video.id);
                console.log('Título:', video.title);
                console.log('URL:', video.videoUrl);
                
                if (video.videoUrl) {
                    const validation = validateYouTubeURL(video.videoUrl);
                    console.log('URL válida:', validation.isValid ? '✅' : '❌');
                    if (validation.isValid) {
                        console.log('Video ID extraído:', validation.videoId);
                        console.log('URL de embed:', validation.embedUrl);
                    }
                } else {
                    console.log('❌ No hay URL configurada');
                }
            });
        }
    } else {
        console.log('❌ VideoGameController no encontrado');
    }
    
    // Verificar elementos del DOM
    console.log('\n=== ELEMENTOS DOM ===');
    console.log('Video modal:', document.getElementById('video-modal') ? '✅' : '❌');
    console.log('Video container:', document.getElementById('video-container') ? '✅' : '❌');
    console.log('Video overlay:', document.getElementById('video-overlay') ? '✅' : '❌');
    
    console.log('=== FIN DEBUG ===');
}

// Función para forzar actualización de tiles completados
function fixCompletedTiles() {
    console.log('🔧 Arreglando tiles completados...');
    
    const completedTiles = document.querySelectorAll('.video-tile.completed');
    completedTiles.forEach((tile, index) => {
        console.log(`Arreglando tile completado ${index + 1}`);
        
        // Forzar recalculo de estilos
        tile.style.display = 'none';
        tile.offsetHeight; // Trigger reflow
        tile.style.display = 'block';
        
        // Asegurar que no sean clickeables
        tile.style.pointerEvents = 'none';
        tile.style.cursor = 'not-allowed';
        
        // Agregar overlay si no existe
        if (!tile.querySelector('.completed-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'completed-overlay absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center text-white font-bold text-xl rounded-xl z-10';
            overlay.textContent = 'COMPLETED';
            tile.appendChild(overlay);
        }
    });
    
    console.log(`✅ ${completedTiles.length} tiles completados arreglados`);
}

// Función para probar carga de video específico
function testVideo(videoId) {
    console.log(`🧪 Probando video ${videoId}...`);
    
    if (typeof VideoGameController !== 'undefined') {
        const video = VideoGameController.videoData?.find(v => v.id == videoId);
        if (video) {
            console.log('Video encontrado:', video);
            VideoGameController.selectVideo(videoId);
        } else {
            console.log('❌ Video no encontrado');
        }
    } else {
        console.log('❌ VideoGameController no disponible');
    }
}

// Exponer funciones globalmente para debugging
window.debugVideo = {
    validate: validateYouTubeURL,
    debugData: debugVideoData,
    fixTiles: fixCompletedTiles,
    testVideo: testVideo
};

console.log('🔧 Video Debug Tools cargadas. Usa window.debugVideo para debugging.');
console.log('Comandos disponibles:');
console.log('- debugVideo.debugData() - Mostrar info de videos');
console.log('- debugVideo.fixTiles() - Arreglar tiles completados');
console.log('- debugVideo.testVideo(id) - Probar video específico');
console.log('- debugVideo.validate(url) - Validar URL de YouTube');