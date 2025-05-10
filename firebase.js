// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCQeGFNRnW_iArVawDlH3MKTQfhq-WOzXI",
  authDomain: "karno-4253f.firebaseapp.com",
  projectId: "karno-4253f",
  storageBucket: "karno-4253f.firebasestorage.app",
  messagingSenderId: "856084877122",
  appId: "1:856084877122:web:ffef08969c5200687482db",
  measurementId: "G-XJN3XBY9MG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // The signed-in user info.
    const user = result.user;
    return user; // Return the Firebase user object
  } catch (error) {
    // Handle Errors here.
    console.error("Error during Google Sign-In:", error.code, error.message);
    // You might want to map specific errors to user-friendly messages
    throw error; // Re-throw error to be caught by the calling component
  }
};

export const signUpWithEmailPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return user;
  } catch (error) {
    console.error("Error during sign up:", error.code, error.message);
    throw error;
  }
}

export { auth, signInAnonymously, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword };
export default app;
