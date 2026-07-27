# Arquitectura propuesta

## Visión general
La aplicación estará compuesta por:
- Frontend: React + Vite para la interfaz.
- Backend: Node.js + Express + Socket.io para comunicación en tiempo real.
- Base de datos: Supabase o Firebase para almacenar sesiones y votos.

## Flujo principal
1. El creador crea una sesión y recibe un código.
2. El participante ingresa el código y su nombre.
3. Ambos se conectan a la misma sala a través de Socket.io.
4. Cada voto se sincroniza en tiempo real y se actualiza el resultado.

## Decisión recomendada
Para un inicio gratis y fácil, usar:
- Frontend: Vite + React
- Backend: Node.js + Express + Socket.io
- Base de datos: Supabase
- Despliegue: Vercel + Render
