import ASSET_MANIFEST from "./assetManifest.json";

/**
 * Every remote asset the app renders is addressed by a placeholder key rather
 * than a URL, so the artwork can be re-pointed without shipping a new build.
 *
 * `assetManifest.json` is the bundled copy — the fallback that guarantees the
 * app always has something to render, including on a cold first launch with no
 * network. It is also the file that moves to the backend: serve it verbatim and
 * hand the response to `hydrateAssetManifest()`.
 *
 *   import { assetUrl } from "@/constants/assets";
 *   <Image source={{ uri: assetUrl("gifting.banner") }} />
 *
 * One caveat worth knowing before the backend is wired up: most call sites read
 * their URL from a module-level constant (`const BANNERS = [...]`), which the
 * bundler evaluates at import time — long before any fetch can resolve. Those
 * keep whatever the bundled manifest said for the whole session. Hydrating a
 * manifest fetched at startup therefore only takes effect from the *next*
 * launch, so cache the backend response and hydrate from that cache as early as
 * the entry point allows. Call sites evaluated during render pick it up
 * immediately.
 */
export type AssetKey = keyof typeof ASSET_MANIFEST;

/** URLs supplied by the backend, layered over the bundled manifest. */
let overrides: Partial<Record<AssetKey, string>> = {};

/**
 * Layer a backend-served manifest over the bundled one. Unknown keys are kept
 * — the backend is allowed to run ahead of the app — and any key the backend
 * omits keeps falling back to its bundled URL.
 */
export function hydrateAssetManifest(manifest: Record<string, string>): void {
  overrides = { ...overrides, ...(manifest as Partial<Record<AssetKey, string>>) };
}

/** Drop everything the backend supplied and fall back to the bundled manifest. */
export function clearAssetManifestOverrides(): void {
  overrides = {};
}

/** The URL for an asset key — backend copy if there is one, bundled otherwise. */
export function assetUrl(key: AssetKey): string {
  return overrides[key] ?? ASSET_MANIFEST[key];
}

/**
 * The URL for a key the app can't know at compile time (one that arrived in an
 * API payload, say). Returns `undefined` when nothing has that key, so callers
 * have to decide what to render instead.
 */
export function assetUrlByName(key: string): string | undefined {
  return (
    overrides[key as AssetKey] ??
    (ASSET_MANIFEST as Record<string, string>)[key]
  );
}

export { ASSET_MANIFEST };
