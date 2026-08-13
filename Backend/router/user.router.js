import express from "express";
import {
  register,
  login,
  logout,
  updateprofile,
  changePassword,
  sendResetPasswordOtp,
  verifyResetPasswordOtp,
  resetPasswordWithOtp,
} from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { anyUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", anyUpload, register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/profile/update", isAuthenticated, anyUpload, updateprofile);
router.post("/changePassword", changePassword);

// OTP-based forgot password routes
router.post("/forgot-password/send-otp", sendResetPasswordOtp);
router.post("/forgot-password/verify-otp", verifyResetPasswordOtp);
router.post("/forgot-password/reset-password", resetPasswordWithOtp);

export default router;