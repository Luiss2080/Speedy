import { useState } from "react";
import { Recurso } from "../modelos/tipos";

// Note: Reusing Recurso type for simplicity, but conceptually these are "Resultados" (Dishes/Restaurants)
// Ideally we would use a proper type, but Recurso has title/description/category which fits.

export const useExplorarControlador = () => {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");

  const categorias = [
    "Todos",
    "Hamburguesas",
    "Pizza",
    "Sushi",
    "Postres",
    "Bebidas",
  ];

  const recursosIniciales: Recurso[] = [
    {
      id: "1",
      titulo: "Double Whopper",
      descripcion: "Burger King • 15-20 min • 4.5 ⭐",
      categoria: "Hamburguesas",
      imagen:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&w=500&q=80",
    },
    {
      id: "2",
      titulo: "Pepperoni Lover's",
      descripcion: "Pizza Hut • 30-40 min • 4.7 ⭐",
      categoria: "Pizza",
      imagen:
        "https://images.unsplash.com/photo-1628840042765-356cda07504e?ixlib=rb-4.0.3&w=500&q=80",
    },
    {
      id: "3",
      titulo: "Maki Acevichado",
      descripcion: "Edo Sushi Bar • 45 min • 4.8 ⭐",
      categoria: "Sushi",
      imagen:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?ixlib=rb-4.0.3&w=500&q=80",
    },
    {
      id: "4",
      titulo: "McFlurry Oreo",
      descripcion: "McDonald's • 10-15 min • 4.6 ⭐",
      categoria: "Postres",
      imagen:
        "https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&w=500&q=80",
    },
    {
      id: "5",
      titulo: "Inka Cola 1.5L",
      descripcion: "Bembos • 15 min • 5.0 ⭐",
      categoria: "Bebidas",
      imagen:
        "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?ixlib=rb-4.0.3&w=500&q=80",
    },
    {
      id: "6",
      titulo: "Cheeseburger Clásica",
      descripcion: "Bembos • 15-20 min • 4.4 ⭐",
      categoria: "Hamburguesas",
      imagen:
        "https://images.unsplash.com/photo-1550547660-d9450f859349?ixlib=rb-4.0.3&w=500&q=80",
    },
  ];

  const recursosFiltrados = recursosIniciales.filter((r) => {
    const coincideBusqueda =
      r.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
      r.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria =
      categoriaActiva === "Todos" || r.categoria === categoriaActiva;

    return coincideBusqueda && coincideCategoria;
  });

  return {
    busqueda,
    setBusqueda,
    recursosFiltrados,
    categoriaActiva,
    setCategoriaActiva,
    categorias,
  };
};
