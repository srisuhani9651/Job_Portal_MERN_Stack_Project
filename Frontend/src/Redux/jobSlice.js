import { createSlice } from "@reduxjs/toolkit";

const getInitialSavedJobs = () => {
  try {
    const saved = localStorage.getItem("savedJobs");
    return saved ? JSON.parse(saved) : [];
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
    toggleSaveJob: (state, action) => {
      const jobId = action.payload;
      const index = state.savedJobs.indexOf(jobId);
      if (index >= 0) {
        state.savedJobs.splice(index, 1);
      } else {
        state.savedJobs.push(jobId);
      }
      try {
        localStorage.setItem("savedJobs", JSON.stringify(state.savedJobs));
      } catch (e) {
        console.error("Error saving to localStorage:", e);
      }
    },
  },
});

export const {
  setAllJobs,
  setAllAdminJobs,
  setSingleJob,
  setSearchJobByText,
  toggleSaveJob,
} = jobSlice.actions;
export default jobSlice.reducer;