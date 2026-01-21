import { FontAwesome5 } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useRestauranteControlador } from "../controladores/useRestauranteControlador";
import { RestauranteEstilos } from "../estilos/RestauranteEstilos";

export default function RestauranteVista() {
  const {
    restaurante,
    categorias,
    categoriaSeleccionada,
    setCategoriaSeleccionada,
    productos,
    router,
  } = useRestauranteControlador();

  return (
    <ScrollView style={RestauranteEstilos.contenedor} stickyHeaderIndices={[2]}>
      {/* Header Image */}
      <View style={{ position: "relative" }}>
        <Image
          source={{ uri: restaurante.imagen }}
          style={RestauranteEstilos.imagenPortada}
        />
        <TouchableOpacity
          style={{
            position: "absolute",
            top: 50,
            left: 20,
            backgroundColor: "white",
            padding: 8,
            borderRadius: 20,
          }}
          onPress={() => router.back()}
        >
          <FontAwesome5 name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <View style={RestauranteEstilos.infoContenedor}>
        <Text style={RestauranteEstilos.nombre}>{restaurante.nombre}</Text>
        <View style={RestauranteEstilos.metaInfo}>
          <Text style={RestauranteEstilos.calificacion}>
            ⭐ {restaurante.calificacion}
          </Text>
          <Text style={RestauranteEstilos.tiempo}>
            • {restaurante.tiempo} • Envío ${restaurante.envio.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Categories - Sticky */}
      <View style={{ backgroundColor: "#fff", paddingVertical: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={RestauranteEstilos.contenedorCategorias}
        >
          {categorias.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[
                RestauranteEstilos.categoriaItem,
                categoriaSeleccionada === cat &&
                  RestauranteEstilos.categoriaItemActivo,
              ]}
              onPress={() => setCategoriaSeleccionada(cat)}
            >
              <Text
                style={[
                  RestauranteEstilos.textoCategoria,
                  categoriaSeleccionada === cat &&
                    RestauranteEstilos.textoCategoriaActivo,
                ]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <Text style={RestauranteEstilos.tituloSeccion}>Menú</Text>

      <View style={RestauranteEstilos.listaProductos}>
        {productos.map((prod) => (
          <TouchableOpacity
            key={prod.id}
            style={RestauranteEstilos.productoTarjeta}
            onPress={() => router.push(("/producto/" + prod.id) as any)}
          >
            <View style={RestauranteEstilos.productoInfo}>
              <Text style={RestauranteEstilos.productoNombre}>
                {prod.nombre}
              </Text>
              <Text style={RestauranteEstilos.productoDesc} numberOfLines={2}>
                {prod.descripcion}
              </Text>
              <Text style={RestauranteEstilos.productoPrecio}>
                ${prod.precio.toFixed(2)}
              </Text>
            </View>
            <Image
              source={{ uri: prod.imagen }}
              style={RestauranteEstilos.productoImagen}
            />
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
