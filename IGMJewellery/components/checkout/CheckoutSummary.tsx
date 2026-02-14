import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SPACING } from "../../constants/theme";

import { OrderDetails } from "@/interfaces/order-details.interface";
import { SafeAreaView } from "react-native-safe-area-context";
import { HapticButton } from "../basic components/hapticButton";
import { OrderItemCard } from "./OrderItemCard";
import { PriceBreakdown } from "./PriceBreakdown";

interface CheckoutSummaryProps {
  order: OrderDetails;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <HapticButton
          style={styles.header}
          onPress={() => setIsExpanded(!isExpanded)}
          activeOpacity={0.7}
        >
          <View style={styles.headerLeft}>
            <Text style={styles.headerText}>
              {isExpanded ? "Hide Order Summary" : "Show Order Summary"}
            </Text>
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={20}
              color="#000"
            />
          </View>
          <Text style={styles.itemSummary}>
            {order.items.length} {order.items.length === 1 ? "item" : "items"} ₹
            {order.total.toLocaleString()}
          </Text>
        </HapticButton>

        {isExpanded && (
          <View style={styles.content}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.itemsScroll}
            >
              {order.items.map((item) => (
                <OrderItemCard
                  key={item.product.id}
                  item={item}
                  style={styles.itemCardOverride}
                />
              ))}
            </ScrollView>

            <PriceBreakdown
              subtotal={order.subtotal}
              savings={order.savings}
              platformFee={order.platformFee}
              total={order.total}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: SPACING.m,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#000",
    marginRight: 4,
  },
  itemSummary: {
    fontSize: 14,
    color: "#000",
    fontWeight: "500",
  },
  content: {
    padding: SPACING.m,
    paddingTop: 0,
  },
  itemsScroll: {
    marginBottom: SPACING.m,
  },
  itemCardOverride: {
    width: 280,
    marginRight: 12,
  },
});
