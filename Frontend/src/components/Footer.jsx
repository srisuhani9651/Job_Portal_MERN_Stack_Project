import React from "react";
import { Link } from "react-router-dom";
import { Briefcase, ArrowUp } from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800/80 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top Content Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          {/* Brand Info */}
          <div className="space-y-2 text-center md:text-left">
            <Link to="/" className="inline-flex items-center gap-2.5 group cursor-pointer">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#6A38C2] to-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform duration-300">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Job<span className="bg-gradient-to-r from-[#6A38C2] to-indigo-400 bg-clip-text text-transparent">Sphere</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-sm">
              Connecting top talent with leading companies worldwide.
            </p>
          </div>

          {/* Minimal Navigation Links */}
          <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-slate-300">
            <Link
              to="/"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/jobs"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
            >
              Find Jobs
            </Link>
            <Link
              to="/browse"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
            >
              Browse
            </Link>
            <Link
              to="/applied-jobs"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
            >
              Applied Jobs
            </Link>
            <Link
              to="/profile"
              className="px-3 py-1.5 rounded-lg hover:text-white hover:bg-slate-900 transition-colors"
            >
              My Profile
            </Link>
          </nav>
        </div>

        {/* Bottom Bar: Copyright and Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} JobSphere. All rights reserved.</p>

          <button
            type="button"
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer text-xs font-medium"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-purple-400" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
