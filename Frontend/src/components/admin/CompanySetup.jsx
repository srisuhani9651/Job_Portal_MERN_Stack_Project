import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { ArrowLeft, Building2, Globe, MapPin, Upload, Loader2, Sparkles, Image as ImageIcon, FileText } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import axios from "axios";
import { COMPANY_API } from "@/utils/constant";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import useGetCompanyById from "@/hooks/useGetCompanyById";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const CompanySetup = () => {
  const params = useParams();
  const companyId = params.id;
  useGetCompanyById(companyId);

  const { singleCompany } = useSelector((store) => store.company || {});
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");
  const navigate = useNavigate();

  const [input, setInput] = useState({
    name: "",
    description: "",
    website: "",
    location: "",
    file: null,
  });

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        description: singleCompany.description || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        file: null,
      });
      if (singleCompany.logo) {
        setPreview(singleCompany.logo);
      }
    }
  }, [singleCompany]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!input.name.trim()) {
      toast.error("Company name cannot be empty");
      return;
    }

    const formData = new FormData();
    formData.append("name", input.name.trim());
    formData.append("description", input.description.trim());
    formData.append("website", input.website.trim());
    formData.append("location", input.location.trim());
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      setLoading(true);
      const res = await axios.put(
        `${COMPANY_API}/update/${companyId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (res.data?.success) {
        toast.success(res.data.message || "Company information updated!");
        navigate("/admin/companies");
      }
    } catch (error) {
      console.error("Update company error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update company information"
      );
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "C";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "C";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Back Button */}
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
          {/* Decorative backdrop glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 border border-purple-200/60 text-[#6A38C2] text-xs font-semibold">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Step 2: Company Details</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                  Setup <span className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 bg-clip-text text-transparent">Company Profile</span>
                </h1>
                <p className="text-sm text-gray-500 max-w-lg">
                  Customize your organization info, address, website, and company logo.
                </p>
              </div>

              {/* Company Logo Preview Avatar */}
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 self-start sm:self-auto">
                <Avatar className="h-14 w-14 rounded-2xl border-2 border-white shadow-sm bg-white">
                  <AvatarImage src={preview} alt={input.name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-purple-100 to-indigo-100 text-[#6A38C2] font-bold text-lg rounded-2xl">
                    {getInitials(input.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="pr-2">
                  <p className="text-xs font-bold text-gray-800 truncate max-w-[120px]">
                    {input.name || "Company"}
                  </p>
                  <p className="text-[11px] text-gray-400">Logo preview</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={submitHandler} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Company Name <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="name"
                      type="text"
                      name="name"
                      value={input.name}
                      onChange={changeEventHandler}
                      placeholder="e.g. JobSphere Technologies"
                      className="pl-10 pr-4 py-2 bg-gray-50/70 border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all focus-visible:ring-purple-500/20"
                      required
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Website URL
                  </Label>
                  <div className="relative">
                    <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="website"
                      type="text"
                      name="website"
                      value={input.website}
                      onChange={changeEventHandler}
                      placeholder="https://jobsphere.com"
                      className="pl-10 pr-4 py-2 bg-gray-50/70 border-gray-200 focus:bg-white rounded-xl text-sm font-medium transition-all focus-visible:ring-purple-500/20"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Location
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
                    />
                  </div>
                </div>

                {/* Logo File Upload */}
                <div className="space-y-2">
                  <Label htmlFor="logo" className="text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Company Logo
                  </Label>
                  <div className="relative">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={changeFileHandler}
                      className="cursor-pointer file:cursor-pointer file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-purple-100 file:text-[#6A38C2] hover:file:bg-purple-200 bg-gray-50/70 border-gray-200 rounded-xl text-sm transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span>Company Description</span>
                </Label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={input.description}
                  onChange={changeEventHandler}
                  placeholder="Share a short bio or description of your organization, team, culture, and core values..."
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50/70 p-4 text-sm font-medium outline-none transition-all focus:border-[#6A38C2] focus:bg-white focus:ring-4 focus:ring-purple-500/10 placeholder:text-gray-400 resize-y"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
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
                  disabled={loading}
                  className="bg-gradient-to-r from-[#6A38C2] via-purple-600 to-indigo-600 hover:opacity-95 text-white font-semibold shadow-md shadow-purple-500/20 hover:shadow-lg hover:shadow-purple-500/30 rounded-xl px-7 py-2.5 text-sm transition-all transform hover:-translate-y-0.5 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-1" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <span>Save & Update</span>
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

export default CompanySetup;