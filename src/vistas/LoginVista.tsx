import { FontAwesome5, Fontisto } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Easing,
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

export default function LoginVista() {
  const router = useRouter();
  const { login } = useAuthStore();

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  // Animation Values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
        router.replace("/(client-tabs)/inicio" as any);
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
      {/* Top Section - Animated Brand */}
      <View style={styles.topSection}>
        <Animated.View
          style={[
            styles.logoContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.iconCircle}>
            <FontAwesome5 name="shipping-fast" size={50} color={APP_COLOR} />
          </View>
          <Text style={styles.brandTitle}>Speedy</Text>
          <Text style={styles.brandSlogan}>Tu delivery, al instante</Text>
        </Animated.View>
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

              <TouchableOpacity style={{ alignSelf: "center", marginTop: 10 }}>
                <Text style={{ color: "#64748B", fontWeight: "bold" }}>
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>

              {/* Divider */}
              <View style={styles.dividerContainer}>
                <View style={styles.line} />
                <Text style={styles.dividerText}>O continúa con</Text>
                <View style={styles.line} />
              </View>

              {/* Social Login */}
              <View style={styles.socialContainer}>
                <TouchableOpacity style={styles.socialBtn}>
                  <Fontisto name="google" size={22} color="#DB4437" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <FontAwesome5 name="facebook" size={24} color="#4267B2" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialBtn}>
                  <FontAwesome5 name="apple" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              {/* Footer Info */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>¿No tienes cuenta?</Text>
                <TouchableOpacity>
                  <Text style={styles.signupText}>Regístrate</Text>
                </TouchableOpacity>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 20,
  },
  logoContainer: {
    alignItems: "center",
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  brandTitle: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 1,
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  brandSlogan: {
    fontSize: 16,
    color: "rgba(255,255,255,0.9)",
    marginTop: 5,
    letterSpacing: 0.5,
  },
  bottomSheet: {
    flex: 1.8,
    backgroundColor: "#fff",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    paddingHorizontal: 30,
    paddingTop: 40,
    overflow: "hidden",
  },
  scrollContent: {
    paddingBottom: 30,
  },
  welcomeContainer: {
    marginBottom: 25,
  },
  welcomeTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F172A",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: "#64748B",
  },
  form: {
    gap: 15,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    borderRadius: 16,
    paddingHorizontal: 20,
    height: 60,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  inputIcon: {
    marginRight: 15,
  },
  input: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#1E293B",
    fontWeight: "500",
  },
  loginButton: {
    backgroundColor: "#1E293B", // Dark charcoal/black for modernization
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#1E293B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1.5,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    marginHorizontal: 15,
    color: "#94A3B8",
    fontSize: 12,
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center aligned per common patterns
    gap: 20,
    marginBottom: 20,
  },
  socialBtn: {
    width: 55,
    height: 55,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 5,
  },
  footerText: {
    color: "#64748B",
    fontSize: 14,
  },
  signupText: {
    color: APP_COLOR,
    fontWeight: "bold",
    fontSize: 14,
  },
});
