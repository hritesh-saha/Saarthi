// File: app/profile/Profile.tsx
import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

type UserType = {
  username: string;
  email: string;
  role: string;
  kycId?: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await localStorage.getItem("userInfo");
        const Id = JSON.parse(userId || "null");

        if (!userId) throw new Error("User ID not found in storage");

      // Fetch user from backend
      const response = await fetch(`http://localhost:5000/auth/users/${Id}`);
      const data = await response.json();
      console.log(data);
      setUser(data);
    } catch (error: any) {
        console.error("Failed to load user:", error);
        Alert.alert("Error", error.message || "Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>No user data found. Please login.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{user.username}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{user.role}</Text>
      </View>
      {user.kycId && (
        <View style={styles.card}>
          <Text style={styles.label}>KYC ID:</Text>
          <Text style={styles.value}>{user.kycId}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f1f5f9",
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1e293b",
    textAlign: "center",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  label: {
    fontSize: 14,
    color: "#64748b",
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1e293b",
  },
  message: {
    fontSize: 16,
    color: "#64748b",
  },
});
