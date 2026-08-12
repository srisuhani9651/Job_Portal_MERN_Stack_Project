import { setSingleCompany } from "@/Redux/companySlice";
import { COMPANY_API } from "@/utils/constant";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetCompanyById = (companyId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!companyId) return;

    const fetchSingleCompany = async () => {
      try {
        const res = await axios.get(`${COMPANY_API}/get/Company/${companyId}`, {
          withCredentials: true,
        });
        if (res.data?.success) {
          dispatch(setSingleCompany(res.data.companyById));
        }
      } catch (error) {
        console.error("Error fetching single company:", error);
      }
    };

    fetchSingleCompany();
  }, [companyId, dispatch]);
};

export default useGetCompanyById;
