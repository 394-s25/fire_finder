import { createContext, useContext, useEffect, useState } from "react";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import { auth, googleProvider } from "./firestoreConfig";

const AuthContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const setupPersistence = async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
        console.log("Firebase persistence set to LOCAL");
      } catch (error) {
        console.error("Firebase persistence error:", error);
      }
    };
    setupPersistence();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log("Auth state changed:", u ? `User ${u.uid}` : "No user");
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  const loginWithEmail = async (email, password) => {
    await setPersistence(auth, browserLocalPersistence);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signupWithEmail = async (email, password, displayName) => {
    await setPersistence(auth, browserLocalPersistence);
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(cred.user, { displayName });
    }
    return cred;
  };

  const loginWithGoogle = async () => {
    await setPersistence(auth, browserLocalPersistence);
    return signInWithPopup(auth, googleProvider);
  };
  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        loginWithEmail,
        loginWithGoogle,
        signupWithEmail,
        logout,
      }}
    >
      {!authLoading ? children : <div>Loading authentication...</div>}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside UserProvider");
  }
  return ctx;
};
