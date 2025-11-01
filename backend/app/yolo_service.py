from ultralytics import YOLO
from PIL import Image

# Path inside container
MODEL_PATH = "app/yolov8n.pt"
model = YOLO(MODEL_PATH)

def run_inference(image: Image.Image, conf=0.1, iou=0.5):
    results = model.predict(image, conf=conf, iou=iou, verbose=False)
    detections = []
    for r in results:
        for b in r.boxes:
            detections.append({
                "cls": int(b.cls),
                "conf": float(b.conf),
                "xyxy": b.xyxy[0].tolist(),
                "label": model.names[int(b.cls)]
            })
    return detections
