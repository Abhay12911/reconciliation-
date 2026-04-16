

import express from "express";
import { reconcile } from "../controllers/reconcile.controller.js";

const router = express.Router();

router.post("/reconcile", reconcile);

export default router;