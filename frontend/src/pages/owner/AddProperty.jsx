import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../../hooks/useAxios";
import { toast } from "react-toastify";



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
const AddProperty = () => {
  const navigate = useNavigate();
  const api = useAxios();
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  const errorRef = useRef(null);
  const imagesRef = useRef([]);

  const [formData, setFormData] = useState({
    title: "",
    category: "Room",
    listingType: "Rent",
    noOfFlat: "0",
    bedrooms: 0,
    bathrooms: 0,
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
    images: [],   // each entry: File object with a `.preview` URL attached
    videoUrl: "",
    amenities: [],
  });

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // ── Rent prediction state ─────────────────────────────────────────────────
  const [predictLoading, setPredictLoading] = useState(false);
  const [predictError, setPredictError] = useState("");
  const [predictedRent, setPredictedRent] = useState(null); // number | null
  const [rentAccepted, setRentAccepted] = useState(false);




  
  // -------------- Scroll to top on tab change ---------------------------
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [activeTab]);

  // Keep latest images in a ref so unmount cleanup always has current previews.
useEffect(() => {
    imagesRef.current = formData.images;
  }, [formData.images]);

  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => img.preview && URL.revokeObjectURL(img.preview));
    };
  }, []);


  //-------------------- move to error when it changes, so user sees it immediately ----------------
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);




  // -------------------------- Handlers -----------------------------------
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

    if (formData.images.length + fileArray.length > 5) {
      setError("Max 5 images allowed");
      return;
    }

    const valid = fileArray.map((file) => {
      file.preview = URL.createObjectURL(file);
      return file;
    });

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...valid],
    }));
  };



  
  const removeImage = (index) => {
    // Revoke immediately to avoid leaking the object URL
    URL.revokeObjectURL(formData.images[index].preview);
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length > 0) handleImageChange(e.dataTransfer.files);
  };






  // ------------------------ Validation ------------------------------------
  const validateStep = (stepIndex) => {
    setError("");
    switch (stepIndex) {
      case 0:  // basic and location
        if (!formData.title.trim()) { setError("Property title is required"); return false; }
        if (!formData.location.province) { setError("Province is required"); return false; }
        if (!formData.location.district.trim()) { setError("District is required"); return false; }
        if (!formData.location.municipality.trim()) { setError("Municipality / Rural Municipality is required"); return false; }
        if (!formData.category) { setError("Property category is required"); return false;}
        return true;

      case 1: // structure
        return true;

      case 2:   //description and media
        if (!formData.fullDescription.trim()) {
          setError("Property description is required");
          return false;
        }
        if (formData.images.length === 0) {
          setError("Please upload at least 1 property image");
          return false;
        }
        return true;

      case 3:   // price
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

  /** Map AddProperty formData --> FastAPI PropertyInput shape */
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

    // Basic guard — need at least district + city of location
    if (!formData.location.district || !formData.location.municipality) {
      setPredictError("Please fill in District and Municipality (Step 1) before predicting.");
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

  const handleAcceptRent = () => {
    if (!predictedRent) return;
    handleNestedChange("price", "value", String(Math.round(predictedRent)));
    setRentAccepted(true);
  };

  const handleOverrideRent = () => {
    setPredictedRent(null);
    setRentAccepted(false);
  };




  // -----------------------------handel submit --------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateStep(0) || !validateStep(2) || !validateStep(3)) return;

    setLoading(true);
    try {
      const data = new FormData();

      // Simple string / number fields
      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("listingType", formData.listingType);
      data.append("bathroomType", formData.bathroomType);
      data.append("parking", formData.parking);
      data.append("furnishedStatus", formData.furnishedStatus);
      data.append("fullDescription", formData.fullDescription);
      data.append("videoUrl", formData.videoUrl);
      data.append("facing", formData.facing);
      data.append("bedrooms", formData.bedrooms ?? "");
      data.append("bathrooms", formData.bathrooms ?? "");
      data.append("living", formData.living ?? "");
      data.append("kitchen", formData.kitchen ?? "");
      data.append("noOfFlat", formData.noOfFlat ?? "");
      data.append("bedCount", formData.bedCount ?? "");
      data.append("builtYear", formData.builtYear ?? "");

      // Nested objects – serialised so backend can JSON.parse them
      data.append("price", JSON.stringify(formData.price));
      data.append("builtArea", JSON.stringify(formData.builtArea));
      data.append("landArea", JSON.stringify(formData.landArea));
      data.append("location", JSON.stringify(formData.location));
      data.append("roadSize", JSON.stringify(formData.roadSize));
      data.append("amenities", JSON.stringify(formData.amenities));

      // Images
      formData.images.forEach((file) => data.append("images", file));

      console.log("Submitting property from frontend---", data);

      //   Do NOT set Content-Type manually — Axios auto-sets
      //     'multipart/form-data; boundary=...' when body is FormData.
      //     Overriding it strips the boundary and breaks Multer parsing.
      const response = await api.post("/property/addProperty", data);

      if (response.data.success) {
        toast.success("Property listed successfully!");
        navigate("/owner/list-property");
      }
    } catch (err) {
      console.error("Submission error:", err);
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 413 ? "Images are too large. Reduce image size/count and try again." : "") ||
        err.message ||
        "Error submitting property. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };




  return (
    <div className="w-full p-8">
      <div className="text-center mb-10">
        <h1 className="h2 text-black mb-2">List Your Property</h1>
        <p className="text-gray-50">
          Fill in the details to publish your listing to thousands of seekers.
        </p>
      </div>

      {/* Progress Tracker */}
      <div className="flex justify-between items-center mb-8 relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-gray-200 w-full z-0 rounded-full" />
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-secondary z-0 rounded-full transition-all duration-300"
          style={{ width: `${(activeTab / (steps.length - 1)) * 100}%` }}
        />
        {steps.map((step, index) => (
          <div
            key={step.id}
            onClick={() => {
              if (step.id < activeTab || validateStep(activeTab)) setActiveTab(step.id);
            }}
            className="relative z-10 flex flex-col items-center cursor-pointer"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] transition-all duration-300 ${
                activeTab >= index
                  ? "bg-secondary text-black shadow-lg shadow-tertiary/50"
                  : "bg-white text-gray-400 border-2 border-gray-200"
              }`}
            >
              {index + 1}
            </div>
            <span
              className={`absolute -bottom-6 text-[13px] font-[500] whitespace-nowrap transition-colors ${
                activeTab >= index ? "text-black" : "text-gray-400"
              }`}
            >
              {step.title}
            </span>
          </div>
        ))}
      </div>




      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-12 border border-gray-100 p-8 sm:p-10">
        {/* error */}
        {error && (
            <div
              ref={errorRef}
              className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-[14px]"
            >
              {error}
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* ,,,,,,,,,,, TAB 0: Basic & Location ,,,,,,,,,,, */}
          <div className={activeTab === 0 ? "block space-y-8 animate-in fade-in duration-500" : "hidden"}>
            <SectionTitle title="Basic Information" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="col-span-1 md:col-span-2">
                <Label required>Property Title</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Beautiful 3BHK Apartment in the heart of Kathmandu"
                  maxLength={150}
                />
                <p className="text-[13px] text-gray-50 mt-2">Max 150 characters. Make it catchy and descriptive.</p>
              </div>

              <div>
                <Label required>Property Category</Label>
                <Select name="category" value={formData.category} onChange={handleInputChange}>
                  {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </Select>
              </div>

              <div>
                <Label required>Listing Type</Label>
                <div className="flex gap-4">
                  {listingTypes.map((type) => (
                    <label
                      key={type}
                      className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.listingType === type
                          ? "border-secondary bg-tertiary/20 text-black font-[500]"
                          : "border-gray-200 text-gray-50 hover:bg-primary"
                      }`}
                    >
                      <input
                        type="radio"
                        name="listingType"
                        value={type}
                        checked={formData.listingType === type}
                        onChange={handleInputChange}
                        className="sr-only"
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
            </div>

           {/* location */}
            <div className="mt-8">
              <SectionTitle title="Property Location" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label required>Province</Label>
                  <Select
                    value={formData.location.province}
                    onChange={(e) => handleNestedChange("location", "province", e.target.value)}
                  >
                    <option value="" disabled>Select Province</option>
                    {provinceEnum.map((p) => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </div>

                <div>
                  <Label required>District</Label>
                  <Input
                    type="text"
                    value={formData.location.district}
                    onChange={(e) => handleNestedChange("location", "district", e.target.value)}
                    placeholder="e.g., Kathmandu"
                  />
                </div>

                <div>
                  <Label required>Municipality / Rural Municipality</Label>
                  <Input
                    type="text"
                    value={formData.location.municipality}
                    onChange={(e) => handleNestedChange("location", "municipality", e.target.value)}
                    placeholder="e.g., Kathmandu Metropolitan"
                  />
                </div>

                <div>
                  <Label>Tole / Local Area</Label>
                  <Input
                    type="text"
                    value={formData.location.tole}
                    onChange={(e) => handleNestedChange("location", "tole", e.target.value)}
                    placeholder="e.g., Baneshwor"
                  />
                </div>

                <div>
                  <Label>Ward No.</Label>
                  <Input
                    type="number"
                    min="1"
                    max="35"
                    value={formData.location.wardNo}
                    onChange={(e) => handleNestedChange("location", "wardNo", e.target.value)}
                    placeholder="e.g., 10"
                  />
                </div>

                <div className="col-span-1 md:col-span-2 mt-4 pt-6 border-t border-gray-100">
                  <h3 className="h4 text-black mb-4">Road Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label>Road Size</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.roadSize.value}
                        onChange={(e) => handleNestedChange("roadSize", "value", e.target.value)}
                        placeholder="e.g., 13"
                      />
                    </div>
                    <div>
                      <Label>Road Unit</Label>
                      <Select
                        value={formData.roadSize.unit}
                        onChange={(e) => handleNestedChange("roadSize", "unit", e.target.value)}
                      >
                        <option value="ft">Feet (ft)</option>
                        <option value="m">Meters (m)</option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>





          {/* ,,,,,,,,,,,,, TAB 1: Structure  ,,,,,,,,,,,,,,,, */}
          <div className={activeTab === 1 ? "block space-y-8 animate-in fade-in duration-500" : "hidden"}>
            <SectionTitle
              title="Structure & Layout"
              subtitle="Tell us about the physical attributes of the property."
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <Label>Bedrooms</Label>
                <Input type="number" min="0" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Bathrooms</Label>
                <Input type="number" min="0" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Living Rooms</Label>
                <Input type="number" min="0" name="living" value={formData.living} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Kitchens</Label>
                <Input type="number" min="0" name="kitchen" value={formData.kitchen} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Bathroom Type</Label>
                <Select name="bathroomType" value={formData.bathroomType} onChange={handleInputChange}>
                  {bathroomTypes.map((t) => <option key={t} value={t}>{t}</option>)}
                </Select>
              </div>
              <div>
                <Label>No. of Flats</Label>
                <Input type="number" min="0" name="noOfFlat" value={formData.noOfFlat} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Bed Count</Label>
                <Input type="number" min="0" name="bedCount" value={formData.bedCount} onChange={handleInputChange} />
              </div>
              <div>
                <Label>Furnishing</Label>
                <Select name="furnishedStatus" value={formData.furnishedStatus} onChange={handleInputChange}>
                  {furnishedStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </Select>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <h3 className="h4 text-black mb-4">Area & Dimension</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-primary p-5 rounded-xl border border-gray-100">
                  <Label>Built Area</Label>
                  <div className="flex gap-4 mt-2">
                    <Input
                      type="number" min="0"
                      value={formData.builtArea.value}
                      onChange={(e) => handleNestedChange("builtArea", "value", e.target.value)}
                      placeholder="Value"
                      className="w-2/3"
                    />
                    <Select
                      value={formData.builtArea.unit}
                      onChange={(e) => handleNestedChange("builtArea", "unit", e.target.value)}
                      className="w-1/3"
                    >
                      {builtAreaUnits.map((u) => <option key={u} value={u}>{u}</option>)}
                    </Select>
                  </div>
                </div>

                <div className="bg-primary p-5 rounded-xl border border-gray-100">
                  <Label>Land Area</Label>
                  <div className="flex gap-4 mt-2">
                    <Input
                      type="number" min="0"
                      value={formData.landArea.value}
                      onChange={(e) => handleNestedChange("landArea", "value", e.target.value)}
                      placeholder="Value"
                      className="w-2/3"
                    />
                    <Select
                      value={formData.landArea.unit}
                      onChange={(e) => handleNestedChange("landArea", "unit", e.target.value)}
                      className="w-1/3"
                    >
                      {landAreaUnits.map((u) => <option key={u} value={u}>{u}</option>)}
                    </Select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <div>
                  <Label>Built Year</Label>
                  <Input
                    type="number"
                    min="1900"
                    max="2083"
                    name="builtYear"
                    value={formData.builtYear}
                    onChange={handleInputChange}
                    placeholder="YYYY"
                  />
                </div>
                <div>
                  <Label>Parking</Label>
                  <Select name="parking" value={formData.parking} onChange={handleInputChange}>
                    {parkingOptions.map((p) => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>Property Facing</Label>
                  <Select name="facing" value={formData.facing} onChange={handleInputChange}>
                    <option value="">Select Direction</option>
                    {facingOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                  </Select>
                </div>
              </div>
            </div>
          </div>




          {/* ,,,,,,,,,,, TAB 2: Description, Amenities & Media ,,,,,,,,,,, */}
          <div className={activeTab === 2 ? "block space-y-8 animate-in fade-in duration-500" : "hidden"}>
            <SectionTitle
              title="Description & Amenities"
              subtitle="Highlight what makes this property special."
            />
            <div>
              <Label required>Full Description</Label>
              <textarea
                name="fullDescription"
                value={formData.fullDescription}
                onChange={handleInputChange}
                rows="5"
                maxLength={5000}
                placeholder="Describe your property in detail. Highlight key selling points, nearby places, community, etc."
                className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-secondary focus:border-secondary transition-all outline-none text-black resize-none"
              />
              <div className="text-right mt-1 text-[13px] text-gray-400">
                {formData.fullDescription.length} / 5000 chars
              </div>
            </div>

            <div>
              <Label>Amenities Available</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                {suggestedAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${
                      formData.amenities.includes(amenity)
                        ? "border-secondary bg-tertiary/20 text-black"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.amenities.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      className="w-4 h-4 text-secondary rounded focus:ring-secondary border-gray-300 accent-secondary"
                    />
                    <span className="text-[14px] font-[500]">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100">
              <SectionTitle
                title="Media"
                subtitle="Upload visuals of your property to attract more views."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Upload */}
                <div>
                  <Label>Property Images</Label>
                  <div
                    ref={dropZoneRef}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`mt-2 flex justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors cursor-pointer bg-primary ${
                      dragActive
                        ? "border-secondary bg-tertiary/20"
                        : "border-gray-300 hover:border-secondary hover:bg-tertiary/10"
                    }`}
                  >
                    <div className="text-center w-full">
                      <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path
                          fillRule="evenodd"
                          d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div className="mt-4 flex text-[14px] leading-6 justify-center">
                        <span className="font-[500] text-black hover:text-secondary transition-colors">
                          Upload files
                          <input
                            ref={fileInputRef}
                            type="file"
                            className="sr-only"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleImageChange(e.target.files)}
                          />
                        </span>
                        <p className="pl-1 text-gray-50">or drag and drop</p>
                      </div>
                      <p className="text-[13px] leading-5 text-gray-400">
                        PNG, JPG, GIF up to 5MB each (Max 5 images)
                      </p>
                      <p className="text-[12px] leading-5 text-gray-400 mt-2">
                        {formData.images.length}/5 images added
                      </p>
                    </div>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="mt-6 grid grid-cols-3 gap-4">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image.preview}
                            alt={`preview-${index}`}
                            className="w-full h-32 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video URL */}
                <div>
                  <Label>Youtube / Video URL</Label>
                  <Input
                    type="url"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/watch?v=..."
                    className="mt-2"
                  />
                  <p className="mt-2 text-[13px] text-gray-50">
                    Add a virtual tour or video walkthrough link if you have one.
                  </p>

                  {formData.videoUrl && (
                    <div className="mt-4 p-4 rounded-xl bg-primary border border-gray-200 text-[14px] text-center text-gray-50 overflow-hidden text-ellipsis">
                      Video Linked:{" "}
                      <a
                        href={formData.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-secondary hover:underline"
                      >
                        {formData.videoUrl}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>





          {/* ,,,,,,,,,,, TAB 3: Price ,,,,,,,,,,, */}
          <div className={activeTab === 3 ? "block space-y-8 animate-in fade-in duration-500" : "hidden"}>

            {/* ── AI Rent Prediction card ───────────────────────────────── */}
            <div className="rounded-2xl border-2 border-dashed border-secondary/40 bg-gradient-to-br from-amber-50/60 to-white p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {/* sparkle icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-secondary">
                      <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                    </svg>
                    <h3 className="font-bold text-slate-800 text-[15px]">AI Rent Predictor</h3>
                  </div>
                  <p className="text-[13px] text-gray-400 leading-relaxed max-w-sm">
                    Our ML model analyses your property details and suggests an optimal monthly rent based on real Nepal market data.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handlePredictRent}
                  disabled={predictLoading}
                  className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-slate-900 font-semibold text-[14px] hover:bg-amber-400 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm shadow-secondary/30"
                >
                  {predictLoading ? (
                    <>
                      <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Predicting…
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                        <path d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                      </svg>
                      Predict Rent
                    </>
                  )}
                </button>
              </div>

              {/* Predict error */}
              {predictError && (
                <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 mt-0.5 flex-shrink-0">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                  </svg>
                  {predictError}
                </div>
              )}

              {/* Prediction result */}
              {predictedRent !== null && (
                <div className={`rounded-xl border-2 p-5 transition-all ${
                  rentAccepted ? "border-green-300 bg-green-50" : "border-secondary/50 bg-amber-50/60"
                }`}>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-[12px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                        Predicted Monthly Rent
                      </p>
                      <p className="text-3xl font-bold text-slate-900">
                        NPR {predictedRent.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                        <span className="text-[13px] text-slate-400 font-normal ml-2">/ month</span>
                      </p>
                      {rentAccepted && (
                        <p className="text-[13px] text-green-700 font-semibold mt-1 flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z" clipRule="evenodd" />
                          </svg>
                          Rent accepted — applied to price field
                        </p>
                      )}
                    </div>

                    {!rentAccepted ? (
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={handleAcceptRent}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-secondary text-slate-900 font-semibold text-[13px] hover:bg-amber-400 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z" clipRule="evenodd" />
                          </svg>
                          Use This Rent
                        </button>
                        <button
                          type="button"
                          onClick={handleOverrideRent}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-[13px] hover:bg-slate-50 transition"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                            <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
                          </svg>
                          Enter Manually
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={handleOverrideRent}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-600 font-medium text-[13px] hover:bg-slate-50 transition flex-shrink-0"
                      >
                        Override
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* Placeholder when no prediction yet */}
              {predictedRent === null && !predictLoading && !predictError && (
                <p className="text-center text-[13px] text-slate-400 italic py-2">
                  Click <strong className="text-secondary">Predict Rent</strong> to get an AI-suggested price for your property.
                </p>
              )}
            </div>

            {/* ── Manual price inputs ───────────────────────────────────── */}
            <div>
              <SectionTitle title="Pricing Strategy" />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Label required>Price Value (NPR)</Label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.price.value}
                    onChange={(e) => { handleNestedChange("price", "value", e.target.value); setRentAccepted(false); }}
                    placeholder="e.g., 25000"
                  />
                  {rentAccepted && (
                    <p className="text-[12px] text-green-600 mt-1 font-medium">↑ Filled from AI prediction</p>
                  )}
                </div>
                <div>
                  <Label>Currency</Label>
                  <Select
                    value={formData.price.currency}
                    onChange={(e) => handleNestedChange("price", "currency", e.target.value)}
                  >
                    {currencies.map((c) => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>Per Unit</Label>
                  <Select
                    value={formData.price.perUnit}
                    onChange={(e) => handleNestedChange("price", "perUnit", e.target.value)}
                  >
                    {perUnits.map((u) => <option key={u} value={u}>{u}</option>)}
                  </Select>
                </div>
              </div>
            </div>
          </div>





          {/* ,,,,,,,,,,, Navigation Buttons ,,,,,,,,,,, */}
          <div className="pt-8 mt-8 border-t border-gray-200 flex justify-between items-center">
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={activeTab === 0}
              className={`px-6 py-2.5 rounded-full text-[14px] font-[500] transition-all ${
                activeTab === 0 ? "bg-primary text-gray-400 cursor-not-allowed" : "btn-outline"
              }`}
            >
              Back
            </button>

            {activeTab < steps.length - 1 ? (
              <button type="button" onClick={handleNextStep} className="btn-dark flex items-center gap-2">
                Next Step
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Listing"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;