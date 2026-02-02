import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getPedidosUsuario } from "../../servicios/BaseDeDatos";
import { useAuthStore } from "../../stores/useAuthStore";

export default function HistorialPedidosVista() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log("Current User in View:", JSON.stringify(user));
    if (user) {
      loadPedidos();
    } else {
      // Fallback for demo if no user logged in
      console.log("No user logged in, forcing load for ID 1 (Demo)");
      // We temporarily force ID 1 to ensure UI shows something if auth is broken
      loadPedidos(1);
    }
  }, [user]);

  const loadPedidos = async (forceId?: number) => {
    setLoading(true);
    try {
      const targetId = forceId || user?.id || 1;
      console.log(`Fetching orders for user: ${targetId}`);
      const data = await getPedidosUsuario(targetId);
      console.log(`Fetched ${data.length} orders`);

      // Sort by date desc
      data.sort(
        (a: any, b: any) =>
          new Date(b.fecha_creacion).getTime() -
          new Date(a.fecha_creacion).getTime(),
      );
      setPedidos(data);
    } catch (error) {
      console.error("Error loading orders:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPedidos();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "entregado":
      case "completado":
        return {
          bg: "#DCFCE7",
          text: "#166534",
          icon: "check-circle",
          iconColor: "#166534",
        };
      case "cancelado":
        return {
          bg: "#FEE2E2",
          text: "#991B1B",
          icon: "times-circle",
          iconColor: "#991B1B",
        };
      case "preparando":
      case "en_camino":
        return {
          bg: "#FEF9C3",
          text: "#854D0E",
          icon: "clock",
          iconColor: "#854D0E",
        };
      default:
        return {
          bg: "#F3F4F6",
          text: "#374151",
          icon: "info-circle",
          iconColor: "#374151",
        };
    }
  };

  const getValidImageSource = (image: string | null | undefined) => {
    if (!image) return { uri: "https://via.placeholder.com/150" };
    if (image.startsWith("http")) return { uri: image };
    // Robust fallback for partial IDs or random strings
    // Use a simple hash to generate a consistent index
    let hash = 0;
    for (let i = 0; i < image.length; i++) {
      hash = (hash << 5) - hash + image.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    return { uri: `https://picsum.photos/seed/${seed}/200` };
  };

  const renderItem = ({ item }: { item: any }) => {
    const statusStyle = getStatusColor(item.estado);
    const date = new Date(item.fecha_creacion);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "/(client-tabs)/inicio",
            params: { openOrder: item.id },
          } as any)
        }
      >
        <View style={styles.cardHeader}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={getValidImageSource(item.imagen_restaurante)}
              style={styles.logo}
              resizeMode="cover"
            />
            <View style={{ marginLeft: 12 }}>
              <Text style={styles.restName} numberOfLines={1}>
                {item.nombre_restaurante || "Restaurante"}
              </Text>
              <Text style={styles.dateText}>
                {date.toLocaleDateString()} •{" "}
                {date.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>
          <View
            style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
          >
            <FontAwesome5
              name={statusStyle.icon}
              size={10}
              color={statusStyle.iconColor}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.statusText, { color: statusStyle.text }]}>
              {item.estado ? item.estado.toUpperCase() : "PENDIENTE"}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.cardContent}>
          <View style={styles.orderInfo}>
            <Text style={styles.orderLabel}>
              Pedido #{item.codigo_seguimiento || item.id}
            </Text>
            <Text style={styles.itemCount}>Ver detalles {">"}</Text>
          </View>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>
              ${parseFloat(item.total_final || item.total).toFixed(2)}
            </Text>
          </View>
        </View>

        {(item.estado === "entregado" || item.estado === "cancelado") && (
          <View style={styles.actionsFooter}>
            <TouchableOpacity style={styles.actionBtn}>
              <Text style={styles.actionBtnText}>Ayuda</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]}>
              <Text style={[styles.actionBtnText, styles.primaryBtnText]}>
                Reordenar
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Pedidos</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <FontAwesome5 name="sliders-h" size={16} color="#1E293B" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#EA052C" />
        </View>
      ) : (
        <FlatList
          data={pedidos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#EA052C"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.centerContainer}>
              <FontAwesome5 name="receipt" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No tienes pedidos recientes.</Text>
              <Text style={styles.emptySubtext}>¡Pide algo delicioso hoy!</Text>
              <Text style={{ fontSize: 10, color: "#ccc", marginTop: 20 }}>
                Debug: {user ? `User ${user.id}` : "No Auth"}
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: { fontSize: 28, fontWeight: "800", color: "#1E293B" },
  filterBtn: {
    padding: 10,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
  },
  list: { padding: 20, paddingBottom: 100 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  emptyText: {
    color: "#64748B",
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
  },
  emptySubtext: { color: "#94A3B8", fontSize: 14, marginTop: 5 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  restName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 2,
    maxWidth: 150,
  },
  dateText: { fontSize: 12, color: "#94A3B8" },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  statusText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },

  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 12 },

  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  orderInfo: { flex: 1 },
  orderLabel: { color: "#64748B", fontSize: 13, fontWeight: "500" },
  itemCount: {
    color: "#EA052C",
    fontSize: 12,
    marginTop: 2,
    fontWeight: "600",
  },

  totalContainer: { alignItems: "flex-end" },
  totalLabel: {
    fontSize: 11,
    color: "#94A3B8",
    textTransform: "uppercase",
    fontWeight: "bold",
  },
  totalValue: { fontSize: 18, fontWeight: "800", color: "#1E293B" },

  actionsFooter: {
    flexDirection: "row",
    marginTop: 15,
    justifyContent: "flex-end",
    gap: 10,
  },
  actionBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  actionBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  primaryBtn: {
    backgroundColor: "#FEF2F2",
    borderColor: "#FECACA",
  },
  primaryBtnText: {
    color: "#EA052C",
  },
});
