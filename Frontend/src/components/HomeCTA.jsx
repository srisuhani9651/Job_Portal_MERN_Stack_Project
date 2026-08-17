import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Briefcase, Building2, ArrowRight, Sparkles, Users } from "lucide-react";
import { useSelector } from "react-redux";

const HomeCTA = () => {
  const { user } = useSelector((store) => store.auth || {});
  const isRecruiter = user && (user?.role === "Recruiter" || user?.role?.toLowerCase() === "recruiter");

  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Candidate CTA Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#6A38C2] via-purple-700 to-indigo-800 text-white p-8 sm:p-10 shadow-xl overflow-hidden flex flex-col justify-between group">
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs font-semibold text-purple-100">
              <Sparkles className="w-3.5 h-3.5" />
              <span>For Job Seekers</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready for Your Next Career Breakthrough?
            </h3>

            <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed max-w-md">
              Create your profile, upload your resume, and get instantly discovered by fast-growing startups and top tech enterprises.
            </p>
          </div>

          <div className="pt-8 relative z-10">
            <Link to="/jobs">
              <Button className="bg-white text-[#6A38C2] hover:bg-purple-50 font-bold rounded-xl px-6 py-3 text-xs sm:text-sm shadow-lg shadow-purple-950/20 cursor-pointer inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                <span>Explore Open Positions</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Employer / Recruiter CTA Card */}
        <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-900 border border-purple-900/60 text-white p-8 sm:p-10 shadow-xl overflow-hidden flex flex-col justify-between group">
          <div className="absolute bottom-0 right-0 -mr-12 -mb-12 w-48 h-48 bg-purple-600/15 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/50 border border-purple-700/60 text-xs font-semibold text-purple-200">
              <Building2 className="w-3.5 h-3.5 text-purple-300" />
              <span>For Employers & Recruiters</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Hiring Elite Engineering & Product Talent?
            </h3>

            <p className="text-xs sm:text-sm text-purple-200/80 leading-relaxed max-w-md">
              Post positions in minutes, review incoming applicants in real time, and manage candidate hiring stages seamlessly.
            </p>
          </div>

          <div className="pt-8 relative z-10">
            <Link to={isRecruiter ? "/admin/jobs/create" : "/signup"}>
              <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white font-bold rounded-xl px-6 py-3 text-xs sm:text-sm shadow-lg shadow-purple-600/25 cursor-pointer inline-flex items-center gap-2 group-hover:gap-3 transition-all">
                <span>{isRecruiter ? "Post a New Job" : "Start Hiring on JobSphere"}</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HomeCTA;
