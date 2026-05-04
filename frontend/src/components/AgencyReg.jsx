import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "../context/AppContext";
import { assets } from "../assets/data";

const PROVINCE_OPTIONS = [
  "Koshi",
  "Madhesh",
  "Bagmati",
  "Gandaki",
  "Lumbini",
  "Karnali",
  "Sudurpashchim",
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
  });
  const [loading, setLoading] = useState(false);

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

  /** Navigate to OTP page and close modal. */
  const goToOtp = (email) => {
    localStorage.setItem("verifyEmail", email);
    navigate("/verify-otp", { state: { email, role: "owner" } });
    setShowAgencyReg(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { name, email, contact, location } = userData;
      const response = await api.post("/agency/register", {
        name,
        email,
        contact,
        role: "owner",
        location,
      });

      if (response.data?.success) {
        toast.success(response.data.message || "OTP sent to email. Please verify.");
        goToOtp(email);
      }
    } catch (error) {
      const status  = error.response?.status;
      const message = error.response?.data?.message ?? "Registration failed";

      // Agency already registered → redirect to OTP verification
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

  // ─── Shared input class ────────────────────────────────────────────────────
  const inputCls = "w-full px-3 py-2 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-black/20 transition";

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      onClick={() => setShowAgencyReg(false)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4 py-6 overflow-y-auto"
    >
      <form
        onSubmit={handleRegister}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-5xl bg-white rounded-2xl shadow-xl flex flex-col md:flex-row overflow-hidden"
      >
        {/* Side image */}
        <img
          src={assets.createPrp}
          alt=""
          aria-hidden="true"
          className="hidden md:block md:w-1/2 object-cover"
        />

        {/* Form section */}
        <div className="w-full md:w-1/2 p-5 sm:p-6 md:p-8 relative">

          {/* Close button */}
          <button
            type="button"
            aria-label="Close"
            onClick={() => setShowAgencyReg(false)}
            className="absolute top-3 right-3 h-6 w-6 flex items-center justify-center cursor-pointer bg-secondary/50 rounded-full shadow-md hover:bg-secondary/80 transition"
          >
            <img src={assets.close} alt="" className="h-4 w-4" />
          </button>

          <h3 className="text-xl sm:text-2xl font-bold mb-5 text-slate-800">
            Register Agency
          </h3>

          <div className="flex flex-col gap-5">

            {/* Name + Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Owner Name</label>
                <input
                  name="name"
                  value={userData.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="Full name"
                  className={`${inputCls} mt-1 bg-secondary/10`}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Contact</label>
                <input
                  name="contact"
                  value={userData.contact}
                  onChange={handleChange}
                  type="tel"
                  placeholder="Phone number"
                  className={`${inputCls} mt-1 bg-secondary/10`}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                name="email"
                value={userData.email}
                onChange={handleChange}
                type="email"
                placeholder="your@email.com"
                className={`${inputCls} mt-1 bg-secondary/10`}
                required
              />
            </div>

            {/* Address */}
            <fieldset>
              <legend className="text-sm font-medium mb-2">Address</legend>
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

                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  value={userData.location.district}
                  onChange={handleLocationChange}
                  className={inputCls}
                  required
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={userData.location.city}
                  onChange={handleLocationChange}
                  className={inputCls}
                  required
                />

                <input
                  type="text"
                  name="tole"
                  placeholder="Tole"
                  value={userData.location.tole}
                  onChange={handleLocationChange}
                  className={inputCls}
                  required
                />
              </div>
            </fieldset>

            {/* Payment details placeholder */}
            <div>
              <label className="text-sm font-medium block mb-1">
                Payment Details
              </label>
              {/* TODO: add payment fields */}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-6 py-2.5 bg-black text-white rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Processing…" : "Register"}
            </button>

          </div>
        </div>
      </form>
    </div>
  );
};

export default AgencyReg;