# Coding Standards (Rules)

## Document Role
- **Source of Truth:** Coding standards, AI behavior constraints, and implementation safety rules
- **Primary Owner:** `brainstorm-rules`
- **Out of Scope:** Product scope decisions, schema design, endpoint payload contracts, and task sequencing

---

## 1. AI Persona & Tech Stack
> You are an expert developer in: **JavaScript (ES2022+)**, **React (Vite)**, **Tailwind CSS v3**, **shadcn/ui**, **Express.js**, **Sequelize ORM**, **PostgreSQL 15+**.

**Prioritize:**
- Functional components with hooks (React)
- Utility-first styling (Tailwind CSS)
- MVC pattern: routes → middleware → controller → service → repository
- Parameterized queries via Sequelize ORM
- JWT authentication with bcrypt password hashing
- Server-side validation for all inputs
- Responsive mobile-first design

**Avoid:**
- Class components (React)
- Raw SQL string concatenation
- `any` type (if using TypeScript)
- Storing secrets in code or `.env` files committed to git
- Direct DOM manipulation
- Inline styles (use Tailwind classes)

---

## 2. Naming Conventions
| Type | Convention | Example |
|------|-----------|---------|
| Variables & Functions | camelCase | `getProductList`, `isLoading` |
| React Components | PascalCase | `ProductCard`, `LoginForm` |
| Files & Folders (FE) | kebab-case | `product-card.jsx`, `auth/` |
| Files & Folders (BE) | kebab-case | `product-controller.js`, `routes/` |
| Global Constants | UPPER_CASE | `MAX_RETRIES`, `API_URL` |
| Event Handlers | prefix `handle` | `handleSubmit`, `handleClick` |
| Booleans | prefix `is/has/can` | `isLoading`, `hasError`, `canEdit` |
| Database Tables | snake_case, plural | `users`, `stock_transactions` |
| Database Columns | snake_case | `created_at`, `minimum_stock` |
| API Routes | kebab-case | `/stock-in`, `/stock-out` |

---

## 3. Code Style & Quality
- **JavaScript:** Gunakan ES2022+ (arrow functions, destructuring, spread, optional chaining)
- **Console.log:** ❌ DILARANG di production — gunakan logging library atau hapus sebelum commit
- **Error Handling:** Wajib try-catch untuk async operations. Gunakan early return (guard clauses)
- **Else after return:** ❌ DILARANG — gunakan early return pattern

```javascript
// ✅ BENAR — early return
function processStock(product) {
  if (!product) return { error: 'Product not found' }
  if (product.stock <= 0) return { error: 'Out of stock' }
  return doSomething(product)
}

// ❌ SALAH — deep nesting
function processStock(product) {
  if (product) {
    if (product.stock > 0) {
      return doSomething(product)
    }
  }
}
```

- **Import order:** builtin → external → internal → relative
- **Max function length:** Maksimal 50 baris per fungsi
- **Comments:** Minimal — hanya untuk menjelaskan "why" bukan "what"
- **Dependency ladder:** Reuse existing code → standard library → installed dependency → new dependency (wajib izin)
- **Magic numbers/strings:** Simpan di constants/variables, jangan hardcode di tengah logic

---

## 4. Security Rules
> **WAJIB:** Sebelum menulis kode yang melibatkan user input, auth, atau database access — lakukan security check.

- **Token Storage:** Simpan JWT di **Authorization Bearer header**. Jangan pernah di URL/query string
- **Password:** Hash dengan **bcrypt** (salt rounds ≥ 10). Jangan pernah simpan plain text
- **Input Validation:** Validasi semua input di server-side. Gunakan Joi/Zod atau manual validation
- **SQL Injection:** Cegah dengan Sequelize ORM (parameterized queries). Jangan pernah concatenate input ke query
- **XSS:** Hindari `dangerouslySetInnerHTML`. Sanitize output jika perlu menampilkan HTML
- **CORS:** Atur origin spesifik di production. Jangan gunakan `*` di production
- **Environment Variables:** Semua konfigurasi rahasia via `.env`. Wajib ada `.env.example` di repo
- **RBAC:** Middleware `authorize(['admin'])` di setiap endpoint Admin. Jangan hanya di frontend
- **Rate Limiting:** Endpoint login wajib rate limited (5 attempts per 15 minutes)
- **Auto Logout:** JWT expiry diatur hingga 23:59 — user auto logout jam 00.00 setiap hari

---

## 5. AI Behavior Rules
- **Bahasa Komentar:** Bahasa Indonesia
- **Pesan Error (user-facing):** Bahasa Indonesia
- **Dokumentasi:** Bahasa Indonesia
- **Saat Ambigu:** Tanya user dulu, jangan asumsi
- **Saat Error:** Analisis log dulu, jangan tebak
- **Install Package Baru:** Minta izin dulu + sebutkan alasannya
- **Modifikasi di Luar Scope:** ❌ Dilarang tanpa konfirmasi
- **Implementasi Kompleks:** Tunjukkan rencana/logika sebelum implementasi

## Rule Priority
- **Prioritas:** Security → correctness → data protection → consistency → maintainability → convenience
- Jika dua rule bertentangan, pilih prioritas lebih tinggi dan catat trade-off
- Jika ada pengecualian lokal, tandai dengan komentar `tradeoff:` dan jelaskan trigger upgrade-nya

---

## 6. Phase Completion Workflow

> **WAJIB:** Setelah setiap phase selesai, lakukan langkah berikut secara berurutan:

1. **Spec Compliance** — Jalankan skill `spec-compliance` untuk verifikasi kode sesuai spesifikasi
2. **Code Review** — Jalankan skill `skill code-review` untuk review kualitas & keamanan kode
3. **Update README.md** — Perbarui file `README.md` di root project sesuai template yang berlaku
4. **Commit** — Buat commit dengan pesan conventional commit sesuai isi phase
5. **Push** — Push ke remote repository GitHub

**Commit message format:** `[type](scope): [description]`
- Contoh: `feat(backend): setup Express.js with folder structure`
- Contoh: `chore(project): init project setup and configuration`

**Remote repository:** `https://github.com/Qidil/inventory-management-system.git`

---

## 7. Git Workflow
**Conventional Commits** — wajib untuk semua commit.

| Type | When |
|------|------|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `chore:` | Maintenance (update deps, config) |
| `docs:` | Documentation changes |
| `refactor:` | Code restructure without feature/bug |
| `style:` | Formatting (no logic change) |
| `test:` | Add or fix tests |
| `perf:` | Performance improvement |

**Example:** `feat(auth): add JWT login endpoint`

**Branch naming:**
- `feature/[fitur-name]`
- `fix/[bug-name]`

**Catatan:**
- Commit setelah setiap task selesai
- Jangan commit secrets, `.env`, `node_modules/`
- Tulis pesan commit yang deskriptif dalam Bahasa Indonesia

---

## 8. Linter, Formatter & Testing
- **ESLint:** Flat config (`eslint.config.js`). Rules: `eslint:recommended`
- **Prettier:** `semi: true`, `singleQuote: true`, `tabWidth: 2`, `printWidth: 100`
- **.editorconfig:** `charset=utf-8`, `end_of_line=lf`, `insert_final_newline=true`
- **Test Framework:** Belum ditentukan (manual testing untuk MVP)
- **Coverage Minimum:** Tidak ada untuk MVP
- **Pra-commit:** Cek tidak ada `console.log`, tidak ada file `.env` tercommit

---

## [FORBIDDEN]

> Check list ini sebelum menulis kode. Melanggar = kode ditolak.

| # | Forbidden | Why |
|---|-----------|-----|
| F-01 | ❌ Jangan hardcode secrets, URL, atau konfigurasi — pakai env vars | Security & portability |
| F-02 | ❌ Jangan concatenate user input ke SQL — pakai Sequelize/parameterized | SQL Injection |
| F-03 | ❌ Jangan pakai `console.log` di production code | Info leak, noise |
| F-04 | ❌ Jangan simpan password plain text | Security |
| F-05 | ❌ Jangan edit stock langsung di produk — wajib via Stock In/Out | Data integrity |
| F-06 | ❌ Jangan hard delete produk — wajib soft delete | Riwayat transaksi |

## Assumptions & Exceptions
- Menggunakan JavaScript (bukan TypeScript) untuk MVP — bisa migrasi ke TS nanti
- Testing manual untuk MVP — automated test menyusul