import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { JOB_API } from "@/utils/constant";
import { toast } from "sonner";
import useGetAllCompanies from "@/hooks/useGetAllCompanies";
import useGetSingleJob from "@/hooks/useGetSingleJob";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  IndianRupee,
  Award,
  Layers,
  Sparkles,
  ArrowLeft,
  Loader2,
  FileText,
  AlertCircle,
  Plus,
} from "lucide-react";

const JobSetup = () => {
  const params = useParams();
  const jobId = params.id;

  useGetAllCompanies();
  useGetSingleJob(jobId);

  const { companies = [] } = useSelector((store) => store.company || {});
  const { singleJob } = useSelector((store) => store.jobs || {});
  const navigate = useNavigate();

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    jobType: "Full-Time",
    experience: "",
    position: "",
    companyId: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (singleJob) {
      const companyIdVal =
        typeof singleJob.company === "object"
          ? singleJob.company?._id
          : singleJob.company || "";

      const reqs = Array.isArray(singleJob.requirements)
        ? singleJob.requirements.join(", ")
        : singleJob.requirements || "";

      setInput({
        title: singleJob.title || "",
        description: singleJob.description || "",
        requirements: reqs,
        salary: singleJob.salary || "",
        location: singleJob.location || "",
        jobType: singleJob.jobType || "Full-Time",
        experience:
          singleJob.experienceLevel !== undefined
            ? singleJob.experienceLevel
            : singleJob.experience || "",
        position: singleJob.position || "",
        companyId: companyIdVal,
      });
    }
  }, [singleJob]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.companyId) {
      toast.error("Please select a registered company");
      return;
    }

    if (
      !input.title.trim() ||
      !input.description.trim() ||
      !input.requirements.trim() ||
      !input.salary ||
      !input.location.trim() ||
      !input.jobType ||
      input.experience === "" ||
      !input.position
    ) {
      toast.error("Please fill in all the required fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.put(`${JOB_API}/update/${jobId}`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data?.success) {
        toast.success(res.data.message || "Job updated successfully!");
        navigate("/admin/jobs");
      }
    } catch (error) {
      console.error("Update job error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update job details"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate("/admin/jobs")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#6A38C2] transition-colors cursor-pointer group"
        >
          <div className="p-2 rounded-xl bg-white border border-gray-200 group-hover:border-purple-200 group-hover:bg-purple-50 transition-all shadow-xs">
            <ArrowLeft className="w-4 h-4 text-gray-600 group-hover:text-[#6A38C2] group-hover:-translate-x-0.5 transition-transform" />
          </div>
          <span>Back to Jobs</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 relative overflow-hidden">
          {/* Decorative backdrop glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            {/* Header */}
            <div className="space-y-2 pb-6 border-b border-gray-100">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Recruiter Workspace • Edit Job</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                Edit <span className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent">Job Details</span>
              </h1>
              <p className="text-sm text-gray-500 max-w-lg">
                Modify role requirements, update compensation package, or revise job description.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Job Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Job Title <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="title"
                      type="text"
                      name="title"
                      value={input.title}
                      onChange={changeEventHandler}
                      placeholder="e.g. Senior Frontend Developer"
                      className="pl-10 pr-4 py-2 bg-gray-50/70 border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all focus-visible:ring-purple-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Company Selection Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="companyId" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Assigned Company <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      id="companyId"
                      name="companyId"
                      value={input.companyId}
                      onChange={changeEventHandler}
                      required
                      className="w-full pl-10 pr-4 py-2.5 h-11 bg-gray-50/70 border border-gray-200 focus:border-[#6A38C2] focus:bg-white rounded-xl text-sm font-medium transition-all outline-none focus:ring-3 focus:ring-purple-500/10 cursor-pointer"
                    >
                      <option value="" disabled>
                        Choose registered company
                      </option>
                      {companies.map((comp) => (
                        <option key={comp._id} value={comp._id}>
                          {comp.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Job Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="location"
                      type="text"
                      name="location"
                      value={input.location}
                      onChange={changeEventHandler}
                      placeholder="e.g. Bangalore, India or Remote"
                      className="pl-10 pr-4 py-2 bg-gray-50/70 border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all focus-visible:ring-purple-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Job Type Dropdown */}
                <div className="space-y-2">
                  <Label htmlFor="jobType" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Job Type <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    <select
                      id="jobType"
                      name="jobType"
                      value={input.jobType}
                      onChange={changeEventHandler}
                      required
                      className="w-full pl-10 pr-4 py-2.5 h-11 bg-gray-50/70 border border-gray-200 focus:border-[#6A38C2] focus:bg-white rounded-xl text-sm font-medium transition-all outline-none focus:ring-3 focus:ring-purple-500/10 cursor-pointer"
                    >
                      <option value="Full-Time">Full-Time</option>
                      <option value="Part-Time">Part-Time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Remote">Remote</option>
                    </select>
                  </div>
                </div>

                {/* Salary */}
                <div className="space-y-2">
                  <Label htmlFor="salary" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Salary (LPA / Annual INR) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="salary"
                      type="number"
                      name="salary"
                      value={input.salary}
                      onChange={changeEventHandler}
                      placeholder="e.g. 1200000 or 12"
                      className="pl-10 pr-4 py-2 bg-gray-50/70 border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all focus-visible:ring-purple-500/20"
                      required
                      min={0}
                    />
                  </div>
                </div>

                {/* Experience Level */}
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Experience Level (Years) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Award className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="experience"
                      type="number"
                      name="experience"
                      value={input.experience}
                      onChange={changeEventHandler}
                      placeholder="e.g. 2 (for 2+ years)"
                      className="pl-10 pr-4 py-2 bg-gray-50/70 border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all focus-visible:ring-purple-500/20"
                      required
                      min={0}
                    />
                  </div>
                </div>

                {/* Number of Open Positions */}
                <div className="space-y-2">
                  <Label htmlFor="position" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Vacancies / Positions <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="position"
                      type="number"
                      name="position"
                      value={input.position}
                      onChange={changeEventHandler}
                      placeholder="e.g. 3"
                      className="pl-10 pr-4 py-2 bg-gray-50/70 border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all focus-visible:ring-purple-500/20"
                      required
                      min={1}
                    />
                  </div>
                </div>

                {/* Requirements / Key Skills */}
                <div className="space-y-2">
                  <Label htmlFor="requirements" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Skills / Requirements (Comma separated) <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Sparkles className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="requirements"
                      type="text"
                      name="requirements"
                      value={input.requirements}
                      onChange={changeEventHandler}
                      placeholder="e.g. React.js, Node.js, Tailwind CSS"
                      className="pl-10 pr-4 py-2 bg-gray-50/70 border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all focus-visible:ring-purple-500/20"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span>Job Description <span className="text-red-500">*</span></span>
                </Label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Outline key responsibilities, expectations, and perks for applicants..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/70 p-4 text-sm font-medium outline-none transition-all focus:border-[#6A38C2] focus:bg-white focus:ring-4 focus:ring-purple-500/10 placeholder:text-gray-400 resize-y"
                  required
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/admin/jobs")}
                  disabled={loading}
                  className="rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50 px-5 py-2.5 text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-[#6A38C2] via-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 rounded-xl px-7 py-2.5 text-sm transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <span>Save Changes</span>
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

export default JobSetup;
