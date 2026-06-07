import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useState } from "react";
import {
  Alert, ImageBackground, ScrollView, StatusBar,
  StyleSheet, Text, TouchableOpacity, View
} from "react-native";

const HERO_IMAGE = "https://i.ibb.co/XkVB3qCd/B13-E95-AC-6-A36-48-B8-8-E92-E7881-B1-FB33-A.png";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState({});

  useEffect(() => { loadUser(); }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
  };

  const handleLogout = async () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out", style: "destructive", onPress: async () => {
          await AsyncStorage.removeItem("token");
          await AsyncStorage.removeItem("user");
          navigation.replace("Login");
        }
      }
    ]);
  };

  const menuSections = [
    {
      title: "MY ACCOUNT",
      items: [
        { icon: "📦", label: "My Orders", color: "#3498db", onPress: () => {} },
        { icon: "📍", label: "Track Package", color: "#27ae60", onPress: () => navigation.navigate("Track") },
        { icon: "🚚", label: "Book Delivery", color: "#e74c3c", onPress: () => navigation.navigate("BookDelivery") },
      ]
    },
    {
      title: "SUPPORT & HELP",
      items: [
        { icon: "🔔", label: "Notifications", color: "#f39c12", onPress: () => {} },
        { icon: "❓", label: "Help & Support", color: "#9b59b6", onPress: () => navigation.navigate("Support") },
        { icon: "⭐", label: "Rate Our Service", color: "#f39c12", onPress: () => {} },
        { icon: "📋", label: "Terms & Privacy", color: "#95a5a6", onPress: () => {} },
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <ImageBackground source={{ uri: HERO_IMAGE }} style={StyleSheet.absoluteFill} resizeMode="cover">
        <LinearGradient colors={["rgba(5,8,16,0.93)", "rgba(13,17,23,0.9)", "rgba(17,24,39,0.95)"]} style={StyleSheet.absoluteFill} />
      </ImageBackground>
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Text style={styles.headerSubtitle}>Manage your account settings</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCardWrapper}>
          <LinearGradient colors={["#e74c3c", "#c0392b", "#922b21"]} style={styles.profileCard} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={styles.profileCircle1} />
            <View style={styles.profileCircle2} />
            <View style={styles.cornerTL} />
            <View style={styles.cornerBR} />
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name?.charAt(0)?.toUpperCase() || "U"}</Text>
              </View>
            </View>
            <Text style={styles.userName}>{user.name || "User"}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {user.phone && <Text style={styles.userPhone}>📞 {user.phone}</Text>}
            <View style={styles.verifiedBadge}>
              <View style={styles.verifiedDot} />
              <Text style={styles.verifiedText}>Verified Customer</Text>
            </View>
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
        </View>

        {/* Menu */}
        {menuSections.map((section, si) => (
          <View key={si} style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>{section.title}</Text>
            <View style={styles.menuCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity key={i} onPress={item.onPress}
                  style={[styles.menuItem, i < section.items.length - 1 && styles.menuItemBorder]}>
                  <LinearGradient colors={[item.color + "25", item.color + "10"]} style={styles.menuItemIcon}>
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
          <LinearGradient colors={["rgba(231,76,60,0.15)", "rgba(231,76,60,0.08)"]} style={styles.logoutGradient}>
            <Text style={styles.logoutText}>🚪 Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.version}>STeX Logistics v1.0.0 • Swift. Trusted. Express.</Text>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050810" },
  orb1: { position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(231,76,60,0.06)" },
  orb2: { position: "absolute", bottom: 100, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(52,152,219,0.05)" },
  header: { padding: 24, paddingTop: 64 },
  headerTitle: { fontSize: 28, fontWeight: "900", color: "white" },
  headerSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.35)", marginTop: 4 },
  profileCardWrapper: { marginHorizontal: 16, marginBottom: 20 },
  profileCard: { borderRadius: 24, padding: 28, alignItems: "center", overflow: "hidden", position: "relative" },
  profileCircle1: { position: "absolute", top: -40, right: -40, width: 150, height: 150, borderRadius: 75, backgroundColor: "rgba(255,255,255,0.08)" },
  profileCircle2: { position: "absolute", bottom: -30, left: -30, width: 120, height: 120, borderRadius: 60, backgroundColor: "rgba(255,255,255,0.06)" },
  cornerTL: { position: "absolute", top: 0, left: 0, width: 16, height: 16, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "rgba(255,255,255,0.3)" },
  cornerBR: { position: "absolute", bottom: 0, right: 0, width: 16, height: 16, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "rgba(255,255,255,0.3)" },
  avatarContainer: { marginBottom: 14 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center", borderWidth: 3, borderColor: "rgba(255,255,255,0.35)" },
  avatarText: { color: "white", fontSize: 32, fontWeight: "900" },
  userName: { fontSize: 22, fontWeight: "900", color: "white", marginBottom: 4 },
  userEmail: { fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 4 },
  userPhone: { fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 14 },
  verifiedBadge: { backgroundColor: "rgba(255,255,255,0.15)", paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20, marginBottom: 20, flexDirection: "row", alignItems: "center", gap: 6 },
  verifiedDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "#27ae60" },
  verifiedText: { color: "white", fontSize: 12, fontWeight: "700" },
  profileStats: { flexDirection: "row", gap: 32 },
  profileStat: { alignItems: "center" },
  profileStatValue: { fontSize: 18, fontWeight: "900", color: "white" },
  profileStatLabel: { fontSize: 10, color: "rgba(255,255,255,0.55)", marginTop: 2 },
  menuSection: { marginHorizontal: 16, marginBottom: 16 },
  menuSectionTitle: { fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: "700", letterSpacing: 1.5, marginBottom: 8, marginLeft: 4 },
  menuCard: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", overflow: "hidden" },
  menuItem: { flexDirection: "row", alignItems: "center", padding: 16, gap: 14 },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.05)" },
  menuItemIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  menuItemEmoji: { fontSize: 20 },
  menuItemLabel: { flex: 1, fontSize: 15, color: "rgba(255,255,255,0.8)", fontWeight: "500" },
  menuItemArrow: { fontSize: 22, color: "rgba(255,255,255,0.2)" },
  logoutButton: { margin: 16, borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "rgba(231,76,60,0.3)" },
  logoutGradient: { padding: 16, alignItems: "center" },
  logoutText: { color: "#e74c3c", fontSize: 15, fontWeight: "700" },
  version: { textAlign: "center", color: "rgba(255,255,255,0.15)", fontSize: 11, marginBottom: 10 }
});

export default ProfileScreen;