import React from "react";
import {
  SlidersHorizontal,
  MapPin,
  Briefcase,
  IndianRupee,
  Calendar,
  Award,
  RotateCcw,
  Check,
} from "lucide-react";

export const filterData = [
  {
    filterType: "Location",
    key: "location",
    icon: MapPin,
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    key: "industry",
    icon: Briefcase,
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    key: "salary",
    icon: IndianRupee,
    array: ["0–40k", "43k–1L", "1L–5L"],
  },
  {
    filterType: "Posted Within",
    key: "postedWithin",
    icon: Calendar,
    array: ["Last 24 Hours", "Last 1 Day", "Last 3 Days", "Last 7 Days"],
  },
  {
    filterType: "Experience",
    key: "experience",
    icon: Award,
    array: ["1–3 Years", "4–7 Years", "8–11 Years"],
  },
];

const FilterCard = ({ selectedFilters = {}, onFilterChange, onReset }) => {
  // Count total active selected filter items across all categories
  const activeCount = Object.values(selectedFilters).reduce((acc, curr) => {
    if (Array.isArray(curr)) return acc + curr.length;
    return acc + (curr ? 1 : 0);
  }, 0);

  const handleToggle = (key, item) => {
    if (!onFilterChange) return;
    const currentList = Array.isArray(selectedFilters[key])
      ? selectedFilters[key]
      : selectedFilters[key]
      ? [selectedFilters[key]]
      : [];

    let updatedList;
    if (currentList.includes(item)) {
      updatedList = currentList.filter((i) => i !== item);
    } else {
      updatedList = [...currentList, item];
    }
    onFilterChange(key, updatedList);
  };

  const handleClearCategory = (key) => {
    if (!onFilterChange) return;
    onFilterChange(key, []);
  };

  return (
    <div className="w-full bg-white p-4 sm:p-5 rounded-2xl border border-gray-100 shadow-xs space-y-3.5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50 text-[#6A38C2]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-gray-900 text-sm sm:text-base">Filters</h2>
          {activeCount > 0 && (
            <span className="text-[10px] font-bold text-[#6A38C2] bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              {activeCount} selected
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-gray-500 hover:text-[#6A38C2] flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Filter Categories in Compact Multi-Select Pill Layout */}
      <div className="space-y-3">
        {filterData.map((data) => {
          const IconComponent = data.icon;
          const currentList = Array.isArray(selectedFilters[data.key])
            ? selectedFilters[data.key]
            : selectedFilters[data.key]
            ? [selectedFilters[data.key]]
            : [];

          return (
            <div key={data.key} className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  <IconComponent className="w-3 h-3 text-[#6A38C2]" />
                  <span>{data.filterType}</span>
                  {currentList.length > 0 && (
                    <span className="text-[10px] text-[#6A38C2] font-semibold">
                      ({currentList.length})
                    </span>
                  )}
                </div>
                {currentList.length > 0 && (
                  <button
                    type="button"
                    onClick={() => handleClearCategory(data.key)}
                    className="text-[10px] text-purple-600 hover:underline cursor-pointer font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Multi-Select Compact Pill Badges */}
              <div className="flex flex-wrap gap-1.5">
                {data.array.map((item) => {
                  const isSelected = currentList.includes(item);

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggle(data.key, item)}
                      className={`text-xs px-2.5 py-1 rounded-lg transition-all font-medium cursor-pointer border select-none inline-flex items-center gap-1 ${
                        isSelected
                          ? "bg-[#6A38C2] text-white border-[#6A38C2] shadow-xs font-semibold"
                          : "bg-gray-50/80 hover:bg-purple-50/50 text-gray-700 border-gray-200/80 hover:border-purple-200 hover:text-[#6A38C2]"
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      <span>{item}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FilterCard;
