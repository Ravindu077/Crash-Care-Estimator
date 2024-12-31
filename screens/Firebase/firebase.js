
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";



const firebaseConfig = {
  apiKey: "AIzaSyALsyegVltTIc33lGaBQBOyR7Xe4VKCJB0",
  authDomain: "crashcareestimator2024.firebaseapp.com",
  projectId: "crashcareestimator2024",
  storageBucket: "crashcareestimator2024.appspot.com",
  messagingSenderId: "116373921680",
  appId: "1:116373921680:web:fbbe3e4a66aa1e827c9d15",
  measurementId: "G-7SC5KXL533"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const analytics = getAnalytics(app);


export {app,auth}


