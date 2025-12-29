import { useState } from "react";
import "../styles/form-styles.css";
import PdfWithCaptionSection from "./PdfWithCaptionSection";

export default function FDPSTTPForm() {

  const [brochures, setBrochures] = useState([{ file: null, caption: "" }]);
  const [participants, setParticipants] = useState([{ file: null, caption: "" }]);
  const [attendance, setAttendance] = useState([{ file: null, caption: "" }]);
  const [geoPhotos, setGeoPhotos] = useState([{ file: null, caption: "" }]);
  const [feedbackPDFs, setFeedbackPDFs] = useState([null]);

  const handleSubmit = async (e) => {
    console.log("SUBMIT CLICKED");

    e.preventDefault();

    const form = e.target;
    const formData = new FormData();

    /* BASIC DETAILS */
    formData.append("activity_name", form.activity_name.value);
    formData.append("report_type", form.report_type.value);
    formData.append("venue", form.venue.value);
    formData.append("start_date", form.date_from.value);
    formData.append("end_date", form.date_to.value);
    formData.append("staff_coordinator", form.staff_coordinators.value);
    formData.append("details_of_resource_person", form.resource_persons.value);

    /* SUMMARY */
    formData.append("activity_objectives", form.objectives.value);
    formData.append("activity_description", form.technical_description.value);
    formData.append("activity_outcomes", form.outcomes.value);

    /* IMPACT */
    formData.append("activity_impact_analysis", form.impact_analysis.value);


    /* FILE SECTIONS WITH CAPTION */
    const appendFiles = (items, category) => {
      items.forEach((item, index) => {
        if (item.file) {
          formData.append(`${category}[${index}][file]`, item.file);
          formData.append(`${category}[${index}][caption]`, item.caption);
        }
      });
    };

    appendFiles(brochures, "brochures");
    appendFiles(participants, "participants");
    appendFiles(attendance, "attendance");
    appendFiles(geoPhotos, "geo_photos");

    /* FEEDBACK PDFs (NO CAPTION) */
    feedbackPDFs.forEach((file, index) => {
      if (file) {
        formData.append(`feedback[${index}]`, file);
      }
    });

    /* CERTIFICATE */
    if (form.certificate.files[0]) {
      formData.append("certificate", form.certificate.files[0]);
    }

    try {
      console.log("Sending request...");

      const res = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        body: formData
      });
      console.log("Response received", res.status);

      if (!res.ok) throw new Error("Failed");

      alert("Report saved successfully");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("Error saving report");
    }
  };

  return (
    <form className="fdp-form" onSubmit={handleSubmit}>

      {/* BASIC DETAILS */}
      <section className="form-section">
        <h3>Basic Details</h3>
        <div className="form-grid">
          <label>Name of Department / Institute Level Committee</label>
          <input name="department_name" type="text" />

          <label>Name of Activity / Event</label>
          <input name="activity_name" type="text" />

          <label>Report Type:</label>
          <select name="report_type" required>
            <option value="">Select</option>
            <option value="FDP">FDP</option>
            <option value="STTP">STTP</option>
          </select>

          <label>Venue</label>
          <input name="venue" type="text" />

          <label>Date (From)</label>
          <input name="date_from" type="date" />

          <label>Date (To)</label>
          <input name="date_to" type="date" />

          <label>Duration</label>
          <input name="duration" type="text" />

          <label>Staff Coordinator(s)</label>
          <textarea name="staff_coordinators" rows="2" />

          <label>Resource Persons Details</label>
          <textarea name="resource_persons" rows="3" />
        </div>
      </section>

      <PdfWithCaptionSection title="Brochure (PDF)" items={brochures} setItems={setBrochures} />
      <PdfWithCaptionSection title="List of Participants (PDF)" items={participants} setItems={setParticipants} />
      <PdfWithCaptionSection title="Attendance of Participants (PDF)" items={attendance} setItems={setAttendance} />
      <PdfWithCaptionSection title="Geo-tagged Photographs (PDF)" items={geoPhotos} setItems={setGeoPhotos} />

      {/* SUMMARY */}
      <section className="form-section">
        <h3>Brief Summary of the Activity</h3>
        <div className="form-grid">
          <label>Objectives</label>
          <textarea name="objectives" rows="3" />

          <label>Technical Description</label>
          <textarea name="technical_description" rows="4" />

          <label>Outcomes</label>
          <textarea name="outcomes" rows="3" />
        </div>
      </section>

      {/* FEEDBACK */}
      <section className="form-section">
        <h3>Sample Feedback with Summary (PDF)</h3>
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
        <button type="button" className="add-btn" onClick={() => setFeedbackPDFs([...feedbackPDFs, null])}>
          + Add More Feedback PDFs
        </button>
      </section>

      {/* IMPACT */}
      <section className="form-section">
        <h3>Impact Analysis</h3>
        <div className="form-grid">
          <label>Impact Analysis Description</label>
          <textarea name="impact_analysis" rows="4" />
        </div>
      </section>

      {/* CERTIFICATE */}
      <section className="form-section">
        <h3>Sample Certificate (PDF)</h3>
        <div className="form-grid">
          <label>Upload Certificate</label>
          <input name="certificate" type="file" accept="application/pdf" />
        </div>
      </section>

      <div className="form-section">
        <button type="submit" className="submit-btn">Save Form</button>
      </div>

    </form>
  );
}
