import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDf_sZU3pywCUgdyYiUlKH_iNCwh0gU-Qc",
  authDomain: "socialmediawebapp-images.firebaseapp.com",
  projectId: "socialmediawebapp-images",
  storageBucket: "socialmediawebapp-images.appspot.com",
  messagingSenderId: "1064649075129",
  appId: "1:1064649075129:web:03a722cf080489b3a5ee68"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)