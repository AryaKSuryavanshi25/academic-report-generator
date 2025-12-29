export default function PdfWithCaptionSection({
  title,
  items,
  setItems,
}) {

  const handleFileChange = (index, file) => {
    const updated = [...items];
    updated[index].file = file;
    setItems(updated);
  };

  const handleCaptionChange = (index, caption) => {
    const updated = [...items];
    updated[index].caption = caption;
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { file: null, caption: "" }]);
  };

  return (
    <section className="form-section">
      <h3>{title}</h3>

      {items.map((item, index) => (
        <div className="form-grid" key={index}>
          <label>Upload PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) =>
              handleFileChange(index, e.target.files[0])
            }
          />

          <label>Caption</label>
          <input
            type="text"
            placeholder="Enter caption"
            value={item.caption}
            onChange={(e) =>
              handleCaptionChange(index, e.target.value)
            }
          />
        </div>
      ))}

      <button type="button" className="add-btn" onClick={addItem}>
        + Add More
      </button>
    </section>
  );
}
