import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PedidosEstilos } from "../../src/estilos/PedidosEstilos";
import { API_URL } from "../../src/servicios/BaseDeDatos";
import { useAuthStore } from "../../src/stores/useAuthStore";

export default function DriverDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [disponible, setDisponible] = useState(true);
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) cargarPedidosDisponibles();
  }, [user]);

  const cargarPedidosDisponibles = async () => {
    try {
      setLoading(true);
      // Fetch orders pending assignment or assigned to me
      // For demo, just fetching all 'pendiente' for now or simulating
      const res = await fetch(`${API_URL}/api/pedidos?estado=pendiente`);
      const data = await res.json();
      setPedidos(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const tomarPedido = async (id: number) => {
    // Logic to assign order to driver
    // For now just route to details or show alert
    alert(`Pedido #${id} aceptado`);
  };

  return (
    <View style={PedidosEstilos.contenedor}>
      <View style={PedidosEstilos.encabezado}>
        <View>
          <Text style={PedidosEstilos.titulo}>Hola, {user?.nombre}</Text>
          <Text style={{ color: "#666" }}>
            {disponible ? "Estás Conectado" : "Estás Desconectado"}
          </Text>
        </View>
        <Switch
          value={disponible}
          onValueChange={setDisponible}
          trackColor={{ false: "#767577", true: "#C21833" }}
          thumbColor={disponible ? "#fff" : "#f4f3f4"}
        />
      </View>

      <Text style={{ fontSize: 18, fontWeight: "bold", margin: 20 }}>
        Pedidos Disponibles
      </Text>

      {loading ? (
        <ActivityIndicator size="large" color="#C21833" />
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={PedidosEstilos.lista}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
              No hay pedidos disponibles en este momento.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={PedidosEstilos.tarjeta}>
              <View style={PedidosEstilos.filaEncabezado}>
                <Text style={PedidosEstilos.nombreRestaurante}>
                  Pedido #{item.id}
                </Text>
                <Text style={PedidosEstilos.total}>
                  ${parseFloat(item.total_final).toFixed(2)}
                </Text>
              </View>
              <Text style={{ color: "#666", marginVertical: 5 }}>
                {item.restaurante_nombre || "Restaurante Desconocido"}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5
                    name="map-marker-alt"
                    size={14}
                    color="#C21833"
                  />
                  <Text style={{ marginLeft: 5, color: "#444" }}>2.5 km</Text>
                </View>
                <TouchableOpacity
                  onPress={() => tomarPedido(item.id)}
                  style={{
                    backgroundColor: "#C21833",
                    paddingVertical: 8,
                    paddingHorizontal: 15,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ color: "#fff", fontWeight: "bold" }}>
                    Aceptar
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
