import React, { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  Building2,
  CheckCircle2,
  TrendingUp,
  X,
  ShieldCheck,
  Briefcase,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setSearchJobByText } from "@/Redux/jobSlice";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const { allJobs = [] } = useSelector((store) => store.jobs || {});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = (customQuery, customLocation) => {
    const q = customQuery !== undefined ? customQuery : query;
    const loc = customLocation !== undefined ? customLocation : location;

    const parts = [q.trim(), loc.trim()].filter(Boolean);
    const combinedQuery = parts.join(" ");

    dispatch(setSearchJobByText(combinedQuery));
    if (combinedQuery) {
      navigate(`/browse?query=${encodeURIComponent(combinedQuery)}`);
    } else {
      navigate("/browse");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const trendingTags = [
    "Frontend",
    "Backend",
    "Full Stack",
    "Data Analyst",
    "Remote",
  ];

  // Pick top job for interactive deck preview or provide structured highlight
  const featuredJob = allJobs && allJobs.length > 0 ? allJobs[0] : null;
  const secondaryJob = allJobs && allJobs.length > 1 ? allJobs[1] : null;

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-purple-50/80 via-white to-white text-gray-900 pt-12 pb-16 lg:pt-16 lg:pb-20 px-4 sm:px-6 lg:px-8 border-b border-purple-100/60">
      {/* Background Ambience & Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-[28rem] h-[28rem] bg-indigo-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Headline & Dual-Input Search Command Console (7 cols) */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-50 border border-purple-200/80 text-xs font-semibold text-[#6A38C2] shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6A38C2] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6A38C2]"></span>
              </span>
              <span>1,200+ Verified Tech & Remote Roles Active</span>
            </div>

            {/* Impactful Heading */}
            <h1 className="text-3xl sm:text-5xl lg:text-[3.3rem] font-extrabold tracking-tight leading-[1.14] text-gray-900">
              Connect With Your Next{" "}
              <span className="bg-gradient-to-r from-[#6A38C2] via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                High-Impact Career Role
              </span>
            </h1>

            {/* Sub-headline */}
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Skip traditional hiring hurdles. Connect directly with hiring teams, explore transparent compensation packages, and track applications in real time.
            </p>

            {/* Segmented Dual-Input Search Console */}
            <div className="bg-white/95 backdrop-blur-xl border border-purple-100 rounded-2xl shadow-xl shadow-purple-500/10 p-2.5 sm:p-3 text-left transition-all duration-300 focus-within:border-purple-300 focus-within:ring-4 focus-within:ring-purple-100/60">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-3 items-center">
                
                {/* Input 1: Role / Keyword */}
                <div className="sm:col-span-6 relative flex items-center px-3 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200/80 focus-within:bg-white focus-within:border-purple-300">
                  <Search className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Job title, skill, or company..."
                    className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none border-none"
                    id="hero-role-input"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Input 2: Location */}
                <div className="sm:col-span-3 relative flex items-center px-3 py-2.5 rounded-xl bg-slate-50/60 border border-slate-200/80 focus-within:bg-white focus-within:border-purple-300">
                  <MapPin className="w-4 h-4 text-gray-400 mr-2 shrink-0" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Location / Remote"
                    className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 outline-none border-none"
                    id="hero-location-input"
                  />
                  {location && (
                    <button
                      type="button"
                      onClick={() => setLocation("")}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Search Button */}
                <div className="sm:col-span-3">
                  <Button
                    onClick={() => handleSearch()}
                    id="hero-search-submit"
                    className="w-full h-11 bg-[#6A38C2] hover:bg-[#5b30a6] text-white font-semibold rounded-xl shadow-md shadow-purple-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                  >
                    <span>Find Jobs</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>

              </div>
            </div>

            {/* Popular Search Chips */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-1 text-xs">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#6A38C2]" /> Popular:
              </span>
              {trendingTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setQuery(tag);
                    handleSearch(tag, "");
                  }}
                  id={`trending-tag-${idx}`}
                  className="px-3 py-1 rounded-lg bg-purple-50/80 hover:bg-purple-100 border border-purple-100 text-[#6A38C2] hover:text-purple-950 text-xs font-medium transition-all duration-200 cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Social Proof & Trust Strip */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-3 border-t border-purple-100/60 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>100% Verified Employers</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Direct Recruiter Routing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#6A38C2]" />
                <span>Zero Hidden Compensation</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Live Opportunity Deck & Radar (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Opportunity Card */}
              <div className="relative bg-white/95 backdrop-blur-xl border border-purple-100 rounded-3xl p-6 shadow-xl shadow-purple-500/10 transition-all duration-300 hover:border-purple-300 group">
                
                {/* Header badge */}
                <div className="flex items-center justify-between gap-3 mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3 text-[#6A38C2]" />
                    <span>Featured Opening</span>
                  </span>
                  <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    Actively Hiring
                  </span>
                </div>

                {/* Company & Role info */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-white border border-purple-100 flex items-center justify-center text-[#6A38C2] font-bold overflow-hidden shrink-0 shadow-xs p-1">
                    {featuredJob?.company?.logo ? (
                      <img
                        src={featuredJob.company.logo}
                        alt={featuredJob?.company?.name || "Company"}
                        className="max-h-full max-w-full object-contain"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-[#6A38C2]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#6A38C2] transition-colors line-clamp-1">
                      {featuredJob?.title || "Staff Full Stack Engineer"}
                    </h3>
                    <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5">
                      <span>{featuredJob?.company?.name || "Nexora Technologies"}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-gray-400">
                        <MapPin className="w-3 h-3 text-gray-400" />
                        {featuredJob?.location || "Bangalore / Remote"}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-5">
                  <Badge className="bg-purple-50 border-purple-100 text-[#6A38C2] text-xs px-2.5 py-0.5 rounded-lg">
                    {featuredJob?.salary ? `₹${featuredJob.salary} LPA` : "₹24-36 LPA"}
                  </Badge>
                  <Badge className="bg-blue-50 border-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-lg">
                    {featuredJob?.jobType || "Full Time"}
                  </Badge>
                  <Badge className="bg-emerald-50 border-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-lg">
                    {featuredJob?.experienceLevel
                      ? `${featuredJob.experienceLevel}+ Years Exp`
                      : "Mid-Senior"}
                  </Badge>
                </div>

                {/* Card Action */}
                <Button
                  onClick={() => {
                    if (featuredJob?._id) {
                      navigate(`/description/${featuredJob._id}`);
                    } else {
                      navigate("/jobs");
                    }
                  }}
                  className="w-full bg-purple-50 hover:bg-[#6A38C2] text-[#6A38C2] hover:text-white border border-purple-200 hover:border-purple-600 text-xs font-semibold py-2.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>View Details & Apply</span>
                </Button>
              </div>

              {/* Floating Match Metric Widget */}
              <div className="hidden sm:flex items-center gap-3 absolute -bottom-6 -left-6 bg-white border border-purple-100/90 rounded-2xl p-3.5 shadow-xl shadow-purple-500/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6A38C2] to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-purple-500/20">
                  98%
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Direct Match Rate</p>
                  <p className="text-[11px] text-gray-500">Targeted skill relevance</p>
                </div>
              </div>

              {/* Floating Secondary Mini Card */}
              {secondaryJob && (
                <div 
                  className="hidden sm:flex items-center gap-3 absolute -top-5 -right-4 bg-white border border-purple-100/90 rounded-2xl p-3 shadow-xl shadow-purple-500/10 max-w-xs cursor-pointer hover:border-purple-300 transition-colors"
                  onClick={() => navigate(`/description/${secondaryJob._id}`)}
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-[#6A38C2] flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{secondaryJob.title}</p>
                    <p className="text-[11px] text-[#6A38C2] font-semibold">{secondaryJob.salary ? `₹${secondaryJob.salary} LPA` : "Competitive"}</p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default HeroSection;