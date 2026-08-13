import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import ApplicantsTable from "./ApplicantsTable";
import axios from "axios";
import { APPLICATION_API } from "@/utils/constant";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAllApplicants } from "@/Redux/applicationSlice";
import { Users, ArrowLeft, Briefcase, Sparkles, Loader2 } from "lucide-react";
import { Badge } from "../ui/badge";

const Applicants = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const { applicants } = useSelector((store) => store.application || {});

  useEffect(() => {
    const fetchAllApplicants = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${APPLICATION_API}/${params.id}/applicants`,
          {
            withCredentials: true,
          }
        );
        if (res.data?.success) {
          dispatch(setAllApplicants(res.data.job));
        }
      } catch (error) {
        console.error("Error fetching applicants:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAllApplicants();
    }
  }, [params.id, dispatch]);

  const totalApplicants = applicants?.application?.length || 0;
  const jobTitle = applicants?.title || "Job Position";

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/jobs")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#6A38C2] transition-colors cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-white border border-gray-200 group-hover:border-purple-200 group-hover:bg-purple-50 transition-all shadow-xs">
            <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-[#6A38C2] group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Back to Jobs</span>
        </button>

        {/* Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-semibold mb-3">
                <Users className="w-3.5 h-3.5" />
                <span>Candidate Pipeline</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Applicants for{" "}
                <span className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent">
                  {jobTitle}
                </span>
              </h1>
              <p className="text-sm text-gray-500 mt-1 max-w-xl">
                Review candidate resumes, applicant skill profiles, contact information, and manage hiring decisions.
              </p>
            </div>

            {/* Total Count Badge */}
            <div className="flex items-center gap-2 bg-gradient-to-br from-purple-50 to-indigo-50/60 px-5 py-3 rounded-2xl border border-purple-100/80 self-start md:self-auto shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                {totalApplicants}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">Total Applicants</p>
                <p className="text-[11px] text-gray-500">Submitted profiles</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applicants Table Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin text-[#6A38C2]" />
              <p className="text-sm font-medium">Loading candidate applications...</p>
            </div>
          ) : (
            <ApplicantsTable />
          )}
        </div>
      </main>
    </div>
  );
};

export default Applicants;
