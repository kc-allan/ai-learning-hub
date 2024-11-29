import React, { useState } from "react";
import { Layout, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setLogout } from "../src/state";
import PaymentPlanModal from "./paymentPlanModal";

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuth = useSelector((state) => state.token);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isPremium = useSelector((state) => state.user?.is_premium)

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavLinks = () => (
    <>
      {isAuth ? (
        <>
          {!isPremium && <PaymentPlanModal />}
          <Link
            to="/dashboard"
            className="block px-4 py-2 text-gray-600 hover:text-gray-900 md:inline-block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/community"
            className="block px-4 py-2 text-gray-600 hover:text-gray-900 md:inline-block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Community
          </Link>
          <Link
            to="/courses"
            className="block px-4 py-2 text-gray-600 hover:text-gray-900 md:inline-block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Courses
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-red-600 md:inline-block md:w-auto"
          >
            Log Out
          </button>
        </>
      ) : (
        <>
          <Link
            to="/auth/login"
            className="block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 md:inline-block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/auth/register"
            className="block px-4 py-2 text-gray-600 hover:text-gray-900 md:inline-block"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Sign Up
          </Link>
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="cursor-pointer flex items-center gap-2">
          <Layout className="h-8 w-8 text-blue-500" />
          <span className="text-xl font-bold text-blue-500">
            AI Learning Hub
          </span>
        </Link>

        {/* Mobile Menu Toggle */}
        <button className="md:hidden z-60" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-800" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Desktop Navigation */}
        <nav className="flex items-center space-x-4">
          <NavLinks />
        </nav>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden space-y-6 fixed inset-0 bg-white top-16 left-0 right-0 bottom-0 z-50 flex flex-col gap-4 p-4 overflow-y-auto">
            <div className="absolute top-4 right-4 z-60 flex items-center justify-center">
              <button onClick={toggleMobileMenu} className="text-gray-800">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-4 text-center space-y-2 bg-white z-70">
              <NavLinks />
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
