import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { MetodosPagoEstilos } from "../estilos/MetodosPagoEstilos";
import { API_URL } from "../servicios/BaseDeDatos";
import { useAuthStore } from "../stores/useAuthStore";

export default function MetodosPagoVista() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [tarjetas, setTarjetas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);

  // Form State
  const [marca, setMarca] = useState("Visa");
  const [ultimosDigitos, setUltimosDigitos] = useState("");

  useEffect(() => {
    if (user) loadTarjetas();
  }, [user]);

  const loadTarjetas = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/pagos/${user.id}`);
      const data = await res.json();
      setTarjetas(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const agregarTarjeta = async () => {
    if (!ultimosDigitos || ultimosDigitos.length !== 4) {
      Alert.alert("Error", "Ingresa los últimos 4 dígitos");
      return;
    }
    try {
      await fetch(`${API_URL}/api/pagos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: user?.id,
          marca,
          ultimos_digitos: ultimosDigitos,
        }),
      });
      setModalVisible(false);
      setUltimosDigitos("");
      loadTarjetas();
    } catch (error) {
      Alert.alert("Error", "No se pudo agregar la tarjeta");
    }
  };

  const eliminarTarjeta = async (id: number) => {
    try {
      await fetch(`${API_URL}/api/pagos/${id}`, {
        method: "DELETE",
      });
      loadTarjetas();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={MetodosPagoEstilos.contenedor}>
      <View style={MetodosPagoEstilos.encabezado}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome5 name="arrow-left" size={20} color="#333" />
        </TouchableOpacity>
        <Text style={MetodosPagoEstilos.titulo}>Métodos de Pago</Text>
        <View style={{ width: 20 }} />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#C21833"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={tarjetas}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", color: "#666", marginTop: 20 }}>
              No tienes tarjetas guardadas.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={MetodosPagoEstilos.tarjeta}>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5
                  name={
                    item.marca.toLowerCase() === "visa"
                      ? "cc-visa"
                      : "cc-mastercard"
                  }
                  size={30}
                  color="#333"
                  style={{ marginRight: 15 }}
                />
                <View>
                  <Text style={MetodosPagoEstilos.textoMarca}>
                    {item.marca}
                  </Text>
                  <Text style={MetodosPagoEstilos.textoNumero}>
                    **** {item.ultimos_digitos}
                  </Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => eliminarTarjeta(item.id)}>
                <FontAwesome5 name="trash" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      <TouchableOpacity
        style={MetodosPagoEstilos.botonAgregar}
        onPress={() => setModalVisible(true)}
      >
        <Text style={MetodosPagoEstilos.textoBoton}>Agregar Tarjeta</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={MetodosPagoEstilos.modalOverlay}>
          <View style={MetodosPagoEstilos.modalContent}>
            <Text style={MetodosPagoEstilos.modalTitulo}>Nueva Tarjeta</Text>

            <Text style={{ marginBottom: 5 }}>Marca</Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
              <TouchableOpacity
                onPress={() => setMarca("Visa")}
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor: marca === "Visa" ? "#C21833" : "#ccc",
                  borderRadius: 5,
                }}
              >
                <Text style={{ color: marca === "Visa" ? "#C21833" : "#333" }}>
                  Visa
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setMarca("Mastercard")}
                style={{
                  padding: 10,
                  borderWidth: 1,
                  borderColor: marca === "Mastercard" ? "#C21833" : "#ccc",
                  borderRadius: 5,
                }}
              >
                <Text
                  style={{ color: marca === "Mastercard" ? "#C21833" : "#333" }}
                >
                  Mastercard
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={{ marginBottom: 5 }}>Últimos 4 dígitos</Text>
            <TextInput
              style={MetodosPagoEstilos.input}
              value={ultimosDigitos}
              onChangeText={setUltimosDigitos}
              keyboardType="numeric"
              maxLength={4}
              placeholder="1234"
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                gap: 10,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={MetodosPagoEstilos.botonCancelar}
              >
                <Text style={{ color: "#666" }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={agregarTarjeta}
                style={MetodosPagoEstilos.botonGuardar}
              >
                <Text style={{ color: "#fff" }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
