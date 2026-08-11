import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Lock, LogIn } from "lucide-react";
import LatestJobCards from "./LatestJobCards";
import { Button } from "./ui/button";

const LatestJobs = () => {
  const { allJobs } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6">
      <h1 className="text-2xl sm:text-3xl font-bold">
        <span className="text-[#6A38C2]">Latest & </span>Top Job Openings
      </h1>

      {!user ? (
        <div className="my-8 p-8 border border-purple-100 rounded-3xl bg-gradient-to-br from-purple-50/60 to-indigo-50/30 text-center max-w-xl mx-auto space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#6A38C2] mx-auto flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">Login to View Job Openings</h3>
            <p className="text-sm text-gray-500 mt-1">
              Please sign in to your account to browse, view details, and apply for exclusive job opportunities.
            </p>
          </div>
          <Link to="/login" className="inline-block">
            <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-full px-6 py-2 gap-2 cursor-pointer shadow-md shadow-purple-200">
              <LogIn className="w-4 h-4" />
              <span>Login to Continue</span>
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 my-6">
          {!allJobs || allJobs.length <= 0 ? (
            <span className="text-gray-500 font-medium">No jobs found</span>
          ) : (
            allJobs.slice(0, 6).map((job) => (
              <LatestJobCards key={job?._id} job={job} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default LatestJobs;
