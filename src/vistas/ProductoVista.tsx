import { FontAwesome5 } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useProductoControlador } from "../controladores/useProductoControlador";
import { ProductoEstilos } from "../estilos/ProductoEstilos";

export default function ProductoVista() {
  const {
    producto,
    cantidad,
    incrementarCantidad,
    decrementarCantidad,
    agregarAlCarrito,
    total,
  } = useProductoControlador();

  return (
    <View style={ProductoEstilos.contenedor}>
      <Image
        source={{
          uri: producto.imagen,
        }}
        style={ProductoEstilos.imagen}
      />

      <View style={ProductoEstilos.infoContenedor}>
        <Text style={ProductoEstilos.nombre}>
          {producto.nombre} #{producto.id}
        </Text>
        <Text style={ProductoEstilos.descripcion}>{producto.descripcion}</Text>
        <Text style={ProductoEstilos.precio}>
          ${producto.precio.toFixed(2)}
        </Text>
      </View>

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
