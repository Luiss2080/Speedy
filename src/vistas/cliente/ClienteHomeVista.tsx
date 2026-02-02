import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getCategorias, getRestaurantes } from "../../servicios/BaseDeDatos";

const { width } = Dimensions.get("window");

const EXAMPLE_BANNERS = [
  "https://img.freepik.com/premium-photo/delicious-food-collage-setup_23-2150586940.jpg",
  "https://t3.ftcdn.net/jpg/02/52/38/80/360_F_252388016_KjPnB9vglSCuUJAumCDNbmMzGdzPAucK.jpg",
];

export default function ClienteHomeVista() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<any[]>([]);
  const [restaurantes, setRestaurantes] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const cats = await getCategorias();
    const rests = await getRestaurantes();
    setCategorias(cats);
    setRestaurantes(rests);
  };

  const getValidImageSource = (image: string) => {
    if (!image) return { uri: "https://via.placeholder.com/300" };
    if (image.startsWith("http")) return { uri: image };
    // Robust fallback for partial IDs or random strings
    const seed = image.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    return { uri: `https://picsum.photos/seed/${seed}/400/300` };
  };

  const renderRestaurantCard = (rest: any) => (
    <TouchableOpacity
      key={rest.id}
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/restaurante/${rest.id}`)}
    >
      <Image
        source={getValidImageSource(rest.imagen_portada)}
        style={styles.cardImage}
      />
      <View style={styles.timeBadge}>
        <FontAwesome5 name="clock" size={12} color="#1F2937" />
        <Text style={styles.timeText}>
          {rest.tiempo_estimado_min}-{rest.tiempo_estimado_max} min
        </Text>
      </View>

      <View style={styles.cardContent}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.restName}>{rest.nombre}</Text>
          <View style={styles.ratingBadge}>
            <Text style={styles.ratingText}>{rest.calificacion}</Text>
            <FontAwesome5 name="star" size={10} color="#fff" solid />
          </View>
        </View>
        <Text style={styles.restDesc} numberOfLines={1}>
          {rest.descripcion}
        </Text>
        <Text style={styles.deliveryFee}>
          {parseFloat(rest.costo_envio_base) === 0
            ? "Envío Gratis"
            : `$${rest.costo_envio_base} envío`}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.locationContainer}>
          <FontAwesome5 name="map-marker-alt" size={16} color="#EA052C" />
          <Text style={styles.locationText} numberOfLines={1}>
            Casa • Calle Principal 123
          </Text>
          <FontAwesome5
            name="chevron-down"
            size={12}
            color="#6B7280"
            style={{ marginLeft: 5 }}
          />
        </View>
        <FontAwesome5 name="bell" size={20} color="#374151" />
      </View>

      <View style={styles.searchContainer}>
        <FontAwesome5
          name="search"
          size={16}
          color="#9CA3AF"
          style={{ marginLeft: 15 }}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="¿Qué se te antoja hoy?"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Banners */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.bannerScroll}
        >
          {EXAMPLE_BANNERS.map((uri, idx) => (
            <View key={idx} style={styles.bannerContainer}>
              <Image source={{ uri }} style={styles.bannerImage} />
              <View
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  backgroundColor: "#EA052C",
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 12 }}
                >
                  PROMO 50%
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Categories */}
        <View
          style={[
            styles.sectionHeader,
            {
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            },
          ]}
        >
          <Text style={styles.sectionTitle}>Categorías</Text>
          <TouchableOpacity
            onPress={() => router.push("/(client-tabs)/explorar" as any)}
          >
            <Text style={{ color: "#EA052C", fontWeight: "bold" }}>
              Ver todo
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.catScroll}
        >
          {categorias.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.catItem}>
              <View
                style={[
                  styles.catIconContainer,
                  { backgroundColor: cat.color || "#FEF2F2" },
                ]}
              >
                <FontAwesome5
                  name={cat.icono || "utensils"}
                  size={24}
                  color="#EA052C"
                />
              </View>
              <Text style={styles.catName}>{cat.nombre}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Restaurants */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Restaurantes Recomendados</Text>
        </View>
        <View style={styles.restaurantList}>
          {restaurantes.map(renderRestaurantCard)}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  locationContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  locationText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "bold",
    color: "#1F2937",
    maxWidth: "80%",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    marginHorizontal: 20,
    marginTop: 5,
    marginBottom: 15,
    borderRadius: 12,
    height: 45,
  },
  searchInput: { flex: 1, height: "100%", paddingHorizontal: 10, fontSize: 16 },
  bannerScroll: { paddingLeft: 20, marginBottom: 20 },
  bannerContainer: {
    width: width * 0.85,
    height: 160,
    marginRight: 15,
    borderRadius: 15,
    overflow: "hidden",
  },
  bannerImage: { width: "100%", height: "100%", resizeMode: "cover" },
  sectionHeader: { paddingHorizontal: 20, marginBottom: 15 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#111827" },
  catScroll: { paddingLeft: 20, marginBottom: 25 },
  catItem: { alignItems: "center", marginRight: 20, width: 70 },
  catIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  catName: { fontSize: 12, color: "#4B5563", textAlign: "center" },
  restaurantList: { paddingHorizontal: 20 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
  },
  cardImage: { width: "100%", height: 180, resizeMode: "cover" },
  timeBadge: {
    position: "absolute",
    right: 15,
    top: 150,
    backgroundColor: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  timeText: { fontSize: 12, fontWeight: "bold", marginLeft: 5 },
  cardContent: { padding: 15 },
  restName: { fontSize: 18, fontWeight: "bold", color: "#1F2937", flex: 1 },
  ratingBadge: {
    backgroundColor: "#EA052C",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 3,
  },
  restDesc: { color: "#6B7280", fontSize: 14, marginTop: 4, marginBottom: 8 },
  deliveryFee: { fontSize: 14, color: "#059669", fontWeight: "500" },
});
