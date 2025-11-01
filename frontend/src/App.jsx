import { useState } from "react";
import axios from "axios";

const API_BASE = "/api";



function App() {
  const [file, setFile] = useState(null);
  const [detections, setDetections] = useState([]);
  const [health, setHealth] = useState(null);

  const handleHealthCheck = async () => {
    try {
      const res = await axios.get(`${API_BASE}/health`);
      setHealth(res.data.status || JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      setHealth(" Cannot reach backend");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_BASE}/predict`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setDetections(res.data.detections || []);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>YOLOv8 Detection UI</h2>

      {/* Health Check */}
      <button onClick={handleHealthCheck}>Check Backend Health</button>
      {health && <p>Backend Health: {health}</p>}

      <hr style={{ margin: "20px 0" }} />

      {/* Prediction Upload */}
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit" style={{ marginLeft: 10 }}>
          Predict
        </button>
      </form>

      {detections.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4>Detections:</h4>
          <pre>{JSON.stringify(detections, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
