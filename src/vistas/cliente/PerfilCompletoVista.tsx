import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
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
  const [name, setName] = useState(user?.nombre || "Usuario Speedy");
  const [phone, setPhone] = useState(user?.telefono || "+591 70000000");
  const [email, setEmail] = useState(user?.email || "usuario@speedy.com");
  const [avatar, setAvatar] = useState(
    user?.avatar || "https://i.pravatar.cc/300?img=12",
  );

  const pickImage = async () => {
    if (!editing) return;

    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permiso denegado",
        "Necesitamos acceso a tu galería para cambiar la foto.",
      );
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    // Mock API call
    console.log("Saving user:", { name, phone, email, avatar });
    setEditing(false);
    Alert.alert("¡Éxito!", "Tu perfil ha sido actualizado correctamente.");
  };

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que quieres salir?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Salir",
        style: "destructive",
        onPress: () => {
          logout();
          router.replace("/");
        },
      },
    ]);
  };

  return (
    <View style={styles.mainContainer}>
      <LinearGradient
        colors={["#EA052C", "#FF4B6A"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <SafeAreaView edges={["top"]} style={styles.safeHeader}>
          <View style={styles.navBar}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconBtn}
            >
              <FontAwesome5 name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mi Perfil</Text>
            <TouchableOpacity
              onPress={() => (editing ? handleSave() : setEditing(true))}
              style={styles.editBtn}
            >
              <Text style={styles.editBtnText}>
                {editing ? "Guardar" : "Editar"}
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <View style={styles.contentContainer}>
        {/* Profile Card Helper - overlaps the gradient */}
        <View style={styles.profileCardWrapper}>
          <View style={styles.profileCard}>
            <TouchableOpacity
              onPress={pickImage}
              activeOpacity={editing ? 0.7 : 1}
              style={styles.avatarContainer}
            >
              <Image source={{ uri: avatar }} style={styles.avatar} />
              {editing && (
                <View style={styles.cameraBtn}>
                  <FontAwesome5 name="camera" size={16} color="#fff" />
                </View>
              )}
            </TouchableOpacity>

            <View style={styles.infoContainer}>
              {editing ? (
                <TextInput
                  value={name}
                  onChangeText={setName}
                  style={styles.nameInput}
                  placeholder="Tu Nombre"
                />
              ) : (
                <Text style={styles.userName}>{name}</Text>
              )}
              <Text style={styles.userRole}>Cliente Frecuente</Text>
            </View>
          </View>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* Contact Info Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>INFORMACIÓN DE CONTACTO</Text>

              <View style={styles.rowItem}>
                <View style={styles.rowIcon}>
                  <FontAwesome5 name="phone-alt" size={16} color="#64748B" />
                </View>
                <View style={styles.rowTextContainer}>
                  <Text style={styles.rowLabel}>Teléfono</Text>
                  {editing ? (
                    <TextInput
                      value={phone}
                      onChangeText={setPhone}
                      style={styles.rowInput}
                      keyboardType="phone-pad"
                    />
                  ) : (
                    <Text style={styles.rowValue}>{phone}</Text>
                  )}
                </View>
              </View>

              <View style={[styles.rowItem, { borderBottomWidth: 0 }]}>
                <View style={styles.rowIcon}>
                  <FontAwesome5 name="envelope" size={16} color="#64748B" />
                </View>
                <View style={styles.rowTextContainer}>
                  <Text style={styles.rowLabel}>Correo</Text>
                  {editing ? (
                    <TextInput
                      value={email}
                      onChangeText={setEmail}
                      style={styles.rowInput}
                      keyboardType="email-address"
                    />
                  ) : (
                    <Text style={styles.rowValue}>{email}</Text>
                  )}
                </View>
              </View>
            </View>

            {/* Account Actions */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>MI CUENTA</Text>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() =>
                  router.push("/(client-tabs)/perfil/direcciones" as any)
                }
              >
                <View
                  style={[styles.menuIconBox, { backgroundColor: "#FFF1F2" }]}
                >
                  <FontAwesome5
                    name="map-marker-alt"
                    size={16}
                    color="#EA052C"
                  />
                </View>
                <Text style={styles.menuText}>Mis Direcciones</Text>
                <FontAwesome5 name="chevron-right" size={12} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View
                  style={[styles.menuIconBox, { backgroundColor: "#EFF6FF" }]}
                >
                  <FontAwesome5 name="credit-card" size={16} color="#3B82F6" />
                </View>
                <Text style={styles.menuText}>Métodos de Pago</Text>
                <FontAwesome5 name="chevron-right" size={12} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View
                  style={[styles.menuIconBox, { backgroundColor: "#F0FDF4" }]}
                >
                  <FontAwesome5 name="shield-alt" size={16} color="#22C55E" />
                </View>
                <Text style={styles.menuText}>Seguridad y Privacidad</Text>
                <FontAwesome5 name="chevron-right" size={12} color="#CBD5E1" />
              </TouchableOpacity>
            </View>

            {/* Support Section */}
            <View style={[styles.section, { marginBottom: 30 }]}>
              <TouchableOpacity style={styles.menuItem}>
                <View
                  style={[styles.menuIconBox, { backgroundColor: "#FFF7ED" }]}
                >
                  <FontAwesome5
                    name="question-circle"
                    size={16}
                    color="#F97316"
                  />
                </View>
                <Text style={styles.menuText}>Ayuda y Soporte</Text>
                <FontAwesome5 name="chevron-right" size={12} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, { borderBottomWidth: 0 }]}
                onPress={handleLogout}
              >
                <View
                  style={[styles.menuIconBox, { backgroundColor: "#FEF2F2" }]}
                >
                  <FontAwesome5 name="sign-out-alt" size={16} color="#EF4444" />
                </View>
                <Text style={[styles.menuText, { color: "#EF4444" }]}>
                  Cerrar Sesión
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{ height: 40 }} />
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  headerGradient: {
    paddingBottom: 60, // Space for the card overlap
  },
  safeHeader: {
    width: "100%",
  },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  iconBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
  editBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  editBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  contentContainer: {
    flex: 1,
    marginTop: -40, // Pull up to overlap
  },
  profileCardWrapper: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  avatarContainer: {
    position: "relative",
    marginRight: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#E2E8F0",
  },
  cameraBtn: {
    position: "absolute",
    bottom: -2,
    right: -2,
    backgroundColor: "#1E293B",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  nameInput: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#EA052C",
    paddingVertical: 0,
  },
  userRole: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },

  section: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 10,
    marginBottom: 20,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
    letterSpacing: 0.5,
  },

  rowItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  rowIcon: {
    width: 32,
    alignItems: "flex-start",
  },
  rowTextContainer: {
    flex: 1,
  },
  rowLabel: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
  },
  rowInput: {
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
    borderBottomWidth: 1,
    borderBottomColor: "#EA052C",
    paddingVertical: 0,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  menuIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    color: "#334155",
    fontWeight: "500",
  },
});
