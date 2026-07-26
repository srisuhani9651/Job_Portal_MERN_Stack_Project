import React from "react";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-900 text-gray-300 py-6 mt-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          {/* Left */}
          <div className="text-center md:text-left">
            <h2 className="text-xl font-bold text-white">Job Portal</h2>
            <p className="text-sm mt-1">Find your dream job with us.</p>
          </div>

          {/* Center */}
          <div className="flex gap-6 my-4 md:my-0">
            <a href="/" className="hover:text-white transition">
              Home
            </a>
            <a href="/jobs" className="hover:text-white transition">
              Jobs
            </a>
            <a href="/browse" className="hover:text-white transition">
              Browse
            </a>
            <a href="/contact" className="hover:text-white transition">
              Contact
            </a>
          </div>

          {/* Right */}
          <div className="text-sm text-center md:text-right">
            © {new Date().getFullYear()} Job Portal. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
