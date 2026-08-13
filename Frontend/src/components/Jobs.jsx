import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import JobCard from "./JobCard";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Briefcase, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import Footer from "./Footer";

// Helper to normalize and check salary against a single range string
const matchesSingleSalaryRange = (jobSalary, range) => {
  if (!range) return true;
  if (jobSalary === undefined || jobSalary === null) return false;

  const rawNum =
    typeof jobSalary === "number"
      ? jobSalary
      : parseFloat(String(jobSalary).replace(/[^0-9.]/g, "")) || 0;

  const lpa = rawNum > 1000 ? rawNum / 100000 : rawNum;
  const monthlyK = lpa * (100 / 12);

  const cleanRange = range.replace(/\s+/g, "").toLowerCase();

  if (cleanRange.includes("0-40") || cleanRange.includes("0–40")) {
    return (
      (lpa > 0 && lpa <= 0.48) ||
      (rawNum > 0 && rawNum <= 40000) ||
      (monthlyK > 0 && monthlyK <= 40)
    );
  }
  if (
    cleanRange.includes("43") ||
    cleanRange.includes("43k") ||
    cleanRange.includes("1l") ||
    cleanRange.includes("1lac")
  ) {
    if (cleanRange.includes("5l") || cleanRange.includes("5lac")) {
      // 1L–5L
      return (lpa >= 1 && lpa <= 5) || (rawNum >= 100000 && rawNum <= 500000);
    }
    // 43k–1L
    return (
      (lpa >= 0.43 && lpa <= 1.2) ||
      (rawNum >= 40000 && rawNum <= 100000) ||
      (monthlyK >= 40 && monthlyK <= 100)
    );
  }
  if (
    cleanRange.includes("1l-5l") ||
    cleanRange.includes("1lac-5lac") ||
    cleanRange.includes("1l–5l")
  ) {
    return (lpa >= 1 && lpa <= 5) || (rawNum >= 100000 && rawNum <= 500000);
  }

  return true;
};

// Helper to check dynamic job posted date against a single range string
const matchesSinglePostedWithin = (createdAt, range) => {
  if (!range) return true;
  if (!createdAt) return false;

  const jobDate = new Date(createdAt);
  if (isNaN(jobDate.getTime())) return false;

  const now = new Date();
  const diffInHours = (now.getTime() - jobDate.getTime()) / (1000 * 60 * 60);

  const clean = range.toLowerCase().trim();

  if (clean.includes("24 hour") || clean.includes("1 day")) {
    return diffInHours <= 24;
  }
  if (clean.includes("3 day")) {
    return diffInHours <= 72; // 3 days = 72 hours
  }
  if (clean.includes("7 day")) {
    return diffInHours <= 168; // 7 days = 168 hours
  }

  return true;
};

// Helper to check required experience against a single range string
const matchesSingleExperience = (jobExp, range) => {
  if (!range) return true;
  if (jobExp === undefined || jobExp === null) return false;

  const expNum =
    typeof jobExp === "number"
      ? jobExp
      : parseFloat(String(jobExp).replace(/[^0-9.]/g, "")) || 0;

  const clean = range.replace(/\s+/g, "").toLowerCase();

  if (clean.includes("1–3") || clean.includes("1-3")) {
    return expNum >= 1 && expNum <= 3;
  }
  if (clean.includes("4–7") || clean.includes("4-7")) {
    return expNum >= 4 && expNum <= 7;
  }
  if (clean.includes("8–11") || clean.includes("8-11")) {
    return expNum >= 8 && expNum <= 11;
  }

  return true;
};

const Jobs = () => {
  useGetAllJobs();
  const { allJobs = [] } = useSelector((store) => store.jobs);

  const [selectedFilters, setSelectedFilters] = useState({
    location: [],
    industry: [],
    salary: [],
    postedWithin: [],
    experience: [],
  });

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      location: [],
      industry: [],
      salary: [],
      postedWithin: [],
      experience: [],
    });
  };

  // Filter jobs based on combined multi-select active filters
  const filteredJobs = useMemo(() => {
    if (!allJobs || allJobs.length === 0) return [];

    return allJobs.filter((job) => {
      // 1. Location match (OR within location selections)
      if (selectedFilters.location && selectedFilters.location.length > 0) {
        const jobLoc = (job?.location || "").toLowerCase().trim();
        const matchesAnyLocation = selectedFilters.location.some((targetLoc) => {
          const cleanLoc = targetLoc.toLowerCase().trim();
          const isDelhiMatch =
            cleanLoc.includes("delhi") &&
            (jobLoc.includes("delhi") ||
              jobLoc.includes("noida") ||
              jobLoc.includes("gurgaon") ||
              jobLoc.includes("gurugram") ||
              jobLoc.includes("ncr"));

          return jobLoc.includes(cleanLoc) || cleanLoc.includes(jobLoc) || isDelhiMatch;
        });

        if (!matchesAnyLocation) return false;
      }

      // 2. Industry match (OR within industry selections)
      if (selectedFilters.industry && selectedFilters.industry.length > 0) {
        const title = (job?.title || "").toLowerCase();
        const desc = (job?.description || "").toLowerCase();

        const matchesAnyIndustry = selectedFilters.industry.some((targetIndustry) => {
          const cleanIndustry = targetIndustry.toLowerCase();
          const industryKeywords = cleanIndustry
            .replace("developer", "")
            .replace("engineer", "")
            .trim()
            .split(/\s+/);

          return (
            title.includes(cleanIndustry) ||
            industryKeywords.every((kw) => title.includes(kw) || desc.includes(kw))
          );
        });

        if (!matchesAnyIndustry) return false;
      }

      // 3. Salary match (OR within salary selections)
      if (selectedFilters.salary && selectedFilters.salary.length > 0) {
        const matchesAnySalary = selectedFilters.salary.some((range) =>
          matchesSingleSalaryRange(job?.salary, range)
        );

        if (!matchesAnySalary) return false;
      }

      // 4. Posted date match (OR within date selections)
      if (selectedFilters.postedWithin && selectedFilters.postedWithin.length > 0) {
        const matchesAnyDate = selectedFilters.postedWithin.some((range) =>
          matchesSinglePostedWithin(job?.createdAt, range)
        );

        if (!matchesAnyDate) return false;
      }

      // 5. Experience match (OR within experience selections)
      if (selectedFilters.experience && selectedFilters.experience.length > 0) {
        const exp =
          job?.experienceLevel !== undefined ? job.experienceLevel : job?.experience;
        const matchesAnyExp = selectedFilters.experience.some((range) =>
          matchesSingleExperience(exp, range)
        );

        if (!matchesAnyExp) return false;
      }

      return true;
    });
  }, [allJobs, selectedFilters]);

  // Total active filter count
  const totalActiveFilters = Object.values(selectedFilters).reduce((acc, curr) => {
    if (Array.isArray(curr)) return acc + curr.length;
    return acc + (curr ? 1 : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col justify-between">
      <Navbar />
      <main className="max-w-7xl mx-auto w-full my-6 px-4 sm:px-6 flex-1">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left Filter Sidebar */}
          <div className="w-full md:w-64 lg:w-72 shrink-0">
            <FilterCard
              selectedFilters={selectedFilters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
            />
          </div>

          {/* Right Jobs Feed */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header with Results Count */}
            <div className="flex items-center justify-between mb-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-gray-900">
                  Showing {filteredJobs.length} {filteredJobs.length === 1 ? "Job" : "Jobs"}
                </span>
                {totalActiveFilters > 0 && (
                  <span className="text-xs text-[#6A38C2] bg-purple-50 px-2.5 py-0.5 rounded-full font-semibold border border-purple-100">
                    {totalActiveFilters} filter{totalActiveFilters > 1 ? "s" : ""} applied
                  </span>
                )}
              </div>
              {totalActiveFilters > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleResetFilters}
                  className="text-xs font-semibold text-gray-500 hover:text-[#6A38C2] hover:bg-purple-50 rounded-xl h-8 px-3 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 mr-1" />
                  Clear All
                </Button>
              )}
            </div>

            {/* Jobs Grid or Empty State */}
            {filteredJobs.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] bg-white rounded-3xl border border-gray-100 p-8 shadow-xs text-center">
                <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center text-[#6A38C2] mb-3">
                  <Briefcase className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">No jobs found</h3>
                <p className="text-gray-500 text-sm mt-1 max-w-sm">
                  {totalActiveFilters > 0
                    ? "No jobs match your selected filter criteria. Try adjusting or resetting the filters."
                    : "No jobs are currently available. Check back soon for new opportunities."}
                </p>
                {totalActiveFilters > 0 && (
                  <Button
                    onClick={handleResetFilters}
                    className="mt-4 bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl text-xs font-semibold px-5 shadow-xs cursor-pointer"
                  >
                    Reset Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="h-[80vh] overflow-y-auto pr-1 pb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredJobs.map((job) => (
                    <div key={job?._id}>
                      <JobCard job={job} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Jobs;
