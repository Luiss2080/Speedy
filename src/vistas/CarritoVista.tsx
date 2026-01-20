import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { CarritoEstilos } from "../estilos/CarritoEstilos";

export default function CarritoVista() {
  const router = useRouter();

  return (
    <View style={CarritoEstilos.contenedor}>
      <View style={CarritoEstilos.encabezado}>
        <Text style={CarritoEstilos.titulo}>Tu Canasta</Text>
      </View>

      <ScrollView contentContainerStyle={CarritoEstilos.lista}>
        <View style={CarritoEstilos.item}>
          <View style={CarritoEstilos.itemInfo}>
            <Text style={CarritoEstilos.cantidadBadge}>1x</Text>
            <Text style={CarritoEstilos.itemNombre}>Hamburguesa Doble</Text>
          </View>
          <Text style={CarritoEstilos.itemPrecio}>$8.50</Text>
        </View>

        <View style={CarritoEstilos.item}>
          <View style={CarritoEstilos.itemInfo}>
            <Text style={CarritoEstilos.cantidadBadge}>1x</Text>
            <Text style={CarritoEstilos.itemNombre}>Refresco</Text>
          </View>
          <Text style={CarritoEstilos.itemPrecio}>$1.50</Text>
        </View>

        <View style={CarritoEstilos.resumen}>
          <View style={CarritoEstilos.filaResumen}>
            <Text style={CarritoEstilos.textoResumen}>Subtotal</Text>
            <Text style={CarritoEstilos.textoResumen}>$10.00</Text>
          </View>
          <View style={CarritoEstilos.filaResumen}>
            <Text style={CarritoEstilos.textoResumen}>Envío</Text>
            <Text style={CarritoEstilos.textoResumen}>$2.00</Text>
          </View>
          <View style={CarritoEstilos.filaResumen}>
            <Text style={CarritoEstilos.textoTotal}>Total</Text>
            <Text style={CarritoEstilos.textoTotal}>$12.00</Text>
          </View>

          <TouchableOpacity
            style={CarritoEstilos.botonPagar}
            onPress={() => router.push("/seguimiento/nuevo")}
          >
            <Text style={CarritoEstilos.textoBoton}>Confirmar Pedido</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
