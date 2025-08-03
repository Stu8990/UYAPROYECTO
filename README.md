# The Verb Journey - Bamboozle

Este proyecto es una pequeña aplicación web enfocada en el aprendizaje mediante un juego de preguntas.

## Estructura del proyecto

- **css/**: hojas de estilo usadas por la aplicación.
- **html/**: páginas secundarias como tableros y vista de estudio.
- **js/**: lógica del juego y utilidades.
- **index.html**: página principal desde la que se inicia la aplicación.

## Características implementadas

- Navegación entre las distintas páginas: landing, juego principal, tablero,
  modo estudio y editor.
- Sistema de atajos de teclado centralizado (`js/keyboard-shortcuts.js`) con
  una lista completa en `atajos.txt`.
- Tablero de juego dinámico con casillas interactivas y control de puntajes para
  dos equipos.
- Modo de estudio para repasar las preguntas.
- Editor de preguntas accesible mediante el nuevo botón **Edit** en
  `game-main.html`.
- Sistema de tooltips y notificaciones para mejorar la experiencia de usuario.
- Utilidades varias para validaciones de formularios y almacenamiento local.

## Probar la aplicación

Abre el archivo `index.html` con tu navegador favorito. También puedes utilizar una extensión de servidor local (como Live Server) para actualizar automáticamente los cambios.
otra opcion actualizada es el aceso por deployments de la plataforma de github

## Futuras mejoras

- Agregar más preguntas o categorías.
- Conectar con un backend para guardar puntuaciones.
- Implementar autenticación de usuarios.
