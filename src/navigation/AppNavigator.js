import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import BookDeliveryScreen from "../screens/BookDeliveryScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import OnboardingScreen from "../screens/OnboardingScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RegisterScreen from "../screens/RegisterScreen";
import SplashScreen from "../screens/SplashScreen";
import SupportScreen from "../screens/SupportScreen";
import TrackScreen from "../screens/TrackScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation }) => {
  const tabs = [
    { name: "Home", icon: "🏠", label: "Home" },
    { name: "BookDelivery", icon: "📦", label: "Book" },
    { name: "Track", icon: "📍", label: "Track" },
    { name: "Profile", icon: "👤", label: "Profile" },
  ];

  return (
    <View style={styles.tabBarContainer}>
      <LinearGradient colors={["rgba(5,8,16,0.98)", "rgba(13,17,23,0.99)"]} style={styles.tabBar}>
        <LinearGradient colors={["#e74c3c40", "transparent"]} style={styles.tabBarGlow} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} />
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;
          return (
            <TouchableOpacity key={tab.name} onPress={() => navigation.navigate(tab.name)} style={styles.tabItem} activeOpacity={0.7}>
              {isFocused && <LinearGradient colors={["#e74c3c20", "transparent"]} style={styles.activeBackground} />}
              {isFocused && <View style={styles.activeDot} />}
              <View style={[styles.iconContainer, isFocused && styles.iconContainerActive]}>
                {isFocused ? (
                  <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.activeIconBg}>
                    <Text style={styles.tabIcon}>{tab.icon}</Text>
                  </LinearGradient>
                ) : (
                  <Text style={[styles.tabIcon, styles.tabIconInactive]}>{tab.icon}</Text>
                )}
              </View>
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{tab.label}</Text>
              {isFocused && (
                <>
                  <View style={styles.cornerAccentTL} />
                  <View style={styles.cornerAccentTR} />
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </LinearGradient>
    </View>
  );
};

const MainTabs = () => (
  <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="BookDelivery" component={BookDeliveryScreen} />
    <Tab.Screen name="Track" component={TrackScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="Support" component={SupportScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBarContainer: { position: "absolute", bottom: 0, left: 0, right: 0 },
  tabBar: { flexDirection: "row", paddingBottom: 28, paddingTop: 12, paddingHorizontal: 8, borderTopWidth: 1, borderTopColor: "rgba(231,76,60,0.2)" },
  tabBarGlow: { position: "absolute", top: 0, left: 0, right: 0, height: 2 },
  tabItem: { flex: 1, alignItems: "center", justifyContent: "center", position: "relative", paddingVertical: 4, borderRadius: 12, overflow: "hidden" },
  activeBackground: { ...StyleSheet.absoluteFillObject, borderRadius: 12 },
  activeDot: { position: "absolute", top: 0, width: 20, height: 2, backgroundColor: "#e74c3c", borderRadius: 1 },
  iconContainer: { marginBottom: 4 },
  iconContainerActive: { shadowColor: "#e74c3c", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.5, shadowRadius: 8, elevation: 8 },
  activeIconBg: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  tabIcon: { fontSize: 22 },
  tabIconInactive: { opacity: 0.4 },
  tabLabel: { fontSize: 10, color: "rgba(255,255,255,0.3)", fontWeight: "600", letterSpacing: 0.5 },
  tabLabelActive: { color: "#e74c3c", fontWeight: "800" },
  cornerAccentTL: { position: "absolute", top: 2, left: 8, width: 8, height: 8, borderTopWidth: 1, borderLeftWidth: 1, borderColor: "#e74c3c50" },
  cornerAccentTR: { position: "absolute", top: 2, right: 8, width: 8, height: 8, borderTopWidth: 1, borderRightWidth: 1, borderColor: "#e74c3c50" },
});

export default AppNavigator;