import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useCarrito } from "../context/ContextoCarrito";
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
  const { cantidadItems, total } = useCarrito();

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView
        style={RestauranteEstilos.contenedor}
        stickyHeaderIndices={[2]}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header Image */}
        <View style={{ position: "relative" }}>
          <Image
            source={{ uri: restaurante.imagen }}
            style={RestauranteEstilos.imagenPortada}
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
          <View style={{ flexDirection: "row", gap: 15, marginTop: 10 }}>
            {/* Rating */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#fffbeb",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <MaterialCommunityIcons name="star" size={16} color="#f59e0b" />
              <Text
                style={{ fontWeight: "bold", marginLeft: 4, color: "#b45309" }}
              >
                {restaurante.calificacion}
              </Text>
            </View>

            {/* Time */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#f3f4f6",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <MaterialCommunityIcons
                name="clock-outline"
                size={16}
                color="#4b5563"
              />
              <Text
                style={{
                  fontWeight: "600",
                  marginLeft: 4,
                  color: "#4b5563",
                  fontSize: 12,
                }}
              >
                {restaurante.tiempo}
              </Text>
            </View>

            {/* Delivery */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#ecfdf5",
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}
            >
              <MaterialCommunityIcons name="bike" size={16} color="#059669" />
              <Text
                style={{
                  fontWeight: "600",
                  marginLeft: 4,
                  color: "#059669",
                  fontSize: 12,
                }}
              >
                ${restaurante.envio.toFixed(2)}
              </Text>
            </View>
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

      {/* Floating Cart Button */}
      {cantidadItems > 0 && (
        <View
          style={{
            position: "absolute",
            bottom: 30,
            left: 20,
            right: 20,
          }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#C21833",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 15,
              borderRadius: 12,
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 5,
              shadowOffset: { width: 0, height: 2 },
              elevation: 5,
            }}
            onPress={() => router.push("/carrito" as any)}
          >
            <View
              style={{
                backgroundColor: "rgba(0,0,0,0.2)",
                paddingHorizontal: 10,
                paddingVertical: 5,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: "white", fontWeight: "bold" }}>
                {cantidadItems}
              </Text>
            </View>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Ver Carrito
            </Text>
            <Text style={{ color: "white", fontWeight: "bold" }}>
              ${total.toFixed(2)}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
