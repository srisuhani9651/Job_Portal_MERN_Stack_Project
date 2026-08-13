import React from "react";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Calendar,
  Building2,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Sparkles,
} from "lucide-react";

const AppliedJobTable = () => {
  const { allAppliedJobs = [] } = useSelector((store) => store.jobs || {});
  const appliedJobs = allAppliedJobs;
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "C";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "C";
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "pending";
    if (s === "selected" || s === "accepted") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold text-xs px-3 py-1 flex items-center gap-1 w-fit shadow-xs">
          <CheckCircle2 className="w-3 h-3" />
          <span>Accepted</span>
        </Badge>
      );
    }
    if (s === "rejected") {
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200/80 font-bold text-xs px-3 py-1 flex items-center gap-1 w-fit shadow-xs">
          <XCircle className="w-3 h-3" />
          <span>Rejected</span>
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200/80 font-bold text-xs px-3 py-1 flex items-center gap-1 w-fit shadow-xs">
        <Clock className="w-3 h-3" />
        <span>Pending</span>
      </Badge>
    );
  };

  return (
    <div className="w-full">
      {appliedJobs.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#6A38C2] mx-auto flex items-center justify-center mb-4 shadow-sm">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No Applications Found
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            You haven't submitted any job applications yet. Discover open roles and apply now!
          </p>
          <Button
            onClick={() => navigate("/jobs")}
            className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:opacity-95 text-white font-semibold rounded-xl px-5 py-2.5 shadow-md shadow-purple-500/20"
          >
            <Sparkles className="w-4 h-4 mr-1.5" />
            Explore Open Jobs
          </Button>
        </div>
      ) : (
        /* Applied Jobs Table */
        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-gray-50/70">
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="w-20 pl-6 text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Company
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Job Role
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Applied Date
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Status
                </TableHead>
                <TableHead className="text-right pr-6 text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Details
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {appliedJobs.map((item) => {
                const job = item?.job || {};
                const company = job?.company || {};
                const companyName = company?.name || (typeof company === "string" ? company : "Company");
                const companyLogo = company?.logo;
                const jobTitle = job?.title || item?.title || "Job Role";
                const jobId = job?._id || item?.jobId;

                return (
                  <TableRow
                    key={item._id}
                    className="hover:bg-purple-50/40 transition-colors border-b border-gray-100 last:border-0"
                  >
                    {/* Company Logo Avatar */}
                    <TableCell className="pl-6 py-4">
                      <div className="h-11 w-11 rounded-xl border border-gray-200 bg-white shadow-xs flex items-center justify-center p-1 overflow-hidden shrink-0">
                        {companyLogo ? (
                          <img
                            src={companyLogo}
                            alt={companyName}
                            className="max-h-full max-w-full w-auto h-auto object-contain object-center"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 text-[#6A38C2] font-bold text-xs rounded-lg flex items-center justify-center">
                            {getInitials(companyName)}
                          </div>
                        )}
                      </div>
                    </TableCell>

                    {/* Role & Company Details */}
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">
                            {jobTitle}
                          </span>
                          {job?.jobType && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-2 py-0.5 bg-purple-50 text-[#6A38C2] border-purple-100 font-semibold"
                            >
                              {job.jobType}
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1 font-medium text-gray-700">
                            <Building2 className="w-3 h-3 text-gray-400" />
                            {companyName}
                          </span>
                          {job?.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-gray-400" />
                              {job.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    {/* Applied Date */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDate(item?.createdAt)}</span>
                      </div>
                    </TableCell>

                    {/* Status Badge */}
                    <TableCell className="py-4">
                      {getStatusBadge(item.status)}
                    </TableCell>

                    {/* View Details Action */}
                    <TableCell className="text-right pr-6 py-4">
                      {jobId ? (
                        <button
                          onClick={() => navigate(`/description/${jobId}`)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#6A38C2] hover:text-purple-800 hover:underline cursor-pointer"
                        >
                          <span>View Job</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AppliedJobTable;