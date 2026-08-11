import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, X, Upload, FileText, Camera } from "lucide-react";
import { USER_API } from "@/utils/constant";
import { setUser } from "@/Redux/authSlice";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    bio: "",
    skills: "",
    profilePhoto: null,
    resume: null,
  });

  const [photoPreview, setPhotoPreview] = useState("");

  // Sync state whenever dialog opens or user data changes
  useEffect(() => {
    if (user) {
      setInput({
        fullName: user?.fullName || user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: Array.isArray(user?.profile?.skills)
          ? user.profile.skills.join(", ")
          : user?.profile?.skills || "",
        profilePhoto: null,
        resume: null,
      });
      setPhotoPreview(user?.profile?.profilePhoto || "");
    }
  }, [user, open]);

  // Handle text input changes
  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Handle profile photo selection
  const photoChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePhoto: file });
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  // Handle resume selection
  const resumeChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, resume: file });
    }
  };

  // Submit updated profile
  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);

    if (input.profilePhoto) {
      formData.append("profilePhoto", input.profilePhoto);
    }
    if (input.resume) {
      formData.append("resume", input.resume);
    }

    try {
      setLoading(true);
      const res = await axios.post(`${USER_API}/profile/update`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      if (res.data?.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Profile updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto border border-gray-100 relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Update Profile</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Update your photo, personal details, skills, and resume.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-4">
          {/* Profile Picture Upload Section */}
          <div className="flex items-center gap-4 p-3 bg-purple-50/50 border border-purple-100 rounded-2xl">
            <div className="relative group shrink-0">
              <Avatar className="h-16 w-16 border-2 border-purple-200 shadow-sm">
                <AvatarImage src={photoPreview} alt={input.fullName} className="object-cover" />
                <AvatarFallback className="bg-purple-600 text-white font-bold text-lg">
                  {getInitials(input.fullName)}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="profile-photo-input"
                className="absolute inset-0 bg-black/40 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <Camera className="w-5 h-5" />
              </label>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-800">Profile Photo</p>
              <p className="text-[11px] text-gray-500 mb-1">JPG, PNG, or WebP</p>
              <label
                htmlFor="profile-photo-input"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6A38C2] hover:text-purple-700 hover:underline cursor-pointer truncate max-w-full"
              >
                <Upload className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  {input.profilePhoto ? input.profilePhoto.name : "Upload new photo"}
                </span>
              </label>
              <input
                id="profile-photo-input"
                type="file"
                accept="image/*"
                onChange={photoChangeHandler}
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700">Full Name</Label>
            <Input
              type="text"
              name="fullName"
              value={input.fullName}
              onChange={changeEventHandler}
              placeholder="e.g. Suhani Srivastava"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700">Email Address</Label>
              <Input
                type="email"
                name="email"
                value={input.email}
                onChange={changeEventHandler}
                placeholder="suhani@gmail.com"
                required
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-gray-700">Phone Number</Label>
              <Input
                type="tel"
                name="phoneNumber"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                placeholder="9876543210"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700">Bio</Label>
            <Input
              type="text"
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              placeholder="Full-stack developer enthusiastic about building modern web apps"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700">
              Skills <span className="text-gray-400 font-normal">(comma separated)</span>
            </Label>
            <Input
              type="text"
              name="skills"
              value={input.skills}
              onChange={changeEventHandler}
              placeholder="React, Node.js, MongoDB, Express"
            />
          </div>

          {/* Resume Upload */}
          <div className="space-y-1">
            <Label className="text-xs font-semibold text-gray-700">Resume (PDF)</Label>
            <div className="flex items-center justify-between border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50/70 hover:bg-purple-50/40 transition">
              <div className="flex items-center gap-2 text-xs text-gray-600 truncate mr-2">
                {input.resume ? (
                  <FileText className="w-4 h-4 text-[#6A38C2] shrink-0" />
                ) : (
                  <Upload className="w-4 h-4 text-gray-400 shrink-0" />
                )}
                <span className="truncate font-medium text-gray-700">
                  {input.resume
                    ? input.resume.name
                    : user?.profile?.resumeOriginalName || "Upload resume (PDF)"}
                </span>
              </div>
              <label className="text-xs font-semibold text-[#6A38C2] hover:text-purple-700 hover:underline cursor-pointer shrink-0">
                Browse
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={resumeChangeHandler}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="rounded-xl border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-xl px-6 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfileDialog;
