import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { 
  Building2, 
  MapPin, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2 
} from "lucide-react";
import Navbar from "./shared/Navbar";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { JOB_API, APPLICATION_API } from "@/utils/constant";
import { setSingleJob } from "@/Redux/jobSlice";

const JobDescription = () => {
  const { id: jobId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { singleJob } = useSelector((store) => store.jobs);
  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);

  // Check if current user has already applied
  const isInitiallyApplied =
    singleJob?.application?.some(
      (app) => app?.applicant === user?._id || app === user?._id
    ) || false;

  const [isApplied, setIsApplied] = useState(isInitiallyApplied);

  useEffect(() => {
    setIsApplied(
      singleJob?.application?.some(
        (app) => app?.applicant === user?._id || app === user?._id
      ) || false
    );
  }, [singleJob, user]);

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${JOB_API}/get/job/${jobId}`, {
          withCredentials: true,
        });
        if (res.data?.success) {
          dispatch(setSingleJob(res.data.job));
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchSingleJob();
    }
  }, [jobId, dispatch]);

  const applyJobHandler = async () => {
    if (!user) {
      toast.error("Please login to apply for this job");
      navigate("/login");
      return;
    }

    try {
      setApplying(true);
      const res = await axios.get(`${APPLICATION_API}/apply/${jobId}`, {
        withCredentials: true,
      });

      if (res.data?.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          application: [
            ...(singleJob?.application || []),
            { applicant: user?._id },
          ],
        };
        dispatch(setSingleJob(updatedSingleJob)); // help us to real time update
        toast.success(res.data.message || "Applied successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to apply for job");
    } finally {
      setApplying(false);
    }
  };

  const companyName = singleJob?.company?.name || "Company";
  const logo = singleJob?.company?.logo;

  return (
    <div className="min-h-screen bg-gray-50/50 pb-16">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        {/* Back navigation */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#6A38C2] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Jobs</span>
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-64 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-[#6A38C2]" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-white border border-purple-100 flex items-center justify-center text-purple-600 font-bold overflow-hidden shrink-0 shadow-xs p-1.5">
                    {logo ? (
                      <img
                        src={logo}
                        alt={companyName}
                        className="max-h-full max-w-full w-auto h-auto object-contain object-center"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-[#6A38C2]" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {singleJob?.title}
                    </h1>
                    <p className="text-sm font-medium text-gray-600 mt-1 flex items-center gap-1.5">
                      <span>{companyName}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1 text-gray-500">
                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                        {singleJob?.location || "India"}
                      </span>
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge className="bg-blue-50 text-blue-700 border-blue-100 text-xs px-3 py-0.5 rounded-full">
                        {singleJob?.position
                          ? `${singleJob.position} Positions`
                          : "Open Position"}
                      </Badge>
                      <Badge className="bg-amber-50 text-amber-700 border-amber-100 text-xs px-3 py-0.5 rounded-full">
                        {singleJob?.jobType}
                      </Badge>
                      <Badge className="bg-purple-50 text-[#6A38C2] border-purple-100 text-xs px-3 py-0.5 rounded-full">
                        {singleJob?.salary
                          ? `${singleJob.salary} LPA`
                          : "Not Disclosed"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Apply Button */}
                <Button
                  onClick={isApplied ? null : applyJobHandler}
                  disabled={isApplied || applying}
                  className={`rounded-2xl px-8 py-6 text-sm font-semibold transition-all shadow-md ${
                    isApplied
                      ? "bg-gray-100 text-gray-500 border border-gray-200 cursor-not-allowed shadow-none"
                      : "bg-[#6A38C2] hover:bg-[#5b30a6] text-white shadow-purple-200 hover:shadow-lg cursor-pointer"
                  }`}
                >
                  {applying ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Applying...</span>
                    </div>
                  ) : isApplied ? (
                    <div className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Already Applied</span>
                    </div>
                  ) : (
                    "Apply Now"
                  )}
                </Button>
              </div>
            </div>

            {/* Detailed Info Card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
                Job Description
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <span className="font-semibold text-gray-700">Role:</span>
                  <p className="text-gray-600">{singleJob?.title}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-gray-700">Location:</span>
                  <p className="text-gray-600">{singleJob?.location}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-gray-700">
                    Experience Required:
                  </span>
                  <p className="text-gray-600">
                    {singleJob?.experienceLevel
                      ? `${singleJob.experienceLevel} Years`
                      : "Not specified"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-gray-700">Salary:</span>
                  <p className="text-gray-600">
                    {singleJob?.salary
                      ? `${singleJob.salary} LPA`
                      : "Not disclosed"}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-gray-700">
                    Total Applicants:
                  </span>
                  <p className="text-gray-600">
                    {singleJob?.application?.length || 0}
                  </p>
                </div>
                <div className="space-y-1">
                  <span className="font-semibold text-gray-700">
                    Posted Date:
                  </span>
                  <p className="text-gray-600">
                    {singleJob?.createdAt
                      ? singleJob.createdAt.split("T")[0]
                      : "Recently"}
                  </p>
                </div>
              </div>

              {/* Description Body */}
              <div className="pt-4 border-t border-gray-100 space-y-2">
                <h3 className="font-semibold text-gray-800 text-sm">
                  About the Role
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                  {singleJob?.description}
                </p>
              </div>

              {/* Requirements */}
              {singleJob?.requirements && singleJob.requirements.length > 0 && (
                <div className="pt-4 border-t border-gray-100 space-y-3">
                  <h3 className="font-semibold text-gray-800 text-sm">
                    Key Requirements & Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {singleJob.requirements.map((req, idx) => (
                      <Badge
                        key={idx}
                        className="bg-purple-50 text-[#6A38C2] border-purple-100 font-medium px-3 py-1 rounded-full text-xs"
                      >
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default JobDescription;
