import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../src/servicios/BaseDeDatos";
import { useAuthStore } from "../../src/stores/useAuthStore";

export default function DriverPerfil() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const [nombre, setNombre] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notificaciones, setNotificaciones] = useState(true);

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  const guardarCambios = async () => {
    try {
      await fetch(`${API_URL}/api/usuarios/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          // Removed password field as it is not part of the User type and shouldn't be sent if unchanged
        }),
      });
      Alert.alert("Éxito", "Perfil actualizado correctamente");
    } catch (e) {
      Alert.alert("Error", "No se pudo actualizar");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <FontAwesome5 name="user" size={40} color="#C21833" />
        </View>
        <Text style={styles.name}>{user?.nombre}</Text>
        <Text style={styles.role}>Socio Repartidor</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información Personal</Text>

        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={guardarCambios}>
          <Text style={styles.saveBtnText}>Guardar Cambios</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.row}>
          <Text style={styles.rowText}>Notificaciones Push</Text>
          <Switch
            value={notificaciones}
            onValueChange={setNotificaciones}
            trackColor={{ false: "#767577", true: "#C21833" }}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  header: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  name: { fontSize: 22, fontWeight: "bold", color: "#333" },
  role: { color: "#C21833", fontWeight: "600" },
  section: { backgroundColor: "#fff", padding: 20, marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  label: { color: "#64748b", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "bold" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowText: { fontSize: 16, color: "#333" },
  logoutBtn: {
    margin: 20,
    padding: 15,
    backgroundColor: "#fee2e2",
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "#ef4444", fontWeight: "bold", fontSize: 16 },
});
