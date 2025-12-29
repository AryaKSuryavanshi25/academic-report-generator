import db from "../config/db.js";

export const createReport = (req, res) => {
  const data = req.body;
  const files = req.files;

  /* 1️⃣ INSERT INTO reports */
  const reportQuery = `
    INSERT INTO reports (
      report_type,
      activity_name,
      venue,
      start_date,
      end_date,
      staff_coordinator,
      student_coordinator,
      activity_objectives,
      activity_description,
      activity_outcomes,
      activity_impact_analysis,
      details_of_resource_person,
      department_name
    )
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
  `;


  const reportValues = [
    data.report_type,
    data.activity_name,
    data.venue,
    data.start_date,
    data.end_date,
    data.staff_coordinator,
    data.student_coordinator||null,
    data.activity_objectives,
    data.activity_description,
    data.activity_outcomes,
    data.activity_impact_analysis||null,
    data.details_of_resource_person||null,
    data.department_name||null
  ];

  db.query(reportQuery, reportValues, (err, result) => {
    if (err) {
      console.error("REPORT ERROR:", err);
      return res.status(500).json(err);
    }

    const reportId = result.insertId;

    /* 2️⃣ CHILD TABLE INSERT */
    if (data.report_type === "CERTIFICATION") {
      db.query(
        `INSERT INTO certification_details
         (report_id, detailed_curriculum, assessment_details)
         VALUES (?,?,?)`,
        [
          reportId,
          data.detailed_curriculum,
          data.assessment_details
        ]
      );
    }

    if (data.report_type === "WORKSHOP") {
      db.query(
        `INSERT INTO workshop_details
         (report_id, nature_of_participants, number_of_participants)
         VALUES (?,?,?)`,
        [
          reportId,
          data.nature_of_participants,
          data.number_of_participants
        ]
      );
    }

    if (data.report_type === "SEMINAR") {
      db.query(
        `INSERT INTO seminar_details
         (report_id, nature_of_participants, number_of_participants)
         VALUES (?,?,?)`,
        [
          reportId,
          data.nature_of_participants,
          data.number_of_participants
        ]
      );
    }

    if (data.report_type === "INHOUSE") {
      db.query(
        `INSERT INTO inhouse_details
         (report_id, nature_of_participants, number_of_participants)
         VALUES (?,?,?)`,
        [
          reportId,
          data.nature_of_participants,
          data.number_of_participants
        ]
      );
    }

    if (data.report_type === "OUTREACH") {
      db.query(
        `INSERT INTO outreach_details
         (report_id, number_of_beneficiaries, number_of_student_volunteers, collaborating_agency)
         VALUES (?,?,?,?)`,
        [
          reportId,
          data.number_of_beneficiaries,
          data.number_of_student_volunteers,
          data.collaborating_agency
        ]
      );
    }

    /* 3️⃣ FILES */
    if (files && files.length > 0) {
      files.forEach((file) => {
        db.query(
          `INSERT INTO report_files
           (report_id, file_category, file_path, caption, uploaded_at)
           VALUES (?, ?, ?, ?, NOW())`,
          [
            reportId,
            file.fieldname,
            file.path,
            data[`caption_${file.fieldname}`] || null
          ]
        );
      });
    }

    res.json({
      message: "Report saved successfully",
      report_id: reportId
    });
  });
};
