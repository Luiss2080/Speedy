import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";

export default function DriverGanancias() {
  return (
    <View style={styles.container}>
      <LinearGradient colors={["#C21833", "#9f1239"]} style={styles.header}>
        <Text style={styles.headerTitle}>Mis Ganancias</Text>
        <Text style={styles.totalAmount}>$450.00</Text>
        <Text style={styles.subtext}>Esta semana</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.statRow}>
          <View style={styles.statCard}>
            <FontAwesome5 name="check-circle" size={24} color="#C21833" />
            <Text style={styles.statValue}>24</Text>
            <Text style={styles.statLabel}>Completados</Text>
          </View>
          <View style={styles.statCard}>
            <FontAwesome5 name="clock" size={24} color="#eab308" />
            <Text style={styles.statValue}>12h</Text>
            <Text style={styles.statLabel}>En Línea</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Historial Reciente</Text>

        {/* Mock List */}
        {[1, 2, 3].map((i) => (
          <View key={i} style={styles.historyItem}>
            <View>
              <Text style={styles.historyDate}>Hoy, 14:30 PM</Text>
              <Text style={styles.historyId}>Pedido #{100 + i}</Text>
            </View>
            <Text style={styles.historyAmount}>+$15.00</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    padding: 30,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: { color: "#fff", fontSize: 18, marginBottom: 10 },
  totalAmount: { color: "#fff", fontSize: 40, fontWeight: "bold" },
  subtext: { color: "rgba(255,255,255,0.8)" },
  content: { padding: 20 },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: "#fff",
    width: "48%",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    elevation: 3,
  },
  statValue: { fontSize: 24, fontWeight: "bold", marginVertical: 5 },
  statLabel: { color: "#64748b" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  historyItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  historyDate: { color: "#64748b", fontSize: 12 },
  historyId: { fontWeight: "bold", fontSize: 16 },
  historyAmount: { color: "#10b981", fontWeight: "bold", fontSize: 16 },
});
