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
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Edit2,
  MoreHorizontal,
  Calendar,
  MapPin,
  Globe,
  Plus,
} from "lucide-react";

const CompaniesTable = () => {
  const { companies = [], searchCompanyByText = "" } = useSelector(
    (store) => store.company || {}
  );
  const [filterCompany, setFilterCompany] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = (companies || []).filter((company) => {
      if (!searchCompanyByText) return true;
      return company?.name
        ?.toLowerCase()
        .includes(searchCompanyByText.toLowerCase());
    });
    setFilterCompany(filtered);
  }, [companies, searchCompanyByText]);

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
      {/* Zero/Empty State when no companies registered at all */}
      {companies.length === 0 ? (
        <div className="text-center py-16 px-4 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-[#6A38C2] mx-auto flex items-center justify-center mb-4 shadow-sm">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            No Companies Registered
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            You haven't registered any companies yet. Register a company to start posting job listings.
          </p>
          <Button
            onClick={() => navigate("/admin/companies/create")}
            className="bg-gradient-to-r from-[#6A38C2] to-indigo-600 hover:opacity-95 text-white font-semibold rounded-xl px-5 py-2.5 shadow-md shadow-purple-500/20"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Register Your First Company
          </Button>
        </div>
      ) : filterCompany.length === 0 ? (
        /* Empty search results state */
        <div className="text-center py-12 px-4 bg-gray-50/50 rounded-2xl border border-gray-100">
          <p className="text-base font-semibold text-gray-800">
            No matching companies found
          </p>
          <p className="text-sm text-gray-500 mt-1">
            No company matching "<span className="font-medium text-gray-700">{searchCompanyByText}</span>" was found.
          </p>
        </div>
      ) : (
        /* Companies Table */
        <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-gray-50/70">
              <TableRow className="border-b border-gray-100 hover:bg-transparent">
                <TableHead className="w-20 pl-6 text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Logo
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Company Name
                </TableHead>
                <TableHead className="text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Registered Date
                </TableHead>
                <TableHead className="text-right pr-6 text-xs font-bold text-gray-600 uppercase tracking-wider py-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filterCompany.map((company) => (
                <TableRow
                  key={company._id}
                  className="hover:bg-purple-50/40 transition-colors border-b border-gray-100 last:border-0"
                >
                  {/* Logo Column */}
                  <TableCell className="pl-6 py-4">
                    <div className="h-11 w-11 rounded-xl border border-gray-200 bg-white shadow-xs flex items-center justify-center p-1 overflow-hidden shrink-0">
                      {company?.logo ? (
                        <img
                          src={company.logo}
                          alt={company.name || "Company"}
                          className="max-h-full max-w-full w-auto h-auto object-contain object-center"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-100 to-indigo-100 text-[#6A38C2] font-bold text-xs rounded-lg flex items-center justify-center">
                          {getInitials(company?.name)}
                        </div>
                      )}
                    </div>
                  </TableCell>

                  {/* Company Name & Location / Website Info */}
                  <TableCell className="py-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-bold text-gray-900 text-sm">
                        {company?.name}
                      </span>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        {company?.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            {company.location}
                          </span>
                        )}
                        {company?.website && (
                          <a
                            href={
                              company.website.startsWith("http")
                                ? company.website
                                : `https://${company.website}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-purple-600 hover:underline hover:text-purple-700"
                          >
                            <Globe className="w-3 h-3 text-purple-500" />
                            Website
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  {/* Registered Date */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      <span>{formatDate(company?.createdAt)}</span>
                    </div>
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
                        className="w-36 p-1.5 rounded-xl shadow-lg border border-purple-100/80 bg-white"
                        align="end"
                      >
                        <button
                          onClick={() =>
                            navigate(`/admin/companies/${company._id}`)
                          }
                          className="flex items-center gap-2.5 w-full px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] rounded-lg transition-colors cursor-pointer text-left"
                        >
                          <Edit2 className="w-3.5 h-3.5 text-[#6A38C2]" />
                          <span>Edit Details</span>
                        </button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default CompaniesTable;