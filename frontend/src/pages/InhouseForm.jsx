import { useState } from "react";
import "../styles/form-styles.css";
import PdfWithCaptionSection from "./PdfWithCaptionSection";

export default function InHouseForm() {

  const [brochures, setBrochures] = useState([{ file: null, caption: "" }]);
  const [attendance, setAttendance] = useState([{ file: null, caption: "" }]);
  const [geoPhotos, setGeoPhotos] = useState([{ file: null, caption: "" }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    /* MAIN REPORT TABLE */
    formData.append("report_type", "INHOUSE");
    formData.append("department_name", form.department_name.value);
    formData.append("activity_name", form.activity_name.value);
    formData.append("venue", form.venue.value);
    formData.append("start_date", form.start_date.value);
    formData.append("end_date", form.end_date.value);
    formData.append("nature_of_participants", form.nature_of_participants.value);
    formData.append("no_of_participants", form.no_of_participants.value);
    formData.append("student_staff_coordinator", form.student_staff_coordinator.value);

    /* SUMMARY */
    formData.append("activity_objectives", form.activity_objectives.value);
    formData.append("activity_description", form.activity_description.value);
    formData.append("activity_outcomes", form.activity_outcomes.value);

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

    try {
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        body: formData
      });

      if (!res.ok) throw new Error("Failed");
      alert("Inhouse report saved successfully ✅");
      form.reset();

    } catch (err) {
      console.error(err);
      alert("Error saving inhouse report ❌");
    }
  };

  return (
    <form className="inhouse-activity-form" onSubmit={handleSubmit}>

      <section className="form-section">
        <h3>Inhouse Details</h3>
        <div className="form-grid">

          <label>Name of Department / Institute Level Committee</label>
          <input name="department_name" type="text" />

          <label>Name of the Activity / Event</label>
          <input name="activity_name" type="text" />

          <label>Report Type</label>
          <input name="report_type" value="INHOUSE" readOnly />

          <label>Venue</label>
          <input name="venue" type="text" />

          <label>Date (From)</label>
          <input name="start_date" type="date" />

          <label>Date (To)</label>
          <input name="end_date" type="date" />

          <label>Nature of Participants</label>
          <input name="nature_of_participants" type="text" />

          <label>Number of Participants</label>
          <input name="no_of_participants" type="number" />

          <label>Student / Staff Coordinator</label>
          <input name="student_staff_coordinator" type="text" />
        </div>
      </section>

      <PdfWithCaptionSection title="Brochure / Poster (PDF)" items={brochures} setItems={setBrochures} />

      <section className="form-section">
        <h3>Brief Summary</h3>
        <div className="form-grid">
          <label>Objectives</label>
          <textarea name="activity_objectives" rows="3" />

          <label>Description</label>
          <textarea name="activity_description" rows="4" />

          <label>Outcomes</label>
          <textarea name="activity_outcomes" rows="3" />
        </div>
      </section>

      <PdfWithCaptionSection title="Attendance of Participants (PDF)" items={attendance} setItems={setAttendance} />

      <PdfWithCaptionSection title="Geo-tagged Photograph with Caption (PDF)" items={geoPhotos} setItems={setGeoPhotos} />

      <section className="form-section">
        <button type="submit" className="submit-btn">Save Form</button>
      </section>

    </form>
  );
}
