import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

const filterData = [
  {
    filterType: "Location",
    array: ["Delhi NCR", "Bangalore", "Hyderabad", "Pune", "Mumbai"],
  },
  {
    filterType: "Industry",
    array: ["Fontend Developer", "Backend Developer", "FullStack Developer"],
  },
  {
    filterType: "Salary",
    array: ["0-40k", "43-1lac", "1lac-5lac", "5lac-10lac"],
  },
];
const FilterCard = () => {
  return (
    <div className="w-full bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="mt-3"></hr>
      <RadioGroup>
        {filterData.map((data, index) => (
          <div>
            <h1 className="font-semibold text-lg">{data.filterType}</h1>
            {data.array.map((item, index) => {
              return (
                <div className="flex item-center gap-2 m-2">
                  <RadioGroupItem value={item}></RadioGroupItem>
                  <Label>{item}</Label>
                </div>
              );
            })}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
