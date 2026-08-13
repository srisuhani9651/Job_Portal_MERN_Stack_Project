import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Navbar from "./shared/Navbar";
import Footer from "./Footer";
import JobCard from "./JobCard";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { setSearchJobByText } from "@/Redux/jobSlice";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { X, Briefcase, Search } from "lucide-react";
import { filterJobsFuzzy } from "@/utils/fuzzySearch";

const Browse = () => {
  useGetAllJobs();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { allJobs = [], searchJobByText = "" } = useSelector(
    (store) => store.jobs || {}
  );

  const urlQuery = searchParams.get("query") || "";
  const [localSearch, setLocalSearch] = useState(urlQuery || searchJobByText || "");

  // Sync query parameter with Redux and local state
  useEffect(() => {
    if (urlQuery) {
      setLocalSearch(urlQuery);
      dispatch(setSearchJobByText(urlQuery));
    } else if (searchJobByText) {
      setLocalSearch(searchJobByText);
    }
  }, [urlQuery, searchJobByText, dispatch]);

  const activeQuery = localSearch || urlQuery || searchJobByText || "";

  // Fuzzy filter jobs based on active search query
  const filterJobs = useMemo(() => {
    return filterJobsFuzzy(allJobs, activeQuery);
  }, [allJobs, activeQuery]);

  const handleSearchChange = (value) => {
    setLocalSearch(value);
    const trimmed = value.trim();
    dispatch(setSearchJobByText(trimmed));
    if (trimmed) {
      setSearchParams({ query: trimmed });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setLocalSearch("");
    dispatch(setSearchJobByText(""));
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <div>
        <Navbar />

        <div className="max-w-7xl mx-auto my-8 px-4 sm:px-6">
          {/* Subtle Results Header with Minimalist Search Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-gray-100">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="font-bold text-2xl text-gray-900 tracking-tight">
                  Search Results
                </h1>
                <Badge
                  variant="secondary"
                  className="bg-purple-100/80 text-[#6A38C2] border-purple-200/60 text-xs px-2.5 py-0.5 font-bold"
                >
                  {filterJobs.length} {filterJobs.length === 1 ? "Job" : "Jobs"}
                </Badge>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Explore all verified job postings and apply instantly.
              </p>
            </div>

            {/* Subtle Minimalist Search Bar */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Filter by title, company, skills..."
                className="w-full pl-9 pr-8 py-2 bg-white border border-gray-200 focus:border-[#6A38C2] focus:ring-2 focus:ring-purple-500/10 rounded-xl text-xs sm:text-sm text-gray-800 placeholder:text-gray-400 shadow-xs outline-none transition-all"
              />
              {localSearch && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  title="Clear filter"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Jobs Listing Grid / Empty State */}
          {filterJobs.length <= 0 ? (
            <div className="flex items-center justify-center py-20 bg-white rounded-3xl border border-gray-100 p-8 shadow-xs text-center">
              <div className="max-w-md mx-auto space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 text-[#6A38C2] mx-auto flex items-center justify-center shadow-xs">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">
                  {localSearch ? `No jobs found for "${localSearch}"` : "No jobs found"}
                </h3>
                <p className="text-gray-500 text-sm">
                  {localSearch
                    ? "Try checking for spelling errors or searching for a more general keyword."
                    : "There are currently no active job listings available."}
                </p>
                {localSearch && (
                  <Button
                    onClick={handleClearSearch}
                    variant="outline"
                    className="mt-3 rounded-xl border-gray-200 text-[#6A38C2] hover:bg-purple-50 text-xs font-semibold cursor-pointer"
                  >
                    View All Jobs
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filterJobs.map((job) => (
                <div key={job?._id}>
                  <JobCard job={job} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Browse;
