import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { PedidosEstilos } from "../estilos/PedidosEstilos";
import { API_URL } from "../servicios/BaseDeDatos";

export default function PedidosVista() {
  const router = useRouter();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const cargarPedidos = async () => {
    try {
      setLoading(true);
      // In real app, filter by logged in user ID, e.g. ?usuario_id=1
      const res = await fetch(`${API_URL}/api/pedidos?usuario_id=1`);
      const data = await res.json();
      setPedidos(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      cargarPedidos();
    }, []),
  );

  const getEstadoColor = (estado: string) => {
    switch (estado.toLowerCase()) {
      case "entregado":
        return "#10b981";
      case "pendiente":
        return "#eab308";
      case "en camino":
        return "#3b82f6";
      case "cancelado":
        return "#ef4444";
      default:
        return "#64748b";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <View style={PedidosEstilos.contenedor}>
      <View style={PedidosEstilos.encabezado}>
        <Text style={PedidosEstilos.titulo}>Mis Pedidos</Text>
      </View>

      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#C21833" />
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={PedidosEstilos.lista}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
              No tienes pedidos aún.
            </Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                PedidosEstilos.tarjeta,
                { borderLeftColor: getEstadoColor(item.estado) },
              ]}
              onPress={() => router.push(`/seguimiento/${item.id}`)}
            >
              <View style={PedidosEstilos.filaEncabezado}>
                <Text style={PedidosEstilos.nombreRestaurante}>
                  {item.restaurante_nombre || "Restaurante"}
                </Text>
                <Text style={PedidosEstilos.fecha}>
                  {formatDate(item.fecha_creacion)}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 5,
                }}
              >
                <Text
                  style={[
                    PedidosEstilos.estado,
                    { color: getEstadoColor(item.estado) },
                  ]}
                >
                  {item.estado.toUpperCase()}
                </Text>
                <Text style={{ fontWeight: "bold", color: "#C21833" }}>
                  {item.tipo_servicio === "retiro" ? "RETIRO" : "DELIVERY"}
                </Text>
              </View>
              <Text style={PedidosEstilos.detalles}>Ver seguimiento</Text>
              <Text style={PedidosEstilos.total}>
                ${parseFloat(item.total_final).toFixed(2)}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
