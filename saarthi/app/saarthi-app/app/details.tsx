// File: app/details.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router"; // Import from expo-router

export default function DetailsScreen() {
  const router = useRouter(); // Get router object

  return (
    <View style={styles.container}>
      <Text style={styles.title}>This is the Details Screen</Text>

      {/* Back to Home */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.back()} // Use router.back() to go to the previous screen
      >
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  // ... your existing styles
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginBottom: 20 },
  button: {
    backgroundColor: "tomato",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: { color: "white", fontSize: 16 },
});