import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBnrw1ppLWZGNDZDdp9gYd7OtJcaymqECk",
  authDomain: "siva-saloon.firebaseapp.com",
  projectId: "siva-saloon",
  storageBucket: "siva-saloon.appspot.com", // ✅ fixed
  messagingSenderId: "289901674439",
  appId: "1:289901674439:web:9659fa0e5459710da3a3e2",
  measurementId: "G-YMEP6Z8XLY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
