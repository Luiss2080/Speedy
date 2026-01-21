import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProductoControlador } from "../controladores/useProductoControlador";
import { ProductoEstilos } from "../estilos/ProductoEstilos";

export default function ProductoVista() {
  const router = useRouter();
  const {
    producto,
    cantidad,
    instrucciones,
    setInstrucciones,
    extrasSeleccionados,
    toggleExtra,
    incrementarCantidad,
    decrementarCantidad,
    agregarAlCarrito,
    total,
    esFavorito,
    toggleFavorito,
  } = useProductoControlador();

  return (
    <View style={ProductoEstilos.contenedor}>
      <ScrollView contentContainerStyle={ProductoEstilos.scrollContent}>
        {/* Header Image & Buttons */}
        <View style={ProductoEstilos.headerImagen}>
          <Image
            source={{ uri: producto.imagen }}
            style={ProductoEstilos.imagen}
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 100,
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          />
          <TouchableOpacity
            style={ProductoEstilos.botonAtras}
            onPress={() => router.back()}
          >
            <FontAwesome5 name="arrow-left" size={20} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity
            style={ProductoEstilos.botonFavorito}
            onPress={toggleFavorito}
          >
            <MaterialCommunityIcons
              name={esFavorito ? "heart" : "heart-outline"}
              size={24}
              color={esFavorito ? "#ef4444" : "#1f2937"}
            />
          </TouchableOpacity>
        </View>

        <View style={ProductoEstilos.infoContenedor}>
          {/* Header Info */}
          <View style={ProductoEstilos.encabezadoInfo}>
            <Text style={ProductoEstilos.nombre}>{producto.nombre}</Text>
            <Text style={ProductoEstilos.precio}>
              ${producto.precio.toFixed(2)}
            </Text>
          </View>

          {/* Meta Info */}
          <View style={ProductoEstilos.metaInfo}>
            {producto.calorias && (
              <View style={ProductoEstilos.etiquetaMeta}>
                <MaterialCommunityIcons name="fire" size={16} color="#f97316" />
                <Text style={ProductoEstilos.textoMeta}>
                  {producto.calorias} kcal
                </Text>
              </View>
            )}
            {producto.tiempoPreparacion && (
              <View style={ProductoEstilos.etiquetaMeta}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color="#3b82f6"
                />
                <Text style={ProductoEstilos.textoMeta}>
                  {producto.tiempoPreparacion}
                </Text>
              </View>
            )}
          </View>

          <Text style={ProductoEstilos.descripcion}>
            {producto.descripcion}
          </Text>

          {/* Extras Selection */}
          <Text style={ProductoEstilos.tituloSeccion}>
            Personaliza tu orden
          </Text>
          {producto.extrasDisponibles?.map((extra) => {
            const isSelected = extrasSeleccionados.includes(extra.id);
            return (
              <TouchableOpacity
                key={extra.id}
                style={ProductoEstilos.extraItem}
                onPress={() => toggleExtra(extra.id)}
                activeOpacity={0.7}
              >
                <View style={ProductoEstilos.extraInfo}>
                  <View
                    style={[
                      ProductoEstilos.checkbox,
                      isSelected && ProductoEstilos.checkboxSeleccionado,
                    ]}
                  >
                    {isSelected && (
                      <FontAwesome5 name="check" size={12} color="#fff" />
                    )}
                  </View>
                  <Text style={ProductoEstilos.nombreExtra}>
                    {extra.nombre}
                  </Text>
                </View>
                <Text style={ProductoEstilos.precioExtra}>
                  +${extra.precio.toFixed(2)}
                </Text>
              </TouchableOpacity>
            );
          })}

          {/* Special Instructions */}
          <Text style={ProductoEstilos.tituloSeccion}>
            Instrucciones especiales
          </Text>
          <TextInput
            style={ProductoEstilos.inputInstrucciones}
            placeholder="Ej: Sin cebolla, extra salsa..."
            multiline
            numberOfLines={4}
            value={instrucciones}
            onChangeText={setInstrucciones}
          />
        </View>
      </ScrollView>

      {/* Sticky Footer */}
      <View style={ProductoEstilos.footer}>
        <View style={ProductoEstilos.controlCantidad}>
          <TouchableOpacity
            onPress={decrementarCantidad}
            style={ProductoEstilos.botonCantidad}
          >
            <FontAwesome5 name="minus" size={16} color="#333" />
          </TouchableOpacity>
          <Text style={ProductoEstilos.textoCantidad}>{cantidad}</Text>
          <TouchableOpacity
            onPress={incrementarCantidad}
            style={ProductoEstilos.botonCantidad}
          >
            <FontAwesome5 name="plus" size={16} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={ProductoEstilos.botonAgregar}
          activeOpacity={0.8}
          onPress={agregarAlCarrito}
        >
          <Text style={ProductoEstilos.textoBoton}>Agregar ${total}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
