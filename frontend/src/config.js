// Public configuration only. Embarko packages replace flowfund-config.js.
export const apiBaseUrl = (window.FLOWFUND_API_BASE_URL || import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '');
