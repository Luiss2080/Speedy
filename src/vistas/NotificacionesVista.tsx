import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { NotificacionesEstilos } from "../estilos/NotificacionesEstilos";

import { useEffect, useState } from "react";
import { API_URL } from "../servicios/BaseDeDatos";
import { useAuthStore } from "../stores/useAuthStore";

export default function NotificacionesVista() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [notificaciones, setNotificaciones] = useState<any[]>([]);

  useEffect(() => {
    if (user) fetchNotificaciones();
  }, [user]);

  const fetchNotificaciones = async () => {
    try {
      const res = await fetch(`${API_URL}/api/notificaciones/${user?.id}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setNotificaciones(
          data.map((n) => ({
            id: n.id,
            titulo: n.titulo,
            mensaje: n.mensaje,
            tiempo: new Date(n.fecha).toLocaleDateString(),
            icono: "bell",
            color: "#C21833",
          })),
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <View style={NotificacionesEstilos.contenedor}>
      <LinearGradient
        colors={["#C21833", "#9f1239"]}
        style={NotificacionesEstilos.encabezado}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 15 }}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={NotificacionesEstilos.tituloEncabezado}>
            Notificaciones
          </Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={NotificacionesEstilos.lista}>
        {notificaciones.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
            No tienes notificaciones.
          </Text>
        ) : (
          notificaciones.map((noti) => (
            <View key={noti.id} style={NotificacionesEstilos.item}>
              <View
                style={[
                  NotificacionesEstilos.iconoContenedor,
                  { backgroundColor: noti.color + "20" },
                ]}
              >
                <FontAwesome5 name={noti.icono} size={20} color={noti.color} />
              </View>
              <View style={NotificacionesEstilos.contenido}>
                <Text style={NotificacionesEstilos.tituloNotificacion}>
                  {noti.titulo}
                </Text>
                <Text style={NotificacionesEstilos.textoNotificacion}>
                  {noti.mensaje}
                </Text>
                <Text style={NotificacionesEstilos.tiempo}>{noti.tiempo}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
