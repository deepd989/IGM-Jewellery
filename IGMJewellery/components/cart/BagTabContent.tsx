import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { CartItem } from "./CartItem";
import { OrderSummary } from "./OrderSummary";

import { Product } from "@/interfaces/product.interface";
import { useRouter } from "expo-router";
import { useDismissFreebieMutation } from "../../store/apis/cart";
import { HapticButton } from "../basic components/hapticButton";

interface BagTabContentProps {
  cart: { product: Product; quantity: number }[];
  updateQuantity: (id: string, delta: number) => void;
  onRemove: (product: Product) => void;
  giftAddons: any[];
  toggleGiftAddon: (id: string) => void;
  calculateTotals: () => { subtotal: number; savings: number; addons: number };
  freebie: {
    title: string;
    subtitle: string;
    isVisible: boolean;
  } | null;
}

export const BagTabContent: React.FC<BagTabContentProps> = ({
  cart,
  updateQuantity,
  onRemove,
  giftAddons,
  toggleGiftAddon,
  calculateTotals,
  freebie,
}) => {
  const router = useRouter();
  const totals = calculateTotals();
  const [dismissFreebie] = useDismissFreebieMutation();
  console.log("Rendering BagTabContent with freebie:", freebie);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.banner}>
        <Ionicons
          name="return-up-back"
          size={16}
          color={COLORS.textSecondary}
        />
        <Text style={styles.bannerText}>
          15 day return & money back available on all online orders
        </Text>
      </View>

      {freebie?.isVisible && (
        <View style={styles.freebieContainer}>
          <View style={styles.freebieIconBox}>
            <Ionicons name="sparkles" size={24} color="#E0E0E0" />
          </View>

          <View style={styles.freebieInfo}>
            <Text style={styles.freebieTag}>Freebie</Text>
            <Text style={styles.freebieTitle}>{freebie.title}</Text>
            <Text style={styles.freebieSubtitle}>{freebie.subtitle}</Text>
          </View>

          <HapticButton onPress={() => dismissFreebie()}>
            <Ionicons name="close" size={20} color={COLORS.text} />
          </HapticButton>
        </View>
      )}

      {cart.map((item) => (
        <CartItem
          key={item.product.id}
          product={item.product}
          quantity={item.quantity}
          onIncrement={() => updateQuantity(item.product.id, 1)}
          onDecrement={() => updateQuantity(item.product.id, -1)}
          onRemove={() => onRemove(item.product)}
        />
      ))}

      <Text style={styles.sectionHeader}>OFFERS & BENEFITS</Text>
      <HapticButton
        style={styles.couponRow}
        onPress={() => router.navigate("/coupons")}
      >
        <View style={styles.couponIcon}>
          <Ionicons name="pricetag-outline" size={24} color={COLORS.text} />
        </View>
        <View style={styles.couponTextCol}>
          <Text style={styles.couponTitle}>Apply coupon</Text>
          <Text style={styles.couponSubtitle}>
            Save extra with coupons - check now!
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
      </HapticButton>

      <Text style={styles.sectionHeader}>GIFTING ADD-ONS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.giftScroll}
      >
        {giftAddons.map((item) => (
          <HapticButton
            key={item.id}
            style={styles.giftCard}
            onPress={() => toggleGiftAddon(item.id)}
          >
            <View style={styles.giftImagePlaceholder}>
              {item.image && (
                <Image
                  source={{ uri: item.image }}
                  style={styles.giftImage}
                  resizeMode="cover"
                />
              )}
              <View
                style={[
                  styles.checkCircle,
                  item.isChecked && styles.checkCircleActive,
                ]}
              >
                {item.isChecked && (
                  <Ionicons name="checkmark" size={12} color="#FFF" />
                )}
              </View>
            </View>
            <Text style={styles.giftTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <Text style={styles.giftPrice}>₹{item.price}</Text>
          </HapticButton>
        ))}
      </ScrollView>

      <OrderSummary
        subtotal={totals.subtotal + totals.addons}
        savings={totals.savings}
        platformFee={220}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: { padding: SPACING.m, paddingBottom: 100 },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    padding: 12,
    borderRadius: 8,
    marginBottom: SPACING.m,
    justifyContent: "center",
  },
  bannerText: { fontSize: 10, color: COLORS.textSecondary, marginLeft: 8 },
  freebieContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 8,
    padding: SPACING.m,
    marginBottom: SPACING.m,
  },
  freebieIconBox: {
    width: 50,
    height: 50,
    backgroundColor: "#F9F9F9",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.m,
  },
  freebieInfo: { flex: 1 },
  freebieTag: { fontSize: 11, color: COLORS.textSecondary },
  freebieTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  freebieSubtitle: { fontSize: 11, color: COLORS.textSecondary },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: SPACING.l,
    marginBottom: SPACING.m,
    color: COLORS.text,
  },
  couponRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 8,
    padding: SPACING.m,
  },
  couponIcon: {
    width: 48,
    height: 48,
    backgroundColor: "#F9F9F9",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.m,
  },
  couponTextCol: { flex: 1 },
  couponTitle: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  couponSubtitle: { fontSize: 12, color: COLORS.textSecondary },
  giftScroll: { flexDirection: "row", marginBottom: SPACING.m },
  giftCard: { width: 100, marginRight: 12 },
  giftImagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: "#F5F5F5",
    overflow: "hidden",
    borderRadius: 8,
    marginBottom: 8,
    position: "relative",
  },
  checkCircle: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },
  checkCircleActive: { backgroundColor: "#053844", borderColor: "#053844" },
  giftTitle: { fontSize: 11, color: COLORS.textSecondary, marginBottom: 4 },
  giftImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  giftPrice: { fontSize: 13, fontWeight: "700", color: COLORS.text },
});
