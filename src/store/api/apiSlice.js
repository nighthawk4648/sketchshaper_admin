import envConfig from "@/configs/envConfig";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logOut } from "./auth/authSlice";

// The admin session lives in an HttpOnly cookie the browser sends by itself
const rawBaseQuery = fetchBaseQuery({
  baseUrl: envConfig.apiUrl,
  credentials: "include",
});

// A missing or expired session sends the admin back to the login page
const baseQuery = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  if (result.error?.status === 401) api.dispatch(logOut());
  return result;
};

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
  baseQuery,
  endpoints: () => ({}),
});
