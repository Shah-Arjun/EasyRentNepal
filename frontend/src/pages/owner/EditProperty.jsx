import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";
import { useAppContext } from "../../context/AppContext";

//  ======================================== Constants & Enums =======================================
const provinceEnum = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
];

const categories = [
  "House",
  "Land",
  "Apartment",
  "Flat",
  "Office",
  "Room",
  "Shutter",
];

const listingTypes = ["Rent"];

const parkingOptions = [
  "Motorcycle 1-3",
  "Motorcycle 4-6",
  "Car 1",
  "Car 2",
  "Cars 3-5",
  "Cars 5-10",
  "Cars 10-15",
  "Other",
  "None",
];

const furnishedStatuses = ["unfurnished", "semi-furnished", "fully-furnished"];

const facingOptions = [
  "East",
  "West",
  "North",
  "South",
  "North-East",
  "North-West",
  "South-East",
  "South-West",
];

const builtAreaUnits = [
  "sqft", "aana", "ropani", "paisa", "dam", "haath", "feet", "sqm", "other",
];

const landAreaUnits = [
  "aana", "ropani", "paisa", "dam", "sqft", "sqm", "haath", "dhur", "kattha", "bigha",
];

const currencies = ["NPR"];

const perUnits = [
  "total",
  "per aana",
  "per ropani",
  "per sqft",
  "per dhur",
  "per kattha",
  "per bigha",
  "per month",
  "per year",
];

const bathroomTypes = ["attached", "shared"];

const suggestedAmenities = [
  "WiFi",
  "Water Supply (24/7)",
  "Electricity",
  "Air Conditioning",
  "Gym",
  "Swimming Pool",
  "Security",
  "Elevator",
  "Garden",
  "Balcony",
  "Parking",
  "Heating",
];

// step for property data entry
const steps = [
  { title: "Basic & Location", id: 0 },
  { title: "Structure", id: 1 },
  { title: "Description & Media", id: 2 },
  { title: "Price", id: 3 },
];

//======================================== Reusable sub-components =======================================
const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-6 border-b pb-4">
    <h2 className="h3 text-black">{title}</h2>
    {subtitle && <p className="text-gray-50 mt-1">{subtitle}</p>}
  </div>
);

const Label = ({ children, required }) => (
  <label className="block text-[14px] font-[500] text-black mb-1">
    {children} {required && <span className="text-secondary">*</span>}
  </label>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-secondary focus:border-secondary transition-all outline-none text-black ${className}`}
  />
);

const Select = ({ className = "", children, ...props }) => (
  <select
    {...props}
    className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-secondary focus:border-secondary transition-all outline-none text-black ${className}`}
  >
    {children}
  </select>
);

// ========================== Main component ===================================================================
const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useAxios();
  const { editProperty } = useAppContext();
  const fileInputRef = useRef(null);
  const errorRef = useRef(null);

  const [formData, setFormData] = useState({
    title: "",
    category: "Room",
    listingType: "Rent",
    noOfFlat: "1",
    bedrooms: 1,
    bathrooms: 1,
    bathroomType: "shared",
    bedCount: 0,
    living: 0,
    kitchen: 0,
    parking: "None",
    furnishedStatus: "unfurnished",
    builtYear: "",
    builtArea: { value: "", unit: "sqft" },
    landArea: { value: "", unit: "dhur" },
    facing: "",
    price: { value: "", currency: "NPR", perUnit: "per month" },
    location: {
      province: "",
      district: "",
      municipality: "",
      tole: "",
      wardNo: "",
    },
    roadSize: { value: "", unit: "ft" },
    fullDescription: "",
    existingImages: [],
    newImages: [],   // each entry: File object with a `.preview` URL attached
    videoUrl: "",
    amenities: [],
    status: "Available",
  });

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // ── Rent prediction state ─────────────────────────────────────────────────
  const [predictLoading, setPredictLoading] = useState(false);
  const [predictError, setPredictError] = useState("");
  const [predictedRent, setPredictedRent] = useState(null); 
  const [rentAccepted, setRentAccepted] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await api.get(`/property/${id}`);
        if (response.data.success) {
          const p = response.data.property;
          setFormData({
            title: p.title || "",
            category: p.category || "Room",
            listingType: p.listingType || "Rent",
            noOfFlat: p.noOfFlat || "1",
            bedrooms: p.bedrooms || 0,
            bathrooms: p.bathrooms || 0,
            bathroomType: p.bathroomType || "shared",
            bedCount: p.bedCount || 0,
            living: p.living || 0,
            kitchen: p.kitchen || 0,
            parking: p.parking || "None",
            furnishedStatus: p.furnishedStatus || "unfurnished",
            builtYear: p.builtYear || "",
            builtArea: p.builtArea || { value: "", unit: "sqft" },
            landArea: p.landArea || { value: "", unit: "dhur" },
            facing: p.facing || "",
            price: p.price || { value: "", currency: "NPR", perUnit: "per month" },
            location: p.location || { province: "", district: "", municipality: "", tole: "", wardNo: "" },
            roadSize: p.roadSize || { value: "", unit: "ft" },
            fullDescription: p.fullDescription || "",
            existingImages: p.images || [],
            newImages: [],
            videoUrl: p.videoUrl || "",
            amenities: p.amenities || [],
            status: p.status || "Available",
          });
        }
      } catch (err) {
        toast.error("Failed to fetch property details");
        navigate("/owner/list-property");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, api, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  const handleInputChange = (e) => {
    setError("");
    const { name, value, type } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "number" ? (value === "" ? "" : Number(value)) : value }));
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleImageChange = (files) => {
    const fileArray = Array.from(files);
    if (formData.existingImages.length + formData.newImages.length + fileArray.length > 5) {
      setError("Max 5 images allowed");
      return;
    }
    const valid = fileArray.map((file) => {
      file.preview = URL.createObjectURL(file);
      return file;
    });
    setFormData((prev) => ({
      ...prev,
      newImages: [...prev.newImages, ...valid],
    }));
  };

  const removeExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      existingImages: prev.existingImages.filter((_, i) => i !== index),
    }));
  };

  const removeNewImage = (index) => {
    URL.revokeObjectURL(formData.newImages[index].preview);
    setFormData((prev) => ({
      ...prev,
      newImages: prev.newImages.filter((_, i) => i !== index),
    }));
  };

  const validateStep = (stepIndex) => {
    setError("");
    switch (stepIndex) {
      case 0:
        if (!formData.title.trim()) { setError("Property title is required"); return false; }
        if (!formData.location.province) { setError("Province is required"); return false; }
        if (!formData.location.district.trim()) { setError("District is required"); return false; }
        if (!formData.location.municipality.trim()) { setError("Municipality is required"); return false; }
        return true;
      case 2:
        if (!formData.fullDescription.trim()) { setError("Property description is required"); return false; }
        if (formData.existingImages.length + formData.newImages.length === 0) {
          setError("Please upload at least 1 property image");
          return false;
        }
        return true;
      case 3:
        if (!formData.price.value || Number(formData.price.value) <= 0) {
          setError("A valid price is required");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(activeTab)) setActiveTab((t) => Math.min(steps.length - 1, t + 1));
  };

  const handlePrevStep = () => setActiveTab((t) => Math.max(0, t - 1));

  // ── Rent prediction helpers ───────────────────────────────────────────────

  /** Map EditProperty formData --> FastAPI PropertyInput shape */
  const buildPredictPayload = () => {
    // --- parking ---
    const parkingStr = formData.parking || "None";
    let parking_type = "None";
    let parking_no   = 0;
    if (parkingStr.startsWith("Motorcycle")) {
      parking_type = "Bike Parking";
      const range  = parkingStr.split(" ")[1] || "1";
      parking_no   = range.includes("-") ? parseInt(range.split("-")[0]) : parseInt(range);
    } else if (parkingStr.startsWith("Car") || parkingStr.startsWith("Cars")) {
      parking_type = "Car Parking";
      const parts  = parkingStr.split(" ");
      const range  = parts[1] || "1";
      parking_no   = range.includes("-") ? parseInt(range.split("-")[0]) : parseInt(range);
    } else if (parkingStr === "Other") {
      parking_type = "Other";
      parking_no   = 1;
    }

    // --- province → state (strip " Pradesh") ---
    const state = (formData.location.province || "Bagmati").replace(" Pradesh", "");

    // --- age ---
    const currentYear = new Date().getFullYear();
    const builtYear   = formData.builtYear ? parseInt(formData.builtYear) : currentYear - 5;
    const age         = Math.max(0, currentYear - builtYear);

    // --- area --> sqft conversion ---
    const unitToSqft  = { sqft: 1, sqm: 10.764, aana: 342.25, ropani: 5476, haath: 6.25, feet: 1, other: 1 };
    const rawArea     = parseFloat(formData.builtArea.value) || 500;
    const area_sqft   = rawArea * (unitToSqft[formData.builtArea.unit] ?? 1);

    // --- furnishing ---
    const furnishMap  = { "unfurnished": "Unfurnished", "semi-furnished": "Semi Furnished", "fully-furnished": "Fully Furnished" };

    return {
      property_type:      formData.category || "Room",
      usage_type:         "Rent",
      road_type:          "pitched",
      parking_type,
      facing:             formData.facing || "East",
      furnishing:         furnishMap[formData.furnishedStatus] ?? "Unfurnished",
      state,
      district:           formData.location.district   || "Kathmandu",
      city:               formData.location.municipality || "Kathmandu",
      water_supply:       "Yes",
      road_size_ft:       parseFloat(formData.roadSize.value) || 0,
      no_of_flat:         parseInt(formData.noOfFlat)   || 1,
      rooms:              parseInt(formData.bedrooms)   || 1,
      bath:               parseInt(formData.bathrooms)  || 1,
      kitchen:            parseInt(formData.kitchen)    || 1,
      shutter:            formData.category === "Shutter" ? 1 : 0,
      parking_no,
      area_sqft:          Math.round(area_sqft),
      age,
      transport_distance: 0,
      service_charge:     0,
      amenities_count:    formData.amenities.length,
    };
  };

  const handlePredictRent = async () => {
    setPredictError("");
    setPredictedRent(null);
    setRentAccepted(false);

    if (!formData.location.district || !formData.location.municipality) {
      setPredictError("Please fill in District and Municipality (Step 1) before predicting.");
      toast.warn("District and Municipality are required for prediction.");
      return;
    }

    setPredictLoading(true);
    try {
      const payload  = buildPredictPayload();
      const response = await fetch(`${import.meta.env.VITE_ML_API_URL}/predict-rent`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.detail || `Server error (${response.status})`);
      }

      const result = await response.json();
      setPredictedRent(result.predicted_monthly_rent);
    } catch (err) {
      const isNetErr = err.message?.includes("fetch") || err.name === "TypeError";
      setPredictError(
        isNetErr
          ? "Could not reach the ML service. Server error."
          : err.message || "Prediction failed. Please try again."
      );
    } finally {
      setPredictLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(0) || !validateStep(2) || !validateStep(3)) return;

    setSubmitting(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (['price', 'builtArea', 'landArea', 'location', 'roadSize', 'amenities'].includes(key)) {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === 'newImages') {
          formData.newImages.forEach(file => data.append('images', file));
        } else if (key !== 'existingImages' && key !== 'newImages') {
          data.append(key, formData[key]);
        }
      });
      
      data.append('retainedImages', JSON.stringify(formData.existingImages));

      const response = await editProperty(id, data);
      if (response.success) {
        toast.success("Property updated successfully!");
        navigate("/owner/list-property");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.message || "Error updating property");
      toast.error(err.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flexCenter py-40">Loading property data...</div>;

  return (
    <div className="w-full p-8">
      <div className="text-center mb-10">
        <h1 className="h2 text-black mb-2">Edit Property</h1>
        <p className="text-gray-50">Update your property listing details.</p>
      </div>

      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 w-full z-0 rounded-full" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-secondary z-0 rounded-full transition-all duration-300"
          style={{ width: `${(activeTab / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, index) => (
          <div
            key={step.id}
            onClick={() => { if (step.id < activeTab || validateStep(activeTab)) setActiveTab(step.id); }}
            className="relative z-10 flex flex-col items-center cursor-pointer"
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] transition-all duration-300 ${activeTab >= index ? "bg-secondary text-black shadow-lg" : "bg-white text-gray-400 border-2 border-gray-200"}`}>
              {index + 1}
            </div>
            <span className={`absolute -bottom-6 text-[13px] font-[500] whitespace-nowrap ${activeTab >= index ? "text-black" : "text-gray-400"}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-12 border border-gray-100 p-8 sm:p-10">
        {error && <div ref={errorRef} className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-[14px]">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-8">
          {activeTab === 0 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <SectionTitle title="Basic Information" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <Label required>Property Title</Label>
                  <Input type="text" name="title" value={formData.title} onChange={handleInputChange} maxLength={150} />
                </div>
                <div>
                  <Label required>Property Category</Label>
                  <Select name="category" value={formData.category} onChange={handleInputChange}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
                <div>
                  <Label required>Province</Label>
                  <Select value={formData.location.province} onChange={(e) => handleNestedChange("location", "province", e.target.value)}>
                    <option value="" disabled>Select Province</option>
                    {provinceEnum.map((p) => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </div>
                <div>
                  <Label required>District</Label>
                  <Input type="text" value={formData.location.district} onChange={(e) => handleNestedChange("location", "district", e.target.value)} />
                </div>
                <div>
                  <Label required>Municipality</Label>
                  <Input type="text" value={formData.location.municipality} onChange={(e) => handleNestedChange("location", "municipality", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {activeTab === 1 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <SectionTitle title="Structure & Layout" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div><Label>Bedrooms</Label><Input type="number" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} /></div>
                <div><Label>Bathrooms</Label><Input type="number" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} /></div>
                <div><Label>Kitchens</Label><Input type="number" name="kitchen" value={formData.kitchen} onChange={handleInputChange} /></div>
                <div><Label>Furnishing</Label><Select name="furnishedStatus" value={formData.furnishedStatus} onChange={handleInputChange}>{furnishedStatuses.map(s => <option key={s} value={s}>{s}</option>)}</Select></div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <SectionTitle title="Description & Media" />
              <div>
                <Label required>Description</Label>
                <textarea className="w-full p-4 border rounded-xl h-32" value={formData.fullDescription} onChange={(e) => setFormData({...formData, fullDescription: e.target.value})} />
              </div>
              <div>
                <Label required>Images (Max 5)</Label>
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {formData.existingImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img.url} className="w-full h-24 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">×</button>
                    </div>
                  ))}
                  {formData.newImages.map((img, i) => (
                    <div key={i} className="relative group">
                      <img src={img.preview} className="w-full h-24 object-cover rounded-lg" />
                      <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition">×</button>
                    </div>
                  ))}
                  {(formData.existingImages.length + formData.newImages.length < 5) && (
                    <div onClick={() => fileInputRef.current.click()} className="border-2 border-dashed rounded-lg h-24 flex items-center justify-center cursor-pointer hover:bg-gray-50">+ Add</div>
                  )}
                </div>
                <input type="file" multiple ref={fileInputRef} className="hidden" onChange={(e) => handleImageChange(e.target.files)} />
              </div>
            </div>
          )}

          {activeTab === 3 && (
            <div className="space-y-8 animate-in fade-in duration-500">
              <SectionTitle title="Pricing" />
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <Label required>Monthly Rent</Label>
                  <Input type="number" value={formData.price.value} onChange={(e) => handleNestedChange("price", "value", e.target.value)} />
                </div>
                <button type="button" onClick={handlePredictRent} disabled={predictLoading} className="bg-secondary px-6 py-2.5 rounded-lg font-medium">{predictLoading ? "..." : "Predict Rent"}</button>
              </div>
              {predictedRent && <p className="text-sm text-emerald-600 font-medium">Recommended: {predictedRent.toLocaleString()}</p>}
            </div>
          )}

          <div className="flex justify-between mt-10">
            <button type="button" onClick={handlePrevStep} disabled={activeTab === 0} className="px-8 py-3 border rounded-xl disabled:opacity-50">Back</button>
            {activeTab < steps.length - 1 ? (
              <button type="button" onClick={handleNextStep} className="btn-secondary px-10 py-3 rounded-xl">Next</button>
            ) : (
              <button type="submit" disabled={submitting} className="btn-secondary px-10 py-3 rounded-xl">{submitting ? "Updating..." : "Update Property"}</button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
