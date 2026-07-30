import { BrandMicrositeReview } from "@/interfaces/brandMicrosite.interface";
import { Image } from "expo-image";
import { Star } from "lucide-react-native";
import React from "react";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import MicrositeSectionHeader from "./micrositeSectionHeader";
import {
  MICROSITE_CARD_BORDER,
  MICROSITE_MUTED,
  MICROSITE_PRIMARY,
  MICROSITE_SECONDARY,
  MICROSITE_TEXT,
  withAlpha,
} from "./micrositeTheme";

type MicrositeReviewsProps = {
  reviews: BrandMicrositeReview[];
  primaryColor?: string;
  secondaryColor?: string;
  style?: StyleProp<ViewStyle>;
};

/** Five stars, filled to the rating. Half marks round up to a full star. */
const StarRow = ({ rating, color, size = 12 }: { rating: number; color: string; size?: number }) => (
  <View style={styles.starRow}>
    {[1, 2, 3, 4, 5].map((position) => {
      const earned = position <= Math.round(rating);

      return (
        <Star
          key={position}
          size={size}
          color={earned ? color : MICROSITE_CARD_BORDER}
          fill={earned ? color : "transparent"}
          strokeWidth={2}
        />
      );
    })}
  </View>
);

/**
 * What shoppers say, led by the average they add up to — the number carries
 * more than any single quote, so it is set first and largest.
 */
export default function MicrositeReviews({
  reviews,
  primaryColor = MICROSITE_PRIMARY,
  secondaryColor = MICROSITE_SECONDARY,
  style,
}: MicrositeReviewsProps) {
  if (!reviews.length) return null;

  // Stars arrive as text, so anything unparseable is left out of the average
  // rather than counted as zero.
  const ratings = reviews
    .map((review) => Number.parseFloat(review.stars))
    .filter((rating) => Number.isFinite(rating));

  const average = ratings.length
    ? ratings.reduce((total, rating) => total + rating, 0) / ratings.length
    : 0;

  return (
    <View style={style}>
      <MicrositeSectionHeader
        title="What Customers Say"
        primaryColor={primaryColor}
      />

      <View
        style={[
          styles.summary,
          { backgroundColor: withAlpha(secondaryColor, 0.3) },
        ]}
      >
        <Text style={[styles.average, { color: primaryColor }]}>
          {average.toFixed(1)}
        </Text>
        <StarRow rating={average} color={primaryColor} size={16} />
        <Text style={styles.count}>
          {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.cards}
      >
        {reviews.map((review) => (
          <View key={`${review.name}-${review.description}`} style={styles.card}>
            <StarRow
              rating={Number.parseFloat(review.stars) || 0}
              color={primaryColor}
            />

            <Text style={styles.quote} numberOfLines={4}>
              {review.description}
            </Text>

            <View style={styles.reviewer}>
              {!!review.dpUrl && (
                <Image
                  source={{ uri: review.dpUrl }}
                  style={styles.avatar}
                  contentFit="cover"
                  transition={200}
                />
              )}
              <View style={styles.reviewerText}>
                <Text style={styles.name} numberOfLines={1}>
                  {review.name}
                </Text>
                <Text style={styles.stars}>{review.stars} ★</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  summary: {
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 18,
    borderRadius: 20,
  },
  average: {
    fontSize: 38,
    fontWeight: "800",
  },
  starRow: {
    flexDirection: "row",
    gap: 3,
  },
  count: {
    fontSize: 12,
    color: MICROSITE_MUTED,
  },
  cards: {
    gap: 12,
    marginTop: 12,
    paddingHorizontal: 16,
  },
  card: {
    width: 250,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: MICROSITE_CARD_BORDER,
    backgroundColor: "#FFFFFF",
  },
  quote: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    color: MICROSITE_TEXT,
  },
  reviewer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: MICROSITE_CARD_BORDER,
  },
  reviewerText: {
    flex: 1,
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: MICROSITE_TEXT,
  },
  stars: {
    marginTop: 1,
    fontSize: 11,
    color: MICROSITE_MUTED,
  },
});
