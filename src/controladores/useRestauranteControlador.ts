import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Producto } from "../modelos/tipos";

export const useRestauranteControlador = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("Todos");

  // Mock Data
  const categorias = ["Todos", "Hamburguesas", "Bebidas", "Postres", "Combos"];

  const restaurante = {
    id: id as string,
    nombre: "Burger King",
    calificacion: 4.5,
    tiempo: "30-45 min",
    envio: 2.0,
    imagen:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  };

  const productos: Producto[] = [
    {
      id: "1",
      nombre: "Hamburguesa Doble",
      descripcion: "Doble carne, queso cheddar, bacon.",
      precio: 8.5,
      imagen:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      restaurante: "Burger King",
      extrasDisponibles: [], // Simplified for list
    },
    {
      id: "2",
      nombre: "Papas Fritas",
      descripcion: "Porción grande con salsa especial.",
      precio: 3.5,
      imagen:
        "https://images.unsplash.com/photo-1573080496987-a199f8cd4054?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      restaurante: "Burger King",
    },
    {
      id: "3",
      nombre: "Refresco",
      descripcion: "Coca-Cola 500ml.",
      precio: 1.5,
      imagen:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      restaurante: "Burger King",
    },
  ];

  const productosFiltrados =
    categoriaSeleccionada === "Todos" ? productos : productos; // In a real app, filter by category property

  return {
    restaurante,
    categorias,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    productos: productosFiltrados,
    router,
  };
};
