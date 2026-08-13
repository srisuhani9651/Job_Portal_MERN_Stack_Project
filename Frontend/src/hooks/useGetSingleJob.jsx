import { setSingleJob } from "@/Redux/jobSlice";
import { JOB_API } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetSingleJob = (jobId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!jobId) return;

    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API}/get/job/${jobId}`, {
          withCredentials: true,
        });
        if (res.data?.success) {
          dispatch(setSingleJob(res.data.job));
        }
      } catch (error) {
        console.error("Error fetching single job:", error);
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch]);
};

export default useGetSingleJob;
