import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQ62Z4bSdXZvAHkv6173_3XLlReiBCoYo",
  authDomain: "health-care-b8c80.firebaseapp.com",
  databaseURL: "https://health-care-b8c80-default-rtdb.firebaseio.com",
  projectId: "health-care-b8c80",
  storageBucket: "health-care-b8c80.firebasestorage.app",
  messagingSenderId: "457749743264",
  appId: "1:457749743264:web:69c9163ad6a5f1a500abc5",
  measurementId: "G-EQNX5064D1"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

export { database, auth, ref, set, get }; // Added 'get' export