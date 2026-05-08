import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({});

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  };

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout", style: "destructive", onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          navigation.replace("Login");
        }
      }
    ]);
  };

  const menuSections = [
    {
      title: "My Account",
      items: [
        { icon: "📦", label: "My Orders", color: "#3498db", onPress: () => {} },
        { icon: "📍", label: "Track Package", color: "#27ae60", onPress: () => navigation.navigate("Track") },
        { icon: "🚚", label: "Book Delivery", color: "#e74c3c", onPress: () => navigation.navigate("BookDelivery") },
      ]
    },
    {
      title: "Support",
      items: [
        { icon: "🔔", label: "Notifications", color: "#f39c12", onPress: () => {} },
        { icon: "❓", label: "Help & Support", onPress: () => navigation.navigate("Support") },
        { icon: "⭐", label: "Rate Our Service", color: "#f39c12", onPress: () => {} },
        { icon: "📋", label: "Terms & Privacy", color: "#95a5a6", onPress: () => {} },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0d1117", "#1a252f", "#2c3e50"]} style={StyleSheet.absoluteFill} />
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* Profile Card */}
        <LinearGradient colors={["#e74c3c", "#c0392b", "#922b21"]} style={styles.profileCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <View style={styles.profileCircle1} />
          <View style={styles.profileCircle2} />
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name?.charAt(0)?.toUpperCase() || "U"}</Text>
            </View>
          </View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          {user.phone && <Text style={styles.userPhone}>📞 {user.phone}</Text>}
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✅ Verified Customer</Text>
          </View>

          {/* Stats */}
          <View style={styles.profileStats}>
            {[
              { value: "0", label: "Orders" },
              { value: "0", label: "Delivered" },
              { value: "⭐ 5.0", label: "Rating" }
            ].map((stat, i) => (
              <View key={i} style={styles.profileStat}>
                <Text style={styles.profileStatValue}>{stat.value}</Text>
                <Text style={styles.profileStatLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </LinearGradient>

        {/* Menu Sections */}
        {menuSections.map((section, si) => (
          <View key={si} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity key={i} onPress={item.onPress} style={[styles.menuItem, i < section.items.length - 1 && styles.menuItemBorder]}>
                  <LinearGradient colors={[item.color + "30", item.color + "15"]} style={styles.menuItemIcon}>
                    <Text style={styles.menuItemEmoji}>{item.icon}</Text>
                  </LinearGradient>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                  <Text style={styles.menuItemArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <LinearGradient colors={["#e74c3c20", "#e74c3c10"]} style={styles.logoutGradient}>
            <Text style={styles.logoutText}>🚪 Logout</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.version}>STeX Logistics v1.0.0 • Powered by STeX Technologies</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117" },
  bgCircle1: { position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(231,76,60,0.06)" },
  bgCircle2: { position: "absolute", bottom: 100, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(52,152,219,0.05)" },
  header: { padding: 24, paddingTop: 56 },
  headerTitle: { fontSize: 28, fontWeight: "900", color: "white" },
  profileCard: { margin: 16, borderRadius: 24, padding: 28, alignItems: "center", overflow: "hidden", position: "relative" },
  profileCircle1: { position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.08)" },
  profileCircle2: { position: "absolute", bottom: -30, left: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.06)" },
  avatarContainer: { marginBottom: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.25)", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "rgba(255,255,255,0.4)" },
  avatarText: { color: "white", fontSize: 32, fontWeight: "900" },
  userName: { fontSize: 22, fontWeight: "900", color: "white", marginBottom: 4 },
  userEmail: { fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 4 },
  userPhone: { fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 14 },
  verifiedBadge: { backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 20 },
  verifiedText: { color: "white", fontSize: 13, fontWeight: "700" },
  profileStats: { flexDirection: "row", gap: 30 },
  profileStat: { alignItems: "center" },
  profileStatValue: { fontSize: 18, fontWeight: "900", color: "white" },
  profileStatLabel: { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  menuSection: { marginHorizontal: 16, marginBottom: 16 },
  menuSectionTitle: { fontSize: 13, color: "rgba(255,255,255,0.4)", fontWeight: "700", letterSpacing: 1, marginBottom: 8, marginLeft: 4 },
  menuCard: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  menuItemIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  menuItemEmoji: { fontSize: 20 },
  menuItemLabel: { flex: 1, fontSize: 15, color: "white", fontWeight: "500" },
  menuItemArrow: { fontSize: 20, color: "rgba(255,255,255,0.2)" },
  logoutButton: { margin: 16, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "rgba(231,76,60,0.3)" },
  logoutGradient: { padding: 16, alignItems: "center" },
  logoutText: { color: "#e74c3c", fontSize: 16, fontWeight: "700" },
  version: { textAlign: "center", color: "rgba(255,255,255,0.2)", fontSize: 11, marginBottom: 10 }
});

export default ProfileScreen;