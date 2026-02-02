import { Redirect } from "expo-router";
import React from "react";

export default function DetallePedidoCliente() {
  // Redirect to the Orders tab (or home) since this standalone view is deprecated
  // and we want users to use the modal in SeguimientoVista or the main list.
  return <Redirect href="/(client-tabs)/pedidos" />;
}
