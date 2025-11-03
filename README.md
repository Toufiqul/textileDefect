# [Live link](https://bcfa983f58e4.ngrok-free.app)

# Local Build Command
``docker compose up --build``
<br>
<br>
<br>


## 🧪 YOLO Model Comparison — Fabric Defect Detection

| **Metric** | **YOLO11n** | **YOLOv8n** | **YOLOv8m** | **Best** |
|-------------|--------------|--------------|--------------|-----------|
| **mAP50-95 (main accuracy)** | 0.274 | 0.278 | 0.358 | 🥇 **YOLOv8m** |
| **mAP50 (easier IoU)** | 0.514 | 0.506 | 0.600 | 🥇 **YOLOv8m** |
| **Precision** | 0.555 | 0.795 | 0.717 | 🥇 **YOLOv8n** |
| **Recall** | 0.483 | 0.487 | 0.554 | 🥇 **YOLOv8m** |
| **Validation Box Loss (↓ lower is better)** | 1.553 | 1.606 | 1.499 | 🥇 **YOLOv8m** |

---

## 🧠 Interpretation

- **YOLOv8m** achieves the highest `mAP50-95 (0.358)` and `mAP50 (0.600)` →  
  strongest overall detection and classification accuracy across IoU thresholds.  
- It also shows **lower validation losses** (box/cls/dfl), indicating better generalization.  
- **Recall** is highest for YOLOv8m → it finds more true defects.  
- **YOLOv8n** achieves the **best precision (0.795)** → fewer false positives, but misses a few more detections (lower recall, lower mAP).  
- **YOLO11n** underperforms across most metrics — weaker detection and higher losses.

---

## 🧩 Verdict

### 🥇 Best Model for Accuracy
**YOLOv8m** — best overall accuracy and recall for high-quality defect detection.

### ⚙️ Best Model for Deployment
**YOLOv8n**

**Why:**
- Significantly higher **precision (0.795)** → cleaner detections, fewer false alarms.  
- Slightly better **recall (0.487 vs 0.483)** than YOLO11n.  
- Efficient **architecture and quantization support** → faster inference on low-resource systems.  
- Ideal for deployment with **ONNX Runtime**, **TensorRT**, or **OpenVINO** (CPU or integrated GPU-friendly).  

---

📌 **Summary:**  
If accuracy is critical → choose **YOLOv8m**.  
If efficiency and low compute load matter → choose **YOLOv8n**.
