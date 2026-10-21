/**
 * Brand microsite interfaces — the shape /brand-microsite answers with.
 *
 * A microsite is a brand's own storefront page: its cover, the products it
 * wants led with, and the story it tells about itself.
 */

/** One of the products a brand puts forward on its microsite. */
export interface BrandMicrositeSpecialProduct {
  productId: string;
  productImageUrl: string;
}

/** The figures shown as the brand's credentials. */
export interface BrandMicrositeInfoAttributes {
  /** ISO date, e.g. "2018-04-15". */
  establishedDate: string;
  numberOfStores: number;
  numberOfCustomers: number;
  /** Free text, e.g. "Top 10 Streetwear Brands". */
  rank: string;
}

/** The brand's pitch, as a heading and a paragraph. */
export interface BrandMicrositeDescription {
  title: string;
  description: string;
}

/** The brand's own palette; both are hex strings, e.g. "#240a0a". */
export interface BrandMicrositeColorCode {
  primaryColor: string;
  secondaryColor: string;
}

/** One entry on the brand's timeline. */
export interface BrandMicrositeMilestone {
  /** Year as text, e.g. "2018". */
  year: string;
  header: string;
  description: string;
}

/** One of the principles the brand stands on. */
export interface BrandMicrositeValue {
  /**
   * Name of the icon to draw beside it, e.g. "Leaf" or "ShieldCheck". The
   * server picks from lucide's set; unknown names are the caller's to fall
   * back from.
   */
  iconTag: string;
  header: string;
  description: string;
}

/** A shopper's word on the brand. */
export interface BrandMicrositeReview {
  name: string;
  /** Reviewer's display picture. */
  dpUrl: string;
  description: string;
  /** Rating as text, e.g. "4.8". */
  stars: string;
}

/** The narrative half of the microsite. */
export interface BrandMicrositeStory {
  wallpaperUrl: string;
  tryBeforeBuyImgUrl: string;
  milestones: BrandMicrositeMilestone[];
  values: BrandMicrositeValue[];
  brandReviews: BrandMicrositeReview[];
}

/** A brand's whole microsite, as GET /brand-microsite/:brandId answers. */
export interface BrandMicrosite {
  /** The stored document's own id, not the brand's. */
  _id: string;
  brandId: string;
  brandName: string;
  brandMicrositeCoverPhotoUrl: string;
  specialProducts: BrandMicrositeSpecialProduct[];
  /** Opened externally, e.g. "https://maps.google.com/?q=37.7749,-122.4194". */
  mapLocationLink: string;
  brandInfoAttributes: BrandMicrositeInfoAttributes;
  brandDescription: BrandMicrositeDescription;
  colorCode: BrandMicrositeColorCode;
  ourStory: BrandMicrositeStory;
  /** ISO timestamp set by the server. */
  createdAt: string;
  /** ISO timestamp set by the server. */
  updatedAt: string;
}

/**
 * What POST /brand-microsite is given: the microsite without the three fields
 * the server owns and fills in itself.
 */
export type BrandMicrositeRequest = Omit<
  BrandMicrosite,
  "_id" | "createdAt" | "updatedAt"
>;
