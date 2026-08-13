import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  Eye, 
  EyeOff, 
  Upload, 
  Loader2, 
  GraduationCap, 
  Briefcase, 
  UserPlus, 
  CheckCircle2, 
  FileText 
} from "lucide-react";

import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { USER_API } from "@/utils/constant";
import { setLoading } from "@/Redux/authSlice";

const Signup = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "",
    file: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const { loading } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const setRoleHandler = (role) => {
    setInput((prev) => ({ ...prev, role }));
  };

  const changeFileHandler = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setInput((prev) => ({ ...prev, file: selectedFile }));
      if (selectedFile.type.startsWith("image/")) {
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const isStrongPassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(input.password)) {
      toast.error(
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      );
      return;
    }

    if (!input.role) {
      toast.error("Please select a role (Student or Recruiter)");
      return;
    }

    const formData = new FormData();
    formData.append("fullName", input.fullName);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API}/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message || "Account created successfully! Please log in.");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-3 ring-8 ring-indigo-50/50 dark:ring-indigo-950/20">
              <UserPlus className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Create an Account
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Join JobPortal today as a job seeker or employer
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-4">
            
            {/* Responsive 2-Col Layout for Name and Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Full Name
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="h-4 w-4" />
                  </div>
                  <Input
                    id="fullName"
                    type="text"
                    value={input.fullName}
                    name="fullName"
                    onChange={changeEventHandler}
                    placeholder="John Doe"
                    required
                    className="pl-9 h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <Label htmlFor="phoneNumber" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Phone Number
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Phone className="h-4 w-4" />
                  </div>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={input.phoneNumber}
                    name="phoneNumber"
                    onChange={changeEventHandler}
                    placeholder="+91 9876543210"
                    required
                    className="pl-9 h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Email Address
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <Input
                  id="email"
                  type="email"
                  value={input.email}
                  name="email"
                  onChange={changeEventHandler}
                  placeholder="name@example.com"
                  required
                  className="pl-9 h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Password
              </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={input.password}
                  name="password"
                  onChange={changeEventHandler}
                  placeholder="••••••••"
                  required
                  className="pl-9 pr-10 h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.
              </p>
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Select Your Role
              </Label>
              <div className="grid grid-cols-2 gap-3">
                {/* Student Option */}
                <button
                  type="button"
                  onClick={() => setRoleHandler("Student")}
                  className={`relative flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                    input.role === "Student"
                      ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/20"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Student</span>
                  {input.role === "Student" && (
                    <CheckCircle2 className="w-3.5 h-3.5 absolute top-2 right-2 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>

                {/* Recruiter Option */}
                <button
                  type="button"
                  onClick={() => setRoleHandler("Recruiter")}
                  className={`relative flex items-center justify-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all ${
                    input.role === "Recruiter"
                      ? "border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 ring-2 ring-indigo-600/20"
                      : "border-slate-200 dark:border-slate-700 bg-slate-50/30 dark:bg-slate-800/30 text-slate-600 dark:text-slate-400 hover:bg-slate-100/60 dark:hover:bg-slate-800"
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Recruiter</span>
                  {input.role === "Recruiter" && (
                    <CheckCircle2 className="w-3.5 h-3.5 absolute top-2 right-2 text-indigo-600 dark:text-indigo-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Profile Image / File Upload */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Profile Picture
              </Label>
              
              <div className="flex items-center gap-4 p-3 bg-slate-50/50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl hover:border-indigo-500 transition-colors group">
                <div className="relative flex-shrink-0">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/50 group-hover:text-indigo-600 transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <label htmlFor="profile-upload" className="cursor-pointer">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate hover:text-indigo-600 transition-colors">
                      {input.file ? input.file.name : "Choose profile picture"}
                    </p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 truncate">
                      {input.file ? `${(input.file.size / 1024).toFixed(1)} KB` : "PNG, JPG, JPEG up to 5MB"}
                    </p>
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={changeFileHandler}
                    className="hidden"
                  />
                </div>

                {input.file && (
                  <button
                    type="button"
                    onClick={() => {
                      setInput((prev) => ({ ...prev, file: null }));
                      setPreviewUrl(null);
                    }}
                    className="text-xs text-red-500 hover:underline px-2 py-1"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              {loading ? (
                <Button
                  disabled
                  className="w-full h-11 bg-indigo-600 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all"
                >
                  Sign Up
                </Button>
              )}
            </div>

            {/* Redirect Footer */}
            <div className="text-center pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                >
                  Login
                </Link>
              </span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
