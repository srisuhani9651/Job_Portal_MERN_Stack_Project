import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./Footer";
import AppliedJobTable from "./AppliedJobTable";
import useGetAllAppliedJobs from "@/hooks/useGetAllAppliedJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Briefcase, CheckCircle2, Sparkles, ArrowLeft } from "lucide-react";

const AppliedJobs = () => {
  useGetAllAppliedJobs();
  const { user } = useSelector((store) => store.auth);
  const { allAppliedJobs = [] } = useSelector((store) => store.jobs || {});
  const navigate = useNavigate();

  useEffect(() => {
    if (
      user &&
      (user?.role === "Recruiter" || user?.role?.toLowerCase() === "recruiter")
    ) {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  const totalApplications = allAppliedJobs.length;

  return (
    <div className="min-h-screen bg-gray-50/60 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-6">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-semibold mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Student Workspace • Application Tracker</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  My Applied{" "}
                  <span className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent">
                    Jobs
                  </span>
                </h1>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">
                  Track the real-time status of your job applications, view company hiring updates, and review interview progress.
                </p>
              </div>

              {/* Counter Badge */}
              <div className="flex items-center gap-3 bg-gradient-to-br from-purple-50 to-indigo-50/60 px-5 py-3.5 rounded-2xl border border-purple-100/80 self-start md:self-auto shadow-xs">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {totalApplications}
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Total Applied</p>
                  <p className="text-[11px] text-gray-500">Submitted applications</p>
                </div>
              </div>
            </div>
          </div>

          {/* Applied Jobs Table Container */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Application History</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  Complete list of job positions you have applied for.
                </p>
              </div>
            </div>
            <AppliedJobTable />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AppliedJobs;
