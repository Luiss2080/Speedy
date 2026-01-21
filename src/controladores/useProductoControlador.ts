import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { useCarrito } from "../context/ContextoCarrito";
import { Producto } from "../modelos/tipos";

export const useProductoControlador = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(1);
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
  };

  const incrementarCantidad = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCantidad((prev) => prev + 1);
  };

  const decrementarCantidad = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCantidad((prev) => Math.max(1, prev - 1));
  };

  const agregarAlCarrito = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    agregarItem({
      id: producto.id,
      nombre: producto.nombre,
      precio: producto.precio,
      cantidad: cantidad,
      restaurante: producto.restaurante,
    });
    router.push("/carrito" as any);
  };

  const total = (producto.precio * cantidad).toFixed(2);

  return {
    producto,
    cantidad,
    incrementarCantidad,
    decrementarCantidad,
    agregarAlCarrito,
    total,
  };
};
