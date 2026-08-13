import React from "react";
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
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import axios from "axios";
import { APPLICATION_API } from "@/utils/constant";
import { setAllApplicants } from "@/Redux/applicationSlice";
import {
  Users,
  FileText,
  Phone,
  Mail,
  Calendar,
  MoreHorizontal,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
} from "lucide-react";

const shortlistingStatus = ["Accepted", "Rejected"];

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application || {});
  const dispatch = useDispatch();

  const applicationsList = applicants?.application || [];

  const getInitials = (name) => {
    if (!name || typeof name !== "string") return "A";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 0) return "A";
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

  const statusHandler = async (status, id) => {
    try {
      const res = await axios.post(
        `${APPLICATION_API}/status/${id}`,
        { status },
        { withCredentials: true }
      );
      if (res.data?.success) {
        toast.success(res.data.message || `Application marked as ${status}`);

        // Update application status locally in Redux store
        if (applicants) {
          const updatedApplications = (applicants.application || []).map((app) =>
            app._id === id ? { ...app, status: status.toLowerCase() } : app
          );
          dispatch(
            setAllApplicants({
              ...applicants,
              application: updatedApplications,
            })
          );
        }
      }
    } catch (error) {
      console.error("Status update error:", error);
      toast.error(
        error.response?.data?.message || "Failed to update application status"
      );
    }
  };

  return (
    <div className="w-full">
      {applicationsList.length === 0 ? (
        /* Empty State */
        <div className="text-center py-16 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#6A38C2] mx-auto flex items-center justify-center mb-4 shadow-sm">
            <Users className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No Applications Yet
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            No candidates have submitted applications for this job opening yet. Check back soon!
          </p>
        </div>
      ) : (
        /* Applications Table */
        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-gray-50/70">
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="w-20 pl-6 text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Applicant
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Full Name & Email
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Contact
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Resume
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Applied Date
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Status
                </TableHead>
                <TableHead className="text-right pr-6 text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applicationsList.map((item) => {
                const applicant = item?.applicant;
                const fullName = applicant?.fullName || applicant?.fullname || "Applicant";
                const email = applicant?.email || "No email";
                const phoneNumber = applicant?.phoneNumber || "N/A";
                const resumeUrl = applicant?.profile?.resume;
                const resumeName = applicant?.profile?.resumeOriginalName || "View Resume";
                const status = (item?.status || "pending").toLowerCase();

                return (
                  <TableRow
                    key={item._id}
                    className="hover:bg-purple-50/40 transition-colors border-b border-gray-100 last:border-0"
                  >
                    {/* Avatar Column */}
                    <TableCell className="pl-6 py-4">
                      <Avatar className="h-11 w-11 rounded-xl border border-gray-200 bg-white shadow-xs">
                        <AvatarImage
                          src={applicant?.profile?.profilePhoto}
                          alt={fullName}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-purple-100 to-indigo-100 text-[#6A38C2] font-bold text-sm rounded-xl">
                          {getInitials(fullName)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>

                    {/* Name & Email */}
                    <TableCell className="py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-900 text-sm">
                          {fullName}
                        </span>
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Mail className="w-3 h-3 text-gray-400" />
                          <span className="truncate max-w-[200px]">{email}</span>
                        </div>
                      </div>
                    </TableCell>

                    {/* Phone Number */}
                    <TableCell className="py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{phoneNumber}</span>
                      </div>
                    </TableCell>

                    {/* Resume Link */}
                    <TableCell className="py-4">
                      {resumeUrl ? (
                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200/60 text-[#6A38C2] text-xs font-semibold transition-all group"
                        >
                          <FileText className="w-3.5 h-3.5 text-purple-600 group-hover:scale-110 transition-transform" />
                          <span className="truncate max-w-[120px] underline underline-offset-2">
                            {resumeName}
                          </span>
                          <ExternalLink className="w-3 h-3 text-purple-400" />
                        </a>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-gray-50 text-gray-400 border-gray-200 text-xs font-normal"
                        >
                          Not Uploaded
                        </Badge>
                      )}
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
                      {status === "accepted" ? (
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200/80 font-bold text-xs px-2.5 py-0.5 flex items-center gap-1 w-fit">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Accepted</span>
                        </Badge>
                      ) : status === "rejected" ? (
                        <Badge className="bg-rose-50 text-rose-700 border-rose-200/80 font-bold text-xs px-2.5 py-0.5 flex items-center gap-1 w-fit">
                          <XCircle className="w-3 h-3" />
                          <span>Rejected</span>
                        </Badge>
                      ) : (
                        <Badge className="bg-amber-50 text-amber-700 border-amber-200/80 font-bold text-xs px-2.5 py-0.5 flex items-center gap-1 w-fit">
                          <Clock className="w-3 h-3" />
                          <span>Pending</span>
                        </Badge>
                      )}
                    </TableCell>

                    {/* Action Popover */}
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
                          className="w-36 p-1.5 rounded-xl shadow-lg border border-purple-100/80 bg-white space-y-1"
                          align="end"
                        >
                          {shortlistingStatus.map((statusItem) => {
                            const isAccepted = statusItem === "Accepted";
                            return (
                              <button
                                key={statusItem}
                                onClick={() =>
                                  statusHandler(statusItem, item._id)
                                }
                                className={`flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-left ${
                                  isAccepted
                                    ? "text-emerald-700 hover:bg-emerald-50"
                                    : "text-rose-700 hover:bg-rose-50"
                                }`}
                              >
                                {isAccepted ? (
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                )}
                                <span>{statusItem}</span>
                              </button>
                            );
                          })}
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

export default ApplicantsTable;
