export default function PdfWithCaptionSection({
  title,
  items,
  setItems,
}) {
  const addItem = () => {
    setItems([...items, { file: null, caption: "" }]);
  };

  return (
    <section className="form-section">
      <h3>{title}</h3>

      {items.map((item, index) => (
        <div className="form-grid" key={index}>
          <label>Upload PDF</label>
          <input type="file" accept="application/pdf" />

          <label>Caption</label>
          <input
            type="text"
            placeholder="Enter caption"
          />
        </div>
      ))}

      <button type="button" className="add-btn" onClick={addItem}>
        + Add More
      </button>
    </section>
  );
}
