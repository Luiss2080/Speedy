import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CalificarVista() {
  const router = useRouter();
  const [ratingRest, setRatingRest] = useState(0);
  const [ratingDriver, setRatingDriver] = useState(0);

  const renderStars = (rating: number, setRating: (r: number) => void) => {
    return (
      <View style={{ flexDirection: "row", gap: 10 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <FontAwesome5
              name="star"
              size={30}
              color={star <= rating ? "#FFD700" : "#cbd5e1"}
              solid
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>¡Pedido Entregado!</Text>
        <Text style={styles.subtitle}>
          Ayúdanos a mejorar calificando tu experiencia.
        </Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Restaurante</Text>
          <Text
            style={{ textAlign: "center", marginBottom: 10, color: "#64748b" }}
          >
            ¿Qué tal estuvo la comida?
          </Text>
          {renderStars(ratingRest, setRatingRest)}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Repartidor</Text>
          <Text
            style={{ textAlign: "center", marginBottom: 10, color: "#64748b" }}
          >
            ¿Qué tal fue el servicio de entrega?
          </Text>
          {renderStars(ratingDriver, setRatingDriver)}
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[
            styles.button,
            (ratingRest === 0 || ratingDriver === 0) && styles.buttonDisabled,
          ]}
          disabled={ratingRest === 0 || ratingDriver === 0}
          onPress={() => {
            // Here we would call API to save rating
            router.dismissAll();
            router.replace("/dashboard" as any);
          }}
        >
          <Text style={styles.buttonText}>Enviar Calificación</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.replace("/dashboard" as any)}
          style={{ marginTop: 15 }}
        >
          <Text style={{ color: "#94a3b8", fontSize: 16 }}>Omitir</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: {
    flex: 1,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 40,
  },
  card: {
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 5,
  },
  button: {
    width: "100%",
    backgroundColor: "#C21833",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonDisabled: { backgroundColor: "#cbd5e1" },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
