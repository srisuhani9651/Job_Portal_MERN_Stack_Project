import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Lock, LogIn, Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import JobCard from "./JobCard";
import { Button } from "./ui/button";

const LatestJobs = () => {
  const { allJobs = [] } = useSelector((state) => state.jobs || {});
  const { user } = useSelector((state) => state.auth || {});
  const navigate = useNavigate();

  const displayedJobs = allJobs ? allJobs.slice(0, 6) : [];

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header with Title and "Explore All" Action */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 pb-4 border-b border-purple-100/60">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-semibold mb-2.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Featured Openings</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Latest & Verified{" "}
            <span className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent">
              Job Openings
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
            Explore newly published positions with verified compensation packages and fast recruiter response.
          </p>
        </div>

        <Button
          onClick={() => navigate("/jobs")}
          variant="outline"
          size="sm"
          className="self-start sm:self-auto rounded-xl text-xs font-semibold text-gray-700 hover:text-[#6A38C2] hover:bg-purple-50 border-gray-200 cursor-pointer flex items-center gap-1.5"
        >
          <span>View All Jobs</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>

      {!user ? (
        /* Guest Preview Card */
        <div className="my-6 p-8 sm:p-12 border border-purple-100 rounded-3xl bg-gradient-to-br from-purple-50/80 via-white to-indigo-50/40 text-center max-w-2xl mx-auto shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-5">
            <div className="w-14 h-14 rounded-2xl bg-white border border-purple-100 text-[#6A38C2] mx-auto flex items-center justify-center shadow-md shadow-purple-500/10">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-gray-900 text-xl sm:text-2xl tracking-tight">
                Sign In to Unlock Full Job Details & Instant Apply
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                Join thousands of students and experienced professionals receiving direct interview invitations from top tech teams.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-gray-600 py-2">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                1-Click Applications
              </span>
              <span className="flex items-center gap-1.5 text-indigo-700">
                <ShieldCheck className="w-4 h-4 text-indigo-500" />
                Verified Salaries
              </span>
              <span className="flex items-center gap-1.5 text-purple-700">
                <Zap className="w-4 h-4 text-purple-500" />
                Live Status Tracking
              </span>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to="/login" className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl px-8 py-3 text-sm font-semibold gap-2 cursor-pointer shadow-md shadow-purple-500/20">
                  <LogIn className="w-4 h-4" />
                  <span>Login to Browse Jobs</span>
                </Button>
              </Link>
              <Link to="/signup" className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto border-gray-200 hover:bg-purple-50 hover:text-[#6A38C2] rounded-xl px-6 py-3 text-sm font-semibold cursor-pointer">
                  <span>Create Account</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        /* Authenticated Jobs Grid */
        <div>
          {displayedJobs.length === 0 ? (
            <div className="p-12 text-center bg-gray-50/50 rounded-2xl border border-gray-100">
              <p className="text-gray-500 font-medium text-sm">No job openings found at the moment.</p>
              <Button
                onClick={() => navigate("/jobs")}
                className="mt-4 bg-[#6A38C2] text-white rounded-xl text-xs px-4"
              >
                Browse All Openings
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedJobs.map((job) => (
                <div key={job?._id} className="h-full">
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}

          {/* Bottom Explore Footer */}
          {displayedJobs.length > 0 && (
            <div className="mt-10 text-center">
              <Button
                onClick={() => navigate("/jobs")}
                className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl text-xs sm:text-sm font-semibold px-8 py-3 shadow-md shadow-purple-500/10 cursor-pointer inline-flex items-center gap-2"
              >
                <span>Explore All {allJobs.length} Available Jobs</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default LatestJobs;
