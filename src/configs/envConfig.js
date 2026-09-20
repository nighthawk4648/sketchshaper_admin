const {
  VITE_API_URL,
  VITE_IMG_URL,
  VITE_LOCAL_API_URL,
  VITE_PROD_API_URL,
  VITE_LOCAL_IMG_URL,
  VITE_PROD_IMG_URL,
} = import.meta.env;

const envConfig = {
  apiUrl:
    VITE_API_URL ||
    (import.meta.env.DEV
      ? "/api/"
      : VITE_PROD_API_URL || "https://api.sketchshaper.com/api/"),
  apiImgUrl:
    VITE_IMG_URL ||
    (import.meta.env.DEV
      ? VITE_LOCAL_IMG_URL || "https://api.sketchshaper.com/api/uploads/"
      : VITE_PROD_IMG_URL || "https://api.sketchshaper.com/api/uploads/"),
};

export default envConfig;
