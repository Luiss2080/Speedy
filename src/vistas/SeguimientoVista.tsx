import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView from "react-native-maps";
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
      const startLat =
        parseFloat(data.repartidor_lat) ||
        parseFloat(data.restaurante_lat) ||
        -12.125;
      const startLon =
        parseFloat(data.repartidor_lon) ||
        parseFloat(data.restaurante_lon) ||
        -77.025;
      const endLat = startLat + 0.005; // Make distance closer for demo visibility
      const endLon = startLon + 0.005;

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
    setStatus("Confirmado");
    setEta("15 min");
    setStep(0);

    setTimeout(() => {
      setStatus("En Cocina");
      setStep(1);
      setProgress(0.3);
    }, 2000);

    setTimeout(() => {
      setStatus("Listo para retirar");
      setEta("¡Ven por él!");
      setStep(2);
      setProgress(1);
    }, 8000);
  };

  const startDeliverySimulation = (start: any, end: any) => {
    let t = 0;
    const duration = 20000; // Faster simulation
    const interval = 50;
    const stepMove = interval / duration;

    setStatus("Confirmado");
    setStep(0);

    const timer = setInterval(() => {
      t += stepMove;

      if (t < 0.2) {
        setStatus("Preparando");
        setStep(1);
      } else if (t < 0.8) {
        setStatus("En Camino");
        setStep(2);
      } else {
        setStatus("Entregado");
        setStep(3);
      }

      if (t >= 1) {
        t = 1;
        clearInterval(timer);
        setEta("-");
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
    else Alert.alert("Info", "No hay teléfono registrado");
  };

  if (loading)
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f8fafc",
        }}
      >
        <Text style={{ color: "#64748b", fontWeight: "600" }}>
          Cargando pedido...
        </Text>
      </View>
    );

  const isPickup = pedido.tipo_servicio === "retiro";

  // --- UI COMPONENTS ---

  const TimelineItem = ({
    title,
    time,
    active,
    completed,
    isLast,
  }: {
    title: string;
    time: string;
    active: boolean;
    completed: boolean;
    isLast?: boolean;
  }) => (
    <View style={{ flexDirection: "row", height: 50 }}>
      {/* Line & Dot */}
      <View style={{ alignItems: "center", width: 30 }}>
        <View
          style={{
            width: 12,
            height: 12,
            borderRadius: 6,
            backgroundColor: completed || active ? "#10b981" : "#e2e8f0",
            zIndex: 1,
          }}
        />
        {!isLast && (
          <View
            style={{
              width: 2,
              flex: 1,
              backgroundColor: completed ? "#10b981" : "#e2e8f0",
              marginTop: -2,
              marginBottom: -2,
            }}
          />
        )}
      </View>
      {/* Content */}
      <View style={{ flex: 1, paddingLeft: 10, justifyContent: "flex-start" }}>
        <Text
          style={{
            fontSize: 16,
            fontWeight: completed || active ? "bold" : "500",
            color: completed || active ? "#1e293b" : "#94a3b8",
          }}
        >
          {title}
        </Text>
        <Text style={{ fontSize: 12, color: "#94a3b8" }}>{time}</Text>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#F1F5F9" }}>
      <StatusBar barStyle="dark-content" />

      {/* HEADER */}
      <View
        style={{
          paddingTop: Platform.OS === "android" ? 40 : 50,
          paddingHorizontal: 20,
          paddingBottom: 15,
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 5,
          elevation: 3,
          zIndex: 10,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1e293b" />
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
            color: "#1e293b",
          }}
        >
          Pedido #{pedido.codigo_seguimiento || id}
        </Text>
        <View style={{ width: 20 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {/* STATUS CARD */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            marginTop: 10,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: 20,
            }}
          >
            Estado del Pedido
          </Text>

          <TimelineItem
            title="Confirmado"
            time="14:30"
            active={step === 0}
            completed={step > 0}
          />
          <TimelineItem
            title="Preparando"
            time="14:35"
            active={step === 1}
            completed={step > 1}
          />
          <TimelineItem
            title="En Camino"
            time="14:50"
            active={step === 2}
            completed={step > 2}
          />
          <TimelineItem
            title="Entregado"
            time="-"
            active={step === 3}
            completed={step > 3}
            isLast
          />
        </View>

        {/* DELIVERY INFO CARD */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            marginTop: 15,
            padding: 20,
            flexDirection: "row",
            alignItems: "center",
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#fee2e2",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 15,
            }}
          >
            <FontAwesome5 name="map-marker-alt" size={20} color="#C21833" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 12, color: "#94a3b8" }}>
              Dirección de Entrega
            </Text>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#1e293b" }}>
              {pedido.direccion_entrega_direccion ||
                pedido.direccion_entrega_texto ||
                "Av. Banzer, Calle 3 #450"}
            </Text>
          </View>
        </View>

        {/* DRIVER CARD */}
        {!isPickup && (
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 16,
              marginTop: 15,
              padding: 20,
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 10,
              elevation: 2,
            }}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#e2e8f0",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 15,
                overflow: "hidden",
              }}
            >
              {pedido.repartidor_foto ? (
                // Use Image if available, keeping simplistic for now
                <FontAwesome5 name="user" size={24} color="#64748b" />
              ) : (
                <FontAwesome5 name="user" size={24} color="#64748b" />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                Tu Repartidor
              </Text>
              <Text
                style={{ fontSize: 16, fontWeight: "bold", color: "#1e293b" }}
              >
                {pedido.repartidor_nombre || "Buscando..."}
              </Text>
              <Text style={{ fontSize: 13, color: "#64748b" }}>
                {pedido.repartidor_vehiculo || "Honda Cargo"} • 2839-XYZ
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCall}
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#10b981",
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#10b981",
                shadowOpacity: 0.3,
                shadowRadius: 5,
                elevation: 3,
              }}
            >
              <FontAwesome5 name="phone-alt" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}

        {/* ORDER SUMMARY */}
        <View
          style={{
            backgroundColor: "#fff",
            borderRadius: 16,
            marginTop: 15,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 10,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#1e293b",
              marginBottom: 15,
            }}
          >
            Resumen
          </Text>
          {pedido.items?.map((item: any, i: number) => (
            <View
              key={i}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
                borderBottomWidth: i === pedido.items.length - 1 ? 0 : 1,
                borderColor: "#f1f5f9",
                paddingBottom: i === pedido.items.length - 1 ? 0 : 8,
              }}
            >
              <Text style={{ color: "#334155" }}>
                <Text style={{ fontWeight: "bold" }}>{item.cantidad}x</Text>{" "}
                {item.nombre || "Producto"}
              </Text>
              <Text style={{ fontWeight: "600", color: "#334155" }}>
                ${parseFloat(item.precio_unitario).toFixed(2)}
              </Text>
            </View>
          ))}
          <View
            style={{
              marginTop: 15,
              paddingTop: 15,
              borderTopWidth: 1,
              borderColor: "#e2e8f0",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 16, fontWeight: "bold", color: "#0f172a" }}
            >
              Total Pagado
            </Text>
            <Text
              style={{ fontSize: 20, fontWeight: "bold", color: "#C21833" }}
            >
              ${parseFloat(pedido.total_final).toFixed(2)}
            </Text>
          </View>
        </View>

        {/* BOTTOM ICONS (Extra Actions) */}
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => router.push("/ayuda" as any)}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 5,
                elevation: 2,
              }}
            >
              <MaterialCommunityIcons
                name="face-agent"
                size={24}
                color="#64748b"
              />
            </View>
            <Text style={{ fontSize: 12, color: "#64748b" }}>Soporte</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ alignItems: "center" }}
            onPress={() => Alert.alert("Cancelar", "Contacta a soporte")}
          >
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 25,
                backgroundColor: "#fff",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 5,
                elevation: 2,
              }}
            >
              <MaterialCommunityIcons name="cancel" size={24} color="#ef4444" />
            </View>
            <Text style={{ fontSize: 12, color: "#64748b" }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
