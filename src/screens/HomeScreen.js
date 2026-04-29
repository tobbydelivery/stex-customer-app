import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import API from "../services/api";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState({});
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadUser();
    fetchOrders();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true })
    ]).start();

    // Pulse animation for live indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.3, duration: 800, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      ])
    ).start();

    // Slow rotation for decorative element
    Animated.loop(
      Animated.timing(rotateAnim, { toValue: 1, duration: 20000, useNativeDriver: true })
    ).start();
  }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  };

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders.slice(0, 5));
    } catch (err) { console.error(err); }
    finally { setLoading(false); setRefreshing(false); }
  };

  const onRefresh = () => { setRefreshing(true); fetchOrders(); };

  const getStatusColor = (status) => {
    const colors = { pending: "#f39c12", picked_up: "#3498db", in_transit: "#9b59b6", delivered: "#27ae60", cancelled: "#e74c3c", delayed: "#e67e22" };
    return colors[status] || "#95a5a6";
  };

  const activeOrders = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled");
  const deliveredOrders = orders.filter(o => o.status === "delivered");
  const getHour = new Date().getHours();
  const greeting = getHour < 12 ? "Good Morning" : getHour < 17 ? "Good Afternoon" : "Good Evening";

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "360deg"] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Futuristic background */}
      <LinearGradient colors={["#050810", "#0d1117", "#111827"]} style={StyleSheet.absoluteFill} />

      {/* Animated decorative elements */}
      <Animated.View style={[styles.bgOrb1, { transform: [{ rotate: spin }] }]} />
      <View style={styles.bgOrb2} />
      <View style={styles.bgOrb3} />
      <View style={styles.bgOrb4} />

      {/* Grid lines effect */}
      <View style={styles.gridContainer}>
        {[...Array(8)].map((_, i) => (
          <View key={i} style={[styles.gridLine, { left: (width / 8) * i }]} />
        ))}
        {[...Array(15)].map((_, i) => (
          <View key={i} style={[styles.gridLineH, { top: (height / 15) * i }]} />
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e74c3c" />}
      >
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View>
            <Text style={styles.greeting}>{greeting} 👋</Text>
            <Text style={styles.userName}>{user.name || "User"}</Text>
          </View>
          <View style={styles.headerRight}>
            <Animated.View style={[styles.liveIndicator, { transform: [{ scale: pulseAnim }] }]} />
            <TouchableOpacity onPress={() => navigation.navigate("Profile")} style={styles.avatarWrapper}>
              <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name?.charAt(0)?.toUpperCase() || "U"}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Hero Section */}
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Futuristic hero card */}
          <View style={styles.heroCard}>
            <LinearGradient
              colors={["rgba(231,76,60,0.15)", "rgba(192,57,43,0.05)", "rgba(0,0,0,0)"]}
              style={styles.heroCardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            />
            {/* Corner accents */}
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />

            <Text style={styles.heroTag}>◈ NIGERIA'S PREMIER LOGISTICS</Text>
            <Text style={styles.heroTitle}>
              Delivering Your{"\n"}<Text style={styles.heroTitleAccent}>Dreams</Text>{"\n"}Across Nigeria
            </Text>
            <Text style={styles.heroSubtitle}>
              Real-time tracking • Instant notifications • 99% success rate
            </Text>

            <View style={styles.heroButtons}>
              <TouchableOpacity onPress={() => navigation.navigate("BookDelivery")} style={styles.heroBtn}>
                <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.heroBtnGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.heroBtnText}>📦 Send Package</Text>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate("Track")} style={styles.heroBtn2}>
                <Text style={styles.heroBtn2Text}>📍 Track</Text>
              </TouchableOpacity>
            </View>

            {/* Futuristic truck icon */}
            <View style={styles.heroTruck}>
              <Text style={styles.heroTruckEmoji}>🚚</Text>
            </View>
          </View>
        </Animated.View>

        {/* Stats Bar */}
        <Animated.View style={[styles.statsBar, { opacity: fadeAnim }]}>
          <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.statsBarGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            {[
              { value: "10K+", label: "Deliveries" },
              { value: "99%", label: "Success" },
              { value: "36", label: "States" },
              { value: "24/7", label: "Support" }
            ].map((stat, i) => (
              <View key={i} style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </LinearGradient>
        </Animated.View>

        {/* Order Stats */}
        <View style={styles.orderStatsRow}>
          {[
            { label: "Active", value: activeOrders.length, color: "#f39c12", icon: "🚚", glow: "#f39c1240" },
            { label: "Delivered", value: deliveredOrders.length, color: "#27ae60", icon: "✅", glow: "#27ae6040" },
            { label: "Total", value: orders.length, color: "#3498db", icon: "📦", glow: "#3498db40" }
          ].map((stat, i) => (
            <View key={i} style={[styles.orderStatCard, { borderColor: stat.color + "40", shadowColor: stat.color }]}>
              <LinearGradient colors={[stat.color + "20", "transparent"]} style={styles.orderStatGradient}>
                <Text style={styles.orderStatIcon}>{stat.icon}</Text>
                <Text style={[styles.orderStatValue, { color: stat.color }]}>{stat.value}</Text>
                <Text style={styles.orderStatLabel}>{stat.label}</Text>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* Services */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTag}>◈ OUR SERVICES</Text>
          <Text style={styles.sectionTitle}>What We Offer</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
          {[
            { icon: "⚡", title: "Express", subtitle: "1-5 hours", color: "#e74c3c" },
            { icon: "🚚", title: "Standard", subtitle: "Same day", color: "#3498db" },
            { icon: "📦", title: "Bulk", subtitle: "Best rates", color: "#27ae60" },
            { icon: "❄️", title: "Fragile", subtitle: "Extra care", color: "#9b59b6" },
            { icon: "🌍", title: "Nationwide", subtitle: "36 states", color: "#f39c12" },
          ].map((service, i) => (
            <TouchableOpacity key={i} onPress={() => navigation.navigate("BookDelivery")}>
              <View style={[styles.serviceCard, { borderColor: service.color + "50" }]}>
                <LinearGradient colors={[service.color + "20", "transparent"]} style={styles.serviceCardGradient}>
                  <View style={[styles.serviceIconBg, { backgroundColor: service.color + "20" }]}>
                    <Text style={styles.serviceIcon}>{service.icon}</Text>
                  </View>
                  <Text style={[styles.serviceTitle, { color: service.color }]}>{service.title}</Text>
                  <Text style={styles.serviceSubtitle}>{service.subtitle}</Text>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Recent Orders */}
        <View style={[styles.sectionHeader, { marginTop: 20 }]}>
          <Text style={styles.sectionTag}>◈ ACTIVITY</Text>
          <Text style={styles.sectionTitle}>Recent Orders</Text>
        </View>

        {loading ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>Loading...</Text>
          </View>
        ) : orders.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>No orders yet</Text>
            <Text style={styles.emptySubtitle}>Book your first delivery!</Text>
            <TouchableOpacity onPress={() => navigation.navigate("BookDelivery")} style={styles.emptyButton}>
              <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.emptyButtonGradient}>
                <Text style={styles.emptyButtonText}>Book Now →</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16 }}>
            {orders.map((order, i) => (
              <TouchableOpacity key={i} onPress={() => navigation.navigate("Track", { trackingNumber: order.trackingNumber })} style={[styles.orderCard, { borderColor: getStatusColor(order.status) + "40" }]}>
                <View style={[styles.orderAccent, { backgroundColor: getStatusColor(order.status) }]} />
                <View style={styles.orderContent}>
                  <View style={styles.orderLeft}>
                    <Text style={styles.orderTracking}>{order.trackingNumber}</Text>
                    <Text style={styles.orderTo} numberOfLines={1}>📍 {order.recipient?.address}</Text>
                    <Text style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <View style={[styles.orderBadge, { borderColor: getStatusColor(order.status) + "60", backgroundColor: getStatusColor(order.status) + "20" }]}>
                    <Text style={[styles.orderBadgeText, { color: getStatusColor(order.status) }]}>
                      {order.status.replace(/_/g, " ")}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* CTA */}
        <View style={styles.ctaSection}>
          <View style={styles.ctaCard}>
            <LinearGradient colors={["rgba(231,76,60,0.2)", "rgba(192,57,43,0.1)", "transparent"]} style={styles.ctaGradient}>
              <View style={styles.ctaCornerTL} />
              <View style={styles.ctaCornerBR} />
              <Text style={styles.ctaTitle}>Ready to Ship?</Text>
              <Text style={styles.ctaSubtitle}>Join thousands who trust STeX Logistics</Text>
              <TouchableOpacity onPress={() => navigation.navigate("BookDelivery")} style={styles.ctaButton}>
                <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.ctaButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
                  <Text style={styles.ctaButtonText}>🚚 Start Shipping Today</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050810" },

  // Background elements
  bgOrb1: { position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: 150, borderWidth: 1, borderColor: "rgba(231,76,60,0.1)", backgroundColor: "transparent" },
  bgOrb2: { position: "absolute", top: 200, left: -80, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(231,76,60,0.04)" },
  bgOrb3: { position: "absolute", top: height * 0.5, right: -60, width: 180, height: 180, borderRadius: 90, backgroundColor: "rgba(52,152,219,0.04)" },
  bgOrb4: { position: "absolute", bottom: 200, left: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(39,174,96,0.04)" },

  // Grid
  gridContainer: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  gridLine: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "rgba(255,255,255,0.02)" },
  gridLineH: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "rgba(255,255,255,0.02)" },

  // Header
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 24, paddingTop: 60, paddingBottom: 16 },
  greeting: { fontSize: 13, color: "rgba(255,255,255,0.4)", letterSpacing: 0.5 },
  userName: { fontSize: 26, fontWeight: "900", color: "white", letterSpacing: 0.5 },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  liveIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#27ae60" },
  avatarWrapper: { borderRadius: 25, overflow: "hidden" },
  avatar: { width: 50, height: 50, alignItems: "center", justifyContent: "center" },
  avatarText: { color: "white", fontSize: 20, fontWeight: "900" },

  // Hero
  heroSection: { paddingHorizontal: 16, marginBottom: 12 },
  heroCard: { borderRadius: 24, borderWidth: 1, borderColor: "rgba(231,76,60,0.2)", overflow: "hidden", padding: 28, position: "relative", backgroundColor: "rgba(255,255,255,0.02)" },
  heroCardGradient: { ...StyleSheet.absoluteFillObject },
  cornerTL: { position: "absolute", top: 0, left: 0, width: 20, height: 20, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "#e74c3c" },
  cornerTR: { position: "absolute", top: 0, right: 0, width: 20, height: 20, borderTopWidth: 2, borderRightWidth: 2, borderColor: "#e74c3c" },
  cornerBL: { position: "absolute", bottom: 0, left: 0, width: 20, height: 20, borderBottomWidth: 2, borderLeftWidth: 2, borderColor: "#e74c3c" },
  cornerBR: { position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "#e74c3c" },
  heroTag: { fontSize: 10, color: "#e74c3c", letterSpacing: 2, fontWeight: "700", marginBottom: 14 },
  heroTitle: { fontSize: 32, fontWeight: "900", color: "white", lineHeight: 40, marginBottom: 12 },
  heroTitleAccent: { color: "#e74c3c" },
  heroSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 20, marginBottom: 24 },
  heroButtons: { flexDirection: "row", gap: 12 },
  heroBtn: { borderRadius: 30, overflow: "hidden" },
  heroBtnGradient: { paddingHorizontal: 22, paddingVertical: 13 },
  heroBtnText: { color: "white", fontWeight: "800", fontSize: 14 },
  heroBtn2: { paddingHorizontal: 22, paddingVertical: 13, borderRadius: 30, borderWidth: 1, borderColor: "rgba(255,255,255,0.3)" },
  heroBtn2Text: { color: "white", fontWeight: "700", fontSize: 14 },
  heroTruck: { position: "absolute", right: 20, bottom: 20, opacity: 0.15 },
  heroTruckEmoji: { fontSize: 80 },

  // Stats bar
  statsBar: { marginHorizontal: 16, borderRadius: 14, overflow: "hidden", marginBottom: 16 },
  statsBarGradient: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 16 },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 16, fontWeight: "900", color: "white" },
  statLabel: { fontSize: 10, color: "rgba(255,255,255,0.7)", marginTop: 2 },

  // Order stats
  orderStatsRow: { flexDirection: "row", marginHorizontal: 16, gap: 10, marginBottom: 16 },
  orderStatCard: { flex: 1, borderRadius: 14, borderWidth: 1, overflow: "hidden", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 6 },
  orderStatGradient: { padding: 14, alignItems: "center" },
  orderStatIcon: { fontSize: 20, marginBottom: 4 },
  orderStatValue: { fontSize: 22, fontWeight: "900" },
  orderStatLabel: { fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 },

  // Section
  sectionHeader: { paddingHorizontal: 16, marginBottom: 14 },
  sectionTag: { fontSize: 10, color: "#e74c3c", letterSpacing: 2, fontWeight: "700", marginBottom: 6 },
  sectionTitle: { fontSize: 20, fontWeight: "900", color: "white" },

  // Services
  serviceCard: { borderRadius: 16, borderWidth: 1, overflow: "hidden", width: 120 },
  serviceCardGradient: { padding: 16, alignItems: "center" },
  serviceIconBg: { width: 48, height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", marginBottom: 10 },
  serviceIcon: { fontSize: 24 },
  serviceTitle: { fontSize: 13, fontWeight: "800", marginBottom: 4 },
  serviceSubtitle: { fontSize: 10, color: "rgba(255,255,255,0.4)", textAlign: "center" },

  // Empty
  emptyCard: { margin: 16, borderRadius: 20, padding: 40, alignItems: "center", backgroundColor: "rgba(255,255,255,0.03)", borderWidth: 1, borderColor: "rgba(255,255,255,0.06)" },
  emptyIcon: { fontSize: 50, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "white", marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 20 },
  emptyText: { color: "rgba(255,255,255,0.3)" },
  emptyButton: { borderRadius: 12, overflow: "hidden" },
  emptyButtonGradient: { paddingHorizontal: 24, paddingVertical: 12 },
  emptyButtonText: { color: "white", fontWeight: "700" },

  // Orders
  orderCard: { flexDirection: "row", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: 14, marginBottom: 10, overflow: "hidden", borderWidth: 1 },
  orderAccent: { width: 3 },
  orderContent: { flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 14 },
  orderLeft: { flex: 1 },
  orderTracking: { fontSize: 13, fontWeight: "800", color: "#3498db", marginBottom: 3 },
  orderTo: { fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 3 },
  orderDate: { fontSize: 11, color: "rgba(255,255,255,0.25)" },
  orderBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  orderBadgeText: { fontSize: 10, fontWeight: "700", textTransform: "capitalize" },

  // CTA
  ctaSection: { margin: 16, marginTop: 24 },
  ctaCard: { borderRadius: 24, borderWidth: 1, borderColor: "rgba(231,76,60,0.25)", overflow: "hidden" },
  ctaGradient: { padding: 28, alignItems: "center", position: "relative" },
  ctaCornerTL: { position: "absolute", top: 0, left: 0, width: 20, height: 20, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "#e74c3c" },
  ctaCornerBR: { position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "#e74c3c" },
  ctaTitle: { fontSize: 24, fontWeight: "900", color: "white", marginBottom: 8 },
  ctaSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 20 },
  ctaButton: { borderRadius: 30, overflow: "hidden" },
  ctaButtonGradient: { paddingHorizontal: 28, paddingVertical: 14 },
  ctaButtonText: { color: "white", fontWeight: "800", fontSize: 15 }
});

export default HomeScreen;