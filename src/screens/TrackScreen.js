import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import API from "../services/api";

const TrackScreen = ({ navigation, route }) => {
  const [trackingNumber, setTrackingNumber] = useState(route?.params?.trackingNumber || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (route?.params?.trackingNumber) handleTrack(route.params.trackingNumber);
  }, []);

  const handleTrack = async (num) => {
    const number = num || trackingNumber;
    if (!number) return Alert.alert("Error", "Please enter a tracking number");
    setLoading(true);
    try {
      const res = await API.get(`/tracking/${number}`);
      setOrder(res.data.order);
    } catch (err) {
      Alert.alert("Not Found", "Order not found. Please check your tracking number.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = { pending: "#f39c12", picked_up: "#3498db", in_transit: "#9b59b6", delivered: "#27ae60", cancelled: "#e74c3c", delayed: "#e67e22" };
    return colors[status] || "#95a5a6";
  };

  const getStatusStep = (status) => ["pending", "picked_up", "in_transit", "delivered"].indexOf(status);
  const steps = [{ label: "Pending", icon: "⏳" }, { label: "Picked Up", icon: "📦" }, { label: "In Transit", icon: "🚚" }, { label: "Delivered", icon: "✅" }];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0d1117", "#1a252f", "#2c3e50"]} style={StyleSheet.absoluteFill} />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Package</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>

        {/* Search */}
        <View style={styles.searchCard}>
          <Text style={styles.searchLabel}>📍 Enter Tracking Number</Text>
          <View style={styles.searchRow}>
            <TextInput
              style={styles.searchInput}
              value={trackingNumber}
              onChangeText={setTrackingNumber}
              placeholder="e.g. TRK1234567890"
              placeholderTextColor="rgba(255,255,255,0.25)"
              autoCapitalize="characters"
            />
            <TouchableOpacity onPress={() => handleTrack()} disabled={loading} style={styles.searchButton}>
              <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.searchGradient}>
                <Text style={styles.searchButtonText}>{loading ? "..." : "Track"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {order && (
          <View>
            {/* Status Banner */}
            <LinearGradient colors={[getStatusColor(order.status) + "40", getStatusColor(order.status) + "20"]} style={[styles.statusBanner, { borderColor: getStatusColor(order.status) + "50" }]}>
              <Text style={styles.statusBannerIcon}>
                {order.status === "delivered" ? "✅" : order.status === "in_transit" ? "🚚" : order.status === "picked_up" ? "📦" : "⏳"}
              </Text>
              <Text style={[styles.statusBannerText, { color: getStatusColor(order.status) }]}>
                {order.status.replace(/_/g, " ").toUpperCase()}
              </Text>
              <Text style={styles.statusBannerTracking}>{order.trackingNumber}</Text>
            </LinearGradient>

            {/* Progress Steps */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Delivery Progress</Text>
              <View style={styles.stepsContainer}>
                {steps.map((step, i) => {
                  const isActive = i <= getStatusStep(order.status);
                  const isCurrent = i === getStatusStep(order.status);
                  return (
                    <View key={i} style={styles.stepWrapper}>
                      <View style={styles.stepColumn}>
                        <LinearGradient
                          colors={isActive ? [getStatusColor(order.status), getStatusColor(order.status) + "80"] : ["rgba(255,255,255,0.1)", "rgba(255,255,255,0.05)"]}
                          style={[styles.stepCircle, isCurrent && styles.stepCircleCurrent]}
                        >
                          <Text style={styles.stepCircleIcon}>{isActive ? step.icon : (i + 1).toString()}</Text>
                        </LinearGradient>
                        {i < 3 && <View style={[styles.stepLine, { backgroundColor: isActive ? getStatusColor(order.status) : "rgba(255,255,255,0.1)" }]} />}
                      </View>
                      <Text style={[styles.stepLabel, { color: isActive ? "white" : "rgba(255,255,255,0.3)" }]}>{step.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Addresses */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Delivery Route</Text>
              <View style={styles.routeItem}>
                <View style={[styles.routeDot, { backgroundColor: "#3498db" }]} />
                <View style={styles.routeContent}>
                  <Text style={styles.routeLabel}>Pickup Location</Text>
                  <Text style={styles.routeName}>{order.sender?.name}</Text>
                  <Text style={styles.routeAddress}>{order.sender?.address}</Text>
                </View>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routeItem}>
                <View style={[styles.routeDot, { backgroundColor: "#27ae60" }]} />
                <View style={styles.routeContent}>
                  <Text style={styles.routeLabel}>Delivery Location</Text>
                  <Text style={styles.routeName}>{order.recipient?.name}</Text>
                  <Text style={styles.routeAddress}>{order.recipient?.address}</Text>
                </View>
              </View>
            </View>

            {/* Package Info */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Package Information</Text>
              <View style={styles.packageGrid}>
                {[
                  { label: "Description", value: order.package?.description },
                  { label: "Weight", value: `${order.package?.weight || "N/A"} kg` },
                  { label: "Fragile", value: order.package?.fragile ? "Yes ⚠️" : "No" },
                  { label: "Payment", value: order.paymentStatus }
                ].map((item, i) => (
                  <View key={i} style={styles.packageItem}>
                    <Text style={styles.packageLabel}>{item.label}</Text>
                    <Text style={styles.packageValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Status History */}
            <View style={styles.card}>
              <Text style={styles.cardTitle}>📋 Status History</Text>
              {order.statusHistory?.map((h, i) => (
                <View key={i} style={styles.historyItem}>
                  <View style={[styles.historyDot, { backgroundColor: getStatusColor(h.status) }]} />
                  <View style={styles.historyContent}>
                    <Text style={[styles.historyStatus, { color: getStatusColor(h.status) }]}>
                      {h.status.replace(/_/g, " ").toUpperCase()}
                    </Text>
                    <Text style={styles.historyTime}>{new Date(h.timestamp).toLocaleString()}</Text>
                    {h.note && <Text style={styles.historyNote}>{h.note}</Text>}
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
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
  searchCard: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  searchLabel: { color: "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: "600", marginBottom: 12 },
  searchRow: { flexDirection: "row", gap: 10 },
  searchInput: { flex: 1, backgroundColor: "rgba(255,255,255,0.07)", borderRadius: 12, padding: 14, color: "white", fontSize: 14, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  searchButton: { borderRadius: 12, overflow: "hidden" },
  searchGradient: { padding: 14, paddingHorizontal: 20, justifyContent: "center", alignItems: "center" },
  searchButtonText: { color: "white", fontWeight: "700", fontSize: 15 },
  statusBanner: { borderRadius: 20, padding: 24, alignItems: "center", marginBottom: 12, borderWidth: 1 },
  statusBannerIcon: { fontSize: 50, marginBottom: 10 },
  statusBannerText: { fontSize: 20, fontWeight: "900", letterSpacing: 2 },
  statusBannerTracking: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 6 },
  card: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  cardTitle: { fontSize: 15, fontWeight: "800", color: "white", marginBottom: 16 },
  stepsContainer: { flexDirection: "row", justifyContent: "space-between" },
  stepWrapper: { alignItems: "center", flex: 1 },
  stepColumn: { alignItems: "center" },
  stepCircle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  stepCircleCurrent: { shadowColor: "#e74c3c", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 8, elevation: 8 },
  stepCircleIcon: { fontSize: 18 },
  stepLine: { position: "absolute", right: -50, top: 22, width: 50, height: 2 },
  stepLabel: { fontSize: 10, fontWeight: "600", textAlign: "center" },
  routeItem: { flexDirection: "row", gap: 14, paddingVertical: 10 },
  routeDot: { width: 12, height: 12, borderRadius: 6, marginTop: 4 },
  routeContent: { flex: 1 },
  routeLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: "600", marginBottom: 2 },
  routeName: { fontSize: 14, color: "white", fontWeight: "700", marginBottom: 2 },
  routeAddress: { fontSize: 12, color: "rgba(255,255,255,0.5)" },
  routeLine: { width: 2, height: 20, backgroundColor: "rgba(255,255,255,0.1)", marginLeft: 5 },
  packageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  packageItem: { width: "47%", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12 },
  packageLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 4, fontWeight: "600" },
  packageValue: { fontSize: 13, color: "white", fontWeight: "700" },
  historyItem: { flexDirection: "row", gap: 12, marginBottom: 14 },
  historyDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4 },
  historyContent: { flex: 1 },
  historyStatus: { fontSize: 13, fontWeight: "700" },
  historyTime: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 },
  historyNote: { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 }
});

export default TrackScreen;