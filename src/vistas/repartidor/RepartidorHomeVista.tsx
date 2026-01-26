import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../stores/useAuthStore";

export default function RepartidorHomeVista() {
  const { user, logout, repartidorInfo } = useAuthStore();
  const router = useRouter();
  const [isOnline, setIsOnline] = React.useState(false);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hola, {user?.nombre}</Text>
          <Text style={styles.statusText}>
            {isOnline ? "Conectado" : "Desconectado"}
          </Text>
        </View>
        <Switch
          trackColor={{ false: "#767577", true: "#34D399" }}
          thumbColor={isOnline ? "#fff" : "#f4f3f4"}
          onValueChange={setIsOnline}
          value={isOnline}
        />
        <TouchableOpacity onPress={handleLogout} style={styles.logoutBtn}>
          <FontAwesome5 name="sign-out-alt" size={20} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {!isOnline ? (
          <View style={styles.offlineContainer}>
            <FontAwesome5 name="moon" size={60} color="#CBD5E1" />
            <Text style={styles.offlineText}>
              Conéctate para recibir pedidos
            </Text>
          </View>
        ) : (
          <View style={styles.ordersList}>
            <Text style={styles.sectionTitle}>Pedidos Disponibles</Text>
            <View style={styles.emptyState}>
              <FontAwesome5 name="check-circle" size={40} color="#10B981" />
              <Text style={styles.emptyText}>Todo tranquilo por ahora</Text>
            </View>
          </View>
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  greeting: { fontSize: 18, fontWeight: "bold", color: "#1E293B" },
  statusText: { fontSize: 14, color: "#64748B" },
  logoutBtn: { padding: 10 },
  content: { padding: 20, flexGrow: 1 },
  offlineContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 100,
  },
  offlineText: { marginTop: 20, fontSize: 16, color: "#94A3B8" },
  ordersList: { marginTop: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#334155",
  },
  emptyState: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
  },
  emptyText: { marginTop: 10, color: "#64748B" },
});
