// File: app/home.tsx
import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function HomeScreen() {
  const router = useRouter();
  const [sosActive, setSosActive] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load user data from AsyncStorage
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("userInfo");
        if (userData) setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    };
    fetchUser();
  }, []);

  const triggerSOS = async () => {
    if (!user) {
      Alert.alert("⚠️ Error", "No user info found. Please login again.");
      return;
    }

    try {
      const payload = {
        userId: user._id, // assuming your userInfo contains _id
        username: user.username,
        location: "Unknown Location", // later replace with GPS if needed
        city: "Kolkata",
      };

      const response = await axios.post("http://localhost:5000/api/alert/sos", payload);

      if (response.status === 201) {
        Alert.alert("🚨 SOS Sent!", "Help request has been sent successfully.");
      } else {
        Alert.alert("❌ Failed", "Could not send SOS.");
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("⚠️ Error", error.response?.data?.error || "Network error occurred.");
    }
  };

  const handleSOS = () => {
    if (!sosActive) {
      // Start 5 sec timer
      setSosActive(true);
      Alert.alert("⏳ SOS will be sent in 5 seconds. Tap again to cancel.");

      timerRef.current = setTimeout(() => {
        triggerSOS();
        setSosActive(false);
      }, 5000);
    } else {
      // Cancel SOS
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      setSosActive(false);
      Alert.alert("❌ SOS Cancelled");
    }
  };

  const goToProfile = () => {
    router.push("/profile/profile");
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
        <Text style={styles.info}>
          Press the button in case of emergency
        </Text>
        <TouchableOpacity
          style={[styles.sosButton, sosActive && styles.cancelButton]}
          onPress={handleSOS}
        >
          <Text style={styles.sosText}>
            {sosActive ? "Cancel SOS" : "SOS"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  navbar: {
    height: 60,
    backgroundColor: "#3b82f6",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    elevation: 5,
  },
  navTitle: { color: "white", fontSize: 20, fontWeight: "bold" },
  profileButton: {
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  profileText: { color: "#3b82f6", fontWeight: "bold" },
  content: { flex: 1, justifyContent: "center", alignItems: "center" },
  info: { fontSize: 16, marginBottom: 20 },
  sosButton: {
    backgroundColor: "red",
    paddingVertical: 30,
    paddingHorizontal: 60,
    borderRadius: 100,
    elevation: 5,
  },
  cancelButton: { backgroundColor: "gray" },
  sosText: { color: "white", fontSize: 28, fontWeight: "bold" },
});
