import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    Linking,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

const faqs = [
  { q: "How do I track my order?", a: "Go to the Track tab and enter your tracking number. You can also tap 'Track' on any order in your dashboard." },
  { q: "How long does delivery take?", a: "Express delivery: 1-5 hours within Lagos. Standard delivery: Same day within Lagos, 1-3 days nationwide." },
  { q: "What areas do you cover?", a: "We cover all 36 states in Nigeria. Express delivery is available in Lagos, Abuja, and Port Harcourt." },
  { q: "How do I pay for delivery?", a: "We accept payment via Paystack (card, bank transfer, USSD). Payment is made when booking your delivery." },
  { q: "What if my package is damaged?", a: "All packages are insured. Contact support immediately with photos of the damage and we will resolve it within 24 hours." },
  { q: "Can I cancel an order?", a: "You can cancel an order before it is picked up. Contact support or use the cancel option in your order details." },
  { q: "How do I become a delivery agent?", a: "Contact us at agent@stexlogistics.com with your details. We will review your application within 48 hours." },
  { q: "What items can I send?", a: "We deliver documents, electronics, clothing, food, and most items. We do not deliver dangerous goods, weapons, or illegal items." },
];

const SupportScreen = ({ navigation }) => {
  const [expandedFaq, setExpandedFaq] = useState(null);

  const contactOptions = [
    { icon: "📧", label: "Email Support", value: "support@stexlogistics.com", action: () => Linking.openURL("mailto:support@stexlogistics.com") },
    { icon: "💬", label: "WhatsApp", value: "+234 800 000 0000", action: () => Linking.openURL("whatsapp://send?phone=2348000000000&text=Hello STeX Support") },
    { icon: "📞", label: "Call Us", value: "+234 800 000 0000", action: () => Linking.openURL("tel:+2348000000000") },
    { icon: "🌐", label: "Visit Website", value: "stexlogistics.com", action: () => Linking.openURL("https://gilded-cajeta-16c5fb.netlify.app") },
  ];

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
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>

        {/* Hero */}
        <View style={styles.heroCard}>
          <View style={styles.heroCornerTL} />
          <View style={styles.heroCornerBR} />
          <Text style={styles.heroEmoji}>🎧</Text>
          <Text style={styles.heroTitle}>How can we help?</Text>
          <Text style={styles.heroSubtitle}>Our support team is available 24/7 to assist you</Text>
        </View>

        {/* Contact Options */}
        <Text style={styles.sectionTag}>◈ CONTACT US</Text>
        <Text style={styles.sectionTitle}>Reach Out</Text>

        <View style={styles.contactGrid}>
          {contactOptions.map((option, i) => (
            <TouchableOpacity key={i} onPress={option.action} style={styles.contactCard}>
              <LinearGradient colors={["rgba(231,76,60,0.15)", "rgba(231,76,60,0.05)"]} style={styles.contactGradient}>
                <View style={styles.contactCornerTL} />
                <View style={styles.contactCornerBR} />
                <Text style={styles.contactIcon}>{option.icon}</Text>
                <Text style={styles.contactLabel}>{option.label}</Text>
                <Text style={styles.contactValue} numberOfLines={1}>{option.value}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </View>

        {/* Business Hours */}
        <View style={styles.hoursCard}>
          <Text style={styles.hoursTitle}>⏰ Business Hours</Text>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Monday - Friday</Text>
            <Text style={styles.hoursTime}>8:00 AM - 8:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Saturday</Text>
            <Text style={styles.hoursTime}>9:00 AM - 6:00 PM</Text>
          </View>
          <View style={styles.hoursRow}>
            <Text style={styles.hoursDay}>Sunday</Text>
            <Text style={styles.hoursTime}>10:00 AM - 4:00 PM</Text>
          </View>
          <View style={[styles.hoursRow, { borderBottomWidth: 0 }]}>
            <Text style={styles.hoursDay}>Emergency</Text>
            <Text style={[styles.hoursTime, { color: "#27ae60" }]}>24/7 Available</Text>
          </View>
        </View>

        {/* FAQ */}
        <Text style={[styles.sectionTag, { marginTop: 20 }]}>◈ FAQ</Text>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

        {faqs.map((faq, i) => (
          <TouchableOpacity key={i} onPress={() => setExpandedFaq(expandedFaq === i ? null : i)} style={styles.faqCard}>
            <View style={styles.faqHeader}>
              <Text style={styles.faqQuestion} numberOfLines={expandedFaq === i ? 0 : 1}>{faq.q}</Text>
              <Text style={[styles.faqArrow, { color: expandedFaq === i ? "#e74c3c" : "rgba(255,255,255,0.3)" }]}>
                {expandedFaq === i ? "▲" : "▼"}
              </Text>
            </View>
            {expandedFaq === i && (
              <Text style={styles.faqAnswer}>{faq.a}</Text>
            )}
          </TouchableOpacity>
        ))}

        {/* Company Info */}
        <View style={styles.companyCard}>
          <LinearGradient colors={["#e74c3c", "#c0392b"]} style={styles.companyGradient}>
            <View style={styles.companyCornerTL} />
            <View style={styles.companyCornerBR} />
            <Text style={styles.companyEmoji}>🚚</Text>
            <Text style={styles.companyName}>STeX Logistics</Text>
            <Text style={styles.companyTag}>SWIFT • TRUSTED • EXPRESS</Text>
            <Text style={styles.companyDesc}>Nigeria's Premier Delivery Service</Text>
            <View style={styles.companyStats}>
              {[{ v: "10K+", l: "Deliveries" }, { v: "99%", l: "Success" }, { v: "36", l: "States" }].map((s, i) => (
                <View key={i} style={styles.companyStat}>
                  <Text style={styles.companyStatValue}>{s.v}</Text>
                  <Text style={styles.companyStatLabel}>{s.l}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050810" },
  orb1: { position: "absolute", top: -80, right: -80, width: 250, height: 250, borderRadius: 125, backgroundColor: "rgba(231,76,60,0.06)", borderWidth: 1, borderColor: "rgba(231,76,60,0.1)" },
  orb2: { position: "absolute", bottom: 100, left: -60, width: 200, height: 200, borderRadius: 100, backgroundColor: "rgba(52,152,219,0.04)" },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 20, paddingTop: 56 },
  backBtn: { padding: 8 },
  backText: { color: "#e74c3c", fontSize: 15, fontWeight: "600" },
  headerTitle: { fontSize: 18, fontWeight: "800", color: "white" },
  heroCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 24, padding: 28, marginBottom: 24, borderWidth: 1, borderColor: "rgba(231,76,60,0.2)", alignItems: "center", position: "relative" },
  heroCornerTL: { position: "absolute", top: 0, left: 0, width: 20, height: 20, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "#e74c3c" },
  heroCornerBR: { position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "#e74c3c" },
  heroEmoji: { fontSize: 50, marginBottom: 14 },
  heroTitle: { fontSize: 22, fontWeight: "900", color: "white", marginBottom: 8 },
  heroSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.5)", textAlign: "center" },
  sectionTag: { fontSize: 10, color: "#e74c3c", letterSpacing: 2, fontWeight: "700", marginBottom: 6 },
  sectionTitle: { fontSize: 20, fontWeight: "900", color: "white", marginBottom: 14 },
  contactGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 16 },
  contactCard: { width: "47%", borderRadius: 16, overflow: "hidden", borderWidth: 1, borderColor: "rgba(231,76,60,0.2)" },
  contactGradient: { padding: 18, position: "relative" },
  contactCornerTL: { position: "absolute", top: 0, left: 0, width: 12, height: 12, borderTopWidth: 1, borderLeftWidth: 1, borderColor: "#e74c3c" },
  contactCornerBR: { position: "absolute", bottom: 0, right: 0, width: 12, height: 12, borderBottomWidth: 1, borderRightWidth: 1, borderColor: "#e74c3c" },
  contactIcon: { fontSize: 28, marginBottom: 10 },
  contactLabel: { fontSize: 13, fontWeight: "800", color: "white", marginBottom: 4 },
  contactValue: { fontSize: 11, color: "rgba(255,255,255,0.5)" },
  hoursCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 20, marginBottom: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  hoursTitle: { fontSize: 15, fontWeight: "800", color: "white", marginBottom: 14 },
  hoursRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(255,255,255,0.06)" },
  hoursDay: { color: "rgba(255,255,255,0.5)", fontSize: 13 },
  hoursTime: { color: "white", fontWeight: "600", fontSize: 13 },
  faqCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 14, padding: 16, marginBottom: 8, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  faqHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  faqQuestion: { flex: 1, fontSize: 14, fontWeight: "600", color: "white", marginRight: 10 },
  faqArrow: { fontSize: 12 },
  faqAnswer: { fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 20, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.06)" },
  companyCard: { borderRadius: 24, overflow: "hidden", marginTop: 20 },
  companyGradient: { padding: 28, alignItems: "center", position: "relative" },
  companyCornerTL: { position: "absolute", top: 0, left: 0, width: 20, height: 20, borderTopWidth: 2, borderLeftWidth: 2, borderColor: "rgba(255,255,255,0.3)" },
  companyCornerBR: { position: "absolute", bottom: 0, right: 0, width: 20, height: 20, borderBottomWidth: 2, borderRightWidth: 2, borderColor: "rgba(255,255,255,0.3)" },
  companyEmoji: { fontSize: 40, marginBottom: 10 },
  companyName: { fontSize: 22, fontWeight: "900", color: "white", marginBottom: 4 },
  companyTag: { fontSize: 10, color: "rgba(255,255,255,0.7)", letterSpacing: 3, marginBottom: 8 },
  companyDesc: { fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 20 },
  companyStats: { flexDirection: "row", gap: 30 },
  companyStat: { alignItems: "center" },
  companyStatValue: { fontSize: 20, fontWeight: "900", color: "white" },
  companyStatLabel: { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 }
});

export default SupportScreen;