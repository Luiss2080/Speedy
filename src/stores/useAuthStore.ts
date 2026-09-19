import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface User {
  id: number;
  nombre: string;
  email?: string;
  rol: "cliente" | "repartidor" | "admin" | "restaurante";
  avatar?: string;
  telefono?: string;
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
  token: string | null;
  login: (
    userData: User,
    repartidorData?: RepartidorInfo,
    token?: string,
  ) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      repartidorInfo: null,
      isAuthenticated: false,
      token: null,
      // Si no llega un token nuevo (p. ej. al editar el perfil) se conserva el actual.
      login: (userData, repartidorData, token) =>
        set({
          user: userData,
          repartidorInfo: repartidorData || null,
          isAuthenticated: true,
          token: token ?? get().token,
        }),
      logout: () =>
        set({
          user: null,
          repartidorInfo: null,
          isAuthenticated: false,
          token: null,
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

/** Cabecera Authorization con el JWT guardado (vacia si no hay sesion). */
export const authHeaders = (): Record<string, string> => {
  const token = useAuthStore.getState().token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};
