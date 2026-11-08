import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { CarritoProvider } from "../src/context/ContextoCarrito";
import { FavoritosProvider } from "../src/context/ContextoFavoritos";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect, useState } from "react";
import { initDB, seedDB } from "../src/servicios/BaseDeDatos";
import { DEMO, activarDemo } from "../src/demo/activarDemo";

export const unstable_settings = {
  anchor: "(client-tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // En la demo la sesion se siembra antes de pintar: zustand rehidrata el
  // store al montar y despues ya no vuelve a mirar el almacenamiento.
  const [demoListo, setDemoListo] = useState(!DEMO);

  useEffect(() => {
    activarDemo().then(() => setDemoListo(true));
  }, []);

  useEffect(() => {
    initDB()
      .then(() => seedDB())
      .catch((e) => console.error("Error BD:", e));
  }, []);

  if (!demoListo) {
    return null;
  }

  return (
    <FavoritosProvider>
      <CarritoProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen
              name="(client-tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="(driver-tabs)"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="modal"
              options={{ presentation: "modal", title: "Modal" }}
            />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </CarritoProvider>
    </FavoritosProvider>
  );
}
