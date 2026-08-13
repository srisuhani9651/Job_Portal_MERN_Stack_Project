import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice.js";
import jobSlice from "./jobSlice.js";
import companySlice from "./companySlice.js";
import applicationSlice from "./applicationSlice.js";

const store = configureStore({
  reducer: {
    auth: authSlice,
    jobs: jobSlice,
    company: companySlice,
    application: applicationSlice,
  },
});

export default store