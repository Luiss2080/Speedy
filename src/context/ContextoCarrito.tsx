import React, { createContext, useContext, useState } from "react";
import { ItemCarrito } from "../modelos/tipos";

type ContextoCarritoType = {
  items: ItemCarrito[];
  agregarItem: (item: ItemCarrito) => void;
  removerItem: (id: string) => void;
  total: number;
  limpiarCarrito: () => void;
  cantidadItems: number;
};

const ContextoCarrito = createContext<ContextoCarritoType | undefined>(
  undefined,
);

export const CarritoProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [items, setItems] = useState<ItemCarrito[]>([]);

  const agregarItem = (nuevoItem: ItemCarrito) => {
    setItems((prevItems) => {
      const existente = prevItems.find((i) => i.id === nuevoItem.id);
      if (existente) {
        return prevItems.map((i) =>
          i.id === nuevoItem.id
            ? { ...i, cantidad: i.cantidad + nuevoItem.cantidad }
            : i,
        );
      }
      return [...prevItems, nuevoItem];
    });
  };

  const removerItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const limpiarCarrito = () => setItems([]);

  const total = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const cantidadItems = items.reduce((acc, item) => acc + item.cantidad, 0);

  return (
    <ContextoCarrito.Provider
      value={{
        items,
        agregarItem,
        removerItem,
        total,
        limpiarCarrito,
        cantidadItems,
      }}
    >
      {children}
    </ContextoCarrito.Provider>
  );
};

export const useCarrito = () => {
  const context = useContext(ContextoCarrito);
  if (!context)
    throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return context;
};
