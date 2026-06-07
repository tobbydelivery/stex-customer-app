import { LinearGradient } from "expo-linear-gradient";
import React, { useRef, useState } from "react";
import {
  Alert, Animated,
  Dimensions,
  ImageBackground, KeyboardAvoidingView,
  Platform, ScrollView, StatusBar, StyleSheet, Text,
  TextInput, TouchableOpacity, View
} from "react-native";
import API from "../services/api";

const { width } = Dimensions.get("window");
const HERO_IMAGE = "https://i.ibb.co/XkVB3qCd/B13-E95-AC-6-A36-48-B8-8-E92-E7881-B1-FB33-A.png";

const RegisterScreen = ({ navigation }) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [step, setStep] = useState(1);
  const [focused, setFocused] = useState({});
  const fadeAnim = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }).start();
  }, []);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) return Alert.alert("Missing Info", "Please fill in all required fields");
    if (form.password !== form.confirmPassword) return Alert.alert("Password Mismatch", "Passwords do not match");
    if (form.password.length < 6) return Alert.alert("Weak Password", "Password must be at least 6 characters");
    setLoading(true);
    try {
      await API.post("/auth/register", { name: form.name, email: form.email, phone: form.phone, password: form.password });
      Alert.alert("🎉 Account Created!", "Welcome to STeX Logistics! Please sign in.", [
        { text: "Sign In Now", onPress: () => navigation.replace("Login") }
      ]);
    } catch (err) {
      Alert.alert("Registration Failed", err.response?.data?.error || "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  };

  const getPasswordStrength = (pass) => {
    if (!pass) return { bars: 0, label: "", color: "#555" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (score <= 1) return { bars: 1, label: "Weak", color: "#e74c3c" };
    if (score <= 2) return { bars: 2, label: "Fair", color: "#f39c12" };
    if (score <= 3) return { bars: 3, label: "Good", color: "#3498db" };
    return { bars: 4, label: "Strong", color: "#27ae60" };
  };

  const strength = getPasswordStrength(form.password);
  const inputBorder = (key) => focused[key] ? "rgba(231,76,60,0.7)" : "rgba(255,255,255,0.1)";

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient colors={["rgba(5,8,16,0.93)", "rgba(13,17,23,0.9)", "rgba(17,24,39,0.95)"]} style={StyleSheet.absoluteFill} />
      </ImageBackground>
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

          {/* Logo */}
          <Animated.View style={[styles.logoSection, { opacity: fadeAnim }]}>
            <LinearGradient colors={["#27ae60", "#1e8449"]} style={styles.logoCircle}>
              <Text style={styles.logoEmoji}>🚚</Text>
            </LinearGradient>
            <Text style={styles.brandName}>STeX Logistics</Text>
            <Text style={styles.brandTag}>◈ CREATE YOUR ACCOUNT</Text>
          </Animated.View>

          {/* Step Indicators */}
          <View style={styles.stepsRow}>
            {[1, 2].map(s => (
              <View key={s} style={styles.stepItem}>
                <View style={[styles.stepCircle, { backgroundColor: step >= s ? "#27ae60" : "rgba(255,255,255,0.1)", borderColor: step >= s ? "#27ae60" : "rgba(255,255,255,0.15)" }]}>
                  <Text style={styles.stepNum}>{step > s ? "✓" : s}</Text>
                </View>
                <Text style={[styles.stepLabel, { color: step >= s ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)" }]}>
                  {s === 1 ? "Personal Info" : "Security"}
                </Text>
                {s < 2 && <View style={[styles.stepConnector, { backgroundColor: step > s ? "#27ae60" : "rgba(255,255,255,0.1)" }]} />}
              </View>
            ))}
          </View>

          {/* Card */}
          <Animated.View style={[styles.card, { opacity: fadeAnim }]}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />

            {step === 1 && (
              <>
                <Text style={styles.cardTitle}>Personal Information</Text>
                <Text style={styles.cardSubtitle}>Tell us about yourself</Text>

                {/* Full Name */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>FULL NAME</Text>
                  <View style={[styles.inputContainer, { borderColor: inputBorder("name") }]}>
                    <Text style={styles.inputIcon}>👤</Text>
                    <TextInput style={styles.input} value={form.name}
                      onChangeText={v => setForm({ ...form, name: v })}
                      onFocus={() => setFocused({ ...focused, name: true })}
                      onBlur={() => setFocused({ ...focused, name: false })}
                      placeholder="First and last name" placeholderTextColor="rgba(255,255,255,0.2)"
                      autoCapitalize="words" autoComplete="name" />
                  </View>
                  <Text style={styles.inputHint}>Enter your full name as on your ID</Text>
                </View>

                {/* Email */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>EMAIL ADDRESS</Text>
                  <View style={[styles.inputContainer, { borderColor: inputBorder("email") }]}>
                    <Text style={styles.inputIcon}>📧</Text>
                    <TextInput style={styles.input} value={form.email}
                      onChangeText={v => setForm({ ...form, email: v })}
                      onFocus={() => setFocused({ ...focused, email: true })}
                      onBlur={() => setFocused({ ...focused, email: false })}
                      placeholder="yourname@gmail.com" placeholderTextColor="rgba(255,255,255,0.2)"
                      keyboardType="email-address" autoCapitalize="none" autoComplete="email" />
                    {form.email.length > 0 && (
                      <Text style={{ fontSize: 14 }}>{/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) ? "✅" : "❌"}</Text>
                    )}
                  </View>
                  <Text style={styles.inputHint}>e.g. yourname@gmail.com</Text>
                </View>

                {/* Phone */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>PHONE NUMBER</Text>
                  <View style={[styles.inputContainer, { borderColor: inputBorder("phone") }]}>
                    <Text style={styles.inputIcon}>📞</Text>
                    <TextInput style={styles.input} value={form.phone}
                      onChangeText={v => setForm({ ...form, phone: formatPhone(v) })}
                      onFocus={() => setFocused({ ...focused, phone: true })}
                      onBlur={() => setFocused({ ...focused, phone: false })}
                      placeholder="0801 234 5678" placeholderTextColor="rgba(255,255,255,0.2)"
                      keyboardType="phone-pad" maxLength={13} />
                  </View>
                  <Text style={styles.inputHint}>Format: 0801 234 5678</Text>
                </View>

                <TouchableOpacity onPress={() => {
                  if (!form.name || !form.email) return Alert.alert("Required", "Please fill in name and email");
                  setStep(2);
                }} style={styles.primaryButton}>
                  <LinearGradient colors={["#27ae60", "#1e8449"]} style={styles.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.primaryText}>Continue to Security →</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {step === 2 && (
              <>
                <Text style={styles.cardTitle}>Account Security</Text>
                <Text style={styles.cardSubtitle}>Set up your password</Text>

                {/* Password */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>CREATE PASSWORD</Text>
                  <View style={[styles.inputContainer, { borderColor: inputBorder("password") }]}>
                    <Text style={styles.inputIcon}>🔒</Text>
                    <TextInput style={[styles.input, { flex: 1 }]} value={form.password}
                      onChangeText={v => setForm({ ...form, password: v })}
                      onFocus={() => setFocused({ ...focused, password: true })}
                      onBlur={() => setFocused({ ...focused, password: false })}
                      secureTextEntry={!showPassword} autoComplete="new-password"
                      placeholder="Min. 6 characters" placeholderTextColor="rgba(255,255,255,0.2)" />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={{ padding: 8 }}>
                      <Text>{showPassword ? "🙈" : "👁️"}</Text>
                    </TouchableOpacity>
                  </View>
                  {form.password.length > 0 && (
                    <View style={styles.strengthRow}>
                      {[1, 2, 3, 4].map(i => (
                        <View key={i} style={[styles.strengthBar, { backgroundColor: strength.bars >= i ? strength.color : "rgba(255,255,255,0.1)" }]} />
                      ))}
                      <Text style={[styles.strengthText, { color: strength.color }]}>{strength.label}</Text>
                    </View>
                  )}
                  <Text style={styles.inputHint}>Use uppercase, numbers and symbols for stronger password</Text>
                </View>

                {/* Confirm Password */}
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>CONFIRM PASSWORD</Text>
                  <View style={[styles.inputContainer, { borderColor: inputBorder("confirmPassword") }]}>
                    <Text style={styles.inputIcon}>🔐</Text>
                    <TextInput style={[styles.input, { flex: 1 }]} value={form.confirmPassword}
                      onChangeText={v => setForm({ ...form, confirmPassword: v })}
                      onFocus={() => setFocused({ ...focused, confirmPassword: true })}
                      onBlur={() => setFocused({ ...focused, confirmPassword: false })}
                      secureTextEntry={!showConfirm} autoComplete="new-password"
                      placeholder="Repeat your password" placeholderTextColor="rgba(255,255,255,0.2)" />
                    <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={{ padding: 8 }}>
                      <Text>{showConfirm ? "🙈" : "👁️"}</Text>
                    </TouchableOpacity>
                  </View>
                  {form.confirmPassword.length > 0 && (
                    <Text style={[styles.inputHint, { color: form.password === form.confirmPassword ? "#27ae60" : "#e74c3c", fontWeight: "700" }]}>
                      {form.password === form.confirmPassword ? "✅ Passwords match" : "❌ Passwords do not match"}
                    </Text>
                  )}
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity onPress={() => setStep(1)} style={styles.backButton}>
                    <Text style={styles.backButtonText}>← Back</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={handleRegister} disabled={loading} style={[styles.primaryButton, { flex: 2 }]}>
                    <LinearGradient colors={loading ? ["#333", "#222"] : ["#27ae60", "#1e8449"]} style={styles.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                      <Text style={styles.primaryText}>{loading ? "Creating..." : "Create Account →"}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </>
            )}

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.secondaryButton}>
              <Text style={styles.secondaryText}>Already have an account? <Text style={{ color: "#27ae60", fontWeight: "700" }}>Sign In</Text></Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050810" },
  scrollContent: { flexGrow: 1, padding: 24, paddingTop: 70 },
  orb1: { position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(39,174,96,0.06)", borderWidth: 1, borderColor: "rgba(39,174,96,0.1)" },
  orb2: { position: "absolute", bottom: 100, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(52,152,219,0.05)" },
  logoSection: { alignItems: "center", marginBottom: 24 },
  logoCircle: { width: 72, height: 72, borderRadius: 20, alignItems: "center", justifyContent: "center", marginBottom: 14, shadowColor: "#27ae60", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 12 },
  logoEmoji: { fontSize: 32 },
  brandName: { fontSize: 26, fontWeight: "900", color: "white", letterSpacing: 1 },
  brandTag: { fontSize: 10, color: "#27ae60", letterSpacing: 3, marginTop: 6, fontWeight: "700" },
  stepsRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginBottom: 20, gap: 8 },
  stepItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  stepCircle: { width: 28, height: 28, borderRadius: 14, alignItems: "center", justifyContent: "center", borderWidth: 1.5 },
  stepNum: { color: "white", fontSize: 12, fontWeight: "700" },
  stepLabel: { fontSize: 12, fontWeight: "600" },
  stepConnector: { width: 30, height: 1.5, borderRadius: 1 },
  card: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 24, padding: 24, borderWidth: 1, borderColor: "rgba(39,174,96,0.15)", marginBottom: 20, position: "relative" },
  cornerTL: { position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "#27ae60" },
  cornerTR: { position: "absolute", top: 0, right: 0, width: 16, height: 16, borderTopWidth: 2, borderRightWidth: 2, borderColor: "#27ae60" },
  cornerBL: { position: "absolute", bottom: 0, left: 0, width: 16, height: 16, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: "#27ae60" },
  cornerBR: { position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "#27ae60" },
  cardTitle: { fontSize: 20, fontWeight: "900", color: "white", marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 20 },
  inputWrapper: { marginBottom: 14 },
  inputLabel: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginBottom: 8, fontWeight: "700", letterSpacing: 0.8 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14 },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, color: "white", fontSize: 14, paddingVertical: 13 },
  inputHint: { fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 5, marginLeft: 2 },
  strengthRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 8 },
  strengthBar: { flex: 1, height: 3, borderRadius: 2 },
  strengthText: { fontSize: 11, fontWeight: "700", width: 50 },
  primaryButton: { borderRadius: 14, overflow: "hidden", marginTop: 4 },
  primaryGradient: { padding: 16, alignItems: "center" },
  primaryText: { color: "white", fontSize: 15, fontWeight: "800" },
  buttonRow: { flexDirection: "row", gap: 10, marginTop: 4 },
  backButton: { flex: 1, padding: 15, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.06)", alignItems: "center", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  backButtonText: { color: "rgba(255,255,255,0.6)", fontWeight: "700" },
  divider: { flexDirection: "row", alignItems: "center", marginVertical: 16 },
  dividerLine: { flex: 1, height: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  dividerText: { color: "rgba(255,255,255,0.2)", paddingHorizontal: 12, fontSize: 11, fontWeight: "700" },
  secondaryButton: { alignItems: "center", padding: 14 },
  secondaryText: { color: "rgba(255,255,255,0.45)", fontSize: 13 }
});

export default RegisterScreen;