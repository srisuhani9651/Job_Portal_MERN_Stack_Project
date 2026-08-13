import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Navbar from "./shared/Navbar";
import FilterCard from "./FilterCard";
import JobCard from "./JobCard";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { Briefcase, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import Footer from "./Footer";

// Helper to normalize and check salary against selected range
const matchesSalaryRange = (jobSalary, range) => {
  if (!range) return true;
  if (jobSalary === undefined || jobSalary === null) return false;

  const rawNum =
    typeof jobSalary === "number"
      ? jobSalary
      : parseFloat(String(jobSalary).replace(/[^0-9.]/g, "")) || 0;

  // Convert raw values to LPA (e.g. 500000 -> 5 LPA, 40000 -> 0.4 LPA, 12 -> 12 LPA)
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

const Jobs = () => {
  useGetAllJobs();
  const { allJobs = [] } = useSelector((store) => store.jobs);

  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    industry: "",
    salary: "",
  });

  const handleFilterChange = (key, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleResetFilters = () => {
    setSelectedFilters({
      location: "",
      industry: "",
      salary: "",
    });
  };

  // Filter jobs based on combined active filters
  const filteredJobs = useMemo(() => {
    if (!allJobs || allJobs.length === 0) return [];

    return allJobs.filter((job) => {
      // 1. Location match
      if (selectedFilters.location) {
        const jobLoc = (job?.location || "").toLowerCase().trim();
        const targetLoc = selectedFilters.location.toLowerCase().trim();

        const isDelhiMatch =
          targetLoc.includes("delhi") &&
          (jobLoc.includes("delhi") ||
            jobLoc.includes("noida") ||
            jobLoc.includes("gurgaon") ||
            jobLoc.includes("gurugram") ||
            jobLoc.includes("ncr"));

        if (!jobLoc.includes(targetLoc) && !targetLoc.includes(jobLoc) && !isDelhiMatch) {
          return false;
        }
      }

      // 2. Industry / Title match
      if (selectedFilters.industry) {
        const title = (job?.title || "").toLowerCase();
        const desc = (job?.description || "").toLowerCase();
        const targetIndustry = selectedFilters.industry.toLowerCase();

        // Check if title or description contains the industry words (e.g. frontend, backend, fullstack)
        const industryKeywords = targetIndustry
          .replace("developer", "")
          .replace("engineer", "")
          .trim()
          .split(/\s+/);
        const matchesIndustry =
          title.includes(targetIndustry) ||
          industryKeywords.every((kw) => title.includes(kw) || desc.includes(kw));

        if (!matchesIndustry) {
          return false;
        }
      }

      // 3. Salary match
      if (selectedFilters.salary) {
        if (!matchesSalaryRange(job?.salary, selectedFilters.salary)) {
          return false;
        }
      }

      return true;
    });
  }, [allJobs, selectedFilters]);

  const hasActiveFilters = Boolean(
    selectedFilters.location || selectedFilters.industry || selectedFilters.salary
  );

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
                {hasActiveFilters && (
                  <span className="text-xs text-[#6A38C2] bg-purple-50 px-2.5 py-0.5 rounded-full font-semibold border border-purple-100">
                    Filtered
                  </span>
                )}
              </div>
              {hasActiveFilters && (
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
                  {hasActiveFilters
                    ? "No jobs match your selected filter criteria. Try adjusting or resetting the filters."
                    : "No jobs are currently available. Check back soon for new opportunities."}
                </p>
                {hasActiveFilters && (
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
