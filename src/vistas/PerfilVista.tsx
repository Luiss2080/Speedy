import { FontAwesome } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import {
  SafeAreaView,
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { usePerfilControlador } from "../controladores/usePerfilControlador";
import { PerfilEstilos } from "../estilos/PerfilEstilos";

export default function PerfilVista() {
  const router = useRouter();
  const {
    usuario,
    modoOscuro,
    setModoOscuro,
    notificaciones,
    setNotificaciones,
    cerrarSesion,
  } = usePerfilControlador();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={PerfilEstilos.contenedor}
        showsVerticalScrollIndicator={false}
      >
        <Stack.Screen options={{ headerShown: false }} />

        {/* Header / Avatar Section */}
        <View style={PerfilEstilos.encabezado}>
          <View style={PerfilEstilos.contenedorAvatar}>
            <FontAwesome name={usuario.avatar as any} size={80} color="#333" />
          </View>
          <Text style={PerfilEstilos.nombre}>{usuario.nombre}</Text>
          <Text style={PerfilEstilos.correo}>{usuario.email}</Text>
        </View>

        {/* Settings Section */}
        {/* Account Section */}
        <View style={PerfilEstilos.seccion}>
          <Text style={PerfilEstilos.tituloSeccion}>Cuenta</Text>

          <TouchableOpacity
            style={PerfilEstilos.fila}
            onPress={() => router.push("/perfil/direcciones")}
          >
            <View style={PerfilEstilos.filaIzquierda}>
              <View
                style={{ width: 30, marginRight: 10, alignItems: "center" }}
              >
                <FontAwesome name="map-marker" size={20} color="#C21833" />
              </View>
              <Text style={PerfilEstilos.textoFila}>Direcciones</Text>
            </View>
            <FontAwesome name="angle-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={PerfilEstilos.fila}
            onPress={() => router.push("/perfil/pagos")}
          >
            <View style={PerfilEstilos.filaIzquierda}>
              <View
                style={{ width: 30, marginRight: 10, alignItems: "center" }}
              >
                <FontAwesome name="credit-card" size={18} color="#C21833" />
              </View>
              <Text style={PerfilEstilos.textoFila}>Métodos de Pago</Text>
            </View>
            <FontAwesome name="angle-right" size={20} color="#ccc" />
          </TouchableOpacity>

          <TouchableOpacity
            style={PerfilEstilos.fila}
            onPress={() => router.push("/favoritos")}
          >
            <View style={PerfilEstilos.filaIzquierda}>
              <View
                style={{ width: 30, marginRight: 10, alignItems: "center" }}
              >
                <FontAwesome name="heart" size={18} color="#C21833" />
              </View>
              <Text style={PerfilEstilos.textoFila}>Favoritos</Text>
            </View>
            <FontAwesome name="angle-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* App Section */}
        <View style={PerfilEstilos.seccion}>
          <Text style={PerfilEstilos.tituloSeccion}>Aplicación</Text>

          <View style={PerfilEstilos.fila}>
            <View style={PerfilEstilos.filaIzquierda}>
              <View
                style={{ width: 30, marginRight: 10, alignItems: "center" }}
              >
                <FontAwesome name="moon-o" size={20} color="#666" />
              </View>
              <Text style={PerfilEstilos.textoFila}>Modo Oscuro</Text>
            </View>
            <Switch value={modoOscuro} onValueChange={setModoOscuro} />
          </View>

          <View style={PerfilEstilos.fila}>
            <View style={PerfilEstilos.filaIzquierda}>
              <View
                style={{ width: 30, marginRight: 10, alignItems: "center" }}
              >
                <FontAwesome name="bell-o" size={18} color="#666" />
              </View>
              <Text style={PerfilEstilos.textoFila}>Notificaciones</Text>
            </View>
            <Switch value={notificaciones} onValueChange={setNotificaciones} />
          </View>

          <TouchableOpacity
            style={PerfilEstilos.fila}
            onPress={() => router.push("/perfil/ayuda")}
          >
            <View style={PerfilEstilos.filaIzquierda}>
              <View
                style={{ width: 30, marginRight: 10, alignItems: "center" }}
              >
                <FontAwesome name="question-circle-o" size={20} color="#666" />
              </View>
              <Text style={PerfilEstilos.textoFila}>Ayuda y Soporte</Text>
            </View>
            <FontAwesome name="angle-right" size={20} color="#ccc" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={PerfilEstilos.botonCerrarSesion}
          onPress={cerrarSesion}
        >
          <Text style={PerfilEstilos.textoCerrarSesion}>Cerrar Sesión</Text>
        </TouchableOpacity>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
