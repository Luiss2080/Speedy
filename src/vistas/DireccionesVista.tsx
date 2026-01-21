import { FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { DireccionesEstilos } from "../estilos/DireccionesEstilos";
import { crearDireccion, getDirecciones } from "../servicios/BaseDeDatos";

export default function DireccionesVista() {
  const router = useRouter();
  const [direcciones, setDirecciones] = useState<any[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [nuevoTitulo, setNuevoTitulo] = useState("");
  const [nuevaDireccion, setNuevaDireccion] = useState("");
  const [nuevaReferencia, setNuevaReferencia] = useState("");

  useEffect(() => {
    cargarDirecciones();
  }, []);

  const cargarDirecciones = async () => {
    try {
      const datos = await getDirecciones();
      setDirecciones(datos);
    } catch (e) {
      console.error(e);
    }
  };

  const guardarDireccion = async () => {
    if (!nuevoTitulo || !nuevaDireccion) {
      Alert.alert("Error", "Completa los campos obligatorios");
      return;
    }

    try {
      await crearDireccion(nuevoTitulo, nuevaDireccion, nuevaReferencia);
      setModalVisible(false);
      setNuevoTitulo("");
      setNuevaDireccion("");
      setNuevaReferencia("");
      await cargarDirecciones();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (e) {
      Alert.alert("Error", "No se pudo guardar la dirección");
    }
  };

  return (
    <View style={DireccionesEstilos.contenedor}>
      <LinearGradient
        colors={["#C21833", "#9f1239"]}
        style={DireccionesEstilos.encabezado}
      >
        <SafeAreaView style={{ backgroundColor: "transparent" }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 20,
              paddingTop: 10,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginRight: 15 }}
            >
              <FontAwesome5 name="arrow-left" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={DireccionesEstilos.tituloEncabezado}>
              Mis Direcciones
            </Text>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <ScrollView contentContainerStyle={DireccionesEstilos.lista}>
        {direcciones.map((dir) => (
          <TouchableOpacity
            key={dir.id}
            style={DireccionesEstilos.tarjeta}
            activeOpacity={0.7}
            onPress={() => Haptics.selectionAsync()}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", flex: 1 }}
            >
              <View style={DireccionesEstilos.iconoDireccion}>
                <FontAwesome5 name="map-marker-alt" size={18} color="#C21833" />
              </View>
              <View style={DireccionesEstilos.infoDireccion}>
                <Text style={DireccionesEstilos.tituloDireccion}>
                  {dir.titulo}
                </Text>
                <Text style={DireccionesEstilos.textoDireccion}>
                  {dir.direccion}
                </Text>
                {dir.referencia ? (
                  <Text
                    style={{ fontSize: 12, color: "#666", fontStyle: "italic" }}
                  >
                    {dir.referencia}
                  </Text>
                ) : null}
              </View>
            </View>
            <FontAwesome5 name="pen" size={14} color="#9ca3af" />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={DireccionesEstilos.botonAgregar}
          activeOpacity={0.8}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            setModalVisible(true);
          }}
        >
          <FontAwesome5 name="plus" size={16} color="#fff" />
          <Text style={DireccionesEstilos.textoBoton}>
            Agregar Nueva Dirección
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal para agregar dirección */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        >
          <View
            style={{
              backgroundColor: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              maxHeight: "80%", // Limit height so it doesn't cover full screen unwieldily
            }}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  marginBottom: 20,
                  color: "#333",
                }}
              >
                Nueva Dirección
              </Text>

              <Text style={{ marginBottom: 5, fontWeight: "600" }}>
                Nombre (Ej: Casa, Trabajo)
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 15,
                  backgroundColor: "#f9f9f9",
                }}
                placeholder="Ej: Casa"
                value={nuevoTitulo}
                onChangeText={setNuevoTitulo}
              />

              <Text style={{ marginBottom: 5, fontWeight: "600" }}>
                Dirección exacta
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 15,
                  backgroundColor: "#f9f9f9",
                }}
                placeholder="Av. Principal 123"
                value={nuevaDireccion}
                onChangeText={setNuevaDireccion}
              />

              <Text style={{ marginBottom: 5, fontWeight: "600" }}>
                Referencia (Opcional)
              </Text>
              <TextInput
                style={{
                  borderWidth: 1,
                  borderColor: "#ddd",
                  borderRadius: 10,
                  padding: 10,
                  marginBottom: 20,
                  backgroundColor: "#f9f9f9",
                }}
                placeholder="Frente al parque..."
                value={nuevaReferencia}
                onChangeText={setNuevaReferencia}
              />

              <TouchableOpacity
                style={{
                  backgroundColor: "#C21833",
                  padding: 15,
                  borderRadius: 10,
                  alignItems: "center",
                  marginBottom: 10,
                }}
                onPress={guardarDireccion}
              >
                <Text
                  style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}
                >
                  Guardar Dirección
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{ padding: 15, alignItems: "center", marginBottom: 20 }}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#666", fontSize: 16 }}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}
