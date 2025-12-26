import { useState } from "react";
import "../styles/form-styles.css";
import PdfWithCaptionSection from "./PdfWithCaptionSection";

export default function InHouseForm() {
  const [brochures, setBrochures] = useState([{ file: null, caption: "" }]);
  const [attendance, setAttendance] = useState([{ file: null, caption: "" }]);
  const [geoPhotos, setGeoPhotos] = useState([{ file: null, caption: "" }]);

  return (
    <form className="inhouse-activity-form">
      {/* BASIC DETAILS */}
      <section className="form-section">
        <h3>Name of the Department / Institute level Committee</h3>
        <div className="form-grid">
          <label>Name of the Activity / Event</label>
          <input type="text" />

          <label>Venue</label>
          <input type="text" />
      
          <label>Date (From)</label>
          <input type="date" />

          <label>Date (To)</label>
          <input type="date" />

          <label>Nature of Participants</label>
          <input type="text" />

          <label>Number of Participants</label>
          <input type="number" />

          <label>Student / Staff Coordinator</label>
          <input type="text" />
        </div>
      </section>

      {/* PDF SECTIONS WITH CAPTION */}
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

      {/* GEO-TAGGED PHOTOS */}
      <PdfWithCaptionSection
        title="Geo-tagged Photograph with Caption (PDF)"
        items={geoPhotos}
        setItems={setGeoPhotos}
      />

      {/* SAVE */}
      <div className="form-section">
        <button type="submit" className="submit-btn">
          Save Form
        </button>
      </div>
    </form>
  );
}
