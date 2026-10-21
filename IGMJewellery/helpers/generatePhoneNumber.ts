/**
 * A throwaway 10-digit Indian mobile number, different on every call.
 *
 * The number stands in for the one a shopper would normally type on /login: it
 * becomes the userId, and cart and wishlist storage are partitioned by userId —
 * so a fresh number is a fresh shopper with an empty cart. That is what lets
 * "Get Started" drop straight into the app while there is no real SMS provider
 * behind the OTP screen.
 *
 * The timestamp is what makes it unique (it moves every millisecond); the two
 * random digits keep two devices calling in the same millisecond apart. The
 * leading 6-9 is what /login validates real numbers against, so the result
 * passes the same check a hand-typed number would.
 */
export function generateUniquePhoneNumber(): string {
  const leadingDigit = 6 + Math.floor(Math.random() * 4);
  const timestamp = `${Date.now()}`.slice(-7);
  const salt = `${Math.floor(Math.random() * 100)}`.padStart(2, "0");
  return `${leadingDigit}${timestamp}${salt}`;
}
