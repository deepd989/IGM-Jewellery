import { Product } from "@/interfaces/product.interface";

/**
 * The community try-on videos that ship with the app, keyed by the SKU of the
 * product being worn — this is the single source of truth every community
 * carousel reads from, so they can never drift apart.
 *
 * A product only appears in these carousels when its SKU is listed here AND the
 * catalogue marks it as having an immersive video.
 */
export const COMMUNITY_VIDEO_SKUS = [
  "EA1594",
  "GER-24",
  "GER-030",
  "GER-012023",
  "GNK-026",
  "GNK-89-12",
  "GNK-NK-29",
  "KAM-NK-04",
  "Kana1",
  "Moonlight1",
  "Parampara1",
  "Shri1",
  "Swarna1",
];

/** Bundled artwork for each SKU above. `require` needs the literal path. */
export const COMMUNITY_VIDEO_SOURCES: Record<string, any> = {
  EA1594: require("../../assets/EA1594.mp4"),
  "GER-24": require("../../assets/GER-24.mp4"),
  "GER-030": require("../../assets/GER-030.mp4"),
  "GER-012023": require("../../assets/GER-012023.mp4"),
  "GNK-026": require("../../assets/GNK-026.mp4"),
  "GNK-89-12": require("../../assets/GNK-89-12.mp4"),
  "GNK-NK-29": require("../../assets/GNK-NK-29.mp4"),
  "KAM-NK-04": require("../../assets/KAM-NK-04.mp4"),
  Kana1: require("../../assets/Kana1.mp4"),
  Moonlight1: require("../../assets/Moonlight1.mp4"),
  Parampara1: require("../../assets/Parampara1.mp4"),
  Shri1: require("../../assets/Shri1.mp4"),
  Swarna1: require("../../assets/Swarna1.mp4"),
};

/** The video worn-on-model clip for a product, or undefined if it has none. */
export const getCommunityVideoSource = (sku?: string) =>
  sku ? COMMUNITY_VIDEO_SOURCES[sku] : undefined;

/** The one definition of which catalogue products these carousels can show. */
export const filterCommunityProducts = (products: Product[]) =>
  products.filter(
    (product) =>
      product.immersiveVideoUrl &&
      COMMUNITY_VIDEO_SKUS.includes(product.sku as string)
  );
