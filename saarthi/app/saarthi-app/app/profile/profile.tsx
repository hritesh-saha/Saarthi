// // File: app/profile/Profile.tsx
// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Alert } from "react-native";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";

// type UserType = {
//   username: string;
//   email: string;
//   role: string;
//   kycId?: string;
// };

// export default function Profile() {
//   const [user, setUser] = useState<UserType | null>(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchUser = async () => {
//       try {
//         const userId = await localStorage.getItem("userInfo");
//         const Id = JSON.parse(userId || "null");

//         if (!userId) throw new Error("User ID not found in storage");

//       // Fetch user from backend
//       const response = await fetch(`http://localhost:5000/auth/users/${Id}`);
//       const data = await response.json();
//       console.log(data);
//       setUser(data);
//     } catch (error: any) {
//         console.error("Failed to load user:", error);
//         Alert.alert("Error", error.message || "Failed to fetch user data");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUser();
//   }, []);

//   if (loading) {
//     return (
//       <View style={styles.center}>
//         <ActivityIndicator size="large" color="#3b82f6" />
//       </View>
//     );
//   }

//   if (!user) {
//     return (
//       <View style={styles.center}>
//         <Text style={styles.message}>No user data found. Please login.</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView contentContainerStyle={styles.container}>
//       <Text style={styles.title}>Profile</Text>
//       <View style={styles.card}>
//         <Text style={styles.label}>Username:</Text>
//         <Text style={styles.value}>{user.username}</Text>
//       </View>
//       <View style={styles.card}>
//         <Text style={styles.label}>Email:</Text>
//         <Text style={styles.value}>{user.email}</Text>
//       </View>
//       <View style={styles.card}>
//         <Text style={styles.label}>Role:</Text>
//         <Text style={styles.value}>{user.role}</Text>
//       </View>
//       {user.kycId && (
//         <View style={styles.card}>
//           <Text style={styles.label}>KYC ID:</Text>
//           <Text style={styles.value}>{user.kycId}</Text>
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 20,
//     backgroundColor: "#f1f5f9",
//     flexGrow: 1,
//   },
//   center: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f1f5f9",
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: "700",
//     marginBottom: 20,
//     color: "#1e293b",
//     textAlign: "center",
//   },
//   card: {
//     backgroundColor: "#ffffff",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   label: {
//     fontSize: 14,
//     color: "#64748b",
//     marginBottom: 4,
//   },
//   value: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#1e293b",
//   },
//   message: {
//     fontSize: 16,
//     color: "#64748b",
//   },
// });
// File: app/profile/Profile.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QRCode from "react-native-qrcode-svg";
import { useRouter } from "expo-router"; // 👈 import router
import { Ionicons } from "@expo/vector-icons"; // 👈 icons

type UserType = {
  _id?: string;
  username: string;
  email: string;
  role: string;
  kycId?: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // 👈 initialize router

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = await AsyncStorage.getItem("userInfo");
        const Id = JSON.parse(userId || "null");

        if (!userId) throw new Error("User ID not found in storage");

        const response = await fetch(`http://localhost:5000/auth/users/${Id}`);
        const data = await response.json();
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
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading profile...</Text>
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
      {/* Back Arrow */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push("/home/home")}
      >
        <Ionicons name="arrow-back" size={24} color="#2563eb" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>My Profile</Text>

      <View style={styles.profileCard}>
        <Text style={styles.greeting}>Welcome back,</Text>
        <Text style={styles.username}>{user.username}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>

        <View style={styles.card}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>

        {user.kycId && (
          <View style={styles.card}>
            <Text style={styles.label}>KYC ID</Text>
            <Text style={styles.value}>{user.kycId}</Text>
          </View>
        )}
      </View>

      {/* QR Code Section */}
      {user._id && (
        <View style={styles.qrSection}>
          <Text style={styles.sectionTitle}>Your QR Code</Text>
          <View style={styles.qrCard}>
            <QRCode value={user._id} size={140} color="#2563eb" />
            <Text style={styles.qrLabel}>Scan to share User ID</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f9fafb",
    flexGrow: 1,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  backText: {
    marginLeft: 6,
    fontSize: 16,
    fontWeight: "500",
    color: "#2563eb",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9fafb",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#64748b",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 20,
    color: "#111827",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#2563eb",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    alignItems: "center",
    shadowColor: "#2563eb",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 5,
  },
  greeting: {
    fontSize: 16,
    color: "#dbeafe",
    marginBottom: 4,
  },
  username: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  section: {
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },
  message: {
    fontSize: 16,
    color: "#6b7280",
  },
  qrSection: {
    marginTop: 30,
    alignItems: "center",
  },
  qrCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrLabel: {
    marginTop: 10,
    fontSize: 14,
    color: "#64748b",
  },
});
