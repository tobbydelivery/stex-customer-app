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
  View,
} from "react-native";
import API from "../services/api";

const { width } = Dimensions.get("window");

const BookDeliveryScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    senderName: "", senderPhone: "", senderAddress: "",
    recipientName: "", recipientPhone: "", recipientAddress: "",
    description: "", weight: "", fragile: false
  });
  const [priceEstimate, setPriceEstimate] = useState(null);
  const [discountCode, setDiscountCode] = useState("");
  const [discountResult, setDiscountResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estimating, setEstimating] = useState(false);

  const getEstimate = async () => {
    if (!form.senderAddress || !form.recipientAddress) return Alert.alert("Error", "Please enter both addresses first");
    setEstimating(true);
    try {
      const res = await API.post("/pricing/estimate", {
        pickupAddress: form.senderAddress,
        deliveryAddress: form.recipientAddress,
        weight: parseFloat(form.weight) || 1,
        fragile: form.fragile
      });
      setPriceEstimate(res.data);
      setStep(3);
    } catch (err) {
      Alert.alert("Error", "Could not get price estimate");
    } finally {
      setEstimating(false);
    }
  };

  const applyDiscount = async () => {
    if (!discountCode) return;
    try {
      const res = await API.post("/discounts/validate", {
        code: discountCode,
        orderAmount: priceEstimate?.pricing?.standard?.price || 2500
      });
      setDiscountResult(res.data);
      Alert.alert("✅ Code Applied!", `You save ₦${res.data.discountAmount}!`);
    } catch (err) {
      Alert.alert("Invalid Code", err.response?.data?.error || "Invalid discount code");
    }
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
    Alert.alert(
      "🎉 Order Placed!",
      `Tracking: ${order.trackingNumber}\n\nProceed to payment?`,
      [
        {
          text: "Pay Now",
          onPress: () => navigation.navigate("Payment", {
            orderId: order._id,
            amount: order.price || 2500,
            trackingNumber: order.trackingNumber
          })
        },
        { text: "Pay Later", onPress: () => navigation.navigate("Home") }
      ]
    );
  } catch (err) {
    Alert.alert("Error", err.response?.data?.error || "Could not place order");
  } finally {
    setLoading(false);
  }
  };

  const InputField = ({ label, value, onChange, placeholder, keyboard, secure }) => (
    <View style={styles.inputWrapper}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          placeholder={placeholder}
          placeholderTextColor="rgba(255,255,255,0.25)"
          keyboardType={keyboard || "default"}
          secureTextEntry={secure || false}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0d1117", "#1a252f", "#2c3e50"]} style={StyleSheet.absoluteFill} />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => step > 1 ? setStep(step - 1) : navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Book Delivery</Text>
          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>{step}/3</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBar}>
          <LinearGradient colors={["#e74c3c", "#c0392b"]} style={[styles.progressFill, { width: `${(step / 3) * 100}%` }]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>

          {/* Step 1 - Sender & Recipient */}
          {step === 1 && (
            <View style={styles.stepContent}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <LinearGradient colors={["#3498db30", "#3498db10"]} style={styles.cardHeaderIcon}>
                    <Text style={styles.cardHeaderEmoji}>📤</Text>
                  </LinearGradient>
                  <Text style={styles.cardTitle}>Sender Details</Text>
                </View>
                <InputField label="Full Name" value={form.senderName} onChange={v => setForm({ ...form, senderName: v })} placeholder="John Doe" />
                <InputField label="Phone Number" value={form.senderPhone} onChange={v => setForm({ ...form, senderPhone: v })} placeholder="08012345678" keyboard="phone-pad" />
                <InputField label="Pickup Address" value={form.senderAddress} onChange={v => setForm({ ...form, senderAddress: v })} placeholder="Enter full pickup address" />
              </View>

              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <LinearGradient colors={["#27ae6030", "#27ae6010"]} style={styles.cardHeaderIcon}>
                    <Text style={styles.cardHeaderEmoji}>📥</Text>
                  </LinearGradient>
                  <Text style={styles.cardTitle}>Recipient Details</Text>
                </View>
                <InputField label="Full Name" value={form.recipientName} onChange={v => setForm({ ...form, recipientName: v })} placeholder="Jane Doe" />
                <InputField label="Phone Number" value={form.recipientPhone} onChange={v => setForm({ ...form, recipientPhone: v })} placeholder="08087654321" keyboard="phone-pad" />
                <InputField label="Delivery Address" value={form.recipientAddress} onChange={v => setForm({ ...form, recipientAddress: v })} placeholder="Enter full delivery address" />
              </View>

              <TouchableOpacity onPress={() => setStep(2)} style={styles.nextButton}>
                <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.nextGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.nextText}>Next: Package Details →</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 2 - Package Details */}
          {step === 2 && (
            <View style={styles.stepContent}>
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <LinearGradient colors={["#9b59b630", "#9b59b610"]} style={styles.cardHeaderIcon}>
                    <Text style={styles.cardHeaderEmoji}>📋</Text>
                  </LinearGradient>
                  <Text style={styles.cardTitle}>Package Details</Text>
                </View>
                <InputField label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} placeholder="e.g. Electronics, Clothes, Documents" />
                <InputField label="Weight (kg)" value={form.weight} onChange={v => setForm({ ...form, weight: v })} placeholder="e.g. 2.5" keyboard="decimal-pad" />

                <View style={styles.inputWrapper}>
                  <Text style={styles.inputLabel}>Fragile Item?</Text>
                  <View style={styles.fragileRow}>
                    <TouchableOpacity onPress={() => setForm({ ...form, fragile: false })} style={[styles.fragileBtn, !form.fragile && styles.fragileBtnActive]}>
                      <Text style={[styles.fragileBtnText, !form.fragile && { color: "white" }]}>✓ No</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setForm({ ...form, fragile: true })} style={[styles.fragileBtn, form.fragile && styles.fragileBtnFragile]}>
                      <Text style={[styles.fragileBtnText, form.fragile && { color: "white" }]}>⚠️ Yes - Handle with Care</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity onPress={getEstimate} disabled={estimating} style={styles.nextButton}>
                <LinearGradient colors={["#9b59b6", "#8e44ad"]} style={styles.nextGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.nextText}>{estimating ? "Calculating..." : "💰 Get Price Estimate →"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          {/* Step 3 - Price & Confirm */}
          {step === 3 && priceEstimate && (
            <View style={styles.stepContent}>
              {/* Price Cards */}
              <View style={styles.priceRow}>
                <LinearGradient colors={["#3498db20", "#3498db10"]} style={[styles.priceCard, { borderColor: "#3498db30" }]}>
                  <Text style={styles.priceCardLabel}>Standard</Text>
                  <Text style={[styles.priceCardAmount, { color: "#3498db" }]}>₦{priceEstimate.pricing?.standard?.price}</Text>
                  <Text style={styles.priceCardTime}>⏱ {priceEstimate.pricing?.standard?.estimatedTime}</Text>
                </LinearGradient>
                <LinearGradient colors={["#e74c3c20", "#e74c3c10"]} style={[styles.priceCard, { borderColor: "#e74c3c30" }]}>
                  <View style={styles.popularBadge}><Text style={styles.popularText}>POPULAR</Text></View>
                  <Text style={styles.priceCardLabel}>Express</Text>
                  <Text style={[styles.priceCardAmount, { color: "#e74c3c" }]}>₦{priceEstimate.pricing?.express?.price}</Text>
                  <Text style={styles.priceCardTime}>⏱ {priceEstimate.pricing?.express?.estimatedTime}</Text>
                </LinearGradient>
              </View>

              {/* Distance */}
              <View style={styles.distanceCard}>
                <Text style={styles.distanceText}>📍 Distance: <Text style={{ color: "#e74c3c", fontWeight: "800" }}>{priceEstimate.distanceKm} km</Text></Text>
              </View>

              {/* Breakdown */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>Price Breakdown</Text>
                {[
                  { label: "Base Fee", value: `₦${priceEstimate.breakdown?.baseFee}` },
                  { label: "Distance Fee", value: `₦${priceEstimate.breakdown?.distanceFee}` },
                  { label: "Weight Fee", value: `₦${priceEstimate.breakdown?.weightFee}` },
                  { label: "Fragile Fee", value: `₦${priceEstimate.breakdown?.fragileFee}` }
                ].map((item, i) => (
                  <View key={i} style={styles.breakdownRow}>
                    <Text style={styles.breakdownLabel}>{item.label}</Text>
                    <Text style={styles.breakdownValue}>{item.value}</Text>
                  </View>
                ))}
              </View>

              {/* Promo Code */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>🏷️ Promo Code</Text>
                <View style={styles.promoRow}>
                  <TextInput
                    style={styles.promoInput}
                    value={discountCode}
                    onChangeText={v => setDiscountCode(v.toUpperCase())}
                    placeholder="Enter promo code"
                    placeholderTextColor="rgba(255,255,255,0.25)"
                    autoCapitalize="characters"
                  />
                  <TouchableOpacity onPress={applyDiscount} style={styles.promoButton}>
                    <LinearGradient colors={["#9b59b6", "#8e44ad"]} style={styles.promoGradient}>
                      <Text style={styles.promoText}>Apply</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                {discountResult && (
                  <View style={styles.discountResult}>
                    <Text style={styles.discountResultText}>✅ Saving ₦{discountResult.discountAmount} — Final: ₦{discountResult.finalAmount}</Text>
                  </View>
                )}
              </View>

              {/* Order Summary */}
              <View style={styles.card}>
                <Text style={styles.cardTitle}>📋 Order Summary</Text>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>From</Text><Text style={styles.summaryValue} numberOfLines={1}>{form.senderAddress}</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>To</Text><Text style={styles.summaryValue} numberOfLines={1}>{form.recipientAddress}</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Package</Text><Text style={styles.summaryValue}>{form.description} ({form.weight || 1}kg)</Text></View>
                <View style={styles.summaryRow}><Text style={styles.summaryLabel}>Fragile</Text><Text style={styles.summaryValue}>{form.fragile ? "Yes ⚠️" : "No"}</Text></View>
              </View>

              <TouchableOpacity onPress={bookDelivery} disabled={loading} style={styles.nextButton}>
                <LinearGradient colors={loading ? ["#555", "#444"] : ["#27ae60", "#1e8449"]} style={styles.nextGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.nextText}>{loading ? "Placing Order..." : "🚚 Confirm & Book Delivery"}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          )}

          <View style={{ height: 120 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117" },
  bgCircle1: { position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(231,76,60,0.06)" },
  bgCircle2: { position: "absolute", bottom: 100, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(52,152,219,0.05)" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingTop: 56 },
  backBtn: { padding: 8 },
  backText: { color: "#e74c3c", fontSize: 15, fontWeight: "600" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "white" },
  stepIndicator: { backgroundColor: "rgba(231,76,60,0.2)", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20, borderWidth: 1, borderColor: "#e74c3c50" },
  stepText: { color: "#e74c3c", fontWeight: "700", fontSize: 13 },
  progressBar: { height: 3, backgroundColor: "rgba(255,255,255,0.1)", marginHorizontal: 20, borderRadius: 2 },
  progressFill: { height: 3, borderRadius: 2 },
  stepContent: { padding: 16 },
  card: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  cardHeaderIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  cardHeaderEmoji: { fontSize: 20 },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "white" },
  inputWrapper: { marginBottom: 14 },
  inputLabel: { fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 8, fontWeight: "600", letterSpacing: 0.5 },
  inputContainer: { backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  input: { color: "white", fontSize: 14, padding: 14 },
  fragileRow: { flexDirection: "row", gap: 10 },
  fragileBtn: { flex: 1, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: "rgba(255,255,255,0.15)", alignItems: "center" },
  fragileBtnActive: { backgroundColor: "#27ae60", borderColor: "#27ae60" },
  fragileBtnFragile: { backgroundColor: "#e74c3c", borderColor: "#e74c3c" },
  fragileBtnText: { color: "rgba(255,255,255,0.6)", fontWeight: "600", fontSize: 13 },
  nextButton: { borderRadius: 16, overflow: "hidden", marginTop: 8 },
  nextGradient: { padding: 18, alignItems: "center" },
  nextText: { color: "white", fontSize: 16, fontWeight: "800" },
  priceRow: { flexDirection: "row", gap: 12, marginBottom: 12 },
  priceCard: { flex: 1, borderRadius: 16, padding: 16, borderWidth: 1, alignItems: "center", position: "relative" },
  popularBadge: { position: "absolute", top: -10, backgroundColor: "#e74c3c", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 },
  popularText: { color: "white", fontSize: 9, fontWeight: "800" },
  priceCardLabel: { color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "600", marginBottom: 6, marginTop: 10 },
  priceCardAmount: { fontSize: 24, fontWeight: "900", marginBottom: 4 },
  priceCardTime: { color: "rgba(255,255,255,0.4)", fontSize: 11 },
  distanceCard: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", alignItems: "center" },
  distanceText: { color: "rgba(255,255,255,0.7)", fontSize: 14 },
  breakdownRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  breakdownLabel: { color: "rgba(255,255,255,0.5)", fontSize: 13 },
  breakdownValue: { color: "white", fontWeight: "600", fontSize: 13 },
  promoRow: { flexDirection: "row", gap: 10, marginTop: 8 },
  promoInput: { flex: 1, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 10, padding: 12, color: "white", fontSize: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  promoButton: { borderRadius: 10, overflow: "hidden" },
  promoGradient: { padding: 12, paddingHorizontal: 16, justifyContent: "center" },
  promoText: { color: "white", fontWeight: "700" },
  discountResult: { marginTop: 10, backgroundColor: "rgba(39,174,96,0.15)", padding: 10, borderRadius: 10, borderWidth: 1, borderColor: "rgba(39,174,96,0.3)" },
  discountResultText: { color: "#27ae60", fontWeight: "600", fontSize: 13 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  summaryLabel: { color: "rgba(255,255,255,0.4)", fontSize: 13, width: 70 },
  summaryValue: { color: "white", fontWeight: "600", fontSize: 13, flex: 1, textAlign: "right" }
});

export default BookDeliveryScreen;