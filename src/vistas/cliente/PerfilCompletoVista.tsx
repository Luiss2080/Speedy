import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../stores/useAuthStore";

export default function PerfilCompletoVista() {
  const { user, logout } = useAuthStore();
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.nombre || "");
  const [email, setEmail] = useState(user?.email || "");
  const [avatar, setAvatar] = useState(
    user?.avatar || "https://i.pravatar.cc/150?img=12",
  );

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Here we would call API to update user
    setEditing(false);
    alert("Perfil actualizado correctamente");
  };

  const handleLogout = () => {
    logout();
    router.replace("/");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mi Perfil</Text>
          <TouchableOpacity onPress={() => setEditing(!editing)}>
            <Text style={styles.editText}>
              {editing ? "Cancelar" : "Editar"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Same content... but avoiding repetition if possible, however I need to wrap the whole scroll */}
          <View style={styles.avatarSection}>
            <TouchableOpacity
              onPress={editing ? pickImage : undefined}
              activeOpacity={editing ? 0.7 : 1}
            >
              <Image source={{ uri: avatar }} style={styles.avatar} />
              {editing && (
                <View style={styles.cameraBadge}>
                  <FontAwesome5 name="camera" size={14} color="#fff" />
                </View>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre Completo</Text>
              <TextInput
                style={[styles.input, editing && styles.inputEditable]}
                value={name}
                onChangeText={setName}
                editable={editing}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Correo Electrónico</Text>
              <TextInput
                style={[styles.input, editing && styles.inputEditable]}
                value={email}
                onChangeText={setEmail}
                editable={editing}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Teléfono</Text>
              <TextInput
                style={[styles.input, editing && styles.inputEditable]}
                value="+591 77712345"
                editable={editing}
              />
            </View>
          </View>

          {editing ? (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveText}>Guardar Cambios</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.menu}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                  router.push("/(client-tabs)/perfil/direcciones" as any)
                }
              >
                <View style={styles.iconBox}>
                  <FontAwesome5
                    name="map-marker-alt"
                    size={18}
                    color="#EA052C"
                  />
                </View>
                <Text style={styles.menuText}>Mis Direcciones</Text>
                <FontAwesome5 name="chevron-right" size={14} color="#CBD5E1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.iconBox}>
                  <FontAwesome5 name="credit-card" size={18} color="#EA052C" />
                </View>
                <Text style={styles.menuText}>Métodos de Pago</Text>
                <FontAwesome5 name="chevron-right" size={14} color="#CBD5E1" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <View style={styles.iconBox}>
                  <FontAwesome5 name="sign-out-alt" size={18} color="#EF4444" />
                </View>
                <Text style={[styles.menuText, { color: "#EF4444" }]}>
                  Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B" },
  editText: { color: "#EA052C", fontWeight: "bold" },

  scroll: { padding: 20 },
  avatarSection: { alignItems: "center", marginBottom: 30 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F1F5F9",
  },
  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#EA052C",
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#fff",
  },

  form: { marginBottom: 30 },
  inputGroup: { marginBottom: 20 },
  label: { color: "#64748B", marginBottom: 8, fontSize: 13, fontWeight: "600" },
  input: {
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 12,
    color: "#334155",
    borderWidth: 1,
    borderColor: "transparent",
    fontSize: 16,
  },
  inputEditable: { backgroundColor: "#fff", borderColor: "#CBD5E1" },

  saveBtn: {
    backgroundColor: "#EA052C",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  menu: { marginTop: 10 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  iconBox: { width: 30, alignItems: "center", marginRight: 15 },
  menuText: { flex: 1, fontSize: 16, color: "#334155" },
});
