import {
    signInWithPopup,
    signInWithRedirect,
    getRedirectResult,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    GoogleAuthProvider,
    setPersistence,
    browserLocalPersistence
} from "firebase/auth";
import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "firebase/firestore";
import { auth, db, googleProvider } from "./config";

// Sign in with Google (using Popup as requested)
export async function signInWithGoogle() {
    try {
        // Explicitly set persistence to LOCAL
        await setPersistence(auth, browserLocalPersistence);

        // Explicitly set prompt
        googleProvider.setCustomParameters({
            prompt: 'select_account'
        });

        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        // Check/Create profile immediately
        try {
            await createUserProfileIfNotExists(user);
        } catch (profileError) {
            console.warn("Profile creation warning:", profileError);
        }

        return { success: true, user };
    } catch (error) {
        console.error("Google sign-in error:", error);
        return { success: false, error: error.message };
    }
}

// Handle redirect result (Keep for backward compatibility or edge cases, but mostly unused now)
export async function handleRedirectResult() {
    return { success: true, user: null };
}

// Create user profile if it doesn't exist
export async function createUserProfileIfNotExists(user) {
    if (!user) return;

    try {
        const userRef = doc(db, "users", user.uid);
        // This getDoc might fail if permissions aren't set up yet
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                createdAt: serverTimestamp(),
                isOnboarded: false,
                settings: {
                    liteMode: false,
                    darkMode: true,
                    notifications: true
                }
            });
        }
        return { success: true };
    } catch (error) {
        // Propagate permission errors so the UI can decide what to do
        // or just log them
        console.warn("Profile creation failed:", error.code);
        throw error;
    }
}

// Sign out
export async function signOut() {
    try {
        await firebaseSignOut(auth);
        return { success: true };
    } catch (error) {
        console.error("Sign out error:", error);
        return { success: false, error: error.message };
    }
}

// Get current user
export function getCurrentUser() {
    return auth.currentUser;
}

// Auth state observer
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, async (user) => {
        // We intentionally do NOT try to create profile here to avoid
        // permission errors in tight loops. Profile creation is best effort
        // during login-flow only.
        callback(user);
    });
}

// Get user profile from Firestore
export async function getUserProfile(uid) {
    try {
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            return { success: true, data: { id: userSnap.id, ...userSnap.data() } };
        } else {
            return { success: false, error: "User not found" };
        }
    } catch (error) {
        // Graceful fail
        // console.warn("Get user profile failed:", error.code);
        return { success: false, error: error.message };
    }
}

// Update user profile
export async function updateUserProfile(uid, data) {
    try {
        const userRef = doc(db, "users", uid);
        await setDoc(userRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}
