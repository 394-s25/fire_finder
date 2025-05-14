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
} from "firebase/auth";
import { auth, googleProvider } from "./firestoreConfig";

const AuthContext = createContext(undefined);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return unsubscribe;
  }, [auth]);

  const loginWithEmail = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const signupWithEmail = (email, password, displayName) =>
    createUserWithEmailAndPassword(auth, email, password).then((cred) => {
      if (displayName) {
        return updateProfile(cred.user, { displayName });
      }
    });

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);

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
      {children}
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
