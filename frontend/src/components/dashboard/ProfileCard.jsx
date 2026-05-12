import React from 'react'
import { getActiveRole } from '../../utils/authRole'

const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  return parts.slice(0, 2).map(part => part[0]).join('').toUpperCase()
}

const formatDate = (value) => {
  if (!value) return 'N/A'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? 'N/A' : date.toLocaleDateString()
}

const ProfileCard = ({ user, title = 'Profile', onEdit }) => {
  const fullName = user?.name || 'User'
  const email = user?.email || 'N/A'
  const phoneNumber = user?.phoneNumber || user?.phone || 'N/A'
  const role = getActiveRole(user)
  const profileImage = user?.profileImage?.url || user?.profileImage || ''
  const joinedDate = user?.joinedDate || user?.createdAt
  const address = user?.fullAddress || [user?.location?.tole, user?.location?.city, user?.location?.district, user?.location?.province].filter(Boolean).join(', ') || 'N/A'

  return (
    <section className="rounded-3xl border border-slate-100 bg-white/90 shadow-[0_12px_40px_rgba(15,23,42,0.08)] backdrop-blur p-5 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-linear-to-br from-secondary to-blue-500 overflow-hidden flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-secondary/25">
            {profileImage ? (
              <img src={profileImage} alt={fullName} className="h-full w-full object-cover" />
            ) : (
              <span>{getInitials(fullName)}</span>
            )}
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-secondary/80">{title}</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">{fullName}</h2>
            <p className="text-sm text-slate-500">Joined {formatDate(joinedDate)}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          Edit Profile
        </button>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <InfoItem label="Full Name" value={fullName} />
        <InfoItem label="Email" value={email} />
        <InfoItem label="Phone" value={phoneNumber} />
        <InfoItem label="Role" value={role} capitalize />
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <InfoItem label="Joined Date" value={formatDate(joinedDate)} />
        <InfoItem label="Full Address" value={address} />
      </div>
    </section>
  )
}

const InfoItem = ({ label, value, capitalize = false }) => (
  <div className="rounded-2xl border border-slate-100 bg-slate-50/70 px-4 py-3">
    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
    <p className={`mt-1 text-sm font-semibold text-slate-800 ${capitalize ? 'capitalize' : ''}`}>{value || 'N/A'}</p>
  </div>
)

export default ProfileCard