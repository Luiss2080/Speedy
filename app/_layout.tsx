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
import { useEffect } from "react";
import { initDB, seedDB } from "../src/servicios/BaseDeDatos";

export const unstable_settings = {
  anchor: "(client-tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    initDB()
      .then(() => seedDB())
      .catch((e) => console.error("Error BD:", e));
  }, []);

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
