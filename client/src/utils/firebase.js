// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFQNToBeLRbiX6qwCsck0hCXvZe_Q9JEM",
  authDomain: "chat-app-user-img.firebaseapp.com",
  projectId: "chat-app-user-img",
  storageBucket: "chat-app-user-img.appspot.com",
  messagingSenderId: "904854464974",
  appId: "1:904854464974:web:2046535b494ebb9378e39f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;