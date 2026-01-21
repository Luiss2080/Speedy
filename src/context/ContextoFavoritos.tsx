import React, { createContext, useContext, useState } from "react";
import { Producto } from "../modelos/tipos";

type FavoritoItem = {
  id: string;
  nombre: string;
  imagen: string;
  rating: number; // Storing minimal info for the list
  precio: number;
};

type ContextoFavoritosType = {
  favoritos: FavoritoItem[];
  toggleFavorito: (producto: Producto) => void;
  esFavorito: (id: string) => boolean;
};

const ContextoFavoritos = createContext<ContextoFavoritosType | undefined>(
  undefined,
);

export const FavoritosProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favoritos, setFavoritos] = useState<FavoritoItem[]>([
    {
      id: "1",
      nombre: "Hamburguesa Doble",
      rating: 4.8,
      precio: 8.5,
      imagen:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
    {
      id: "2",
      nombre: "Papas Fritas",
      rating: 4.5,
      precio: 3.5,
      imagen:
        "https://images.unsplash.com/photo-1573080496987-a199f8cd4054?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    },
  ]);

  const toggleFavorito = (producto: Producto) => {
    setFavoritos((prev) => {
      const existe = prev.some((fav) => fav.id === producto.id);
      if (existe) {
        return prev.filter((fav) => fav.id !== producto.id);
      } else {
        return [
          ...prev,
          {
            id: producto.id,
            nombre: producto.nombre,
            imagen: producto.imagen,
            rating: 4.5, // Default or derived from product if available
            precio: producto.precio,
          },
        ];
      }
    });
  };

  const esFavorito = (id: string) => {
    return favoritos.some((fav) => fav.id === id);
  };

  return (
    <ContextoFavoritos.Provider
      value={{ favoritos, toggleFavorito, esFavorito }}
    >
      {children}
    </ContextoFavoritos.Provider>
  );
};

export const useFavoritos = () => {
  const context = useContext(ContextoFavoritos);
  if (!context)
    throw new Error("useFavoritos debe usarse dentro de FavoritosProvider");
  return context;
};
