import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { WebView } from "react-native-webview";
import API from "../services/api";

const { width, height } = Dimensions.get("window");

const PaymentScreen = ({ navigation, route }) => {
  const { orderId, amount, trackingNumber } = route.params;
  const [paymentUrl, setPaymentUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const initializePayment = async () => {
    setInitializing(true);
    try {
      const res = await API.post(`/payments/${orderId}/pay`);
      setPaymentUrl(res.data.paymentUrl);
    } catch (err) {
      alert(err.response?.data?.error || "Could not initialize payment");
    } finally {
      setInitializing(false);
    }
  };

  const handleNavigationChange = (navState) => {
    const { url } = navState;

    // Check if payment was successful
    if (url.includes("/api/payments/verify") || url.includes("payment-success")) {
      setPaymentUrl(null);
      navigation.replace("PaymentSuccess", { trackingNumber, amount });
    }

    // Check if payment was cancelled
    if (url.includes("payment-cancel") || url.includes("paystack.com/close")) {
      setPaymentUrl(null);
    }
  };

  if (paymentUrl) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <View style={styles.webViewHeader}>
          <TouchableOpacity onPress={() => setPaymentUrl(null)} style={styles.closeBtn}>
            <Text style={styles.closeBtnText}>✕ Cancel</Text>
          </TouchableOpacity>
          <Text style={styles.webViewTitle}>Secure Payment</Text>
          <View style={styles.secureBadge}>
            <Text style={styles.secureBadgeText}>🔒 SSL</Text>
          </View>
        </View>
        {loading && (
          <View style={styles.webViewLoading}>
            <ActivityIndicator color="#e74c3c" size="large" />
            <Text style={styles.webViewLoadingText}>Loading payment page...</Text>
          </View>
        )}
        <WebView
          source={{ uri: paymentUrl }}
          onNavigationStateChange={handleNavigationChange}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={styles.webView}
          javaScriptEnabled
          domStorageEnabled
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={["#050810", "#0d1117", "#111827"]} style={StyleSheet.absoluteFill} />
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 60 }} />
      </View>

      <View style={styles.content}>
        {/* Order Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.cornerTL} />
          <View style={styles.cornerTR} />
          <View style={styles.cornerBL} />
          <View style={styles.cornerBR} />

          <Text style={styles.summaryEmoji}>📦</Text>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <Text style={styles.summaryTracking}>{trackingNumber}</Text>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>₦{amount?.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>VAT (0%)</Text>
            <Text style={styles.summaryValue}>₦0</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Insurance</Text>
            <Text style={[styles.summaryValue, { color: "#27ae60" }]}>FREE</Text>
          </View>

          <View style={styles.summaryDivider} />

          <View style={styles.summaryRow}>
            <Text style={styles.summaryTotalLabel}>Total Amount</Text>
            <Text style={styles.summaryTotal}>₦{amount?.toLocaleString()}</Text>
          </View>
        </View>

        {/* Payment Methods */}
        <View style={styles.methodsCard}>
          <Text style={styles.methodsTitle}>Accepted Payment Methods</Text>
          <View style={styles.methodsRow}>
            {["💳 Card", "🏦 Bank", "📱 USSD", "💰 Transfer"].map((method, i) => (
              <View key={i} style={styles.methodItem}>
                <Text style={styles.methodText}>{method}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Security Note */}
        <View style={styles.securityNote}>
          <Text style={styles.securityText}>
            🔒 Payments are processed securely via Paystack. Your card details are never stored.
          </Text>
        </View>

        {/* Pay Button */}
        <TouchableOpacity
          onPress={initializePayment}
          disabled={initializing}
          style={styles.payButton}
        >
          <LinearGradient
            colors={initializing ? ["#333", "#222"] : ["#27ae60", "#1e8449"]}
            style={styles.payGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {initializing ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.payButtonText}>
                Pay ₦{amount?.toLocaleString()} Now →
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050810" },
  orb1: { position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(39,174,96,0.06)" },
  orb2: { position: "absolute", bottom: 100, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(52,152,219,0.04)" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingTop: 56 },
  backBtn: { padding: 8 },
  backText: { color: "#e74c3c", fontSize: 15, fontWeight: "600" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "white" },
  content: { flex: 1, padding: 16 },
  summaryCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 24, marginBottom: 12, borderWidth: 1, borderColor: "rgba(39,174,96,0.2)", alignItems: "center", position: "relative" },
  cornerTL: { position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "#27ae60" },
  cornerTR: { position: "absolute", top: 0, right: 0, width: 16, height: 16, borderTopWidth: 2, borderRightWidth: 2, borderColor: "#27ae60" },
  cornerBL: { position: "absolute", bottom: 0, left: 0, width: 16, height: 16, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: "#27ae60" },
  cornerBR: { position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "#27ae60" },
  summaryEmoji: { fontSize: 40, marginBottom: 10 },
  summaryTitle: { fontSize: 16, fontWeight: "800", color: "white", marginBottom: 4 },
  summaryTracking: { fontSize: 13, color: "#3498db", fontWeight: "600", marginBottom: 16 },
  summaryDivider: { width: "100%", height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginVertical: 12 },
  summaryRow: { flexDirection: "row", justifyContent: "space-between", width: "100%", paddingVertical: 4 },
  summaryLabel: { color: "rgba(255,255,255,0.5)", fontSize: 14 },
  summaryValue: { color: "white", fontWeight: "600", fontSize: 14 },
  summaryTotalLabel: { color: "white", fontSize: 16, fontWeight: "800" },
  summaryTotal: { color: "#27ae60", fontSize: 20, fontWeight: "900" },
  methodsCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  methodsTitle: { color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: "600", marginBottom: 12, letterSpacing: 0.5 },
  methodsRow: { flexDirection: "row", gap: 8 },
  methodItem: { flex: 1, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 8, padding: 8, alignItems: "center" },
  methodText: { color: "white", fontSize: 11, fontWeight: "600" },
  securityNote: { backgroundColor: "rgba(39,174,96,0.1)", borderRadius: 12, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: "rgba(39,174,96,0.2)" },
  securityText: { color: "rgba(255,255,255,0.6)", fontSize: 12, lineHeight: 18, textAlign: "center" },
  payButton: { borderRadius: 16, overflow: "hidden" },
  payGradient: { padding: 18, alignItems: "center" },
  payButtonText: { color: "white", fontSize: 17, fontWeight: "800" },
  webViewHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#0d1117", padding: 16, paddingTop: 50, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.1)" },
  closeBtn: { padding: 8 },
  closeBtnText: { color: "#e74c3c", fontSize: 14, fontWeight: "600" },
  webViewTitle: { fontSize: 16, fontWeight: "800", color: "white" },
  secureBadge: { backgroundColor: "rgba(39,174,96,0.2)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  secureBadgeText: { color: "#27ae60", fontSize: 12, fontWeight: "700" },
  webViewLoading: { position: "absolute", top: "50%", left: "50%", transform: [{ translateX: -50 }, { translateY: -50 }], alignItems: "center", zIndex: 10 },
  webViewLoadingText: { color: "rgba(255,255,255,0.5)", marginTop: 10 },
  webView: { flex: 1 }
});

export default PaymentScreen;
