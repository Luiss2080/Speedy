import { FontAwesome } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { Switch, Text, TouchableOpacity, View } from "react-native";
import { usePerfilControlador } from "../controladores/usePerfilControlador";
import { PerfilEstilos } from "../estilos/PerfilEstilos";

export default function PerfilVista() {
  const {
    usuario,
    modoOscuro,
    setModoOscuro,
    notificaciones,
    setNotificaciones,
    cerrarSesion,
  } = usePerfilControlador();

  return (
    <View style={PerfilEstilos.contenedor}>
      <Stack.Screen options={{ title: "Mi Perfil" }} />

      {/* Header / Avatar Section */}
      <View style={PerfilEstilos.encabezado}>
        <View style={PerfilEstilos.contenedorAvatar}>
          <FontAwesome name={usuario.avatar as any} size={80} color="#333" />
        </View>
        <Text style={PerfilEstilos.nombre}>{usuario.nombre}</Text>
        <Text style={PerfilEstilos.correo}>{usuario.email}</Text>
      </View>

      {/* Settings Section */}
      <View style={PerfilEstilos.seccion}>
        <Text style={PerfilEstilos.tituloSeccion}>Ajustes</Text>

        <View style={PerfilEstilos.fila}>
          <View style={PerfilEstilos.filaIzquierda}>
            <FontAwesome
              name="moon-o"
              size={20}
              color="#666"
              style={PerfilEstilos.icono}
            />
            <Text style={PerfilEstilos.textoFila}>Modo Oscuro</Text>
          </View>
          <Switch value={modoOscuro} onValueChange={setModoOscuro} />
        </View>

        <View style={PerfilEstilos.fila}>
          <View style={PerfilEstilos.filaIzquierda}>
            <FontAwesome
              name="bell-o"
              size={20}
              color="#666"
              style={PerfilEstilos.icono}
            />
            <Text style={PerfilEstilos.textoFila}>Notificaciones</Text>
          </View>
          <Switch value={notificaciones} onValueChange={setNotificaciones} />
        </View>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        style={PerfilEstilos.botonCerrarSesion}
        onPress={cerrarSesion}
      >
        <Text style={PerfilEstilos.textoCerrarSesion}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </View>
  );
}
