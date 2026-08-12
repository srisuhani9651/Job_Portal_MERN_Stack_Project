import { setAllAdminJobs } from "@/Redux/jobSlice";
import { JOB_API } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllAdminJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user) return;

    const fetchAllAdminJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API}/recruiter/jobs`, {
          withCredentials: true,
        });

        if (res.data?.success && res.data?.createdJobs?.length > 0) {
          dispatch(setAllAdminJobs(res.data.createdJobs));
        } else {
          // If no recruiter-specific jobs found, fetch all jobs already in database
          const allJobsRes = await axios.get(`${JOB_API}/get`, {
            withCredentials: true,
          });
          if (allJobsRes.data?.success) {
            dispatch(setAllAdminJobs(allJobsRes.data.jobs || []));
          }
        }
      } catch (error) {
        console.error("Error fetching admin jobs:", error);
        // Fallback to get all jobs API
        try {
          const allJobsRes = await axios.get(`${JOB_API}/get`, {
            withCredentials: true,
          });
          if (allJobsRes.data?.success) {
            dispatch(setAllAdminJobs(allJobsRes.data.jobs || []));
          }
        } catch (err) {
          console.error("Error in fallback jobs fetch:", err);
        }
      }
    };

    fetchAllAdminJobs();
  }, [user, dispatch]);
};

export default useGetAllAdminJobs;
