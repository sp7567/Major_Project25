import React, { useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../src/firebase/config";

function Dashboard() {
  const [prn, setPrn] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isPrnVerified, setIsPrnVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUserData = async () => {
    if (prn.length !== 12) {
      setError("PRN must be exactly 12 digits");
      setUserData(null);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const userRef = ref(database, "users/" + prn);
      const snapshot = await get(userRef);

      if (snapshot.exists()) {
        setUserData(snapshot.val());
        setIsPrnVerified(true);
      } else {
        setError("No user found with this PRN");
        setUserData(null);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch user data");
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = () => {
    // Create a report content
    const reportContent = `
      Health Report for ${userData.fullName}
      -------------------------------------
      
      Personal Information:
      - Full Name: ${userData.fullName}
      - Email: ${userData.email}
      - Gender: ${userData.gender}
      - PRN: ${userData.prn}
      
      Health Vitals:
      - Oxygen Level: ${userData.vitals?.oxygenLevel || "N/A"}%
      - Weight: ${userData.vitals?.weight || "N/A"} kg
      
      Last Updated: ${new Date(userData.vitals?.date || Date.now()).toLocaleString()}
    `;

    // Create a Blob with the report content
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element to trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = `health_report_${userData.prn}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {!isPrnVerified ? (
        <div 
          className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}
        >
          <div className="backdrop-blur-sm bg-white/80 p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-500 hover:scale-[1.02]">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2 animate-pulse">
                <span className="text-blue-600">Health</span> Dashboard
              </h1>
              <p className="text-gray-600">Enter your PRN to access your health metrics</p>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="prn" className="block text-sm font-medium text-gray-700 mb-1">
                  PRN Number
                </label>
                <input
                  id="prn"
                  type="text"
                  placeholder="Enter 12-digit PRN"
                  value={prn}
                  onChange={(e) => {
                    setPrn(e.target.value);
                    if (error) setError("");
                  }}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  maxLength={12}
                />
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-lg animate-fade-in">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                </div>
              )}

              <button
                onClick={fetchUserData}
                disabled={isLoading || prn.length !== 12}
                className={`w-full py-3 px-4 rounded-lg shadow-md text-white font-medium transition-all duration-300 ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : prn.length === 12
                    ? "bg-blue-600 hover:bg-blue-700 transform hover:-translate-y-0.5"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </div>
                ) : (
                  "Verify PRN"
                )}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-gray-950 to-red-800 rounded-xl p-6 mb-8 shadow-lg transform transition-all duration-500 hover:shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="mb-4 md:mb-0">
                <h1 className="text-2xl md:text-3xl font-bold text-white animate-fade-in">
                  Welcome back, <span className="text-yellow-300">{userData.fullName}</span>
                </h1>
                <p className="text-blue-100 mt-1">
                  {userData.gender} • PRN: {userData.prn}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
                  <p className="text-white text-sm md:text-base">
                    Last updated: {new Date(userData.vitals?.date || Date.now()).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={downloadReport}
                  className="bg-gray-800 hover:bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Report
                </button>
              </div>
            </div>
          </div>

          {/* Main Dashboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* User Info Card */}
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-[1.02]">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                Personal Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-gray-600">Full Name</span>
                  <span className="font-medium">{userData.fullName}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-gray-600">Email</span>
                  <span className="font-medium text-blue-600">{userData.email}</span>
                </div>
                <div className="flex justify-between  pb-2">
                  <span className="text-gray-600">Gender</span>
                  <span className="font-medium">{userData.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">PRN</span>
                  <span className="font-medium">{userData.prn}</span>
                </div>
              </div>
            </div>

            {/* Vitals Card */}
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-[1.02]">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                Health Vitals
              </h2>
              <div className="space-y-4">
                <div className="bg-blue-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Oxygen Level</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {userData.vitals?.oxygenLevel || "N/A"}%
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-2xl font-bold text-green-700">
                      {userData.vitals?.weight || "N/A"} kg
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Graph Card */}
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-[1.02] lg:col-span-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Health Trends
              </h2>
              <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center animate-pulse">
                <p className="text-gray-400">Health data visualization coming soon</p>
              </div>
              <div className="mt-4 flex justify-center space-x-4">
                <span className="inline-flex items-center text-sm">
                  <span className="w-3 h-3 bg-blue-500 rounded-full mr-1"></span>
                  Oxygen
                </span>
                <span className="inline-flex items-center text-sm">
                  <span className="w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                  Weight
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;