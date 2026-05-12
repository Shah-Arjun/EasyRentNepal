import React, { useEffect, useRef, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import { assets } from '../../assets/data'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRightLeft, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { getActiveRole, normalizeRoles } from '../../utils/authRole'

const Sidebar = () => {
  const { userProfile, toggleRole, logout } = useAppContext()
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const profileMenuRef = useRef(null)
  const availableRoles = normalizeRoles(userProfile?.role)
  const activeRole = getActiveRole(userProfile)

  const navItems = [
    {
      path: '/owner',
      label: "Dashboard",
      icon: assets.dashboard
    },
    {
      path: '/owner/add-property',
      label: "Add Property",
      icon: assets.housePlus
    },
    {
      path: '/owner/list-property',
      label: "List Property",
      icon: assets.list
    },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    if (showProfileMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showProfileMenu])

  const handleSwitchToTenant = async () => {
    setShowProfileMenu(false)
    await toggleRole()
  }

  const handleLogout = async () => {
    setShowProfileMenu(false)
    await logout()
  }

  return (
    <div className='bg-linear-to-r from-[#fffbee] to-white'>
      <div className='mx-auto max-w-360 flex flex-col md:flex-row'>
        {/* Sidebar */}
        <div ref={profileMenuRef} className='max-md:flexCenter flex flex-col justify-between bg-white sm:m-3 md:min-w-[20%] md:min-h-[97vh] rounded-xl shadow'>
          <div className='flex flex-col gap-y-6 max-md:items-center md:flex-col md:pt-5'>
            {/* Logo and Profile */}
            <div className='w-full flex justify-between md:flex-col'>
              <div className='flex flex-1 p-3 lg:pl-8'>
                <Link to={'/'}>
                  <img src={assets.logoImg} alt="Logo" className='h-28 lg:h-36 w-auto object-contain' />
                </Link>
              </div>
              <div className='md:hidden flex items-center gap-3 md:bg-primary rounded-b-xl p-2 pl-5 lg:pl-10 md:mt-10 relative'>
                <button
                  onClick={() => setShowProfileMenu((prev) => !prev)}
                  className="w-11.25 h-11.25 bg-secondary text-white rounded-full flexCenter font-bold uppercase text-xl"
                >
                  {userProfile?.name ? userProfile.name.charAt(0) : 'U'}
                </button>
                <div className='text-sm font-semibold text-gray-800 capitalize'>
                  {userProfile?.name || 'User'}
                  <p className='text-xs text-slate-500 capitalize'>{activeRole}</p>
                </div>
                {showProfileMenu && (
                  <div className='absolute left-5 top-14 w-52 bg-white shadow-md rounded-md overflow-hidden z-50 ring-1 ring-slate-900/5'>
                    {availableRoles.includes('tenant') && (
                      <>
                        <button
                          onClick={handleSwitchToTenant}
                          className='w-full text-left px-4 py-3 text-sm hover:bg-slate-100 flex items-center gap-2'
                        >
                          <FontAwesomeIcon icon={faRightLeft} /> Switch to Tenant
                        </button>
                        <hr />
                      </>
                    )}
                    <button
                      onClick={handleLogout}
                      className='w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-slate-100 font-medium flex items-center gap-2'
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className='flex md:flex-col md:gap-x-5 gap-y-8 md:mt-4'>
              {navItems.map(link => (
                <NavLink
                  key={link.label}
                  to={link.path}
                  end={link.path === '/owner'}
                  className={({ isActive }) => isActive ? "flexStart gap-x-2 p-5 lg:pl-12 bold-13 sm:text-sm! cursor-pointer h-10 bg-secondary/10 max-md:border-b-4 md:border-r-4 border-secondary" : "flexStart gap-x-2 lg:pl-12 p-5 bold-13 sm:text-sm! cursor-pointer h-10 rounded-xl"}
                >
                  <img src={link.icon} alt={link.label} className='hidden md:block' width={18} />
                  <div>{link.label}</div>
                </NavLink>
              ))}
            </div>
          </div>
          <div className='hidden md:flex items-center gap-3 md:bg-primary border-t border-slate-900/15 rounded-b-xl p-2 pl-5 lg:pl-10 md:mt-10 relative'>
            <button
              onClick={() => setShowProfileMenu((prev) => !prev)}
              className="w-11.25 h-11.25 bg-secondary text-white rounded-full flexCenter font-bold uppercase text-xl"
            >
              {userProfile?.name ? userProfile.name.charAt(0) : 'U'}
            </button>
            <div className='text-sm font-semibold text-gray-800 capitalize'>
              {userProfile?.name || 'User'}
              <p className='text-xs text-slate-500 capitalize'>{activeRole}</p>
            </div>
            {showProfileMenu && (
              <div className='absolute left-5 bottom-16 w-52 bg-white shadow-md rounded-md overflow-hidden z-50 ring-1 ring-slate-900/5'>
                {availableRoles.includes('tenant') && (
                  <>
                    <button
                      onClick={handleSwitchToTenant}
                      className='w-full text-left px-4 py-3 text-sm hover:bg-slate-100 flex items-center gap-2'
                    >
                      <FontAwesomeIcon icon={faRightLeft} /> Switch to Tenant
                    </button>
                    <hr />
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className='w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-slate-100 font-medium flex items-center gap-2'
                >
                  <FontAwesomeIcon icon={faSignOutAlt} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default Sidebar