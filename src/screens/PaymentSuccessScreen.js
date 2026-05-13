import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
    Animated,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const PaymentSuccessScreen = ({ navigation, route }) => {
  const { trackingNumber, amount } = route.params;
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={["#050810", "#0d1117", "#111827"]} style={StyleSheet.absoluteFill} />
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <View style={styles.content}>
        {/* Success Icon */}
        <Animated.View style={[styles.successCircle, { transform: [{ scale: scaleAnim }] }]}>
          <LinearGradient colors={["#27ae60", "#1e8449"]} style={styles.successGradient}>
            <Text style={styles.successIcon}>✅</Text>
          </LinearGradient>
          <View style={styles.ring1} />
          <View style={styles.ring2} />
        </Animated.View>

        <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
          <Text style={styles.successTitle}>Payment Successful!</Text>
          <Text style={styles.successSubtitle}>Your delivery has been confirmed</Text>

          {/* Details Card */}
          <View style={styles.detailsCard}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerBR} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Tracking Number</Text>
              <Text style={styles.detailValue}>{trackingNumber}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Amount Paid</Text>
              <Text style={[styles.detailValue, { color: "#27ae60" }]}>₦{amount?.toLocaleString()}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Status</Text>
              <Text style={[styles.detailValue, { color: "#27ae60" }]}>✅ Confirmed</Text>
            </View>
          </View>

          <Text style={styles.noteText}>
            📧 A confirmation email has been sent to your inbox
          </Text>

          {/* Buttons */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Track", { trackingNumber })}
            style={styles.trackButton}
          >
            <LinearGradient colors={["#3498db", "#2980b9"]} style={styles.buttonGradient}>
              <Text style={styles.buttonText}>📍 Track Your Order</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Home")}
            style={styles.homeButton}
          >
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050810" },
  orb1: { position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(39,174,96,0.08)" },
  orb2: { position: "absolute", bottom: 100, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(39,174,96,0.05)" },
  content: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24 },
  successCircle: { marginBottom: 30, position: "relative", alignItems: "center", justifyContent: "center" },
  successGradient: { width: 100, height: 100, borderRadius: 30, alignItems: "center", justifyContent: "center", shadowColor: "#27ae60", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 15 },
  successIcon: { fontSize: 50 },
  ring1: { position: "absolute", width: 140, height: 140, borderRadius: 45, borderWidth: 1, borderColor: "rgba(39,174,96,0.3)" },
  ring2: { position: "absolute", width: 180, height: 180, borderRadius: 55, borderWidth: 1, borderColor: "rgba(39,174,96,0.15)" },
  successTitle: { fontSize: 28, fontWeight: "900", color: "white", marginBottom: 8, textAlign: "center" },
  successSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.5)", marginBottom: 30, textAlign: "center" },
  detailsCard: { width: "100%", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: "rgba(39,174,96,0.2)", position: "relative" },
  cornerTL: { position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "#27ae60" },
  cornerBR: { position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "#27ae60" },
  detailRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 8 },
  detailLabel: { color: "rgba(255,255,255,0.5)", fontSize: 14 },
  detailValue: { color: "white", fontWeight: "700", fontSize: 14 },
  detailDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.06)" },
  noteText: { color: "rgba(255,255,255,0.4)", fontSize: 12, textAlign: "center", marginBottom: 24 },
  trackButton: { width: "100%", borderRadius: 16, overflow: "hidden", marginBottom: 12 },
  buttonGradient: { padding: 16, alignItems: "center" },
  buttonText: { color: "white", fontSize: 16, fontWeight: "800" },
  homeButton: { padding: 16, alignItems: "center" },
  homeButtonText: { color: "rgba(255,255,255,0.4)", fontSize: 15, fontWeight: "600" }
});

export default PaymentSuccessScreen;
