import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCarrito } from "../context/ContextoCarrito";
import { useDashboardControlador } from "../controladores/useDashboardControlador";
import { DashboardEstilos } from "../estilos/DashboardEstilos";

export default function DashboardVista() {
  const router = useRouter();
  const { estadisticas, actividades, saludo } = useDashboardControlador();
  const { cantidadItems } = useCarrito();

  return (
    <LinearGradient
      colors={["#9f1239", "#C21833", "#e11d48"]}
      style={{ flex: 1 }}
    >
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          style={DashboardEstilos.contenedor}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Header Section */}
          <View style={DashboardEstilos.encabezado}>
            <View>
              <Text style={DashboardEstilos.saludo}>{saludo}</Text>
              <Text style={DashboardEstilos.subtitulo}>
                ¿Qué vas a pedir hoy?
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                style={DashboardEstilos.botonIcono}
                onPress={() => router.push("/carrito" as any)}
              >
                <FontAwesome5 name="shopping-cart" size={18} color="#C21833" />
                {cantidadItems > 0 && (
                  <View style={DashboardEstilos.badge}>
                    <Text style={DashboardEstilos.badgeTexto}>
                      {cantidadItems}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={DashboardEstilos.botonIcono}
                onPress={() => router.push("/notificaciones" as any)}
              >
                <FontAwesome5 name="bell" size={18} color="#C21833" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  DashboardEstilos.botonIcono,
                  { backgroundColor: "rgba(255,255,255,0.3)" },
                ]} // Slightly different style for exit
                onPress={() => {
                  // Quick Alert for confirmation would be better but for now direct for simplicity or import Alert
                  const { Alert } = require("react-native");
                  Alert.alert(
                    "Cerrar Sesión",
                    "¿Estás seguro que deseas salir?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Salir",
                        style: "destructive",
                        onPress: () => router.replace("/"),
                      },
                    ],
                  );
                }}
              >
                <FontAwesome5 name="sign-out-alt" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar - Navigate to Explore */}
          <TouchableOpacity
            style={DashboardEstilos.contenedorBusqueda}
            onPress={() => router.push("/explorar" as any)}
            activeOpacity={0.9}
          >
            <FontAwesome5 name="search" size={16} color="#9ca3af" />
            <Text style={{ color: "#9ca3af", marginLeft: 10 }}>
              Buscar comida, restaurantes...
            </Text>
          </TouchableOpacity>

          {/* Stats Cards Row */}
          <View style={DashboardEstilos.contenedorEstadisticas}>
            {estadisticas.map((stat) => (
              <View
                key={stat.id}
                style={[
                  DashboardEstilos.tarjetaEstadistica,
                  { backgroundColor: "rgba(255,255,255,0.15)" },
                ]}
              >
                <View
                  style={[
                    DashboardEstilos.iconoEstadistica,
                    { backgroundColor: "rgba(255,255,255,0.2)" },
                  ]}
                >
                  <FontAwesome5
                    name={stat.icono as any}
                    size={20}
                    color="#fff"
                  />
                </View>
                <View>
                  <Text style={DashboardEstilos.valorTarjeta}>
                    {stat.valor}
                  </Text>
                  <Text style={DashboardEstilos.etiquetaTarjeta}>
                    {stat.titulo}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Main Content Panel (White Bottom Sheet look) */}
          <View style={DashboardEstilos.panelContenido}>
            {/* Categories */}
            <Text style={DashboardEstilos.tituloSeccion}>Categorías</Text>
            <View style={DashboardEstilos.cuadricula}>
              {[
                {
                  id: "1",
                  titulo: "Pedidos",
                  icono: "clipboard-list",
                  color: "#ffedd5",
                  colorIcono: "#c2410c",
                },
                {
                  id: "2",
                  titulo: "Italiana",
                  icono: "pizza",
                  color: "#fee2e2",
                  colorIcono: "#b91c1c",
                },
                {
                  id: "3",
                  titulo: "Asiática",
                  icono: "noodles",
                  color: "#dcfce7",
                  colorIcono: "#15803d",
                },
                {
                  id: "4",
                  titulo: "Postres",
                  icono: "cupcake",
                  color: "#f3e8ff",
                  colorIcono: "#7e22ce",
                },
                {
                  id: "5",
                  titulo: "Bebidas",
                  icono: "glass-cocktail",
                  color: "#e0f2fe",
                  colorIcono: "#0369a1",
                },
                {
                  id: "6",
                  titulo: "Tacos",
                  icono: "taco",
                  color: "#fef9c3",
                  colorIcono: "#a16207",
                },
                {
                  id: "7",
                  titulo: "Sandwich",
                  icono: "bread-slice",
                  color: "#fae8ff",
                  colorIcono: "#a21caf",
                },
                {
                  id: "8",
                  titulo: "Más",
                  icono: "dots-horizontal",
                  color: "#f3f4f6",
                  colorIcono: "#4b5563",
                },
              ].map((cat) => (
                <TouchableOpacity
                  key={cat.id}
                  style={DashboardEstilos.elementoCuadricula}
                  onPress={() => router.push("/explorar" as any)}
                >
                  <View
                    style={[
                      DashboardEstilos.contenedorIcono,
                      { backgroundColor: cat.color },
                    ]}
                  >
                    <MaterialCommunityIcons
                      name={cat.icono as any}
                      size={28}
                      color={cat.colorIcono}
                    />
                  </View>
                  <Text style={DashboardEstilos.etiquetaCuadricula}>
                    {cat.titulo}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Featured Restaurants */}
            <Text style={DashboardEstilos.tituloSeccion}>
              Restaurantes Favoritos
            </Text>
            <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
              {[
                {
                  id: "1",
                  nombre: "Burger King",
                  desc: "Hamburguesas • 30 min",
                  color: "#fff",
                },
                {
                  id: "2",
                  nombre: "Pizza Hut",
                  desc: "Italiana • 45 min",
                  color: "#fff",
                },
              ].map((rest) => (
                <TouchableOpacity
                  key={rest.id}
                  style={DashboardEstilos.tarjetaRestaurante}
                  onPress={() =>
                    router.push(("/restaurante/" + rest.id) as any)
                  }
                >
                  <View style={DashboardEstilos.avatarRestaurante}>
                    <FontAwesome5 name="store" size={20} color="#C21833" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={DashboardEstilos.nombreRestaurante}>
                      {rest.nombre}
                    </Text>
                    <Text style={DashboardEstilos.descRestaurante}>
                      {rest.desc}
                    </Text>
                  </View>
                  <FontAwesome5 name="chevron-right" size={14} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>

            {/* Recent Activity */}
            <Text style={DashboardEstilos.tituloSeccion}>
              Actividad Reciente
            </Text>
            <View style={DashboardEstilos.lista}>
              {actividades.map((act) => (
                <View key={act.id} style={DashboardEstilos.elementoLista}>
                  <View
                    style={{ marginRight: 15, width: 30, alignItems: "center" }}
                  >
                    <FontAwesome5
                      name={act.icono as any}
                      size={16}
                      color="#9ca3af"
                    />
                  </View>
                  <Text style={DashboardEstilos.textoLista}>
                    {act.descripcion}
                  </Text>
                  <Text style={DashboardEstilos.tiempoLista}>{act.tiempo}</Text>
                </View>
              ))}
            </View>

            {/* Footer Section */}
            <View
              style={{
                marginTop: 30,
                marginHorizontal: 20,
                padding: 20,
                backgroundColor: "#f8fafc",
                borderRadius: 15,
                alignItems: "center",
              }}
            >
              <FontAwesome5
                name="gift"
                size={24}
                color="#C21833"
                style={{ marginBottom: 10 }}
              />
              <Text
                style={{ fontWeight: "bold", fontSize: 16, color: "#334155" }}
              >
                ¡Ofertas Especiales!
              </Text>
              <Text
                style={{ textAlign: "center", color: "#64748b", marginTop: 5 }}
              >
                Revisa las promociones de hoy y ahorra en tu pedido.
              </Text>
              <TouchableOpacity
                style={{
                  marginTop: 15,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  backgroundColor: "#C21833",
                  borderRadius: 20,
                }}
                onPress={() => router.push("/explorar" as any)}
              >
                <Text style={{ color: "white", fontWeight: "bold" }}>
                  Ver Ofertas
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
