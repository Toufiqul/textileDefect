from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
from fastapi.responses import JSONResponse
from .yolo_service import run_inference
import os, cv2,uuid, numpy as np
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="YOLOv8 FastAPI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

STATIC_DIR = "/app/static"
os.makedirs(STATIC_DIR, exist_ok=True)
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

def create_heatmap(pil_image, detections, static_dir, image_id):
    """
    Creates a heatmap overlay from YOLO detections and saves it in static_dir.
    Returns (heatmap_path, top_detection)
    """
    img_cv = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    heatmap = np.zeros_like(img_cv[:, :, 0], dtype=np.float32)

    for det in detections:
        x1, y1, x2, y2 = map(int, det["xyxy"])
        conf = det["conf"]
        heatmap[y1:y2, x1:x2] += conf

    if np.max(heatmap) > 0:
        heatmap = np.uint8(255 * heatmap / np.max(heatmap))
        heatmap = cv2.applyColorMap(heatmap, cv2.COLORMAP_JET)
        overlay = cv2.addWeighted(img_cv, 0.7, heatmap, 0.5, 0)

        heatmap_path = os.path.join(static_dir, f"heatmap_{image_id}.png")
        cv2.imwrite(heatmap_path, overlay)
    else:
        heatmap_path = None

    top_det = max(detections, key=lambda x: x["conf"])
    return heatmap_path, top_det

@app.post("/api/predict")
async def predict(request: Request, file: UploadFile = File(...)):
    image = Image.open(BytesIO(await file.read())).convert("RGB")

    image_id = str(uuid.uuid4())[:8]
    input_path = os.path.join(STATIC_DIR, f"upload_{image_id}.jpg")
    image.save(input_path)

    results = run_inference(image)

    filtered = [r for r in results if r["conf"] >= 0.7]

    if not filtered:
        return {
            "prediction": "No Defect",
            "confidence": 0.0,
            "heatmap_url": None
        }

    heatmap_path, top_det = create_heatmap(image, filtered, STATIC_DIR, image_id)

    file_url = f"/api/static/{os.path.basename(heatmap_path)}"

    return {
        "prediction": top_det["label"],
        "confidence": round(top_det["conf"], 2),
        "heatmap_url": file_url,
    }


@app.get("/api/health")
async def health():
    return {"status": "ok"}
