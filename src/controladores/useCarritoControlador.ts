import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Alert } from "react-native";
import { crearPedido } from "../servicios/BaseDeDatos";

export const useCarritoControlador = () => {
  const router = useRouter();
  const {
    items,
    total,
    removerItem,
    limpiarCarrito,
    actualizarCantidad,
    metodoPago,
    setMetodoPago,
    notas,
    setNotas,
    direccionEntrega,
    setDireccionEntrega,
    tipoServicio,
    setTipoServicio,
    costoEnvio,
    cotizarEnvio,
    cupon,
    aplicarCupon,
    removerCupon,
    descuento,
    subTotal,
  } = useContext(ContextoCarrito)!;

  useEffect(() => {
    if (items.length > 0 && direccionEntrega) {
      const restauranteId = (items[0] as any).restaurante_id || 1; // Fallback
      cotizarEnvio(restauranteId, direccionEntrega.id, tipoServicio);
    }
  }, [direccionEntrega, tipoServicio, items]);

  useEffect(() => {
    if (items.length === 0) {
      router.back();
    }
  }, [items]);

  const subtotal = total;
  const totalPagar = subtotal + costoEnvio;

  const procederAlPago = () => {
    if (items.length === 0) return;

    // Validation
    if (
      !direccionEntrega &&
      (items[0] as any)?.tipo_servicio === "delivery" &&
      tipoServicio === "delivery"
    ) {
      // Maybe alert strict requirement, or default to main address if available.
      // For now, let's allow it to be empty and backend defaults to ID 1, STRICTLY FOR DEMO.
      // But better to warn.
      // Alert.alert("Falta Dirección", "Por favor selecciona una dirección de entrega.");
      // return;
    }

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
              usuario_id: 1, // Hardcoded for now
              total: totalPagar,
              restaurante: items[0]?.restaurante || "Varios",
              items: items.map((i) => ({
                producto_id: (i as any).producto_id || 1,
                cantidad: i.cantidad,
                precio: i.precio,
              })),
              metodo_pago: metodoPago,
              notas: notas,
              // If pickup, ensure address is NOT user address, maybe keep null or default to restaurant location
              direccion_entrega_id:
                tipoServicio === "delivery" ? direccionEntrega?.id || 1 : null,
              direccion_origen: items[0]?.restaurante || "Restaurante",
              tipo_servicio: tipoServicio,
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

  const incrementar = (id: string, cantidadActual: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    actualizarCantidad(id, cantidadActual + 1);
  };

  const decrementar = (id: string, cantidadActual: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    actualizarCantidad(id, cantidadActual - 1);
  };

  return {
    items,
    subtotal,
    costoEnvio,
    totalPagar,
    eliminarItem,
    incrementar,
    decrementar,
    vaciarCarrito,
    procederAlPago,
    seguirComprando,
    router,
    metodoPago,
    setMetodoPago,
    notas,
    setNotas,
    direccionEntrega,
    setDireccionEntrega,
    tipoServicio,
    setTipoServicio,
    cupon,
    aplicarCupon,
    removerCupon,
    descuento,
    subTotal,
  };
};
