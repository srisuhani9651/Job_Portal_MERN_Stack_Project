import express from "express";
import {
  postJob,
  getAllJobs,
  getJobById,
  getRecruiterJobs,
  updateJob,
} from "../controller/job.controller.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/postJobs", isAuthenticated, postJob);
router.get("/get", isAuthenticated, getAllJobs);
router.get("/get/jobs", isAuthenticated, getAllJobs);
router.get("/get/job/:id", isAuthenticated, getJobById);
router.get("/recruiter/jobs", isAuthenticated, getRecruiterJobs);
router.put("/update/:id", isAuthenticated, updateJob);
router.post("/update/:id", isAuthenticated, updateJob);

export default router;