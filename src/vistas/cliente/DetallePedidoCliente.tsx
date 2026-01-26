import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetallePedidoCliente() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { id } = params;

  // Mock tracking steps
  const steps = [
    { title: "Confirmado", time: "14:30", active: true },
    { title: "Preparando", time: "14:35", active: true },
    { title: "En Camino", time: "14:50", active: false },
    { title: "Entregado", time: "-", active: false },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <FontAwesome5 name="arrow-left" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Pedido #{id}</Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Status Tracker */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Estado del Pedido</Text>
          <View style={styles.timeline}>
            {steps.map((step, index) => (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepIndicator}>
                  <View
                    style={[
                      styles.dot,
                      step.active ? styles.dotActive : styles.dotInactive,
                    ]}
                  />
                  {index < steps.length - 1 && (
                    <View
                      style={[
                        styles.line,
                        step.active ? styles.lineActive : styles.lineInactive,
                      ]}
                    />
                  )}
                </View>
                <View style={styles.stepContent}>
                  <Text
                    style={[
                      styles.stepTitle,
                      step.active ? styles.textActive : styles.textInactive,
                    ]}
                  >
                    {step.title}
                  </Text>
                  <Text style={styles.stepTime}>{step.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.card}>
          <View style={styles.row}>
            <FontAwesome5 name="map-marker-alt" size={20} color="#EA052C" />
            <View style={{ marginLeft: 15 }}>
              <Text style={styles.label}>Dirección de Entrega</Text>
              <Text style={styles.value}>Av. Banzer, Calle 3 #450</Text>
            </View>
          </View>
        </View>

        {/* Driver Info (Conditional) */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Tu Repartidor</Text>
          <View style={styles.driverRow}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/32.jpg" }}
              style={styles.driverAvatar}
            />
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.driverName}>Carlos M.</Text>
              <Text style={styles.driverBike}>Honda Cargo • 2839-XYZ</Text>
            </View>
            <TouchableOpacity style={styles.phoneBtn}>
              <FontAwesome5 name="phone" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.itemText}>1x Whopper Combo</Text>
            <Text style={styles.itemPrice}>$15.50</Text>
          </View>
          <View style={styles.divider} />
          <View style={[styles.summaryRow, { marginTop: 10 }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>$15.50</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B" },
  backBtn: { padding: 5 },
  scroll: { padding: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 15,
  },

  timeline: { marginLeft: 10 },
  stepRow: { flexDirection: "row", height: 60 },
  stepIndicator: { alignItems: "center", marginRight: 15, width: 20 },
  dot: { width: 12, height: 12, borderRadius: 6 },
  dotActive: { backgroundColor: "#10B981" },
  dotInactive: { backgroundColor: "#E2E8F0" },
  line: { width: 2, flex: 1, marginTop: 5 },
  lineActive: { backgroundColor: "#10B981" },
  lineInactive: { backgroundColor: "#E2E8F0" },
  stepContent: { flex: 1, marginTop: -3 },
  stepTitle: { fontSize: 14, fontWeight: "600" },
  textActive: { color: "#1E293B" },
  textInactive: { color: "#94A3B8" },
  stepTime: { fontSize: 12, color: "#94A3B8" },

  row: { flexDirection: "row", alignItems: "center" },
  label: { color: "#94A3B8", fontSize: 12 },
  value: { color: "#1E293B", fontWeight: "500", fontSize: 14 },

  driverRow: { flexDirection: "row", alignItems: "center" },
  driverAvatar: { width: 50, height: 50, borderRadius: 25 },
  driverName: { fontWeight: "bold", color: "#1E293B" },
  driverBike: { color: "#64748B", fontSize: 12 },
  phoneBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#10B981",
    justifyContent: "center",
    alignItems: "center",
  },

  summaryRow: { flexDirection: "row", justifyContent: "space-between" },
  itemText: { color: "#475569" },
  itemPrice: { color: "#475569", fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 10 },
  totalLabel: { fontWeight: "bold", fontSize: 16, color: "#1E293B" },
  totalValue: { fontWeight: "bold", fontSize: 18, color: "#EA052C" },
});
