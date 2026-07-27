# StyleGuide

> **Framework:** Tailwind CSS v3 + shadcn/ui | **Approach:** Utility-first + Component-based
> **Inspirasi Brand:** Mie Gacoan — bold, modern, youthful

## Document Role
- **Source of Truth:** Visual system and UI conventions for this project
- **Primary Owner:** `brainstorm-styleguide`
- **Out of Scope:** Backend logic, API contracts, and non-UI technical architecture

## Supported Surfaces
| Surface | Included? | Notes |
|---------|-----------|-------|
| Web app (Dashboard) | Yes | Main application |
| Login page | Yes | Public page |
| Admin panel | Yes | Full CRUD interfaces |
| Reports | Yes | Admin-only page |
| Mobile responsive | Yes | Sidebar drawer via burger |

---

## 1. CSS Framework
- **Framework:** Tailwind CSS v3 + shadcn/ui
- **Component Library:** shadcn/ui (Radix UI primitives) — button, card, dialog, form, table, select, input, badge, avatar, toast, skeleton
- **Notes:** Install via `npx shadcn@latest init`, add components with `npx shadcn@latest add`

## 2. Color Palette
| Role | Hex | Tailwind | Description |
|------|-----|---------|-------------|
| Primary | `#EC008C` | `pink-600` | **Magenta Gacoan** — brand main |
| Primary Hover | `#C7007A` | `pink-700` | Button hover state |
| Primary Light | `#FCE4F0` | `pink-100` | Alert/sidebar active bg |
| Secondary | `#00B2D8` | `cyan-500` | **Cyan Gacoan** — accent action |
| Secondary Hover | `#0099BA` | `cyan-600` | Accent hover |
| Background | `#F5F5F5` | `gray-100` | Page background |
| Surface | `#FFFFFF` | `white` | Card, panel, modal background |
| Sidebar | `#000000` | `black` | **Sidebar hitam** — Gacoan style |
| Sidebar Text | `#FFFFFF` | `white` | Menu text on dark bg |
| Sidebar Active | `#EC008C` | `pink-600` | Active menu item |
| Text Primary | `#1A1A1A` | `gray-900` | Main headings |
| Text Secondary | `#666666` | `gray-500` | Secondary/helper text |
| Border | `#E5E5E5` | `gray-200` | Card borders, dividers |
| Error | `#DC2626` | `red-600` | Error messages, delete |
| Success | `#16A34A` | `green-600` | Stock In, success |
| Warning | `#F59E0B` | `amber-500` | Low stock warning |
| Info | `#00B2D8` | `cyan-500` | Info messages |

**Dark Mode:** ❌ Tidak digunakan — light-only

## 3. Typography
- **Heading Font:** Nunito — via Google Fonts (alternatif rounded untuk Gotham Rounded)
- **Body Font:** Inter — via Google Fonts

| Level | Size | Weight | Line Height | Tailwind |
|-------|------|--------|-------------|----------|
| H1 | 30px | ExtraBold (800) | 1.25 | `text-3xl font-extrabold` |
| H2 | 24px | Bold (700) | 1.3 | `text-2xl font-bold` |
| H3 | 20px | Bold (700) | 1.4 | `text-xl font-bold` |
| H4 | 16px | Semibold (600) | 1.4 | `text-base font-semibold` |
| Body | 14px | Regular (400) | 1.5 | `text-sm` |
| Small | 12px | Regular (400) | 1.5 | `text-xs` |
| Caption | 12px | Medium (500) | 1.4 | `text-xs font-medium text-gray-500` |
| Table Header | 12px | Bold (700) | 1.4 | `text-xs font-bold uppercase tracking-wider` |

## 4. Spacing System
- **Base Unit:** 4px
- **Scale:** Tailwind default

| Token | Value | Tailwind |
|-------|-------|---------|
| xs | 4px | `p-1` |
| sm | 8px | `p-2` |
| md | 16px | `p-4` |
| lg | 24px | `p-6` |
| xl | 32px | `p-8` |
| 2xl | 48px | `p-12` |

## 5. Component Styles
- **Border Radius:** `rounded-lg` (8px) untuk cards, `rounded-md` (6px) untuk button/input
- **Shadow:** `shadow-sm` untuk cards, `shadow-md` untuk dropdown/modal
- **Transition:** `transition-all duration-150 ease-in-out`

## Component Inventory
| Component | Status | Notes |
|-----------|--------|-------|
| Button | Defined | Primary (Magenta), Accent (Cyan), Outline, Ghost, Danger |
| Card | Defined | Stat card, Content card |
| Input | Defined | With label, error state |
| Select | Defined | Dropdown for filter |
| Table | Defined | Sortable, paginated |
| Modal | Defined | Confirm dialog |
| Badge | Defined | Status indicator (In Stock/Low Stock/Out of Stock) |
| Sidebar | Defined | Black sidebar — Gacoan style |
| Header | Defined | White with accent stripe |
| Skeleton | Defined | Loading state |
| Toast | Defined | Success/error notification |

### Button
| Variant | Style | Tailwind |
|---------|-------|----------|
| Primary | Magenta fill, white text | `bg-[#EC008C] text-white hover:bg-[#C7007A] rounded-md px-4 py-2 text-sm font-semibold` |
| Accent | Cyan fill, white text | `bg-[#00B2D8] text-white hover:bg-[#0099BA] rounded-md px-4 py-2 text-sm font-semibold` |
| Outline | Border dark | `border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md px-4 py-2` |
| Ghost | No border/fill | `text-gray-600 hover:bg-gray-100 rounded-md px-3 py-2` |
| Danger | Red fill | `bg-red-600 text-white hover:bg-red-700 rounded-md px-4 py-2` |

**Sizes:** `sm` (px-3 py-1.5 text-xs), `md` (px-4 py-2 text-sm), `lg` (px-6 py-3 text-base)

### Card
- **Background:** `bg-white`
- **Border:** `border border-gray-200`
- **Shadow:** `shadow-sm` (hover: `shadow-md` + `transition-shadow`)
- **Padding:** `p-6`
- **Border Radius:** `rounded-lg`

**Card Variants:**
- **Stat Card:** `p-4 flex items-center gap-4 border-l-4 border-l-[#EC008C]` — dengan aksen magenta
- **Content Card:** `p-6 space-y-4`

### Input
- **Border:** `border border-gray-300 rounded-md`
- **Focus:** `ring-2 ring-[#EC008C]/20 border-[#EC008C]`
- **Error:** `border-red-600 ring-red-600/20`
- **Padding:** `px-3 py-2 text-sm`
- **Label:** `text-sm font-medium text-gray-700 mb-1`

### Table
- **Header:** `bg-gray-50 text-xs font-bold uppercase tracking-wider text-gray-500`
- **Row:** `border-b border-gray-100 text-sm hover:bg-gray-50`
- **Padding:** `px-4 py-3`

### Badge
| Variant | Style | When |
|---------|-------|------|
| In Stock | `bg-green-100 text-green-700` | stock > minimum_stock |
| Low Stock | `bg-amber-100 text-amber-700` | stock ≤ minimum_stock (and > 0) |
| Out of Stock | `bg-red-100 text-red-700` | stock = 0 |

### Sidebar
- **Desktop:** `w-60 bg-black text-white fixed h-screen`
- **Mobile/Tablet:** Drawer overlay dari kiri, toggle via burger ☰ di header
- **Active Menu:** `bg-[#EC008C]/10 text-[#EC008C] border-r-2 border-[#EC008C]`
- **Menu Item:** `flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/10`
- **Logo Area:** `border-b border-white/10 px-6 py-5 flex items-center gap-3`

### Header/Navbar
- **Desktop:** `h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6`
- **Mobile:** Menampilkan tombol burger ☰ di kiri
- **Bottom accent:** Garis bawah `border-b-2 border-[#EC008C]` (tipis)
- **Right Side:** Notifikasi 🔔 + Avatar user + dropdown profile

### Modal
- **Overlay:** `bg-black/50 fixed inset-0 z-50`
- **Content:** `bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-auto`
- **Header:** `text-lg font-bold mb-2`
- **Footer (actions):** `flex justify-end gap-3 mt-6`

### Skeleton Loading
- **Pulse animation:** `animate-pulse bg-gray-200 rounded`
- **Row:** `h-4 w-full mb-2`

### Toast
- **Position:** Top-right fixed
- **Success:** `bg-green-50 border border-green-200 text-green-700`
- **Error:** `bg-red-50 border border-red-200 text-red-700`
- **Info:** `bg-cyan-50 border border-cyan-200 text-cyan-700`

### Transitions & Animations
- **Default Duration:** 150ms
- **Easing:** ease-in-out
- **Pattern:** `transition-all duration-150 ease-in-out`
- **Sidebar open/close:** `translate-x` with `duration-200`
- **Modal:** `scale-95 → scale-100` with `opacity`
- **Button hover:** Brightness shift `hover:brightness-90`

## 6. Responsive & Breakpoints
- **Approach:** Mobile-first

| Breakpoint | Value | Description |
|------------|-------|-------------|
| sm | 640px | Mobile landscape |
| md | 768px | Tablet |
| lg | 1024px | Desktop (sidebar visible) |
| xl | 1280px | Large desktop |

**Layout Rules:**
- **Desktop (≥ lg):** Sidebar fixed kiri 240px (hitam), content di kanan
- **Tablet (md - lg):** Sidebar hidden, overlay drawer via ☰, konten full width
- **Mobile (< md):** Sama seperti tablet, drawer full width dengan backdrop hitam
- **Grid Cards:** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4` (stat cards)
- **Tabel:** Horizontal scroll di mobile (`overflow-x-auto`)
- **Form:** Single column di mobile, multi column di desktop

## 7. Iconography
- **Library:** Lucide React (`lucide-react`)
- **Default Size:** 20px (`size={20}` or `h-5 w-5`)
- **Color:** Icon di sidebar pakai `text-gray-400`, active `text-[#EC008C]`
- **Import Pattern:** `import { Package, Plus, Trash2 } from 'lucide-react'`
- **Key Icons:**
  - Dashboard: `LayoutDashboard`
  - Products: `Package`
  - Categories: `FolderTree`
  - Suppliers: `Truck`
  - Stock In: `ArrowDownToLine`
  - Stock Out: `ArrowUpFromLine`
  - History: `History`
  - Reports: `BarChart3`
  - Users: `Users`
  - Search: `Search`
  - Add: `Plus`
  - Edit: `Pencil`
  - Delete: `Trash2`
  - Logout: `LogOut`
  - Notification: `Bell`
  - Menu (burger): `Menu`
  - Close: `X`

## Design Tokens (Three-Layer Architecture)

### Primitive Tokens
```css
/* Brand Colors (Mie Gacoan Inspired) */
--color-magenta: #EC008C;
--color-magenta-hover: #C7007A;
--color-magenta-light: #FCE4F0;
--color-cyan: #00B2D8;
--color-cyan-hover: #0099BA;

/* Neutrals */
--color-black: #000000;
--color-white: #FFFFFF;
--color-gray-50: #F5F5F5;
--color-gray-100: #F0F0F0;
--color-gray-200: #E5E5E5;
--color-gray-300: #CCCCCC;
--color-gray-500: #666666;
--color-gray-700: #333333;
--color-gray-900: #1A1A1A;

/* Status */
--color-green-100: #DCFCE7;
--color-green-600: #16A34A;
--color-green-700: #15803D;
--color-amber-100: #FEF3C7;
--color-amber-500: #F59E0B;
--color-amber-700: #B45309;
--color-red-100: #FEE2E2;
--color-red-600: #DC2626;
--color-red-700: #B91C1C;

/* Spacing */
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;

/* Typography */
--font-family-heading: 'Nunito', sans-serif;
--font-family-body: 'Inter', sans-serif;
--font-size-xs: 12px;
--font-size-sm: 14px;
--font-size-base: 16px;
--font-size-lg: 20px;
--font-size-xl: 24px;
--font-size-3xl: 30px;
```

### Semantic Tokens
```css
--color-primary: var(--color-magenta);
--color-primary-hover: var(--color-magenta-hover);
--color-primary-light: var(--color-magenta-light);
--color-accent: var(--color-cyan);
--color-accent-hover: var(--color-cyan-hover);
--color-bg-page: var(--color-gray-50);
--color-bg-surface: var(--color-white);
--color-bg-sidebar: var(--color-black);
--color-text-primary: var(--color-gray-900);
--color-text-secondary: var(--color-gray-500);
--color-text-sidebar: var(--color-white);
--color-text-sidebar-muted: #CCCCCC;
--color-border: var(--color-gray-200);
--color-success: var(--color-green-600);
--color-warning: var(--color-amber-500);
--color-error: var(--color-red-600);
--color-info: var(--color-cyan);
```

### Component Tokens
```css
--btn-primary-bg: var(--color-primary);
--btn-primary-text: var(--color-white);
--btn-primary-hover-bg: var(--color-primary-hover);
--btn-accent-bg: var(--color-accent);
--btn-accent-hover-bg: var(--color-accent-hover);
--card-bg: var(--color-bg-surface);
--card-border: var(--color-border);
--card-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--sidebar-width: 240px;
--sidebar-bg: var(--color-black);
--header-height: 64px;
--header-accent: var(--color-primary);
--input-focus-ring: var(--color-primary);
```

## Login Page Spesifik
- **Background:** Putih atau gradasi magenta-ke-putih
- **Logo:** Di tengah atas, ikon inventory + teks dengan warna magenta
- **Card Login:** `bg-white shadow-md rounded-lg p-8 max-w-sm`
- **Tombol Login:** `bg-[#EC008C] text-white w-full font-bold`
- **Footer:** Teks kecil "Inventory Management System v1.0"

## Brand Identity (Mie Gacoan Inspired)
- **Warna Dominan:** Magenta (`#EC008C`) — berani, energik, muda
- **Aksen:** Cyan (`#00B2D8`) — kontras segar
- **Background:** Putih bersih (#FFFFFF) atau abu ringan (#F5F5F5)
- **Sidebar:** Hitam total (#000000) — bold contrast
- **Font Headings:** Nunito (rounded, friendly — alternatif Gotham Rounded)
- **Font Body:** Inter (clean, legible)
- **Tone:** Bold, modern, percaya diri, young & energetic

## Design Assets Location
Semua aset design disimpan **lokal** di folder project:

```
assets/design/
├── logo/          # Logo aplikasi (SVG/PNG)
├── banner/        # Banner login page & lainnya
├── brand/         # Brand guidelines, identity docs
└── slides/        # HTML presentation files
```

## Non-Goals / Not Defined Yet
- Dark mode — ❌ Tidak digunakan
- Foto barang — ❌ Tidak digunakan
- Advanced charts (Chart.js nanti jika diperlukan)

## Assumptions & Open Questions
- Menggunakan Lucide React untuk icon
- shadcn/ui akan diinstall via CLI
- Nunito (Google Fonts) sebagai alternatif gratis Gotham Rounded
- Inter (Google Fonts) untuk body text