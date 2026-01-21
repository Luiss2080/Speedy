import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Linking, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { SeguimientoEstilos } from "../estilos/SeguimientoEstilos";

export default function SeguimientoVista() {
  const { id } = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);
  const [status, setStatus] = useState("En cocina");
  const [progress, setProgress] = useState(0.2);
  const [eta, setEta] = useState("25 min");

  // Mock Route Coordinates (simulating a path)
  const [routeCoords] = useState([
    { latitude: -12.125, longitude: -77.025 }, // Origin (Driver)
    { latitude: -12.124, longitude: -77.027 },
    { latitude: -12.123, longitude: -77.029 },
    { latitude: -12.122146, longitude: -77.030995 }, // Destination (User)
  ]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        // Just log or silently fail in mock, but alert is good practice
        // Alert.alert('Permiso denegado', 'No podemos mostrar tu ubicación exacta sin permisos.');
        return;
      }
    })();

    // Simulate order progress
    const timer1 = setTimeout(() => {
      setStatus("Recogido");
      setProgress(0.5);
      setEta("15 min");
    }, 3000);

    const timer2 = setTimeout(() => {
      setStatus("En camino");
      setProgress(0.8);
      setEta("5 min");
    }, 8000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  const handleCall = () => {
    Linking.openURL("tel:+51999999999");
  };

  const handleMessage = () => {
    Linking.openURL("sms:+51999999999");
  };

  return (
    <View style={SeguimientoEstilos.contenedor}>
      <MapView
        ref={mapRef}
        style={SeguimientoEstilos.mapaPlaceholder}
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: -12.1235,
          longitude: -77.028,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
      >
        <Polyline
          coordinates={routeCoords}
          strokeColor="#C21833"
          strokeWidth={4}
          lineDashPattern={[1]}
        />

        <Marker
          coordinate={routeCoords[3]}
          title="Tu ubicación"
          description="Av. Larco 123"
        >
          <View
            style={{
              backgroundColor: "#C21833",
              padding: 6,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: "white",
            }}
          >
            <FontAwesome5 name="home" size={14} color="white" />
          </View>
        </Marker>

        <Marker
          coordinate={routeCoords[0]}
          title="Repartidor"
          description={status}
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 6,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: "#C21833",
            }}
          >
            <FontAwesome5 name="motorcycle" size={18} color="#C21833" />
          </View>
        </Marker>
      </MapView>

      <View style={SeguimientoEstilos.panelEstado}>
        <View style={{ alignItems: "center", marginBottom: 10 }}>
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: "#e2e8f0",
              borderRadius: 2,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <View>
            <Text style={SeguimientoEstilos.estadoTitulo}>{status}</Text>
            <Text style={SeguimientoEstilos.estadoSubtitulo}>
              Llegada estimada:{" "}
              <Text style={{ color: "#C21833", fontWeight: "bold" }}>
                {eta}
              </Text>
            </Text>
          </View>
          <MaterialCommunityIcons
            name="timer-outline"
            size={28}
            color="#C21833"
          />
        </View>

        <View style={SeguimientoEstilos.barraProgreso}>
          <View
            style={[
              SeguimientoEstilos.progresoRelleno,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>

        <View style={SeguimientoEstilos.repartidorInfo}>
          <View
            style={[
              SeguimientoEstilos.avatar,
              {
                backgroundColor: "#e2e8f0",
                justifyContent: "center",
                alignItems: "center",
              },
            ]}
          >
            <FontAwesome5 name="user-alt" size={20} color="#64748b" />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={SeguimientoEstilos.repartidorNombre}>Juan Pérez</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: 2,
              }}
            >
              <FontAwesome5 name="star" size={10} color="#eab308" solid />
              <Text style={{ fontSize: 12, color: "#64748b", marginLeft: 4 }}>
                4.9 (150 envíos)
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", gap: 10 }}>
            <TouchableOpacity
              onPress={handleMessage}
              style={{
                backgroundColor: "#eff6ff",
                padding: 10,
                borderRadius: 50,
              }}
            >
              <FontAwesome5 name="comment-dots" size={20} color="#3b82f6" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCall}
              style={{
                backgroundColor: "#ecfdf5",
                padding: 10,
                borderRadius: 50,
              }}
            >
              <FontAwesome5 name="phone-alt" size={20} color="#10b981" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
