# NearShop Karnataka

Local shop discovery + product availability for Karnataka. Static frontend (HTML/CSS/JS + Bootstrap) talking
directly to **Supabase** (Postgres + Auth + Storage). No server of your own to run or deploy.

> Flat folder by design: every file sits next to the others. Open `index.html` through a web server (below).

## 1. Setup (about 10 minutes)

1. **Supabase > SQL Editor**: paste all of `schema.sql` > Run. Then paste `seed.sql` > Run (11 fictional "Demo" shops, 20 products, 40 stock rows).
2. **Supabase > Authentication > Providers > Email**:
   - Demo/college: turn **"Confirm email" OFF** so sign-up logs you straight in. Production: leave ON.
   - Set **minimum password length to 8**.
3. **Supabase > Authentication > URL Configuration**: set Site URL to wherever you host the site (needed for email links).
4. `config.js` already holds your project URL and publishable key. Never put a `secret` / `service_role` key in any file here.
5. **Run locally** (do not double-click the HTML; use a server):
   - `python -m http.server 8000` in this folder, open http://localhost:8000
   - or VS Code "Live Server".
6. **Create your admin** (nobody can self-register as admin):
   - Sign up normally on `customer-register.html` with the email you want as admin.
   - SQL Editor: `update public.profiles set role = 'admin' where email = 'you@example.com';`
   - Log in at `login.html?role=admin`.

Deploy: drag this folder onto Netlify / Vercel / Cloudflare Pages, or push to GitHub Pages. Then add that URL in step 3.

## 2. The demonstration that matters (stock 10 -> 0)

1. Register a shop at `shop-register.html` (Karnataka PIN only, e.g. 575001).
2. Log in as admin > Shops tab > **Approve** it. (Unapproved shops are invisible to customers.)
3. Log in as the shop owner > Manage Products > search "Sona Masoori" > pick > qty 10, price 350 > Add.
4. Open `search.html?q=rice` in a private window: your shop shows **Available**.
5. Back in Manage Products set quantity to **0** > Save. Refresh the customer window (untick "In stock only"): **Out of Stock**.
   The status is computed by a database trigger, not by the browser, so it cannot be faked from the client.

## 3. Files

| File | Purpose |
|---|---|
| `index.html` | Home: search, categories, recent stock, shops |
| `search.html` | Product search: city / PIN / category / max price / in-stock / sort by price, distance or freshness |
| `product-details.html` | One product across all shops (price comparison) |
| `shop-details.html` | Shop profile, map, inventory, reviews, enquiry, report |
| `shops.html` | Shop directory |
| `login.html`, `customer-register.html`, `shop-register.html` | Auth (one login page serves all roles and routes by role) |
| `customer-dashboard.html` | Profile, enquiries + replies, reports, DPDP erasure |
| `shop-dashboard.html` | Verification status, stats (available/low/out/stale), profile, enquiry replies |
| `manage-products.html` | Add listing, create catalogue product + photo, edit qty/price, "confirm still in stock" |
| `admin-dashboard.html` | Stats, approve/reject/delete shops, users, categories, products, reports |
| `app.js` | Shared logic: Supabase client, EN/KN translations, search, badges, modals |
| `config.js` | URL, publishable key, freshness thresholds |
| `schema.sql`, `seed.sql` | Database, security rules, demo data |
| `supabase.js`, `591.supabase.js`, `bootstrap.*` | Vendored libraries (supabase-js 2.49.4, Bootstrap 5.3.3). Keep `591.supabase.js` beside `supabase.js`. |

## 4. Business rules enforced in the database (not just the UI)

- Stock status: qty 0 = out_of_stock, 1-5 = low_stock, >5 = available. Negative qty / price <= 0 rejected.
- `last_updated` is set by the server on every change; owners cannot back-date it.
- UI freshness: <=24h "Recently updated", <=72h "Update recommended", older "Availability unverified" (an old "available" is shown as unverified). Change in `config.js`.
- Public sees only **approved** shops and their stock. Pending/rejected are visible only to owner and admin.
- Owners cannot change their own verification status; editing shop name/address/city/PIN sends it back to *pending*.
- Roles: customer / shop_owner / admin. Role is whitelisted at sign-up and cannot be changed by the user.
- Owners can edit only their own shop's stock; only customers can send enquiries/reports; owners can only change `status` and `reply` on enquiries.
- Duplicate catalogue products (same name+brand+variant) are blocked. Creating *new* catalogue products requires an approved shop.
- Karnataka-only PIN (560000-591999), Indian mobile (`[6-9]` + 9 digits), 20 enquiries / 20 reports per user per 24h.
- Product photos: JPG/PNG/WebP, max 2 MB, own folder only.

## 5. Tested

- 24 database security/business-rule tests on PostgreSQL (privilege escalation, cross-shop writes, 10->0 stock, duplicates, erasure...).
- 34 page-load / logic tests in jsdom with a mocked client (all 12 pages, XSS escaping, role guards, validators).
- 32 end-to-end tests: the real `app.js` + real supabase-js against real PostgREST with Row Level Security, signed JWTs per role.

**Not tested (could not be, from my environment): Supabase Auth itself (email confirmation, real sign-up round trip), Storage upload, and real browsers/phones.** Do the demo in section 2 yourself before presenting. If sign-up fails with "Database error saving new user", the shop PIN/phone failed a database rule; the form checks the same rules, so report the exact message.

## 6. Honest limits (do not over-claim in your viva)

- Stock is **manually entered** by shop owners. This is not real-time inventory. The freshness badge is the mitigation.
- Search is keyword matching (name / brand / variant), **not AI**. Distance uses the browser's location and shop lat/lng if the owner set them; seed shops have approximate coordinates.
- Map = OpenStreetMap embed + link. No live tracking. Enquiry = message + phone, not booking or reservation. No payments, no delivery.
- Kannada covers the public, customer and shop-owner UI; the admin panel is English. **Have a native Kannada speaker review the translations** in `app.js`.
- Seed data is fictional (names start with "Demo", phones 99999000xx). Delete with `delete from public.shops where owner_id is null;`.
- Admin cannot delete auth users from the browser (needs service-role key). Use Supabase Dashboard > Authentication.
- Anyone can sign up as a shop owner. Admin approval is your only gate; fake-shop abuse is a process problem, not a code problem.
- Notes you write when rejecting a shop are visible via the API to signed-in users if the shop is later approved; don't write private data there.

## 7. Requirements coverage

Customer module, shop module, admin module, availability status, last-updated time, price comparison, city/PIN/category/price/distance filters, English + Kannada, INR, Indian phone + PIN validation, DPDP consent + erasure, responsive Bootstrap UI: **done**.
Per the requirement doc's own scoping: payments, delivery, AI recommendations, native apps: **deliberately not built**.
Changed from the doc: Django/MySQL replaced by Supabase/Postgres, because a Django project cannot be a flat folder and cannot be reached with a publishable key. The data model (users, shops, categories, products, shop_inventory, enquiries, reviews) is the one in your document, plus `reports`.
