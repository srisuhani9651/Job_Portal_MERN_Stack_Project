import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import CompaniesTable from "./CompaniesTable";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setSearchCompanyByText } from "@/Redux/companySlice";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import { Building2, Plus, Search, Sparkles } from "lucide-react";

const Companies = () => {
  useGetAllCompanies();
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSearchCompanyByText(input));
  }, [input, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Page Header Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-semibold mb-3">
                <Building2 className="w-3.5 h-3.5" />
                <span>Recruiter Workspace</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Registered <span className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent">Companies</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1 max-w-xl">
                Manage your registered organizations, update company profiles, and post job openings.
              </p>
            </div>

            {/* Top Action / New Company Button */}
            <Button
              onClick={() => navigate("/admin/companies/create")}
              className="bg-gradient-to-r from-[#6A38C2] via-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 rounded-xl px-5 py-2.5 text-sm transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer self-start md:self-auto flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>New Company</span>
            </Button>
          </div>
        </div>

        {/* Filter and Table Container */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          {/* Search Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Filter by company name..."
                className="pl-10 pr-4 py-2 bg-gray-50/70 border-gray-200 focus:bg-white rounded-xl text-sm transition-all focus-visible:ring-purple-500/20"
              />
            </div>
            <span className="text-xs text-gray-400 self-end sm:self-center font-medium">
              Showing your registered companies
            </span>
          </div>

          {/* Companies Table */}
          <CompaniesTable />
        </div>
      </main>
    </div>
  );
};

export default Companies;