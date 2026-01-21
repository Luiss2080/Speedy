import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useCarritoControlador } from "../controladores/useCarritoControlador";
import { CarritoEstilos } from "../estilos/CarritoEstilos";

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
  } = useCarritoControlador();

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
                <Text style={CarritoEstilos.cantidadBadge}>
                  {item.cantidad}x
                </Text>
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
    </View>
  );
}
