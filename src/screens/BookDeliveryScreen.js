import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground, KeyboardAvoidingView, Platform,
  ScrollView, StatusBar, StyleSheet, Text, TextInput,
  TouchableOpacity, View
} from "react-native";
import API from "../services/api";

const { width } = Dimensions.get("window");
const HERO_IMAGE = "https://i.ibb.co/XkVB3qCd/B13-E95-AC-6-A36-48-B8-8-E92-E7881-B1-FB33-A.png";

const BookDeliveryScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    senderName: "", senderPhone: "", senderAddress: "",
    recipientName: "", recipientPhone: "", recipientAddress: "",
    description: "", weight: "1", fragile: false
  });
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountResult, setDiscountResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);
  const [focused, setFocused] = useState({});

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, "");
    if (digits.length <= 4) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 4)} ${digits.slice(4)}`;
    return `${digits.slice(0, 4)} ${digits.slice(4, 7)} ${digits.slice(7, 11)}`;
  };

  const getEstimate = async () => {
    if (!form.senderAddress || !form.recipientAddress) return Alert.alert("Missing Info", "Please enter both pickup and delivery addresses first");
    setEstimating(true);
    try {
      const res = await API.post("/pricing/estimate", {
        pickupAddress: form.senderAddress, deliveryAddress: form.recipientAddress,
        weight: parseFloat(form.weight) || 1, fragile: form.fragile
      });
      setPriceEstimate(res.data);
      setStep(3);
    } catch (err) { Alert.alert("Error", "Could not get price estimate. Please try again."); }
    finally { setEstimating(false); }
  };

  const applyDiscount = async () => {
    if (!discountCode) return;
    try {
      const res = await API.post("/discounts/validate", { code: discountCode, orderAmount: priceEstimate?.pricing?.standard?.price || 2500 });
      setDiscountResult(res.data);
      Alert.alert("✅ Code Applied!", `You save ₦${res.data.discountAmount}!`);
    } catch (err) { Alert.alert("Invalid Code", err.response?.data?.error || "Invalid discount code"); }
  };

  const bookDelivery = async () => {
    setLoading(true);
    try {
      const res = await API.post("/orders", {
        sender: { name: form.senderName, phone: form.senderPhone, address: form.senderAddress },
        recipient: { name: form.recipientName, phone: form.recipientPhone, address: form.recipientAddress },
        package: { description: form.description, weight: parseFloat(form.weight) || 1, fragile: form.fragile }
      });
      const order = res.data.order;
      Alert.alert("🎉 Order Placed!", `Tracking: ${order.trackingNumber}\n\nProceed to payment?`, [
        { text: "Pay Now", onPress: () => navigation.navigate("Payment", { orderId: order._id, amount: order.price || 2500, trackingNumber: order.trackingNumber }) },
        { text: "Pay Later", onPress: () => navigation.navigate("Home") }
      ]);
    } catch (err) { Alert.alert("Error", err.response?.data?.error || "Could not place order. Try again."); }
    finally { setLoading(false); }
  };

  const inputBorder = (key) => focused[key] ? "rgba(231,76,60,0.7)" : "rgba(255,255,255,0.1)";

  const InputField = ({ label, value, onChange, hint, keyboard, isPhone }) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputContainer, { borderColor: inputBorder(label) }]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={v => onChange(isPhone ? formatPhone(v) : v)}
          onFocus={() => setFocused({ ...focused, [label]: true })}
          onBlur={() => setFocused({ ...focused, [label]: false })}
          keyboardType={keyboard || "default"}
          maxLength={isPhone ? 13 : undefined}
          placeholder={hint}
          placeholderTextColor="rgba(255,255,255,0.2)"
        />
      </View>
      <Text style={styles.inputHint}>{hint}</Text>
    </View>
  );

  const steps = ["📤 Sender", "📥 Recipient", "📦 Package", "💰 Confirm"];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient colors={["rgba(5,8,16,0.95)", "rgba(13,17,23,0.92)", "rgba(17,24,39,0.95)"]} style={StyleSheet.absoluteFill} />
      </ImageBackground>
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Delivery</Text>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{step}/3</Text>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressBar}>
          <LinearGradient colors={["#e74c3c", "#c0392b"]} style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        </View>

        {/* Step Labels */}
        <View style={styles.stepsRow}>
          {steps.slice(0, 3).map((s, i) => (
            <View key={i} style={styles.stepItem}>
              <View style={[styles.stepCircle, { backgroundColor: step > i + 1 ? "#27ae60" : step === i + 1 ? "#e74c3c" : "rgba(255,255,255,0.1)" }]}>
                <Text style={styles.stepNum}>{step > i + 1 ? "✓" : i + 1}</Text>
              </View>
              <Text style={[styles.stepLabel, { color: step >= i + 1 ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.25)" }]} numberOfLines={1}>{s}</Text>
            </View>
          ))}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
          <View style={styles.stepContent}>

            {/* Step 1 - Sender */}
            {step === 1 && (
              <>
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <LinearGradient colors={["#3498db30", "#3498db10"]} style={styles.cardHeaderIcon}>
                      <Text>📤</Text>
                    </LinearGradient>
                    <View>
                      <Text style={styles.cardTitle}>Sender Details</Text>
                      <Text style={styles.cardSubtitle}>Who is sending the package?</Text>
                    </View>
                  </View>
                  <InputField label="Sender's Full Name" value={form.senderName} onChange={v => setForm({ ...form, senderName: v })} hint="First and last name" />
                  <InputField label="Sender's Phone Number" value={form.senderPhone} onChange={v => setForm({ ...form, senderPhone: v })} hint="Format: 0801 234 5678" keyboard="phone-pad" isPhone />
                  <InputField label="Pickup Address" value={form.senderAddress} onChange={v => setForm({ ...form, senderAddress: v })} hint="Full street address for pickup" />
                </View>

                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <LinearGradient colors={["#27ae6030", "#27ae6010"]} style={styles.cardHeaderIcon}>
                      <Text>📥</Text>
                    </LinearGradient>
                    <View>
                      <Text style={styles.cardTitle}>Recipient Details</Text>
                      <Text style={styles.cardSubtitle}>Who is receiving the package?</Text>
                    </View>
                  </View>
                  <InputField label="Recipient's Full Name" value={form.recipientName} onChange={v => setForm({ ...form, recipientName: v })} hint="First and last name" />
                  <InputField label="Recipient's Phone Number" value={form.recipientPhone} onChange={v => setForm({ ...form, recipientPhone: v })} hint="Format: 0801 234 5678" keyboard="phone-pad" isPhone />
                  <InputField label="Delivery Address" value={form.recipientAddress} onChange={v => setForm({ ...form, recipientAddress: v })} hint="Full street address for delivery" />
                </View>

                <TouchableOpacity onPress={() => setStep(2)} style={styles.primaryButton}>
                  <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.primaryText}>Continue to Package Details →</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {/* Step 2 - Package */}
            {step === 2 && (
              <>
                <View style={styles.card}>
                  <View style={styles.cardHeader}>
                    <LinearGradient colors={["#9b59b630", "#9b59b610"]} style={styles.cardHeaderIcon}>
                      <Text>📋</Text>
                    </LinearGradient>
                    <View>
                      <Text style={styles.cardTitle}>Package Details</Text>
                      <Text style={styles.cardSubtitle}>What are you sending?</Text>
                    </View>
                  </View>
                  <InputField label="Package Description" value={form.description} onChange={v => setForm({ ...form, description: v })} hint="e.g. Electronics, Clothing, Documents" />

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>PACKAGE WEIGHT</Text>
                    <Text style={styles.inputHint}>Current: {form.weight || 1} kg — Drag slider or type</Text>
                    <View style={[styles.inputContainer, { borderColor: inputBorder("weight"), marginTop: 8 }]}>
                      <Text style={styles.inputIcon}>⚖️</Text>
                      <TextInput style={styles.input} value={form.weight}
                        onChangeText={v => setForm({ ...form, weight: v })}
                        keyboardType="decimal-pad" placeholder="e.g. 2.5"
                        placeholderTextColor="rgba(255,255,255,0.2)" />
                      <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginRight: 4 }}>kg</Text>
                    </View>
                  </View>

                  <View style={styles.inputWrapper}>
                    <Text style={styles.inputLabel}>IS THIS ITEM FRAGILE?</Text>
                    <Text style={styles.inputHint}>Select one option below</Text>
                    <View style={styles.toggleRow}>
                      {[
                        { value: false, label: "✓ Not Fragile", sub: "Standard handling", color: "#27ae60" },
                        { value: true, label: "⚠️ Fragile", sub: "Extra careful handling", color: "#e74c3c" }
                      ].map((opt) => (
                        <TouchableOpacity key={String(opt.value)} onPress={() => setForm({ ...form, fragile: opt.value })}
                          style={[styles.toggleBtn, { borderColor: form.fragile === opt.value ? opt.color : "rgba(255,255,255,0.1)", backgroundColor: form.fragile === opt.value ? opt.color + "20" : "rgba(255,255,255,0.04)" }]}>
                          <Text style={[styles.toggleBtnText, { color: form.fragile === opt.value ? opt.color : "rgba(255,255,255,0.5)" }]}>{opt.label}</Text>
                          <Text style={styles.toggleBtnSub}>{opt.sub}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <TouchableOpacity onPress={getEstimate} disabled={estimating} style={styles.primaryButton}>
                  <LinearGradient colors={estimating ? ["#333", "#222"] : ["#9b59b6", "#8e44ad"]} style={styles.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.primaryText}>{estimating ? "⏳ Calculating Price..." : "💰 Get Price Estimate →"}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}

            {/* Step 3 - Confirm */}
            {step === 3 && priceEstimate && (
              <>
                {/* Price Cards */}
                <View style={styles.priceRow}>
                  {[
                    { label: "Standard Delivery", price: priceEstimate.pricing?.standard?.price, time: priceEstimate.pricing?.standard?.estimatedTime, color: "#3498db" },
                    { label: "Express Delivery", price: priceEstimate.pricing?.express?.price, time: priceEstimate.pricing?.express?.estimatedTime, color: "#e74c3c", popular: true }
                  ].map((plan, i) => (
                    <LinearGradient key={i} colors={[plan.color + "25", plan.color + "10"]} style={[styles.priceCard, { borderColor: plan.color + "40" }]}>
                      {plan.popular && <View style={styles.popularBadge}><Text style={styles.popularText}>POPULAR</Text></View>}
                      <Text style={styles.priceCardLabel}>{plan.label}</Text>
                      <Text style={[styles.priceCardAmount, { color: plan.color }]}>₦{plan.price?.toLocaleString()}</Text>
                      <Text style={styles.priceCardTime}>⏱ {plan.time}</Text>
                    </LinearGradient>
                  ))}
                </View>

                <View style={styles.distanceCard}>
                  <Text style={styles.distanceText}>📍 Distance: <Text style={{ color: "#e74c3c", fontWeight: "800" }}>{priceEstimate.distanceKm} km</Text></Text>
                </View>

                {/* Promo Code */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>🏷️ Promo Code</Text>
                  <Text style={styles.cardSubtitle}>Have a discount code? Apply it here</Text>
                  <View style={styles.promoRow}>
                    <View style={[styles.inputContainer, { flex: 1, borderColor: inputBorder("promo") }]}>
                      <Text style={styles.inputIcon}>🏷️</Text>
                      <TextInput style={styles.input} value={discountCode}
                        onChangeText={v => setDiscountCode(v.toUpperCase())}
                        onFocus={() => setFocused({ ...focused, promo: true })}
                        onBlur={() => setFocused({ ...focused, promo: false })}
                        placeholder="e.g. SAVE20"
                        placeholderTextColor="rgba(255,255,255,0.2)"
                        autoCapitalize="characters" />
                    </View>
                    <TouchableOpacity onPress={applyDiscount} style={styles.promoButton}>
                      <LinearGradient colors={["#9b59b6", "#8e44ad"]} style={styles.promoGradient}>
                        <Text style={styles.promoText}>Apply</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                  {discountResult && (
                    <View style={styles.discountResult}>
                      <Text style={styles.discountResultText}>✅ Saving ₦{discountResult.discountAmount} — Final: ₦{discountResult.finalAmount?.toLocaleString()}</Text>
                    </View>
                  )}
                </View>

                {/* Summary */}
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>📋 Order Summary</Text>
                  {[
                    { label: "From", value: form.senderAddress },
                    { label: "To", value: form.recipientAddress },
                    { label: "Package", value: `${form.description} (${form.weight || 1}kg)` },
                    { label: "Fragile", value: form.fragile ? "Yes ⚠️" : "No" }
                  ].map((row, i) => (
                    <View key={i} style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>{row.label}</Text>
                      <Text style={styles.summaryValue} numberOfLines={1}>{row.value}</Text>
                    </View>
                  ))}
                </View>

                <TouchableOpacity onPress={bookDelivery} disabled={loading} style={styles.primaryButton}>
                  <LinearGradient colors={loading ? ["#333", "#222"] : ["#27ae60", "#1e8449"]} style={styles.primaryGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                    <Text style={styles.primaryText}>{loading ? "⏳ Placing Order..." : "🚚 Confirm & Book Delivery"}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </View>
          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050810" },
  orb1: { position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(231,76,60,0.06)" },
  orb2: { position: "absolute", bottom: 100, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(52,152,219,0.05)" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingTop: 56 },
  backBtn: { padding: 8 },
  backText: { color: "#e74c3c", fontSize: 15, fontWeight: "600" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "white" },
  stepBadge: { backgroundColor: "rgba(231,76,60,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: "rgba(231,76,60,0.4)" },
  stepBadgeText: { color: "#e74c3c", fontWeight: "700", fontSize: 12 },
  progressBar: { height: 3, backgroundColor: "rgba(255,255,255,0.08)", marginHorizontal: 20, borderRadius: 2, marginBottom: 12 },
  progressFill: { height: 3, borderRadius: 2 },
  stepsRow: { flexDirection: "row", justifyContent: "space-around", paddingHorizontal: 16, marginBottom: 8 },
  stepItem: { alignItems: "center", gap: 4 },
  stepCircle: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  stepNum: { color: "white", fontSize: 11, fontWeight: "700" },
  stepLabel: { fontSize: 10, fontWeight: "600" },
  stepContent: { padding: 16 },
  card: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  cardHeaderIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "white" },
  cardSubtitle: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 1 },
  inputWrapper: { marginBottom: 14 },
  inputLabel: { fontSize: 11, color: "rgba(255,255,255,0.45)", marginBottom: 7, fontWeight: "700", letterSpacing: 0.8 },
  inputContainer: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 12, borderWidth: 1.5, paddingHorizontal: 12 },
  inputIcon: { fontSize: 15, marginRight: 8 },
  input: { flex: 1, color: "white", fontSize: 14, paddingVertical: 13 },
  inputHint: { fontSize: 11, color: "rgba(255,255,255,0.2)", marginTop: 4, marginLeft: 2 },
  toggleRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  toggleBtn: { flex: 1, padding: 12, borderRadius: 12, borderWidth: 1.5, alignItems: "flex-start" },
  toggleBtnText: { fontWeight: "700", fontSize: 13, marginBottom: 2 },
  toggleBtnSub: { color: "rgba(255,255,255,0.3)", fontSize: 11 },
  primaryButton: { borderRadius: 16, overflow: "hidden", marginTop: 8 },
  primaryGradient: { padding: 17, alignItems: "center" },
  primaryText: { color: "white", fontSize: 15, fontWeight: "800" },
  priceRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  priceCard: { flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, alignItems: "center", position: "relative" },
  popularBadge: { position: "absolute", top: -10, backgroundColor: "#e74c3c", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  popularText: { color: "white", fontSize: 9, fontWeight: "800" },
  priceCardLabel: { color: "rgba(255,255,255,0.5)", fontSize: 11, fontWeight: "600", marginBottom: 6, marginTop: 8 },
  priceCardAmount: { fontSize: 22, fontWeight: "900", marginBottom: 4 },
  priceCardTime: { color: "rgba(255,255,255,0.35)", fontSize: 11 },
  distanceCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.07)", alignItems: "center" },
  distanceText: { color: "rgba(255,255,255,0.6)", fontSize: 14 },
  promoRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  promoButton: { borderRadius: 12, overflow: "hidden" },
  promoGradient: { padding: 13, paddingHorizontal: 16, justifyContent: "center" },
  promoText: { color: "white", fontWeight: "700", fontSize: 13 },
  discountResult: { marginTop: 10, backgroundColor: "rgba(39,174,96,0.12)", padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "rgba(39,174,96,0.3)" },
  discountResultText: { color: "#27ae60", fontWeight: "700", fontSize: 13 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 9, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" },
  summaryLabel: { color: "rgba(255,255,255,0.35)", fontSize: 12, width: 70 },
  summaryValue: { color: "white", fontWeight: "600", fontSize: 12, flex: 1, textAlign: "right" }
});

export default BookDeliveryScreen;