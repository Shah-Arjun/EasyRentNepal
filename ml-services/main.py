from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import pandas as pd
import numpy as np
import os
from typing import Dict

app = FastAPI(title="EasyRent Nepal - Property Price Prediction API")

# Load model files
try:
    model = joblib.load('nepal_property_price_model.pkl')
    encoder = joblib.load('target_encoder.pkl')
    train_columns = joblib.load('train_columns.pkl')
    print("Model, encoder, and columns loaded successfully!")
except Exception as e:
    print(f"Error loading model files: {e}")
    raise

class PropertyInput(BaseModel):
    property_type: str
    usage_type: str
    road_type: str
    parking_type: str
    facing: str
    furnishing: str
    state: str = "Bagmati"
    district: str
    city: str
    water_supply: str
    road_size_ft: float
    no_of_flat: int = 1
    rooms: int
    bath: int
    kitchen: int = 1
    shutter: float = 0
    parking_no: float = 0
    area_sqft: float
    age: float
    transport_distance: float = 0
    service_charge: float = 0
    amenities_count: int = 0

@app.get("/")
def home():
    return {"message": "EasyRent Nepal ML API is running! Go to /docs for testing."}

@app.post("/predict")
async def predict_price(input_data: PropertyInput):
    try:
        # Convert input to DataFrame
        data = pd.DataFrame([input_data.dict()])

        # Rename to match training columns
        data = data.rename(columns={'road_size_ft': 'road_size(ft)'})

        # === Feature Engineering (Same as training) ===
        data['location'] = data['district'] + '_' + data['city']
        data['total_rooms'] = data['rooms'] + data['kitchen']
        data['log_area'] = np.log1p(data['area_sqft'])
        
        road_map = {'pitched': 3, 'marble': 2.5, 'gravel': 1, 'soil': 0.5}
        data['road_quality'] = data['road_type'].map(road_map).fillna(0)

        # Target Encoding
        high_card = ['district', 'city', 'location']
        data[high_card] = encoder.transform(data[high_card])

        # One-hot encoding
        data = pd.get_dummies(data, drop_first=True)

        # Align columns with training data
        for col in train_columns:
            if col not in data.columns:
                data[col] = 0
        data = data[train_columns]

        # Predict
        log_pred = model.predict(data)
        predicted_price = np.expm1(log_pred)[0]

        return {
            "predicted_monthly_price": round(float(predicted_price), 2),
            "currency": "NPR",
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)