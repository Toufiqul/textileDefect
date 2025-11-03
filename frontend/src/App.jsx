import { useState } from "react";
import axios from "axios";
import UploadForm from "./components/uploadForm";
import ResultCard from "./components/resultCard";

const API_BASE = "/api";

function App() {
  const [health, setHealth] = useState(null);
  const [prediction, setPrediction] = useState(null);

  const handleHealthCheck = async () => {
    try {
      const res = await axios.get(`${API_BASE}/health`);
      setHealth(res.data.status || JSON.stringify(res.data));
    } catch (err) {
      console.error(err);
      setHealth("Cannot reach backend");
    }
  };

  const handlePredict = async (file) => {
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

return (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      minHeight: "100vh",
      padding: 20,
      fontFamily: "sans-serif",
      textAlign: "center",
    }}
  >
    <h2>YOLOv8 Fabric Defect Detector</h2>

    <button onClick={handleHealthCheck}>Check Backend Health</button>
    {health && <p>Backend Health: {health}</p>}

    <hr style={{ width: "60%", margin: "20px 0" }} />

    <UploadForm onSubmit={handlePredict} />

    {prediction && <ResultCard prediction={prediction} />}
  </div>
);

}

export default App;
