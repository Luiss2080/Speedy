import { FontAwesome5 } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image as RNImage,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useExplorarControlador } from "../controladores/useExplorarControlador";
import { ExplorarEstilos } from "../estilos/ExplorarEstilos";

export default function ExplorarVista() {
  const {
    busqueda,
    setBusqueda,
    recursosFiltrados,
    categoriaActiva,
    setCategoriaActiva,
    categorias,
  } = useExplorarControlador();
  const router = useRouter();

  return (
    <View style={ExplorarEstilos.contenedor}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
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
                placeholder="Buscar hamburguesas, sushi..."
                placeholderTextColor="#9ca3af"
                value={busqueda}
                onChangeText={setBusqueda}
              />
            </View>

            {/* Categories Filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ marginTop: 15, maxHeight: 40 }}
            >
              {categorias.map((cat, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCategoriaActiva(cat)}
                  style={{
                    backgroundColor:
                      categoriaActiva === cat ? "#C21833" : "#f3f4f6",
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      color: categoriaActiva === cat ? "#fff" : "#4b5563",
                      fontWeight: "600",
                    }}
                  >
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <FlatList
            data={recursosFiltrados}
            keyExtractor={(item) => item.id}
            contentContainerStyle={[
              ExplorarEstilos.lista,
              { paddingBottom: 100 },
            ]} // Added padding bottom
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={ExplorarEstilos.tarjeta}
                activeOpacity={0.8}
                onPress={() => router.push(`/producto/${item.id}`)}
              >
                <View style={{ position: "relative" }}>
                  <RNImage
                    source={{ uri: item.imagen }}
                    style={{
                      width: "100%",
                      height: 150,
                      borderTopLeftRadius: 15,
                      borderTopRightRadius: 15,
                    }}
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 10,
                      left: 10,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 10,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        color: "#C21833",
                      }}
                    >
                      {item.categoria}
                    </Text>
                  </View>
                </View>

                <View style={{ padding: 15 }}>
                  <Text style={ExplorarEstilos.tituloTarjeta}>
                    {item.titulo}
                  </Text>
                  <Text
                    style={ExplorarEstilos.descripcionTarjeta}
                    numberOfLines={2}
                  >
                    {item.descripcion}
                  </Text>

                  <View style={ExplorarEstilos.pieTarjeta}>
                    <Text style={ExplorarEstilos.textoEnlace}>
                      Ordenar ahora
                    </Text>
                    <View
                      style={{
                        backgroundColor: "#C21833",
                        padding: 5,
                        borderRadius: 10,
                      }}
                    >
                      <FontAwesome5 name="plus" size={12} color="#fff" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}
