import { useState } from 'react';

export default function CertificationForm() {
  const [formData, setFormData] = useState({
    department: '',
    activityName: '',
    venue: '',
    dateFrom: '',
    dateTo: '',
    brochure: null,
    curriculum: '',
    studentsEnrolled: null,
    staffCoordinator: '',
    resourcePersons: '',
    objectives: '',
    technicalDescription: '',
    outcomes: '',
    attendance: null,
    assessmentDetails: '',
    feedback: null,
    impactAnalysis: '',
    photographs: null,
    certificate: null
  });

  const handleSubmit = () => {
    console.log('Form Data:', formData);
    alert('Form submitted! Check console for data.');
  };

  const styles = {
    container: {
      background: 'white',
      padding: '24px',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      maxWidth: '900px',
      margin: '0 auto'
    },
    title: {
      marginTop: 0,
      marginBottom: '24px',
      fontSize: '24px',
      fontWeight: '600',
      color: '#0b5a7a'
    },
    field: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      marginBottom: '6px',
      fontWeight: '500',
      fontSize: '14px',
      color: '#333'
    },
    required: {
      color: 'red',
      marginLeft: '2px'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      resize: 'vertical',
      minHeight: '80px',
      boxSizing: 'border-box'
    },
    fileInput: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '14px',
      backgroundColor: '#f9f9f9',
      cursor: 'pointer',
      boxSizing: 'border-box'
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '16px',
      marginBottom: '16px'
    },
    sectionHeader: {
      marginTop: '32px',
      marginBottom: '16px',
      fontSize: '18px',
      fontWeight: '600',
      color: '#0b5a7a',
      borderBottom: '2px solid #0b5a7a',
      paddingBottom: '8px'
    },
    submitBtn: {
      marginTop: '24px',
      padding: '12px 32px',
      backgroundColor: '#0b5a7a',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Certification Program Report</h2>
      
      {/* Department */}
      <div style={styles.field}>
        <label style={styles.label}>
          Name of the Department/Institute level Committee
          <span style={styles.required}>*</span>
        </label>
        <input
          type="text"
          style={styles.input}
          value={formData.department}
          onChange={(e) => setFormData({...formData, department: e.target.value})}
        />
      </div>

      {/* Activity Name */}
      <div style={styles.field}>
        <label style={styles.label}>
          Name of the Activity/Event (Certification Program on...)
          <span style={styles.required}>*</span>
        </label>
        <input
          type="text"
          style={styles.input}
          placeholder="e.g., Certification Program on Machine Learning"
          value={formData.activityName}
          onChange={(e) => setFormData({...formData, activityName: e.target.value})}
        />
      </div>

      {/* Venue */}
      <div style={styles.field}>
        <label style={styles.label}>
          Venue
          <span style={styles.required}>*</span>
        </label>
        <input
          type="text"
          style={styles.input}
          placeholder="e.g., Online (Coursera) / Room No. AX-504"
          value={formData.venue}
          onChange={(e) => setFormData({...formData, venue: e.target.value})}
        />
      </div>

      {/* Date Range */}
      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>
            Date From
            <span style={styles.required}>*</span>
          </label>
          <input
            type="date"
            style={styles.input}
            value={formData.dateFrom}
            onChange={(e) => setFormData({...formData, dateFrom: e.target.value})}
          />
        </div>
        <div style={styles.field}>
          <label style={styles.label}>
            Date To
            <span style={styles.required}>*</span>
          </label>
          <input
            type="date"
            style={styles.input}
            value={formData.dateTo}
            onChange={(e) => setFormData({...formData, dateTo: e.target.value})}
          />
        </div>
      </div>

      {/* Brochure */}
      <div style={styles.field}>
        <label style={styles.label}>
          Brochure
          <span style={styles.required}>*</span>
        </label>
        <input
          type="file"
          style={styles.fileInput}
          accept="image/*,.pdf"
          onChange={(e) => setFormData({...formData, brochure: e.target.files[0]})}
        />
      </div>

      {/* Curriculum */}
      <div style={styles.field}>
        <label style={styles.label}>
          Detailed Curriculum with number of hours for each sections/modules
          <span style={styles.required}>*</span>
        </label>
        <textarea
          style={styles.textarea}
          rows="6"
          placeholder="List all modules with hours..."
          value={formData.curriculum}
          onChange={(e) => setFormData({...formData, curriculum: e.target.value})}
        />
      </div>

      {/* Students Enrolled */}
      <div style={styles.field}>
        <label style={styles.label}>
          List of Students Enrolled
          <span style={styles.required}>*</span>
        </label>
        <input
          type="file"
          style={styles.fileInput}
          accept=".xlsx,.xls,.csv,.pdf"
          onChange={(e) => setFormData({...formData, studentsEnrolled: e.target.files[0]})}
        />
      </div>

      {/* Staff Coordinator */}
      <div style={styles.field}>
        <label style={styles.label}>
          Staff Coordinator
          <span style={styles.required}>*</span>
        </label>
        <input
          type="text"
          style={styles.input}
          placeholder="e.g., Dr. John Doe, Prof. Jane Smith"
          value={formData.staffCoordinator}
          onChange={(e) => setFormData({...formData, staffCoordinator: e.target.value})}
        />
      </div>

      {/* Resource Persons */}
      <div style={styles.field}>
        <label style={styles.label}>
          Details of Resource Persons
          <span style={styles.required}>*</span>
        </label>
        <textarea
          style={styles.textarea}
          rows="4"
          placeholder="Name, Designation, Organization for each resource person"
          value={formData.resourcePersons}
          onChange={(e) => setFormData({...formData, resourcePersons: e.target.value})}
        />
      </div>

      {/* Brief Summary Section */}
      <h3 style={styles.sectionHeader}>Brief Summary of the Activity/Event</h3>

      {/* Objectives */}
      <div style={styles.field}>
        <label style={styles.label}>
          a. Objectives
          <span style={styles.required}>*</span>
        </label>
        <textarea
          style={styles.textarea}
          rows="4"
          placeholder="List the main objectives..."
          value={formData.objectives}
          onChange={(e) => setFormData({...formData, objectives: e.target.value})}
        />
      </div>

      {/* Technical Description */}
      <div style={styles.field}>
        <label style={styles.label}>
          b. Technical Description
          <span style={styles.required}>*</span>
        </label>
        <textarea
          style={styles.textarea}
          rows="6"
          placeholder="Describe the technical content covered..."
          value={formData.technicalDescription}
          onChange={(e) => setFormData({...formData, technicalDescription: e.target.value})}
        />
      </div>

      {/* Outcomes */}
      <div style={styles.field}>
        <label style={styles.label}>
          c. Outcomes
          <span style={styles.required}>*</span>
        </label>
        <textarea
          style={styles.textarea}
          rows="4"
          placeholder="What were the outcomes..."
          value={formData.outcomes}
          onChange={(e) => setFormData({...formData, outcomes: e.target.value})}
        />
      </div>

      {/* Attendance */}
      <div style={styles.field}>
        <label style={styles.label}>
          d. Attendance of Participants (each day/session)
          <span style={styles.required}>*</span>
        </label>
        <input
          type="file"
          style={styles.fileInput}
          accept=".xlsx,.xls,.csv,.pdf,image/*"
          onChange={(e) => setFormData({...formData, attendance: e.target.files[0]})}
        />
      </div>

      {/* Assessment Details */}
      <div style={styles.field}>
        <label style={styles.label}>
          e. Assessment Details
          <span style={styles.required}>*</span>
        </label>
        <textarea
          style={styles.textarea}
          rows="4"
          placeholder="Describe assessment methods and results..."
          value={formData.assessmentDetails}
          onChange={(e) => setFormData({...formData, assessmentDetails: e.target.value})}
        />
      </div>

      {/* Feedback */}
      <div style={styles.field}>
        <label style={styles.label}>
          f. Sample Feedback with Summary
          <span style={styles.required}>*</span>
        </label>
        <input
          type="file"
          style={styles.fileInput}
          accept="image/*,.pdf"
          onChange={(e) => setFormData({...formData, feedback: e.target.files[0]})}
        />
      </div>

      {/* Impact Analysis */}
      <div style={styles.field}>
        <label style={styles.label}>
          g. Impact Analysis
          <span style={styles.required}>*</span>
        </label>
        <textarea
          style={styles.textarea}
          rows="6"
          placeholder="Analyze the impact of the program..."
          value={formData.impactAnalysis}
          onChange={(e) => setFormData({...formData, impactAnalysis: e.target.value})}
        />
      </div>

      {/* Photographs */}
      <div style={styles.field}>
        <label style={styles.label}>
          Geo tagged Photographs with Caption
          <span style={styles.required}>*</span>
        </label>
        <input
          type="file"
          style={styles.fileInput}
          accept="image/*"
          multiple
          onChange={(e) => setFormData({...formData, photographs: e.target.files})}
        />
      </div>

      {/* Certificate */}
      <div style={styles.field}>
        <label style={styles.label}>
          Sample Certificate
          <span style={styles.required}>*</span>
        </label>
        <input
          type="file"
          style={styles.fileInput}
          accept="image/*,.pdf"
          onChange={(e) => setFormData({...formData, certificate: e.target.files[0]})}
        />
      </div>

      {/* Submit Button */}
      <button onClick={handleSubmit} style={styles.submitBtn}>
        Generate Report
      </button>
    </div>
  );
}