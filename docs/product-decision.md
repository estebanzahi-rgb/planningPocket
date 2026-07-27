# Decisión de producto

## Decisión
La aplicación será simple y no requerirá almacenamiento persistente de sesiones.

## Justificación
- El propósito del MVP es validar la experiencia de Planning Poker de forma rápida.
- No es necesario guardar sesiones entre reinicios del servidor.
- Esto reduce complejidad y facilita el despliegue gratuito.

## Implicaciones
- Las sesiones existentes se perderán si el backend se reinicia.
- La experiencia sigue siendo válida para reuniones temporales y pruebas rápidas.
- El enfoque principal sigue siendo la votación en tiempo real y la lógica de revelación de votos.
