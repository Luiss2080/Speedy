import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { RestauranteEstilos } from "../estilos/RestauranteEstilos";

const productosMock = [
  {
    id: "1",
    nombre: "Hamburguesa Doble",
    descripcion: "Doble carne, queso cheddar, bacon.",
    precio: "$8.50",
  },
  {
    id: "2",
    nombre: "Papas Fritas",
    descripcion: "Porción grande con salsa especial.",
    precio: "$3.50",
  },
  {
    id: "3",
    nombre: "Refresco",
    descripcion: "Coca-Cola 500ml.",
    precio: "$1.50",
  },
];

export default function RestauranteVista() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <ScrollView style={RestauranteEstilos.contenedor}>
      <Image
        source={{
          uri: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
        }}
        style={RestauranteEstilos.imagenPortada}
      />

      <View style={RestauranteEstilos.infoContenedor}>
        <Text style={RestauranteEstilos.nombre}>Restaurante #{id}</Text>
        <View style={RestauranteEstilos.metaInfo}>
          <Text style={RestauranteEstilos.calificacion}>⭐ 4.5</Text>
          <Text style={RestauranteEstilos.tiempo}>
            • 30-45 min • Envío $2.00
          </Text>
        </View>
      </View>

      <Text style={RestauranteEstilos.tituloSeccion}>Menú Popular</Text>

      <View style={RestauranteEstilos.listaProductos}>
        {productosMock.map((prod) => (
          <TouchableOpacity
            key={prod.id}
            style={RestauranteEstilos.productoTarjeta}
            onPress={() => router.push(`/producto/${prod.id}`)}
          >
            <View style={RestauranteEstilos.productoInfo}>
              <Text style={RestauranteEstilos.productoNombre}>
                {prod.nombre}
              </Text>
              <Text style={RestauranteEstilos.productoDesc}>
                {prod.descripcion}
              </Text>
              <Text style={RestauranteEstilos.productoPrecio}>
                {prod.precio}
              </Text>
            </View>
            <View style={RestauranteEstilos.productoImagen} />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
