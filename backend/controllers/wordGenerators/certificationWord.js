import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } from "docx";
import db from "../../config/db.js";
import fs from "fs";
import path from "path";
import { createWordFileSection } from "../shared/wordHelpers.js";


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

/* ===================== HELPER FUNCTIONS ===================== */
const formatReportDate = (startDate, endDate) => {
  if (!startDate) return "N/A";
  
  const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = d.toLocaleString('en-US', { month: 'short' });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  };

  if (!endDate || startDate === endDate) {
    return formatDate(startDate);
  }
  
  return `${formatDate(startDate)} to ${formatDate(endDate)}`;
};

const groupFilesByCategory = (rows) => {
  const groups = {};
  rows.forEach(row => {
    if (row.file_category) {
      if (!groups[row.file_category]) {
        groups[row.file_category] = [];
      }
      groups[row.file_category].push({
        path: row.file_path,
        caption: row.caption
      });
    }
  });
  return groups;
};

const createFieldRow = (label, value) => {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 22 }),
      new TextRun({ text: value || "N/A", size: 22 })
    ],
    spacing: { after: 150 }
  });
};

const createSectionHeading = (text, level = HeadingLevel.HEADING_2) => {
  return new Paragraph({
    text: text,
    heading: level,
    spacing: { before: 300, after: 200 }
  });
};

const createSubSection = (label, content, indent = false) => {
  return new Paragraph({
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 20 }),
      new TextRun({ text: content || "N/A", size: 20 })
    ],
    spacing: { after: 150 },
    indent: indent ? { left: 720 } : undefined
  });
};

// ✅ Check if file is an image
const isImageFile = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  return ['.jpg', '.jpeg', '.png', '.gif', '.bmp'].includes(ext);
};

// ✅ Function to embed images or list PDFs
const createFileSection = async (category, files) => {
  const sections = [];
  
  if (!files || files.length === 0) {
    sections.push(new Paragraph({
      children: [
        new TextRun({ text: `${category}: `, bold: true, size: 20 }),
        new TextRun({ text: "N/A", size: 20 })
      ],
      spacing: { after: 150 }
    }));
    return sections;
  }

  // Category heading
  sections.push(new Paragraph({
    children: [
      new TextRun({ text: `${category}:`, bold: true, size: 20 })
    ],
    spacing: { after: 100 }
  }));

  // Process each file
  for (const file of files) {
    if (isImageFile(file.path)) {
      // ✅ Embed image if it's an image file
      try {
        if (fs.existsSync(file.path)) {
          const imageBuffer = fs.readFileSync(file.path);
          
          sections.push(new Paragraph({
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: 500,
                  height: 350
                }
              })
            ],
            spacing: { after: 100 }
          }));

          // Add caption below image
          if (file.caption) {
            sections.push(new Paragraph({
              children: [
                new TextRun({ text: file.caption, italics: true, size: 18 })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 }
            }));
          }
        } else {
          console.error("Image file not found:", file.path);
          sections.push(new Paragraph({
            text: `[Image not found: ${file.caption || 'Unnamed'}]`,
            italics: true,
            size: 18,
            spacing: { after: 100 }
          }));
        }
      } catch (err) {
        console.error("Error embedding image:", err);
        sections.push(new Paragraph({
          text: `[Error loading image: ${file.caption || 'Unnamed'}]`,
          italics: true,
          size: 18,
          spacing: { after: 100 }
        }));
      }
    } else {
      // ✅ For PDFs and other files, just list them
      sections.push(new Paragraph({
        children: [
          new TextRun({ text: `📄 ${file.caption || 'Document'}`, size: 18, italics: true }),
          new TextRun({ text: ` (PDF file stored in system)`, size: 16, italics: true })
        ],
        spacing: { after: 100 }
      }));
    }
  }

  sections.push(new Paragraph({ text: "", spacing: { after: 150 } }));
  return sections;
};

/* ===================== WORD GENERATION ===================== */
export const generateCertificationWord = async (req, res) => {
  try {
    const reportId = req.params.id;
    console.log("Generating Certification Word for report ID:", reportId);
    
    const rows = await getReportData(reportId);
    
    if (!rows || rows.length === 0) {
      return res.status(404).send("Report not found");
    }

    const report = rows[0];
    const fileGroups = groupFilesByCategory(rows);
    console.log("File groups:", Object.keys(fileGroups));

    // Build document sections
    const sections = [
      // Title
      new Paragraph({
        text: "Report on Certification Course",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),

      // Basic Details
      createFieldRow("Name of the Department", report.department_name),
      createFieldRow("1. Name of the Activity/Event", report.activity_name),
      createFieldRow("2. Venue", report.venue),
      createFieldRow("3. Date and Duration", formatReportDate(report.start_date, report.end_date)),
    ];

    // ✅ Add files with images embedded
    sections.push(...await createWordFileSection("4. Brochure", fileGroups['brochure']));
    sections.push(...await createWordFileSection("5. Detailed Curriculum", fileGroups['curriculum']));
    sections.push(...await createWordFileSection("6. List of Students Enrolled", fileGroups['students_list']));


    // Coordinator
    sections.push(createFieldRow("7. Staff Coordinator", report.staff_coordinator));

    // Resource Persons
    sections.push(new Paragraph({
      children: [
        new TextRun({ text: "8. Details of Resource Persons: ", bold: true, size: 22 }),
        new TextRun({ text: report.details_of_resource_person || "N/A", size: 22 })
      ],
      spacing: { after: 300 }
    }));

    // Brief Summary Section
    sections.push(createSectionHeading("9. Brief Summary of the Activity/Event"));
    sections.push(createSubSection("a. Objectives", report.activity_objectives, true));
    sections.push(createSubSection("b. Technical Description", report.activity_description, true));
    sections.push(createSubSection("c. Outcomes", report.activity_outcomes, true));
    
    sections.push(...await createWordFileSection("d. Attendance of Participants", fileGroups['attendance']));
    sections.push(...await createWordFileSection("e. Assessment Details", fileGroups['assessment']));
    sections.push(...await createWordFileSection("f. Sample Feedback with Summary", fileGroups['feedback']));
    
    sections.push(createSubSection("g. Impact Analysis", report.activity_impact_analysis, true));

    // Geo Photos
    sections.push(...await createWordFileSection("10. Geo tagged Photographs with Caption", fileGroups['geo_photos']));

    // Certificate
    sections.push(...await createWordFileSection("11. Sample Certificate", fileGroups['certificate']));

    // Footer Note
    sections.push(new Paragraph({
      text: "\n\nNote: Images have been embedded. PDF documents are listed above and stored separately in the system.",
      italics: true,
      size: 18,
      spacing: { before: 600 },
      alignment: AlignmentType.CENTER
    }));

    // Signature Section
    sections.push(
      new Paragraph({ text: "\n\n\n", spacing: { before: 400 } }),
      new Paragraph({
        children: [
          new TextRun({ text: "Staff Coordinator", bold: true, size: 22 }),
          new TextRun({ text: "\t\t\t\t\t", size: 22 }),
          new TextRun({ text: "HOD", bold: true, size: 22 })
        ],
        spacing: { before: 200 }
      })
    );

    // Create document
    const doc = new Document({
      sections: [{
        properties: {
          page: {
            margin: {
              top: 1440,
              right: 1440,
              bottom: 1440,
              left: 1440
            }
          }
        },
        children: sections
      }]
    });

    // Generate buffer
    console.log("Generating Word buffer...");
    const buffer = await Packer.toBuffer(doc);
    console.log("Word document generated successfully");

    // Send response
    res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    res.setHeader("Content-Disposition", `attachment; filename=certification_report_${reportId}.docx`);
    res.send(buffer);

  } catch (err) {
    console.error("Word generation error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).send("Word generation failed: " + err.message);
  }
};

export default generateCertificationWord;