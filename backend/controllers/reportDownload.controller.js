import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import db from "../config/db.js";
import pdf from "pdf-poppler";
import sharp from "sharp";

/* ===================== FETCH DATA ===================== */
const getReportData = (reportId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT r.*, 
             c.detailed_curriculum, c.assessment_details,
             rf.file_id, rf.file_category, rf.file_path, rf.caption
      FROM reports r
      LEFT JOIN certification_details c ON r.report_id = c.report_id
      LEFT JOIN report_files rf ON r.report_id = rf.report_id
      WHERE r.report_id = ?
      ORDER BY rf.file_category, rf.file_id
      `,
      [reportId],
      (err, rows) => {
        if (err) reject(err);
        resolve(rows);
      }
    );
  });
};

/* ===================== PDF TO IMAGE CONVERSION WITH TRIMMING ===================== */
const convertPDFToImages = async (pdfPath) => {
  try {
    const outputDir = path.join(path.dirname(pdfPath), 'temp_images');
    
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const opts = {
      format: 'jpeg',
      out_dir: outputDir,
      out_prefix: path.basename(pdfPath, '.pdf'),
      page: null,
      scale: 1024
    };

    await pdf.convert(pdfPath, opts);

    const files = fs.readdirSync(outputDir);
    const imageFiles = files
      .filter(f => f.startsWith(opts.out_prefix))
      .sort()
      .map(f => path.join(outputDir, f));

    const trimmedImages = [];
    for (const imgPath of imageFiles) {
      try {
        const trimmedBuffer = await sharp(imgPath)
          .trim({ threshold: 10 })
          .toBuffer();
        
        await sharp(trimmedBuffer).toFile(imgPath);
        trimmedImages.push(imgPath);
      } catch (trimErr) {
        console.error(`Error trimming image ${imgPath}:`, trimErr.message);
        trimmedImages.push(imgPath);
      }
    }

    return trimmedImages;

  } catch (err) {
    console.error(`PDF conversion error: ${err.message}`);
    return [];
  }
};

/* ===================== HELPER FUNCTIONS ===================== */
const addPageHeader = (doc) => {
  doc.fontSize(16).font("Helvetica-Bold")
     .text("Agnel Charities'", { align: "center" });
  
  doc.fontSize(14).font("Helvetica-Bold")
     .text("Fr. C. Rodrigues Institute of Technology, Vashi", { align: "center" });
  
  doc.fontSize(10).font("Helvetica")
     .text("(An Autonomous Institute & Permanently Affiliated to University of Mumbai)", 
           { align: "center" });
  
  doc.moveDown(0.5);
  doc.fontSize(14).font("Helvetica-Bold")
     .text("Report for Certification Course", { align: "center" });
  
  doc.moveDown(1);
};

const addSection = (doc, label, content, numbered = false, number = null) => {
  if (doc.y > doc.page.height - 150) {
    doc.addPage();
    addPageHeader(doc);
  }

  if (numbered && number) {
    doc.fontSize(11).font("Helvetica-Bold").text(`${number}. ${label} :`, { continued: false });
  } else {
    doc.fontSize(11).font("Helvetica-Bold").text(`${label} :`, { continued: false });
  }
  
  doc.moveDown(0.3);
  
  const lines = (content || "N/A").split('\n');
  lines.forEach(line => {
    doc.fontSize(10).font("Helvetica").text(line, { align: "left" });
  });
  
  doc.moveDown(1);
};

const addSubSection = (doc, label, content, indent = 20) => {
  if (doc.y > doc.page.height - 150) {
    doc.addPage();
    addPageHeader(doc);
  }

  doc.fontSize(10).font("Helvetica-Bold").text(label, { indent: indent });
  doc.moveDown(0.2);
  
  const lines = (content || "N/A").split('\n');
  lines.forEach(line => {
    doc.fontSize(10).font("Helvetica").text(line, { 
      align: "left",
      indent: indent + 10 
    });
  });
  
  doc.moveDown(0.8);
};

const addImageFromPDF = async (doc, pdfPath, caption) => {
  try {
    if (!fs.existsSync(pdfPath)) {
      return;
    }

    const imageFiles = await convertPDFToImages(pdfPath);

    if (!imageFiles || imageFiles.length === 0) {
      return;
    }

    for (let i = 0; i < imageFiles.length; i++) {
      const imagePath = imageFiles[i];

      const pageWidth =
        doc.page.width - doc.page.margins.left - doc.page.margins.right;

      const imgData = doc.openImage(imagePath);
      const imgWidth = imgData.width;
      const imgHeight = imgData.height;

      const scale = Math.min(pageWidth / imgWidth, 400 / imgHeight);
      const scaledWidth = imgWidth * scale;
      const scaledHeight = imgHeight * scale;

      if (
        doc.y + scaledHeight + 20 >
        doc.page.height - doc.page.margins.bottom
      ) {
        doc.addPage();
        addPageHeader(doc);
      }

      const imageX =
        doc.page.margins.left +
        (pageWidth - scaledWidth) / 2;

      doc.image(imagePath, imageX, doc.y, {
        width: scaledWidth,
        height: scaledHeight
      });

      doc.y += scaledHeight + 5;

      const pageCaption =
        imageFiles.length > 1
          ? `${caption} ${i + 1}`
          : caption;

      if (pageCaption) {
        doc.fontSize(9)
          .font("Helvetica-Oblique")
          .text(pageCaption, {
            align: "center"
          });
        doc.moveDown(0.3);
      }
    }

    imageFiles.forEach((img) => {
      try {
        fs.unlinkSync(img);
      } catch (err) {
        console.error("Temp image delete error:", err.message);
      }
    });

  } catch (err) {
    console.error("Error adding images from PDF:", err.message);
  }
};

const groupFilesByCategory = (rows) => {
  const grouped = {};
  rows.forEach(row => {
    if (row.file_path && row.file_category) {
      if (!grouped[row.file_category]) {
        grouped[row.file_category] = [];
      }
      grouped[row.file_category].push({
        path: row.file_path,
        caption: row.caption
      });
    }
  });
  return grouped;
};

/* ===================== PDF GENERATION ===================== */
export const downloadPDF = async (req, res) => {
  try {
    const reportId = req.params.id;
    const rows = await getReportData(reportId);
    
    if (!rows || rows.length === 0) {
      return res.status(404).send("Report not found");
    }

    const report = rows[0];
    const fileGroups = groupFilesByCategory(rows);

    const doc = new PDFDocument({ 
      margin: 72,  // Increased from 50 to 72 (1 inch margins)
      size: 'A4',
      bufferPages: true
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=report_${reportId}.pdf`);
    doc.pipe(res);

    /* ========== HEADER ========== */
    addPageHeader(doc);

    /* ========== DEPARTMENT/COMMITTEE ========== */
    doc.fontSize(11).font("Helvetica-Bold")
       .text("Name of the Department/ Institute level Committee:", { continued: false });
    doc.moveDown(0.3);
    doc.fontSize(10).font("Helvetica")
       .text(report.department_name || "N/A");
    doc.moveDown(1);

    /* ========== 1. NAME OF ACTIVITY/EVENT ========== */
    addSection(doc, "Name of the Activity/Event", 
               `Certification Program on ${report.activity_name || "N/A"}`, 
               true, 1);

    /* ========== 2. VENUE ========== */
    addSection(doc, "Venue", report.venue, true, 2);

    /* ========== 3. DATE AND DURATION ========== */
    const dateRange = `${report.start_date} to ${report.end_date}`;
    addSection(doc, "Date and Duration", dateRange, true, 3);

    /* ========== 4. BROCHURE ========== */
    if (fileGroups['brochure']) {
      if (doc.y > doc.page.height - 200) {
        doc.addPage();
        addPageHeader(doc);
      }
      
      doc.fontSize(11).font("Helvetica-Bold").text(`4. Brochure :`);
      doc.moveDown(0.3);
      
      for (let idx = 0; idx < fileGroups['brochure'].length; idx++) {
        const file = fileGroups['brochure'][idx];
        const caption = file.caption || "";
        await addImageFromPDF(doc, file.path, caption);
      }
    } else {
      addSection(doc, "Brochure", "N/A", true, 4);
    }

    /* ========== 5. DETAILED CURRICULUM ========== */
    if (report.detailed_curriculum) {
      addSection(doc, "Detailed Curriculum with number of hours for each sections/modules", 
                 report.detailed_curriculum, true, 5);
    } else {
      addSection(doc, "Detailed Curriculum with number of hours for each sections/modules", 
                 "N/A", true, 5);
    }

    /* ========== 6. LIST OF STUDENTS ENROLLED ========== */
    if (fileGroups['students_list']) {
      if (doc.y > doc.page.height - 200) {
        doc.addPage();
        addPageHeader(doc);
      }
      
      doc.fontSize(11).font("Helvetica-Bold").text(`6. List of Students Enrolled :`);
      doc.moveDown(0.3);
      
      for (let idx = 0; idx < fileGroups['students_list'].length; idx++) {
        const file = fileGroups['students_list'][idx];
        const caption = file.caption || "";
        await addImageFromPDF(doc, file.path, caption);
      }
    } else {
      addSection(doc, "List of Students Enrolled", "N/A", true, 6);
    }

    /* ========== 7. STAFF COORDINATOR ========== */
    addSection(doc, "Staff Coordinator", report.staff_coordinator, true, 7);

    /* ========== 8. DETAILS OF RESOURCE PERSONS ========== */
    addSection(doc, "Details of Resource Persons", report.details_of_resource_person, true, 8);

    /* ========== 9. BRIEF SUMMARY ========== */
    if (doc.y > doc.page.height - 150) {
      doc.addPage();
      addPageHeader(doc);
    }
    
    doc.fontSize(11).font("Helvetica-Bold").text(`9. Brief Summary of the Activity/Event`);
    doc.moveDown(0.5);

    addSubSection(doc, "a. Objectives :", report.activity_objectives);
    addSubSection(doc, "b. Technical Description :", report.activity_description);
    addSubSection(doc, "c. Outcomes :", report.activity_outcomes);
    
    /* ========== 9d. ATTENDANCE ========== */
    if (fileGroups['attendance']) {
      if (doc.y > doc.page.height - 350) {
        doc.addPage();
        addPageHeader(doc);
      }
      
      doc.fontSize(10).font("Helvetica-Bold").text("d. Attendance of Participants (each day/session):", { 
        indent: 20
      });
      doc.moveDown(0.3);
      
      for (let idx = 0; idx < fileGroups['attendance'].length; idx++) {
        const file = fileGroups['attendance'][idx];
        const caption = file.caption || `Day ${Math.floor(idx / 3) + 1} Session ${(idx % 3) + 1}`;
        await addImageFromPDF(doc, file.path, caption);
      }
    } else {
      addSubSection(doc, "d. Attendance of Participants (each day/session):", "N/A");
    }

    /* ========== 9e. ASSESSMENT DETAILS ========== */
    if (report.assessment_details) {
      addSubSection(doc, "e. Assessment Details :", report.assessment_details);
    } else {
      addSubSection(doc, "e. Assessment Details :", "N/A");
    }

    /* ========== 9f. FEEDBACK ========== */
    if (fileGroups['feedback']) {
      if (doc.y > doc.page.height - 350) {
        doc.addPage();
        addPageHeader(doc);
      }
      
      doc.fontSize(10).font("Helvetica-Bold").text("f. Sample Feedback with Summary:", { 
        indent: 20
      });
      doc.moveDown(0.3);
      
      for (let idx = 0; idx < fileGroups['feedback'].length; idx++) {
        const file = fileGroups['feedback'][idx];
        const caption = file.caption || "";
        await addImageFromPDF(doc, file.path, caption);
      }
    } else {
      addSubSection(doc, "f. Sample Feedback with Summary:", "N/A");
    }

    /* ========== 9g. IMPACT ANALYSIS ========== */
    if (report.activity_impact_analysis) {
      addSubSection(doc, "g. Impact Analysis :", report.activity_impact_analysis);
    } else {
      addSubSection(doc, "g. Impact Analysis :", "N/A");
    }

    /* ========== 10. GEO-TAGGED PHOTOS ========== */
    if (fileGroups['geo_photos']) {
      // Estimate space needed: heading (30) + image (min 200) + margins (50) = ~280
      const estimatedSpaceNeeded = 280;
      const availableSpace = doc.page.height - doc.page.margins.bottom - doc.y;
      
      if (availableSpace < estimatedSpaceNeeded) {
        doc.addPage();
        addPageHeader(doc);
      }
      
      doc.fontSize(11).font("Helvetica-Bold").text(`10. Geo tagged Photographs with Caption:`);
      doc.moveDown(0.3);
      
      for (let idx = 0; idx < fileGroups['geo_photos'].length; idx++) {
        const file = fileGroups['geo_photos'][idx];
        await addImageFromPDF(doc, file.path, file.caption || "Event Photo");
      }
    } else {
      addSection(doc, "Geo tagged Photographs with Caption", "N/A", true, 10);
    }

    /* ========== 11. SAMPLE CERTIFICATE ========== */
    if (fileGroups['certificate']) {
      // Estimate space needed: heading (30) + image (min 200) + margins (50) = ~280
      const estimatedSpaceNeeded = 280;
      const availableSpace = doc.page.height - doc.page.margins.bottom - doc.y;
      
      if (availableSpace < estimatedSpaceNeeded) {
        doc.addPage();
        addPageHeader(doc);
      }
      
      doc.fontSize(11).font("Helvetica-Bold").text(`11. Sample Certificate :`);
      doc.moveDown(0.3);
      
      for (let idx = 0; idx < fileGroups['certificate'].length; idx++) {
        const file = fileGroups['certificate'][idx];
        await addImageFromPDF(doc, file.path, file.caption || "");
      }
    } else {
      addSection(doc, "Sample Certificate", "N/A", true, 11);
    }
    /* ========== FOOTER/SIGNATURE ========== */
    const signatureHeight = 100;
    if (doc.y > doc.page.height - doc.page.margins.bottom - signatureHeight) {
      doc.addPage();
      addPageHeader(doc);
    }

    const bottomY = doc.page.height - 150;
    doc.y = bottomY;

    doc.fontSize(10).font("Helvetica");
    const leftX = doc.page.margins.left;
    const rightX = doc.page.width - doc.page.margins.right - 150;

    doc.text("_____________________", leftX, bottomY - 10, { width: 150, align: "center" });
    doc.text("Staff Coordinator", leftX, bottomY + 10, { width: 150, align: "center" });

    doc.text("_____________________", rightX, bottomY - 10, { width: 150, align: "center" });
    doc.text("Head of the Department", rightX, bottomY + 10, { width: 150, align: "center" });

    doc.end();

  } catch (err) {
    console.error("PDF generation error:", err);
    res.status(500).send("PDF generation failed: " + err.message);
  }
};

export default downloadPDF;