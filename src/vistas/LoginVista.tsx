import { FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { LoginEstilos } from "../estilos/LoginEstilos";

import { LinearGradient } from "expo-linear-gradient";
// ... hooks

export default function LoginVista() {
  const router = useRouter();
  const [usuario, setUsuario] = useState("");
  const [pin, setPin] = useState("");

  // ... useEffect setupDB

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Validación simple
    if (usuario.length > 0) {
      router.replace("/inicio");
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      alert("Por favor ingresa un usuario");
    }
  };

  return (
    <LinearGradient
      colors={["#9f1239", "#C21833", "#e11d48"]}
      style={LoginEstilos.fondo}
    >
      <View style={LoginEstilos.logoContainer}>
        {/* ... logo content ... */}
        <View
          style={[
            LoginEstilos.logoImagen,
            {
              backgroundColor: "rgba(255,255,255,0.2)",
              justifyContent: "center",
              alignItems: "center",
            },
          ]}
        >
          <FontAwesome5 name="store" size={50} color="#fff" />
        </View>
        <Text style={LoginEstilos.titulo}>Inicio de Sesión</Text>
        <Text style={LoginEstilos.subtitulo}>
          Gestión de Inventario del negocio de sus sueños
        </Text>
      </View>

      <View style={LoginEstilos.tarjeta}>
        <Text style={LoginEstilos.tarjetaTitulo}>Bienvenido Nuevamente</Text>
        <Text style={LoginEstilos.tarjetaSubtitulo}>
          Accede a tu cuenta desde el lugar que necesites
        </Text>

        {/* Input Usuario */}
        <View style={LoginEstilos.inputContainer}>
          <FontAwesome5
            name="user-alt"
            size={16}
            color="#C21833"
            style={LoginEstilos.inputIcono}
          />
          <TextInput
            style={LoginEstilos.input}
            placeholder="Nombre de usuario"
            placeholderTextColor="#9ca3af"
            value={usuario}
            onChangeText={setUsuario}
          />
        </View>

        {/* Input PIN */}
        <Text style={LoginEstilos.labelPin}>Ingresa tu clave Yape</Text>
        <View style={LoginEstilos.pinContainer}>
          {[1, 2, 3, 4].map((i) => (
            <TextInput
              key={i}
              style={LoginEstilos.pinInput}
              maxLength={1}
              keyboardType="numeric"
              secureTextEntry
            />
          ))}
          <TouchableOpacity
            style={{ justifyContent: "center", marginLeft: 10 }}
          >
            <FontAwesome5 name="eye-slash" size={20} color="#C21833" />
          </TouchableOpacity>
        </View>

        {/* Info Box */}
        <View style={LoginEstilos.footerNota}>
          <FontAwesome5 name="info-circle" size={16} color="#C21833" />
          <Text style={LoginEstilos.textoNota}>
            Ingresa tus credenciales para continuar
          </Text>
        </View>

        {/* Botón Login con Gradiente */}
        <TouchableOpacity
          style={{ width: "100%", marginTop: 20, marginBottom: 20 }}
          activeOpacity={0.9}
          onPress={handleLogin}
        >
          <LinearGradient
            colors={["#C21833", "#9f1239"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingVertical: 18,
              borderRadius: 20,
              alignItems: "center",
              shadowColor: "#C21833",
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 5,
            }}
          >
            <Text style={LoginEstilos.textoBoton}>INGRESAR</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
