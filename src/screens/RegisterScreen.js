import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../services/api";

const { width } = Dimensions.get("window");

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({
    name: "", email: "", phone: "", password: "", confirmPassword: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) return Alert.alert("Error", "Please fill in all required fields");
    if (form.password !== form.confirmPassword) return Alert.alert("Error", "Passwords do not match");
    if (form.password.length < 6) return Alert.alert("Error", "Password must be at least 6 characters");

    setLoading(true);
    try {
      await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password
      });
      Alert.alert("🎉 Welcome to STeX!", "Account created! Check your email for a welcome message.", [
        { text: "Login Now", onPress: () => navigation.replace("Login") }
      ]);
    } catch (err) {
      Alert.alert("Registration Failed", err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: "👤 Full Name", key: "name", placeholder: "John Doe", keyboard: "default", secure: false },
    { label: "📧 Email Address", key: "email", placeholder: "your@email.com", keyboard: "email-address", secure: false },
    { label: "📞 Phone Number", key: "phone", placeholder: "08012345678", keyboard: "phone-pad", secure: false },
    { label: "🔒 Password", key: "password", placeholder: "Min. 6 characters", keyboard: "default", secure: true, toggle: true, show: showPassword, setShow: setShowPassword },
    { label: "🔒 Confirm Password", key: "confirmPassword", placeholder: "Repeat password", keyboard: "default", secure: true, toggle: true, show: showConfirm, setShow: setShowConfirm }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={["#050810", "#0d1117", "#111827"]} style={StyleSheet.absoluteFill} />

      {/* Decorative elements */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />
      <View style={styles.gridLine1} />
      <View style={styles.gridLine2} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <Animated.View style={[styles.logoSection, { opacity: fadeAnim }]}>
            <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🚚</Text>
            </LinearGradient>
            <Text style={styles.brandName}>STeX Logistics</Text>
            <Text style={styles.brandTag}>◈ CREATE YOUR ACCOUNT</Text>
          </Animated.View>

          {/* Card */}
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            {/* Corner accents */}
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />

            <Text style={styles.cardTitle}>Get Started</Text>
            <Text style={styles.cardSubtitle}>Join thousands of satisfied customers</Text>

            {fields.map(field => (
              <View key={field.key} style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, field.toggle && { flex: 1 }]}
                    value={form[field.key]}
                    onChangeText={(text) => setForm({ ...form, [field.key]: text })}
                    placeholder={field.placeholder}
                    placeholderTextColor="rgba(255,255,255,0.2)"
                    keyboardType={field.keyboard}
                    secureTextEntry={field.secure && !field.show}
                    autoCapitalize={field.key === "email" ? "none" : field.key === "name" ? "words" : "none"}
                  />
                  {field.toggle && (
                    <TouchableOpacity onPress={() => field.setShow(!field.show)} style={styles.eyeButton}>
                      <Text>{field.show ? "🙈" : "👁️"}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            ))}

            {/* Password strength indicator */}
            {form.password.length > 0 && (
              <View style={styles.strengthRow}>
                {[1, 2, 3, 4].map(i => (
                  <View key={i} style={[styles.strengthBar, {
                    backgroundColor: form.password.length >= i * 2
                      ? i <= 1 ? "#e74c3c" : i <= 2 ? "#f39c12" : i <= 3 ? "#3498db" : "#27ae60"
                      : "rgba(255,255,255,0.1)"
                  }]} />
                ))}
                <Text style={styles.strengthText}>
                  {form.password.length < 4 ? "Weak" : form.password.length < 6 ? "Fair" : form.password.length < 8 ? "Good" : "Strong"}
                </Text>
              </View>
            )}

            <TouchableOpacity onPress={handleRegister} disabled={loading} style={styles.registerButton}>
              <LinearGradient
                colors={loading ? ["#333", "#222"] : ["#e74c3c", "#c0392b"]}
                style={styles.registerGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.registerText}>
                  {loading ? "Creating Account..." : "Create Account →"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginButton}>
              <Text style={styles.loginText}>Already have an account? <Text style={styles.loginBold}>Sign In</Text></Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Features */}
          <Animated.View style={[styles.featuresRow, { opacity: fadeAnim }]}>
            {["📦 Book Delivery", "📍 Live Tracking", "🔔 Notifications"].map((f, i) => (
              <View key={i} style={styles.featureItem}>
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050810" },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 60 },
  orb1: { position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(231,76,60,0.06)", borderWidth: 1, borderColor: "rgba(231,76,60,0.1)" },
  orb2: { position: "absolute", bottom: 100, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(52,152,219,0.04)" },
  gridLine1: { position: "absolute", top: 0, bottom: 0, left: width * 0.33, width: 1, backgroundColor: "rgba(255,255,255,0.02)" },
  gridLine2: { position: "absolute", top: 0, bottom: 0, left: width * 0.66, width: 1, backgroundColor: "rgba(255,255,255,0.02)" },
  logoSection: { alignItems: "center", marginBottom: 30 },
  logoCircle: { width: 70, height: 70, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 14, shadowColor: "#e74c3c", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  logoEmoji: { fontSize: 32 },
  brandName: { fontSize: 26, fontWeight: "900", color: "white", letterSpacing: 1 },
  brandTag: { fontSize: 10, color: "#e74c3c", letterSpacing: 3, marginTop: 6, fontWeight: "700" },
  card: { backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 24, padding: 24, borderWidth: 1, borderColor: "rgba(231,76,60,0.15)", marginBottom: 20, position: "relative" },
  cornerTL: { position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "#e74c3c" },
  cornerTR: { position: "absolute", top: 0, right: 0, width: 16, height: 16, borderTopWidth: 2, borderRightWidth: 2, borderColor: "#e74c3c" },
  cornerBL: { position: "absolute", bottom: 0, left: 0, width: 16, height: 16, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: "#e74c3c" },
  cornerBR: { position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "#e74c3c" },
  cardTitle: { fontSize: 22, fontWeight: "800", color: "white", marginBottom: 6 },
  cardSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 22 },
  inputWrapper: { marginBottom: 14 },
  inputLabel: { fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8, fontWeight: "600", letterSpacing: 0.5 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", paddingHorizontal: 14 },
  input: { color: "white", fontSize: 14, paddingVertical: 13 },
  eyeButton: { padding: 8 },
  strengthRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 16, marginTop: -8 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthText: { fontSize: 11, color: "rgba(255,255,255,0.4)", width: 45 },
  registerButton: { borderRadius: 14, overflow: "hidden", marginTop: 4 },
  registerGradient: { padding: 16, alignItems: "center" },
  registerText: { color: "white", fontSize: 16, fontWeight: "800", letterSpacing: 0.5 },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 18 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  dividerText: { color: "rgba(255,255,255,0.25)", paddingHorizontal: 12, fontSize: 12 },
  loginButton: { alignItems: "center" },
  loginText: { color: "rgba(255,255,255,0.5)", fontSize: 14 },
  loginBold: { color: "#e74c3c", fontWeight: "700" },
  featuresRow: { flexDirection: "row", justifyContent: "space-around" },
  featureItem: { alignItems: "center" },
  featureText: { color: "rgba(255,255,255,0.3)", fontSize: 11 }
});

export default RegisterScreen;