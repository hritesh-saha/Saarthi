// File: app/home.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  const handleSOS = () => {
    Alert.alert("🚨 SOS Activated!", "Help request has been sent.");
  };

  const goToProfile = () => {
    router.push("/profile/profile"); // Adjust path if profile file is elsewhere
  };

  return (
    <View style={styles.container}>
      {/* Navbar */}
      <View style={styles.navbar}>
        <Text style={styles.navTitle}>Home</Text>
        <TouchableOpacity style={styles.profileButton} onPress={goToProfile}>
          <Text style={styles.profileText}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content */}
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
  navbar: {
    height: 60,
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 5,
  },
  navTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  profileButton: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  profileText: {
    color: "#3b82f6",
    fontWeight: "bold",
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
