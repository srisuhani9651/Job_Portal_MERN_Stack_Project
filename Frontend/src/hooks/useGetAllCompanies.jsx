import { setCompanies } from "@/Redux/companySlice";
import { COMPANY_API } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetAllCompanies = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth);

  useEffect(() => {
    if (!user) return;

    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${COMPANY_API}/get/Companies`, {
          withCredentials: true,
        });
        if (res.data?.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, [user, dispatch]);
};

export default useGetAllCompanies;
