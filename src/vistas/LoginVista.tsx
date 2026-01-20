import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { LoginEstilos } from "../estilos/LoginEstilos";
import { initDB, seedDB } from "../servicios/BaseDeDatos";

export default function LoginVista() {
  const router = useRouter();

  useEffect(() => {
    // Inicializar base de datos y datos de prueba al cargar el login
    const setupDB = async () => {
      try {
        await initDB();
        await seedDB();
      } catch (e) {
        console.error("Error al inicializar BD:", e);
      }
    };
    setupDB();
  }, []);

  return (
    <View style={LoginEstilos.fondo}>
      <View style={LoginEstilos.logoContainer}>
        {/* Placeholder para logo, idealmente una imagen real */}
        <View
          style={[
            LoginEstilos.logoImagen,
            {
              backgroundColor: "rgba(0,0,0,0.2)",
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
          />
        </View>

        {/* Input PIN (Simulado visualmente) */}
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

        {/* Botón Login (oculto en el diseño visual de referencia pero necesario para UX) */}
        <TouchableOpacity
          style={[LoginEstilos.botonIngresar, { marginTop: 20 }]}
          onPress={() => router.replace("/(tabs)")}
        >
          <Text style={LoginEstilos.textoBoton}>INGRESAR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
