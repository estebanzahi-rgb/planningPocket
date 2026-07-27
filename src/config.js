import pkg from '../package.json' assert { type: 'json' };

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || API_URL;
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || pkg.version || '1.0.0';
