import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { SeguimientoEstilos } from "../estilos/SeguimientoEstilos";
import { API_URL } from "../servicios/BaseDeDatos"; // Assuming this is where API_URL is, or finding equivalent

// Simple interpolation function for smooth movement
const interpolate = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor;
};

export default function SeguimientoVista() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);

  const [pedido, setPedido] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [driverLoc, setDriverLoc] = useState<any>(null);
  const [userLoc, setUserLoc] = useState<any>(null);
  const [detalleVisible, setDetalleVisible] = useState(false);

  // Simulation state
  const [progress, setProgress] = useState(0);
  const [eta, setEta] = useState("");
  const [status, setStatus] = useState("Asignando conductor...");

  useEffect(() => {
    cargarPedido();
  }, [id]);

  const cargarPedido = async () => {
    try {
      const res = await fetch(`${API_URL}/api/pedidos/${id}`);
      const data = await res.json();

      if (data.error) {
        Alert.alert("Error", "No se encontró el pedido");
        router.back();
        return;
      }

      setPedido(data);

      // Setup locations
      // 1. Driver Start (Restaurant or Driver Actual)
      const startLat = data.repartidor_lat || data.restaurante_lat || -12.125;
      const startLon = data.repartidor_lon || data.restaurante_lon || -77.025;

      // 2. User End (Mock if no geocoding)
      // For demo, we place user slightly away from driver
      const endLat = startLat + 0.01; // Approx 1km
      const endLon = startLon + 0.01;

      const start = { latitude: startLat, longitude: startLon };
      const end = { latitude: endLat, longitude: endLon };

      setDriverLoc(start);
      setUserLoc(end);

      setStatus(
        data.estado === "pendiente"
          ? "Preparando tu pedido"
          : "Pedido en camino",
      );
      setLoading(false);

      // Start Simulation
      startSimulation(start, end);
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Error de conexión");
    }
  };

  const startSimulation = (start: any, end: any) => {
    let t = 0;
    const duration = 30000; // 30 seconds to arrive
    const interval = 100; // update every 100ms
    const step = interval / duration;

    const timer = setInterval(() => {
      t += step;
      if (t >= 1) {
        t = 1;
        clearInterval(timer);
        setStatus("¡Tu pedido ha llegado!");
        setEta("0 min");
      } else {
        // Update ETA
        const remainingSecs = Math.ceil((1 - t) * (duration / 1000));
        setEta(`${Math.ceil(remainingSecs / 60)} min`);
        if (t < 0.2) setStatus("Conductor en camino al restaurante");
        else if (t < 0.4) setStatus("Recogiendo pedido");
        else setStatus("En camino a tu ubicación");
      }

      const newLat = interpolate(start.latitude, end.latitude, t);
      const newLon = interpolate(start.longitude, end.longitude, t);

      setDriverLoc({ latitude: newLat, longitude: newLon });
      setProgress(t);
    }, interval);
  };

  const handleCall = () => {
    if (pedido?.repartidor_telefono)
      Linking.openURL(`tel:${pedido.repartidor_telefono}`);
    else Alert.alert("Info", "Conductor no tiene teléfono registrado");
  };

  if (loading)
    return (
      <View style={SeguimientoEstilos.contenedor}>
        <Text>Cargando...</Text>
      </View>
    );

  return (
    <View style={SeguimientoEstilos.contenedor}>
      <MapView
        ref={mapRef}
        style={SeguimientoEstilos.mapaPlaceholder}
        provider={PROVIDER_DEFAULT}
        region={{
          latitude: driverLoc.latitude,
          longitude: driverLoc.longitude,
          latitudeDelta: 0.015,
          longitudeDelta: 0.015,
        }}
      >
        <Marker
          coordinate={userLoc}
          title="Tú"
          description={pedido.direccion_entrega_texto}
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

        <Marker coordinate={driverLoc} title="Repartidor">
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

      {/* Driver & Status Panel */}
      <View style={SeguimientoEstilos.panelEstado}>
        <TouchableOpacity
          style={{ alignItems: "center", marginBottom: 10 }}
          onPress={() => setDetalleVisible(true)}
        >
          <Text style={{ color: "#64748b", fontSize: 12 }}>
            Ver detalles del pedido
          </Text>
          <FontAwesome5 name="chevron-up" size={12} color="#64748b" />
        </TouchableOpacity>

        <View style={{ marginBottom: 10 }}>
          <Text style={SeguimientoEstilos.estadoTitulo}>{status}</Text>
          <Text style={SeguimientoEstilos.estadoSubtitulo}>
            Llegada estimada:{" "}
            <Text style={{ color: "#C21833", fontWeight: "bold" }}>{eta}</Text>
          </Text>
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
            <Text style={SeguimientoEstilos.repartidorNombre}>
              {pedido.repartidor_nombre || "Buscando conductor..."}
            </Text>
            <Text style={{ fontSize: 12, color: "#64748b" }}>
              {pedido.repartidor_vehiculo || "Moto"}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
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

      {/* Order Detail Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={detalleVisible}
        onRequestClose={() => setDetalleVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "60%",
            }}
          >
            <Text
              style={{ fontSize: 20, fontWeight: "bold", marginBottom: 15 }}
            >
              Detalle del Pedido
            </Text>
            <ScrollView>
              {pedido.items?.map((item: any, index: number) => (
                <View
                  key={index}
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginBottom: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: "#f1f5f9",
                    paddingBottom: 5,
                  }}
                >
                  <Text style={{ fontWeight: "600" }}>
                    {item.cantidad}x Prod
                  </Text>
                  <Text>${parseFloat(item.precio_unitario).toFixed(2)}</Text>
                </View>
              ))}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Total</Text>
                <Text style={{ fontWeight: "bold", color: "#C21833" }}>
                  ${parseFloat(pedido.total_final).toFixed(2)}
                </Text>
              </View>
            </ScrollView>
            <TouchableOpacity
              style={{
                backgroundColor: "#C21833",
                padding: 15,
                borderRadius: 10,
                alignItems: "center",
                marginTop: 20,
              }}
              onPress={() => setDetalleVisible(false)}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
