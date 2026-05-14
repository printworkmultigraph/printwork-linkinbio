# 🔥 PRINTWORK — Full Rebuild Prompt

> **Copy-paste this entire prompt into a new conversation to rebuild the project from scratch.**

---

## 📋 PROJECT OVERVIEW

Build a complete **Printwork** digital marketing ecosystem — a custom packaging business. The project has **two pages**:

1. **Link-in-Bio** (`/linkinbio/index.html`) — A client-facing landing page (like Linktree but premium)
2. **Admin Dashboard** (`/dashboard/index.html`) — A secret admin panel for managing leads & analytics

Both are **static HTML/CSS/JS** (NO frameworks). They share a **Supabase** backend for real-time data.

**Folder structure:**
```
project-root/
├── index.html              ← redirect to /linkinbio/index.html
├── logo printwork.png      ← brand logo (exists, do not recreate)
├── PRICELIST REPACK.pdf    ← downloadable pricelist (exists, do not recreate)
├── linkinbio/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   └── PRICELIST REPACK.pdf  ← copy of pricelist
└── dashboard/
    ├── index.html
    ├── style.css
    ├── app.js
    └── data.js
```

---

## 🔑 SUPABASE CONFIGURATION (EXISTING — DO NOT RECREATE)

**Project URL:** `https://mepfmnekajcngvfaycfs.supabase.co`

**Anon Key (use this one — it works reliably):**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lcGZtbmVrYWpjbmd2ZmF5Y2ZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg3ODg1MDYsImV4cCI6MjA5NDM2NDUwNn0.XCeFpc1_a9piWD1gnA0Ek4UNC0RDfyBtdgvhthKZhDA
```

> ⚠️ **CRITICAL:** Use the legacy `anon` JWT key above, NOT the `sb_publishable_*` key. The publishable key format has caused silent auth failures in our previous builds.

### Database Tables (already exist with RLS enabled):

**`orders` table:**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key, auto-generated (IDENTITY ALWAYS) |
| customer_name | text | nullable |
| whatsapp_number | text | nullable |
| product_type | text | nullable |
| status | text | default: 'paid' |
| created_at | timestamptz | default: now() |
| customer_email | text | nullable |
| amount | numeric | nullable |
| items | jsonb | nullable |
| xendit_invoice_id | text | nullable |
| order_date | timestamptz | default: now() |

**`click_events` table:**
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Primary key, auto-increment |
| link_id | text | NOT NULL |
| created_at | timestamptz | default: now() |

### RLS Policies (already configured):
- `orders`: SELECT (public), INSERT (public) — **MISSING UPDATE policy** (needs to be added for status changes)
- `click_events`: SELECT (public, anon), INSERT (public, anon)

> ⚠️ **ADD THIS:** Create an UPDATE policy on `orders` for `anon` role so the dashboard can change order statuses:
> ```sql
> CREATE POLICY "Enable update for all users" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);
> ```

---

## 🎨 DESIGN SYSTEM — "White-Dominant + Navy" Theme

Both pages share this premium, professional aesthetic:

### Color Palette:
```css
/* Primary Brand */
--pw-navy: #0A1628;
--pw-white: #FFFFFF;
--pw-lime: #BEF264;       /* accent highlight */

/* Backgrounds */
--bg-body: #F8FAFC;        /* very light gray-blue */
--bg-card: #FFFFFF;
--bg-card-hover: #F1F5F9;
--bg-glass: rgba(255, 255, 255, 0.85);

/* Text */
--text-primary: #0A1628;   /* dark navy */
--text-secondary: #334155;
--text-muted: #64748B;

/* Accents */
--green: #84CC16;
--orange: #F59E0B;
--red: #EF4444;
--blue: #0EA5E9;
--pink: #EC4899;

/* Borders */
--border: #E2E8F0;
--border-hover: rgba(10, 22, 40, 0.2);
```

### Typography:
- **Primary:** Inter (Google Fonts) — body text
- **Display:** Space Grotesk (Google Fonts) — headings, numbers, brand name
- Load both via: `https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@400;500;600;700&display=swap`

### Design Principles:
- White-dominant backgrounds with subtle `linear-gradient(135deg, #f8fafc 0%, #e0e7ff 100%)`
- Subtle animated gradient orbs in background (very low opacity: 0.15)
- Glassmorphism on cards: `backdrop-filter: blur(20px)`, white bg with border
- Smooth micro-animations on all interactive elements
- Professional, premium, clean aesthetic — NOT playful/colorful
- Border-radius: 8-24px depending on element size
- Subtle box-shadows, never harsh

---

## 📱 PAGE 1: LINK-IN-BIO (`/linkinbio/`)

### Purpose:
Client-facing landing page for the Printwork Instagram bio link. Premium mobile-first design.

### Layout (top to bottom):
1. **Animated Background** — fixed gradient orbs (navy + lime + navy-light), noise overlay texture
2. **Header** — Logo image (`../logo printwork.png`), brand name "PRINTWORK" (lowercase, Space Grotesk), tagline "Elevate Your Product with Premium Packaging"
3. **Stats Row** — 3 stats in a glass card: "5.0 ★★★★★ (5 STARS)", "3,200 (Projects)" with counter animation, "24 (24/7 Support)" with counter animation
4. **Link Cards** (3 cards, staggered fade-in animation):
   - 🛒 **Order via Tokopedia** → `https://tokopedia.link/printwork` — "Cicilan 0% • Bebas Ongkir • Terpercaya"
   - 📋 **Download Pricelist** → `../PRICELIST REPACK.pdf` — "Katalog lengkap • Update terbaru 2026"
   - 📱 **Hubungi Customer Service** → `https://wa.me/6285778881810?text=Halo%20Printwork%2C%20saya%20butuh%20bantuan` — "Fast response • Konsultasi gratis"
5. **Quick Inquiry Form** — Submits to Supabase `orders` table:
   - Fields: Name (`custName`), WhatsApp (`custWA`), Product dropdown (`custProduct`)
   - Products: Standing Pouch, Box/Dus Custom, Sticker/Label, Paper Cup, Wrapping Paper, Totebag, Lainnya/Konsultasi
   - On submit: insert to `orders` with status='pending', show success message
6. **Testimonial Carousel** — Auto-rotating (4s), swipe-enabled, dots navigation:
   - "Kualitas cetakan bagus banget, warna vibrant..." — Rina, Owner Kopi Nusantara
   - "Response cepat, desain bisa custom sesuai request..." — Budi, Snack House ID
7. **Social Links** — Instagram only: `https://www.instagram.com/printwork_official_id/`
8. **Footer** — "© 2026 Printwork. All rights reserved."

### JavaScript Features (`script.js`):
1. **Supabase Init** — Connect using anon key
2. **Counter Animation** — Animate stat numbers from 0 to target using `requestAnimationFrame` with easeOutCubic
3. **Testimonial Carousel** — Auto-rotate, touch swipe, dot navigation
4. **Click Tracking** — Every `.link-card` and `.social-btn` click → insert to `click_events` with `link_id = element.id`
5. **Secret Admin Access** — 5 rapid taps on avatar → skip password → `sessionStorage.setItem('printwork_admin_auth', 'true')` → redirect to `../dashboard/index.html`
6. **Inquiry Form** — Submit to Supabase `orders` table, show success state

### Link IDs for Click Tracking:
- `link-tokopedia`
- `link-catalog`
- `link-cs`
- `social-instagram`

---

## 🖥️ PAGE 2: ADMIN DASHBOARD (`/dashboard/`)

### Purpose:
Secret admin panel for managing customer leads and viewing analytics. Protected by auth check.

### Authentication:
```javascript
// At the TOP of index.html (before any other scripts)
if (sessionStorage.getItem('printwork_admin_auth') !== 'true') {
    window.location.replace('../linkinbio/index.html');
}
```

### Layout:
- **Sidebar** (fixed left, 240px wide):
  - Logo + "PRINTWORK Business Center"
  - Nav items: 📊 Analytics, 🤝 Customer Leads (default active)
  - Footer: 🔗 View Live Bio (opens linkinbio), 🚪 Logout
- **Mobile Header** (shown < 1024px): hamburger menu + "Printwork Admin"
- **Main Content**: Tab-based, switches between Analytics and Customer Leads

### Tab 1: Analytics (`tab-analytics`)
- Title: "📊 Live Analytics"
- Grid of cards showing:
  - **Total Leads** — count of all `orders` rows
  - **Total Clicks** — count of all `click_events` rows
  - **Per-link breakdown** — group `click_events` by `link_id`, show count for each
- Refresh button to re-fetch data

### Tab 2: Customer Leads (`tab-leads`) — DEFAULT TAB
- Title: "🤝 Customer Leads"
- Table with columns: Date, Customer, WhatsApp, Product, Status, Action
- Data from `orders` table, ordered by `created_at DESC`
- **Status badges**: `paid` (green), `pending` (orange), `cancelled` (red)
- **Actions per row**:
  - ✅ Paid button → `updateStatus(id, 'paid')`
  - ❌ Cancel button → `updateStatus(id, 'cancelled')`
  - 💬 Chat → opens `https://wa.me/{cleanNumber}`
- WhatsApp numbers: clean to international format (strip non-digits, replace leading 0 with 62)

### Dashboard JavaScript (`app.js`):
1. **Supabase Init** — with retry (wait 2s if CDN hasn't loaded yet)
2. **switchTab(tab)** — hide all `.tab-content`, show target, update sidebar active state, auto-refresh data
3. **refreshAnalytics()** — fetch from `orders` + `click_events`, render stats cards
4. **refreshLeads()** — fetch from `orders`, render table rows with actions
5. **updateStatus(id, status)** — update order status in Supabase, show toast, refresh leads
6. **showToast(msg)** — animated toast notification at bottom of screen
7. **Global error handling** — try/catch everywhere, show user-friendly error states in the UI (never leave blank)

### Dashboard Data File (`data.js`):
Contains static content templates for the social media caption generator (not actively used on the dashboard anymore, but kept for future features):
- `CONTENT_PILLARS` — 5 content pillars with colors/weights
- `PRODUCTS` — 7 product types
- `CAPTION_TEMPLATES` — Templates organized by pillar × tone
- `CTA_TEMPLATES` — Call-to-action variations
- `HASHTAG_SETS` — 8 hashtag categories
- `CONTENT_IDEAS` — 35+ content ideas by format (reel/carousel/story/feed)
- `WEEKLY_SCHEDULE` — 7-day content schedule

---

## ⚡ CRITICAL IMPLEMENTATION NOTES

### 1. Supabase CDN Loading
The Supabase JS client is loaded from CDN: `https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2`
- It must be loaded BEFORE any script that uses `window.supabase.createClient()`
- Add a retry mechanism: if `window.supabase` is undefined, wait 2 seconds and try again
- Always wrap Supabase calls in try/catch

### 2. Never Leave UI Blank
- If data is loading → show "⏳ Loading..." state
- If data fetch fails → show "⚠️ Error: {message}" state
- If no data exists → show "📭 No data yet" state
- **NEVER** leave a table body or grid empty with no feedback

### 3. Cache-Busting
- Add `?v={timestamp}` to all `<script>` and `<link>` tags to prevent browser caching during development
- Example: `<script src="app.js?v=20260515"></script>`

### 4. Mobile Responsive
- Sidebar collapses to hamburger menu below 1024px
- Link-in-bio is mobile-first (max-width: 440px container)
- All tables should be horizontally scrollable on mobile

### 5. SEO (Link-in-Bio only)
- Proper `<title>`, `<meta description>`, Open Graph tags, Twitter cards
- Logo image for og:image: `https://printwork.vercel.app/logo%20printwork.png`

### 6. Root index.html
Simple redirect:
```html
<!DOCTYPE html>
<html><head>
<meta http-equiv="refresh" content="0; url=linkinbio/index.html">
</head><body></body></html>
```

---

## 🚀 DEPLOYMENT

- **Platform:** Vercel (static hosting)
- **Domain:** `printwork.vercel.app`
- **Local dev:** Use `npx http-server -p 8080 -c-1` for no-cache local serving

---

## ✅ ACCEPTANCE CRITERIA

1. Link-in-Bio loads with smooth animations, stats counters animate from 0
2. Inquiry form submits to Supabase `orders` table successfully
3. Click tracking works — clicking links inserts to `click_events`
4. 5 rapid taps on avatar → redirects to dashboard (no password prompt)
5. Dashboard shows Customer Leads tab by default with data from Supabase
6. Dashboard Analytics tab shows total leads, total clicks, and per-link breakdown
7. Status update buttons (Paid/Cancel) work and reflect changes immediately
8. All error states are handled gracefully — NO blank screens, NO silent failures
9. Both pages share the White-Dominant + Navy premium design aesthetic
10. Fully responsive on mobile
