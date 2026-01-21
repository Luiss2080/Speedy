import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { useCarrito } from "../context/ContextoCarrito";

export const useCarritoControlador = () => {
  const router = useRouter();
  const { items, total, removerItem, limpiarCarrito } = useCarrito();

  const procederAlPago = () => {
    if (items.length === 0) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Assuming /seguimiento/nuevo is the correct flow to start tracking/order
    // Or maybe it should go to a checkout page first.
    // Given the previous code, it went to /seguimiento/nuevo.
    // I will keep it but maybe it should be /metodos-pago or /direcciones first in a real app.
    // For now, I'll match the previous logic but improve the route if needed.
    router.push("/seguimiento/nuevo" as any);
  };

  const vaciarCarrito = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    limpiarCarrito();
  };

  const eliminarItem = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    removerItem(id);
  };

  const subtotal = total;
  const costoEnvio = 2.0;
  const totalPagar = subtotal + costoEnvio;

  return {
    items,
    subtotal,
    costoEnvio,
    totalPagar,
    eliminarItem,
    vaciarCarrito,
    procederAlPago,
    router,
  };
};
