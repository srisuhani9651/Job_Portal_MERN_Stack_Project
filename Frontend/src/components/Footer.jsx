import React from "react";
import { Link } from "react-router-dom";
import {
  Briefcase,
  Globe,
  Share2,
  MessageSquare,
  Mail,
  ArrowUp,
  Heart,
} from "lucide-react";

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Multi-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Info Column (Spans 2 columns on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#6A38C2] to-purple-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-all duration-300">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Job<span className="bg-gradient-to-r from-[#6A38C2] to-indigo-400 bg-clip-text text-transparent">Sphere</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              Connecting top talent with leading companies worldwide. Discover your dream job or hire the best professionals with JobSphere.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://jobsphere.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-950/40 transition-all cursor-pointer"
                aria-label="Website"
              >
                <Globe className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@jobsphere.com"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-950/40 transition-all cursor-pointer"
                aria-label="Email Us"
              >
                <Mail className="w-4 h-4" />
              </a>
              <a
                href="#community"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-950/40 transition-all cursor-pointer"
                aria-label="Community"
              >
                <MessageSquare className="w-4 h-4" />
              </a>
              <a
                href="#share"
                className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 hover:bg-purple-950/40 transition-all cursor-pointer"
                aria-label="Share"
              >
                <Share2 className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-purple-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/jobs" className="hover:text-purple-400 transition-colors">
                  Find Jobs
                </Link>
              </li>
              <li>
                <Link to="/browse" className="hover:text-purple-400 transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-purple-400 transition-colors">
                  My Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Job Categories Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Popular Fields
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/jobs?query=frontend" className="hover:text-purple-400 transition-colors">
                  Frontend Developer
                </Link>
              </li>
              <li>
                <Link to="/jobs?query=backend" className="hover:text-purple-400 transition-colors">
                  Backend Developer
                </Link>
              </li>
              <li>
                <Link to="/jobs?query=fullstack" className="hover:text-purple-400 transition-colors">
                  Full Stack Engineer
                </Link>
              </li>
              <li>
                <Link to="/jobs?query=design" className="hover:text-purple-400 transition-colors">
                  UI/UX Designer
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Help Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Support & Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a href="#privacy" className="hover:text-purple-400 transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-purple-400 transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#help" className="hover:text-purple-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-purple-400 transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar Section */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="flex items-center gap-1.5">
            <span>© {new Date().getFullYear()} JobSphere. Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>All rights reserved.</span>
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
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
