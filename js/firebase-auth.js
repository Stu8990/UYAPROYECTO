/* ============================================
   FIREBASE AUTH CONTROLLER - CDN VERSION MEJORADO
   Archivo: js/firebase-auth.js
   ============================================ */

const FirebaseAuthController = {
  currentUser: null,
  isLoading: false,
  auth: null,
  db: null,
  googleProvider: null,

  init() {
    // Esperar a que Firebase esté disponible
    if (window.firebaseAuth && window.firebaseDB) {
      this.auth = window.firebaseAuth;
      this.db = window.firebaseDB;
      this.googleProvider = window.googleProvider;
      
      this.bindAuthStateListener();
      this.bindFormEvents();
      console.log('🔥 Firebase Auth Controller initialized');
    } else {
      // Retry en 100ms si Firebase no está listo
      setTimeout(() => this.init(), 100);
    }
  },

  // 🔧 FUNCIÓN MEJORADA
  bindAuthStateListener() {
    const { onAuthStateChanged } = window.firebaseModules;
    
    onAuthStateChanged(this.auth, (user) => {
      console.log('🔄 Auth state changed:', user ? user.email : 'No user');
      
      this.currentUser = user;
      this.updateUIForUser(user);
      
      if (user) {
        console.log('✅ User signed in:', user.email);
        this.createUserProfile(user);
        
        // 🔧 FIX: Usar nueva función mejorada
        this.handleSuccessfulLogin();
      } else {
        console.log('❌ User signed out');
        this.clearUserData();
      }
    });
  },

  bindFormEvents() {
    // Formulario principal de auth
    const authForm = document.getElementById('auth-form');
    if (authForm) {
      authForm.addEventListener('submit', (e) => this.handleAuthForm(e));
    }

    // Botón de Google Sign In
    const googleBtn = document.getElementById('google-signin-btn');
    if (googleBtn) {
      googleBtn.addEventListener('click', () => this.signInWithGoogle());
    }

    // Botón de logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => this.signOut());
    }
  },

  async handleAuthForm(e) {
    e.preventDefault();
    
    if (this.isLoading) return;
    
    const formData = new FormData(e.target);
    const email = formData.get('email');
    const password = formData.get('password');
    const confirmPassword = formData.get('confirm-password');
    const isLoginMode = this.isLoginMode();

    // Validaciones
    if (!this.validateForm(email, password, confirmPassword, isLoginMode)) {
      return;
    }

    this.setLoading(true);

    try {
      if (isLoginMode) {
        await this.signIn(email, password);
      } else {
        await this.signUp(email, password);
      }
    } catch (error) {
      this.handleAuthError(error);
    } finally {
      this.setLoading(false);
    }
  },

  // 🔧 FUNCIÓN MEJORADA
  async signUp(email, password) {
    const { createUserWithEmailAndPassword, updateProfile } = window.firebaseModules;
    
    try {
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // Actualizar perfil con nombre si se proporciona
      const displayName = this.extractNameFromEmail(email);
      await updateProfile(user, { displayName });

      // 🔧 NO redirigir aquí, dejar que onAuthStateChanged lo maneje
      this.showNotification('¡Cuenta creada exitosamente! 🎉', 'success');
      
      return user;
    } catch (error) {
      throw error;
    }
  },

  // 🔧 FUNCIÓN MEJORADA
  async signIn(email, password) {
    const { signInWithEmailAndPassword } = window.firebaseModules;
    
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      // 🔧 NO redirigir aquí, dejar que onAuthStateChanged lo maneje
      this.showNotification('¡Bienvenido de vuelta! 👋', 'success');
      
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // 🔧 FUNCIÓN MEJORADA
  async signInWithGoogle() {
    const { signInWithPopup } = window.firebaseModules;
    
    if (this.isLoading) return;
    
    this.setLoading(true);
    
    try {
      console.log('🔄 Iniciando Google Sign-In...');
      const result = await signInWithPopup(this.auth, this.googleProvider);
      const user = result.user;
      
      console.log('✅ Google Sign-In exitoso:', user.email);
      
      // 🔧 NO redirigir aquí, dejar que onAuthStateChanged lo maneje
      this.showNotification(`¡Hola ${user.displayName}! 👋`, 'success');
      
      return user;
    } catch (error) {
      console.error('❌ Error en Google Sign-In:', error);
      if (error.code !== 'auth/popup-closed-by-user') {
        this.handleAuthError(error);
      }
    } finally {
      this.setLoading(false);
    }
  },

  async signOut() {
    const { signOut } = window.firebaseModules;
    
    try {
      await signOut(this.auth);
      this.showNotification('Sesión cerrada correctamente', 'info');
      
      // Redirigir a index si estamos en páginas internas
      const currentPath = window.location.pathname;
      if (currentPath.includes('html/')) {
        window.location.href = '../index.html';
      }
    } catch (error) {
      console.error('Logout error:', error);
      this.showNotification('Error al cerrar sesión', 'error');
    }
  },

  async createUserProfile(user) {
    const { doc, setDoc, getDoc, updateDoc } = window.firebaseModules;
    
    try {
      const userRef = doc(this.db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || this.extractNameFromEmail(user.email),
          photoURL: user.photoURL || null,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          gamesPlayed: 0,
          totalScore: 0,
          achievements: [],
          preferences: {
            theme: 'default',
            soundEnabled: true,
            notifications: true
          }
        };

        await setDoc(userRef, userData);
        console.log('✅ Perfil de usuario creado');
      } else {
        // Actualizar último login
        await updateDoc(userRef, {
          lastLogin: new Date().toISOString()
        });
        console.log('✅ Perfil de usuario actualizado');
      }
    } catch (error) {
      console.error('Error creando perfil de usuario:', error);
    }
  },

  async saveGameResult(gameData) {
    if (!this.currentUser) return;

    const { doc, setDoc, getDoc, updateDoc, collection, addDoc } = window.firebaseModules;

    try {
      // Guardar resultado del juego
      const gameResult = {
        userId: this.currentUser.uid,
        gameType: gameData.gameMode || 'baamboozle',
        teams: gameData.teams,
        totalQuestions: gameData.questions.length,
        answeredQuestions: gameData.answeredQuestions.length,
        duration: gameData.duration || 0,
        winner: gameData.winner,
        createdAt: new Date().toISOString()
      };

      await addDoc(collection(this.db, 'gameResults'), gameResult);

      // Actualizar estadísticas del usuario
      const userRef = doc(this.db, 'users', this.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const userData = userSnap.data();
        const totalScore = userData.totalScore + gameData.teams.reduce((sum, team) => sum + team.score, 0);
        
        await updateDoc(userRef, {
          gamesPlayed: userData.gamesPlayed + 1,
          totalScore: totalScore,
          lastGameAt: new Date().toISOString()
        });
      }

      console.log('✅ Resultado del juego guardado');
    } catch (error) {
      console.error('Error guardando resultado del juego:', error);
    }
  },

  async getUserStats() {
    if (!this.currentUser) return null;

    const { doc, getDoc } = window.firebaseModules;

    try {
      const userRef = doc(this.db, 'users', this.currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error obteniendo estadísticas del usuario:', error);
      return null;
    }
  },

  async getUserGameHistory() {
    if (!this.currentUser) return [];

    const { collection, query, where, getDocs } = window.firebaseModules;

    try {
      const q = query(
        collection(this.db, 'gameResults'), 
        where('userId', '==', this.currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      
      const games = [];
      querySnapshot.forEach((doc) => {
        games.push({ id: doc.id, ...doc.data() });
      });

      return games.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      console.error('Error obteniendo historial de juegos:', error);
      return [];
    }
  },

  // 🔧 NUEVA FUNCIÓN - Manejar login exitoso
  handleSuccessfulLogin() {
    console.log('🎯 Manejando login exitoso...');
    
    // Pequeño delay para asegurar que el DOM esté actualizado
    setTimeout(() => {
      this.redirectToGameIfNeeded();
    }, 500);
  },

  // 🔧 FUNCIÓN COMPLETAMENTE REESCRITA
  redirectToGameIfNeeded() {
    console.log('🎯 Verificando si necesita redirección...');
    
    const currentPath = window.location.pathname;
    const formContent = document.getElementById('form-content');
    const landingContent = document.getElementById('landing-content');
    
    // Verificar si estamos en página de auth
    const isInAuthPage = (currentPath.includes('index.html') || 
                         currentPath === '/' || 
                         currentPath.endsWith('UYAPROYECTO/')) &&
                         formContent && 
                         !formContent.classList.contains('hidden');
    
    console.log('📍 Estado de la página:', {
      path: currentPath,
      isInAuthPage,
      formExists: !!formContent,
      formVisible: formContent ? !formContent.classList.contains('hidden') : false
    });
    
    if (isInAuthPage) {
      console.log('✅ Usuario logueado en página de auth, iniciando redirección...');
      
      // Ocultar formulario
      formContent.classList.add('hidden');
      
      // Mostrar mensaje de carga
      if (landingContent) {
        landingContent.innerHTML = `
          <div class="text-center text-white text-shadow">
            <div class="text-6xl mb-4">🎮</div>
            <h2 class="text-3xl font-bold mb-4">¡Hola ${this.currentUser.displayName || this.currentUser.email}!</h2>
            <p class="text-xl mb-4">Redirigiendo al juego...</p>
            <div class="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
          </div>
        `;
        landingContent.classList.remove('hidden');
      }
      
      // Mostrar notificación
      this.showNotification('¡Redirigiendo al juego! 🎮', 'success');
      
      // Redirección después de 2 segundos
      setTimeout(() => {
        let targetURL;
        
        if (currentPath.includes('/UYAPROYECTO/')) {
          // GitHub Pages
          targetURL = '/UYAPROYECTO/html/game-main.html';
        } else {
          // Localhost
          targetURL = 'html/game-main.html';
        }
        
        console.log('🚀 Redirigiendo a:', targetURL);
        window.location.href = targetURL;
      }, 2000);
    } else {
      console.log('❌ No es necesario redirigir');
    }
  },

  clearUserData() {
    // Limpiar datos del usuario del localStorage si es necesario
    localStorage.removeItem('userGameData');
    localStorage.removeItem('userPreferences');
  },

  // Utilidades
  validateForm(email, password, confirmPassword, isLoginMode) {
    const { ValidationUtils } = window.BammoozleUtils || {};
    
    if (!ValidationUtils) {
      console.error('ValidationUtils no encontrado');
      return false;
    }

    ValidationUtils.clearFormErrors(document.getElementById('auth-form'));

    let isValid = true;

    // Validar email
    const emailValidation = ValidationUtils.validateEmail(email);
    if (!emailValidation.isValid) {
      ValidationUtils.showFieldError('email', emailValidation.message);
      isValid = false;
    }

    // Validar password
    const passwordValidation = ValidationUtils.validatePassword(password, 6);
    if (!passwordValidation.isValid) {
      ValidationUtils.showFieldError('password', passwordValidation.message);
      isValid = false;
    }

    // Validar confirmación en modo registro
    if (!isLoginMode && confirmPassword !== undefined) {
      const confirmValidation = ValidationUtils.validatePasswordConfirmation(password, confirmPassword);
      if (!confirmValidation.isValid) {
        ValidationUtils.showFieldError('confirm-password', confirmValidation.message);
        isValid = false;
      }
    }

    return isValid;
  },

  handleAuthError(error) {
    console.error('Error de autenticación:', error);
    
    let message = 'Ocurrió un error. Por favor intenta de nuevo.';
    
    switch (error.code) {
      case 'auth/user-not-found':
        message = 'No se encontró una cuenta con este email.';
        break;
      case 'auth/wrong-password':
        message = 'Contraseña incorrecta.';
        break;
      case 'auth/email-already-in-use':
        message = 'Ya existe una cuenta con este email.';
        break;
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres.';
        break;
      case 'auth/invalid-email':
        message = 'Por favor ingresa un email válido.';
        break;
      case 'auth/too-many-requests':
        message = 'Demasiados intentos fallidos. Intenta más tarde.';
        break;
      case 'auth/popup-closed-by-user':
        message = 'Inicio de sesión cancelado.';
        break;
      case 'auth/network-request-failed':
        message = 'Error de conexión. Verifica tu internet.';
        break;
      case 'auth/unauthorized-domain':
        message = `❌ Dominio no autorizado: ${window.location.hostname}. Contacta al administrador.`;
        console.error('🔧 Solución: Añadir dominio en Firebase Console > Authentication > Settings > Authorized domains');
        break;
      default:
        message = error.message;
    }
    
    this.showNotification(message, 'error');
  },

  isLoginMode() {
    const confirmField = document.getElementById('confirm-password-field');
    return confirmField ? confirmField.classList.contains('hidden') : true;
  },

  extractNameFromEmail(email) {
    return email.split('@')[0].replace(/[^\w\s]/gi, '');
  },

  setLoading(loading) {
    this.isLoading = loading;
    const submitBtn = document.getElementById('submit-button');
    const googleBtn = document.getElementById('google-signin-btn');
    
    if (submitBtn) {
      submitBtn.disabled = loading;
      submitBtn.innerHTML = loading ? 
        '<span class="flex items-center justify-center"><svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Cargando...</span>' : 
        (this.isLoginMode() ? 'Iniciar Sesión' : 'Crear Cuenta');
    }
    
    if (googleBtn) {
      googleBtn.disabled = loading;
    }
  },

  updateUIForUser(user) {
    // Actualizar interfaz según estado de autenticación
    if (user) {
      // Usuario logueado
      this.showUserInfo(user);
      this.updateNavigationForUser(user);
    } else {
      // Usuario no logueado
      this.hideUserInfo();
      this.updateNavigationForGuest();
    }
  },

  showUserInfo(user) {
    const userInfoElements = document.querySelectorAll('.user-info');
    userInfoElements.forEach(el => {
      el.innerHTML = `
        <div class="flex items-center space-x-3 text-white">
          <img src="${user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.displayName || user.email) + '&background=8453DB&color=fff'}" 
               alt="Profile" 
               class="w-8 h-8 rounded-full border-2 border-white">
          <div class="hidden md:block">
            <p class="font-semibold text-sm">${user.displayName || this.extractNameFromEmail(user.email)}</p>
            <p class="text-xs opacity-75">${user.email}</p>
          </div>
          <button id="logout-btn" class="btn btn-sm bg-white/20 hover:bg-white/30 text-white border border-white/30">
            Salir
          </button>
        </div>
      `;
    });

    // Re-bind logout button
    const logoutBtns = document.querySelectorAll('#logout-btn');
    logoutBtns.forEach(btn => {
      btn.addEventListener('click', () => this.signOut());
    });
  },

  hideUserInfo() {
    const userInfoElements = document.querySelectorAll('.user-info');
    userInfoElements.forEach(el => {
      el.innerHTML = '';
    });
  },

  updateNavigationForUser(user) {
    // Ocultar botones de auth
    const signinBtns = document.querySelectorAll('.signin-btn');
    const joinBtns = document.querySelectorAll('.join-btn');
    
    signinBtns.forEach(btn => btn.style.display = 'none');
    joinBtns.forEach(btn => btn.style.display = 'none');
  },

  updateNavigationForGuest() {
    // Mostrar botones de auth
    const signinBtns = document.querySelectorAll('.signin-btn');
    const joinBtns = document.querySelectorAll('.join-btn');
    
    signinBtns.forEach(btn => btn.style.display = 'inline-block');
    joinBtns.forEach(btn => btn.style.display = 'inline-block');
  },

  showNotification(message, type = 'info') {
    if (window.BammoozleUtils?.NotificationSystem) {
      window.BammoozleUtils.NotificationSystem[type](message);
    } else {
      // Fallback simple
      console.log(`[${type.toUpperCase()}] ${message}`);
      
      // Crear notificación simple si no hay sistema
      const notification = document.createElement('div');
      notification.className = `fixed top-4 right-4 p-4 rounded-lg text-white font-semibold z-50 transform transition-all duration-300 translate-x-full`;
      notification.style.backgroundColor = type === 'error' ? '#FB4D3D' : type === 'success' ? '#95DB53' : '#0A91AB';
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      setTimeout(() => notification.classList.remove('translate-x-full'), 100);
      setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => document.body.removeChild(notification), 300);
      }, 3000);
    }
  },

  // Método público para integrar con el sistema de juego
  async onGameEnd(gameData) {
    if (this.currentUser) {
      await this.saveGameResult(gameData);
      this.showNotification('¡Juego guardado en tu perfil! 📊', 'success');
    }
  },

  // Método para obtener datos del usuario actual
  getCurrentUser() {
    return this.currentUser;
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!this.currentUser;
  },

  // 🔧 FUNCIÓN DE DEBUG
  debugAuthState() {
    console.log('🔧 DEBUG AUTH STATE:');
    console.log('- Current user:', this.currentUser);
    console.log('- Current path:', window.location.pathname);
    console.log('- Form visible:', !document.getElementById('form-content')?.classList.contains('hidden'));
    console.log('- Landing visible:', !document.getElementById('landing-content')?.classList.contains('hidden'));
  }
};

/* ============================================
   INTEGRACIÓN CON EL SISTEMA DE JUEGO
   ============================================ */

// Esperar a que el sistema de juego esté disponible
document.addEventListener('DOMContentLoaded', () => {
  // Integrar con GameController cuando esté disponible
  const integrationInterval = setInterval(() => {
    if (window.BammoozleGame?.GameController && FirebaseAuthController.isAuthenticated()) {
      const originalEndGame = window.BammoozleGame.GameController.endGame;
      
      if (originalEndGame && !originalEndGame._firebaseIntegrated) {
        window.BammoozleGame.GameController.endGame = function() {
          // Llamar al método original
          originalEndGame.call(this);
          
          // Guardar resultado en Firebase
          const gameData = {
            gameMode: window.BammoozleGame.GameData.gameMode,
            teams: window.BammoozleGame.GameData.teams,
            questions: window.BammoozleGame.GameData.questions,
            answeredQuestions: window.BammoozleGame.GameData.answeredQuestions,
            winner: window.BammoozleGame.GameData.teams.reduce((a, b) => a.score > b.score ? a : b),
            duration: Date.now() // Simplificado
          };
          
          FirebaseAuthController.onGameEnd(gameData);
        };
        
        // Marcar como integrado
        window.BammoozleGame.GameController.endGame._firebaseIntegrated = true;
        clearInterval(integrationInterval);
        console.log('✅ Firebase integrado con GameController');
      }
    }
  }, 500);
  
  // Limpiar interval después de 10 segundos
  setTimeout(() => clearInterval(integrationInterval), 10000);
});

/* ============================================
   INICIALIZACIÓN
   ============================================ */

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  FirebaseAuthController.init();
});

// Exportar para uso global
window.FirebaseAuth = FirebaseAuthController;

/* ============================================
   FUNCIONES HELPER GLOBALES
   ============================================ */

// Función para verificar autenticación antes de acceder a ciertas páginas
window.requireAuth = function() {
  if (!FirebaseAuthController.isAuthenticated()) {
    FirebaseAuthController.showNotification('Debes iniciar sesión para acceder', 'error');
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 2000);
    return false;
  }
  return true;
};

// Función para obtener datos del usuario
window.getCurrentUser = function() {
  return FirebaseAuthController.getCurrentUser();
};

// Función para logout rápido
window.logout = function() {
  FirebaseAuthController.signOut();
};

// Función para mostrar stats del usuario
window.showUserStats = async function() {
  const stats = await FirebaseAuthController.getUserStats();
  if (stats) {
    console.log('📊 Estadísticas del usuario:', stats);
    FirebaseAuthController.showNotification(`¡Has jugado ${stats.gamesPlayed} juegos! 🎮`, 'info');
  }
};

// 🔧 FUNCIÓN GLOBAL PARA DEBUG
window.debugAuth = function() {
  if (window.FirebaseAuth) {
    window.FirebaseAuth.debugAuthState();
  } else {
    console.log('❌ FirebaseAuth no disponible');
  }
};

// 🔧 FUNCIÓN MANUAL PARA FORZAR REDIRECCIÓN
window.forceRedirect = function() {
  console.log('🔧 Forzando redirección...');
  if (window.FirebaseAuth) {
    window.FirebaseAuth.redirectToGameIfNeeded();
  } else {
    const targetURL = window.location.pathname.includes('/UYAPROYECTO/') 
      ? '/UYAPROYECTO/html/game-main.html' 
      : 'html/game-main.html';
    window.location.href = targetURL;
  }
};

console.log('🔥 Firebase Auth System loaded successfully!');
console.log('💡 Funciones de debug disponibles:');
console.log('   - debugAuth() - Ver estado actual');
console.log('   - forceRedirect() - Forzar redirección manual');