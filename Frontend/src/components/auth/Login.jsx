import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "sonner";
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2, 
  GraduationCap, 
  Briefcase, 
  LogIn, 
  CheckCircle2 
} from "lucide-react";

import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { USER_API } from "@/utils/constant";
import { setLoading, setUser } from "@/Redux/authSlice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const { loading } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const setRoleHandler = (role) => {
    setInput((prev) => ({ ...prev, role }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!input.role) {
      toast.error("Please select your role (Student or Recruiter)");
      return;
    }

    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API}/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        if (res.data.user?.role === "Recruiter" || res.data.user?.role?.toLowerCase() === "recruiter") {
          navigate("/admin/companies");
        } else {
          navigate("/");
        }
        toast.success(res.data.message || "Logged in successfully!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Invalid credentials or server error");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 dark:bg-slate-950 flex flex-col">
      <Navbar />
      
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none p-6 sm:p-8 transition-all duration-300">
          
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 mb-3 ring-8 ring-indigo-50/50 dark:ring-indigo-950/20">
              <LogIn className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Please enter your details to sign in
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submitHandler} className="space-y-4">
            
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
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Password
                </Label>
              </div>
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
            </div>

            {/* Role Selection */}
            <div className="space-y-1.5 pt-1">
              <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Account Type
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

            {/* Submit Button */}
            <div className="pt-2">
              {loading ? (
                <Button
                  disabled
                  className="w-full h-11 bg-indigo-600 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all"
                >
                  Login
                </Button>
              )}
            </div>

            {/* Redirect Footer */}
            <div className="text-center pt-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                >
                  Sign up
                </Link>
              </span>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;