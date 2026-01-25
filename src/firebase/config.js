import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyA9mOCq-rv77snOquDXt0GuCa___h07mfU",
    authDomain: "circles-63a39.firebaseapp.com",
    projectId: "circles-63a39",
    storageBucket: "circles-63a39.firebasestorage.app",
    messagingSenderId: "951100923025",
    appId: "1:951100923025:web:35fbef78e870ff1103b330",
    measurementId: "G-5R0YN1E6YN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: 'select_account'
});

export default app;
