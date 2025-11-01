from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
from io import BytesIO
from .yolo_service import run_inference

app = FastAPI(title="YOLOv8 FastAPI API")

# === CORS for frontend access ===
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to frontend domain later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# === API Routes ===
@app.post("/api/predict")
async def predict(file: UploadFile = File(...)):
    image = Image.open(BytesIO(await file.read())).convert("RGB")
    results = run_inference(image)
    return {"detections": results}

@app.get("/api/health")
async def health():
    return {"status": "ok"}
