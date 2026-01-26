import { FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { loginUsuario } from "../servicios/BaseDeDatos";
import { useAuthStore } from "../stores/useAuthStore";

// Modern Red Branding
const APP_COLOR = "#EA052C";
const { width, height } = Dimensions.get("window");

export default function LoginVista() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    if (usuario.length === 0 || password.length === 0) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setIsLoading(true);
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const res = await loginUsuario(usuario, password);
    setIsLoading(false);

    if (res.success) {
      login(res.user, res.repartidor);
      if (res.user.rol === "repartidor") {
        router.replace("/(driver-tabs)/" as any);
      } else {
        router.replace("/(client-tabs)/" as any);
      }
    } else {
      if (Platform.OS !== "web") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
      alert(res.message || "Credenciales incorrectas");
    }
  };

  return (
    <View style={styles.container}>
      {/* Top Section - Red Background */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          {/* Using FontAwesome car/utensils as placeholder for Logo */}
          <FontAwesome5 name="shipping-fast" size={60} color="#fff" />
        </View>
        <Text style={styles.brandTitle}>Speedy</Text>
        <Text style={styles.brandSlogan}>Tu delivery, al instante</Text>
      </View>

      {/* Bottom Section - White Sheet */}
      <View style={styles.bottomSheet}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeTitle}>Bienvenido Nuevamente</Text>
              <Text style={styles.welcomeSubtitle}>
                Accede a tu cuenta para continuar
              </Text>
            </View>

            <View style={styles.form}>
              {/* Username Input */}
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="user"
                  size={18}
                  color="#64748B"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Nombre de usuario o correo"
                  placeholderTextColor="#94A3B8"
                  value={usuario}
                  onChangeText={setUsuario}
                  autoCapitalize="none"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputContainer}>
                <FontAwesome5
                  name="lock"
                  size={18}
                  color="#64748B"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry={secureTextEntry}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <FontAwesome5
                    name={secureTextEntry ? "eye-slash" : "eye"}
                    size={18}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>

              {/* Login Button */}
              <TouchableOpacity
                style={styles.loginButton}
                onPress={handleLogin}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.loginButtonText}>INGRESAR</Text>
                )}
              </TouchableOpacity>

              {/* Footer Info */}
              <View style={styles.footer}>
                <FontAwesome5 name="info-circle" size={14} color="#64748B" />
                <Text style={styles.footerText}>
                  Usa tus credenciales de Speedy
                </Text>
              </View>

              {/* Quick Dev Links (Optional, kept for convenience but styled subtly) */}
              <View style={{ marginTop: 30, alignItems: "center" }}>
                <Text style={{ fontSize: 10, color: "#CBD5E1" }}>
                  DEMO ONLY
                </Text>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_COLOR,
  },
  topSection: {
    flex: 1, // Takes top roughly 40%
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
  },
  logoContainer: {
    marginBottom: 15,
  },
  brandTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
  },
  brandSlogan: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    marginTop: 5,
  },
  bottomSheet: {
    flex: 1.5, // Takes bottom 60%
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 30,
    paddingTop: 40,
    overflow: "hidden",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  welcomeContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6", // Light gray bg
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#1E293B",
  },
  loginButton: {
    backgroundColor: "#000", // Black button per reference style with high contrast
    height: 55,
    borderRadius: 30, // Pill shape
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 12,
    gap: 8,
  },
  footerText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "500",
  },
});
