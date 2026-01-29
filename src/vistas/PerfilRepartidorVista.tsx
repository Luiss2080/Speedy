import { FontAwesome5 } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function PerfilRepartidorVista() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [repartidor, setRepartidor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Mock Reviews since we might not have a full reviews endpoint yet
  const reviews = [
    {
      id: 1,
      user: "Laura M.",
      rating: 5,
      comment: "¡Súper rápido y amable!",
      date: "Hace 2 días",
    },
    {
      id: 2,
      user: "Carlos P.",
      rating: 4,
      comment: "Llegó bien, todo ok.",
      date: "Hace 1 semana",
    },
  ];

  useEffect(() => {
    // In a real app we would have a specific endpoint /api/repartidores/:id
    // For now we will simulate it or fetch 'pedidos' to extract data if needed,
    // but better to mock for this specific view if endpoint doesn't exist.
    // Let's mock it for visually stunning UI first.
    setTimeout(() => {
      setRepartidor({
        id: id,
        nombre: "Juan Pérez",
        antiguedad: "2 años",
        viajes: 1250,
        calificacion: 4.8,
        vehiculo: "Honda Wave 110",
        placa: "AB-123-CD",
        foto: "https://i.pravatar.cc/300?img=11",
      });
      setLoading(false);
    }, 1000);
  }, [id]);

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#C21833" />
      </View>
    );

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <LinearGradient
            colors={["#C21833", "#9f1239"]}
            style={styles.headerGradient}
          >
            <Image source={{ uri: repartidor.foto }} style={styles.avatar} />
            <Text style={styles.name}>{repartidor.nombre}</Text>
            <View style={styles.ratingContainer}>
              <FontAwesome5 name="star" size={16} color="#FFD700" solid />
              <Text style={styles.ratingText}>{repartidor.calificacion}</Text>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{repartidor.viajes}</Text>
            <Text style={styles.statLabel}>Viajes</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{repartidor.antiguedad}</Text>
            <Text style={styles.statLabel}>Experiencia</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <FontAwesome5 name="motorcycle" size={20} color="#C21833" />
            <Text style={styles.statLabel}>{repartidor.vehiculo}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Reseñas Recientes</Text>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Text style={styles.reviewUser}>{review.user}</Text>
                <View style={{ flexDirection: "row" }}>
                  {[...Array(review.rating)].map((_, i) => (
                    <FontAwesome5
                      key={i}
                      name="star"
                      size={12}
                      color="#FFD700"
                      solid
                    />
                  ))}
                </View>
              </View>
              <Text style={styles.reviewComment}>{review.comment}</Text>
              <Text style={styles.reviewDate}>{review.date}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { alignItems: "center", marginBottom: 20 },
  headerGradient: {
    width: "100%",
    padding: 40,
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  name: { fontSize: 24, fontWeight: "bold", color: "white" },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 15,
    marginTop: 5,
  },
  ratingText: { color: "white", marginLeft: 5, fontWeight: "bold" },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "white",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 15,
    marginTop: -25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#1e293b" },
  statLabel: { fontSize: 12, color: "#64748b", marginTop: 4 },
  divider: { width: 1, backgroundColor: "#e2e8f0" },
  section: { padding: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
  },
  reviewCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  reviewUser: { fontWeight: "bold", color: "#0f172a" },
  reviewComment: { color: "#475569", marginBottom: 5 },
  reviewDate: { fontSize: 11, color: "#94a3b8" },
});
