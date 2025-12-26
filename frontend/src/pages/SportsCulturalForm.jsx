import { useState } from "react";
import "../styles/form-styles.css";
import PdfWithCaptionSection from "./PdfWithCaptionSection";

export default function SportsCulturalForm() {

  const [brochures, setBrochures] = useState([{ file: null, caption: "" }]);
  const [attendance, setAttendance] = useState([{ file: null, caption: "" }]);
  const [geoPhotos, setGeoPhotos] = useState([{ file: null, caption: "" }]);

  return (
    <form className="fdp-form">

      {/* BASIC DETAILS */}
      <section className="form-section">
        <h3>Basic Details</h3>
        <div className="form-grid">
          <label>Name of the Activity / Event</label>
          <input type="text" />

          <label>Venue</label>
          <input type="text" />

          <label>Date (From)</label>
          <input type="date" />

          <label>Date (To)</label>
          <input type="date" />

          <label>Number of Students Participated</label>
          <input type="number" min="0" />

          <label>Student Coordinator</label>
          <input type="text" />

          <label>Staff Coordinator</label>
          <input type="text" />
        </div>
      </section>

      {/* BROCHURE / POSTER */}
      <PdfWithCaptionSection
        title="Brochure / Poster (PDF)"
        items={brochures}
        setItems={setBrochures}
      />

      {/* SUMMARY */}
      <section className="form-section">
        <h3>Brief Summary of the Activity / Event</h3>
        <div className="form-grid">
          <label>Objectives</label>
          <textarea rows="3" />

          <label>Description</label>
          <textarea rows="4" />

          <label>Outcomes</label>
          <textarea rows="3" />
        </div>
      </section>

      {/* ATTENDANCE */}
      <PdfWithCaptionSection
        title="Attendance of Participants (PDF)"
        items={attendance}
        setItems={setAttendance}
      />

      {/* GEO TAGGED PHOTOS */}
      <PdfWithCaptionSection
        title="Geo-tagged Photographs (PDF)"
        items={geoPhotos}
        setItems={setGeoPhotos}
      />

      {/* CERTIFICATE (NO CAPTION) */}
      <section className="form-section">
        <h3>Sample Certificate (PDF)</h3>
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
  