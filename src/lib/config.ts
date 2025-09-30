export const GHL_API_BASE_URL = "https://services.leadconnectorhq.com";
export const GHL_OAUTH_BASE_URL = "https://marketplace.gohighlevel.com";

export const GHL_SCOPES = [
  "payments/orders.readonly",
  "payments/orders.write",
  "payments/integration.readonly",
  "payments/integration.write",
  "payments/transactions.readonly",
  "payments/subscriptions.readonly",
  "payments/coupons.readonly",
  "payments/coupons.write",
  "payments/custom-provider.readonly",
  "payments/custom-provider.write",
  "products.readonly",
  "products.write",
  "products/prices.readonly",
  "products/prices.write",
  "products/collection.readonly",
  "products/collection.write"
].join(" ");

export const SESSION_COOKIE_NAME = "transactify-ghl-session";
export const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds
