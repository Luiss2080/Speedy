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

      {/* Actions Grid */}
      <Text style={DashboardEstilos.tituloSeccion}>Acciones Rápidas</Text>
      <View style={DashboardEstilos.cuadricula}>
        {acciones.map((accion) => (
          <TouchableOpacity
            key={accion.id}
            style={DashboardEstilos.elementoCuadricula}
          >
            <View
              style={[
                DashboardEstilos.contenedorIcono,
                { backgroundColor: accion.colorFondo },
              ]}
            >
              <FontAwesome5
                name={accion.icono}
                size={24}
                color={accion.colorIcono}
              />
            </View>
            <Text style={DashboardEstilos.etiquetaCuadricula}>
              {accion.titulo}
            </Text>
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
