import { createSlice } from "@reduxjs/toolkit";

const getInitialSavedJobs = () => {
  try {
    // Clean up legacy un-scoped key to prevent cross-account pollution
    if (localStorage.getItem("savedJobs")) {
      localStorage.removeItem("savedJobs");
    }
    const rawUser = localStorage.getItem("user");
    if (rawUser) {
      const user = JSON.parse(rawUser);
      const userId = user?._id || user?.id;
      if (userId) {
        const saved = localStorage.getItem(`savedJobs_${userId}`);
        return saved ? JSON.parse(saved) : [];
      }
    }
    return [];
  } catch (error) {
    return [];
  }
};

const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    allJobs: [],
    allAdminJobs: [],
    singleJob: null,
    savedJobs: getInitialSavedJobs(),
    searchJobByText: "",
    allAppliedJobs: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    setAllJobs: (state, action) => {
      state.allJobs = action.payload;
    },
    setAllAdminJobs: (state, action) => {
      state.allAdminJobs = action.payload;
    },
    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },
    setSearchJobByText: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setSearchedQuery: (state, action) => {
      state.searchJobByText = action.payload;
    },
    setAllAppliedJobs: (state, action) => {
      state.allAppliedJobs = action.payload;
    },
    setSavedJobs: (state, action) => {
      state.savedJobs = action.payload || [];
    },
    loadUserSavedJobs: (state, action) => {
      const userId = action.payload;
      if (userId) {
        try {
          const saved = localStorage.getItem(`savedJobs_${userId}`);
          state.savedJobs = saved ? JSON.parse(saved) : [];
        } catch (e) {
          state.savedJobs = [];
        }
      } else {
        state.savedJobs = [];
      }
    },
    clearSavedJobs: (state) => {
      state.savedJobs = [];
    },
    toggleSaveJob: (state, action) => {
      let jobId, userId;
      if (typeof action.payload === "object" && action.payload !== null) {
        jobId = action.payload.jobId;
        userId = action.payload.userId;
      } else {
        jobId = action.payload;
        try {
          const user = JSON.parse(localStorage.getItem("user"));
          userId = user?._id || user?.id;
        } catch (e) {}
      }

      if (!jobId || !userId) return;

      const index = state.savedJobs.indexOf(jobId);
      if (index >= 0) {
        state.savedJobs.splice(index, 1);
      } else {
        state.savedJobs.push(jobId);
      }
      try {
        localStorage.setItem(`savedJobs_${userId}`, JSON.stringify(state.savedJobs));
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase("auth/setUser", (state, action) => {
      const user = action.payload;
      const userId = user?._id || user?.id;
      if (userId) {
        try {
          const saved = localStorage.getItem(`savedJobs_${userId}`);
          state.savedJobs = saved ? JSON.parse(saved) : [];
        } catch (e) {
          state.savedJobs = [];
        }
      } else {
        state.savedJobs = [];
      }
    });
  },
});

export const {
  setAllJobs,
  setAllAdminJobs,
  setSingleJob,
  setSearchJobByText,
  setSearchedQuery,
  setAllAppliedJobs,
  setSavedJobs,
  loadUserSavedJobs,
  clearSavedJobs,
  toggleSaveJob,
} = jobSlice.actions;
export default jobSlice.reducer;