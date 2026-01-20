import { Stack, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { DetalleEstilos } from "../estilos/DetalleEstilos";

export default function DetalleVista() {
  const { id } = useLocalSearchParams();

  // En una app real, usarías este ID para buscar en tu API/Controlador
  // Por ahora simulamos datos
  const mockData = {
    title: `Recurso #${id}`,
    description:
      "Este es el detalle completo del recurso seleccionado. Aquí podrías mostrar lecciones, videos, o contenido extenso.",
    author: "Antigravity AI",
  };

  return (
    <View style={DetalleEstilos.contenedor}>
      <Stack.Screen
        options={{ title: "Detalle del Recurso", headerBackTitle: "Volver" }}
      />

      <View style={DetalleEstilos.encabezado}>
        <Text style={DetalleEstilos.titulo}>{mockData.title}</Text>
        <Text style={DetalleEstilos.subtitulo}>ID: {id}</Text>
      </View>

      <View style={DetalleEstilos.contenido}>
        <Text style={DetalleEstilos.texto}>{mockData.description}</Text>
        <Text style={DetalleEstilos.autor}>Autor: {mockData.author}</Text>
      </View>
    </View>
  );
}
