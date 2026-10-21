import { HapticButton } from "@/components/basic components/hapticButton";
import { BrandCollection } from "@/store/apis/collectionApi";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Sparkles } from "lucide-react-native";
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
import { MICROSITE_PRIMARY } from "./micrositeTheme";

type MicrositeCollectionsProps = {
  collections: BrandCollection[];
  primaryColor?: string;
  onSelect?: (collection: BrandCollection) => void;
  onViewAll?: () => void;
  style?: StyleProp<ViewStyle>;
};

/** The artwork and label every collection card is drawn from. */
const CollectionCard = ({
  collection,
  onPress,
  showShop = false,
  style,
}: {
  collection: BrandCollection;
  onPress?: () => void;
  showShop?: boolean;
  style?: StyleProp<ViewStyle>;
}) => (
  <HapticButton style={[styles.card, style]} activeOpacity={0.9} onPress={onPress}>
    <Image
      source={{ uri: collection.collectionBannerImgUrl }}
      style={StyleSheet.absoluteFill}
      contentFit="cover"
      transition={200}
    />

    {/* Holds the artwork back under the label. */}
    <LinearGradient
      colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.8)"]}
      locations={[0.35, 1]}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    />

    <View style={styles.cardText}>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {collection.title}
      </Text>
      {!!collection.description && (
        <Text style={styles.cardDescription} numberOfLines={1}>
          {collection.description}
        </Text>
      )}

      {showShop && (
        <View style={styles.shopRow}>
          <Text style={styles.shopLabel}>Shop</Text>
          <Sparkles size={12} color="#FFFFFF" fill="#FFFFFF" />
        </View>
      )}
    </View>
  </HapticButton>
);

/**
 * The brand's collections as a mosaic: the first leads at full height, the
 * next two stack beside it, and any others run along a strip beneath — so a
 * brand with three collections and one with ten both look deliberate.
 */
export default function MicrositeCollections({
  collections,
  primaryColor = MICROSITE_PRIMARY,
  onSelect,
  onViewAll,
  style,
}: MicrositeCollectionsProps) {
  if (!collections.length) return null;

  const [lead, ...rest] = collections;
  const stacked = rest.slice(0, 2);
  const strip = rest.slice(2);

  return (
    <View style={style}>
      <MicrositeSectionHeader
        title="Collections"
        align="left"
        primaryColor={primaryColor}
        actionLabel={onViewAll ? "View All" : undefined}
        onAction={onViewAll}
      />

      <View style={styles.mosaic}>
        <CollectionCard
          collection={lead}
          showShop
          style={styles.lead}
          onPress={() => onSelect?.(lead)}
        />

        {stacked.length > 0 && (
          <View style={styles.stack}>
            {stacked.map((collection) => (
              <CollectionCard
                key={collection.title}
                collection={collection}
                style={styles.stacked}
                onPress={() => onSelect?.(collection)}
              />
            ))}
          </View>
        )}
      </View>

      {strip.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.strip}
        >
          {strip.map((collection) => (
            <CollectionCard
              key={collection.title}
              collection={collection}
              style={styles.tile}
              onPress={() => onSelect?.(collection)}
            />
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const LEAD_HEIGHT = 300;

const styles = StyleSheet.create({
  mosaic: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    paddingHorizontal: 16,
  },
  lead: {
    flex: 1.05,
    height: LEAD_HEIGHT,
  },
  stack: {
    flex: 1,
    gap: 10,
  },
  stacked: {
    flex: 1,
  },
  strip: {
    gap: 10,
    marginTop: 10,
    paddingHorizontal: 16,
  },
  tile: {
    width: 108,
    height: 108,
  },
  card: {
    borderRadius: 16,
    overflow: "hidden",
    justifyContent: "flex-end",
    backgroundColor: "#EDE7E7",
  },
  cardText: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  cardDescription: {
    marginTop: 3,
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
  },
  shopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
  },
  shopLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
