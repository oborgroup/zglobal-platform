# ZGlobal B2B Platform — Build Session Log

**Repo:** oborgroup/zglobal-platform · **Stack:** Next.js 16 (App Router, Turbopack), React 19, Tailwind 4, Supabase
**Local path:** /Users/oj/ZGlobal · **Prod:** https://b2b.zglobalcorp.com (Vercel) · **Supabase ref:** wwqxpjqszeqevmhwuljg
**Session span:** 2026-09-20 → 2026-09-23

---

## 1. Clone & setup
- Cloned the repo, ran `npm install` (Node 26 / npm 11). Reviewed structure (Next.js 16 storefront + Supabase).
- Noted `AGENTS.md`: modified Next.js 16 — read installed docs before coding (middleware → **`proxy.ts`**).

## 2. Supabase connection
- Installed Supabase CLI (Homebrew); user logged in via browser.
- Fetched project URL + anon key; wrote **`.env.local`** (gitignored) with `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and later `SUPABASE_SERVICE_ROLE_KEY` (server-only).
- Started dev server on http://localhost:3000.

## 3. Admin system  → PR #1 (merged)
- **Auth model:** admin = Supabase `app_metadata.is_admin = true` (no table/schema change).
- **`proxy.ts`** route guards: block non-admins from `/admin/*`; send admins away from buyer `/dashboard`,`/login`,`/signup`; storefront stays public.
- **`/admin/login`** (rejects non-admins) + guarded `/admin` area (route group).
- **`/admin`** overview, **product CRUD**, **brand CRUD** (add/edit/hide/delete) via admin-gated **server actions** + service-role client.
- **`/admin/applications`** — buyer signups (all fields) + secure signed links to uploaded business licenses (`auth.users` + private storage bucket).
- Helpers: `lib/supabaseServer.ts`, `lib/supabaseAdmin.ts`, `lib/adminAuth.ts`, `lib/adminData.ts`, `components/AdminHeader.tsx`.
- **`scripts/set-admin.mjs`** — grant/revoke/list admins by email.
- Granted admin to **oj@oborgroup.net** (then vicky.ke@zglobalcorp.com later).

## 4. Password reset + forgot-password  → PR #2 (merged)
- **`/auth/confirm`** (verifyOtp) + **`/reset-password`** (role-aware set-password page).
- **`/forgot-password`** + "Forgot password?" links on `/login` and `/admin/login`.
- Header: signed-in admins get an **"Admin"** link (instead of "Dashboard") so they can use the live storefront.

## 5. GitHub auth (friction, resolved)
- HTTPS token pushes failed (no stored cred / paste-mangling terminal / intermittent github.com SSL). Resolved via **`gh auth login --web`** (logged in as `oborgroup`).

## 6. Deployment
- Merged PRs deploy via Vercel from `main`. Required Vercel Production env var **`SUPABASE_SERVICE_ROLE_KEY`** (else `/admin` 500s) — user added it.
- SMTP: documented **Aruba** setup (`smtps.aruba.it`, port 465) for reset/confirmation emails.

## 7. SHEGLAM import  → PR (merged)
- Parsed `Sheglam/ZGLOBAL_BV_..._SHEGLAM_EXW_EU.xlsx` (167 products: SKC code, EAN, name, category, units/carton, EXW price).
- Matched **logistics** from `Sheglam/public_html/assets/products.js` by EAN (100%): carton qty/CBM/kg/dims → stored in each product's description.
- Inserted **167 products** under the existing (hidden) **SHEGLAM** brand; set brand visible, sku_count 167.
- Homepage: SHEGLAM in hero cards, brands table, nav, ticker; wired **Beauty & Cosmetics** category card.
- Added **Beauty** category (`lib/categories.ts` + Header nav) → `/category/beauty`. New Arrivals auto-includes them.

## 8. Catalog polish + CBM  → PR #3 (merged)
- **Normalized** sub-categories in DB (Mascaras→Mascara, Eyeliners→Eyeliner, Single Eyeshadow→Eyeshadow) → 18 clean groups.
- **Default sort = Price High→Low** + sort dropdown + product/SKU **search** on catalog & sub-category pages.
- Created **`/category/[slug]/[sub]`** product page (sub-category cards previously 404'd).
- Made homepage category nav labels (Beauty/Outdoor/Home/Electronics) **clickable** to their collections.
- **CBM columns**: generated `sheglam_cbm_columns.sql` (ALTER + 167 populated rows); **user ran it** → `ean, ctn_qty, ctn_cbm, ctn_kg, ctn_dim` created + filled.

## 9. Pre-launch audit
- Full end-to-end review. Key blockers found: **no checkout/order flow (dead "Request a Quote" buttons), no wholesale pricing shown to buyers, buyer approval not enforced, no payment method, missing Contact + legal pages (Privacy/Terms/Cookie/Imprint) + cookie banner.** Plus missing product images (167), dead links, no i18n/global search, admin order mgmt, etc. (See chat for full prioritized list.)

---

## Current state
- **Live:** storefront browse, catalog sort/filter/search, category + sub-category pages, product detail + add-to-cart (localStorage), auth (signup/login/reset), admin (product/brand CRUD, application review), 266 products (167 SHEGLAM with CBM data).
- **Admins:** oj@oborgroup.net, vicky.ke@zglobalcorp.com.
- **Branches/PRs:** #1 admin, #2 forgot-password, #3 catalog/CBM — all merged to `main`.
- **Not yet built:** ordering/checkout, payments, wholesale price display, approval workflow, contact/legal pages, product images. (See audit.)

## Config notes (no secrets in repo)
- `.env.local` holds anon + service-role keys (gitignored). Same keys must exist in Vercel (service-role = Production, server-only).
- Local source data (`Sheglam/`, `sheglam_cbm_columns.sql`) is gitignored.
