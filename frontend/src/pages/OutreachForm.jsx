import { useState } from "react";
import "../styles/form-styles.css";
import PdfWithCaptionSection from "./PdfWithCaptionSection";

export default function OutreachForm() {

  const [brochures, setBrochures] = useState([{ file: null, caption: "" }]);
  const [attendance, setAttendance] = useState([{ file: null, caption: "" }]);
  const [geoPhotos, setGeoPhotos] = useState([{ file: null, caption: "" }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    /* MAIN REPORT TABLE */
    formData.append("report_type", "OUTREACH");
    formData.append("department_name", form.department_name.value);
    formData.append("activity_name", form.activity_name.value);
    formData.append("venue", form.venue.value);
    formData.append("start_date", form.start_date.value);
    formData.append("end_date", form.end_date.value);
    formData.append("no_of_beneficiaries", form.no_of_beneficiaries.value);
    formData.append("no_of_student_volunteers", form.no_of_student_volunteers.value);
    formData.append("student_coordinator", form.student_coordinator.value);
    formData.append("staff_coordinator", form.staff_coordinator.value);
    formData.append("collaborating_agency", form.collaborating_agency.value);

    /* SUMMARY */
    formData.append("activity_objectives", form.activity_objectives.value);
    formData.append("activity_description", form.activity_description.value);
    formData.append("activity_outcomes", form.activity_outcomes.value);
    formData.append("activity_impact_analysis", form.activity_impact_analysis.value);

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
    appendFiles(attendance, "attendance");
    appendFiles(geoPhotos, "geo_photos");

    if (form.certificate.files[0]) {
      formData.append("certificate", form.certificate.files[0]);
    }

    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Failed");
      alert("Outreach report saved successfully ✅");
      form.reset();

    } catch (err) {
      console.error(err);
      alert("Error saving outreach report ❌");
    }
  };

  return (
    <form className="fdp-form" onSubmit={handleSubmit}>

      <section className="form-section">
        <h3>Basic Details</h3>
        <div className="form-grid">

          <label>Department</label>
          <input name="department_name" type="text" />

          <label>Activity Name</label>
          <input name="activity_name" type="text" />

          <label>Report Type</label>
          <input value="OUTREACH" readOnly />

          <label>Venue</label>
          <input name="venue" type="text" />

          <label>Date (From)</label>
          <input name="start_date" type="date" />

          <label>Date (To)</label>
          <input name="end_date" type="date" />

          <label>Number of Beneficiaries</label>
          <input name="no_of_beneficiaries" type="number" />

          <label>Number of Student Volunteers</label>
          <input name="no_of_student_volunteers" type="number" />

          <label>Student Coordinator</label>
          <input name="student_coordinator" type="text" />

          <label>Staff Coordinator</label>
          <input name="staff_coordinator" type="text" />

          <label>Collaborating Agency</label>
          <input name="collaborating_agency" type="text" />
        </div>
      </section>

      <PdfWithCaptionSection title="Brochure / Newspaper Cutting (PDF)" items={brochures} setItems={setBrochures} />

      <section className="form-section">
        <h3>Brief Summary</h3>
        <div className="form-grid">
          <label>Objectives</label>
          <textarea name="activity_objectives" rows="3" />

          <label>Description</label>
          <textarea name="activity_description" rows="4" />

          <label>Outcomes</label>
          <textarea name="activity_outcomes" rows="3" />

          <label>Impact Analysis</label>
          <textarea name="activity_impact_analysis" rows="3" />
        </div>
      </section>

      <PdfWithCaptionSection title="Attendance of Student Volunteers (PDF)" items={attendance} setItems={setAttendance} />

      <PdfWithCaptionSection title="Geo-tagged Photograph (PDF)" items={geoPhotos} setItems={setGeoPhotos} />

      <section className="form-section">
        <h3>Sample Certificate</h3>
        <input name="certificate" type="file" accept="application/pdf" />
      </section>

      <section className="form-section">
        <button type="submit" className="submit-btn">Save Form</button>
      </section>

    </form>
  );
}
