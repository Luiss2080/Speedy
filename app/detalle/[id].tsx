import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';

export default function DetalleScreen() {
  const { id } = useLocalSearchParams();

  // En una app real, usarías este ID para buscar en tu API/Controlador
  // Por ahora simulamos datos
  const mockData = {
    title: `Recurso #${id}`,
    description: 'Este es el detalle completo del recurso seleccionado. Aquí podrías mostrar lecciones, videos, o contenido extenso.',
    author: 'Antigravity AI'
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Detalle del Recurso', headerBackTitle: 'Volver' }} />
      
      <View style={styles.header}>
        <Text style={styles.title}>{mockData.title}</Text>
        <Text style={styles.subtitle}>ID: {id}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.text}>{mockData.description}</Text>
        <Text style={styles.author}>Autor: {mockData.author}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { marginBottom: 30, borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#111', marginBottom: 5 },
  subtitle: { fontSize: 14, color: '#666', fontFamily: 'monospace' },
  content: { backgroundColor: '#f9fafb', padding: 20, borderRadius: 12 },
  text: { fontSize: 16, lineHeight: 24, color: '#374151', marginBottom: 20 },
  author: { fontSize: 14, fontStyle: 'italic', color: '#4b5563' },
});
