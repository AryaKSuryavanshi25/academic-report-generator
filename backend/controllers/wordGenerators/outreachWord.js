import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import db from "../../config/db.js";
import fs from "fs";
import path from "path";
import { 
  createWordFileSection,
  formatReportDate,
  groupFilesByCategory,
  createFieldRow,
  createBoldSection,
  createSubSection
} from "../shared/wordHelpers.js";

/* ===================== FETCH DATA ===================== */
const getReportData = (reportId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT r.*, 
             rf.file_id, rf.file_category, rf.file_path, rf.caption
      FROM reports r
      LEFT JOIN report_files rf ON r.report_id = rf.report_id
      WHERE r.report_id = ? AND r.report_type = 'OUTREACH'
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

/* ===================== WORD GENERATION ===================== */
export const generateOutreachWord = async (req, res) => {
  try {
    const reportId = req.params.id;
    console.log("Generating Outreach Word for report ID:", reportId);
    
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
        text: "Report on Outreach Activity/Event",
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 }
      }),

      // Basic Details
      createFieldRow("Name of the Department / Institute Level Committee", report.department_name),
      createFieldRow("1. Name of the Activity/Event", report.activity_name),
      createFieldRow("2. Venue", report.venue),
      createFieldRow("3. Date and Duration", formatReportDate(report.start_date, report.end_date)),
      createFieldRow("4. Number of Beneficiaries", report.number_of_beneficiaries?.toString()),
      createFieldRow("5. Number of Student Volunteers", report.number_of_student_volunteers?.toString()),
    ];

    // Brochure/Newspaper Cutting
    sections.push(...await createWordFileSection("6. Brochure/Newspaper Cutting", fileGroups['brochure']));

    // Coordinators
    sections.push(createFieldRow("7. Student Coordinator", report.student_coordinator));
    sections.push(createFieldRow("8. Staff Coordinator", report.staff_coordinator));
    sections.push(createFieldRow("9. Collaborating Agency", report.collaborating_agency));

    // Section 10 - Bold (not blue heading)
    sections.push(createBoldSection("10. Brief Summary of the Activity/Event"));
    sections.push(createSubSection("a. Objectives", report.activity_objectives, true));
    sections.push(createSubSection("b. Technical Description", report.activity_description, true));
    sections.push(createSubSection("c. Outcomes", report.activity_outcomes, true));
    
    sections.push(...await createWordFileSection("d. Attendance of Student Volunteers", fileGroups['attendance'], true));
    
    sections.push(createSubSection("e. Impact Analysis", report.activity_impact_analysis, true));

    // Geo Photos
    sections.push(...await createWordFileSection("11. Geo tagged Photographs with Caption", fileGroups['geo_photos']));

    // Certificate
    sections.push(...await createWordFileSection("12. Sample Certificate", fileGroups['certificate']));

    // ===================== SIGNATURE SECTION (TABLE-BASED) =====================
    sections.push(
      // Add space before signatures
      new Paragraph({ text: "", spacing: { before: 800 } }),
      
      // Signature table
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE }
        },
        rows: [
          // Names row
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Staff Coordinator", bold: true, size: 22 })
                    ],
                    alignment: AlignmentType.LEFT
                  })
                ],
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE }
                }
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "HOD", bold: true, size: 22 })
                    ],
                    alignment: AlignmentType.RIGHT
                  })
                ],
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE }
                }
              })
            ]
          }),
          
          // Signature lines row
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "___________________________", size: 22 })
                    ],
                    alignment: AlignmentType.LEFT,
                    spacing: { before: 100 }
                  })
                ],
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE }
                }
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({ text: "___________________________", size: 22 })
                    ],
                    alignment: AlignmentType.RIGHT,
                    spacing: { before: 100 }
                  })
                ],
                width: { size: 50, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.NONE },
                  bottom: { style: BorderStyle.NONE },
                  left: { style: BorderStyle.NONE },
                  right: { style: BorderStyle.NONE }
                }
              })
            ]
          })
        ]
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
    res.setHeader("Content-Disposition", `attachment; filename=outreach_report_${reportId}.docx`);
    res.send(buffer);

  } catch (err) {
    console.error("Word generation error:", err);
    console.error("Error stack:", err.stack);
    res.status(500).send("Word generation failed: " + err.message);
  }
};

export default generateOutreachWord;