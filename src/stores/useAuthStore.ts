import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: number;
  nombre: string;
  email?: string;
  rol: "cliente" | "repartidor" | "admin" | "restaurante";
  avatar?: string;
}

interface RepartidorInfo {
  id: number;
  estado: string;
  // Add more fields as needed
}

interface AuthState {
  user: User | null;
  repartidorInfo: RepartidorInfo | null;
  isAuthenticated: boolean;
  login: (userData: User, repartidorData?: RepartidorInfo) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      repartidorInfo: null,
      isAuthenticated: false,
      login: (userData, repartidorData) =>
        set({
          user: userData,
          repartidorInfo: repartidorData || null,
          isAuthenticated: true,
        }),
      logout: () =>
        set({ user: null, repartidorInfo: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
