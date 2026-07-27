# Guía paso a paso para desplegar Planning Poker

## 1. Preparar el backend en Render

### Crear cuenta
1. Abre https://render.com
2. Crea una cuenta gratuita.
3. En el panel, selecciona New > Web Service.
4. Conecta tu cuenta de GitHub.
5. Selecciona el repositorio que contiene este proyecto.

### Configuración del servicio
Completa así:
- Name: planning-poker-api
- Runtime: Node
- Root Directory: server
- Build Command: npm install
- Start Command: node index.js

### Variables de entorno
No necesitas agregar ninguna para el MVP inicial.
Render asignará el puerto automáticamente.

### Desplegar
1. Haz clic en Create Web Service.
2. Espera a que termine la compilación.
3. Cuando termine, copia la URL pública del backend, por ejemplo:
   https://planning-poker-api.onrender.com

> Importante: el backend debe quedar escuchando en el puerto que Render asigne, y el proyecto ya está preparado para eso con el puerto desde process.env.PORT.

## 2. Preparar el frontend en Vercel

### Crear cuenta
1. Abre https://vercel.com
2. Crea una cuenta gratuita.
3. Conecta tu cuenta de GitHub.
4. Importa el repositorio del proyecto.

### Configuración del proyecto
En Vercel, completa:
- Framework Preset: Vite
- Root Directory: .
- Build Command: npm install && npm run build
- Output Directory: dist

### Variables de entorno
Agrega estas variables:
- Name: VITE_API_URL
- Value: https://planning-poker-api-nkef.onrender.com
- Name: VITE_SOCKET_URL
- Value: https://planning-poker-api-nkef.onrender.com

Por ejemplo:
- Name: VITE_API_URL
- Value: https://planning-poker-api-nkef.onrender.com
- Name: VITE_SOCKET_URL
- Value: https://planning-poker-api-nkef.onrender.com

### Desplegar
1. Haz clic en Deploy.
2. Espera a que termine la compilación.
3. Copia la URL pública del frontend.

## 3. Probar la aplicación en producción
1. Abre la URL del frontend en tu navegador.
2. Crea una sesión.
3. Abre otra ventana o navegador.
4. Entra con el mismo código.
5. Prueba votar, revelar y reiniciar.

## 4. Recomendaciones útiles
- Si el backend se reinicia, las sesiones en memoria se pueden perder. Eso es aceptable para este MVP.
- Si quieres un paso siguiente, se puede migrar luego a una base de datos como Supabase o Firebase.

## 5. Estructura recomendada para el repositorio
Mantén el proyecto así:
- raíz: frontend React + Vite
- carpeta server: backend Node.js + Socket.io

## 6. Confirmación final
Si todo está bien, tendrás:
- un frontend publicado en Vercel
- un backend publicado en Render
- una app funcional para Planning Poker sin registro
