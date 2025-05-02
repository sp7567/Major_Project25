import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "../src/firebase/config";
import { useNavigate } from "react-router-dom";
import { FaUser, FaIdCard, FaVenusMars, FaEnvelope, FaLock, FaCheck, FaExclamationCircle } from "react-icons/fa";
import Logo from "/logo.png"; // Adjust path to your logo
import { logToCloudWatch } from '../src/firebase/logger';

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

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      newErrors[key] = validateField(key, formData[key]);
    });

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(error => error !== "");
    if (hasErrors) return;

    const { email, password, fullName, prnNumber } = formData;

    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      const userRef = ref(database, "users/" + prnNumber);

      await set(userRef, {
        userId: user.uid,
        fullName: fullName,
        email: email,
        prn: prnNumber,
        gender: formData.gender,
        vitals: {
          date: new Date().toISOString(),
          oxygenLevel: "Unknown",
          weight: "Unknown",
        },
      });

      // ✅ Log success to CloudWatch
      await logToCloudWatch(`User registered: ${fullName} (${email}), PRN: ${prnNumber}`);

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

      // ❌ Log error to CloudWatch
      await logToCloudWatch(`Registration error for email: ${email}, PRN: ${prnNumber} => ${error.message}`);

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-200">
        <div className="flex flex-col items-center mb-8">
          <img src={Logo} alt="Company Logo" className="w-16 h-16 mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 text-center">
            Create Your Account
          </h2>
          <p className="text-gray-600 mt-2 text-center">
            Join us today and start your journey
          </p>
        </div>

        {errors.form && (
          <div className="mb-4 text-red-600 flex items-center gap-2">
            <FaExclamationCircle /> <span>{errors.form}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <FaUser className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className="pl-10 w-full border rounded-lg p-2"
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>

          <div className="relative">
            <FaIdCard className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              name="prnNumber"
              placeholder="PRN Number"
              value={formData.prnNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className="pl-10 w-full border rounded-lg p-2"
            />
            {errors.prnNumber && <p className="text-red-500 text-sm">{errors.prnNumber}</p>}
          </div>

          <div className="relative">
            <FaVenusMars className="absolute top-3 left-3 text-gray-400" />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onBlur={handleBlur}
              className="pl-10 w-full border rounded-lg p-2"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm">{errors.gender}</p>}
          </div>

          <div className="relative">
            <FaEnvelope className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              className="pl-10 w-full border rounded-lg p-2"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div className="relative">
            <FaLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className="pl-10 w-full border rounded-lg p-2"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="mr-2"
            />
            <label className="text-sm text-gray-700">I agree to the terms and conditions</label>
          </div>
          {errors.terms && <p className="text-red-500 text-sm">{errors.terms}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isLoading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registration;
