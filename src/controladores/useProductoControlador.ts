import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useCarrito } from "../context/ContextoCarrito";
import { useFavoritos } from "../context/ContextoFavoritos";
import { Producto } from "../modelos/tipos";
import { getProductoDetalle } from "../servicios/BaseDeDatos";

export const useProductoControlador = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [producto, setProducto] = useState<Producto | null>(null);

  const [cantidad, setCantidad] = useState(1);
  const [instrucciones, setInstrucciones] = useState("");
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<string[]>([]);

  const { toggleFavorito: toggleFavContext, esFavorito: checkEsFavorito } =
    useFavoritos();
  const { agregarItem } = useCarrito();

  useEffect(() => {
    const cargarProducto = async () => {
      if (!id) return;
      setLoading(true);
      const data = await getProductoDetalle(id as string);
      if (data) {
        // Ensure numbers are numbers (MySQL sometimes returns strings for decimals)
        data.precio = parseFloat(data.precio);
        if (data.extrasDisponibles) {
          data.extrasDisponibles = data.extrasDisponibles.map((e: any) => ({
            ...e,
            precio: parseFloat(e.precio),
          }));
        }
        setProducto(data);
      }
      setLoading(false);
    };
    cargarProducto();
  }, [id]);

  const esFavorito = producto ? checkEsFavorito(producto.id) : false;

  const incrementarCantidad = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCantidad((prev) => prev + 1);
  };

  const decrementarCantidad = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCantidad((prev) => Math.max(1, prev - 1));
  };

  const toggleExtra = (extraId: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExtrasSeleccionados((prev) =>
      prev.includes(extraId)
        ? prev.filter((id) => id !== extraId)
        : [...prev, extraId],
    );
  };

  const toggleFavorito = () => {
    if (!producto) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleFavContext(producto);
  };

  const precioUnitarioConExtras = useMemo(() => {
    if (!producto) return 0;
    const costoExtras =
      producto.extrasDisponibles
        ?.filter((e) => extrasSeleccionados.includes(e.id))
        .reduce((sum, e) => sum + e.precio, 0) || 0;
    return producto.precio + costoExtras;
  }, [producto, extrasSeleccionados]);

  const total = (precioUnitarioConExtras * cantidad).toFixed(2);

  const agregarAlCarrito = () => {
    if (!producto) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Obtener objetos Extra completos
    const extrasObj = producto.extrasDisponibles?.filter((e) =>
      extrasSeleccionados.includes(e.id),
    );

    agregarItem({
      id: producto.id + Date.now().toString(), // Unique ID for cart list
      producto_id: producto.id, // Real DB ID for checkout
      nombre: producto.nombre,
      precio: precioUnitarioConExtras,
      cantidad: cantidad,
      restaurante: producto.restaurante || "Restaurante", // Safe fallback
      extrasSeleccionados: extrasObj,
      instrucciones: instrucciones.trim(),
    });
    router.push("/carrito" as any);
  };

  return {
    producto,
    loading,
    cantidad,
    instrucciones,
    setInstrucciones,
    extrasSeleccionados,
    toggleExtra,
    incrementarCantidad,
    decrementarCantidad,
    agregarAlCarrito,
    total,
    esFavorito,
    toggleFavorito,
  };
};
