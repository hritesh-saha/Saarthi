// File: app/home.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
// import Navbar from "../../components/Navbar";

export default function HomeScreen() {
  const handleSOS = () => {
    Alert.alert("🚨 SOS Activated!", "Help request has been sent.");
  };

  return (
    <View style={styles.container}>
      {/* <Navbar /> */}
      <View style={styles.content}>
        <Text style={styles.info}>Press the button in case of emergency</Text>
        <TouchableOpacity style={styles.sosButton} onPress={handleSOS}>
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  info: {
    fontSize: 16,
    marginBottom: 20,
  },
  sosButton: {
    backgroundColor: "red",
    paddingVertical: 30,
    paddingHorizontal: 60,
    borderRadius: 100,
    elevation: 5,
  },
  sosText: {
    color: "white",
    fontSize: 28,
    fontWeight: "bold",
  },
});
