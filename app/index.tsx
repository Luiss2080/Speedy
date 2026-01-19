import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hola Mundo</Text>
      <Text style={styles.subtext}>desde React Native & Android Studio</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
  },
  subtext: {
    fontSize: 16,
    color: "#666",
    marginTop: 10,
  },
});
