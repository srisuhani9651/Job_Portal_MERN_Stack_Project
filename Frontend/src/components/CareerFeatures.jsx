import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Zap,
  ShieldCheck,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const features = [
  {
    icon: Search,
    badge: "Smart Discovery",
    title: "Precision Fuzzy Search",
    description:
      "Find the exact opportunities you qualify for with intelligent typo-tolerant search and domain-specific synonym matching.",
    highlight: "Zero search friction",
    iconBg: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: Zap,
    badge: "Direct Pipeline",
    title: "Direct Recruiter Access",
    description:
      "Skip third-party agency filters. Your application routes directly into the verified company hiring dashboard for fast review.",
    highlight: "Under 72hr average review",
    iconBg: "bg-purple-50 text-[#6A38C2] border-purple-100",
  },
  {
    icon: BarChart3,
    badge: "Full Transparency",
    title: "Verified Compensation & Status",
    description:
      "Every opportunity features upfront salary packages and live tracking so you always know where your application stands.",
    highlight: "100% disclosed compensation",
    iconBg: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
];

const CareerFeatures = () => {
  return (
    <section className="py-16 sm:py-20 bg-gradient-to-b from-purple-50/30 via-white to-gray-50/50 text-gray-900 relative overflow-hidden border-b border-purple-100/60">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Built for Modern Tech Careers</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
            Designed for Speed, Transparency &{" "}
            <span className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent">
              Direct Hiring
            </span>
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-gray-600 max-w-xl mx-auto">
            Everything you need to accelerate your job search and stand out to top engineering & product teams.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const IconComp = feature.icon;
            return (
              <div
                key={idx}
                className="relative rounded-3xl bg-white border border-gray-100 shadow-sm p-6 sm:p-8 transition-all duration-300 hover:border-purple-300 hover:shadow-md hover:-translate-y-1 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-5">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${feature.iconBg} shadow-2xs group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-[#6A38C2] bg-purple-50 px-2.5 py-1 rounded-full border border-purple-100">
                      {feature.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6A38C2] transition-colors mb-2">
                    {feature.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{feature.highlight}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CareerFeatures;
