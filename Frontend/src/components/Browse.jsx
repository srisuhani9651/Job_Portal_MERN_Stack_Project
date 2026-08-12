import React from "react";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import JobCard from "./JobCard";
import useGetAllJobs from "@/hooks/useGetAllJobs";

const Browse = () => {
  useGetAllJobs();
  const { allJobs } = useSelector((store) => store.jobs);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      <Navbar />
      <div className="max-w-7xl mx-auto my-10 px-4 sm:px-6">
        <h1 className="font-bold text-2xl text-gray-900 my-6">
          Search Results ({allJobs ? allJobs.length : 0})
        </h1>
        {!allJobs || allJobs.length <= 0 ? (
          <div className="flex items-center justify-center h-[40vh] bg-white rounded-2xl border border-gray-100 p-8 shadow-xs text-center">
            <div>
              <h3 className="font-bold text-gray-800 text-lg">No jobs found</h3>
              <p className="text-gray-500 text-sm mt-1">
                There are currently no active job listings available.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {allJobs.map((job) => (
              <div key={job?._id}>
                <JobCard job={job} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Browse;
