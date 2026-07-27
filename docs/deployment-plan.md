# Plan de despliegue gratuito

## Objetivo
Preparar el MVP para que pueda subirse a un servidor gratuito sin comprometer el alcance inicial.

## Opción recomendada
- Frontend: Vercel
- Backend: Render o Railway
- Comunicación en tiempo real: Socket.io
- Persistencia para MVP: almacenamiento en memoria del servidor

## Consideraciones
- El backend debe ser simple y sin dependencias pesadas.
- La app debe funcionar con un solo proceso del servidor.
- La sesión debe ser suficiente para pruebas y reuniones rápidas.
- No se requiere base de datos externa para el MVP inicial.

## Recomendación técnica
- Mantener el backend en Node.js con Express + Socket.io.
- Usar el frontend React + Vite compilado para producción.
- Exponer el backend con una URL pública.
- Configurar el frontend para consumir esa URL en producción.

## Limitaciones esperadas en hosting gratuito
- El almacenamiento en memoria se reinicia si el servidor duerme o se reinicia.
- Para una versión más robusta, se puede migrar luego a Supabase o Firebase.
