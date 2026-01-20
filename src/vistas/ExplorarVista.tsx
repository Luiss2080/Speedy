import { FontAwesome5 } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useExplorarControlador } from "../controladores/useExplorarControlador";
import { ExplorarEstilos } from "../estilos/ExplorarEstilos";

export default function ExplorarVista() {
  const { busqueda, setBusqueda, recursosFiltrados } = useExplorarControlador();
  const router = useRouter();

  return (
    <View style={ExplorarEstilos.contenedor}>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={ExplorarEstilos.encabezado}>
        <Text style={ExplorarEstilos.titulo}>Explorar</Text>
        <View style={ExplorarEstilos.contenedorBusqueda}>
          <FontAwesome5
            name="search"
            size={16}
            color="#9ca3af"
            style={ExplorarEstilos.iconoBusqueda}
          />
          <TextInput
            style={ExplorarEstilos.entradaBusqueda}
            placeholder="Buscar cursos, artículos..."
            placeholderTextColor="#9ca3af"
            value={busqueda}
            onChangeText={setBusqueda}
          />
        </View>
      </View>

      <FlatList
        data={recursosFiltrados}
        keyExtractor={(item) => item.id}
        contentContainerStyle={ExplorarEstilos.lista}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={ExplorarEstilos.tarjeta}
            onPress={() => router.push(`/detalle/${item.id}`)}
          >
            <View style={ExplorarEstilos.encabezadoTarjeta}>
              <View style={ExplorarEstilos.insignia}>
                <Text style={ExplorarEstilos.textoInsignia}>
                  {item.categoria}
                </Text>
              </View>
            </View>
            <Text style={ExplorarEstilos.tituloTarjeta}>{item.titulo}</Text>
            <Text style={ExplorarEstilos.descripcionTarjeta} numberOfLines={2}>
              {item.descripcion}
            </Text>

            <View style={ExplorarEstilos.pieTarjeta}>
              <Text style={ExplorarEstilos.textoEnlace}>Ver más</Text>
              <FontAwesome5 name="arrow-right" size={12} color="#3b82f6" />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
