import { useRouter } from "expo-router";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { PedidosEstilos } from "../estilos/PedidosEstilos";

const pedidosMock = [
  {
    id: "1",
    restaurante: "Burger King",
    fecha: "20 Ene, 14:30",
    estado: "Entregado",
    total: "$15.50",
    colorEstado: "#10b981",
  },
  {
    id: "2",
    restaurante: "Pizza Hut",
    fecha: "18 Ene, 20:00",
    estado: "Entregado",
    total: "$22.00",
    colorEstado: "#10b981",
  },
  {
    id: "3",
    restaurante: "McDonalds",
    fecha: "15 Ene, 13:00",
    estado: "Cancelado",
    total: "$10.00",
    colorEstado: "#ef4444",
  },
];

export default function PedidosVista() {
  const router = useRouter();

  return (
    <View style={PedidosEstilos.contenedor}>
      <View style={PedidosEstilos.encabezado}>
        <Text style={PedidosEstilos.titulo}>Mis Pedidos</Text>
      </View>

      <FlatList
        data={pedidosMock}
        keyExtractor={(item) => item.id}
        contentContainerStyle={PedidosEstilos.lista}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              PedidosEstilos.tarjeta,
              { borderLeftColor: item.colorEstado },
            ]}
            onPress={() => router.push(`/seguimiento/${item.id}`)}
          >
            <View style={PedidosEstilos.filaEncabezado}>
              <Text style={PedidosEstilos.nombreRestaurante}>
                {item.restaurante}
              </Text>
              <Text style={PedidosEstilos.fecha}>{item.fecha}</Text>
            </View>
            <Text style={[PedidosEstilos.estado, { color: item.colorEstado }]}>
              {item.estado}
            </Text>
            <Text style={PedidosEstilos.detalles}>Ver detalles</Text>
            <Text style={PedidosEstilos.total}>{item.total}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
