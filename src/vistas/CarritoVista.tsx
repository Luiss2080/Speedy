import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCarritoControlador } from "../controladores/useCarritoControlador";
import { CarritoEstilos } from "../estilos/CarritoEstilos";
import { API_URL } from "../servicios/BaseDeDatos";
import { useAuthStore } from "../stores/useAuthStore";

export default function CarritoVista() {
  const {
    // ... values
    items,
    subtotal,
    costoEnvio,
    totalPagar,
    eliminarItem,
    vaciarCarrito,
    procederAlPago,
    seguirComprando,
    incrementar,
    decrementar,
    metodoPago,
    setMetodoPago,
    notas,
    setNotas,
    direccionEntrega,
    tipoServicio,
    setTipoServicio,
    router,
    cupon,
    aplicarCupon,
    removerCupon,
    descuento,
  } = useCarritoControlador();

  const { user } = useAuthStore();
  const [tarjetas, setTarjetas] = useState<any[]>([]);
  const [modalTarjetasVisible, setModalTarjetasVisible] = useState(false);
  const [tarjetaSeleccionada, setTarjetaSeleccionada] = useState<any>(null);

  useEffect(() => {
    if (user && metodoPago === "Tarjeta") {
      fetchTarjetas();
    }
  }, [user, metodoPago]);

  const fetchTarjetas = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pagos/${user?.id}`);
      const data = await res.json();
      setTarjetas(data);
      if (data.length > 0 && !tarjetaSeleccionada) {
        setTarjetaSeleccionada(data[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const seleccionarTarjeta = (tarjeta: any) => {
    setTarjetaSeleccionada(tarjeta);
    setModalTarjetasVisible(false);
  };

  // ... (keeping return content mostly same until summary)

  // Skipping map rendering for brevity in this instruction, focusing on replacing the SUMMARY section
  // BUT I need to replace a contiguous block, so I will target the summary block specifically if possible,
  // or the whole file if I must. The diff tool works best with precise target.
  // I will target the summary block using surrounding lines.

  return (
    <View style={CarritoEstilos.contenedor}>
      {/* ... header ... */}
      <View
        style={[
          CarritoEstilos.encabezado,
          { flexDirection: "row", justifyContent: "space-between" },
        ]}
      >
        <Text style={CarritoEstilos.titulo}>Tu Canasta ({items.length})</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={vaciarCarrito}>
            <Text style={{ color: "#ef4444", fontWeight: "bold" }}>Vaciar</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView contentContainerStyle={CarritoEstilos.lista}>
        {items.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <FontAwesome5 name="shopping-basket" size={50} color="#cbd5e1" />
            <Text style={{ marginTop: 20, color: "#64748b", marginBottom: 20 }}>
              Tu canasta está vacía
            </Text>
            <TouchableOpacity
              onPress={seguirComprando}
              style={{
                backgroundColor: "#fff",
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: "#C21833",
              }}
            >
              <Text style={{ color: "#C21833", fontWeight: "bold" }}>
                Seguir Comprando
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          items.map((item) => (
            // ... item item ...
            <View key={item.id} style={CarritoEstilos.item}>
              <View style={[CarritoEstilos.itemInfo, { flex: 1 }]}>
                {/* Quantity Controls */}
                <View style={{ alignItems: "center", marginRight: 15 }}>
                  <TouchableOpacity
                    onPress={() => incrementar(item.id, item.cantidad)}
                    style={{ padding: 5 }}
                  >
                    <FontAwesome5
                      name="plus-circle"
                      size={20}
                      color="#EA052C"
                    />
                  </TouchableOpacity>
                  <Text
                    style={{
                      fontWeight: "bold",
                      fontSize: 16,
                      marginVertical: 5,
                    }}
                  >
                    {item.cantidad}
                  </Text>
                  <TouchableOpacity
                    onPress={() => decrementar(item.id, item.cantidad)}
                    style={{ padding: 5 }}
                  >
                    <FontAwesome5
                      name="minus-circle"
                      size={20}
                      color={item.cantidad > 1 ? "#EA052C" : "#94A3B8"}
                    />
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={CarritoEstilos.itemNombre}>{item.nombre}</Text>

                  {item.extrasSeleccionados &&
                    item.extrasSeleccionados.length > 0 && (
                      <View style={CarritoEstilos.itemDetalles}>
                        {item.extrasSeleccionados.map((extra, idx) => (
                          <Text key={idx} style={CarritoEstilos.textoExtra}>
                            + {extra.nombre}
                          </Text>
                        ))}
                      </View>
                    )}

                  {item.instrucciones ? (
                    <Text style={CarritoEstilos.textoInstruccion}>
                      "{item.instrucciones}"
                    </Text>
                  ) : null}

                  <Text
                    style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}
                  >
                    {item.restaurante}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 15, // increased gap
                  marginLeft: 10,
                }}
              >
                <Text style={CarritoEstilos.itemPrecio}>
                  ${(item.precio * item.cantidad).toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => eliminarItem(item.id)}>
                  <FontAwesome5 name="trash" size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {items.length > 0 && (
          <View style={CarritoEstilos.resumen}>
            {/* Service Type Toggle */}
            <View style={{ flexDirection: "row", marginBottom: 20 }}>
              <TouchableOpacity
                style={[
                  CarritoEstilos.botonToggle,
                  tipoServicio === "delivery" &&
                    CarritoEstilos.botonToggleActivo,
                ]}
                onPress={() => setTipoServicio("delivery")}
              >
                <MaterialCommunityIcons
                  name="moped"
                  size={20}
                  color={tipoServicio === "delivery" ? "#e11d48" : "#64748b"}
                />
                <Text
                  style={[
                    CarritoEstilos.textoToggle,
                    tipoServicio === "delivery" &&
                      CarritoEstilos.textoToggleActivo,
                  ]}
                >
                  Delivery
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  CarritoEstilos.botonToggle,
                  tipoServicio === "retiro" && CarritoEstilos.botonToggleActivo,
                ]}
                onPress={() => setTipoServicio("retiro")}
              >
                <MaterialCommunityIcons
                  name="store"
                  size={20}
                  color={tipoServicio === "retiro" ? "#e11d48" : "#64748b"}
                />
                <Text
                  style={[
                    CarritoEstilos.textoToggle,
                    tipoServicio === "retiro" &&
                      CarritoEstilos.textoToggleActivo,
                  ]}
                >
                  Retiro
                </Text>
              </TouchableOpacity>
            </View>

            {/* Delivery Details Section */}
            <View style={{ marginBottom: 20 }}>
              <Text style={CarritoEstilos.tituloSeccion}>
                {tipoServicio === "delivery"
                  ? "Detalles de Entrega"
                  : "Detalles de Retiro"}
              </Text>

              {/* Origin */}
              <View style={CarritoEstilos.filaDetalle}>
                <FontAwesome5 name="store" size={16} color="#64748b" />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={CarritoEstilos.textoEtiqueta}>Origen</Text>
                  <Text style={CarritoEstilos.textoValor}>
                    {items[0]?.restaurante || "Restaurante"}
                  </Text>
                </View>
              </View>

              {/* Destination/Pickup Point */}
              {tipoServicio === "delivery" ? (
                <TouchableOpacity
                  style={CarritoEstilos.filaDetalle}
                  onPress={() =>
                    router.push("/direcciones?modo=seleccion" as any)
                  }
                >
                  <FontAwesome5
                    name="map-marker-alt"
                    size={16}
                    color="#e11d48"
                  />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={CarritoEstilos.textoEtiqueta}>Destino</Text>
                    <Text style={CarritoEstilos.textoValor}>
                      {direccionEntrega
                        ? direccionEntrega.titulo
                        : "Seleccionar Dirección..."}
                    </Text>
                  </View>
                  <FontAwesome5
                    name="chevron-right"
                    size={14}
                    color="#cbd5e1"
                  />
                </TouchableOpacity>
              ) : (
                <View style={CarritoEstilos.filaDetalle}>
                  <FontAwesome5 name="walking" size={16} color="#64748b" />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={CarritoEstilos.textoEtiqueta}>
                      Punto de Retiro
                    </Text>
                    <Text style={CarritoEstilos.textoValor}>
                      Misma dirección del restaurante
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Payment Method Section */}
            <View style={{ marginBottom: 20 }}>
              <Text style={CarritoEstilos.tituloSeccion}>Método de Pago</Text>
              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                <TouchableOpacity
                  onPress={() => setMetodoPago("Efectivo")}
                  style={[
                    CarritoEstilos.botonMetodoPago,
                    metodoPago === "Efectivo" &&
                      CarritoEstilos.botonMetodoPagoActivo,
                  ]}
                >
                  <FontAwesome5
                    name="money-bill-wave"
                    size={16}
                    color={metodoPago === "Efectivo" ? "#C21833" : "#64748b"}
                  />
                  <Text
                    style={[
                      CarritoEstilos.textoMetodoPago,
                      metodoPago === "Efectivo" &&
                        CarritoEstilos.textoMetodoPagoActivo,
                    ]}
                  >
                    Efectivo
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setMetodoPago("Tarjeta")}
                  style={[
                    CarritoEstilos.botonMetodoPago,
                    metodoPago === "Tarjeta" &&
                      CarritoEstilos.botonMetodoPagoActivo,
                  ]}
                >
                  <FontAwesome5
                    name="credit-card"
                    size={16}
                    color={metodoPago === "Tarjeta" ? "#C21833" : "#64748b"}
                  />
                  <Text
                    style={[
                      CarritoEstilos.textoMetodoPago,
                      metodoPago === "Tarjeta" &&
                        CarritoEstilos.textoMetodoPagoActivo,
                    ]}
                  >
                    Tarjeta
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Card Selector */}
              {metodoPago === "Tarjeta" && (
                <View style={{ marginTop: 15 }}>
                  {tarjetas.length > 0 ? (
                    <TouchableOpacity
                      onPress={() => setModalTarjetasVisible(true)}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#f8fafc",
                        padding: 10,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: "#e2e8f0",
                      }}
                    >
                      <FontAwesome5
                        name={
                          tarjetaSeleccionada?.marca?.toLowerCase() === "visa"
                            ? "cc-visa"
                            : "cc-mastercard"
                        }
                        size={24}
                        color="#333"
                        style={{ marginRight: 10 }}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: "bold" }}>
                          {tarjetaSeleccionada?.marca || "Seleccionar"}
                        </Text>
                        <Text style={{ color: "#666" }}>
                          **** {tarjetaSeleccionada?.ultimos_digitos || "----"}
                        </Text>
                      </View>
                      <FontAwesome5
                        name="chevron-down"
                        size={14}
                        color="#94a3b8"
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => router.push("/perfil/pagos")}
                      style={{ padding: 10 }}
                    >
                      <Text style={{ color: "#C21833", fontWeight: "bold" }}>
                        + Agregar Tarjeta
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>

            {/* Notes Section */}
            <View style={{ marginBottom: 20 }}>
              <Text style={CarritoEstilos.tituloSeccion}>Notas del Pedido</Text>
              <TextInput
                style={CarritoEstilos.inputNotas}
                placeholder="Ej: Tocar el timbre, sin servilletas..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={2}
                value={notas}
                onChangeText={setNotas}
              />
            </View>

            <View style={CarritoEstilos.filaResumen}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <MaterialCommunityIcons
                  name="clipboard-text-outline"
                  size={16}
                  color="#6b7280"
                />
                <Text style={CarritoEstilos.textoResumen}>Subtotal</Text>
              </View>
              <Text style={CarritoEstilos.textoResumen}>
                ${subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={CarritoEstilos.filaResumen}>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <MaterialCommunityIcons name="bike" size={16} color="#6b7280" />
                <Text style={CarritoEstilos.textoResumen}>Envío</Text>
              </View>
              <Text style={CarritoEstilos.textoResumen}>
                ${costoEnvio.toFixed(2)}
              </Text>
            </View>
            <View
              style={[
                CarritoEstilos.filaResumen,
                {
                  marginTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: "#f1f5f9",
                  paddingTop: 10,
                },
              ]}
            >
              <Text style={CarritoEstilos.textoTotal}>Total</Text>
              <Text style={CarritoEstilos.textoTotal}>
                ${totalPagar.toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={CarritoEstilos.botonPagar}
              activeOpacity={0.8}
              onPress={procederAlPago}
            >
              <Text style={CarritoEstilos.textoBoton}>Confirmar Pedido</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Card Selection Modal */}
      <Modal visible={modalTarjetasVisible} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "flex-end",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "50%",
            }}
          >
            <Text
              style={{ fontSize: 18, fontWeight: "bold", marginBottom: 15 }}
            >
              Selecciona una Tarjeta
            </Text>
            <ScrollView>
              {tarjetas.map((t) => (
                <TouchableOpacity
                  key={t.id}
                  onPress={() => seleccionarTarjeta(t)}
                  style={{
                    padding: 15,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f1f5f9",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <FontAwesome5
                    name={
                      t.marca.toLowerCase() === "visa"
                        ? "cc-visa"
                        : "cc-mastercard"
                    }
                    size={24}
                    color="#333"
                    style={{ marginRight: 15 }}
                  />
                  <Text style={{ fontSize: 16 }}>
                    {t.marca} **** {t.ultimos_digitos}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setModalTarjetasVisible(false)}
              style={{
                marginTop: 20,
                padding: 15,
                backgroundColor: "#f1f5f9",
                borderRadius: 10,
                alignItems: "center",
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#666" }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
