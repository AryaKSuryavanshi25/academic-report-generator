import { useState } from "react";
import "../styles/form-styles.css";
import PdfWithCaptionSection from "./PdfWithCaptionSection";

export default function WorkshopForm() {

  const [brochures, setBrochures] = useState([{ file: null, caption: "" }]);
  const [attendance, setAttendance] = useState([{ file: null, caption: "" }]);
  const [geoPhotos, setGeoPhotos] = useState([{ file: null, caption: "" }]);

  const [feedbackFiles, setFeedbackFiles] = useState([null]);

  return (
    <form className="fdp-form">

      {/* BASIC DETAILS */}
      <section className="form-section">
        <h3>Basic Details</h3>
        <div className="form-grid">

          <label>Name of Department / Committee</label>
          <input type="text" />

          <label>Name of the Activity / Event</label>
          <input type="text" placeholder="Seminar / Workshop on ..." />

          <label>Venue</label>
          <input type="text" />

          <label>Date (From)</label>
          <input type="date" />

          <label>Date (To)</label>
          <input type="date" />

          <label>Nature of Participants</label>
          <input type="text" placeholder="Students / Staff of ..." />

          <label>Number of Participants</label>
          <input type="number" min="0" />

          <label>Student Coordinator</label>
          <input type="text" />

          <label>Staff Coordinator</label>
          <input type="text" />

          <label>Details of Resource Person</label>
          <textarea rows="3" />
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

      {/* FEEDBACK (PDF ONLY, NO CAPTION) */}
      <section className="form-section">
        <h3>Sample Feedback with Summary (PDF)</h3>

        {feedbackFiles.map((_, index) => (
          <div className="form-grid" key={index}>
            <label>Upload Feedback</label>
            <input type="file" accept="application/pdf" />
          </div>
        ))}

        <button
          type="button"
          className="add-btn"
          onClick={() => setFeedbackFiles([...feedbackFiles, null])}
        >
          + Add More Feedback PDFs
        </button>
      </section>

      {/* IMPACT */}
      <section className="form-section">
        <h3>Impact Analysis</h3>
        <div className="form-grid">
          <label>Impact Analysis Description</label>
          <textarea rows="4" />
        </div>
      </section>

      {/* GEO TAGGED PHOTOS */}
      <PdfWithCaptionSection
        title="Geo-tagged Photographs (PDF)"
        items={geoPhotos}
        setItems={setGeoPhotos}
      />

      {/* CERTIFICATE */}
      <section className="form-section">
        <h3>Sample Certificate (PDF)</h3>
        <div className="form-grid">
          <label>Upload Certificate</label>
          <input type="file" accept="application/pdf" />
        </div>
      </section>

      {/* SAVE */}
      <div className="form-section">
        <button type="submit" className="submit-btn">
          Save Form
        </button>
      </div>

    </form>
  );
}
