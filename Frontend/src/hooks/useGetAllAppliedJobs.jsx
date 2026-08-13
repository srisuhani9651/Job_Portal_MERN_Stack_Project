import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAllAppliedJobs } from "@/Redux/jobSlice";
import { APPLICATION_API } from "@/utils/constant";

const useGetAllAppliedJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user) return;

    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${APPLICATION_API}/get/appliedJobs`, {
          withCredentials: true,
        });

        if (res.data?.success) {
          const appliedList = res.data.application || res.data.appliedJobs || [];
          dispatch(setAllAppliedJobs(appliedList));
        }
      } catch (error) {
        console.error("Error fetching applied jobs:", error);
      }
    };

    fetchAppliedJobs();
  }, [user, dispatch]);
};

export default useGetAllAppliedJobs;