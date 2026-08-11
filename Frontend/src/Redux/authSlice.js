import { createSlice } from "@reduxjs/toolkit";

// Retrieve persisted user from localStorage on app load
const getInitialUser = () => {
  try {
    const item = localStorage.getItem("user");
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error("Error reading user from localStorage:", error);
    return null;
  }
};

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    user: getInitialUser(),
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      try {
        if (action.payload) {
          localStorage.setItem("user", JSON.stringify(action.payload));
        } else {
          localStorage.removeItem("user");
        }
      } catch (error) {
        console.error("Error writing user to localStorage:", error);
      }
    },
  },
});

export const { setLoading, setUser } = authSlice.actions;
export default authSlice.reducer;