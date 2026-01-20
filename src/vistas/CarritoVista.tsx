import { FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useCarrito } from "../context/ContextoCarrito";
import { CarritoEstilos } from "../estilos/CarritoEstilos";

export default function CarritoVista() {
  const router = useRouter();
  const { items, total, removerItem } = useCarrito();

  return (
    <View style={CarritoEstilos.contenedor}>
      <View style={CarritoEstilos.encabezado}>
        <Text style={CarritoEstilos.titulo}>Tu Canasta ({items.length})</Text>
      </View>

      <ScrollView contentContainerStyle={CarritoEstilos.lista}>
        {items.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 50 }}>
            <FontAwesome5 name="shopping-basket" size={50} color="#cbd5e1" />
            <Text style={{ marginTop: 20, color: "#64748b" }}>
              Tu canasta está vacía
            </Text>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={CarritoEstilos.item}>
              <View style={CarritoEstilos.itemInfo}>
                <Text style={CarritoEstilos.cantidadBadge}>
                  {item.cantidad}x
                </Text>
                <View>
                  <Text style={CarritoEstilos.itemNombre}>{item.nombre}</Text>
                  <Text style={{ fontSize: 12, color: "#94a3b8" }}>
                    {item.restaurante}
                  </Text>
                </View>
              </View>
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <Text style={CarritoEstilos.itemPrecio}>
                  ${(item.precio * item.cantidad).toFixed(2)}
                </Text>
                <TouchableOpacity onPress={() => removerItem(item.id)}>
                  <FontAwesome5 name="trash" size={14} color="#ef4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {items.length > 0 && (
          <View style={CarritoEstilos.resumen}>
            <View style={CarritoEstilos.filaResumen}>
              <Text style={CarritoEstilos.textoResumen}>Subtotal</Text>
              <Text style={CarritoEstilos.textoResumen}>
                ${total.toFixed(2)}
              </Text>
            </View>
            <View style={CarritoEstilos.filaResumen}>
              <Text style={CarritoEstilos.textoResumen}>Envío</Text>
              <Text style={CarritoEstilos.textoResumen}>$2.00</Text>
            </View>
            <View style={CarritoEstilos.filaResumen}>
              <Text style={CarritoEstilos.textoTotal}>Total</Text>
              <Text style={CarritoEstilos.textoTotal}>
                ${(total + 2.0).toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={CarritoEstilos.botonPagar}
              activeOpacity={0.8}
              onPress={() => {
                Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Success,
                );
                router.push("/seguimiento/nuevo");
              }}
            >
              <Text style={CarritoEstilos.textoBoton}>Confirmar Pedido</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
