import React, { useEffect } from "react";
import Navbar from "./shared/Navbar";
import Footer from "./Footer";
import AppliedJobTable from "./AppliedJobTable";
import JobCard from "./JobCard";
import useGetAllAppliedJobs from "@/hooks/useGetAllAppliedJobs";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Bookmark, Briefcase } from "lucide-react";
import { Button } from "./ui/button";

const AppliedJobs = () => {
  useGetAllAppliedJobs();
  useGetAllJobs();

  const { user } = useSelector((store) => store.auth);
  const { allAppliedJobs = [], allJobs = [], savedJobs = [] } = useSelector(
    (store) => store.jobs || {}
  );
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
  const savedJobsList = allJobs.filter((job) => savedJobs.includes(job?._id));

  return (
    <div className="min-h-screen bg-gray-50/60 flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 space-y-8">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-semibold mb-3">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Student Workspace • Career Hub</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  My Career{" "}
                  <span className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent">
                    Activities
                  </span>
                </h1>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">
                  Track your job applications, view hiring updates, and manage positions you saved for later.
                </p>
              </div>

              {/* Counters */}
              <div className="flex items-center gap-3">
                {/* Applied Counter */}
                <div className="flex items-center gap-3 bg-gradient-to-br from-purple-50 to-indigo-50/60 px-4 py-3 rounded-2xl border border-purple-100/80 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {totalApplications}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Applied</p>
                    <p className="text-[11px] text-gray-500">Submitted</p>
                  </div>
                </div>

                {/* Saved Counter */}
                <div className="flex items-center gap-3 bg-gradient-to-br from-amber-50 to-orange-50/60 px-4 py-3 rounded-2xl border border-amber-100/80 shadow-xs">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white flex items-center justify-center font-bold text-base shadow-sm">
                    {savedJobsList.length}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">Saved</p>
                    <p className="text-[11px] text-gray-500">For Later</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Applied Jobs Section */}
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

          {/* Saved For Later Section */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-purple-50 text-[#6A38C2]">
                    <Bookmark className="w-4 h-4 fill-[#6A38C2]" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">Saved for Later</h2>
                  <span className="text-xs font-bold text-[#6A38C2] bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                    {savedJobsList.length} {savedJobsList.length === 1 ? "Job" : "Jobs"}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Opportunities you bookmarked to review or apply for later.
                </p>
              </div>

              {savedJobsList.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/jobs")}
                  className="rounded-xl text-xs font-semibold text-gray-700 hover:text-[#6A38C2] hover:bg-purple-50 border-gray-200 self-start sm:self-auto cursor-pointer"
                >
                  Explore More Jobs
                </Button>
              )}
            </div>

            {savedJobsList.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#6A38C2] mb-3">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-800 text-sm sm:text-base">No saved jobs yet</h3>
                <p className="text-xs text-gray-500 mt-1 max-w-sm">
                  Click "Save For Later" on any job card to bookmark opportunities and track them here.
                </p>
                <Button
                  onClick={() => navigate("/jobs")}
                  size="sm"
                  className="mt-4 bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl text-xs font-semibold px-4 cursor-pointer shadow-xs"
                >
                  Browse Jobs
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {savedJobsList.map((job) => (
                  <div key={job?._id}>
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default AppliedJobs;
