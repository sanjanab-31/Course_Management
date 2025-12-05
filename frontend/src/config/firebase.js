import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAegGouTmydFNjdng1wpPMLoEu0uuVW3Rg",
    authDomain: "esa-billing-website-1ec57.firebaseapp.com",
    projectId: "esa-billing-website-1ec57",
    storageBucket: "esa-billing-website-1ec57.firebasestorage.app",
    messagingSenderId: "49467332849",
    appId: "1:49467332849:web:155de5e99c3a11bc0db150",
    measurementId: "G-WDJT5Q3QRQ"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
