// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_APIKEY,
  authDomain: "chat-app-user-img.firebaseapp.com",
  projectId: "chat-app-user-img",
  storageBucket: "chat-app-user-img.appspot.com",
  messagingSenderId: "904854464974",
  appId: import.meta.env.VITE_REACT_APP_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;
