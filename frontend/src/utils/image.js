export const getImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const API = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  // Ensure we don't have duplicate slashes
  const baseUrl = API.endsWith('/') ? API.slice(0, -1) : API;
  const relativeUrl = url.startsWith('/') ? url : `/${url}`;
  return `${baseUrl}${relativeUrl}`;
};
