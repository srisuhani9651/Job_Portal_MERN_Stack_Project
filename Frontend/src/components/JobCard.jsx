import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bookmark, Building2, MapPin, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toggleSaveJob } from "@/Redux/jobSlice";

const JobCard = ({ job }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { savedJobs = [] } = useSelector((store) => store.jobs);
  const isSaved = savedJobs.includes(job?._id);

  const daysAgoFunction = (mongodbTime) => {
    if (!mongodbTime) return "Recently";
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDiff = currentTime - createdAt;
    const days = Math.floor(timeDiff / (1000 * 24 * 60 * 60));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const handleSaveToggle = (e) => {
    e.stopPropagation();
    if (!job?._id) return;
    dispatch(toggleSaveJob(job._id));
    if (isSaved) {
      toast.info(`Removed "${job?.title || "Job"}" from saved jobs`);
    } else {
      toast.success(`Saved "${job?.title || "Job"}" for later!`);
    }
  };

  const handleDetailsClick = (e) => {
    e.stopPropagation();
    if (job?._id) {
      navigate(`/description/${job._id}`);
    }
  };

  const companyName = job?.company?.name || "Company";
  const logo = job?.company?.logo;
  const location = job?.location || "India";
  const title = job?.title || "Job Title";
  const description = job?.description || "No description provided.";
  const position = job?.position ? `${job.position} Positions` : "Open Position";
  const jobType = job?.jobType || "Full Time";
  const salary = job?.salary ? `${job.salary} LPA` : "Not disclosed";
  const experienceLevel =
    job?.experienceLevel !== undefined && job?.experienceLevel !== null
      ? `${job.experienceLevel} ${Number(job.experienceLevel) === 1 ? "Year" : "Years"} Exp`
      : job?.experience
      ? `${job.experience} Exp`
      : null;

  return (
    <div className="p-5 rounded-2xl shadow-sm hover:shadow-md bg-white border border-gray-100 transition-all duration-200 flex flex-col justify-between h-full group">
      <div>
        {/* Top bar: Posted time & Bookmark */}
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-medium text-gray-400">
            {daysAgoFunction(job?.createdAt)}
          </p>
          <Button
            onClick={handleSaveToggle}
            variant="ghost"
            size="icon"
            className={`rounded-full h-8 w-8 transition-colors cursor-pointer ${
              isSaved
                ? "text-[#6A38C2] bg-purple-50 hover:bg-purple-100"
                : "text-gray-400 hover:text-[#6A38C2] hover:bg-purple-50"
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? "fill-[#6A38C2]" : ""}`} />
          </Button>
        </div>

        {/* Company info */}
        <div className="flex items-center gap-3 my-2">
          <div className="h-10 w-10 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-purple-600 font-bold overflow-hidden shrink-0 p-1">
            {logo ? (
              <img
                src={logo}
                alt={companyName}
                className="max-h-full max-w-full w-auto h-auto object-contain object-center"
              />
            ) : (
              <Building2 className="w-5 h-5 text-[#6A38C2]" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-gray-900 truncate">
              {companyName}
            </h2>
            <p className="text-xs text-gray-500 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-400" />
              <span>{location}</span>
            </p>
          </div>
        </div>

        {/* Job Title & Description */}
        <div className="mt-3">
          <h1 className="font-bold text-base text-gray-900 group-hover:text-[#6A38C2] transition-colors line-clamp-1">
            {title}
          </h1>
          <p className="text-xs text-gray-600 mt-1.5 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Badges and actions */}
      <div className="mt-4 pt-3 border-t border-gray-50">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-4">
          <Badge className="text-blue-700 bg-blue-50 border-blue-100 hover:bg-blue-100 text-[11px] font-semibold rounded-full px-2.5 py-0.5">
            {position}
          </Badge>
          <Badge className="text-amber-700 bg-amber-50 border-amber-100 hover:bg-amber-100 text-[11px] font-semibold rounded-full px-2.5 py-0.5">
            {jobType}
          </Badge>
          {experienceLevel && (
            <Badge className="text-emerald-700 bg-emerald-50 border-emerald-100 hover:bg-emerald-100 text-[11px] font-semibold rounded-full px-2.5 py-0.5">
              {experienceLevel}
            </Badge>
          )}
          <Badge className="text-[#6A38C2] bg-purple-50 border-purple-100 hover:bg-purple-100 text-[11px] font-semibold rounded-full px-2.5 py-0.5">
            {salary}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleDetailsClick}
            variant="outline"
            size="sm"
            className="flex-1 rounded-xl border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 hover:text-[#6A38C2] cursor-pointer"
          >
            Details
          </Button>
          <Button
            onClick={handleSaveToggle}
            size="sm"
            className={`flex-1 rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-all ${
              isSaved
                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                : "bg-[#6A38C2] hover:bg-[#5b30a6] text-white"
            }`}
          >
            {isSaved ? (
              <span className="flex items-center justify-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>Saved</span>
              </span>
            ) : (
              "Save For Later"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
