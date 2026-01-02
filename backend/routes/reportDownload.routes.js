import express from "express";
import { downloadPDF} from "../controllers/reportDownload.controller.js";

const router = express.Router();

router.get("/reports/:id/pdf", downloadPDF);

export default router;
