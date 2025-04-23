import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from "../src/firebase/config";
import { onAuthStateChanged, signOut } from 'firebase/auth';
// Import your logo image
import logo from "/logo.png"; // Adjust the path as necessary  

function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsMenuOpen(false);
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-b from-gray-100 to-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-3xl font-bold text-gray-900 tracking-tight transition-all duration-500 transform hover:scale-110 hover:-translate-y-1 hover:text-blue-600 flex items-center space-x-3 font-poppins"
            >
              <img
                src={logo}
                alt="Logo"
                className="w-10 h-10 rounded-full shadow-lg shadow-gray-300"
              />
              <span className="text-pink-600 text-4xl">H</span>ealthCare
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8 ml-auto">
            <div className="hidden md:flex space-x-9">
              {['/', '/about', '/contact'].map((path, index) => {
                const labels = ['Home', 'About', 'Contact'];
                return (
                  <Link
                    key={index}
                    to={path}
                    className="relative group text-gray-700 font-medium transition duration-300"
                  >
                    {labels[index]}
                    <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Auth Buttons */}
            <div className="flex space-x-4">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-all duration-300 shadow-md transform hover:scale-105 hover:shadow-lg"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-6 py-2 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-500 transition-all duration-300 shadow-md transform hover:scale-105 hover:shadow-lg"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-600 transition-all duration-300 shadow-md transform hover:scale-105 hover:shadow-lg"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - Right Side Slide */}
      <div className={`fixed inset-y-0 right-0 z-50 w-64 bg-white shadow-xl transform ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div className="flex-1 px-4 py-2 overflow-y-auto">
            {/* Mobile Nav Links */}
            {['/', '/about', '/contact'].map((path, index) => {
              const labels = ['Home', 'About', 'Contact'];
              return (
                <Link
                  key={index}
                  to={path}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 my-1 rounded-lg text-gray-700 hover:text-gray-900 hover:bg-gray-100 text-lg font-medium transition-colors duration-200"
                >
                  {labels[index]}
                </Link>
              );
            })}
          </div>

          {/* Mobile Auth Buttons */}
          <div className="p-4 border-t border-gray-200">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-500 transition-all duration-300"
              >
                Logout
              </button>
            ) : (
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-4 py-3 bg-pink-600 text-white font-semibold rounded-lg hover:bg-pink-500 transition-all duration-300 text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full px-4 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-700 transition-all duration-300 text-center"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay when menu is open */}
      {isMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleMenu}
        ></div>
      )}
    </nav>
  );
}

export default Navbar;