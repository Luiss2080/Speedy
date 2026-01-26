import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { useAuthStore } from "../../stores/useAuthStore";

export default function PerfilRepartidorVista() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: user?.avatar || "https://via.placeholder.com/150" }}
            style={styles.avatar}
          />
          <View style={styles.editBadge}>
            <FontAwesome5 name="pen" size={12} color="#fff" />
          </View>
        </View>
        <Text style={styles.name}>{user?.nombre}</Text>
        <Text style={styles.role}>Repartidor • {user?.email}</Text>
      </View>

      <ScrollView style={styles.menu}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehículo</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconBox}>
              <FontAwesome5 name="motorcycle" size={20} color="#3B82F6" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.menuText}>Honda Cargo 150</Text>
              <Text style={styles.menuSubText}>Placa: 2839-XYZ</Text>
            </View>
            <FontAwesome5 name="chevron-right" size={16} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cuenta</Text>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconBox}>
              <FontAwesome5 name="id-card" size={20} color="#64748B" />
            </View>
            <Text style={styles.menuText}>Documentos</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#CBD5E1" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.menuItem}>
            <View style={styles.iconBox}>
              <FontAwesome5 name="university" size={20} color="#64748B" />
            </View>
            <Text style={styles.menuText}>Datos Bancarios</Text>
            <FontAwesome5 name="chevron-right" size={16} color="#CBD5E1" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: { alignItems: "center", padding: 30, backgroundColor: "#fff" },
  avatarContainer: { marginBottom: 15 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#3B82F6",
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#1E293B" },
  role: { color: "#64748B", marginTop: 5 },

  menu: { padding: 20 },
  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#94A3B8",
    marginBottom: 10,
    textTransform: "uppercase",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  iconBox: {
    width: 40,
    alignItems: "center",
    justifyItems: "center",
    marginRight: 10,
  },
  menuText: { flex: 1, fontSize: 16, color: "#334155", fontWeight: "500" },
  menuSubText: { fontSize: 12, color: "#64748B" },

  logoutButton: {
    backgroundColor: "#FEE2E2",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 40,
  },
  logoutText: { color: "#EF4444", fontWeight: "bold", fontSize: 16 },
});
