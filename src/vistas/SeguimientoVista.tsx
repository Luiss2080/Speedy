import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
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
import MapView, { Marker, Polyline, PROVIDER_DEFAULT } from "react-native-maps";
import { SeguimientoEstilos } from "../estilos/SeguimientoEstilos";
import { API_URL } from "../servicios/BaseDeDatos";

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
  const [status, setStatus] = useState("Cargando...");
  const [step, setStep] = useState(0); // 0: Confirmado, 1: Cocina, 2: Camino/Listo, 3: Entregado

  useEffect(() => {
    cargarPedido();
  }, [id]);

  const cargarPedido = async () => {
    try {
      const res = await fetch(`${API_URL}/pedidos/${id}`);
      const data = await res.json();

      if (data.error) {
        Alert.alert("Error", "No se encontró el pedido");
        router.back();
        return;
      }

      setPedido(data);

      // Setup locations
      const startLat = data.repartidor_lat || data.restaurante_lat || -12.125;
      const startLon = data.repartidor_lon || data.restaurante_lon || -77.025;
      const endLat = startLat + 0.01;
      const endLon = startLon + 0.01;

      const start = { latitude: startLat, longitude: startLon };
      const end = { latitude: endLat, longitude: endLon };

      setDriverLoc(start);
      setUserLoc(end);
      setLoading(false);

      if (data.tipo_servicio === "retiro") {
        startPickupSimulation();
      } else {
        startDeliverySimulation(start, end);
      }
    } catch (e) {
      console.error(e);
      Alert.alert("Error", "Error de conexión");
    }
  };

  const startPickupSimulation = () => {
    // States: Confirmado -> (3s) En Cocina -> (10s) Listo para retirar
    setStatus("Pedido Confirmado");
    setEta("15 min para retirar");
    setStep(0);

    setTimeout(() => {
      setStatus("Restaurante preparando tu pedido");
      setStep(1);
      setProgress(0.3);
    }, 3000);

    setTimeout(() => {
      setStatus("¡Listo para retirar!");
      setEta("¡Ven por él!");
      setStep(2);
      setProgress(1);
    }, 10000);
  };

  const startDeliverySimulation = (start: any, end: any) => {
    let t = 0;
    const duration = 30000;
    const interval = 100;
    const stepMove = interval / duration;

    // Initial State
    setStatus("Buscando conductor...");
    setStep(0);

    const timer = setInterval(() => {
      t += stepMove;

      // State Machine Logic based on Time 't' (0 to 1)
      if (t < 0.1) {
        setStatus("Conductor asignado. Yendo al restaurante.");
        setStep(1);
      } else if (t < 0.3) {
        setStatus("Recogiendo pedido en restaurante.");
        setStep(1);
      } else if (t < 0.9) {
        setStatus("Conductor en camino a tu dirección.");
        setStep(2);
      } else {
        setStatus("¡Tu pedido ha llegado!");
        setStep(3);
      }

      if (t >= 1) {
        t = 1;
        clearInterval(timer);
        setEta("0 min");
      } else {
        const remainingSecs = Math.ceil((1 - t) * (duration / 1000));
        setEta(`${Math.ceil(remainingSecs / 60)} min`);
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
    else if (pedido?.restaurante_telefono)
      Linking.openURL(`tel:${pedido.restaurante_telefono}`); // Fallback for pickup
    else Alert.alert("Info", "No hay teléfono registrado");
  };

  if (loading)
    return (
      <View style={SeguimientoEstilos.contenedor}>
        <Text>Cargando...</Text>
      </View>
    );

  const isPickup = pedido.tipo_servicio === "retiro";

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
        {/* Route Line (Delivery Only) */}
        {!isPickup && (
          <Polyline
            coordinates={[driverLoc, userLoc]}
            strokeColor="#C21833"
            strokeWidth={4}
          />
        )}

        {/* User Marker (only for Delivery) */}
        {!isPickup && (
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
        )}

        {/* Moving Entity: Driver (Delivery) or Restaurant (Pickup) */}
        <Marker
          coordinate={driverLoc}
          title={isPickup ? "Restaurante" : "Repartidor"}
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
            <FontAwesome5
              name={isPickup ? "store" : "motorcycle"}
              size={18}
              color="#C21833"
            />
          </View>
        </Marker>
      </MapView>

      {/* Panel */}
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
            {isPickup ? "Tiempo estimado:" : "Llegada estimada:"}{" "}
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

        {/* Info Card */}
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
            <FontAwesome5
              name={isPickup ? "store" : "user-alt"}
              size={20}
              color="#64748b"
            />
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={SeguimientoEstilos.repartidorNombre}>
              {isPickup
                ? pedido.restaurante_nombre
                : pedido.repartidor_nombre || "Buscando conductor..."}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={{ fontSize: 12, color: "#64748b", marginRight: 5 }}>
                {isPickup
                  ? pedido.restaurante_direccion
                  : pedido.repartidor_vehiculo || "Moto"}
              </Text>
              {!isPickup && pedido.repartidor_id && (
                <TouchableOpacity
                  onPress={() =>
                    router.push(`/repartidor/${pedido.repartidor_id}` as any)
                  }
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: "#C21833",
                      fontWeight: "bold",
                    }}
                  >
                    Ver Perfil
                  </Text>
                </TouchableOpacity>
              )}
            </View>
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

        {/* QR Code for Pickup */}
        {isPickup && step === 2 && (
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <View
              style={{
                padding: 10,
                backgroundColor: "white",
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <MaterialCommunityIcons
                name="qrcode-scan"
                size={50}
                color="black"
              />
            </View>
            <Text style={{ fontSize: 10, color: "#666", marginTop: 5 }}>
              Muestra este código al retirar
            </Text>
          </View>
        )}
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
