import express from "express";
import { reconcile } from "../controllers/reconcile.controller.js";
import {
  getReport,
  getSummary,
  getUnmatched
} from "../controllers/report.controller.js";

const router = express.Router();

// main
router.post("/reconcile", reconcile);

// report APIs
router.get("/report/:runId", getReport);
router.get("/report/:runId/summary", getSummary);
router.get("/report/:runId/unmatched", getUnmatched);

export default router;