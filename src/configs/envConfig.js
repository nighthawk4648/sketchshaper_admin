const {
  VITE_API_URL,
  VITE_IMG_URL,
  VITE_LOCAL_API_URL,
  VITE_PROD_API_URL,
  VITE_LOCAL_IMG_URL,
  VITE_PROD_IMG_URL,
} = import.meta.env;

// Normalize URLs to avoid trailing slashes causing double-slash issues (e.g. /api//assets)
const normalizeApiUrl = (url) => {
  if (!url) return '';
  return url.replace(/\/+$/, '');
};

const normalizeImgUrl = (url) => {
  if (!url) return '';
  return url.endsWith('/') ? url : `${url}/`;
};

const defaultDevApi = 'http://localhost:5000/api';
const defaultProdApi = 'https://api.sketchshaper.com/api';

const defaultDevImg = 'http://localhost:5000/api/uploads/';
const defaultProdImg = 'https://api.sketchshaper.com/api/uploads/';

const rawApiUrl =
  VITE_API_URL ||
  (import.meta.env.DEV
    ? VITE_LOCAL_API_URL || defaultDevApi
    : VITE_PROD_API_URL || defaultProdApi);

const rawImgUrl =
  VITE_IMG_URL ||
  (import.meta.env.DEV
    ? VITE_LOCAL_IMG_URL || defaultDevImg
    : VITE_PROD_IMG_URL || defaultProdImg);

const envConfig = {
  apiUrl: normalizeApiUrl(rawApiUrl),
  apiImgUrl: normalizeImgUrl(rawImgUrl),
};

export default envConfig;
