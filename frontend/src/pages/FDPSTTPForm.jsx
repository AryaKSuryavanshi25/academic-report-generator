import { useState } from "react";
import "../styles/form-styles.css";
import PdfWithCaptionSection from "./PdfWithCaptionSection";

export default function FDPSTTPForm() {

  const [brochures, setBrochures] = useState([{ file: null, caption: "" }]);
  const [participants, setParticipants] = useState([{ file: null, caption: "" }]);
  const [attendance, setAttendance] = useState([{ file: null, caption: "" }]);
  const [geoPhotos, setGeoPhotos] = useState([{ file: null, caption: "" }]);
  const [feedbackPDFs, setFeedbackPDFs] = useState([null]);

  return (
    <form className="fdp-form">

      {/* BASIC DETAILS */}
      <section className="form-section">
        <h3>Basic Details</h3>
        <div className="form-grid">
          <label>Name of Department / Committee</label>
          <input type="text" />

          <label>Name of Activity / Event</label>
          <input type="text" />

          <label>Venue</label>
          <input type="text" />

          <label>Date (From)</label>
          <input type="date" />

          <label>Date (To)</label>
          <input type="date" />

          <label>Duration</label>
          <input type="text" placeholder="e.g. 6 Days" />

          <label>Staff Coordinator(s)</label>
          <textarea rows="2" />

          <label>Resource Persons Details</label>
          <textarea rows="3" />
        </div>
      </section>

      {/* PDF SECTIONS WITH CAPTION */}
      <PdfWithCaptionSection
        title="Brochure (PDF)"
        items={brochures}
        setItems={setBrochures}
      />

      <PdfWithCaptionSection
        title="List of Participants (PDF)"
        items={participants}
        setItems={setParticipants}
      />

      <PdfWithCaptionSection
        title="Attendance of Participants (PDF)"
        items={attendance}
        setItems={setAttendance}
      />

      <PdfWithCaptionSection
        title="Geo-tagged Photographs (PDF)"
        items={geoPhotos}
        setItems={setGeoPhotos}
      />

      {/* SUMMARY */}
      <section className="form-section">
        <h3>Brief Summary of the Activity</h3>
        <div className="form-grid">
          <label>Objectives</label>
          <textarea rows="3" />

          <label>Technical Description</label>
          <textarea rows="4" />

          <label>Outcomes</label>
          <textarea rows="3" />
        </div>
      </section>

      {/* FEEDBACK – PDF ONLY */}
      <section className="form-section">
        <h3>Sample Feedback with Summary (PDF)</h3>

        {feedbackPDFs.map((_, index) => (
          <div className="form-grid" key={index}>
            <label>Upload Feedback PDF</label>
            <input type="file" accept="application/pdf" />
          </div>
        ))}

        <button
          type="button"
          className="add-btn"
          onClick={() => setFeedbackPDFs([...feedbackPDFs, null])}
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

      {/* CERTIFICATE – PDF ONLY */}
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
