import { Stack } from "expo-router";
import SeguimientoVista from "../../src/vistas/SeguimientoVista";

export default function SeguimientoRoute() {
  return (
    <>
      <Stack.Screen
        options={{ title: "Seguimiento", headerBackTitle: "Pedidos" }}
      />
      <SeguimientoVista />
    </>
  );
}
