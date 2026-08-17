import React from "react";
import { useSelector } from "react-redux";
import { Briefcase, Building2, Users2, Clock3 } from "lucide-react";

const CareerMetrics = () => {
  const { allJobs = [] } = useSelector((store) => store.jobs || {});
  const jobCount = allJobs.length > 0 ? `${allJobs.length}+` : "1,200+";

  const stats = [
    {
      icon: Briefcase,
      value: jobCount,
      label: "Active Opportunities",
      subtext: "Verified engineering & product roles",
      iconBg: "bg-purple-100/70 text-[#6A38C2]",
    },
    {
      icon: Building2,
      value: "500+",
      label: "Hiring Partners",
      subtext: "From seed startups to public tech giants",
      iconBg: "bg-blue-100/70 text-blue-600",
    },
    {
      icon: Users2,
      value: "98%",
      label: "Application Response",
      subtext: "Direct recruiter dashboard review",
      iconBg: "bg-emerald-100/70 text-emerald-600",
    },
    {
      icon: Clock3,
      value: "< 14 Days",
      label: "Average Hiring Cycle",
      subtext: "Fast-track interview process",
      iconBg: "bg-amber-100/70 text-amber-600",
    },
  ];

  return (
    <section className="bg-white border-b border-purple-100/60 py-10 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <div
                key={idx}
                className="flex items-start gap-4 p-5 rounded-2xl bg-purple-50/20 border border-purple-100/70 hover:border-purple-200 hover:bg-purple-50/50 transition-all duration-300 group"
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${item.iconBg} shadow-xs group-hover:scale-105 transition-transform`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-gray-900 tracking-tight">
                    {item.value}
                  </h3>
                  <p className="text-xs font-bold text-gray-800 mt-0.5">
                    {item.label}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {item.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CareerMetrics;
