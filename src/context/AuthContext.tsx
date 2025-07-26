import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Listen for Firebase Auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Get user info from Firestore
        const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;
      const userDoc = await getDoc(doc(db, "users", uid));
      if (userDoc.exists()) {
        setUser({ id: uid, ...userDoc.data() } as User);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };
const register = async (userData: {
    name: string;
    email: string;
    phone: string; 
    password: string;
    role: "job seeker" | "admin";
    profile?: string;
    skills?: string[];
  }): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const { uid } = userCredential.user;
      const now = new Date();
      await setDoc(doc(db, "users", uid), {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        profile: userData.profile || "",
        skills: userData.skills || [],
        createdAt: now,
      });
      setUser({
        id: uid,
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        role: userData.role,
        profile: userData.profile || "",
        skills: userData.skills || [],
        createdAt: now,
      });
      return true;
    } catch (error) {
      return false;
    }
  };


  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};