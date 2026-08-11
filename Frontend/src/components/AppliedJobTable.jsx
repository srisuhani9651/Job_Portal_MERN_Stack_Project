import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { useSelector } from "react-redux";
import { Briefcase, Calendar, Building2 } from "lucide-react";

const AppliedJobTable = () => {
  // In future or existing store, user's applied jobs can be fetched.
  // We handle both real applied jobs if available or mock data safely.
  const { user } = useSelector((store) => store.auth);
  const appliedJobs = user?.profile?.appliedJobs || [
    {
      _id: "1",
      createdAt: "2026-07-26",
      job: { title: "Frontend Developer", company: { name: "Atlassian" } },
      status: "Selected",
    },
    {
      _id: "2",
      createdAt: "2026-07-28",
      job: { title: "Full Stack Engineer", company: { name: "Google" } },
      status: "Pending",
    },
  ];

  const getStatusBadge = (status) => {
    const s = status?.toLowerCase() || "pending";
    if (s === "selected" || s === "accepted") {
      return (
        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 px-3 py-1 font-medium rounded-full">
          Selected
        </Badge>
      );
    }
    if (s === "rejected") {
      return (
        <Badge className="bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100 px-3 py-1 font-medium rounded-full">
          Rejected
        </Badge>
      );
    }
    return (
      <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 px-3 py-1 font-medium rounded-full">
        Pending
      </Badge>
    );
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-gray-100 bg-white shadow-sm">
      <Table className="min-w-[600px]">
        <TableCaption className="py-4 text-xs text-gray-500">
          A list of your applied jobs and their current status
        </TableCaption>
        <TableHeader className="bg-gray-50/70">
          <TableRow>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Date</span>
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-purple-600" />
                <span>Job Role</span>
              </div>
            </TableHead>
            <TableHead className="font-semibold text-gray-700">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-purple-600" />
                <span>Company</span>
              </div>
            </TableHead>
            <TableHead className="text-right font-semibold text-gray-700">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appliedJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                You haven't applied for any jobs yet.
              </TableCell>
            </TableRow>
          ) : (
            appliedJobs.map((item) => (
              <TableRow key={item._id} className="hover:bg-purple-50/30 transition-colors">
                <TableCell className="font-medium text-gray-600 text-sm">
                  {item.createdAt ? item.createdAt.split("T")[0] : "N/A"}
                </TableCell>
                <TableCell className="font-semibold text-gray-900 text-sm">
                  {item.job?.title || item.title || "Frontend Developer"}
                </TableCell>
                <TableCell className="text-gray-700 text-sm">
                  {item.job?.company?.name || item.company || "Company"}
                </TableCell>
                <TableCell className="text-right">
                  {getStatusBadge(item.status)}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;