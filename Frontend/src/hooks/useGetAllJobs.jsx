import { setAllJobs } from '@/Redux/jobSlice';
import { JOB_API } from '@/utils/constant';
import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const useGetAllJobs = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    // Only fetch jobs if the user is authenticated / logged in
    if (!user) {
      dispatch(setAllJobs([]));
      return;
    }

    const fetchAllJobs = async () => {
      try {
        const res = await axios.get(`${JOB_API}/get`, {
          withCredentials: true,
        });
        if (res.data?.success) {
          dispatch(setAllJobs(res.data.jobs));
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchAllJobs();
  }, [user, dispatch]);
};

export default useGetAllJobs;