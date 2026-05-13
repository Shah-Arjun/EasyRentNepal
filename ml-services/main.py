from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import pandas as pd
import numpy as np
import os

# ── App setup ─────────────────────────────────────────────────────────────────
app = FastAPI(
    title="EasyRent Nepal – Rent Prediction API",
    description="ML-powered rent prediction for Nepal rental properties.",
    version="1.0.0",
)

# ── CORS – allow the Vite dev server and any deployed frontend ─────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load model artefacts once at startup ──────────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    model         = joblib.load(os.path.join(BASE_DIR, "nepal_property_price_model.pkl"))
    encoder       = joblib.load(os.path.join(BASE_DIR, "target_encoder.pkl"))
    train_columns = joblib.load(os.path.join(BASE_DIR, "train_columns.pkl"))
    print("[OK] Model, encoder, and train_columns loaded successfully.")
except Exception as exc:
    print(f"[ERROR] Failed to load model files: {exc}")
    raise


# ── Request schema ─────────────────────────────────────────────────────────────
class PropertyInput(BaseModel):
    """
    All fields the frontend sends from the AddProperty form.
    Defaults are provided so partially-filled forms still get a prediction.
    """
    property_type:      str   = Field(...,  example="Apartment")
    usage_type:         str   = Field("Rent", example="Rent")
    road_type:          str   = Field("pitched", example="pitched")
    parking_type:       str   = Field("None",  example="Car Parking")
    facing:             str   = Field("East",  example="South-West")
    furnishing:         str   = Field("Unfurnished", example="Semi Furnished")
    state:              str   = Field("Bagmati",     example="Bagmati")
    district:           str   = Field(...,  example="Kathmandu")
    city:               str   = Field(...,  example="Kathmandu")
    water_supply:       str   = Field("Yes", example="Yes")
    road_size_ft:       float = Field(0.0,   example=13.0)
    no_of_flat:         int   = Field(1,     example=1)
    rooms:              int   = Field(1,     example=2)
    bath:               int   = Field(1,     example=1)
    kitchen:            int   = Field(1,     example=1)
    shutter:            float = Field(0.0,   example=0.0)
    parking_no:         float = Field(0.0,   example=1.0)
    area_sqft:          float = Field(500.0, example=800.0)
    age:                float = Field(5.0,   example=3.0)
    transport_distance: float = Field(0.0,   example=0.5)
    service_charge:     float = Field(0.0,   example=0.0)
    amenities_count:    int   = Field(0,     example=3)


# ── Shared prediction logic ────────────────────────────────────────────────────
def run_prediction(input_data: PropertyInput) -> dict:
    data = pd.DataFrame([input_data.dict()])

    # Rename to match training column name
    data = data.rename(columns={"road_size_ft": "road_size(ft)"})

    # Feature engineering (mirror training notebook)
    data["location"]    = data["district"] + "_" + data["city"]
    data["total_rooms"] = data["rooms"] + data["kitchen"]
    data["log_area"]    = np.log1p(data["area_sqft"])

    road_map = {"pitched": 3, "marble": 2.5, "gravel": 1, "soil": 0.5}
    data["road_quality"] = data["road_type"].map(road_map).fillna(0)

    # Target encoding for high-cardinality columns
    high_card = ["district", "city", "location"]
    data[high_card] = encoder.transform(data[high_card])

    # One-hot encode remaining categorical columns
    data = pd.get_dummies(data, drop_first=True)

    # Align with training feature set
    for col in train_columns:
        if col not in data.columns:
            data[col] = 0
    data = data[train_columns]

    # Predict (model was trained on log1p(price))
    log_pred        = model.predict(data)
    predicted_price = float(np.expm1(log_pred)[0])

    return {
        "predicted_monthly_rent": round(predicted_price, 2),
        "currency": "NPR",
        "status": "success",
    }


# ── Endpoints ──────────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def health_check():
    return {"message": "EasyRent Nepal ML API is running!", "docs": "/docs"}


@app.post("/predict-rent", tags=["Prediction"])
async def predict_rent(input_data: PropertyInput):
    """
    Main endpoint used by the frontend Owner dashboard.
    Accepts property details and returns a predicted monthly rent in NPR.
    """
    try:
        return run_prediction(input_data)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(exc)}")


@app.post("/predict", tags=["Prediction"])
async def predict_price_legacy(input_data: PropertyInput):
    """Kept for backward compatibility."""
    try:
        result = run_prediction(input_data)
        # Legacy response shape
        result["predicted_monthly_price"] = result.pop("predicted_monthly_rent")
        return result
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(exc)}")


# ── Dev runner ─────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)