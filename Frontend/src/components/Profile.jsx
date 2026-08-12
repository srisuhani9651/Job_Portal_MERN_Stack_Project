import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Contact, Mail, Pen, FileText, Sparkles, BadgeCheck } from "lucide-react";
import AppliedJobTable from "./AppliedJobTable";
import Navbar from "./shared/Navbar";
import Footer from "./Footer";
import UpdateProfileDialog from "./UpdateProfileDialog";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const Profile = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && (user?.role === "Recruiter" || user?.role?.toLowerCase() === "recruiter")) {
      navigate("/admin/companies");
    }
  }, [user, navigate]);

  // Skills handling
  const skills = Array.isArray(user?.profile?.skills)
    ? user.profile.skills
    : user?.profile?.skills
    ? user.profile.skills.split(",")
    : [];

  const hasResume = Boolean(user?.profile?.resume);

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const fullName = user?.fullName || user?.fullname || "Full Name";
  const bio = user?.profile?.bio || "No bio added yet. Click edit to add your bio.";
  const email = user?.email || "user@example.com";
  const phoneNumber = user?.phoneNumber || "Not provided";
  const role = user?.role || "Student";

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      <Navbar />

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Profile Details Card */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-sm relative overflow-hidden transition-all duration-200 hover:shadow-md">
          {/* Decorative Top Banner */}
          <div className="h-32 sm:h-40 bg-gradient-to-r from-[#6A38C2] via-purple-600 to-indigo-600 relative">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          <div className="px-6 sm:px-10 pb-8 pt-0 relative">
            {/* Header Flex Row */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-end gap-5">
                <div className="-mt-14 sm:-mt-16 shrink-0">
                  <Avatar className="h-28 w-28 sm:h-32 sm:w-32 border-4 border-white shadow-xl rounded-full ring-2 ring-purple-100 bg-white">
                    <AvatarImage
                      src={user?.profile?.profilePhoto}
                      alt={fullName}
                      className="object-cover"
                    />
                    <AvatarFallback className="bg-gradient-to-tr from-[#6A38C2] to-purple-500 text-white font-bold text-2xl sm:text-3xl">
                      {getInitials(fullName)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="pt-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                      {fullName}
                    </h1>
                    <BadgeCheck className="w-6 h-6 text-purple-600 shrink-0" />
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="secondary"
                      className="bg-purple-50 text-[#6A38C2] font-semibold text-xs border-purple-100 px-3 py-0.5 rounded-full"
                    >
                      {role}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Edit Profile Action */}
              <Button
                onClick={() => setOpen(true)}
                variant="outline"
                className="self-start sm:self-auto border-gray-200 text-gray-700 hover:bg-purple-50 hover:text-[#6A38C2] hover:border-purple-200 rounded-full px-5 gap-2 cursor-pointer shadow-sm transition-all sm:mb-1"
              >
                <Pen className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-sm">Edit Profile</span>
              </Button>
            </div>

            {/* User Bio */}
            <div className="my-4">
              <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-3xl">
                {bio}
              </p>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/70 border border-gray-100/80">
                <div className="w-9 h-9 rounded-xl bg-purple-100/80 flex items-center justify-center text-[#6A38C2] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/70 border border-gray-100/80">
                <div className="w-9 h-9 rounded-xl bg-purple-100/80 flex items-center justify-center text-[#6A38C2] shrink-0">
                  <Contact className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Phone</p>
                  <p className="text-sm font-medium text-gray-800 truncate">{phoneNumber}</p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="my-6 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                  Skills & Expertise
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills && skills.length > 0 && skills[0] !== "" ? (
                  skills.map((item, index) => (
                    <Badge
                      key={index}
                      className="bg-purple-50 hover:bg-purple-100 text-[#6A38C2] border border-purple-200/60 text-xs font-semibold px-3 py-1 rounded-full transition-colors"
                    >
                      {typeof item === "string" ? item.trim() : item}
                    </Badge>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No skills listed yet</span>
                )}
              </div>
            </div>

            {/* Resume Section */}
            <div className="pt-4 border-t border-gray-100">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">
                Resume
              </h2>
              {hasResume ? (
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  // resume url is receiving here>
                  href={user?.profile?.resume} 
                  className="inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200/60 px-4 py-2 rounded-xl transition-all group"
                >
                  <FileText className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
                  <span className="underline underline-offset-2">
                    {/* showing original resume name */}
                    {user?.profile?.resumeOriginalName || "View Uploaded Resume"} 
                  </span>
                </a>
              ) : (
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Badge variant="outline" className="bg-gray-100 text-gray-600 border-gray-200">
                    N/A
                  </Badge>
                  <span>No resume uploaded yet.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Applied Jobs Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-xl text-gray-900 tracking-tight">
                Applied Jobs
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Track status updates on all positions you have submitted applications for.
              </p>
            </div>
          </div>
          {/* Applied Jobs Table */}
          <AppliedJobTable />
        </div>
      </main>

      {/* Edit Profile Modal Dialog */}
      <UpdateProfileDialog open={open} setOpen={setOpen} />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Profile;
