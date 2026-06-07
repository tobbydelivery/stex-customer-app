import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert, ImageBackground, ScrollView, StatusBar,
  StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import API from "../services/api";

const HERO_IMAGE = "https://i.ibb.co/XkVB3qCd/B13-E95-AC-6-A36-48-B8-8-E92-E7881-B1-FB33-A.png";

const TrackScreen = ({ navigation, route }) => {
  const [trackingNumber, setTrackingNumber] = useState(route?.params?.trackingNumber || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);

  useEffect(() => {
    if (route?.params?.trackingNumber) handleTrack(route.params.trackingNumber);
  }, []);

  const handleTrack = async (num) => {
    const number = num || trackingNumber;
    if (!number) return Alert.alert("Missing Info", "Please enter a tracking number");
    setLoading(true);
    try {
      const res = await API.get(`/tracking/${number}`);
      setOrder(res.data.order);
    } catch (err) {
      Alert.alert("Not Found", "Order not found. Please check your tracking number.");
    } finally { setLoading(false); }
  };

  const getStatusColor = (status) => {
    const colors = { pending: "#f39c12", picked_up: "#3498db", in_transit: "#9b59b6", delivered: "#27ae60", cancelled: "#e74c3c", delayed: "#e67e22" };
    return colors[status] || "#95a5a6";
  };

  const getStatusIcon = (status) => {
    const icons = { pending: "⏳", picked_up: "📦", in_transit: "🚚", delivered: "✅", cancelled: "❌", delayed: "⚠️" };
    return icons[status] || "📦";
  };

  const getStatusStep = (status) => ["pending", "picked_up", "in_transit", "delivered"].indexOf(status);
  const steps = [
    { label: "Order Placed", icon: "📝", key: "pending" },
    { label: "Picked Up", icon: "📦", key: "picked_up" },
    { label: "In Transit", icon: "🚚", key: "in_transit" },
    { label: "Delivered", icon: "✅", key: "delivered" }
  ];

  const visibleHistory = showAllHistory ? order?.statusHistory : order?.statusHistory?.slice(0, 3);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient colors={["rgba(5,8,16,0.93)", "rgba(13,17,23,0.9)", "rgba(17,24,39,0.95)"]} style={StyleSheet.absoluteFill} />
      </ImageBackground>
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Package</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }}>

        {/* Search */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Track Your Package</Text>
          <Text style={styles.cardSubtitle}>Enter your tracking number below</Text>
          <View style={[styles.searchRow, { borderColor: focused ? "rgba(231,76,60,0.7)" : "rgba(255,255,255,0.1)" }]}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              value={trackingNumber}
              onChangeText={v => setTrackingNumber(v.toUpperCase())}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="e.g. TRK1234567890"
              placeholderTextColor="rgba(255,255,255,0.2)"
              autoCapitalize="characters"
            />
            {trackingNumber.length > 0 && (
              <TouchableOpacity onPress={() => setTrackingNumber("")} style={styles.clearBtn}>
                <Text style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.inputHint}>Your tracking number was sent to your email when you placed the order</Text>
          <TouchableOpacity onPress={() => handleTrack()} disabled={loading} style={styles.trackButton}>
            <LinearGradient colors={loading ? ["#333", "#222"] : ["#e74c3c", "#c0392b"]} style={styles.trackButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.trackButtonText}>{loading ? "⏳ Searching..." : "Track Package →"}</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {order && (
          <View>
            {/* Status Banner */}
            <LinearGradient colors={[getStatusColor(order.status) + "35", getStatusColor(order.status) + "15"]} style={[styles.statusBanner, { borderColor: getStatusColor(order.status) + "50" }]}>
              <Text style={styles.statusBannerIcon}>{getStatusIcon(order.status)}</Text>
              <Text style={[styles.statusBannerText, { color: getStatusColor(order.status) }]}>
                {order.status.replace(/_/g, " ").toUpperCase()}
              </Text>
              <Text style={styles.statusBannerTracking}>Tracking: {order.trackingNumber}</Text>
            </LinearGradient>

            {/* Progress Steps */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>DELIVERY PROGRESS</Text>
              <View style={styles.stepsContainer}>
                {steps.map((step, i) => {
                  const isActive = i <= getStatusStep(order.status);
                  const isCurrent = i === getStatusStep(order.status);
                  return (
                    <View key={i} style={styles.stepWrapper}>
                      <LinearGradient
                        colors={isActive ? [getStatusColor(order.status), getStatusColor(order.status) + "80"] : ["rgba(255,255,255,0.08)", "rgba(255,255,255,0.04)"]}
                        style={[styles.stepCircle, isCurrent && { shadowColor: getStatusColor(order.status), shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 }]}
                      >
                        <Text style={{ fontSize: isActive ? 16 : 12, color: isActive ? "white" : "rgba(255,255,255,0.3)", fontWeight: "700" }}>
                          {isActive ? step.icon : (i + 1).toString()}
                        </Text>
                      </LinearGradient>
                      {i < 3 && <View style={[styles.stepLine, { backgroundColor: i < getStatusStep(order.status) ? getStatusColor(order.status) : "rgba(255,255,255,0.08)" }]} />}
                      <Text style={[styles.stepLabel, { color: isActive ? "white" : "rgba(255,255,255,0.25)" }]}>{step.label}</Text>
                    </View>
                  );
                })}
              </View>
            </View>

            {/* Route */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>DELIVERY ROUTE</Text>
              <View style={styles.routeItem}>
                <View style={[styles.routeDot, { backgroundColor: "#3498db" }]} />
                <View style={styles.routeContent}>
                  <Text style={styles.routeType}>📤 PICKUP LOCATION</Text>
                  <Text style={styles.routeName}>{order.sender?.name}</Text>
                  <Text style={styles.routePhone}>📞 {order.sender?.phone}</Text>
                  <Text style={styles.routeAddress}>{order.sender?.address}</Text>
                </View>
              </View>
              <View style={styles.routeLine} />
              <View style={styles.routeItem}>
                <View style={[styles.routeDot, { backgroundColor: "#27ae60" }]} />
                <View style={styles.routeContent}>
                  <Text style={styles.routeType}>📥 DELIVERY LOCATION</Text>
                  <Text style={styles.routeName}>{order.recipient?.name}</Text>
                  <Text style={styles.routePhone}>📞 {order.recipient?.phone}</Text>
                  <Text style={styles.routeAddress}>{order.recipient?.address}</Text>
                </View>
              </View>
            </View>

            {/* Package Info */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>PACKAGE INFORMATION</Text>
              <View style={styles.packageGrid}>
                {[
                  { label: "Description", value: order.package?.description, icon: "📝" },
                  { label: "Weight", value: `${order.package?.weight || "N/A"} kg`, icon: "⚖️" },
                  { label: "Fragile", value: order.package?.fragile ? "Yes ⚠️" : "No", icon: "📦" },
                  { label: "Payment", value: order.paymentStatus, icon: "💳" }
                ].map((item, i) => (
                  <View key={i} style={styles.packageItem}>
                    <Text style={styles.packageIcon}>{item.icon}</Text>
                    <Text style={styles.packageLabel}>{item.label}</Text>
                    <Text style={styles.packageValue}>{item.value}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* History */}
            <View style={styles.card}>
              <Text style={styles.sectionLabel}>DELIVERY HISTORY</Text>
              {visibleHistory?.map((h, i) => (
                <View key={i} style={styles.historyItem}>
                  <View style={[styles.historyDot, { backgroundColor: getStatusColor(h.status) }]} />
                  <View style={styles.historyContent}>
                    <Text style={[styles.historyStatus, { color: getStatusColor(h.status) }]}>
                      {getStatusIcon(h.status)} {h.status.replace(/_/g, " ").toUpperCase()}
                    </Text>
                    <Text style={styles.historyTime}>{new Date(h.timestamp).toLocaleString("en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</Text>
                    {h.note && <Text style={styles.historyNote}>{h.note}</Text>}
                  </View>
                </View>
              ))}
              {order.statusHistory?.length > 3 && (
                <TouchableOpacity onPress={() => setShowAllHistory(!showAllHistory)} style={styles.readMoreBtn}>
                  <Text style={styles.readMoreText}>
                    {showAllHistory ? "▲ Show less" : `▼ Show ${order.statusHistory.length - 3} more updates`}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
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
  card: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 20, padding: 18, marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.07)" },
  cardTitle: { fontSize: 16, fontWeight: "800", color: "white", marginBottom: 4 },
  cardSubtitle: { fontSize: 12, color: "rgba(255,255,255,0.35)", marginBottom: 14 },
  sectionLabel: { fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: "700", letterSpacing: 1, marginBottom: 14 },
  searchRow: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, marginBottom: 6 },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchInput: { flex: 1, color: "white", fontSize: 14, paddingVertical: 14, letterSpacing: 0.5 },
  clearBtn: { padding: 8 },
  inputHint: { fontSize: 11, color: "rgba(255,255,255,0.2)", marginBottom: 12, marginLeft: 2 },
  trackButton: { borderRadius: 14, overflow: "hidden" },
  trackButtonGradient: { padding: 15, alignItems: "center" },
  trackButtonText: { color: "white", fontSize: 15, fontWeight: "800" },
  statusBanner: { borderRadius: 20, padding: 24, alignItems: "center", marginBottom: 12, borderWidth: 1 },
  statusBannerIcon: { fontSize: 46, marginBottom: 10 },
  statusBannerText: { fontSize: 18, fontWeight: "900", letterSpacing: 2 },
  statusBannerTracking: { color: "rgba(255,255,255,0.35)", fontSize: 12, marginTop: 6 },
  stepsContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  stepWrapper: { alignItems: "center", flex: 1, position: "relative" },
  stepCircle: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  stepLine: { position: "absolute", right: -"50%", top: 22, width: "100%", height: 2 },
  stepLabel: { fontSize: 9, fontWeight: "600", textAlign: "center" },
  routeItem: { flexDirection: "row", gap: 14, paddingVertical: 10 },
  routeDot: { width: 10, height: 10, borderRadius: 5, marginTop: 4, flexShrink: 0 },
  routeContent: { flex: 1 },
  routeType: { fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: "700", letterSpacing: 0.5, marginBottom: 4 },
  routeName: { fontSize: 14, color: "white", fontWeight: "700", marginBottom: 2 },
  routePhone: { fontSize: 12, color: "rgba(255,255,255,0.45)", marginBottom: 2 },
  routeAddress: { fontSize: 12, color: "rgba(255,255,255,0.35)" },
  routeLine: { width: 2, height: 16, backgroundColor: "rgba(255,255,255,0.08)", marginLeft: 4, marginVertical: 2 },
  packageGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  packageItem: { width: "47%", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 12, padding: 12 },
  packageIcon: { fontSize: 18, marginBottom: 6 },
  packageLabel: { fontSize: 10, color: "rgba(255,255,255,0.35)", marginBottom: 3, fontWeight: "600" },
  packageValue: { fontSize: 13, color: "white", fontWeight: "700" },
  historyItem: { flexDirection: "row", gap: 12, marginBottom: 14 },
  historyDot: { width: 8, height: 8, borderRadius: 4, marginTop: 5, flexShrink: 0 },
  historyContent: { flex: 1 },
  historyStatus: { fontSize: 13, fontWeight: "700" },
  historyTime: { fontSize: 11, color: "rgba(255,255,255,0.35)", marginTop: 2 },
  historyNote: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 },
  readMoreBtn: { marginTop: 4, paddingVertical: 8 },
  readMoreText: { color: "#e74c3c", fontSize: 13, fontWeight: "700" }
});

export default TrackScreen;