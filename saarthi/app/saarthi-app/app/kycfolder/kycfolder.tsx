// KYCForm.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { router } from "expo-router";

export default function KYCForm() {
  const [form, setForm] = useState({
    fullName: "",
    passportNumber: "",
    nationality: "",
    contactNumber: "",
    address: "",
    latitude: "",
    longitude: "",
  });
  const [file, setFile] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    if (result.assets && result.assets.length > 0) {
      setFile(result.assets[0]);
    }
  };

  const handleSubmit = async () => {
    if (!form.fullName || !form.passportNumber || !file) {
      Alert.alert("Error", "Please fill all fields and upload document.");
      return;
    }

    try {
      setLoading(true);
      let formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      if (file) {
        // @ts-ignore
        formData.append("document", {
          uri: file.uri,
          name: file.name,
          type: "application/pdf",
        });
      }

      const res = await fetch("http://<YOUR_BACKEND_URL>/store-kyc", {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = await res.json();
      if (res.ok) {
        Alert.alert("✅ Success", "KYC stored successfully!", [
          {
            text: "OK",
            onPress: () => router.push("/home/home"),
          },
        ]);
      } else {
        Alert.alert("❌ Failed", data.message || "Something went wrong");
      }
    } catch (err: any) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>KYC Registration</Text>

        {["fullName", "passportNumber", "nationality", "contactNumber", "address"].map(
          (field) => (
            <View key={field} style={styles.inputGroup}>
              <Text style={styles.label}>
                {field.replace(/([A-Z])/g, " $1")}
              </Text>
              <TextInput
                style={styles.input}
                placeholder={`Enter ${field}`}
                value={form[field as keyof typeof form]}
                onChangeText={(val) => handleChange(field, val)}
              />
            </View>
          )
        )}

        <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
          <Text style={styles.uploadText}>
            {file ? `📄 ${file.name}` : "Upload Document (PDF)"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, loading && { backgroundColor: "#90CAF9" }]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.submitText}>
            {loading ? "Submitting..." : "Submit KYC"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAF3FA", // soft light blue
  },
  scroll: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1565C0", // strong blue
    marginBottom: 20,
    textAlign: "center",
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: "#2C3E50", // dark neutral
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#64B5F6", // medium blue border
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  uploadButton: {
    backgroundColor: "#1E88E5", // rich blue
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: "center",
  },
  uploadText: {
    color: "#fff",
    fontWeight: "600",
  },
  submitButton: {
    backgroundColor: "#1565C0", // deep blue
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  submitText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
});
