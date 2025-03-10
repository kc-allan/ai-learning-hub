import React, { useState } from "react";
import { Layout, X, Menu } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../src/state";
import PaymentPlanModal from "./paymentPlanModal";
import { useMediaQuery } from "@mui/material";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.token);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isPremium = useSelector((state) => state.user?.is_premium);
  const isNonMobileScreens = useMediaQuery("(min-width: 700px)");

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Active link styles
  const getLinkClass = (isActive) => {
    return isActive 
      ? "block px-4 py-2 text-blue-600 font-semibold bg-blue-50 rounded-lg hover:text-blue-700 md:inline-block" 
      : "block px-4 py-2 text-gray-600 hover:text-gray-900 md:inline-block";
  };

  const NavLinks = () => (
    <>
      {isAuth ? (
        <>
          {!isPremium && <PaymentPlanModal />}
          <NavLink
            to="/dashboard"
            className={({ isActive }) => getLinkClass(isActive)}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/community"
            className={({ isActive }) => getLinkClass(isActive)}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Community
          </NavLink>
          <NavLink
            to="/courses"
            className={({ isActive }) => getLinkClass(isActive)}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Courses
          </NavLink>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 md:inline-block md:w-auto"
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          <NavLink
            to="/auth/login"
            className={({ isActive }) => 
              isActive 
              ? "block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 md:inline-block" 
              : "block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 md:inline-block"
            }
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </NavLink>
          <NavLink
            to="/auth/register"
            className={({ isActive }) => getLinkClass(isActive)}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign Up
          </NavLink>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-[9999] flex justify-between w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="px-4 w-full flex h-16 items-center justify-between">
        {/* Logo */}
        <NavLink 
          to="/" 
          className={({ isActive }) => 
            `cursor-pointer flex items-center gap-2 ${isActive ? 'opacity-70' : ''}`
          }
        >
          <Layout className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-blue-500">
            AI Learning Hub
          </span>
        </NavLink>

        {isNonMobileScreens ? (
          <>
            {/* Desktop Navigation */}
            <nav className="flex items-center space-x-4">
              <NavLinks />
            </nav>
          </>
        ) : (
          <>
            {/* Mobile Menu Toggle */}
            <button className="md:hidden z-[9999]" onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6 text-gray-800" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/* Mobile Navigation Overlay */}
            {isMobileMenuOpen && (
              <div style={{zIndex: 9999}} className="md:hidden fixed inset-0 bg-white top-0 left-0 right-0 bottom-0 flex flex-col gap-4 p-4 overflow-y-auto">
                <div style={{zIndex: 9999}} className="absolute top-4 right-4 flex items-center justify-center">
                  <button onClick={toggleMobileMenu} className="text-gray-800">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <div className="pt-20 p-4 text-center space-y-2 bg-white z-[9999]">
                  <NavLinks />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default Header;