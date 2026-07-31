import React, { useState } from "react";
import { Button } from "./ui/button";
import { Search, Sparkles, Briefcase, Building2, Users, X, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (searchTerm) => {
    const term = searchTerm !== undefined ? searchTerm : query;
    if (term.trim()) {
      navigate(`/browse?query=${encodeURIComponent(term.trim())}`);
    } else {
      navigate("/browse");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const popularTags = [
    "Frontend Developer",
    "Backend Developer",
    "Data Analyst",
    "Full Stack",
    "Remote Jobs",
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-purple-50/70 via-white to-white py-12 sm:py-20 lg:py-24 px-4 sm:px-6">
      {/* Background Decorative Blur Spheres */}
      <div className="aria-hidden:true absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[15%] w-72 h-72 sm:w-96 sm:h-96 bg-purple-300/30 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[15%] w-60 h-60 sm:w-80 sm:h-80 bg-indigo-300/25 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-5xl mx-auto text-center z-10">
        {/* Top Tag / Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100/90 border border-purple-200 text-[#6A38C2] font-semibold text-xs sm:text-sm shadow-sm hover:scale-105 transition-transform duration-300 cursor-pointer">
          <Sparkles className="w-4 h-4 text-[#6A38C2] animate-pulse" />
          <span>No. 1 Job Hunt Platform</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-[1.15] my-6 sm:my-8 max-w-4xl mx-auto">
          Search, Apply & Get Your <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#6A38C2] via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Dream Job Today
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
          Discover thousands of job opportunities from top-tier companies. Take the next step in your career with seamless application tracking and instant matching.
        </p>

        {/* Search Bar Container */}
        <div className="w-full max-w-2xl mx-auto mb-6">
          <div className="relative flex flex-col sm:flex-row items-center gap-2 sm:gap-0 bg-white/90 backdrop-blur-xl border border-purple-100 shadow-xl shadow-purple-500/10 hover:shadow-purple-500/15 focus-within:border-purple-400 focus-within:ring-4 focus-within:ring-purple-100 rounded-2xl sm:rounded-full p-2 transition-all duration-300">
            <div className="flex items-center w-full pl-3 pr-2 sm:pr-0">
              <Search className="w-5 h-5 text-gray-400 min-w-5 mr-2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Job title, keywords, or company..."
                className="w-full py-2 sm:py-3 text-gray-800 placeholder-gray-400 bg-transparent text-sm sm:text-base outline-none border-none focus:outline-none focus:ring-0"
                id="hero-search-input"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="p-1 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors mr-2 cursor-pointer"
                  title="Clear input"
                  id="hero-clear-search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <Button
              onClick={() => handleSearch()}
              id="hero-search-button"
              className="w-full sm:w-auto bg-[#6A38C2] hover:bg-[#5b2fae] active:scale-95 text-white font-semibold px-6 py-3 sm:py-6 rounded-xl sm:rounded-full shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4" />
              <span>Search Jobs</span>
            </Button>
          </div>
        </div>

        {/* Popular Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-2xl mx-auto mb-12 text-xs sm:text-sm">
          <span className="text-gray-500 font-medium flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5 text-purple-600" /> Popular:
          </span>
          {popularTags.map((tag, idx) => (
            <button
              key={idx}
              onClick={() => {
                setQuery(tag);
                handleSearch(tag);
              }}
              id={`popular-tag-${idx}`}
              className="px-3 py-1.5 rounded-full bg-purple-50/80 hover:bg-purple-100 border border-purple-100 text-purple-700 hover:text-purple-900 transition-all cursor-pointer font-medium"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto pt-6 border-t border-purple-100/60">
          <div className="flex items-center justify-center sm:justify-start gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-purple-100/70 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-purple-100 text-[#6A38C2]">
              <Briefcase className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg text-gray-900">10k+</h3>
              <p className="text-xs text-gray-500 font-medium">Active Jobs Listed</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-purple-100/70 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-purple-100 text-[#6A38C2]">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg text-gray-900">500+</h3>
              <p className="text-xs text-gray-500 font-medium">Top Companies</p>
            </div>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-3 p-4 rounded-2xl bg-white/70 backdrop-blur-sm border border-purple-100/70 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 rounded-xl bg-purple-100 text-[#6A38C2]">
              <Users className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-lg text-gray-900">98%</h3>
              <p className="text-xs text-gray-500 font-medium">Placement Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;