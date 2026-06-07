import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert, Dimensions, ImageBackground, KeyboardAvoidingView,
  Platform, ScrollView, StatusBar, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from "react-native";
import API from "../services/api";

const { width } = Dimensions.get("window");
const HERO_IMAGE = "https://i.ibb.co/XkVB3qCd/B13-E95-AC-6-A36-48-B8-8-E92-E7881-B1-FB33-A.png";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState({});

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Missing Info", "Please fill in all fields");
    setLoading(true);
    try {
      const res = await API.post("/auth/login", { email, password });
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
      navigation.replace("Main");
    } catch (err) {
      Alert.alert("Login Failed", err.response?.data?.error || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  const inputBorder = (key) => focused[key] ? "rgba(231,76,60,0.7)" : "rgba(255,255,255,0.1)";
  const inputShadow = (key) => focused[key] ? { shadowColor: "#e74c3c", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 } : {};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient colors={["rgba(5,8,16,0.93)", "rgba(13,17,23,0.9)", "rgba(17,24,39,0.95)"]} style={StyleSheet.absoluteFill} />
      </ImageBackground>

      <View style={styles.orb1} />
      <View style={styles.orb2} />
      <View style={styles.orb3} />

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
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />

            <Text style={styles.cardTitle}>Welcome Back</Text>
            <Text style={styles.cardSubtitle}>Sign in to manage your deliveries</Text>

            {/* Email */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
              <View style={[styles.inputContainer, { borderColor: inputBorder("email") }, inputShadow("email")]}>
                <Text style={styles.inputIcon}>📧</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocused({ ...focused, email: true })}
                  onBlur={() => setFocused({ ...focused, email: false })}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  placeholder="yourname@gmail.com"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                />
                {email.length > 0 && (
                  <Text style={styles.validIcon}>
                    {/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "✅" : "❌"}
                  </Text>
                )}
              </View>
              <Text style={styles.inputHint}>Enter the email linked to your account</Text>
            </View>

            {/* Password */}
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>PASSWORD</Text>
              <View style={[styles.inputContainer, { borderColor: inputBorder("password") }, inputShadow("password")]}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocused({ ...focused, password: true })}
                  onBlur={() => setFocused({ ...focused, password: false })}
                  secureTextEntry={!showPassword}
                  autoComplete="password"
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(255,255,255,0.2)"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                  <Text>{showPassword ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.inputHint}>Minimum 6 characters</Text>
            </View>

            {/* Sign In Button */}
            <TouchableOpacity onPress={handleLogin} disabled={loading} style={styles.primaryButton}>
              <LinearGradient
                colors={loading ? ["rgba(149,165,166,0.3)", "rgba(149,165,166,0.2)"] : ["#e74c3c", "#c0392b"]}
                style={styles.primaryGradient}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryText}>
                  {loading ? "Signing In..." : "Sign In to Account →"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Register Button */}
            <TouchableOpacity onPress={() => navigation.navigate("Register")} style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Create New Account</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[
              { value: "10K+", label: "Deliveries" },
              { value: "99%", label: "Success Rate" },
              { value: "24/7", label: "Support" }
            ].map((stat, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050810" },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 70 },
  orb1: { position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(231,76,60,0.07)", borderWidth: 1, borderColor: "rgba(231,76,60,0.12)" },
  orb2: { position: "absolute", bottom: 150, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(52,152,219,0.05)" },
  orb3: { position: "absolute", top: 300, right: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(39,174,96,0.04)" },
  logoSection: { alignItems: "center", marginBottom: 32 },
  logoCircle: { width: 80, height: 80, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 16, shadowColor: "#e74c3c", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 12 },
  logoEmoji: { fontSize: 36 },
  brandName: { fontSize: 30, fontWeight: "900", color: "white", letterSpacing: 1 },
  brandTag: { fontSize: 10, color: "#e74c3c", letterSpacing: 3, marginTop: 6, fontWeight: "700" },
  brandTagline: { fontSize: 12, color: "rgba(255,255,255,0.35)", marginTop: 8 },
  card: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 24, padding: 24, borderWidth: 1, borderColor: "rgba(231,76,60,0.15)", marginBottom: 24, position: "relative" },
  cornerTL: { position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "#e74c3c" },
  cornerTR: { position: "absolute", top: 0, right: 0, width: 16, height: 16, borderTopWidth: 2, borderRightWidth: 2, borderColor: "#e74c3c" },
  cornerBL: { position: "absolute", bottom: 0, left: 0, width: 16, height: 16, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: "#e74c3c" },
  cornerBR: { position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "#e74c3c" },
  cardTitle: { fontSize: 22, fontWeight: "900", color: "white", marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 24 },
  inputWrapper: { marginBottom: 16 },
  inputLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 8, fontWeight: "700", letterSpacing: 0.8 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14 },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, color: "white", fontSize: 14, paddingVertical: 14 },
  validIcon: { fontSize: 14 },
  eyeButton: { padding: 8 },
  inputHint: { fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 5, marginLeft: 2 },
  primaryButton: { borderRadius: 14, overflow: "hidden", marginTop: 8 },
  primaryGradient: { padding: 16, alignItems: "center" },
  primaryText: { color: "white", fontSize: 15, fontWeight: "800" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  dividerText: { color: "rgba(255,255,255,0.2)", paddingHorizontal: 12, fontSize: 11, fontWeight: "700" },
  secondaryButton: { backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 15, alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  secondaryText: { color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: "700" },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "900", color: "#e74c3c" },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 4 }
});

export default LoginScreen;