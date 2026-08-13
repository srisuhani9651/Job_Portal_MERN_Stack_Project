import React from "react";
import { useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { MapPin, Briefcase, IndianRupee, ArrowUpRight, Building2 } from "lucide-react";

const LatestJobCards = ({ job }) => {
  const navigate = useNavigate();

  const companyName = job?.company?.name || job?.companyName || "TechCorp Solutions";
  const location = job?.location || "Bangalore, India";
  const title = job?.title || "Senior Full Stack Developer";
  const description =
    job?.description ||
    "Seeking a skilled Full Stack Developer to build scalable web applications, collaborate with cross-functional teams, and deliver robust frontend and backend code.";
  const position = job?.position ? `${job.position} Openings` : "12 Openings";
  const jobType = job?.jobType || "Full Time";
  const salary = job?.salary ? `${job.salary} LPA` : "24 LPA";
  const logoUrl = job?.company?.logo || job?.logoUrl;

  const handleCardClick = () => {
    if (job?._id) {
      navigate(`/description/${job._id}`);
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-md hover:shadow-xl hover:border-purple-200 transition-all duration-300 ease-out cursor-pointer flex flex-col justify-between overflow-hidden hover:-translate-y-1"
    >
      {/* Header section with company logo and details */}
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-purple-600 font-bold text-lg shadow-xs group-hover:scale-105 transition-transform duration-300 overflow-hidden shrink-0 p-1">
              {logoUrl ? (
                <img src={logoUrl} alt={companyName} className="max-h-full max-w-full w-auto h-auto object-contain object-center" />
              ) : (
                <Building2 className="w-5 h-5 text-[#6A38C2]" />
              )}
            </div>
            <div>
              <h1 className="font-semibold text-base sm:text-lg text-gray-900 line-clamp-1 group-hover:text-[#6A38C2] transition-colors">
                {companyName}
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                <span>{location}</span>
              </p>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-gray-50 group-hover:bg-purple-50 flex items-center justify-center text-gray-400 group-hover:text-[#6A38C2] transition-all duration-300 shrink-0">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </div>
        </div>

        {/* Job Title & Description */}
        <div className="mt-3">
          <h2 className="font-bold text-lg sm:text-xl text-gray-900 group-hover:text-[#6A38C2] transition-colors duration-200 line-clamp-1">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-2 sm:line-clamp-3 leading-relaxed font-normal">
            {description}
          </p>
        </div>
      </div>

      {/* Badges section */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-5 pt-4 border-t border-gray-100">
        <Badge
          className="bg-blue-50 text-blue-700 border-blue-200/70 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs hover:bg-blue-100 transition-colors"
          variant="outline"
        >
          <Briefcase className="w-3 h-3" />
          {position}
        </Badge>
        <Badge
          className="bg-amber-50 text-amber-700 border-amber-200/70 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs hover:bg-amber-100 transition-colors"
          variant="outline"
        >
          {jobType}
        </Badge>
        <Badge
          className="bg-purple-50 text-[#7209b7] border-purple-200/70 font-semibold text-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs hover:bg-purple-100 transition-colors"
          variant="outline"
        >
          <IndianRupee className="w-3 h-3" />
          {salary}
        </Badge>
      </div>
    </div>
  );
};

export default LatestJobCards;
