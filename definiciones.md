# Planning Poker - Definiciones del proyecto

## 1. Objetivo
Crear una aplicación web simple y gratuita para sesiones de Planning Poker, donde un usuario crea una sesión, comparte un enlace o código, y el equipo entra a votar sobre Historias de Usuario sin necesidad de correo electrónico.

## 2. Problema a resolver
Las reuniones de estimación suelen perder tiempo en la organización de la sesión, la identificación de participantes y la recolección de votos. Esta app busca simplificar el proceso con una experiencia rápida y colaborativa.

## 3. Usuario principal
- Creador de sesión: inicia la reunión, define el nombre de la sesión y comparte el acceso.
- Participante: entra con un nombre, se une a la sesión y vota.

## 4. Funcionalidades principales del MVP
1. Crear una sesión sin autenticación.
2. Unirse a una sesión mediante código o enlace.
3. Ingresar un nombre de usuario temporal.
4. Votar usando una escala simple de Planning Poker.
5. Mostrar resultados de la votación.
6. Reiniciar la votación para una nueva ronda.

## 5. Reglas de negocio básicas
- No se requiere correo electrónico ni registro.
- La sesión debe ser accesible con un código corto o enlace compartible.
- Cada participante puede votar una sola vez por ronda.
- El creador puede reiniciar la ronda.
- Los votos se muestran de forma anónima por defecto, pero el creador puede ver quién votó si se desea en una futura iteración.

## 6. Stack tecnológico propuesto
### Opción recomendada (gratis y simple)
- Frontend: React + Vite
- Backend: Node.js + Express
- Base de datos: Supabase o Firebase
- Comunicaciones en tiempo real: Socket.io
- Despliegue: Vercel (frontend) + Render o Railway (backend)

### Alternativa más sencilla
- Frontend: Next.js
- Backend: Firebase
- Base de datos: Firestore
- Autenticación: no requerida
- Tiempo real: Firestore real-time listeners

## 7. Estructura sugerida del proyecto
```text
planning-poker/
├── docs/
│   ├── product-backlog.md
│   ├── user-stories.md
│   └── architecture.md
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── hooks/
│   ├── contexts/
│   ├── styles/
│   └── main.jsx
├── public/
├── package.json
├── vite.config.js
└── README.md
```

## 8. Historias de usuario iniciales
### HU1 - Crear sesión
Como creador de sesión, quiero crear una sesión nueva para iniciar una ronda de planning poker.

### HU2 - Unirse a sesión
Como participante, quiero unirme a una sesión con un código o enlace para votar.

### HU3 - Ingresar nombre
Como participante, quiero ingresar mi nombre para identificarse dentro de la sesión.

### HU4 - Votar
Como participante, quiero votar una historia para contribuir a la estimación del equipo.

### HU5 - Ver resultados
Como participante, quiero ver los resultados de la votación para entender el consenso del equipo.

### HU6 - Reiniciar ronda
Como creador de sesión, quiero reiniciar la ronda para preparar una nueva estimación.

## 9. Recomendación de arquitectura
- Frontend: React + Vite para una experiencia rápida y ligera.
- Backend: API REST + Socket.io para sincronizar votos en tiempo real.
- Estado global: React Context o Zustand.
- Persistencia: Supabase para sesiones, participantes y votos.
- Diseño: CSS simple o Tailwind.

## 10. Siguiente paso recomendado
Crear el MVP con:
1. Página de inicio para crear o unirse a una sesión.
2. Sala de votación con lista de participantes y botones de voto.
3. Integración de Socket.io para sincronizar en tiempo real.
4. Persistencia básica de sesiones.
