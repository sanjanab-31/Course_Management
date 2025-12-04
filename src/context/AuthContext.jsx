import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../config/firebase";
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
    onAuthStateChanged,
} from "firebase/auth";

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

// Helper function to determine role from email
function getRoleFromEmail(email) {
    if (email.includes('admin')) return 'admin';
    if (email.includes('teacher')) return 'teacher';
    return 'student';
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [loading, setLoading] = useState(true);

    async function signup(email, password, name, role) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Set role from email pattern
        setUserRole(getRoleFromEmail(email));
        return userCredential;
    }

    async function login(email, password) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        // Set role from email pattern
        setUserRole(getRoleFromEmail(userCredential.user.email));
        return userCredential;
    }

    function logout() {
        setUserRole(null);
        return signOut(auth);
    }

    function resetPassword(email) {
        return sendPasswordResetEmail(auth, email);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            if (user) {
                setUserRole(getRoleFromEmail(user.email));
            } else {
                setUserRole(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userRole,
        signup,
        login,
        logout,
        resetPassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

