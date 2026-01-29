import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../../src/servicios/BaseDeDatos";
import { useAuthStore } from "../../src/stores/useAuthStore";

export default function EditarPerfilVista() {
  const router = useRouter();
  const { user, login } = useAuthStore(); // Login used to update store

  const [nombre, setNombre] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [password, setPassword] = useState("");

  const guardarCambios = async () => {
    try {
      await fetch(`${API_URL}/api/usuarios/${user?.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          password: password || undefined,
        }),
      });
      // Update local store
      if (user) {
        login({ ...user, nombre, email }, null);
      }
      Alert.alert("Éxito", "Perfil actualizado");
      router.back();
    } catch (e) {
      Alert.alert("Error", "No se pudo actualizar");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>Editar Perfil</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Contraseña (Dejar vacío para mantener)</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="******"
        />

        <TouchableOpacity style={styles.saveBtn} onPress={guardarCambios}>
          <Text style={styles.saveBtnText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    padding: 20,
    paddingTop: 50,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  title: { fontSize: 20, fontWeight: "bold" },
  form: { padding: 20 },
  label: { marginBottom: 5, color: "#666", fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#C21833",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
