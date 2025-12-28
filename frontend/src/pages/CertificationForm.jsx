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

  return (
    <form className="fdp-form">

      {/* ACTIVITY DETAILS */}
      <section className="form-section">
        <h3>Activity Details</h3>
        <div className="form-grid">
          <label>Name of Department / Institute Level Committee</label>
          <input type="text" />

          <label>Name of the Activity / Event</label>
          <input type="text" placeholder="Certification Program on …" />

          <label>Report Type</label>
          <input type="readonly" name="report_type" value="CERTIFICATION"/>

          <label>Venue</label>
          <input type="text" />

          <label>Date (From)</label>
          <input type="date" />

          <label>Date (To)</label>
          <input type="date" />

          <label>Duration</label>
          <input type="text" placeholder="e.g. 5 Days" />

          <label>Staff Coordinator(s)</label>
          <textarea rows="2" />

          <label>Details of Resource Persons</label>
          <textarea rows="3" />
        </div>
      </section>

      {/* BROCHURE */}
      <PdfWithCaptionSection
        title="Brochure (PDF)"
        items={brochures}
        setItems={setBrochures}
      />

      {/* CURRICULUM */}
      <section className="form-section">
        <h3>Detailed Curriculum</h3>
        <div className="form-grid">
          <label>Curriculum with Hours</label>
          <textarea
            rows="4"
            placeholder="Module 1 – Basics (2 hours)"
          />
        </div>
      </section>

      {/* STUDENTS ENROLLED */}
      <PdfWithCaptionSection
        title="List of Students Enrolled (PDF)"
        items={students}
        setItems={setStudents}
      />

      {/* ACTIVITY SUMMARY */}
      <section className="form-section">
        <h3>Brief Summary of the Activity</h3>
        <div className="form-grid">
          <label>Objectives</label>
          <textarea rows="3" />

          <label>Technical Description</label>
          <textarea rows="4" />

          <label>Outcomes</label>
          <textarea rows="3" />

          <label>Assessment Details</label>
          <textarea rows="3" />
        </div>
      </section>

      {/* ATTENDANCE */}
      <PdfWithCaptionSection
        title="Attendance of Participants (PDF)"
        items={attendance}
        setItems={setAttendance}
      />

      {/* FEEDBACK – PDF ONLY (NO CAPTION) */}
      <section className="form-section">
        <h3>Feedback Summary (PDF)</h3>

        {feedbackPDFs.map((_, index) => (
          <div className="form-grid" key={index}>
            <label>Upload Feedback PDF</label>
            <input type="file" accept="application/pdf" />
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
          <textarea rows="3" />
        </div>
      </section>

      {/* GEO TAGGED PHOTOS */}
      <PdfWithCaptionSection
        title="Geo-tagged Photographs (PDF)"
        items={geoPhotos}
        setItems={setGeoPhotos}
      />

      {/* CERTIFICATE – NO CAPTION */}
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
