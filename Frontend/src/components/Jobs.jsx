import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import JobCard from "./JobCard";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Jobs = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.jobs);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-6 px-4 sm:px-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Filter Sidebar */}
          <div className="w-full md:w-64 lg:w-72 shrink-0">
            <FilterCard />
          </div>

          {/* Right Jobs Feed */}
          {!allJobs || allJobs.length <= 0 ? (
            <div className="flex-1 flex items-center justify-center h-[50vh] bg-white rounded-2xl border border-gray-100 p-8 shadow-xs">
              <div className="text-center">
                <h3 className="font-bold text-gray-800 text-lg">No jobs found</h3>
                <p className="text-gray-500 text-sm mt-1">
                  Check back later or try adjusting your filters.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex-1 h-[88vh] overflow-y-auto pb-5 pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {allJobs.map((job) => (
                  <div key={job?._id}>
                    <JobCard job={job} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
