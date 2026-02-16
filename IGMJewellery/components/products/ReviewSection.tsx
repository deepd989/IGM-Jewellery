import { Product } from "@/interfaces/product.interface";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import { HapticButton } from "../basic components/hapticButton";

interface ReviewSectionProps {
  product: Product;
}

const MOCK_REVIEWS = [
  {
    id: "1",
    name: "Vibhu Sharma",
    rating: 4,
    date: "21 Jan, 2025",
    comment:
      "Beautiful Product. Delivery was seamless. I will recommend it to my friends. Pick Up attempt failed. Set up a new request",
  },
  {
    id: "2",
    name: "Anjali Gupta",
    rating: 5,
    date: "20 Jan, 2025",
    comment: "Absolutely love the design! Looks exactly like the picture.",
  },
];

const FILTER_TAGS = ["All Reviews", "Latest", "Above 3 ★", "5 ★"];

const ReviewItem = ({ item }: { item: (typeof MOCK_REVIEWS)[0] }) => (
  <View style={styles.reviewItem}>
    <View style={styles.reviewHeader}>
      <View style={styles.ratingBadgeSmall}>
        <Text style={styles.ratingBadgeText}>{item.rating}</Text>
        <Ionicons
          name="star"
          size={10}
          color="#FFF"
          style={{ marginLeft: 2 }}
        />
      </View>
      <Text style={styles.reviewerName}>{item.name}</Text>
    </View>
    <Text style={styles.reviewComment}>{item.comment}</Text>
    <View style={styles.reviewFooter}>
      <Text style={styles.reviewDate}>{item.date}</Text>
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Ionicons
            key={i}
            name={i <= item.rating ? "star" : "star-outline"}
            size={14}
            color={i <= item.rating ? COLORS.textSecondary : "#E0E0E0"}
          />
        ))}
      </View>
    </View>

    {/* Placeholder for uploaded photos */}
    {/* <View style={styles.photoRow}>
      {[1, 2, 3, 4].map((i) => (
        <View key={i} style={styles.photoPlaceholder} />
      ))}
    </View> */}
  </View>
);

export const ReviewSection: React.FC<ReviewSectionProps> = ({ product }) => {
  return (
    <View style={styles.container}>
      {/* Seen On You Video Placeholder */}
      <View style={styles.seenOnYouContainer}>
        <Text style={styles.sectionHeader}>SEEN ON YOU!</Text>
        <View style={styles.videoBox}>
          <View style={styles.playIconContainer}>
            <Ionicons name="play" size={20} color={COLORS.text} />
          </View>
          <HapticButton style={styles.expandIcon}>
            <Ionicons name="expand" size={16} color={COLORS.text} />
          </HapticButton>
        </View>
      </View>

      <View style={styles.separator} />

      <Text style={[styles.sectionHeader, { marginBottom: SPACING.s }]}>
        CUSTOMER REVIEWS
      </Text>
      <Text style={styles.sectionSubHeader}>
        Celebrate every day in style with the subtle grace of these drop
        earrings crafted in 22 Karat Yellow Gold in a leaf design.
      </Text>

      {/* Summary Banner */}
      <View style={styles.summaryBanner}>
        <Text style={styles.bigRating}>{product.rating}/5</Text>
        <View style={styles.starRowBig}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Ionicons
              key={i}
              name={i <= Math.round(product.rating) ? "star" : "star-outline"}
              size={20}
              color="#FFF"
            />
          ))}
        </View>
        <Text style={styles.ratingsCountText}>100 Ratings/23 reviews</Text>
      </View>

      {/* Filter Tags */}
      <View style={styles.filterTagsRow}>
        {FILTER_TAGS.map((tag, index) => (
          <HapticButton key={index} style={styles.filterTag}>
            <Text style={styles.filterTagText}>{tag}</Text>
          </HapticButton>
        ))}
      </View>

      {/* Reviews List */}
      <View>
        {MOCK_REVIEWS.map((item) => (
          <ReviewItem key={item.id} item={item} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: SPACING.m,
  },
  seenOnYouContainer: {
    alignItems: "center",
    marginBottom: SPACING.xl,
    marginTop: SPACING.l,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: SPACING.m,
    textAlign: "center",
    textTransform: "uppercase",
  },
  videoBox: {
    width: "100%",
    aspectRatio: 1, // Square video preview
    backgroundColor: "#E0E0E0",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    maxWidth: 300,
  },
  playIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  expandIcon: {
    position: "absolute",
    bottom: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
  },

  separator: {
    height: 1,
    backgroundColor: "#F0F0F0",
    width: 100,
    alignSelf: "center",
    marginBottom: SPACING.xl,
    // Or decorative diamond separator
  },

  sectionSubHeader: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: SPACING.m,
    lineHeight: 20,
  },

  summaryBanner: {
    backgroundColor: COLORS.primary,
    padding: SPACING.m,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: SPACING.m,
  },
  bigRating: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
  },
  starRowBig: {
    flexDirection: "row",
    marginVertical: 4,
    gap: 4,
  },
  ratingsCountText: {
    fontSize: 12,
    color: "#CCC",
  },

  filterTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: SPACING.m,
  },
  filterTag: {
    borderWidth: 1,
    borderColor: "#E0E0E0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  filterTagText: {
    fontSize: 12,
    color: COLORS.text,
  },

  // Item
  reviewItem: {
    marginBottom: SPACING.l,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  ratingBadgeSmall: {
    flexDirection: "row",
    backgroundColor: "#053844",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignItems: "center",
    marginRight: 8,
  },
  ratingBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "700",
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
  },
  reviewComment: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
    lineHeight: 18,
  },
  reviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  reviewDate: {
    fontSize: 11,
    color: "#999",
  },
  starsRow: {
    flexDirection: "row",
  },
  photoRow: {
    flexDirection: "row",
    gap: 8,
  },
  photoPlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: "#F5F5F5",
    borderRadius: 4,
  },
});
