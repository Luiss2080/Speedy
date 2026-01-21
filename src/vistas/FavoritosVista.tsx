import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useFavoritos } from "../context/ContextoFavoritos";
import { FavoritosEstilos } from "../estilos/FavoritosEstilos";

export default function FavoritosVista() {
  const router = useRouter();
  const { favoritos } = useFavoritos();

  return (
    <View style={FavoritosEstilos.contenedor}>
      <LinearGradient
        colors={["#C21833", "#9f1239"]}
        style={FavoritosEstilos.encabezado}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginRight: 15 }}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={FavoritosEstilos.tituloEncabezado}>Mis Favoritos</Text>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={FavoritosEstilos.grid}>
        {favoritos.length === 0 ? (
          <View style={{ alignItems: "center", marginTop: 50, width: "100%" }}>
            <FontAwesome5 name="heart-broken" size={50} color="#cbd5e1" />
            <Text
              style={{ marginTop: 20, color: "#64748b", textAlign: "center" }}
            >
              Aún no tienes favoritos.{"\n"}¡Explora y guarda lo que te guste!
            </Text>
          </View>
        ) : (
          favoritos.map((fav) => (
            <TouchableOpacity
              key={fav.id}
              style={FavoritosEstilos.card}
              activeOpacity={0.9}
              onPress={() => router.push(`/producto/${fav.id}`)}
            >
              <Image
                source={{ uri: fav.imagen }}
                style={FavoritosEstilos.imagen}
              />
              <View style={FavoritosEstilos.botonCorazon}>
                <FontAwesome5 name="heart" size={14} color="#C21833" solid />
              </View>
              <View style={FavoritosEstilos.info}>
                <Text style={FavoritosEstilos.nombre}>{fav.nombre}</Text>
                <View style={FavoritosEstilos.rating}>
                  <FontAwesome5 name="star" size={12} color="#eab308" solid />
                  <Text style={FavoritosEstilos.textoRating}>{fav.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}
