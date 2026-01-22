import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { useCarrito } from "../context/ContextoCarrito";
import { crearPedido } from "../servicios/BaseDeDatos";

export const useCarritoControlador = () => {
  const router = useRouter();
  const { items, total, removerItem, limpiarCarrito } = useCarrito();

  const procederAlPago = () => {
    if (items.length === 0) return;

    Alert.alert(
      "Confirmar Pedido",
      `Total: $${totalPagar.toFixed(2)}\n¿Deseas procesar tu pedido ahora?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            // Prepare payload
            const payload = {
              usuario_id: 1, // Hardcoded for now, or use context
              total: totalPagar,
              restaurante: items[0]?.restaurante || "Varios",
              items: items.map((i) => ({
                producto_id: (i as any).producto_id || 1,
                cantidad: i.cantidad,
                precio: i.precio,
              })),
            };

            const res = await crearPedido(payload);

            if (res.success) {
              Haptics.notificationAsync(
                Haptics.NotificationFeedbackType.Success,
              );
              limpiarCarrito();
              router.push("/seguimiento/nuevo" as any);
            } else {
              Alert.alert("Error", "No se pudo procesar el pedido.");
            }
          },
        },
      ],
    );
  };

  const vaciarCarrito = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Vaciar Carrito",
      "¿Estás seguro que deseas eliminar todos los productos?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, vaciar",
          style: "destructive",
          onPress: () => limpiarCarrito(),
        },
      ],
    );
  };

  const eliminarItem = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    removerItem(id);
  };

  const seguirComprando = () => {
    router.back();
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
    seguirComprando,
    router,
  };
};
