import { FontAwesome5 } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { useCarrito } from "../context/ContextoCarrito";
import { ProductoEstilos } from "../estilos/ProductoEstilos";

export default function ProductoVista() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [cantidad, setCantidad] = useState(1);
  const { agregarItem } = useCarrito();

  return (
    <View style={ProductoEstilos.contenedor}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        }}
        style={ProductoEstilos.imagen}
      />

      <View style={ProductoEstilos.infoContenedor}>
        <Text style={ProductoEstilos.nombre}>Hamburguesa Doble #{id}</Text>
        <Text style={ProductoEstilos.descripcion}>
          Deliciosa hamburguesa con doble carne 100% vacuna, queso cheddar
          fundido, tocino crujiente, cebolla caramelizada y nuestra salsa
          especial de la casa.
        </Text>
        <Text style={ProductoEstilos.precio}>$8.50</Text>
      </View>

      <View style={ProductoEstilos.footer}>
        <View style={ProductoEstilos.controlCantidad}>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setCantidad(Math.max(1, cantidad - 1));
            }}
            style={ProductoEstilos.botonCantidad}
          >
            <FontAwesome5 name="minus" size={16} color="#333" />
          </TouchableOpacity>
          <Text style={ProductoEstilos.textoCantidad}>{cantidad}</Text>
          <TouchableOpacity
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setCantidad(cantidad + 1);
            }}
            style={ProductoEstilos.botonCantidad}
          >
            <FontAwesome5 name="plus" size={16} color="#333" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={ProductoEstilos.botonAgregar}
          activeOpacity={0.8}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            agregarItem({
              id: id as string,
              nombre: "Hamburguesa Doble",
              precio: 8.5,
              cantidad: cantidad,
              restaurante: "Burger King",
            });
            router.push("/carrito");
          }}
        >
          <Text style={ProductoEstilos.textoBoton}>
            Agregar ${(cantidad * 8.5).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
