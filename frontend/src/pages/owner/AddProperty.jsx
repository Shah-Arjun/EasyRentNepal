import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAxios from '../../hooks/useAxios';

const provinceEnum = [
  "Koshi Pradesh",
  "Madhesh Pradesh",
  "Bagmati Pradesh",
  "Gandaki Pradesh",
  "Lumbini Pradesh",
  "Karnali Pradesh",
  "Sudurpashchim Pradesh",
];

const categories = ["House", "Land", "Apartment", "Flat", "Office", "Room", "Shutter/Shop"];
const listingTypes = ["Rent"];
const parkingOptions = ['Motorcycle', 'Car 1', 'Car 2', 'Cars 3-5', 'Cars 5-10', 'Cars 10-15', 'None'];
const furnishedStatuses = ['unfurnished', 'semi-furnished', 'fully-furnished'];
const facingOptions = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'];
const builtAreaUnits = ['sqft', 'aana', 'ropani', 'paisa', 'dam', 'haath', 'feet', 'sqm', 'other'];
const landAreaUnits = ['aana', 'ropani', 'paisa', 'dam', 'sqft', 'sqm', 'haath', 'dhur', 'kattha', 'bigha'];
const currencies = ['NPR'];
const perUnits = ['total', 'per aana', 'per ropani', 'per sqft', 'per dhur', 'per kattha', 'per bigha', 'per month', 'per year'];
const bathroomTypes = ['attached', 'shared'];
const directionOptions = ['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West', 'Other'];
const suggestedAmenities = ['WiFi', 'Water Supply (24/7)', 'Electricity', 'Air Conditioning', 'Gym', 'Swimming Pool', 'Security', 'Elevator', 'Garden', 'Balcony', 'Parking', 'Heating'];
const MAX_TOTAL_IMAGE_SIZE = 25 * 1024 * 1024;

// Component definitions - moved outside to prevent recreation on every render
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

const Input = (props) => (
  <input
    {...props}
    className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-secondary focus:border-secondary transition-all outline-none text-black ${props.className || ''}`}
  />
);

const Select = (props) => (
  <select
    {...props}
    className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 bg-white focus:bg-white focus:ring-2 focus:ring-secondary focus:border-secondary transition-all outline-none text-black ${props.className || ''}`}
  >
    {props.children}
  </select>
);

const AddProperty = () => {
  const navigate = useNavigate();
  const api = useAxios();
  const fileInputRef = useRef(null);
  const dropZoneRef = useRef(null);
  
  const [formData, setFormData] = useState({
    title: '',
    category: 'Room',
    listingType: 'Rent',
    noOfFlat: '',
    bedrooms: '',
    bathrooms: '',
    bathroomType: 'shared',
    bedCount: 1,
    living: '',
    kitchen: '',
    parking: 'None',
    furnishedStatus: 'unfurnished',
    builtYear: '',
    builtArea: { value: '', unit: 'sqft' },
    landArea: { value: '', unit: 'dhur' },
    facing: '',
    price: { value: '', currency: 'NPR', perUnit: 'per month' },
    location: { province: '', district: '', municipality: '', tole: '', wardNo: '' },
    direction: '',
    roadSize: { value: '', unit: 'ft' },
    fullDescription: '',
    images: [],
    videoUrl: '',
    amenities: [],
  });

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData({
      ...formData,
      [parent]: {
        ...formData[parent],
        [field]: value
      }
    });
  };

  const handleAmenityToggle = (amenity) => {
    if (formData.amenities.includes(amenity)) {
      setFormData({
        ...formData,
        amenities: formData.amenities.filter(a => a !== amenity)
      });
    } else {
      setFormData({
        ...formData,
        amenities: [...formData.amenities, amenity]
      });
    }
  };

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleImageChange = async (files) => {
    setError('');
    const fileArray = Array.from(files);

    const currentTotalSize = formData.images.reduce((sum, img) => sum + (img.size || 0), 0);
    const incomingTotalSize = fileArray.reduce((sum, file) => sum + file.size, 0);

    if (currentTotalSize + incomingTotalSize > MAX_TOTAL_IMAGE_SIZE) {
      setError('Total image size must be less than 25MB');
      return;
    }
    
    // Validate file count
    if (formData.images.length + fileArray.length > 10) {
      setError('Maximum 10 images allowed');
      return;
    }

    // Validate and convert files
    const newImages = [];
    for (const file of fileArray) {
      // Check file size (5MB per file)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Only image files are allowed');
        return;
      }

      try {
        const base64 = await convertFileToBase64(file);
        newImages.push({
          name: file.name,
          data: base64,
          size: file.size
        });
      } catch (err) {
        setError('Error processing image');
        console.log("Error processing image", err)
        return;
      }
    }

    setFormData({
      ...formData,
      images: [...formData.images, ...newImages]
    });
  };

  const removeImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index)
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleImageChange(files);
    }
  };

  const validateStep = (stepIndex) => {
    setError('');
    
    switch(stepIndex) {
      case 0: // Basic Info & Pricing
        if (!formData.title.trim()) {
          setError('Property title is required');
          return false;
        }
        if (!formData.price.value) {
          setError('Price is required');
          return false;
        }
        return true;
        
      case 1: // Location
        if (!formData.location.province) {
          setError('Province is required');
          return false;
        }
        if (!formData.location.district.trim()) {
          setError('District is required');
          return false;
        }
        if (!formData.location.municipality.trim()) {
          setError('Municipality / Rural Municipality is required');
          return false;
        }
        return true;
        
      case 2: // Structure & Area
        // No required fields for this step
        return true;
        
      case 3: // Media & Description
        if (!formData.fullDescription.trim()) {
          setError('Property description is required');
          return false;
        }
        return true;
        
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateStep(activeTab)) {
      setActiveTab(Math.min(steps.length - 1, activeTab + 1));
    }
  };

  const handlePrevStep = () => {
    setActiveTab(Math.max(0, activeTab - 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Property title is required');
      setActiveTab(0);
      return;
    }

    if (!formData.price.value) {
      setError('Price is required');
      setActiveTab(0);
      return;
    }

    if (!formData.location.province || !formData.location.district || !formData.location.municipality) {
      setError('Complete location details are required');
      setActiveTab(1);
      return;
    }

    if (!formData.fullDescription.trim()) {
      setError('Property description is required');
      setActiveTab(3);
      return;
    }

    setLoading(true);

    try {
      // Convert images to proper format for backend
      const formattedImages = formData.images.length > 0 
        ? formData.images.map((img, index) => ({
            url: img.data, // base64 data URL
            isPrimary: index === 0 // first image is primary
          }))
        : []; // empty array if no images - backend will use default

      const submitData = {
        ...formData,
        images: formattedImages,
        // Ensure numeric fields are actual numbers
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : undefined,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : undefined,
        living: formData.living ? parseInt(formData.living) : undefined,
        kitchen: formData.kitchen ? parseInt(formData.kitchen) : undefined,
        noOfFlat: formData.noOfFlat ? parseInt(formData.noOfFlat) : undefined,
        bedCount: parseInt(formData.bedCount),
        builtYear: formData.builtYear ? parseInt(formData.builtYear) : undefined,
        builtArea: {
          value: formData.builtArea.value ? parseInt(formData.builtArea.value) : undefined,
          unit: formData.builtArea.unit
        },
        landArea: {
          value: formData.landArea.value ? parseInt(formData.landArea.value) : undefined,
          unit: formData.landArea.unit
        },
        price: {
          value: parseFloat(formData.price.value),
          currency: formData.price.currency,
          perUnit: formData.price.perUnit
        },
        roadSize: {
          value: formData.roadSize.value ? parseInt(formData.roadSize.value) : undefined,
          unit: formData.roadSize.unit
        }
      };

      const response = await api.post('/property/addProperty', submitData);
      
      if (response.data.success) {
        alert('Property listed successfully!');
        // Redirect to list property page
        navigate('/owner/list-property');
      }
    } catch (err) {
      console.error('Submission error:', err);
      const errorMsg =
        err.response?.data?.message ||
        (err.response?.status === 413 ? 'Images are too large. Reduce image size/count and try again.' : '') ||
        err.message ||
        'Error submitting property. Please try again.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { title: "Basic", id: 0 },
    { title: "Location", id: 1 },
    { title: "Structure", id: 2 },
    { title: "Media", id: 3 },
  ];

  return (
    <div className="w-full p-8">
      <div className="text-center mb-10">
        <h1 className="h1 text-black mb-2">List Your Property</h1>
        <p className="text-gray-50">Fill in the details to publish your listing to thousands of seekers.</p>
      </div>

        {/* Progress Tracker */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-gray-200 w-full z-0 rounded-full"></div>
          <div 
            className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-secondary z-0 rounded-full transition-all duration-300" 
            style={{ width: `${(activeTab / (steps.length - 1)) * 100}%` }}>
          </div>
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              onClick={() => setActiveTab(step.id)}
              className={`relative z-10 flex flex-col items-center cursor-pointer`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-[14px] transition-all duration-300 ${activeTab >= index ? 'bg-secondary text-black shadow-lg shadow-tertiary/50' : 'bg-white text-gray-400 border-2 border-gray-200'}`}>
                {index + 1}
              </div>
              <span className={`absolute -bottom-6 text-[13px] font-[500] whitespace-nowrap transition-colors ${activeTab >= index ? 'text-black' : 'text-gray-400'}`}>
                {step.title}
              </span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-12 border border-gray-100 p-8 sm:p-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 text-[14px]">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* TAB 0: Basic & Pricing */}
            <div className={activeTab === 0 ? 'block space-y-8 animate-in fade-in duration-500' : 'hidden'}>
              <SectionTitle title="Basic Information" subtitle="Let's start with the essentials about your property." />
              
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
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </Select>
                </div>

                <div>
                  <Label required>Listing Type</Label>
                  <div className="flex gap-4">
                    {listingTypes.map(type => (
                      <label key={type} className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all ${formData.listingType === type ? 'border-secondary bg-tertiary/20 text-black font-[500]' : 'border-gray-200 text-gray-50 hover:bg-primary'}`}>
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

              <div className="mt-8">
                <SectionTitle title="Pricing Strategy" subtitle="Set a competitive price for your property." />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label required>Price Value</Label>
                    <Input
                      type="number"
                      min="0"
                      value={formData.price.value}
                      onChange={(e) => handleNestedChange('price', 'value', e.target.value)}
                      placeholder="e.g., 25000"
                    />
                  </div>
                  <div>
                    <Label>Currency</Label>
                    <Select
                      value={formData.price.currency}
                      onChange={(e) => handleNestedChange('price', 'currency', e.target.value)}
                    >
                      {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label>Per Unit</Label>
                    <Select
                      value={formData.price.perUnit}
                      onChange={(e) => handleNestedChange('price', 'perUnit', e.target.value)}
                    >
                      {perUnits.map(u => <option key={u} value={u}>{u}</option>)}
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 1: Location */}
            <div className={activeTab === 1 ? 'block space-y-8 animate-in fade-in duration-500' : 'hidden'}>
              <SectionTitle title="Property Location" subtitle="Where exactly is this property located?" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label required>Province</Label>
                  <Select
                    value={formData.location.province}
                    onChange={(e) => handleNestedChange('location', 'province', e.target.value)}
                  >
                    <option value="" disabled>Select Province</option>
                    {provinceEnum.map(p => <option key={p} value={p}>{p}</option>)}
                  </Select>
                </div>
                <div>
                  <Label required>District</Label>
                  <Input
                    type="text"
                    value={formData.location.district}
                    onChange={(e) => handleNestedChange('location', 'district', e.target.value)}
                    placeholder="e.g., Kathmandu"
                  />
                </div>
                <div>
                  <Label required>Municipality / Rural Municipality</Label>
                  <Input
                    type="text"
                    value={formData.location.municipality}
                    onChange={(e) => handleNestedChange('location', 'municipality', e.target.value)}
                    placeholder="e.g., Kathmandu Metropolitan"
                  />
                </div>
                <div>
                  <Label>Tole / Local Area</Label>
                  <Input
                    type="text"
                    value={formData.location.tole}
                    onChange={(e) => handleNestedChange('location', 'tole', e.target.value)}
                    placeholder="e.g., Baneshwor"
                  />
                </div>
                <div>
                  <Label>Ward No.</Label>
                  <Input
                    type="number"
                    min="1" max="35"
                    value={formData.location.wardNo}
                    onChange={(e) => handleNestedChange('location', 'wardNo', e.target.value)}
                    placeholder="e.g., 10"
                  />
                </div>
                
                <div className="col-span-1 md:col-span-2 mt-4 pt-6 border-t border-gray-100">
                  <h3 className="h4 text-black mb-4">Road Access</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <Label>Road Direction</Label>
                      <Select value={formData.direction} name="direction" onChange={handleInputChange}>
                        <option value="">Select Direction</option>
                        {directionOptions.map(d => <option key={d} value={d}>{d}</option>)}
                      </Select>
                    </div>
                    <div>
                      <Label>Road Size</Label>
                      <Input
                        type="number"
                        min="0"
                        value={formData.roadSize.value}
                        onChange={(e) => handleNestedChange('roadSize', 'value', e.target.value)}
                        placeholder="e.g., 13"
                      />
                    </div>
                    <div>
                      <Label>Road Unit</Label>
                      <Select
                        value={formData.roadSize.unit}
                        onChange={(e) => handleNestedChange('roadSize', 'unit', e.target.value)}
                      >
                        <option value="ft">Feet (ft)</option>
                        <option value="m">Meters (m)</option>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 2: Structure & Area */}
            <div className={activeTab === 2 ? 'block space-y-8 animate-in fade-in duration-500' : 'hidden'}>
              <SectionTitle title="Structure & Layout" subtitle="Tell us about the physical attributes of the property." />
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div><Label>Bedrooms</Label><Input type="number" min="0" name="bedrooms" value={formData.bedrooms} onChange={handleInputChange} /></div>
                <div><Label>Bathrooms</Label><Input type="number" min="0" name="bathrooms" value={formData.bathrooms} onChange={handleInputChange} /></div>
                <div><Label>Living Rooms</Label><Input type="number" min="0" name="living" value={formData.living} onChange={handleInputChange} /></div>
                <div><Label>Kitchens</Label><Input type="number" min="0" name="kitchen" value={formData.kitchen} onChange={handleInputChange} /></div>
                
                <div>
                  <Label>Bathroom Type</Label>
                  <Select name="bathroomType" value={formData.bathroomType} onChange={handleInputChange}>
                    {bathroomTypes.map(t => <option key={t} value={t}>{t}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>No. of Flats</Label>
                  <Input type="number" min="0" name="noOfFlat" value={formData.noOfFlat} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Bed Count</Label>
                  <Input type="number" min="1" name="bedCount" value={formData.bedCount} onChange={handleInputChange} />
                </div>
                <div>
                  <Label>Furnishing</Label>
                  <Select name="furnishedStatus" value={formData.furnishedStatus} onChange={handleInputChange}>
                    {furnishedStatuses.map(s => <option key={s} value={s}>{s}</option>)}
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
                        type="number"
                        min="0"
                        value={formData.builtArea.value}
                        onChange={(e) => handleNestedChange('builtArea', 'value', e.target.value)}
                        placeholder="Value"
                        className="w-2/3"
                      />
                      <Select
                        value={formData.builtArea.unit}
                        onChange={(e) => handleNestedChange('builtArea', 'unit', e.target.value)}
                        className="w-1/3"
                      >
                        {builtAreaUnits.map(u => <option key={u} value={u}>{u}</option>)}
                      </Select>
                    </div>
                  </div>
                  
                  <div className="bg-primary p-5 rounded-xl border border-gray-100">
                    <Label>Land Area</Label>
                    <div className="flex gap-4 mt-2">
                      <Input
                        type="number"
                        min="0"
                        value={formData.landArea.value}
                        onChange={(e) => handleNestedChange('landArea', 'value', e.target.value)}
                        placeholder="Value"
                        className="w-2/3"
                      />
                      <Select
                        value={formData.landArea.unit}
                        onChange={(e) => handleNestedChange('landArea', 'unit', e.target.value)}
                        className="w-1/3"
                      >
                        {landAreaUnits.map(u => <option key={u} value={u}>{u}</option>)}
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
                      max={new Date().getFullYear() + 5}
                      name="builtYear"
                      value={formData.builtYear}
                      onChange={handleInputChange}
                      placeholder="YYYY"
                    />
                  </div>
                  <div>
                    <Label>Parking</Label>
                    <Select name="parking" value={formData.parking} onChange={handleInputChange}>
                      {parkingOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </Select>
                  </div>
                  <div>
                    <Label>Property Facing</Label>
                    <Select name="facing" value={formData.facing} onChange={handleInputChange}>
                      <option value="">Select Direction</option>
                      {facingOptions.map(f => <option key={f} value={f}>{f}</option>)}
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB 3: Features & Media */}
            <div className={activeTab === 3 ? 'block space-y-8 animate-in fade-in duration-500' : 'hidden'}>
              <SectionTitle title="Description & Amenities" subtitle="Highlight what makes this property special." />
              
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
                ></textarea>
                <div className="text-right mt-1 text-[13px] text-gray-400">
                  {formData.fullDescription.length} / 5000 chars
                </div>
              </div>

              <div>
                <Label>Amenities Available</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-3">
                  {suggestedAmenities.map(amenity => (
                    <label key={amenity} className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer border transition-colors ${formData.amenities.includes(amenity) ? 'border-secondary bg-tertiary/20 text-black' : 'border-gray-200 hover:border-gray-300 bg-white'}`}>
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
                 <SectionTitle title="Media" subtitle="Upload visuals of your property to attract more views." />
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <Label>Property Images</Label>
                      <div 
                        ref={dropZoneRef}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                        className={`mt-2 flex justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors cursor-pointer ${dragActive ? 'border-secondary bg-tertiary/20' : 'border-gray-300 hover:border-secondary hover:bg-tertiary/10'} bg-primary`}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <div className="text-center w-full">
                          <svg className="mx-auto h-12 w-12 text-gray-300" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 012.25-2.25h16.5A2.25 2.25 0 0122.5 6v12a2.25 2.25 0 01-2.25 2.25H3.75A2.25 2.25 0 011.5 18V6zM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0021 18v-1.94l-2.69-2.689a1.5 1.5 0 00-2.12 0l-.88.879.97.97a.75.75 0 11-1.06 1.06l-5.16-5.159a1.5 1.5 0 00-2.12 0L3 16.061zm10.125-7.81a1.125 1.125 0 112.25 0 1.125 1.125 0 01-2.25 0z" clipRule="evenodd" />
                          </svg>
                          <div className="mt-4 flex text-[14px] leading-6 justify-center">
                            <span className="relative rounded-md bg-transparent font-[500] text-black hover:text-secondary focus-within:outline-none focus:ring-2 focus:ring-secondary transition-colors">
                              <span>Upload files</span>
                              <input 
                                ref={fileInputRef}
                                id="file-upload" 
                                name="file-upload" 
                                type="file" 
                                className="sr-only" 
                                multiple 
                                accept="image/*"
                                onChange={(e) => handleImageChange(e.target.files)}
                              />
                            </span>
                            <p className="pl-1 text-gray-50">or drag and drop</p>
                          </div>
                          <p className="text-[13px] leading-5 text-gray-400">PNG, JPG, GIF up to 5MB each (Max 10 images)</p>
                          <p className="text-[12px] leading-5 text-gray-400 mt-2">{formData.images.length}/10 images added</p>
                        </div>
                      </div>

                      {/* Image Previews */}
                      {formData.images.length > 0 && (
                        <div className="mt-6 grid grid-cols-3 gap-4">
                          {formData.images.map((image, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={image.data} 
                                alt={`Preview ${index + 1}`}
                                className="w-full h-32 object-cover rounded-lg border border-gray-200"
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div>
                      <Label>Youtube/Video URL</Label>
                      <Input
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                        placeholder="https://youtube.com/watch?v=..."
                        className="mt-2"
                      />
                      <p className="mt-2 text-[13px] text-gray-50">Add a virtual tour or video walkthrough link if you have one.</p>
                      
                      {formData.videoUrl && (
                        <div className="mt-4 p-4 rounded-xl bg-primary border border-gray-200 text-[14px] text-center text-gray-50 overflow-hidden text-ellipsis">
                          Video Linked: <a href={formData.videoUrl} target="_blank" rel="noreferrer" className="text-secondary hover:underline">{formData.videoUrl}</a>
                        </div>
                      )}
                    </div>
                 </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="pt-8 mt-8 border-t border-gray-200 flex justify-between items-center">
              <button
                type="button"
                onClick={handlePrevStep}
                disabled={activeTab === 0}
                className={`px-6 py-2.5 rounded-full text-[14px] font-[500] transition-all ${activeTab === 0 ? 'bg-primary text-gray-400 cursor-not-allowed' : 'btn-outline'}`}
              >
                Back
              </button>

              {activeTab < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="btn-dark flex items-center gap-2"
                >
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
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    'Submit Listing'
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
