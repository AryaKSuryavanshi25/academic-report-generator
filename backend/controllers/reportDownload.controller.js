import db from "../config/db.js";
import { generateCertificationPDF } from "./pdfGenerators/certificationPDF.js";
// Import other PDF generators as your team creates them
// import { generateWorkshopPDF } from "./pdfGenerators/workshopPDF.js";
// import { generateFdpPDF } from "./pdfGenerators/fdpPDF.js";
// import { generateSttpPDF } from "./pdfGenerators/sttpPDF.js";
// import { generateInhousePDF } from "./pdfGenerators/inhousePDF.js";
// import { generateOutreachPDF } from "./pdfGenerators/outreachPDF.js";
// import { generateSportsPDF } from "./pdfGenerators/sportsPDF.js";
// import { generateCulturalPDF } from "./pdfGenerators/culturalPDF.js";

/* ===================== GET REPORT TYPE ===================== */
const getReportType = (reportId) => {
  return new Promise((resolve, reject) => {
    db.query(
      "SELECT report_type FROM reports WHERE report_id = ?",
      [reportId],
      (err, results) => {
        if (err) reject(err);
        if (results && results.length > 0) {
          resolve(results[0].report_type);
        } else {
          reject(new Error("Report not found"));
        }
      }
    );
  });
};

/* ===================== MAIN DOWNLOAD HANDLER ===================== */
export const downloadPDF = async (req, res) => {
  try {
    const reportId = req.params.id;
    
    // Get the report type from database
    const reportType = await getReportType(reportId);
    
    // Route to the appropriate PDF generator based on report type
    switch (reportType) {
      case 'CERTIFICATION':
        await generateCertificationPDF(req, res);
        break;
      
      // Uncomment these as your team creates the files
      // case 'WORKSHOP':
      //   await generateWorkshopPDF(req, res);
      //   break;

      // case 'SEMINAR':
      //   await generateSeminarPDF(req, res);
      //   break;
      
      // case 'FDP':
      //   await generateFdpPDF(req, res);
      //   break;
      
      // case 'STTP':
      //   await generateSttpPDF(req, res);
      //   break;
      
      // case 'INHOUSE':
      //   await generateInhousePDF(req, res);
      //   break;
      
      // case 'OUTREACH':
      //   await generateOutreachPDF(req, res);
      //   break;
      
      // case 'SPORTS':
      //   await generateSportsPDF(req, res);
      //   break;
      
      // case 'CULTURAL':
      //   await generateCulturalPDF(req, res);
      //   break;
      
      default:
        res.status(400).send(`PDF generation for report type "${reportType}" is not yet implemented. Please contact the development team.`);
    }
  } catch (err) {
    console.error("Report download error:", err);
    if (!res.headersSent) {
      res.status(500).send("Failed to generate PDF: " + err.message);
    }
  }
};

export default { downloadPDF };