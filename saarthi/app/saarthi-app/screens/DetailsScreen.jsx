import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function DetailsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is the Details Screen</Text>

      {/* Back to Home */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.buttonText}>Go Back Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginBottom: 20 },
  button: {
    backgroundColor: "tomato",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontSize: 16 },
});
