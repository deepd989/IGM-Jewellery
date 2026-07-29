import { HapticButton } from "@/components/basic components/hapticButton";
import { COLORS, LUXURY_SPACING } from "@/constants/theme";
import { Product } from "@/interfaces/product.interface";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useMemo, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

const SIDE_PADDING = 16;

/** Stands in until the catalogue reports how many people rated the piece. */
const RATINGS_COUNT = 100;

const ALL_REVIEWS = "All Reviews";
const LATEST = "Latest";
const ABOVE_THREE = "Above 3 ★";
const FIVE_STAR = "5 ★";
const FILTERS = [ALL_REVIEWS, LATEST, ABOVE_THREE, FIVE_STAR];

type Review = {
  id: string;
  name: string;
  rating: number;
  /** ISO date, formatted for display below. */
  date: string;
  comment: string;
  /** Placeholder tiles for photos the buyer attached. */
  photoCount?: number;
};

/** Placeholder reviews until the reviews API is wired up. */
const MOCK_REVIEWS: Review[] = [
  {
    id: "1",
    name: "Ananya Mehta",
    rating: 4,
    date: "2025-02-15",
    comment:
      "Absolutely beautiful piece. The finish, weight, and detailing feel truly luxurious. Packaging and certification were flawless too.",
  },
  {
    id: "2",
    name: "Priya Shah",
    rating: 5,
    date: "2025-02-10",
    comment:
      "Lovely craftsmanship and great sparkle. Slight delay in delivery, but the jewellery itself was perfect and worth the wait.",
    photoCount: 4,
  },
  {
    id: "3",
    name: "Neha Khanna",
    rating: 5,
    date: "2025-02-05",
    comment:
      "Beautiful design with impeccable finishing. Comfortable for daily wear yet special enough for occasions.",
  },
  {
    id: "4",
    name: "Vikram Sethi",
    rating: 3,
    date: "2025-02-01",
    comment:
      "Bought this as a gift and it was loved instantly. Premium look and secure packaging, though it arrived a day late.",
  },
];

/** e.g. "21 Jan, 2025" */
const formatReviewDate = (isoDate: string) => {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.toLocaleDateString("en-IN", { month: "short" });
  return `${day} ${month}, ${date.getFullYear()}`;
};

const StarRow = ({
  rating,
  size,
  filledColor,
  emptyColor,
}: {
  rating: number;
  size: number;
  filledColor: string;
  emptyColor: string;
}) => (
  <View style={styles.starRow}>
    {[1, 2, 3, 4, 5].map((star) => (
      <Ionicons
        key={star}
        name="star"
        size={size}
        color={star <= Math.round(rating) ? filledColor : emptyColor}
      />
    ))}
  </View>
);

const ReviewItem = ({ review }: { review: Review }) => (
  <View style={styles.reviewItem}>
    <View style={styles.reviewHeader}>
      <View style={styles.ratingBadge}>
        <Text style={styles.ratingBadgeText}>{review.rating}</Text>
        <Ionicons name="star" size={11} color="#FFFFFF" />
      </View>
      <Text style={styles.reviewerName}>{review.name}</Text>
    </View>

    <Text style={styles.reviewComment}>{review.comment}</Text>

    <View style={styles.reviewFooter}>
      <Text style={styles.reviewDate}>{formatReviewDate(review.date)}</Text>
      <StarRow
        rating={review.rating}
        size={16}
        filledColor={COLORS.primary}
        emptyColor="#C3D0D5"
      />
    </View>

    {!!review.photoCount && (
      <View style={styles.photoRow}>
        {Array.from({ length: review.photoCount }).map((_, index) => (
          <View key={index} style={styles.photo} />
        ))}
      </View>
    )}
  </View>
);

type LuxuryCustomerReviewsProps = {
  product: Product;
  title?: string;
  subtitle?: string;
  /** Defaults to the placeholder reviews above. */
  reviews?: Review[];
  style?: StyleProp<ViewStyle>;
};

/**
 * Customer reviews: the rating summary, the filter chips and the list itself.
 * Mirrors components/products/ReviewSection.tsx, with the filters live.
 */
export default function LuxuryCustomerReviews({
  product,
  title = "Customer Reviews",
  subtitle = "Find genuine customer reviews of our buyers",
  reviews = MOCK_REVIEWS,
  style,
}: LuxuryCustomerReviewsProps) {
  const [activeFilter, setActiveFilter] = useState(ALL_REVIEWS);

  const visibleReviews = useMemo(() => {
    switch (activeFilter) {
      case LATEST:
        return [...reviews].sort((a, b) => b.date.localeCompare(a.date));
      case ABOVE_THREE:
        return reviews.filter((review) => review.rating > 3);
      case FIVE_STAR:
        return reviews.filter((review) => review.rating === 5);
      default:
        return reviews;
    }
  }, [activeFilter, reviews]);

  const rating = Number(product.rating) || 4.5;

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title.toUpperCase()}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>

      <LinearGradient
        colors={["#053844", "#2F7C7B"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={styles.summary}
      >
        <Text style={styles.summaryRating}>{rating.toFixed(1)}/5</Text>

        <View style={styles.summaryRight}>
          <StarRow
            rating={rating}
            size={22}
            filledColor="#FFFFFF"
            emptyColor="rgba(255,255,255,0.45)"
          />
          <Text style={styles.summaryCount}>
            {RATINGS_COUNT} Ratings/{reviews.length} reviews
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.filters}>
        {FILTERS.map((filter) => {
          const isActive = filter === activeFilter;

          return (
            <HapticButton
              key={filter}
              style={[styles.filterChip, isActive && styles.filterChipActive]}
              activeOpacity={0.7}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  isActive && styles.filterTextActive,
                ]}
              >
                {filter}
              </Text>
            </HapticButton>
          );
        })}
      </View>

      <View style={styles.list}>
        {visibleReviews.length > 0 ? (
          visibleReviews.map((review) => (
            <View key={review.id}>
              <ReviewItem review={review} />
              <View style={styles.divider} />
            </View>
          ))
        ) : (
          <Text style={styles.empty}>No reviews match this filter yet.</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
    paddingHorizontal: SIDE_PADDING,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
    color: COLORS.text,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
  },

  // ── Summary ──
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    marginTop: LUXURY_SPACING / 2,
    paddingVertical: 18,
    paddingHorizontal: 22,
    borderRadius: 16,
  },
  summaryRating: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.secondary,
  },
  summaryRight: {
    alignItems: "flex-end",
    gap: 6,
  },
  summaryCount: {
    fontSize: 13,
    color: "#FFFFFF",
  },
  starRow: {
    flexDirection: "row",
    gap: 2,
  },

  // ── Filters ──
  filters: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: LUXURY_SPACING / 2,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#DCE6E9",
  },
  filterChipActive: {
    borderColor: COLORS.primary,
  },
  filterText: {
    fontSize: 13,
    color: COLORS.text,
  },
  filterTextActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },

  // ── List ──
  list: {
    marginTop: LUXURY_SPACING / 2,
  },
  reviewItem: {
    paddingBottom: 16,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    backgroundColor: COLORS.primary,
  },
  ratingBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  reviewerName: {
    fontSize: 15,
    fontWeight: "700",
    color: COLORS.text,
  },
  reviewComment: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#4A5A60",
  },
  reviewFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
  },
  reviewDate: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  photoRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  photo: {
    width: 54,
    height: 54,
    borderRadius: 10,
    backgroundColor: "#EFEFEF",
  },
  divider: {
    height: 1,
    marginBottom: 16,
    backgroundColor: "#E8ECED",
  },
  empty: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    paddingVertical: 24,
  },
});
