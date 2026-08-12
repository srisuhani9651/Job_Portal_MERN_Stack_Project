import { useState } from "react";
import { SlidersHorizontal, MapPin, Briefcase, IndianRupee, RotateCcw } from "lucide-react";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const filterData = [
  {
    filterType: "Location",
    icon: MapPin,
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    icon: Briefcase,
    array: ["Frontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    icon: IndianRupee,
    array: ["0-40k", "43-1lac", "1lac-5lac", "5lac-10lac"],
  },
];

const FilterCard = () => {
  const [selectedValue, setSelectedValue] = useState("");

  const changeHandler = (value) => {
    setSelectedValue(value);
  };

  const clearFilterHandler = () => {
    setSelectedValue("");
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
        {selectedValue && (
          <button
            type="button"
            onClick={clearFilterHandler}
            className="text-xs font-semibold text-[#6A38C2] hover:text-purple-700 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Filter Options */}
      <RadioGroup value={selectedValue} onValueChange={changeHandler} className="space-y-5">
        {filterData.map((data, index) => {
          const IconComponent = data.icon;
          return (
            <div key={index} className="space-y-2.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 uppercase tracking-wider">
                <IconComponent className="w-3.5 h-3.5 text-[#6A38C2]" />
                <span>{data.filterType}</span>
              </div>
              <div className="space-y-1.5 pl-1">
                {data.array.map((item, idx) => {
                  const itemId = `filter-${index}-${idx}`;
                  const isSelected = selectedValue === item;
                  return (
                    <div
                      key={itemId}
                      className={`flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl transition-colors cursor-pointer ${
                        isSelected
                          ? "bg-purple-50/80 text-[#6A38C2] font-semibold"
                          : "hover:bg-gray-50 text-gray-600"
                      }`}
                    >
                      <RadioGroupItem value={item} id={itemId} />
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
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
