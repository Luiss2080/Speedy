import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { crearDireccion, getDirecciones } from "../../servicios/BaseDeDatos";

export default function MisDireccionesVista() {
  const router = useRouter();
  const [direcciones, setDirecciones] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  // New Address Form State
  const [alias, setAlias] = useState("");
  const [direccion, setDireccion] = useState("");
  const [referencia, setReferencia] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await getDirecciones();
    setDirecciones(data);
  };

  const handleSave = async () => {
    if (!alias || !direccion) {
      alert("Completa los campos obligatorios");
      return;
    }
    await crearDireccion(alias, direccion, referencia);
    setModalVisible(false);
    setAlias("");
    setDireccion("");
    setReferencia("");
    loadData();
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.iconContainer}>
        <FontAwesome5 name="map-marker-alt" size={20} color="#EA052C" />
      </View>
      <View style={styles.info}>
        <Text style={styles.alias}>{item.titulo || "Casa"}</Text>
        <Text style={styles.address}>
          {item.direccion || item.calle_numero}
        </Text>
        {item.referencia && <Text style={styles.ref}>{item.referencia}</Text>}
      </View>
      <TouchableOpacity style={styles.optionBtn}>
        <FontAwesome5 name="ellipsis-v" size={14} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mis Direcciones</Text>
        <View style={{ width: 20 }} />
      </View>

      <FlatList
        data={direcciones}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <FontAwesome5 name="map-marked-alt" size={50} color="#E2E8F0" />
            <Text style={styles.emptyText}>
              No tienes direcciones guardadas.
            </Text>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <FontAwesome5 name="plus" size={20} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nueva Dirección</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <FontAwesome5 name="times" size={20} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.form}
              showsVerticalScrollIndicator={false}
            >
              <TextInput
                style={styles.input}
                placeholder="Nombre (ej. Casa, Trabajo)"
                value={alias}
                onChangeText={setAlias}
              />
              <TextInput
                style={styles.input}
                placeholder="Dirección / Calle y Número"
                value={direccion}
                onChangeText={setDireccion}
              />
              <TextInput
                style={[styles.input, { height: 80, textAlignVertical: "top" }]}
                placeholder="Referencia (opcional)"
                multiline
                value={referencia}
                onChangeText={setReferencia}
              />

              <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                <Text style={styles.saveText}>Guardar Dirección</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#1E293B" },

  list: { padding: 20 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  info: { flex: 1 },
  alias: { fontSize: 16, fontWeight: "bold", color: "#1E293B" },
  address: { color: "#64748B", marginTop: 2 },
  ref: { color: "#94A3B8", fontSize: 12, marginTop: 2, fontStyle: "italic" },
  optionBtn: { padding: 10 },

  empty: { alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 20, color: "#94A3B8" },

  fab: {
    position: "absolute",
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EA052C",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#EA052C",
    shadowOpacity: 0.4,
    elevation: 8,
  },

  modalContent: { flex: 1, padding: 20, backgroundColor: "#fff" },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  modalTitle: { fontSize: 22, fontWeight: "bold", color: "#1E293B" },
  form: { gap: 20 },
  input: {
    backgroundColor: "#F8FAFC",
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  saveBtn: {
    backgroundColor: "#EA052C",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
