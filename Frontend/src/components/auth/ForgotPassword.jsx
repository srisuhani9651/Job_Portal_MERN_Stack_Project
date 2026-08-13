import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { 
  Mail, 
  Lock, 
  KeyRound, 
  ArrowLeft, 
  Loader2, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  RefreshCw 
} from "lucide-react";

import Navbar from "../shared/Navbar";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { USER_API } from "@/utils/constant";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Request OTP, 2: Enter OTP & Reset Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(30); // 30 seconds TOTP window

  const navigate = useNavigate();

  // Decrements the 30-second OTP countdown timer every second
  useEffect(() => {
    let timer;
    if (step === 2 && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Validates strong password rules (8+ chars, uppercase, lowercase, number, special char)
  const isStrongPassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
    return hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  // Formats seconds into 0:SS display format
  const formatTime = (seconds) => {
    return `${seconds}s`;
  };

  // Step 1: Sends 6-digit OTP to the entered email address
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your registered email address.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API}/forgot-password/send-otp`,
        { email },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "OTP sent to your email!");
        setStep(2);
        setCountdown(30);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Resends fresh OTP code to user's email
  const handleResendOtp = async () => {
    try {
      setResendLoading(true);
      const res = await axios.post(
        `${USER_API}/forgot-password/send-otp`,
        { email },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("A new OTP has been sent to your email!");
        setCountdown(30);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  // Step 2: Validates OTP and new password, then resets account password
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!otp || otp.trim().length !== 6) {
      toast.error("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!isStrongPassword(newPassword)) {
      toast.error(
        "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match. Please re-enter.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API}/forgot-password/reset-password`,
        {
          email,
          otp: otp.trim(),
          newPassword,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Password reset successfully! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
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
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">
              {step === 1 ? "Forgot Password" : "Reset Password"}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {step === 1
                ? "Enter your registered email to receive a verification code"
                : `Enter the 6-digit code sent to ${email} (valid for 30 seconds)`}
            </p>
          </div>

          {step === 1 ? (
            /* Step 1: Email Form */
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Registered Email Address
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    required
                    className="pl-9 h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>
              </div>

              <div className="pt-2">
                {loading ? (
                  <Button
                    disabled
                    className="w-full h-11 bg-indigo-600 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending OTP...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all"
                  >
                    Send Verification Code
                  </Button>
                )}
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </form>
          ) : (
            /* Step 2: OTP & New Password Form */
            <form onSubmit={handleResetPassword} className="space-y-4">
              {/* OTP Field */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="otp" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    6-Digit Verification Code
                  </Label>
                  <span className={`text-xs font-medium ${countdown > 0 ? "text-indigo-600 dark:text-indigo-400" : "text-red-500"}`}>
                    {countdown > 0 ? `Expires in ${formatTime(countdown)}` : "Expired"}
                  </span>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <Input
                    id="otp"
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="123456"
                    required
                    className="pl-9 text-center tracking-[0.3em] font-mono text-lg font-bold h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>
              </div>

              {/* New Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="newPassword" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  New Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
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
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character.
                </p>
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="pl-9 pr-10 h-11 bg-slate-50/50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 rounded-xl focus:bg-white dark:focus:bg-slate-900 transition-colors"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                {loading ? (
                  <Button
                    disabled
                    className="w-full h-11 bg-indigo-600 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20"
                  >
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Resetting Password...
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-md shadow-indigo-600/20 active:scale-[0.99] transition-all"
                  >
                    Reset Password
                  </Button>
                )}

                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 underline"
                  >
                    Change Email
                  </button>

                  <button
                    type="button"
                    disabled={resendLoading}
                    onClick={handleResendOtp}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1 font-medium disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3 h-3 ${resendLoading ? "animate-spin" : ""}`} />
                    Resend Code
                  </button>
                </div>
              </div>

              <div className="text-center pt-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
