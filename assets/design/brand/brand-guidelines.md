# Brand Guidelines - Inventory Management System

## Brand Identity

**Nama:** Inventory Management System  
**Inspirasi:** Mie Gacoan Style — magenta energik + cyan segar  
**Karakter:** Modern, profesional, mudah digunakan

---

## Logo

### Logo Full (Horizontal)
- **File:** `../logo/logo.svg`
- **Penggunaan:** Sidebar, header, halaman utama
- **Minimum size:** Width 120px

### Logo Icon
- **File:** `../logo/logo-icon.svg`
- **Penggunaan:** Favicon, loading screen, space terbatas
- **Minimum size:** 32x32px

### Logo Usage Rules
1. Jangan stretch atau distort logo
2. Berikan ruang kosong minimal 16px di sekitar logo
3. Logo harus terlihat jelas di atas background putih atau gelap
4. Gunakan versi full untuk brand recognition, icon untuk space terbatas

---

## Color Palette

### Primary Colors

| Color | Hex | Tailwind | Penggunaan |
|-------|-----|----------|------------|
| Magenta Gacoan | `#EC008C` | `pink-600` | **Brand main** — buttons, links, active states |
| Magenta Hover | `#C7007A` | `pink-700` | Hover state, pressed |
| Magenta Light | `#FCE4F0` | `pink-100` | Backgrounds, tags |
| Cyan Gacoan | `#00B2D8` | `cyan-500` | **Accent** — info, secondary actions |
| Cyan Light | `#E0F7FA` | `cyan-50` | Info backgrounds |

### Neutral Colors

| Color | Hex | Tailwind | Penggunaan |
|-------|-----|----------|------------|
| Dark | `#1F2937` | `gray-800` | Sidebar, text utama |
| Gray | `#6B7280` | `gray-500` | Text sekunder, placeholder |
| Light Gray | `#F3F4F6` | `gray-100` | Background, borders |
| White | `#FFFFFF` | `white` | Cards, content area |

### Status Colors

| Color | Hex | Tailwind | Penggunaan |
|-------|-----|----------|------------|
| Success | `#10B981` | `green-500` | Berhasil, stok masuk |
| Warning | `#F59E0B` | `amber-500` | Peringatan, stok rendah |
| Error | `#EF4444` | `red-500` | Error, stok habis |
| Info | `#00B2D8` | `cyan-500` | Informasi |

---

## Typography

### Font Family
- **Heading:** Nunito (weights: 700, 800)
- **Body:** Inter (weights: 400, 500, 600)

### Type Scale

| Element | Size | Weight | Line Height |
|---------|------|--------|-------------|
| H1 | 32px | 800 | 1.2 |
| H2 | 24px | 700 | 1.3 |
| H3 | 20px | 700 | 1.4 |
| Body | 16px | 400 | 1.5 |
| Small | 14px | 400 | 1.5 |
| Caption | 12px | 500 | 1.4 |

---

## Components

### Buttons

**Primary Button:**
```
bg-[#EC008C] text-white hover:bg-[#C7007A] rounded-md px-4 py-2 text-sm font-semibold
```

**Secondary Button:**
```
bg-[#00B2D8] text-white hover:bg-[#0099BA] rounded-md px-4 py-2 text-sm font-semibold
```

**Outline Button:**
```
border border-[#EC008C] text-[#EC008C] hover:bg-[#FCE4F0] rounded-md px-4 py-2 text-sm font-semibold
```

### Cards

**Stat Card:**
```
p-4 flex items-center gap-4 border-l-4 border-l-[#EC008C] bg-white rounded-lg shadow
```

**Content Card:**
```
bg-white rounded-lg shadow p-6
```

### Forms

**Input:**
```
w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EC008C]/20 focus:border-[#EC008C]
```

**Select:**
```
w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#EC008C]/20 focus:border-[#EC008C]
```

---

## Layout Components

### Sidebar
- **Width:** 256px (fixed)
- **Background:** `#1F2937` (dark)
- **Active menu:** `bg-[#EC008C]/10 text-[#EC008C] border-r-2 border-[#EC008C]`
- **Icon color:** `text-gray-400`, active: `text-[#EC008C]`

### Header
- **Background:** White
- **Border:** `border-b-2 border-[#EC008C]` (bottom accent)
- **Height:** 64px

### Login Page
- **Background:** White atau gradasi magenta-ke-putih
- **Logo:** Di tengah atas, ikon inventory + teks dengan warna magenta
- **Form card:** Centered, max-width 400px
- **Tombol login:** `bg-[#EC008C] text-white w-full font-bold`

---

## Tone of Voice

### Personality
- **Professional** — Jelas dan terstruktur
- **Friendly** — Mudah dipahami
- **Confident** — Tidak ragu-ragu

### Writing Style
- Gunakan Bahasa Indonesia yang baku
- Hindari jargon teknis yang tidak perlu
- Gunakan kata sederhana dan langsung
- Format: judul kapitalisasi, penjelasan normal

### Contoh
- ✅ "Stok berhasil ditambahkan"
- ❌ "Data stock telah berhasil di-update ke dalam database"

---

## UI Application Examples

### Sidebar
```html
<aside class="w-64 bg-gray-800 text-white">
  <div class="p-4">
    <img src="logo.svg" alt="Inventory" />
  </div>
  <nav>
    <a class="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white">
      <Icon /> Dashboard
    </a>
    <a class="flex items-center gap-3 px-4 py-3 bg-[#EC008C]/10 text-[#EC008C] border-r-2 border-[#EC008C]">
      <Icon /> Products
    </a>
  </nav>
</aside>
```

### Stat Card
```html
<div class="p-4 flex items-center gap-4 border-l-4 border-l-[#EC008C] bg-white rounded-lg shadow">
  <div class="p-3 bg-[#FCE4F0] rounded-full">
    <Icon class="text-[#EC008C]" />
  </div>
  <div>
    <p class="text-sm text-gray-500">Total Products</p>
    <p class="text-2xl font-bold text-gray-800">150</p>
  </div>
</div>
```

### Button
```html
<button class="bg-[#EC008C] text-white hover:bg-[#C7007A] rounded-md px-4 py-2 text-sm font-semibold">
  Add Product
</button>
```

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Primary */
  --color-magenta: #EC008C;
  --color-magenta-hover: #C7007A;
  --color-magenta-light: #FCE4F0;
  
  /* Secondary */
  --color-cyan: #00B2D8;
  --color-cyan-light: #E0F7FA;
  
  /* Neutral */
  --color-dark: #1F2937;
  --color-gray: #6B7280;
  --color-light-gray: #F3F4F6;
  
  /* Status */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  
  /* Typography */
  --font-heading: 'Nunito', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```
