import React, { useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { COMPANY_API } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { setSingleCompany } from "@/Redux/companySlice";
import {
  Building2,
  ArrowLeft,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const CompanyCreate = () => {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const registerNewCompany = async (e) => {
    e?.preventDefault();
    if (!companyName.trim()) {
      toast.error("Please enter a company name");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${COMPANY_API}/register`,
        { companyName: companyName.trim() },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        dispatch(setSingleCompany(res.data.company));
        toast.success(res.data.message || "Company registered successfully!");
        const companyId = res.data.company?._id;
        navigate(`/admin/companies/${companyId}`);
      }
    } catch (error) {
      console.error("Register company error:", error);
      toast.error(
        error.response?.data?.message || "Failed to register company"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Back Button Link */}
        <button
          onClick={() => navigate("/admin/companies")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#6A38C2] transition-colors cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-white border border-gray-200 group-hover:border-purple-200 group-hover:bg-purple-50 transition-all shadow-xs">
            <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-[#6A38C2] group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Back to Companies</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            {/* Header / Intro */}
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-semibold">
                <Building2 className="w-3.5 h-3.5" />
                <span>Step 1: Company Profile</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                What is your{" "}
                <span className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent">
                  Company Name
                </span>
                ?
              </h1>
              <p className="text-sm sm:text-base text-gray-500 max-w-xl">
                Enter your official company or organization name. You will be able to customize your logo, description, and website details next.
              </p>
            </div>

            {/* Registration Form */}
            <form onSubmit={registerNewCompany} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-sm font-bold text-gray-800">
                  Company Name <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="companyName"
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google, Microsoft, JobSphere Inc..."
                    className="pl-10 pr-4 py-2.5 h-11 bg-gray-50/70 border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all focus-visible:ring-purple-500/20"
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-500" />
                  <span>You can update or edit your company details at any time.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/companies")}
                  disabled={loading}
                  className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !companyName.trim()}
                  className="bg-gradient-to-r from-[#6A38C2] via-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 rounded-xl px-6 py-2.5 text-sm transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue</span>
                      <Sparkles className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CompanyCreate;