// src/firebase/logger.js

export const logToCloudWatch = async (message) => {
    try {
      await fetch("https://your-api-id.execute-api.your-region.amazonaws.com/log", {
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
  