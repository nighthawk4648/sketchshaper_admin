import envConfig from "@/configs/envConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: [
    "AdminUser",
    "Slider",
    "category",
    "subCategories",
    "footerPage",
    "slider",
    "assets",
    "general-about-us",
    "application-settings",
    "social",
    "blogs",
    "supportedby",
    "innovative",
    "patreon",
    "contactMessages",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: envConfig.apiUrl,
    prepareHeaders: (headers, { getState }) => {
      const { auth } = getState().auth;
      let token = auth?.token;

      if (!token) {
        token = Cookies.get("token");
      }

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: () => ({}),
});
