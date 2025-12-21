export default function FormLayout({ title }) {
  return (
    <div className={`form-card ${!title ? "empty-form" : ""}`}>
      {!title ? (
        <div className="empty-form-message">
          <h2>Select a report type</h2>
          <p>Please select a tab above to fill the corresponding report form.</p>
        </div>
      ) : (
        <>
          <h2>{title}</h2>
          <p>Form fields will be added here.</p>
        </>
      )}
    </div>
  );
}
