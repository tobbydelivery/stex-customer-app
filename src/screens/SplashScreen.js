import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Dimensions, ImageBackground, StatusBar, StyleSheet, Text, View } from "react-native";
const { width, height } = Dimensions.get("window");

const SplashScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.spring(scaleAnim, { toValue: 1, friction: 4, tension: 40, useNativeDriver: true }),
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(rotateAnim, { toValue: 1, duration: 800, useNativeDriver: true })
      ]),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
      Animated.timing(taglineAnim, { toValue: 1, duration: 600, useNativeDriver: true })
    ]).start();

    setTimeout(() => {
      Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => {
        navigation.replace("Onboarding");
      });
    }, 3500);
  }, []);

  const spin = rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ["-30deg", "0deg"] });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{ uri: "https://i.ibb.co/XkVB3qCd/B13-E95-AC-6-A36-48-B8-8-E92-E7881-B1-FB33-A.png" }}
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <LinearGradient colors={["rgba(0,0,0,0.7)", "rgba(0,0,0,0.5)", "rgba(231,76,60,0.3)"]} style={StyleSheet.absoluteFill} />
      </ImageBackground>

      {/* Animated background circles */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />
      <View style={styles.bgCircle3} />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Logo */}
        <Animated.View style={[styles.logoContainer, { transform: [{ scale: scaleAnim }, { rotate: spin }] }]}>
          <LinearGradient colors={["#e74c3c", "#c0392b", "#922b21"]} style={styles.logoGradient}>
            <Text style={styles.logoEmoji}>🚚</Text>
          </LinearGradient>
        </Animated.View>

        {/* Brand */}
        <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
          <Text style={styles.brandName}>STeX Logistics</Text>
          <Text style={styles.brandTag}>SWIFT • TRUSTED • EXPRESS</Text>
        </Animated.View>

        {/* Tagline */}
        <Animated.View style={[styles.taglineContainer, { opacity: taglineAnim }]}>
          <Text style={styles.tagline}>Nigeria's Premier Delivery Service</Text>
          <View style={styles.dots}>
            {[0, 1, 2].map(i => (
              <View key={i} style={[styles.dot, i === 1 && styles.dotActive]} />
            ))}
          </View>
        </Animated.View>

        {/* Stats */}
        <Animated.View style={[styles.statsRow, { opacity: taglineAnim }]}>
          {[
            { value: "10K+", label: "Deliveries" },
            { value: "99%", label: "Success Rate" },
            { value: "36", label: "States" }
          ].map((stat, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>
      </Animated.View>

      {/* Bottom */}
      <Animated.Text style={[styles.version, { opacity: taglineAnim }]}>
        Powered by STeX Technologies v1.0.0
      </Animated.Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0d1117", alignItems: "center", justifyContent: "center" },
  bgCircle1: { position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: 150, backgroundColor: "rgba(231,76,60,0.08)" },
  bgCircle2: { position: "absolute", bottom: -80, left: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(52,152,219,0.06)" },
  bgCircle3: { position: "absolute", top: height / 2 - 50, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(39,174,96,0.05)" },
  content: { alignItems: "center", paddingHorizontal: 40 },
  logoContainer: { marginBottom: 24, shadowColor: "#e74c3c", shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.5, shadowRadius: 20, elevation: 15 },
  logoGradient: { width: 100, height: 100, borderRadius: 30, alignItems: "center", justifyContent: "center" },
  logoEmoji: { fontSize: 50 },
  brandName: { fontSize: 38, fontWeight: "900", color: "white", textAlign: "center", letterSpacing: 1 },
  brandTag: { fontSize: 12, color: "#e74c3c", letterSpacing: 4, textAlign: "center", marginTop: 8, fontWeight: "700" },
  taglineContainer: { marginTop: 24, alignItems: "center" },
  tagline: { fontSize: 14, color: "rgba(255,255,255,0.5)", textAlign: "center" },
  dots: { flexDirection: "row", gap: 8, marginTop: 16 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.2)" },
  dotActive: { width: 24, backgroundColor: "#e74c3c" },
  statsRow: { flexDirection: "row", marginTop: 40, gap: 30 },
  statItem: { alignItems: "center" },
  statValue: { fontSize: 22, fontWeight: "900", color: "#e74c3c" },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 4 },
  version: { position: "absolute", bottom: 40, fontSize: 11, color: "rgba(255,255,255,0.25)" }
});

export default SplashScreen;