import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, X, Upload } from "lucide-react";
import { USER_API } from "@/utils/constant";
import { setUser } from "@/Redux/authSlice";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

const UpdateProfileDialog = ({ open, setOpen }) => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    fullName: user?.fullName || user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: Array.isArray(user?.profile?.skills)
      ? user.profile.skills.join(",")
      : user?.profile?.skills || "",
    file: null,
  });

  useEffect(() => {
    if (user) {
      setInput({
        fullName: user?.fullName || user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: Array.isArray(user?.profile?.skills)
          ? user.profile.skills.join(",")
          : user?.profile?.skills || "",
        file: null,
      });
    }
  }, [user, open]);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.post(`${USER_API}/profile/update`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      if (res.data?.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message || "Profile updated successfully!");
        setOpen(false);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto border border-gray-100 relative animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Update Profile</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Make changes to your personal details and skills below.
            </p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-4">
          <div>
            <Label className="text-xs font-semibold text-gray-700">Full Name</Label>
            <Input
              type="text"
              name="fullName"
              value={input.fullName}
              onChange={changeEventHandler}
              placeholder="e.g. Suhani Srivastava"
              className="mt-1 border-gray-200 focus:border-[#6A38C2] rounded-xl"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-700">Email Address</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              placeholder="e.g. suhani@gmail.com"
              className="mt-1 border-gray-200 focus:border-[#6A38C2] rounded-xl"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-700">Phone Number</Label>
            <Input
              type="text"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeEventHandler}
              placeholder="e.g. 9876543210"
              className="mt-1 border-gray-200 focus:border-[#6A38C2] rounded-xl"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-700">Bio</Label>
            <Input
              type="text"
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              placeholder="Full stack web developer passionate about building web apps"
              className="mt-1 border-gray-200 focus:border-[#6A38C2] rounded-xl"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-700">
              Skills <span className="text-gray-400 font-normal">(Comma separated)</span>
            </Label>
            <Input
              type="text"
              name="skills"
              value={input.skills}
              onChange={changeEventHandler}
              placeholder="React, Node.js, MongoDB, TailwindCSS"
              className="mt-1 border-gray-200 focus:border-[#6A38C2] rounded-xl"
            />
          </div>

          <div>
            <Label className="text-xs font-semibold text-gray-700">Resume File (PDF)</Label>
            <div className="mt-1 flex items-center justify-between border border-dashed border-gray-300 rounded-xl p-3 bg-gray-50 hover:bg-purple-50/50 transition-colors">
              <div className="flex items-center gap-2 text-xs text-gray-600 truncate">
                <Upload className="w-4 h-4 text-purple-600 shrink-0" />
                <span className="truncate">
                  {input.file ? input.file.name : "Upload new resume (PDF)"}
                </span>
              </div>
              <label className="text-xs font-medium text-[#6A38C2] hover:underline cursor-pointer shrink-0">
                Browse
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={fileChangeHandler}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
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
              className="bg-gradient-to-r from-[#6A38C2] to-purple-600 hover:from-purple-700 hover:to-[#5b30a6] text-white rounded-xl px-6 cursor-pointer shadow-md shadow-purple-200"
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
