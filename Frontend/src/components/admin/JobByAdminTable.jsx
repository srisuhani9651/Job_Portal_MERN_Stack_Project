import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Briefcase,
  Building2,
  Calendar,
  Eye,
  MoreHorizontal,
  Edit2,
  Users,
  MapPin,
  Plus,
} from "lucide-react";

const JobByAdminTable = () => {
  const { allAdminJobs = [], searchJobByText = "" } = useSelector(
    (store) => store.jobs || {}
  );
  const [filterJobs, setFilterJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = (allAdminJobs || []).filter((job) => {
      if (!searchJobByText) return true;
      const titleMatch = job?.title
        ?.toLowerCase()
        .includes(searchJobByText.toLowerCase());
      const companyMatch = job?.company?.name
        ?.toLowerCase()
        .includes(searchJobByText.toLowerCase());
      return titleMatch || companyMatch;
    });
    setFilterJobs(filtered);
  }, [allAdminJobs, searchJobByText]);

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

  return (
    <div className="w-full">
      {/* Zero/Empty State when no jobs created at all */}
      {allAdminJobs.length === 0 ? (
        <div className="text-center py-16 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#6A38C2] mx-auto flex items-center justify-center mb-4 shadow-sm">
            <Briefcase className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No Jobs Posted Yet
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            You haven't posted any job openings yet. Create your first job listing to connect with applicants.
          </p>
          <Button
            onClick={() => navigate("/admin/jobs/create")}
            className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:opacity-95 text-white font-semibold rounded-xl px-5 py-2.5 shadow-md shadow-purple-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Post Your First Job
          </Button>
        </div>
      ) : filterJobs.length === 0 ? (
        /* Empty search results state */
        <div className="text-center py-12 px-4 bg-gray-50/50 rounded-2xl border border-gray-100">
          <p className="text-base font-semibold text-gray-800">
            No matching jobs found
          </p>
          <p className="text-sm text-gray-500 mt-1">
            No job matching "<span className="font-medium text-gray-700">{searchJobByText}</span>" was found.
          </p>
        </div>
      ) : (
        /* Admin Jobs Table */
        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-gray-50/70">
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="w-20 pl-6 text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Company
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Role / Title
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Date Posted
                </TableHead>
                <TableHead className="text-center text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Applicants
                </TableHead>
                <TableHead className="text-right pr-6 text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterJobs.map((job) => {
                const applicantsCount = job?.application?.length || 0;
                const companyName = job?.company?.name || "Company";
                return (
                  <TableRow
                    key={job._id}
                    className="hover:bg-purple-50/40 transition-colors border-b border-gray-100 last:border-0"
                  >
                    {/* Company Logo Column */}
                    <TableCell className="pl-6 py-4">
                      <div className="h-11 w-11 rounded-xl border border-gray-200 bg-white shadow-xs flex items-center justify-center p-1 overflow-hidden shrink-0">
                        {job?.company?.logo ? (
                          <img
                            src={job.company.logo}
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

                    {/* Role & Title Info */}
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-900 text-sm">
                            {job?.title}
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

                    {/* Date Posted */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{formatDate(job?.createdAt)}</span>
                      </div>
                    </TableCell>

                    {/* Applicants Count */}
                    <TableCell className="text-center py-4">
                      <button
                        onClick={() =>
                          navigate(`/admin/jobs/${job._id}/applicants`)
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 hover:bg-purple-100 text-[#6A38C2] text-xs font-bold transition-colors cursor-pointer border border-purple-200/60"
                        title="View Applicants"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>{applicantsCount}</span>
                      </button>
                    </TableCell>

                    {/* Action Column */}
                    <TableCell className="text-right pr-6 py-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-[#6A38C2] hover:bg-purple-100/60 rounded-lg cursor-pointer transition-colors"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-40 p-1.5 rounded-xl shadow-lg border border-purple-100/80 bg-white space-y-1"
                          align="end"
                        >
                          <button
                            onClick={() =>
                              navigate(`/admin/jobs/${job._id}`)
                            }
                            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-lg transition-colors cursor-pointer text-left"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-[#6A38C2]" />
                            <span>Edit Job</span>
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/admin/jobs/${job._id}/applicants`)
                            }
                            className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-lg transition-colors cursor-pointer text-left"
                          >
                            <Eye className="w-3.5 h-3.5 text-purple-600" />
                            <span>View Applicants</span>
                          </button>
                        </PopoverContent>
                      </Popover>
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

export default JobByAdminTable;
