import { FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
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
    // Haptic feedback for better UX
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }

    const res = await loginUsuario(usuario, password);
    setIsLoading(false);

    if (res.success) {
      // Update Global Store
      login(res.user, res.repartidor);

      // Navigate based on Role
      if (res.user.rol === "repartidor") {
        router.replace("/repartidor/home");
      } else {
        router.replace("/(tabs)"); // Go to main client tabs
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <LinearGradient
          colors={[APP_COLOR, "#C90425"]}
          style={styles.headerBackground}
        >
          <View style={styles.logoCircle}>
            <FontAwesome5 name="utensils" size={40} color={APP_COLOR} />
          </View>
          <Text style={styles.appTitle}>Speedy Delivery</Text>
          <Text style={styles.appSubtitle}>
            Tu comida favorita, al instante
          </Text>
        </LinearGradient>

        <View style={styles.formContainer}>
          <Text style={styles.welcomeText}>¡Hola! 👋</Text>
          <Text style={styles.welcomeSubText}>
            Inicia sesión para continuar
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Usuario / Email</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome5
                name="user"
                size={16}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="ej. JuanPerez"
                placeholderTextColor="#9CA3AF"
                value={usuario}
                onChangeText={setUsuario}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Contraseña</Text>
            <View style={styles.inputWrapper}>
              <FontAwesome5
                name="lock"
                size={16}
                color="#9CA3AF"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureTextEntry}
              />
              <TouchableOpacity
                onPress={() => setSecureTextEntry(!secureTextEntry)}
              >
                <FontAwesome5
                  name={secureTextEntry ? "eye-slash" : "eye"}
                  size={16}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            activeOpacity={0.8}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Continuar</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity>
              <Text style={styles.footerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  keyboardView: { flex: 1 },
  headerBackground: {
    height: "35%",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  logoCircle: {
    width: 90,
    height: 90,
    backgroundColor: "#fff",
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  appSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
  },
  formContainer: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 20,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 5,
  },
  welcomeSubText: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: "100%", color: "#1F2937" },
  loginButton: {
    backgroundColor: APP_COLOR,
    height: 55,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: APP_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  footerText: { color: "#6B7280" },
  footerLink: { color: APP_COLOR, fontWeight: "bold" },
});
