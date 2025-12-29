import { useState } from "react";
import "../styles/form-styles.css";
import PdfWithCaptionSection from "./PdfWithCaptionSection";

export default function CertificationForm() {

  const [brochures, setBrochures] = useState([{ file: null, caption: "" }]);
  const [students, setStudents] = useState([{ file: null, caption: "" }]);
  const [attendance, setAttendance] = useState([{ file: null, caption: "" }]);
  const [geoPhotos, setGeoPhotos] = useState([{ file: null, caption: "" }]);
  const [feedbackPDFs, setFeedbackPDFs] = useState([null]);

  const addFeedback = () => setFeedbackPDFs([...feedbackPDFs, null]);

  /* ================= SUBMIT HANDLER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    /* MAIN REPORT TABLE */
    formData.append("report_type", "CERTIFICATION");
    formData.append("department_name",form.department_name.value)
    formData.append("activity_name", form.activity_name.value);
    formData.append("venue", form.venue.value);
    formData.append("start_date", form.start_date.value);
    formData.append("end_date", form.end_date.value);
    formData.append("staff_coordinator", form.staff_coordinator.value);
    formData.append("details_of_resource_person", form.details_of_resource_person.value);

    formData.append("activity_objectives", form.activity_objectives.value);
    formData.append("activity_description", form.activity_description.value);
    formData.append("activity_outcomes", form.activity_outcomes.value);
    formData.append("activity_impact_analysis", form.activity_impact_analysis.value);

    /* CERTIFICATION TABLE */
    formData.append("detailed_curriculum", form.detailed_curriculum.value);
    formData.append("assessment_details", form.assessment_details.value);

    /* FILE HANDLER */
    const appendFiles = (items, field) => {
      items.forEach((item) => {
        if (item.file) {
          formData.append(field, item.file);
          formData.append(`caption_${field}`, item.caption);
        }
      });
    };

    appendFiles(brochures, "brochure");
    appendFiles(students, "students_list");
    appendFiles(attendance, "attendance");
    appendFiles(geoPhotos, "geo_photos");

    feedbackPDFs.forEach((file) => {
      if (file) formData.append("feedback", file);
    });

    if (form.certificate.files[0]) {
      formData.append("certificate", form.certificate.files[0]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Failed");
      alert("Certification report saved successfully ✅");
      form.reset();

    } catch (err) {
      console.error(err);
      alert("Error saving certification report ❌");
    }
  };
  /* ================================================= */

  return (
    <form className="fdp-form" onSubmit={handleSubmit}>

      {/* ACTIVITY DETAILS */}
      <section className="form-section">
        <h3>Activity Details</h3>
        <div className="form-grid">
          <label>Name of Department / Institute Level Committee</label>
          <input type="text" name="department_name" />

          <label>Name of the Activity / Event</label>
          <input name="activity_name" type="text" placeholder="Certification Program on …" />

          <label>Report Type</label>
          <input type="text" name="report_type" value="CERTIFICATION" readOnly />

          <label>Venue</label>
          <input name="venue" type="text" />

          <label>Date (From)</label>
          <input name="start_date" type="date" />

          <label>Date (To)</label>
          <input name="end_date" type="date" />

          <label>Duration</label>
          <input type="text" />

          <label>Staff Coordinator(s)</label>
          <textarea name="staff_coordinator" rows="2" />

          <label>Details of Resource Persons</label>
          <textarea name="details_of_resource_person" rows="3" />
        </div>
      </section>

      {/* BROCHURE */}
      <PdfWithCaptionSection title="Brochure (PDF)" items={brochures} setItems={setBrochures} />

      {/* CURRICULUM */}
      <section className="form-section">
        <h3>Detailed Curriculum</h3>
        <div className="form-grid">
          <label>Curriculum with Hours</label>
          <textarea
            name="detailed_curriculum"
            rows="4"
            placeholder="Module 1 – Basics (2 hours)"
          />
        </div>
      </section>

      {/* STUDENTS */}
      <PdfWithCaptionSection title="List of Students Enrolled (PDF)" items={students} setItems={setStudents} />

      {/* SUMMARY */}
      <section className="form-section">
        <h3>Brief Summary of the Activity</h3>
        <div className="form-grid">
          <label>Objectives</label>
          <textarea name="activity_objectives" rows="3" />

          <label>Technical Description</label>
          <textarea name="activity_description" rows="4" />

          <label>Outcomes</label>
          <textarea name="activity_outcomes" rows="3" />

          <label>Assessment Details</label>
          <textarea name="assessment_details" rows="3" />
        </div>
      </section>

      {/* ATTENDANCE */}
      <PdfWithCaptionSection title="Attendance of Participants (PDF)" items={attendance} setItems={setAttendance} />

      {/* FEEDBACK */}
      <section className="form-section">
        <h3>Feedback Summary (PDF)</h3>

        {feedbackPDFs.map((_, index) => (
          <div className="form-grid" key={index}>
            <label>Upload Feedback PDF</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const copy = [...feedbackPDFs];
                copy[index] = e.target.files[0];
                setFeedbackPDFs(copy);
              }}
            />
          </div>
        ))}

        <button type="button" className="add-btn" onClick={addFeedback}>
          + Add More
        </button>
      </section>

      {/* IMPACT */}
      <section className="form-section">
        <h3>Impact Analysis</h3>
        <div className="form-grid">
          <label>Impact Description</label>
          <textarea name="activity_impact_analysis" rows="3" />
        </div>
      </section>

      {/* GEO TAGGED */}
      <PdfWithCaptionSection title="Geo-tagged Photographs (PDF)" items={geoPhotos} setItems={setGeoPhotos} />

      {/* CERTIFICATE */}
      <section className="form-section">
        <h3>Sample Certificate (PDF)</h3>
        <div className="form-grid">
          <label>Upload Certificate</label>
          <input name="certificate" type="file" accept="application/pdf" />
        </div>
      </section>

      {/* SAVE */}
      <section className="form-section">
        <button type="submit" className="submit-btn">
          Save Form
        </button>
      </section>

    </form>
  );
}
