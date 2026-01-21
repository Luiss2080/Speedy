import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useRouter } from "expo-router";
import React from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useCarrito } from "../context/ContextoCarrito";
import { useDashboardControlador } from "../controladores/useDashboardControlador";
import { DashboardEstilos } from "../estilos/DashboardEstilos";

import React from "react";
import { SafeAreaView, StatusBar } from "react-native";

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
                <FontAwesome5 name="shopping-cart" size={20} color="#C21833" />
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
                <FontAwesome5 name="bell" size={20} color="#C21833" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View style={DashboardEstilos.contenedorBusqueda}>
            <FontAwesome5 name="search" size={16} color="#9ca3af" />
            <TextInput
              placeholder="Buscar comida, restaurantes..."
              style={DashboardEstilos.inputBusqueda}
              placeholderTextColor="#9ca3af"
            />
          </View>

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
                  titulo: "Burgers",
                  icono: "hamburger",
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
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
