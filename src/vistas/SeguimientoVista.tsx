import { FontAwesome5 } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { SeguimientoEstilos } from "../estilos/SeguimientoEstilos";

export default function SeguimientoVista() {
  const { id } = useLocalSearchParams();

  return (
    <View style={SeguimientoEstilos.contenedor}>
      <View style={SeguimientoEstilos.mapaPlaceholder}>
        <FontAwesome5 name="map-marked-alt" size={50} color="#cbd5e1" />
        <Text style={SeguimientoEstilos.textoMapa}>Mapa de Rastreo</Text>
      </View>

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
