import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useCarrito } from "../context/ContextoCarrito";
import { Producto } from "../modelos/tipos";

export const useProductoControlador = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(1);
  const [instrucciones, setInstrucciones] = useState("");
  const [extrasSeleccionados, setExtrasSeleccionados] = useState<string[]>([]);
  const [esFavorito, setEsFavorito] = useState(false);
  const { agregarItem } = useCarrito();

  // Mock product data - in a real app this would come from an API or database
  const producto: Producto = {
    id: id as string,
    nombre: "Hamburguesa Doble",
    descripcion:
      "Deliciosa hamburguesa con doble carne 100% vacuna, queso cheddar fundido, tocino crujiente, cebolla caramelizada y nuestra salsa especial de la casa.",
    precio: 8.5,
    imagen:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    restaurante: "Burger King",
    calorias: 850,
    tiempoPreparacion: "15-20 min",
    extrasDisponibles: [
      { id: "e1", nombre: "Queso Extra", precio: 1.5 },
      { id: "e2", nombre: "Tocino Extra", precio: 2.0 },
      { id: "e3", nombre: "Pepinillos Picantes", precio: 0.5 },
      { id: "e4", nombre: "Salsa BBQ", precio: 0.75 },
    ],
  };

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setEsFavorito((prev) => !prev);
  };

  const precioUnitarioConExtras = useMemo(() => {
    const costoExtras =
      producto.extrasDisponibles
        ?.filter((e) => extrasSeleccionados.includes(e.id))
        .reduce((sum, e) => sum + e.precio, 0) || 0;
    return producto.precio + costoExtras;
  }, [producto, extrasSeleccionados]);

  const total = (precioUnitarioConExtras * cantidad).toFixed(2);

  const agregarAlCarrito = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Obtener objetos Extra completos
    const extrasObj = producto.extrasDisponibles?.filter((e) =>
      extrasSeleccionados.includes(e.id),
    );

    agregarItem({
      id: producto.id + Date.now(), // ID único para el carrito por si hay variantes
      nombre: producto.nombre,
      precio: precioUnitarioConExtras,
      cantidad: cantidad,
      restaurante: producto.restaurante,
      extrasSeleccionados: extrasObj,
      instrucciones: instrucciones.trim(),
    });
    router.push("/carrito" as any);
  };

  return {
    producto,
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
