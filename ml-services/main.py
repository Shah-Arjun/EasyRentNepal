from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field        #for req validation, ensure frontend sends correct data
import joblib
import pandas as pd
import numpy as np
import os


# App setup 
app = FastAPI(
    title="EasyRent Nepal – Rent Prediction API",
    description="ML-powered rent prediction for Nepal rental properties.",
    version="1.0.0",
)


#  CORS – allow the Vite dev server(frontend) and any deployed frontend  to call FastApi
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten to your domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


#  Load model artefacts once at startup 
BASE_DIR = os.path.dirname(os.path.abspath(__file__))   #get current folder path


# load trained ml model, encoder, training columns
try:
    model         = joblib.load(os.path.join(BASE_DIR, "nepal_property_price_model.pkl"))
    encoder       = joblib.load(os.path.join(BASE_DIR, "target_encoder.pkl"))
    train_columns = joblib.load(os.path.join(BASE_DIR, "train_columns.pkl"))
    print("[OK] Model, encoder, and train_columns loaded successfully.")
except Exception as exc:
    print(f"[ERROR] Failed to load model files: {exc}")
    raise




#  Request schema -------- eg. is written in each fields for Api Docs
class PropertyInput(BaseModel):
    property_type:      str   
    usage_type:         str  
    road_type:          str  
    parking_type:       str  
    facing:             str  
    furnishing:         str  
    state:              str  
    district:           str  
    city:               str  
    water_supply:       str  
    road_size_ft:       float
    no_of_flat:         int   
    rooms:              int   
    bath:               int   
    kitchen:            int   
    shutter:            float 
    parking_no:         float 
    area_sqft:          float 
    age:                float 
    transport_distance: float 
    service_charge:     float 
    amenities_count:    int   



#  Prediction logic 
def run_prediction(input_data: PropertyInput) -> dict:
    data = pd.DataFrame([input_data.dict()])    #convert input to dataframe

    # Rename to match training column name
    data = data.rename(columns={"road_size_ft": "road_size(ft)"})

    # Feature engineering
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

    # Match with training columns - adds missing
    for col in train_columns:
        if col not in data.columns:
            data[col] = 0
    data = data[train_columns]

    # Predict --- model was trained on log1p(price) 
    log_pred        = model.predict(data)      # logarithm price
    predicted_price = float(np.expm1(log_pred)[0])    # converts back to real price

    return {
        "predicted_monthly_rent": round(predicted_price, 2),
        "currency": "NPR",
        "status": "success",
    }


# API  endpoints 
@app.get("/", tags=["Health"])
def health_check():
    return {"message": "EasyRent Nepal ML API is running!", "docs": "/docs"}



# prediction api end point --- http://localhost:8000/predict-rent
@app.post("/predict-rent", tags=["Prediction"])
async def predict_rent(input_data: PropertyInput):
    try:
        return run_prediction(input_data)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(exc)}")



#  Dev runner 
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)