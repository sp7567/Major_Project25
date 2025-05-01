import React, { useState } from "react";
import { ref, get } from "firebase/database";
import { database } from "../src/firebase/config";

function Dashboard() {
  const [prn, setPrn] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [isPrnVerified, setIsPrnVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

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
    const reportContent = `
Health Report for ${userData.fullName}
-------------------------------------

Personal Information:
- Full Name: ${userData.fullName}
- Email: ${userData.email}
- Gender: ${userData.gender}
- PRN: ${userData.prn}

Health Vitals:
- Oxygen Level: ${userData.HealthData?.["2025-04-26"]?.SpO2 ?? "N/A"}%
- Heart Rate: ${userData.HealthData?.["2025-04-26"]?.HeartRate ?? "N/A"} bpm
- Weight: N/A kg

Last Updated: ${new Date("2025-04-26").toLocaleString()}
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `health_report_${userData.prn}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
      {!isPrnVerified ? (
        <div 
          className="min-h-screen flex items-center justify-center p-6 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80')" }}
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
                    Last updated: {new Date(userData.HealthData?.date || Date.now()).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={downloadReport}
                  className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 flex items-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Report
                </button>
              </div>
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 - Oxygen Level */}
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105">
              <h2 className="text-lg font-semibold mb-2">Oxygen Level</h2>
              <p className="text-3xl font-bold text-blue-600">
                {userData.HealthData?.["2025-04-26"]?.SpO2 ?? "N/A"}%
              </p>
            </div>

            {/* Card 2 - Heart Rate */}
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105">
              <h2 className="text-lg font-semibold mb-2">Heart Rate</h2>
              <p className="text-3xl font-bold text-red-600">
                {userData.HealthData?.["2025-04-26"]?.HeartRate ?? "N/A"} bpm
              </p>
            </div>

            {/* Card 3 - Weight */}
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105">
              <h2 className="text-lg font-semibold mb-2">Weight</h2>
              <p className="text-3xl font-bold text-green-600">N/A kg</p>
            </div>

            {/* Card 4 - PRN */}
            <div className="bg-white rounded-xl shadow-md p-6 transform transition-all duration-300 hover:scale-105">
              <h2 className="text-lg font-semibold mb-2">PRN Number</h2>
              <p className="text-3xl font-bold text-gray-700">{userData.prn}</p>
            </div>
          </div>
        </div>
      )}

      {/* Floating Show History Button */}
      <button
        onClick={() => setShowHistory(true)}
        className="fixed bottom-6 right-6  bg-gradient-to-r from-blue-800 to-gray-900  hover:bg-gray-800 text-white p-4 rounded shadow-lg transition-all duration-300 z-50"
      >
        Show History
      </button>

      {/* Sliding History Panel */}
      <div className={`fixed inset-0 z-50 flex items-center justify-end transition-transform duration-500 ${showHistory ? "translate-x-0" : "translate-x-full"}`}>
  <div className="bg-white rounded-l-3xl p-8 w-full max-w-md shadow-2xl overflow-y-auto max-h-[90vh] flex flex-col">
    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Health History</h2>

    <div className="space-y-5 flex-1">
      {userData?.HealthData ? (
        Object.entries(userData.HealthData).map(([date, data]) => (
          <div key={date} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300">
            <p className="text-sm font-semibold text-gray-500 mb-2">
              {new Date(date).toLocaleDateString()}
            </p>
            <p className="text-lg font-bold text-blue-900">
              Oxygen Level: {data.SpO2 ?? "N/A"}%
            </p>
            <p className="text-lg font-bold text-red-900">
              Heart Rate: {data.HeartRate ?? "N/A"} bpm
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No history data available.</p>
      )}
    </div>

    <button
      onClick={() => setShowHistory(false)}
      className="mt-8 w-full bg-gradient-to-r from-pink-800 to-gray-900 hover:from-pink-900 hover:to-black text-white py-3 rounded-2xl text-lg font-semibold shadow-md transition-all duration-300"
    >
      Close
    </button>
  </div>
</div>

    </div>
  );
}

export default Dashboard;
