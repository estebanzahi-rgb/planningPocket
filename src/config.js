import pkg from '../package.json' assert { type: 'json' };

const isDev = import.meta.env.DEV;
const envApiUrl = import.meta.env.VITE_API_URL;
const envSocketUrl = import.meta.env.VITE_SOCKET_URL;

export const API_URL = envApiUrl || (isDev ? 'http://localhost:3001' : null);
export const SOCKET_URL = envSocketUrl || API_URL;
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || pkg.version || '1.0.0';

const missingApi = !isDev && !envApiUrl;
const missingSocket = !isDev && !envSocketUrl;
const localhostApi = !isDev && envApiUrl?.includes('localhost');
const localhostSocket = !isDev && envSocketUrl?.includes('localhost');

export const MISSING_ENV_WARNING = missingApi || missingSocket
  ? 'En producción debes configurar VITE_API_URL y VITE_SOCKET_URL en Vercel. No uses localhost.'
  : localhostApi || localhostSocket
  ? 'Las variables VITE_API_URL o VITE_SOCKET_URL están apuntando a localhost. Cámbialas por la URL del backend en Render.'
  : null;
