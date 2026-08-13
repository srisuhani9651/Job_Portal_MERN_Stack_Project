import React from "react";
import { SlidersHorizontal, MapPin, Briefcase, IndianRupee, RotateCcw } from "lucide-react";
import { Label } from "./ui/label";

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
];

const FilterCard = ({ selectedFilters = {}, onFilterChange, onReset }) => {
  const hasActiveFilters = Boolean(
    selectedFilters.location || selectedFilters.industry || selectedFilters.salary
  );

  const handleSelect = (key, item) => {
    if (!onFilterChange) return;
    // Toggle selection: if already active, unselect; otherwise select
    if (selectedFilters[key] === item) {
      onFilterChange(key, "");
    } else {
      onFilterChange(key, item);
    }
  };

  return (
    <div className="w-full bg-white p-5 rounded-2xl border border-gray-100 shadow-xs sticky top-24 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-50 text-[#6A38C2]">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <h2 className="font-bold text-gray-900 text-base">Filter Jobs</h2>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-[#6A38C2] hover:text-purple-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Filter Categories */}
      <div className="space-y-5">
        {filterData.map((data, index) => {
          const IconComponent = data.icon;
          const currentVal = selectedFilters[data.key] || "";

          return (
            <div key={data.key || index} className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 uppercase tracking-wider">
                <IconComponent className="w-3.5 h-3.5 text-[#6A38C2]" />
                <span>{data.filterType}</span>
              </div>
              <div className="space-y-1.5 pl-1">
                {data.array.map((item, idx) => {
                  const itemId = `filter-${data.key}-${idx}`;
                  const isSelected = currentVal === item;

                  return (
                    <div
                      key={itemId}
                      onClick={() => handleSelect(data.key, item)}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-purple-50/80 text-[#6A38C2] font-semibold"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? "border-[#6A38C2] bg-[#6A38C2]"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <Label
                        htmlFor={itemId}
                        className="text-sm font-medium cursor-pointer flex-1 select-none"
                      >
                        {item}
                      </Label>
                    </div>
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
