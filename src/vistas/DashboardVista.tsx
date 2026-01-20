import { FontAwesome5 } from "@expo/vector-icons";
import { Stack } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useDashboardControlador } from "../controladores/useDashboardControlador";
import { DashboardEstilos } from "../estilos/DashboardEstilos";

export default function DashboardVista() {
  const { estadisticas, acciones, actividades, saludo } =
    useDashboardControlador();

  return (
    <ScrollView style={DashboardEstilos.contenedor}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header Section */}
      <View style={DashboardEstilos.encabezado}>
        <View>
          <Text style={DashboardEstilos.saludo}>{saludo}</Text>
          <Text style={DashboardEstilos.subtitulo}>
            Bienvenido a tu Dashboard
          </Text>
        </View>
        <TouchableOpacity style={DashboardEstilos.botonNotificacion}>
          <FontAwesome5 name="bell" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Stats Cards */}
      <View style={DashboardEstilos.contenedorEstadisticas}>
        {estadisticas.map((stat) => (
          <View
            key={stat.id}
            style={[DashboardEstilos.tarjeta, { backgroundColor: stat.color }]}
          >
            <FontAwesome5 name={stat.icono} size={24} color="#fff" />
            <Text style={DashboardEstilos.valorTarjeta}>{stat.valor}</Text>
            <Text style={DashboardEstilos.etiquetaTarjeta}>{stat.titulo}</Text>
          </View>
        ))}
      </View>

      {/* Categories Grid */}
      <Text style={DashboardEstilos.tituloSeccion}>¿Qué se te antoja hoy?</Text>
      <View style={DashboardEstilos.cuadricula}>
        {[
          {
            id: "1",
            titulo: "Hamburguesas",
            icono: "hamburger",
            color: "#ffedd5",
            colorIcono: "#c2410c",
          },
          {
            id: "2",
            titulo: "Pizza",
            icono: "pizza-slice",
            color: "#fee2e2",
            colorIcono: "#b91c1c",
          },
          {
            id: "3",
            titulo: "Sushi",
            icono: "fish",
            color: "#dcfce7",
            colorIcono: "#15803d",
          },
          {
            id: "4",
            titulo: "Postres",
            icono: "ice-cream",
            color: "#f3e8ff",
            colorIcono: "#7e22ce",
          },
        ].map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={DashboardEstilos.elementoCuadricula}
          >
            <View
              style={[
                DashboardEstilos.contenedorIcono,
                { backgroundColor: cat.color },
              ]}
            >
              <FontAwesome5 name={cat.icono} size={24} color={cat.colorIcono} />
            </View>
            <Text style={DashboardEstilos.etiquetaCuadricula}>
              {cat.titulo}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recommended Restaurants - Replacing Actions */}
      <Text style={DashboardEstilos.tituloSeccion}>Restaurantes Favoritos</Text>
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        {[
          {
            id: "1",
            nombre: "Burger King",
            desc: "Hamburguesas • 30 min",
            color: "#fff0f0",
          },
          {
            id: "2",
            nombre: "Pizza Hut",
            desc: "Italiana • 45 min",
            color: "#fffbeb",
          },
        ].map((rest) => (
          <TouchableOpacity
            key={rest.id}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 15,
              backgroundColor: rest.color,
              marginBottom: 10,
              borderRadius: 12,
            }}
            onPress={() => router.push(`/restaurante/${rest.id}`)}
          >
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: "#eee",
                borderRadius: 25,
                marginRight: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome5 name="store" size={20} color="#666" />
            </View>
            <View>
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {rest.nombre}
              </Text>
              <Text style={{ color: "#666", fontSize: 14 }}>{rest.desc}</Text>
            </View>
            <FontAwesome5
              name="chevron-right"
              size={14}
              color="#ccc"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Recent Activity */}
      <Text style={DashboardEstilos.tituloSeccion}>Actividad Reciente</Text>
      <View style={DashboardEstilos.lista}>
        {actividades.map((act) => (
          <View key={act.id} style={DashboardEstilos.elementoLista}>
            <FontAwesome5 name={act.icono} size={16} color="#666" />
            <Text style={DashboardEstilos.textoLista}>{act.descripcion}</Text>
            <Text style={DashboardEstilos.tiempoLista}>{act.tiempo}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
