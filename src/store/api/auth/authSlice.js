import { isJson } from "@/utils/isJson";
import { createSlice } from "@reduxjs/toolkit";

const user =
  typeof window !== "undefined" ? localStorage.getItem("user") : null;
const parsed = isJson(user) ? JSON.parse(user) : null;
// Support both flat user payload and legacy { auth: payload } wrapper
const storedUser = parsed?.auth ? parsed.auth : parsed;

const initialStateSchema = {
  auth: {
    id: "",
    email: "",
    role: {
      id: "",
      name: "",
    },
  },
  isAuth: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState:
    // Only a hint for the first render; the first 401 from the API signs the admin out
    storedUser?.email
      ? { auth: { id: storedUser.id, email: storedUser.email }, isAuth: true }
      : initialStateSchema,
  reducers: {
    setUser: (state, action) => {
      const payload = action.payload || {};
      // Not secret: the session itself is the HttpOnly cookie set by the API
      localStorage.setItem(
        "user",
        JSON.stringify({ id: payload.id, email: payload.email }),
      );

      state.auth = payload;
      state.isAuth = true;
    },

    logOut: (state) => {
      localStorage.removeItem("user");

      state.auth = initialStateSchema.auth;
      state.isAuth = false;
    },
  },
});

export const { setUser, logOut } = authSlice.actions;
export default authSlice.reducer;
