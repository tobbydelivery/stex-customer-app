import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: 1,
    emoji: "🚚",
    title: "Fast & Reliable\nDelivery",
    subtitle: "Send packages anywhere in Nigeria with real-time tracking and instant notifications",
    color: ["#e74c3c", "#c0392b"],
    bg: ["#050810", "#1a0a0a"]
  },
  {
    id: 2,
    emoji: "📍",
    title: "Live Tracking\nAnywhere",
    subtitle: "Watch your delivery in real-time on the map. Know exactly where your package is at all times",
    color: ["#3498db", "#2980b9"],
    bg: ["#050810", "#0a0d1a"]
  },
  {
    id: 3,
    emoji: "⚡",
    title: "Express\nDelivery",
    subtitle: "Same day delivery within Lagos. Express delivery nationwide across all 36 states",
    color: ["#27ae60", "#1e8449"],
    bg: ["#050810", "#0a1a0d"]
  },
  {
    id: 4,
    emoji: "🔒",
    title: "Safe &\nSecure",
    subtitle: "Your packages are insured and handled with care by our verified professional agents",
    color: ["#9b59b6", "#8e44ad"],
    bg: ["#050810", "#120a1a"]
  }
];

const OnboardingScreen = ({ navigation }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goToNext = () => {
    if (currentSlide < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (currentSlide + 1), animated: true });
      setCurrentSlide(currentSlide + 1);
    } else {
      navigation.replace("Login");
    }
  };

  const skip = () => navigation.replace("Login");

  const handleScroll = (e) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentSlide(index);
  };

  const slide = slides[currentSlide];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient colors={slide.bg} style={StyleSheet.absoluteFill} />

      {/* Decorative orbs */}
      <View style={[styles.orb1, { backgroundColor: slide.color[0] + "15" }]} />
      <View style={[styles.orb2, { backgroundColor: slide.color[1] + "10" }]} />

      {/* Grid */}
      {[...Array(6)].map((_, i) => (
        <View key={i} style={[styles.gridLine, { left: (width / 6) * i }]} />
      ))}

      {/* Skip button */}
      <TouchableOpacity onPress={skip} style={styles.skipButton}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {slides.map((s, i) => (
          <View key={i} style={styles.slide}>
            {/* Emoji circle */}
            <View style={styles.emojiContainer}>
              <LinearGradient colors={s.color} style={styles.emojiCircle}>
                <Text style={styles.emoji}>{s.emoji}</Text>
              </LinearGradient>
              {/* Glow rings */}
              <View style={[styles.ring1, { borderColor: s.color[0] + "30" }]} />
              <View style={[styles.ring2, { borderColor: s.color[0] + "15" }]} />
            </View>

            {/* Content card */}
            <View style={styles.contentCard}>
              <View style={[styles.cardCornerTL, { borderColor: s.color[0] }]} />
              <View style={[styles.cardCornerTR, { borderColor: s.color[0] }]} />
              <View style={[styles.cardCornerBL, { borderColor: s.color[0] }]} />
              <View style={[styles.cardCornerBR, { borderColor: s.color[0] }]} />

              <Text style={styles.slideNumber}>0{s.id}/04</Text>
              <Text style={styles.slideTitle}>{s.title}</Text>
              <Text style={styles.slideSubtitle}>{s.subtitle}</Text>

              {/* Feature bullets */}
              <View style={styles.bullets}>
                {i === 0 && ["Same day delivery", "Real-time tracking", "SMS notifications"].map((b, j) => (
                  <View key={j} style={styles.bullet}>
                    <View style={[styles.bulletDot, { backgroundColor: s.color[0] }]} />
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
                {i === 1 && ["Live GPS tracking", "Agent location updates", "Delivery ETA"].map((b, j) => (
                  <View key={j} style={styles.bullet}>
                    <View style={[styles.bulletDot, { backgroundColor: s.color[0] }]} />
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
                {i === 2 && ["1-5 hours express", "36 states covered", "Affordable rates"].map((b, j) => (
                  <View key={j} style={styles.bullet}>
                    <View style={[styles.bulletDot, { backgroundColor: s.color[0] }]} />
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
                {i === 3 && ["Verified agents", "Package insurance", "24/7 support"].map((b, j) => (
                  <View key={j} style={styles.bullet}>
                    <View style={[styles.bulletDot, { backgroundColor: s.color[0] }]} />
                    <Text style={styles.bulletText}>{b}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom controls */}
      <View style={styles.bottomControls}>
        {/* Dots */}
        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View key={i} style={[styles.dot, i === currentSlide && [styles.dotActive, { backgroundColor: slide.color[0] }]]} />
          ))}
        </View>

        {/* Next button */}
        <TouchableOpacity onPress={goToNext} style={styles.nextButton}>
          <LinearGradient colors={slide.color} style={styles.nextGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
            <Text style={styles.nextText}>
              {currentSlide === slides.length - 1 ? "Get Started →" : "Next →"}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050810" },
  orb1: { position: "absolute", top: -100, right: -100, width: 300, height: 300, borderRadius: 150 },
  orb2: { position: "absolute", bottom: 0, left: -80, width: 250, height: 250, borderRadius: 125 },
  gridLine: { position: "absolute", top: 0, bottom: 0, width: 1, backgroundColor: "rgba(255,255,255,0.02)" },
  skipButton: { position: "absolute", top: 56, right: 24, zIndex: 10, padding: 8 },
  skipText: { color: "rgba(255,255,255,0.4)", fontSize: 14, fontWeight: "600" },
  scrollView: { flex: 1 },
  slide: { width, flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 24, paddingTop: 100 },
  emojiContainer: { alignItems: "center", justifyContent: "center", marginBottom: 40, position: "relative" },
  emojiCircle: { width: 120, height: 120, borderRadius: 35, alignItems: "center", justifyContent: "center", shadowOffset: { width: 0, height: 16 }, shadowOpacity: 0.5, shadowRadius: 24, elevation: 16 },
  emoji: { fontSize: 56 },
  ring1: { position: "absolute", width: 160, height: 160, borderRadius: 50, borderWidth: 1 },
  ring2: { position: "absolute", width: 200, height: 200, borderRadius: 60, borderWidth: 1 },
  contentCard: { width: "100%", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 24, padding: 28, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", position: "relative" },
  cardCornerTL: { position: "absolute", top: 0, left: 0, width: 20, height: 20, borderTopWidth: 2, borderLeftWidth: 2 },
  cardCornerTR: { position: "absolute", top: 0, right: 0, width: 20, height: 20, borderTopWidth: 2, borderRightWidth: 2 },
  cardCornerBL: { position: "absolute", bottom: 0, left: 0, width: 20, height: 20, borderBottomWidth: 2, borderLeftWidth: 2 },
  cardCornerBR: { position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderBottomWidth: 2, borderRightWidth: 2 },
  slideNumber: { fontSize: 11, color: "rgba(255,255,255,0.3)", fontWeight: "700", letterSpacing: 2, marginBottom: 12 },
  slideTitle: { fontSize: 30, fontWeight: "900", color: "white", lineHeight: 36, marginBottom: 14 },
  slideSubtitle: { fontSize: 14, color: "rgba(255,255,255,0.5)", lineHeight: 22, marginBottom: 20 },
  bullets: { gap: 8 },
  bullet: { flexDirection: "row", alignItems: "center", gap: 10 },
  bulletDot: { width: 6, height: 6, borderRadius: 3 },
  bulletText: { color: "rgba(255,255,255,0.6)", fontSize: 13 },
  bottomControls: { paddingHorizontal: 24, paddingBottom: 48, gap: 20 },
  dots: { flexDirection: "row", justifyContent: "center", gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "rgba(255,255,255,0.2)" },
  dotActive: { width: 28, borderRadius: 4 },
  nextButton: { borderRadius: 16, overflow: "hidden" },
  nextGradient: { padding: 18, alignItems: "center" },
  nextText: { color: "white", fontSize: 16, fontWeight: "800", letterSpacing: 0.5 }
});

export default OnboardingScreen;