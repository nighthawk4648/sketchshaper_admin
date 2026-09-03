import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig, loadEnv } from "vite";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    base:
      process.env.NODE_ENV === "production"
        ? "https://admin.sketchshaper.com/"
        : "/",
    resolve: {
      alias: [
        {
          find: "@",
          replacement: path.resolve(__dirname, "./src"),
        },
      ],
    },

    server: {
      proxy: {
        "/api": {
          target: env.VITE_PROXY_TARGET || "https://api.sketchshaper.com",
          changeOrigin: true,
          secure: false,
        },
      },
    },

    plugins: [react()],
  };
});
