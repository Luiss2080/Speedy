import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useRef } from "react";
import { Text, View } from "react-native";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { SeguimientoEstilos } from "../estilos/SeguimientoEstilos";

export default function SeguimientoVista() {
  const { id } = useLocalSearchParams();
  const mapRef = useRef<MapView>(null);

  return (
    <View style={SeguimientoEstilos.contenedor}>
      <MapView
        ref={mapRef}
        style={SeguimientoEstilos.mapaPlaceholder} // Reuse style for dimensions
        provider={PROVIDER_DEFAULT}
        initialRegion={{
          latitude: -12.122146, // Miraflores, Lima (example)
          longitude: -77.030995,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker
          coordinate={{ latitude: -12.122146, longitude: -77.030995 }}
          title="Tu ubicación"
          description="Av. Larco 123"
        >
          <View
            style={{
              backgroundColor: "#C21833",
              padding: 5,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: "white",
            }}
          >
            <FontAwesome5 name="home" size={12} color="white" />
          </View>
        </Marker>

        <Marker
          coordinate={{ latitude: -12.125, longitude: -77.025 }}
          title="Repartidor"
          description="En camino"
        >
          <View
            style={{
              backgroundColor: "#fff",
              padding: 5,
              borderRadius: 20,
              borderWidth: 2,
              borderColor: "#C21833",
            }}
          >
            <FontAwesome5 name="motorcycle" size={14} color="#C21833" />
          </View>
        </Marker>
      </MapView>

      <View style={SeguimientoEstilos.panelEstado}>
        <Text style={SeguimientoEstilos.estadoTitulo}>En camino</Text>
        <Text style={SeguimientoEstilos.estadoSubtitulo}>
          Tu pedido llegará en 15 min
        </Text>

        <View style={SeguimientoEstilos.barraProgreso}>
          <View
            style={[SeguimientoEstilos.progresoRelleno, { width: "70%" }]}
          />
        </View>

        <View style={SeguimientoEstilos.repartidorInfo}>
          <View style={SeguimientoEstilos.avatar} />
          <View>
            <Text style={SeguimientoEstilos.repartidorNombre}>Juan Pérez</Text>
            <Text style={SeguimientoEstilos.repartidorPlaca}>
              Yamaha YBR - PLACA: 1234
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
