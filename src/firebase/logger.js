// src/firebase/logger.js

export const logToCloudWatch = async (message) => {
    try {
      await fetch("https://kb9m356cmf.execute-api.ap-south-1.amazonaws.com/API_Cloudproject", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });
    } catch (err) {
      console.error("Failed to log to CloudWatch:", err);
    }
  };
  