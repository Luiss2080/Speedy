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

export default function DashboardVista() {
  const router = useRouter();
  const { estadisticas, actividades, saludo } = useDashboardControlador();
  const { cantidadItems } = useCarrito();

  return (
    <ScrollView style={DashboardEstilos.contenedor}>
      <Stack.Screen options={{ headerShown: false }} />

      {/* Header with Gradient */}
      <LinearGradient
        colors={["#C21833", "#9f1239"]}
        style={DashboardEstilos.encabezado}
      >
        <View style={{ marginBottom: 15 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 20,
            }}
          >
            <View>
              <Text style={DashboardEstilos.saludo}>{saludo}</Text>
              <Text style={DashboardEstilos.subtitulo}>
                ¿Qué vas a pedir hoy?
              </Text>
            </View>

            <View style={{ flexDirection: "row", gap: 10 }}>
              <TouchableOpacity
                style={DashboardEstilos.botonNotificacion}
                onPress={() => router.push("/carrito" as any)}
              >
                <FontAwesome5 name="shopping-cart" size={20} color="#C21833" />
                {cantidadItems > 0 && (
                  <View
                    style={{
                      position: "absolute",
                      top: -5,
                      right: -5,
                      backgroundColor: "#ef4444",
                      width: 18,
                      height: 18,
                      borderRadius: 9,
                      justifyContent: "center",
                      alignItems: "center",
                      borderWidth: 2,
                      borderColor: "#fff",
                    }}
                  >
                    <Text
                      style={{
                        color: "#fff",
                        fontSize: 10,
                        fontWeight: "bold",
                      }}
                    >
                      {cantidadItems}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={DashboardEstilos.botonNotificacion}
                onPress={() => router.push("/notificaciones" as any)}
              >
                <FontAwesome5 name="bell" size={20} color="#C21833" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search Bar */}
          <View
            style={{
              flexDirection: "row",
              backgroundColor: "#fff",
              borderRadius: 15,
              paddingHorizontal: 15,
              paddingVertical: 10,
              alignItems: "center",
            }}
          >
            <FontAwesome5 name="search" size={16} color="#9ca3af" />
            <TextInput
              placeholder="Buscar comida, restaurantes..."
              style={{ flex: 1, marginLeft: 10, color: "#1f2937" }}
              placeholderTextColor="#9ca3af"
            />
          </View>
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={DashboardEstilos.contenedorEstadisticas}>
        {estadisticas.map((stat) => (
          <View
            key={stat.id}
            style={[DashboardEstilos.tarjeta, { backgroundColor: stat.color }]}
          >
            <FontAwesome5 name={stat.icono as any} size={24} color="#fff" />
            <Text style={DashboardEstilos.valorTarjeta}>{stat.valor}</Text>
            <Text style={DashboardEstilos.etiquetaTarjeta}>{stat.titulo}</Text>
          </View>
        ))}
      </View>

      {/* Categories Grid - MaterialCommunityIcons */}
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
            onPress={() => router.push(("/restaurante/" + rest.id) as any)}
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
            <FontAwesome5 name={act.icono as any} size={16} color="#666" />
            <Text style={DashboardEstilos.textoLista}>{act.descripcion}</Text>
            <Text style={DashboardEstilos.tiempoLista}>{act.tiempo}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
