// NearShop Karnataka - configuration.
// The publishable key is SAFE to ship in the browser; Row Level Security protects the data.
// NEVER put a "secret" or "service_role" key in this file or anywhere in the frontend.
window.NEARSHOP_CONFIG = {
  SUPABASE_URL: 'https://knyteqrglribrxzanwqp.supabase.co',
  SUPABASE_KEY: 'sb_publishable_c3lZtJ8Wt11LCwMxrz-beA_GkXlNUuq',
  STOCK_FRESH_HOURS: 24,   // <= this: "Recently updated"
  STOCK_AGING_HOURS: 72    // <= this: "Update recommended"; older: "Availability unverified"
};
