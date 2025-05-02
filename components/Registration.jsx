import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../src/firebase/config";
import { useNavigate } from "react-router-dom";
import { FaUser, FaIdCard, FaVenusMars, FaEnvelope, FaLock, FaCheck, FaExclamationCircle } from "react-icons/fa";
import Logo from "/logo.png"; // Adjust path to your logo

function Registration() {
  const [formData, setFormData] = useState({
    fullName: "",
    prnNumber: "",
    gender: "",
    email: "",
    password: "",
    terms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({
    fullName: "",
    prnNumber: "",
    gender: "",
    email: "",
    password: "",
    terms: "",
  });
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "fullName":
        if (!value.trim()) error = "Full name is required";
        else if (value.length < 3) error = "Name must be at least 3 characters";
        break;
      case "prnNumber":
        if (!value.trim()) error = "PRN number is required";
        else if (!/^\d+$/.test(value)) error = "PRN must contain only numbers";
        break;
      case "gender":
        if (!value) error = "Please select your gender";
        break;
      case "email":
        if (!value) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Invalid email format";
        break;
      case "password":
        if (!value) error = "Password is required";
        else if (value.length < 6) error = "Password must be at least 6 characters";
        break;
      case "terms":
        if (!value) error = "You must accept the terms";
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Validate the field when it changes
    const error = validateField(name, type === "checkbox" ? checked : value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleBlur = (e) => {
    const { name, value, type, checked } = e.target;
    const error = validateField(name, type === "checkbox" ? checked : value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields before submission
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });
    
    setErrors(newErrors);
    
    // Check if any errors exist
    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) return;
    
    const { email, password, fullName, prnNumber, terms } = formData;

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Structure for storing user data
      const userRef = ref(database, "users/" + prnNumber);

      // Store user data
      await set(userRef, {
        userId: user.uid,
        fullName: fullName,
        email: email,
        prn: prnNumber,
        gender: formData.gender,
        vitals: {
          date : new Date().toISOString().split("T")[0],
          oxygenLevel: "Unknown",
          weight: "Unknown",
          heartrate: "Unknown",
        },
      });

      navigate("/login", { state: { registrationSuccess: true } });
    } catch (error) {
      console.error("Registration error:", error);
      let errorMessage = "Registration failed. Please try again.";
      if (error.message.includes("email-already-in-use")) {
        errorMessage = "This email is already registered.";
        setErrors(prev => ({ ...prev, email: errorMessage }));
      } else {
        setErrors(prev => ({ ...prev, form: errorMessage }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-8">
          <img 
            src={Logo} 
            alt="Company Logo" 
            className="w-16 h-16 mb-4"
          />
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Create Your Account
          </h2>
          <p className="text-gray-600 mt-2 text-center">
            Join us today and start your journey
          </p>
        </div>

        {errors.form && (
          <div className="mb-6 p-3 bg-red-100 text-gray-600 rounded-lg text-sm flex items-center">
            <FaExclamationCircle className="mr-2" />
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="relative">
            <label htmlFor="fullName" className="block text-gray-600 font-medium mb-1">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border ${errors.fullName ? "border-gray-600" : "border-gray-300"} rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="John Doe"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-gray-600 flex items-center">
                <FaExclamationCircle className="mr-1" size={12} />
                {errors.fullName}
              </p>
            )}
          </div>

          {/* PRN Number */}
          <div className="relative">
            <label htmlFor="prnNumber" className="block text-gray-700 font-medium mb-1">
              PRN Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaIdCard className="text-gray-400" />
              </div>
              <input
                type="text"
                id="prnNumber"
                name="prnNumber"
                value={formData.prnNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border ${errors.prnNumber ? "border-gray-500" : "border-gray-300"} rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="Enter PRN Number"
              />
            </div>
            {errors.prnNumber && (
              <p className="mt-1 text-sm text-gray-600 flex items-center">
                <FaExclamationCircle className="mr-1" size={12} />
                {errors.prnNumber}
              </p>
            )}
          </div>

          {/* Gender */}
          <div className="relative">
            <label htmlFor="gender" className="block text-gray-700 font-medium mb-1">
              Gender
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaVenusMars className="text-gray-400" />
              </div>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border ${errors.gender ? "border-gray-500" : "border-gray-300"} rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none`}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {errors.gender && (
              <p className="mt-1 text-sm text-gray-600 flex items-center">
                <FaExclamationCircle className="mr-1" size={12} />
                {errors.gender}
              </p>
            )}
          </div>

          {/* E-mail */}
          <div className="relative">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border ${errors.email ? "border-gray-500" : "border-gray-300"} rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-gray-600 flex items-center">
                <FaExclamationCircle className="mr-1" size={12} />
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border ${errors.password ? "border-gray-500" : "border-gray-300"} rounded-lg py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                placeholder="••••••••"
              />
            </div>
            {errors.password ? (
              <p className="mt-1 text-sm text-gray-600 flex items-center">
                <FaExclamationCircle className="mr-1" size={12} />
                {errors.password}
              </p>
            ) : (
              <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
            )}
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={formData.terms}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-4 h-4 text-blue-600 ${errors.terms ? "border-gray-500" : "border-gray-300"} rounded focus:ring-blue-500`}
              />
            </div>
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:underline">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-gray-600 flex items-center">
              <FaExclamationCircle className="mr-1" size={12} />
              {errors.terms}
            </p>
          )}

          {/* Register Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium ${
              isLoading ? "bg-gray-900" : "bg-gray-900 hover:bg-gray-900"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <FaCheck className="mr-2" />
                Register Now
              </>
            )}
          </button>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <button 
              onClick={() => navigate("/login")} 
              className="text-gray-600 hover:text-gray-800 font-medium"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Registration;