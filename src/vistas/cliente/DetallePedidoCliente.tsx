import { Redirect } from "expo-router";
import React from "react";

export default function DetallePedidoCliente() {
  // Redirect to the Orders tab (or home) since this standalone view is deprecated
  // and we want users to use the modal in SeguimientoVista or the main list.
  return <Redirect href="/(client-tabs)/pedidos" />;
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
