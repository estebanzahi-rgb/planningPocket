import pkg from '../package.json' assert { type: 'json' };

const isDev = import.meta.env.DEV;
const envApiUrl = import.meta.env.VITE_API_URL;
const envSocketUrl = import.meta.env.VITE_SOCKET_URL;

export const API_URL = envApiUrl || (isDev ? 'http://localhost:3001' : window.location.origin);
export const SOCKET_URL = envSocketUrl || API_URL;
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || pkg.version || '1.0.0';
export const MISSING_ENV_WARNING = !isDev && !envApiUrl ? 'VITE_API_URL no está configurada en el entorno de despliegue. Ajusta las vars de Vercel.' : null;
