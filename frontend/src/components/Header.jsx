import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/data";
import Navbar from "./Navbar";
import { useAppContext } from "../context/AppContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarCheck, faRightLeft, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { normalizeRoles } from "../utils/authRole";


const Header = () => {
  const [active, setActive] = useState(false);
  const [menuOpened, setMenuOpened] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  // const [showSearch, setShowSearch] = useState(false);
  const profileMenuRef = useRef(null);
  const location = useLocation();
  const { navigate, isOwner, isLoggedIn, userProfile, logout, toggleRole, agency, setShowAgencyReg } = useAppContext();
  const availableRoles = normalizeRoles(userProfile?.role)

  const handleLogout = () => {
    logout();
  };



  const toggleMenu = () => {
    setMenuOpened((prev) => !prev);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/") {
        setActive(window.scrollY > 10);
      } else {
        setActive(true); //always stay active on other pages
      }
      if (window.scrollY > 10) {
        setMenuOpened(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    //run once to set initial active state

    handleScroll();

    // Click outside handler for profile menu
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };

    if (showProfileMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [location.pathname, showProfileMenu]);

  return (
    <header
      className={`${active ? "bg-white py-3 shadow-md" : "py-4"} fixed top-0 w-full left-0 right-0 z-50 transition-all duration-200`}
    >
      <div className="max-padd-container">
        {/* Container */}
        <div className="flexBetween">
          {/* Logo */}
          <div className="flex flex-1">
            <Link to={"/"}>
              <img
                src={assets.logoDuplicate}
                alt="LogoImg"
                className={`${!active && "invert"} h-12`}
              />
            </Link>
          </div>
          {/* Navbar */}
          <Navbar
            setMenuOpened={setMenuOpened}
            containerStyles={`${menuOpened
              ? "flex items-start flex-col gap-y-8 fixed top-16 right-6 p-5 bg-white shadow-md w-52 ring-1 ring-slate-900/5 rounded-xl z-50"
              : "hidden lg:flex gap-x-5 xl:gap-x-1 medium-15 p-1"
              } ${!menuOpened && !active ? "text-white" : ""}`}
          />
          {/* Buttons Searchbar & Profile */}
          <div className="flex sm:flex-1 items-center sm:justify-end gap-x-4 sm:gap-x-8">
            {/* Owner Dashboard */}
            {isLoggedIn && isOwner && (
              agency ? (
                <Link
                  to="/owner"
                  className={`flex items-center gap-2 ${active ? "bg-secondary" : "bg-primary"} ring-1 ring-slate-900/10 px-4 py-2 rounded-full hover:scale-105 transition-all cursor-pointer`}
                  title="Owner Dashboard"
                >
                  <img src={assets.dashboard} alt="Dashboard" className="w-5 h-5" />
                  <span className="hidden sm:block text-[14px] font-medium text-black">Dashboard</span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowAgencyReg(true)}
                  className={`flex items-center gap-2 ${active ? "bg-secondary" : "bg-primary"} ring-1 ring-slate-900/10 px-4 py-2 rounded-full hover:scale-105 transition-all cursor-pointer`}
                  title="Register Agency"
                >
                  <FontAwesomeIcon icon={faUserPlus} className="w-4 h-4" />
                  <span className="hidden sm:block text-[14px] font-medium text-black">Register Owner</span>
                </button>
              )
            )}

            {/* My Bookings icon for tenant */}
            {isLoggedIn && !isOwner && (
              <Link
                to="/tenant/bookings"
                className={`flex items-center gap-2 ${active ? "bg-secondary" : "bg-primary"} ring-1 ring-slate-900/10 px-4 py-2 rounded-full hover:scale-105 transition-all cursor-pointer`}
                title="My Bookings"
              >
                <FontAwesomeIcon icon={faCalendarCheck} className="text-black/80 w-5 h-5" />
                <span className="hidden sm:block text-[14px] font-medium text-black">My Bookings</span>
              </Link>
            )}
            
            {/* SearchBar */}
            {/* <div className="relative hidden xl:flex items-center">
              <div
                className={`${active ? "bg-secondary/10" : "bg-white"} transition-all duration-300 ease-in-out ring-1 ring-slate-900/10 rounded-full overflow-hidden ${showSearch
                  ? "w-[266px] opacity-100 px-4 py-2"
                  : "w-11 opacity-0 px-0 py-0"
                  }`}
              >
                <input
                  type="text"
                  placeholder="Type here..."
                  className="w-full text-[14px] outline-none pr-10 placeholder:text-gray-400"
                />
              </div>
              <div
                onClick={() => setShowSearch((prev) => !prev)}
                className={`${active ? "bg-secondary/10" : "bg-primary"} absolute right-0 ring-1 ring-slate-900/10 p-[8px] rounded-full cursor-pointer z-10`}
              >
                <img src={assets.search} alt="searchIcon" className="w-5 h-5" />
              </div>
            </div> */}
            
            {/* Menu Toggle */}
            <>
              {menuOpened ? (
                <img
                  src={assets.close}
                  alt="closeMenuIcon"
                  onClick={toggleMenu}
                  className={`${!active && "invert"} lg:hidden cursor-pointer w-5 h-5`}
                />
              ) : (
                <img
                  src={assets.menu}
                  alt="openMenuIcon"
                  onClick={toggleMenu}
                  className={`${!active && "invert"} lg:hidden cursor-pointer w-5 h-5`}
                />
              )}
            </>

            {/* User Profile */}
            <div className="group relative top-1" ref={profileMenuRef}>
              <div>
                {isLoggedIn ? (
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <button 
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-10.5 h-10.5 bg-secondary text-white rounded-full flexCenter font-bold uppercase text-lg"
                      >
                        {userProfile?.name ? userProfile.name.charAt(0) : 'U'}
                      </button>
                      
                      {/* Role Indicator Badge Below Icon */}
                      <div className={`hidden md:flex items-center px-2 py-0.5 absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full text-[8px] font-bold uppercase tracking-wider border whitespace-nowrap shadow-sm z-10 ${isOwner ? "bg-secondary border-white text-black" : "bg-green-600 border-white text-white"}`}>
                        <span className={`w-1 h-1 rounded-full mr-1 ${isOwner ? "bg-black" : "bg-white"}`}></span>
                        {isOwner ? "Owner" : "Tenant"}
                      </div>
                    {showProfileMenu && (
                      <div className="absolute right-0 top-12 w-48 bg-white shadow-md rounded-md overflow-hidden z-50 ring-1 ring-slate-900/5">
                        <div className="px-4 py-2 bg-slate-50 border-b text-xs text-slate-600 font-medium">
                          Current Role: <span className="text-secondary font-bold">{isOwner ? "OWNER" : "TENANT"}</span>
                        </div>
                        {!isOwner && (
                          <button 
                            onClick={() => { navigate('/tenant/bookings'); setShowProfileMenu(false); }}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-slate-100 flex items-center gap-2"
                          >
                            <FontAwesomeIcon icon={faCalendarCheck} /> My Bookings
                          </button>
                        )}
                        {availableRoles.length > 1 ? (
                          <button 
                            onClick={() => { toggleRole(); setShowProfileMenu(false); }}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-slate-100 flex items-center gap-2 text-blue-600 font-medium"
                          >
                            <FontAwesomeIcon icon={faRightLeft} /> Switch to {isOwner ? "Tenant" : "Owner"}
                          </button>
                        ) : (
                          <button 
                            onClick={() => { setShowAgencyReg(true); setShowProfileMenu(false); }}
                            className="w-full text-left px-4 py-3 text-sm hover:bg-slate-100 flex items-center gap-2 text-blue-600 font-medium"
                          >
                            <FontAwesomeIcon icon={faRightLeft} /> Rent Your Property
                          </button>
                        )
                      }
                        <hr />
                        <button 
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-slate-100 font-medium"
                        >
                          Logout
                        </button>
                      </div>
                    )}
                    </div>
                  </div>
                ) : (
                  <button onClick={() => navigate('/login')} className="btn-secondary flexCenter gap-2 rounded-full">
                    Login
                    <img src={assets.user} alt="userIcon" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;