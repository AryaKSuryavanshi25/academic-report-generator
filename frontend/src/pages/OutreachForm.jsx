import { useState } from "react";
import "../styles/form-styles.css";
import PdfWithCaptionSection from "./PdfWithCaptionSection";

export default function OutreachForm() {

  const [brochures, setBrochures] = useState([{ file: null, caption: "" }]);
  const [attendance, setAttendance] = useState([{ file: null, caption: "" }]);
  const [geoPhotos, setGeoPhotos] = useState([{ file: null, caption: "" }]);

  return (
    <form className="fdp-form">

      {/* BASIC DETAILS */}
      <section className="form-section">
        <h3>Basic Details</h3>
        <div className="form-grid">

          <label>Name of Department / Institute Level Committee</label>
          <input type="text" />

          <label>Name of the Activity / Event</label>
          <input
            type="text"
            placeholder="Needs to be mentioned with clarity"
          />

          <label>Report Type</label>
          <input type="readonly" name="report_type" value="OUTREACH"/>

          <label>Venue</label>
          <input type="text" />

          <label>Date (From)</label>
          <input type="date" />

          <label>Date (To)</label>
          <input type="date" />

          <label>Number of Beneficiaries</label>
          <input type="number" min="0" />

          <label>Number of Student Volunteers</label>
          <input type="number" min="0" />

          <label>Student Coordinator</label>
          <input type="text" />

          <label>Staff Coordinator</label>
          <input type="text" />

          <label>Collaborating Agency</label>
          <input type="text" />

        </div>
      </section>

      {/* BROCHURE / NEWSPAPER CUTTING */}
      <PdfWithCaptionSection
        title="Brochure / Newspaper Cutting (PDF)"
        items={brochures}
        setItems={setBrochures}
      />

      {/* SUMMARY */}
      <section className="form-section">
        <h3>Brief Summary of the Activity</h3>
        <div className="form-grid">

          <label>Objectives</label>
          <textarea rows="3" />

          <label>Description</label>
          <textarea rows="4" />

          <label>Outcomes</label>
          <textarea rows="3" />

          <label>Impact Analysis</label>
          <textarea rows="3" />

        </div>
      </section>

      {/* ATTENDANCE */}
      <PdfWithCaptionSection
        title="Attendance of Student Volunteers (PDF)"
        items={attendance}
        setItems={setAttendance}
      />

      {/* GEO TAGGED PHOTOS */}
      <PdfWithCaptionSection
        title="Geo-tagged Photograph (PDF)"
        items={geoPhotos}
        setItems={setGeoPhotos}
      />

      {/* SAMPLE CERTIFICATE */}
      <section className="form-section">
        <h3>Sample Certificate of Student Volunteers (PDF)</h3>
        <div className="form-grid">
          <label>Upload Certificate</label>
          <input type="file" accept="application/pdf" />
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
