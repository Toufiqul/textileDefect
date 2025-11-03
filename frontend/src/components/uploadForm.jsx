// src/components/UploadForm.js
import { useState } from "react";

function UploadForm({ onSubmit }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");
    onSubmit(file);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: 10 }}>
          Predict
        </button>
      </form>

      {preview && (
        <div style={{ marginTop: 20 }}>
          <h4>Uploaded Image:</h4>
          <img
            src={preview}
            alt="Uploaded"
            style={{
              width: 300,
              borderRadius: 8,
              border: "1px solid #ccc",
            }}
          />
        </div>
      )}
    </div>
  );
}

export default UploadForm;
