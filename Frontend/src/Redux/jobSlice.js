import {createSlice} from "@reduxjs/toolkit"

const jobSlice = createSlice({
    name : "jobs",
    initialState: {
        allJobs : [],
        singleJob : {},
        isLoading : false,
        error : null
    },
    reducers : {
        setAllJobs : (state, action) =>{
            state.allJobs = action.payload;
        }
    }
})

export const {setAllJobs} = jobSlice.actions;
export default jobSlice.reducer