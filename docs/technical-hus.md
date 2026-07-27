# Historias técnicas aprobadas

## HT1 - Definir stack técnico base
Como equipo de desarrollo, quiero definir el stack técnico del MVP para implementar la aplicación con un lenguaje y arquitectura claros.

### Lenguaje y tecnología aprobada
- Frontend: JavaScript con React
- Backend: JavaScript con Node.js
- Runtime: Vite para desarrollo frontend
- Comunicación en tiempo real: Socket.io
- Persistencia: almacenamiento en memoria para el MVP inicial
- Despliegue: local para validación inicial

## HT2 - Implementar sesión de Planning Poker
Como desarrollador, quiero crear una sesión de Planning Poker con un código compartible para que el equipo pueda participar sin autenticación.

### Criterios de aceptación
- Se puede crear una sesión desde la interfaz.
- La sesión genera un código único.
- El creador puede compartir el código con los participantes.
- Los participantes pueden unirse a la sesión usando el código.

## HT3 - Implementar votación secreta
Como administrador de la sesión, quiero ocultar los votos hasta que los revele para evitar filtración prematura de resultados.

### Criterios de aceptación
- Los votos se envían y almacenan en la sesión.
- Los participantes ven solo su propio voto o el estado de votación.
- El administrador puede revelar los votos con un botón.
- El administrador puede reiniciar la ronda con un botón.

## HT4 - Implementar título editable de la historia
Como administrador, quiero modificar el título de la historia para identificar qué se está votando.

### Criterios de aceptación
- El título se muestra en la sala.
- El administrador puede editarlo desde la interfaz.
- El cambio se refleja en todos los participantes.

## HT5 - Implementar selección de votos estándar
Como participante, quiero votar con valores predefinidos de Planning Poker para facilitar la estimación.

### Criterios de aceptación
- Se muestran botones con los valores 1, 3, 5, 8 y 13.
- Al seleccionar un valor, se registra el voto.
- El participante puede cambiar su voto en una nueva ronda o antes de revelar.
