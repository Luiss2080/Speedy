import React, { createContext, useContext, useState } from "react";
import { ItemCarrito } from "../modelos/tipos";
import { API_URL } from "../servicios/BaseDeDatos";

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
  cotizarEnvio: (
    restauranteId: number,
    direccionId: number,
    tipoServicio: string,
  ) => void;
  cupon: any;
  subTotal: number;
  descuento: number;
  aplicarCupon: (codigo: string) => Promise<boolean>;
  removerCupon: () => void;
};

export const ContextoCarrito = createContext<ContextoCarritoType | undefined>(
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
  const [costoEnvio, setCostoEnvio] = useState(2.0);
  /* Coupon State */
  const [cupon, setCupon] = useState<any>(null);

  // ... (existing helper)

  const cotizarEnvio = async (
    restauranteId: number,
    direccionId: number,
    tipoServicio: string,
  ) => {
    // ... (keep logic)
    if (tipoServicio === "retiro") {
      setCostoEnvio(0);
      return;
    }
    // ... (keep fetch logic)
    try {
      // ...
      // Use centralized API_URL
      const res = await fetch(`${API_URL}/cotizar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurante_id: restauranteId,
          direccion_entrega_id: direccionId,
          tipo_vehiculo: "moto",
        }),
      });
      const data = await res.json();
      if (data.costo_envio) {
        // Check if free shipping coupon applied
        if (cupon && cupon.tipo === "envio_gratis") {
          setCostoEnvio(0);
        } else {
          setCostoEnvio(data.costo_envio);
        }
      }
    } catch (e) {
      setCostoEnvio(2.0);
    }
  };

  const aplicarCupon = async (codigo: string) => {
    try {
      const res = await fetch(`${API_URL}/cupones/validar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ codigo }),
      });
      const data = await res.json();
      if (data.success) {
        setCupon(data);
        // If free shipping, update cost immediately
        if (data.tipo === "envio_gratis") setCostoEnvio(0);
        return true;
      } else {
        setCupon(null);
        return false;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const removerCupon = () => {
    setCupon(null);
    // Re-trigger quote or reset default if needed, for now just simplistic
    if (tipoServicio === "delivery") setCostoEnvio(2.0); // Would be better to re-quote
  };

  const agregarItem = (nuevoItem: ItemCarrito) => {
    setItems((prev) => {
      // Simple logic: if exists (same ID), increment quantity.
      // Note: In a real app, you might compare extras/options too.
      const index = prev.findIndex((i) => i.id === nuevoItem.id);
      if (index >= 0) {
        const newItems = [...prev];
        newItems[index].cantidad += nuevoItem.cantidad;
        return newItems;
      }
      return [...prev, nuevoItem];
    });
  };

  const removerItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const actualizarCantidad = (id: string, cantidad: number) => {
    if (cantidad < 1) {
      removerItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, cantidad } : item)),
    );
  };

  const limpiarCarrito = () => {
    setItems([]);
    setCupon(null);
    setCostoEnvio(2.0);
  };

  const subTotal = items.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0,
  );

  // Calculate Discount
  let descuento = 0;
  if (cupon) {
    if (cupon.tipo === "porcentaje") {
      descuento = subTotal * (cupon.descuento / 100);
    } else if (cupon.tipo === "monto_fijo") {
      descuento = cupon.descuento;
    }
    // envio_gratis is handled in costoEnvio variable directly or separately
  }

  // Ensure total doesn't go negative
  const total = Math.max(0, subTotal - descuento);

  return (
    <ContextoCarrito.Provider
      value={{
        items,
        // ...
        subTotal, // Expose subtotal
        descuento, // Expose discount
        cupon, // Expose coupon object
        aplicarCupon,
        removerCupon,

        agregarItem,
        removerItem,
        actualizarCantidad,
        total, // Net Total
        limpiarCarrito,
        cantidadItems: items.length,
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
