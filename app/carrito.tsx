import { Stack } from "expo-router";
import CarritoVista from "../src/vistas/CarritoVista";

export default function CarritoRoute() {
  return (
    <>
      <Stack.Screen options={{ presentation: "modal", title: "Mi Carrito" }} />
      <CarritoVista />
    </>
  );
}
