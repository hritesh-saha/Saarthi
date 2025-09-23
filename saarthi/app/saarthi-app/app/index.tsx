// File: app/index.tsx
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = "http://localhost:5000"; // Replace with your backend
const LOGIN_ENDPOINT = `${API_BASE_URL}/auth/users/login`;
const SIGNUP_ENDPOINT = `${API_BASE_URL}/auth/users/register`;

export default function Page() {
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // const handleLogin = async () => {
  //   if (!email || !password) {
  //     setAlertMessage("Please enter both email and password.");
  //     return;
  //   }
  //   setIsLoading(true);
  //   try {
  //     await new Promise((res) => setTimeout(res, 1000)); // Mock delay
  //     const token = "mock-jwt-token";

  //     if (token) {
  //       setAlertMessage("Logged in successfully!");
  //       router.push("/home/home"); // Navigate to KYC Form
  //     }
  //   } catch (err) {
  //     setAlertMessage("Login failed. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleLogin = async () => {
    if (!email || !password) {
      setAlertMessage("Please enter both email and password.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(LOGIN_ENDPOINT, { email, password });

      // Backend returns { message, token }
      const { message, token, user } = response.data;

      setAlertMessage(message);

      if (token && user) {
      // Store user and token in AsyncStorage
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userInfo", JSON.stringify(user));

      // Navigate to home
      router.push("/home/home");
    }
    } catch (err: any) {
      // Axios error
      if (err.response) {
        // Server responded with a status outside 2xx
        setAlertMessage(err.response.data.message || "Login failed");
      } else {
        setAlertMessage("Login failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSignUp = async () => {
  //   if (!email || !password || !username) {
  //     setAlertMessage("Please fill all fields.");
  //     return;
  //   }
  //   setIsLoading(true);
  //   try {
  //     const role = "tourist"; // Always send "tourist"

  //     // Replace with real API call
  //     // await axios.post(SIGNUP_ENDPOINT, { username, email, password, role });
  //     await new Promise((res) => setTimeout(res, 1000)); // Mock delay

  //     setAlertMessage("Account created! Redirecting to login...");
  //     router.push("/kycfolder/kycfolder");
  //     setIsLogin(true);
  //   } catch (err) {
  //     setAlertMessage("Sign up failed. Please try again.");
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const handleSignUp = async () => {
    if (!email || !password || !username) {
      setAlertMessage("Please fill all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const role = "tourist"; // Default role

      const response = await axios.post(SIGNUP_ENDPOINT, {
        username,
        email,
        password,
        role,
      });

      const { message, token, user } = response.data;

      setAlertMessage(message + " Redirecting to kyc registration...");
      if (token && user) {
      // Store user and token in AsyncStorage
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userInfo", JSON.stringify(user));

      // Navigate to home
      router.push("/kycfolder/kycfolder");
    }
      // setIsLogin(true);
    } catch (err: any) {
      if (err.response) {
        setAlertMessage(err.response.data.message || "Sign up failed");
      } else {
        setAlertMessage("Sign up failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const AlertModal = ({
    message,
    onClose,
  }: {
    message: string;
    onClose: () => void;
  }) => (
    <Modal visible={!!message} transparent animationType="fade">
      <View style={styles.alertOverlay}>
        <View style={styles.alertBox}>
          <Text style={styles.alertMessage}>{message}</Text>
          <TouchableOpacity style={styles.alertButton} onPress={onClose}>
            <Text style={{ color: "white", fontWeight: "bold" }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <AlertModal message={alertMessage} onClose={() => setAlertMessage("")} />
      <View style={styles.main}>
        <Text style={styles.title}>
          {isLogin ? "Welcome Back!" : "Create Account"}
        </Text>
        <Text style={styles.subtitle}>
          {isLogin ? "Log in to continue" : "Join us today"}
        </Text>

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, isLoading && { backgroundColor: "#94b3fd" }]}
          onPress={isLogin ? handleLogin : handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>
              {isLogin ? "Login" : "Sign Up"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsLogin(!isLogin)}
        >
          <Text style={styles.toggleText}>
            {isLogin
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f1f5f9",
  },
  main: { width: "100%", maxWidth: 400 },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#1e293b",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
  },
  button: {
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  toggleButton: { marginTop: 24, alignItems: "center" },
  toggleText: { color: "#3b82f6", fontSize: 14, fontWeight: "500" },
  alertOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  alertBox: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
    color: "#333",
    textAlign: "center",
  },
  alertButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});
