import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useExplorarControlador } from "../../controladores/useExplorarControlador";

export default function ExplorarCompletoVista() {
  const router = useRouter();
  const {
    busqueda,
    setBusqueda,
    recursosFiltrados,
    categoriaActiva,
    setCategoriaActiva,
    categorias,
  } = useExplorarControlador();

  const getValidImageSource = (image: string | null | undefined) => {
    if (!image) return { uri: "https://via.placeholder.com/150" };
    if (image.startsWith("http")) return { uri: image };
    // Consistent picsum fallback
    let hash = 0;
    for (let i = 0; i < image.length; i++) {
      hash = (hash << 5) - hash + image.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    return { uri: `https://picsum.photos/seed/${seed}/200` };
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push(`/producto/${item.id}`)}
    >
      <View style={styles.imageContainer}>
        <Image
          source={getValidImageSource(item.imagen)}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{item.categoria}</Text>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.cardTitle} numberOfLines={1}>
            {item.titulo}
          </Text>
          <Text style={styles.cardDesc} numberOfLines={2}>
            {item.descripcion}
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <FontAwesome5 name="plus" size={14} color="#fff" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.screenTitle}>Explorar</Text>
          <View style={styles.searchBar}>
            <FontAwesome5 name="search" size={16} color="#94A3B8" />
            <TextInput
              style={styles.input}
              placeholder="¿Qué se te antoja hoy?"
              placeholderTextColor="#94A3B8"
              value={busqueda}
              onChangeText={setBusqueda}
            />
            {busqueda.length > 0 && (
              <TouchableOpacity onPress={() => setBusqueda("")}>
                <FontAwesome5 name="times-circle" size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <FlatList
            data={categorias}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item}
            style={styles.tagsContainer}
            contentContainerStyle={{ paddingHorizontal: 5 }}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => setCategoriaActiva(item)}
                style={[
                  styles.tag,
                  categoriaActiva === item && styles.tagActive,
                ]}
              >
                <Text
                  style={[
                    styles.tagText,
                    categoriaActiva === item && styles.tagTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>

        <FlatList
          data={recursosFiltrados}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <FontAwesome5 name="search" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>No encontramos resultados.</Text>
              <Text style={styles.emptySubtext}>
                Intenta con otra categoría.
              </Text>
            </View>
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 3,
    zIndex: 10,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 15,
    height: 48,
    borderRadius: 12,
    marginBottom: 15,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: "#1E293B" },
  tagsContainer: { maxHeight: 40 },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    marginRight: 10,
    borderWidth: 1,
    borderColor: "transparent",
  },
  tagActive: {
    backgroundColor: "#EA052C",
    borderColor: "#EA052C",
  },
  tagText: { color: "#64748B", fontWeight: "600", fontSize: 13 },
  tagTextActive: { color: "#fff" },

  list: { padding: 20, paddingBottom: 100 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0", // Subtle border
  },
  imageContainer: {
    height: 160,
    width: "100%",
    backgroundColor: "#E2E8F0",
    position: "relative",
  },
  cardImage: { width: "100%", height: "100%" },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "rgba(255,255,255,0.95)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#EA052C",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  cardContent: {
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: "#64748B",
    lineHeight: 18,
    marginRight: 10,
  },
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EA052C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EA052C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#475569",
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#94A3B8",
    marginTop: 5,
  },
});
