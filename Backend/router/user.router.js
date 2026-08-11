import express from "express";
import {
  register,
  login,
  logout,
  updateprofile,
  changePassword,
} from "../controller/user.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { anyUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/register", anyUpload, register);
router.post("/login", login);
router.get("/logout", logout);
router.post("/profile/update", isAuthenticated, anyUpload, updateprofile);
router.post("/changePassword", changePassword);

export default router;