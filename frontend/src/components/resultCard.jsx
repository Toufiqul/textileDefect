// src/components/ResultCard.js
function ResultCard({ prediction }) {
  const { prediction: label, confidence, heatmap_url } = prediction;

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Prediction Result:</h3>
      <p>
        <strong>Label:</strong> {label}
      </p>
      <p>
        <strong>Confidence:</strong> {(confidence * 100).toFixed(1)}%
      </p>

      {heatmap_url && (
        <div>
          <h4>Defect Heatmap:</h4>
          <img
            src={heatmap_url}
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
  );
}

export default ResultCard;
