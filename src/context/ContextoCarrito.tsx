import React, { createContext, useContext, useState } from "react";
import { ItemCarrito } from "../modelos/tipos";

type ContextoCarritoType = {
  items: ItemCarrito[];
  agregarItem: (item: ItemCarrito) => void;
  removerItem: (id: string) => void;
  actualizarCantidad: (id: string, cantidad: number) => void;
  total: number;
  limpiarCarrito: () => void;
  cantidadItems: number;
  metodoPago: string;
  setMetodoPago: (m: string) => void;
  notas: string;
  setNotas: (n: string) => void;
  direccionEntrega: any;
  setDireccionEntrega: (d: any) => void;
  tipoServicio: "delivery" | "retiro";
  setTipoServicio: (t: "delivery" | "retiro") => void;
  costoEnvio: number;
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

  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [notas, setNotas] = useState("");
  const [direccionEntrega, setDireccionEntrega] = useState<any>(null);
  const [tipoServicio, setTipoServicio] = useState<"delivery" | "retiro">(
    "delivery",
  );

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

  const limpiarCarrito = () => {
    setItems([]);
    setNotas("");
  };

  const actualizarCantidad = (id: string, cantidad: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const nuevaCantidad = Math.max(0, cantidad);
            return { ...item, cantidad: nuevaCantidad };
          }
          return item;
        })
        .filter((item) => item.cantidad > 0),
    );
  };

  const total = items.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0,
  );

  const cantidadItems = items.reduce((acc, item) => acc + item.cantidad, 0);
  const costoEnvio = tipoServicio === "retiro" ? 0.0 : 2.0;

  return (
    <ContextoCarrito.Provider
      value={{
        items,
        agregarItem,
        removerItem,
        actualizarCantidad,
        total,
        limpiarCarrito,
        cantidadItems,
        metodoPago,
        setMetodoPago,
        notas,
        setNotas,
        direccionEntrega,
        setDireccionEntrega,
        tipoServicio,
        setTipoServicio,
        costoEnvio,
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
