import express from "express";
import multer from "multer";
import { createReport } from "../controllers/reports.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post(
  "/",
  upload.any(),   // accepts all PDFs
  createReport
);

export default router;
