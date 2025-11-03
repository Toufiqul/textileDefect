import { useState } from "react";
import axios from "axios";

const API_BASE = "/api";

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [health, setHealth] = useState(null);

  const handleHealthCheck = async () => {
    try {
      const res = await axios.get(`${API_BASE}/health`);
      setHealth(res.data.status || JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      setHealth("Cannot reach backend");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_BASE}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPrediction(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    setFile(f);
    if (f) {
      setPreview(URL.createObjectURL(f));
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>YOLOv8 Fabric Defect Detector</h2>

      {/* Health Check */}
      <button onClick={handleHealthCheck}>Check Backend Health</button>
      {health && <p>Backend Health: {health}</p>}

      <hr style={{ margin: "20px 0" }} />

      {/* Image Upload */}
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        <button type="submit" style={{ marginLeft: 10 }}>
          Predict
        </button>
      </form>

      {/* Uploaded image preview */}
      {preview && (
        <div style={{ marginTop: 20 }}>
          <h4>Uploaded Image:</h4>
          <img
            src={preview}
            alt="Uploaded"
            style={{ width: 300, borderRadius: 8, border: "1px solid #ccc" }}
          />
        </div>
      )}

      {/* Prediction results */}
      {prediction && (
        <div style={{ marginTop: 30 }}>
          <h3>Prediction Result:</h3>
          <p>
            <strong>Label:</strong> {prediction.prediction}
          </p>
          <p>
            <strong>Confidence:</strong>{" "}
            {(prediction.confidence * 100).toFixed(1)}%
          </p>

          {prediction.heatmap_url && (
            <div>
              <h4>Defect Heatmap:</h4>
              <img
                src="http://192.168.68.66:8000/static/heatmap_110cf3ae.png"
                alt="Heatmap"
                style={{
                  width: 400,
                  borderRadius: 8,
                  border: "1px solid #ccc",
                  marginTop: 10,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
