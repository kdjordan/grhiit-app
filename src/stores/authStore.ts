import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useUserStore } from "./userStore";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  signIn: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      useUserStore.getState().setUser(result.user.uid, result.user.email || "");
      set({ user: result.user, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign in failed";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signUp: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      useUserStore.getState().setUser(result.user.uid, result.user.email || "");
      set({ user: result.user, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up failed";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await firebaseSignOut(auth);
      useUserStore.getState().clearUser();
      set({ user: null, isLoading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign out failed";
      set({ error: message, isLoading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),
}));

// Initialize auth state listener
onAuthStateChanged(auth, (user) => {
  const state = useAuthStore.getState();
  if (user) {
    useUserStore.getState().setUser(user.uid, user.email || "");
  }
  useAuthStore.setState({ user, isInitialized: true });
});
