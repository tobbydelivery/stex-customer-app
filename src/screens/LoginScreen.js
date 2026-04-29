import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import API from "../services/api";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Please fill in all fields");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
      navigation.replace("Main");
    } catch (err) {
      Alert.alert("Login Failed", err.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0d1117", "#1a252f", "#2c3e50"]} style={StyleSheet.absoluteFill} />

      {/* Decorative circles */}
      <View style={styles.decorCircle1} />
      <View style={styles.decorCircle2} />
      <View style={styles.decorCircle3} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <View style={styles.logoSection}>
            <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🚚</Text>
            </LinearGradient>
            <Text style={styles.brandName}>STeX Logistics</Text>
            <Text style={styles.brandTag}>SWIFT • TRUSTED • EXPRESS</Text>
            <Text style={styles.brandTagline}>Nigeria's Premier Delivery Service</Text>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSubtitle}>Sign in to continue</Text>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>📧 Email Address</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="your@email.com"
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>🔒 Password</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor="rgba(255,255,255,0.25)"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Text style={styles.eyeText}>{showPassword ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.loginButton}>
              <LinearGradient colors={loading ? ["#555", "#444"] : ["#e74c3c", "#c0392b"]} style={styles.loginGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                <Text style={styles.loginText}>{loading ? "Signing in..." : "Sign In →"}</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register */}
            <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.registerButton}>
              <Text style={styles.registerText}>Create New Account</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { value: "10K+", label: "Deliveries" },
              { value: "99%", label: "Success" },
              { value: "24/7", label: "Support" }
            ].map((stat, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117" },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 60 },
  decorCircle1: { position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(231,76,60,0.08)" },
  decorCircle2: { position: "absolute", top: 200, left: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(52,152,219,0.06)" },
  decorCircle3: { position: "absolute", bottom: 100, right: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(39,174,96,0.06)" },
  logoSection: { alignItems: "center", marginBottom: 36 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center", marginBottom: 16, shadowColor: "#e74c3c", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  logoEmoji: { fontSize: 36 },
  brandName: { fontSize: 30, fontWeight: "900", color: "white", letterSpacing: 1 },
  brandTag: { fontSize: 11, color: "#e74c3c", letterSpacing: 3, marginTop: 6, fontWeight: "700" },
  brandTagline: { fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8 },
  card: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 24, padding: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", marginBottom: 24 },
  cardTitle: { fontSize: 24, fontWeight: "800", color: "white", marginBottom: 6 },
  cardSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 24 },
  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 13, color: "rgba(255,255,255,0.6)", marginBottom: 8, fontWeight: "600" },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.12)", paddingHorizontal: 16 },
  input: { flex: 1, color: "white", fontSize: 15, paddingVertical: 14 },
  eyeButton: { padding: 8 },
  eyeText: { fontSize: 18 },
  loginButton: { marginTop: 8, borderRadius: 14, overflow: "hidden" },
  loginGradient: { padding: 16, alignItems: "center" },
  loginText: { color: "white", fontSize: 16, fontWeight: "800", letterSpacing: 0.5 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 20 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.1)" },
  dividerText: { color: "rgba(255,255,255,0.3)", paddingHorizontal: 12, fontSize: 13 },
  registerButton: { backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 14, padding: 16, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.12)" },
  registerText: { color: "white", fontSize: 15, fontWeight: "700" },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "900", color: "#e74c3c" },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 4 }
});

export default LoginScreen;