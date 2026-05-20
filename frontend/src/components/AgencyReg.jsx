import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/data";

const PROVINCE_OPTIONS = [
  "Koshi", "Madhesh", "Bagmati", "Gandaki",
  "Lumbini", "Karnali", "Sudurpashchim",
];

const AgencyReg = () => {
  const { setShowAgencyReg, api, userProfile } = useAppContext();
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    name:    userProfile?.name        ?? "",
    email:   userProfile?.email       ?? "",
    contact: userProfile?.phoneNumber ?? "",
    location: {
      province: userProfile?.province ?? "",
      district: userProfile?.district ?? "",
      city:     userProfile?.city     ?? "",
      tole:     userProfile?.tole     ?? "",
    },
    esewaId: "",
  });
  const [qrImage, setQrImage] = useState(null);
  const [qrPreview, setQrPreview] = useState("");
  const [loading, setLoading] = useState(false);

  // ─── File handler ──────────────────────────────────────────────────────────

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setQrImage(file);
    const reader = new FileReader();
    reader.onload = () => setQrPreview(reader.result);
    reader.readAsDataURL(file);
  };

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value },
    }));
  };

  const goToOtp = (email) => {
    localStorage.setItem("verifyEmail", email);
    navigate("/verify-otp", { state: { email, role: "owner" } });
    setShowAgencyReg(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!userData.esewaId.trim()) {
      toast.error("eSewa ID is required");
      return;
    }
    if (!qrImage) {
      toast.error("Please upload your eSewa QR Image");
      return;
    }

    setLoading(true);
    try {
      const { name, email, contact, location, esewaId } = userData;
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("contact", contact);
      formData.append("role", "owner");
      formData.append("location", JSON.stringify(location));
      formData.append("esewaId", esewaId);
      formData.append("qrImage", qrImage);   // multer field name stays "qrImage"

      const response = await api.post("/agency/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data?.success) {
        toast.success(response.data.message || "OTP sent to email. Please verify.");
        goToOtp(email);
      }
    } catch (error) {
      const status  = error.response?.status;
      const message = error.response?.data?.message ?? "Registration failed";

      if (status === 400 && message.includes("already has")) {
        toast.info("Agency already registered. Please verify the OTP sent to your email.");
        goToOtp(userData.email);
        return;
      }

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // ─── Shared styles ─────────────────────────────────────────────────────────
  const inputCls =
    "w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none " +
    "focus:ring-2 focus:ring-black/20 transition bg-slate-50 focus:bg-white";

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div
      onClick={() => setShowAgencyReg(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 overflow-y-auto"
    >
      <form
        onSubmit={handleRegister}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* Side image */}
        <img
          src={assets.createPrp}
          alt=""
          aria-hidden="true"
          className="hidden md:block md:w-1/2 object-cover"
        />

        {/* Form section */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 relative overflow-y-auto max-h-[90vh]">

          {/* Close button */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setShowAgencyReg(false)}
            className="absolute top-3 right-3 h-7 w-7 flex items-center justify-center cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-full shadow transition"
          >
            <img src={assets.close} alt="" className="h-4 w-4" />
          </button>

          <h3 className="text-xl sm:text-2xl font-bold mb-1 text-slate-800">
            Register Agency
          </h3>
          <p className="text-sm text-slate-500 mb-5">Fill in your agency details to get started.</p>

          <div className="flex flex-col gap-5">

            {/* Name + Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Owner Name *</label>
                <input
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Full name"
                  className={`${inputCls} mt-1`}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Contact *</label>
                <input
                  name="contact"
                  value={userData.contact}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Phone number"
                  className={`${inputCls} mt-1`}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Email *</label>
              <input
                name="email"
                value={userData.email}
                onChange={handleChange}
                type="email"
                placeholder="your@email.com"
                className={`${inputCls} mt-1`}
                required
              />
            </div>

            {/* Address */}
            <fieldset>
              <legend className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">Address</legend>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  name="province"
                  value={userData.location.province}
                  onChange={handleLocationChange}
                  className={inputCls}
                  required
                >
                  <option value="">Select Province</option>
                  {PROVINCE_OPTIONS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>

                <input type="text" name="district" placeholder="District"
                  value={userData.location.district} onChange={handleLocationChange}
                  className={inputCls} required />

                <input type="text" name="city" placeholder="City"
                  value={userData.location.city} onChange={handleLocationChange}
                  className={inputCls} required />

                <input type="text" name="tole" placeholder="Tole / Street"
                  value={userData.location.tole} onChange={handleLocationChange}
                  className={inputCls} />
              </div>
            </fieldset>

            {/* eSewa Payment Information */}
            <div className="border border-green-200 bg-green-50/40 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-green-600 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">e</span>
                </div>
                <h4 className="text-sm font-bold text-green-800">eSewa Payment Information</h4>
              </div>

              <div className="flex flex-col gap-4">
                {/* eSewa ID */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide">eSewa ID / Phone *</label>
                  <input
                    name="esewaId"
                    value={userData.esewaId}
                    onChange={handleChange}
                    type="text"
                    placeholder="e.g. 9807XXXXXX"
                    className={`${inputCls} mt-1`}
                    required
                  />
                  <p className="text-[11px] text-slate-400 mt-1">This will be shown to tenants for payment</p>
                </div>

                {/* eSewa QR Upload */}
                <div>
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wide block mb-2">eSewa QR Code *</label>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    <label className="flex-1 cursor-pointer w-full">
                      <div className={`border-2 border-dashed rounded-xl p-4 text-center transition ${
                        qrPreview
                          ? "border-green-400 bg-green-50"
                          : "border-slate-300 hover:border-green-400 hover:bg-green-50/30"
                      }`}>
                        <div className="text-2xl mb-1">📱</div>
                        <span className="text-xs text-slate-600 font-medium">
                          {qrPreview ? "Click to change QR" : "Click to upload eSewa QR"}
                        </span>
                        <p className="text-[11px] text-slate-400 mt-0.5">PNG, JPG (max 5MB)</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </div>
                    </label>

                    {/* Preview */}
                    {qrPreview && (
                      <div className="relative w-28 h-28 rounded-xl overflow-hidden border-2 border-green-200 bg-white shadow flex-shrink-0">
                        <img src={qrPreview} alt="QR Preview" className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => { setQrImage(null); setQrPreview(""); }}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow hover:bg-red-600 transition"
                        >
                          ×
                        </button>
                        <div className="absolute bottom-0 inset-x-0 bg-green-600/80 text-white text-[9px] text-center py-0.5 font-semibold">
                          eSewa QR
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Processing…" : "Register Agency"}
            </button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default AgencyReg;