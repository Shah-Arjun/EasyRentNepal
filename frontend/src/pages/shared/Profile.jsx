import React, { useState, useEffect, useRef } from 'react'
import { useAppContext } from '../../context/AppContext'
import { getActiveRole } from '../../utils/authRole'
import { toast } from 'react-toastify'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Save,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  CheckCircle,
  Shield,
} from 'lucide-react'

const PROVINCES = [
  'Koshi', 'Madhesh', 'Bagmati', 'Gandaki',
  'Lumbini', 'Karnali', 'Sudurpashchim',
]

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'U'
  return parts.slice(0, 2).map(p => p[0]).join('').toUpperCase()
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({ title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50/60">
        <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
          <Icon size={16} className="text-secondary" />
        </div>
        <h2 className="font-bold text-slate-800 text-sm">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function InputField({ label, id, type = 'text', value, onChange, placeholder, error, required, rightEl }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full px-3.5 py-2.5 rounded-xl border text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 transition ${
            error
              ? 'border-red-300 focus:ring-red-200'
              : 'border-slate-200 focus:ring-secondary/30 focus:border-secondary'
          }`}
        />
        {rightEl && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightEl}</div>
        )}
      </div>
      {error && <p className="text-xs text-red-500 mt-0.5">{error}</p>}
    </div>
  )
}

function SelectField({ label, id, value, onChange, options, placeholder }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary transition appearance-none"
      >
        <option value="">{placeholder || `Select ${label}`}</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Profile() {
  const { userProfile, profileServices, getUserProfile } = useAppContext()

  // ── Profile form state ────────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: '', email: '', phoneNumber: '',
    province: '', district: '', city: '', tole: '',
  })
  const [formErrors, setFormErrors] = useState({})
  const [profileSaving, setProfileSaving] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState(false)

  // ── Avatar state ──────────────────────────────────────────────────────────
  const [avatarPreview, setAvatarPreview] = useState('')
  const [pendingImage, setPendingImage] = useState(null)   // { url: base64 }
  const [avatarSaving, setAvatarSaving] = useState(false)
  const fileInputRef = useRef(null)

  // ── Password form state ───────────────────────────────────────────────────
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [pwErrors, setPwErrors] = useState({})
  const [showPw, setShowPw] = useState({ current: false, newPw: false, confirm: false })
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSuccess, setPwSuccess] = useState(false)

  // ── Sync userProfile → form ───────────────────────────────────────────────
  useEffect(() => {
    if (!userProfile) return
    setForm({
      name:        userProfile.name        || '',
      email:       userProfile.email       || '',
      phoneNumber: userProfile.phoneNumber || userProfile.phone || '',
      province:    userProfile.location?.province || '',
      district:    userProfile.location?.district || '',
      city:        userProfile.location?.city     || '',
      tole:        userProfile.location?.tole     || '',
    })
    setAvatarPreview(
      userProfile?.profileImage?.url || userProfile?.profileImage || ''
    )
  }, [userProfile])

  const activeRole = getActiveRole(userProfile)

  // ── Avatar handlers ───────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2 MB')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setAvatarPreview(reader.result)
      setPendingImage({ url: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarSave = async () => {
    if (!pendingImage) return
    setAvatarSaving(true)
    try {
      const res = await profileServices.updateProfile({ profileImage: pendingImage })
      if (res?.success) {
        await getUserProfile()
        setPendingImage(null)
        toast.success('Profile photo updated!')
      } else {
        toast.error(res?.message || 'Failed to update photo')
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong')
    } finally {
      setAvatarSaving(false)
    }
  }

  // ── Profile form handlers ─────────────────────────────────────────────────
  const validateProfile = () => {
    const errors = {}
    if (!form.name.trim()) errors.name = 'Name is required'
    if (!form.email.trim()) errors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'Invalid email'
    if (form.phoneNumber && !/^\+?[\d\s-]{7,15}$/.test(form.phoneNumber))
      errors.phoneNumber = 'Invalid phone number'
    return errors
  }

  const handleProfileSave = async (e) => {
    e.preventDefault()
    const errors = validateProfile()
    if (Object.keys(errors).length) { setFormErrors(errors); return }
    setFormErrors({})
    setProfileSaving(true)
    setProfileSuccess(false)
    try {
      const payload = {
        name:        form.name.trim(),
        email:       form.email.trim(),
        phoneNumber: form.phoneNumber.trim(),
        location: {
          province: form.province,
          district: form.district.trim(),
          city:     form.city.trim(),
          tole:     form.tole.trim(),
        },
      }
      const res = await profileServices.updateProfile(payload)
      if (res?.success) {
        await getUserProfile()
        setProfileSuccess(true)
        toast.success('Profile updated successfully!')
        setTimeout(() => setProfileSuccess(false), 3000)
      } else {
        toast.error(res?.message || 'Failed to update profile')
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong')
    } finally {
      setProfileSaving(false)
    }
  }

  // ── Password handlers ─────────────────────────────────────────────────────
  const validatePw = () => {
    const errors = {}
    if (!pwForm.currentPassword) errors.currentPassword = 'Current password is required'
    if (!pwForm.newPassword) errors.newPassword = 'New password is required'
    else if (pwForm.newPassword.length < 8) errors.newPassword = 'Minimum 8 characters'
    if (!pwForm.confirmPassword) errors.confirmPassword = 'Please confirm your password'
    else if (pwForm.newPassword !== pwForm.confirmPassword)
      errors.confirmPassword = 'Passwords do not match'
    return errors
  }

  const handlePasswordSave = async (e) => {
    e.preventDefault()
    const errors = validatePw()
    if (Object.keys(errors).length) { setPwErrors(errors); return }
    setPwErrors({})
    setPwSaving(true)
    setPwSuccess(false)
    try {
      const res = await profileServices.updatePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      })
      if (res?.success) {
        setPwSuccess(true)
        setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
        toast.success('Password changed successfully!')
        setTimeout(() => setPwSuccess(false), 3000)
      } else {
        toast.error(res?.message || 'Failed to change password')
      }
    } catch (err) {
      toast.error(err?.message || 'Something went wrong')
    } finally {
      setPwSaving(false)
    }
  }

  const f = (field) => (e) => setForm(p => ({ ...p, [field]: e.target.value }))
  const pw = (field) => (e) => setPwForm(p => ({ ...p, [field]: e.target.value }))
  const togglePw = (key) => setShowPw(p => ({ ...p, [key]: !p[key] }))

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">

      {/* ── Page header ────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage your account information and preferences.
        </p>
      </div>

      {/* ── Avatar card ────────────────────────────────────────────────── */}
      <SectionCard title="Profile Photo" icon={Camera}>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Avatar preview */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-secondary to-amber-400 overflow-hidden shadow-lg flex items-center justify-center text-white text-3xl font-bold">
              {avatarPreview ? (
                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span>{getInitials(form.name || 'User')}</span>
              )}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-secondary text-slate-900 flex items-center justify-center shadow-md hover:bg-amber-400 transition"
              title="Change photo"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          {/* Info + actions */}
          <div className="flex-1 text-center sm:text-left">
            <p className="font-bold text-slate-800 text-lg">{form.name || 'User'}</p>
            <p className="text-slate-500 text-sm">{form.email}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full bg-secondary/20 text-secondary font-semibold text-xs capitalize">
              {activeRole}
            </span>
            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 text-sm font-medium hover:bg-slate-100 transition"
              >
                Choose Photo
              </button>
              {pendingImage && (
                <button
                  type="button"
                  onClick={handleAvatarSave}
                  disabled={avatarSaving}
                  className="px-4 py-2 rounded-xl bg-secondary text-slate-900 text-sm font-semibold hover:bg-amber-400 transition flex items-center gap-2 disabled:opacity-60"
                >
                  {avatarSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                  Save Photo
                </button>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-2">Max 2 MB · JPG, PNG, WebP</p>
          </div>
        </div>
      </SectionCard>

      {/* ── Personal info ──────────────────────────────────────────────── */}
      <SectionCard title="Personal Information" icon={User}>
        <form onSubmit={handleProfileSave} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Full Name" id="name" value={form.name}
              onChange={f('name')} placeholder="Your full name"
              error={formErrors.name} required
            />
            <InputField
              label="Email Address" id="email" type="email" value={form.email}
              onChange={f('email')} placeholder="your@email.com"
              error={formErrors.email} required
            />
            <InputField
              label="Phone Number" id="phoneNumber" value={form.phoneNumber}
              onChange={f('phoneNumber')} placeholder="+977 98XXXXXXXX"
              error={formErrors.phoneNumber}
            />
            {/* Role display (read-only) */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                <Shield size={11} /> Role
              </label>
              <div className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-sm text-slate-600 capitalize font-medium">
                {activeRole}
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="mt-5">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
              <MapPin size={12} /> Location
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField
                label="Province" id="province"
                value={form.province} onChange={f('province')}
                options={PROVINCES} placeholder="Select province"
              />
              <InputField
                label="District" id="district" value={form.district}
                onChange={f('district')} placeholder="e.g. Kathmandu"
              />
              <InputField
                label="City" id="city" value={form.city}
                onChange={f('city')} placeholder="e.g. Lalitpur"
              />
              <InputField
                label="Tole / Street" id="tole" value={form.tole}
                onChange={f('tole')} placeholder="e.g. Pulchowk"
              />
            </div>
          </div>

          {/* Save button */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={profileSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary text-slate-900 font-semibold text-sm hover:bg-amber-400 transition disabled:opacity-60"
            >
              {profileSaving
                ? <Loader2 size={16} className="animate-spin" />
                : profileSuccess
                  ? <CheckCircle size={16} className="text-green-600" />
                  : <Save size={16} />
              }
              {profileSaving ? 'Saving…' : profileSuccess ? 'Saved!' : 'Save Changes'}
            </button>
            {profileSuccess && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <CheckCircle size={14} /> Changes saved successfully
              </span>
            )}
          </div>
        </form>
      </SectionCard>

      {/* ── Change password ────────────────────────────────────────────── */}
      <SectionCard title="Change Password" icon={Lock}>
        <form onSubmit={handlePasswordSave} noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <InputField
                label="Current Password" id="currentPassword"
                type={showPw.current ? 'text' : 'password'}
                value={pwForm.currentPassword}
                onChange={pw('currentPassword')}
                placeholder="Enter current password"
                error={pwErrors.currentPassword}
                required
                rightEl={
                  <button type="button" onClick={() => togglePw('current')}
                    className="text-slate-400 hover:text-slate-600 transition">
                    {showPw.current ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                }
              />
            </div>
            <InputField
              label="New Password" id="newPassword"
              type={showPw.newPw ? 'text' : 'password'}
              value={pwForm.newPassword}
              onChange={pw('newPassword')}
              placeholder="Min. 8 characters"
              error={pwErrors.newPassword}
              required
              rightEl={
                <button type="button" onClick={() => togglePw('newPw')}
                  className="text-slate-400 hover:text-slate-600 transition">
                  {showPw.newPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />
            <InputField
              label="Confirm New Password" id="confirmPassword"
              type={showPw.confirm ? 'text' : 'password'}
              value={pwForm.confirmPassword}
              onChange={pw('confirmPassword')}
              placeholder="Re-enter new password"
              error={pwErrors.confirmPassword}
              required
              rightEl={
                <button type="button" onClick={() => togglePw('confirm')}
                  className="text-slate-400 hover:text-slate-600 transition">
                  {showPw.confirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              }
            />
          </div>

          {/* Password strength hint */}
          {pwForm.newPassword && (
            <div className="mt-3 flex gap-1.5">
              {[...Array(4)].map((_, i) => {
                const strength = [8, 12, 16, 20]
                const filled = pwForm.newPassword.length >= strength[i]
                return (
                  <div key={i}
                    className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      filled
                        ? i < 1 ? 'bg-red-400' : i < 2 ? 'bg-amber-400' : i < 3 ? 'bg-yellow-400' : 'bg-green-400'
                        : 'bg-slate-200'
                    }`}
                  />
                )
              })}
            </div>
          )}

          <div className="mt-6 flex items-center gap-3">
            <button
              type="submit"
              disabled={pwSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-secondary text-slate-900 font-semibold text-sm hover:bg-amber-400 transition disabled:opacity-60"
            >
              {pwSaving
                ? <Loader2 size={16} className="animate-spin" />
                : pwSuccess
                  ? <CheckCircle size={16} className="text-green-600" />
                  : <Lock size={16} />
              }
              {pwSaving ? 'Changing…' : pwSuccess ? 'Changed!' : 'Change Password'}
            </button>
            {pwSuccess && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <CheckCircle size={14} /> Password updated
              </span>
            )}
          </div>
        </form>
      </SectionCard>

      {/* ── Read-only account info ─────────────────────────────────────── */}
      <SectionCard title="Account Details" icon={Shield}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'User ID',    value: userProfile?._id || 'EPN-001' },
            { label: 'Joined',     value: userProfile?.createdAt ? new Date(userProfile.createdAt).toLocaleDateString() : 'N/A' },
            { label: 'Account Status', value: userProfile?.isOtpVerified ? '✅ Active' : '❌ Not active' },
            { label: 'Full Address', value: [
                userProfile?.location?.tole, userProfile?.location?.city,
                userProfile?.location?.district, userProfile?.location?.province
              ].filter(Boolean).join(', ') || 'N/A'
            },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{label}</p>
              <p className="text-sm font-semibold text-slate-700 break-all">{value}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
