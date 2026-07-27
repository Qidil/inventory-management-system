# Task: Inventory Management System

> **Total Phases:** 10 | **Total Tasks:** 52 | **Last Updated:** 2026-07-27

## Document Role
- **Source of Truth:** Execution plan derived from approved spec documents
- **Primary Owner:** `brainstorm-task`
- **Out of Scope:** New product scope, new schema/API decisions, and code-quality review findings

## Upstream Dependencies
| Topic | Canonical Source |
|------|-------------------|
| Product scope | `project-context/PRD.md` |
| Technical structure | `project-context/architecture.md` |
| Data contract | `project-context/schema.md` |
| API contract | `project-context/api.md` |
| UI contract | `project-context/StyleGuide.md` |
| Coding rules | `project-context/rules.md` |

## Execution Rules
- Work through tasks **one at a time** in order within each phase.
- After each **phase** completes, **STOP** and wait for user confirmation before next phase.
- Update status `[ ]` to `[x]` when task done.
- If task blocked, mark `[~]` and note reason.

---

## Progress Overview
| Phase | Name | Status | Progress |
|-------|------|--------|----------|
| 1 | Project Setup & Config | [ ] | 0/4 |
| 2 | Database & Models | [ ] | 0/7 |
| 3 | Backend: Auth | [ ] | 0/3 |
| 4 | Backend: CRUD Master Data | [ ] | 0/7 |
| 5 | Backend: Transactions & Dashboard | [ ] | 0/4 |
| 6 | Backend: User Management | [ ] | 0/3 |
| 6.5 | Design Assets (Logo, Brand, Banner, Slides) | [ ] | 0/4 |
| 7 | Frontend: Setup & Layout | [ ] | 0/7 |
| 8 | Frontend: Dashboard & Master Data | [ ] | 0/6 |
| 9 | Frontend: Transactions, Reports & Users | [ ] | 0/7 |

## Reading Order for AI
1. Read `Execution Rules`
2. Read `Progress Overview`
3. Read the current phase only
4. Use `References` and `Traceability IDs` before looking elsewhere

---

## Phase 1: Project Setup & Config
> **Dependencies:** None
> **Goal:** Struktur folder, dependency, dan tooling siap untuk development

- [ ] **Task 1.1: Init folder struktur & root package.json**
  - **Files:** `inventory-management-system/` (root)
  - **Description:** Buat root folder dengan `frontend/` dan `backend/`, root `package.json` with workspaces
  - **References:** `project-context/architecture.md#5-folder-structure`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] Folder `frontend/` dan `backend/` terbuat
    - [ ] Root `package.json` dengan workspaces config

- [ ] **Task 1.2: Setup Backend (Express.js)**
  - **Files:** `backend/package.json`, `backend/src/app.js`, `backend/src/config/`
  - **Description:** Init Express.js project with folder structure: config, models, controllers, services, repositories, routes, middleware, utils
  - **References:** `project-context/architecture.md#5-folder-structure`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] `npm init` completed, Express terinstall
    - [ ] Folder structure sesuai spec
    - [ ] `app.js` bisa jalan di port 3000

- [ ] **Task 1.3: Setup Frontend (Vite + React)**
  - **Files:** `frontend/package.json`, `frontend/src/`
  - **Description:** Init React with Vite, folder structure: components, pages, context, services, hooks, utils
  - **References:** `project-context/architecture.md#5-folder-structure`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] `npm create vite@latest` completed
    - [ ] Folder structure sesuai spec
    - [ ] `npm run dev` jalan tanpa error

- [ ] **Task 1.4: Config ESLint, Prettier, .editorconfig, env**
  - **Files:** `eslint.config.js`, `.prettierrc`, `.editorconfig`, `backend/.env.example`, `frontend/.env.example`
  - **Description:** Setup ESLint flat config, Prettier (semi:true, singleQuote:true, tabWidth:2, printWidth:100), .editorconfig (UTF-8, LF), dan template .env
  - **References:** `project-context/rules.md#7-linter-formatter--testing`
  - **Traceability IDs:** `RULE-03`
  - **Acceptance Criteria:**
    - [ ] ESLint jalan tanpa error di frontend & backend
    - [ ] Prettier format sesuai config
    - [ ] `.env.example` ada (tidak berisi secrets)

---

## Phase 2: Database & Models
> **Dependencies:** Phase 1 complete
> **Goal:** Semua tabel PostgreSQL terbuat via Sequelize migration + model

- [ ] **Task 2.1: Install & config Sequelize + PostgreSQL**
  - **Files:** `backend/src/config/database.js`, `backend/.env`
  - **Description:** Install sequelize, pg, pg-hstore. Config database connection via env vars. Buat `.sequelizerc`
  - **References:** `project-context/architecture.md#2-tech-stack`, `project-context/schema.md#global-conventions`
  - **Traceability IDs:** `DATA-01` `DATA-02` `DATA-03` `DATA-04` `DATA-05`
  - **Acceptance Criteria:**
    - [ ] Sequelize CLI terinstall
    - [ ] Koneksi ke PostgreSQL berhasil (config menunggu DB creds dari user)
    - [ ] Migration folder `backend/src/models/migrations` terbuat

- [ ] **Task 2.2: Migration & Model — Users**
  - **Files:** `backend/src/models/user.js`, migration file `XXXXXX-create-users.js`
  - **Description:** Migration dan Sequelize model untuk tabel `users` (id UUID, name, email UNIQUE, password bcrypt, role, timestamps)
  - **References:** `project-context/schema.md#table-data-01-users`
  - **Traceability IDs:** `DATA-01` `FEAT-01` `FEAT-10`
  - **Acceptance Criteria:**
    - [ ] Migration create-table berhasil
    - [ ] Model memiliki validasi: email unique, name required, role default 'staff'
    - [ ] Rollback berfungsi

- [ ] **Task 2.3: Migration & Model — Categories**
  - **Files:** `backend/src/models/category.js`, migration file `XXXXXX-create-categories.js`
  - **Description:** Migration dan model untuk tabel `categories` (id UUID, name UNIQUE, description nullable)
  - **References:** `project-context/schema.md#table-data-02-categories`
  - **Traceability IDs:** `DATA-02` `FEAT-02`
  - **Acceptance Criteria:**
    - [ ] Migration berhasil
    - [ ] Model dengan hasMany products

- [ ] **Task 2.4: Migration & Model — Suppliers**
  - **Files:** `backend/src/models/supplier.js`, migration file `XXXXXX-create-suppliers.js`
  - **Description:** Migration dan model untuk tabel `suppliers` (id UUID, name, phone, email, address)
  - **References:** `project-context/schema.md#table-data-03-suppliers`
  - **Traceability IDs:** `DATA-03` `FEAT-03`
  - **Acceptance Criteria:**
    - [ ] Migration berhasil
    - [ ] Model dengan hasMany products

- [ ] **Task 2.5: Migration & Model — Products**
  - **Files:** `backend/src/models/product.js`, migration file `XXXXXX-create-products.js`
  - **Description:** Migration dan model untuk tabel `products` (id UUID, FK category/supplier, code UNIQUE, name, description, price CHECK>0, stock DEFAULT 0 CHECK>=0, minimum_stock, deleted_at soft delete)
  - **References:** `project-context/schema.md#table-data-04-products`
  - **Traceability IDs:** `DATA-04` `FEAT-04` `BR-01` `BR-04` `BR-06` `BR-09`
  - **Acceptance Criteria:**
    - [ ] Migration berhasil dengan semua FK dan constraints
    - [ ] Soft delete via `deleted_at` column
    - [ ] Paranoia plugin atau manual soft delete filter

- [ ] **Task 2.6: Migration & Model — Stock Transactions**
  - **Files:** `backend/src/models/stockTransaction.js`, migration file `XXXXXX-create-stock-transactions.js`
  - **Description:** Migration dan model untuk tabel `stock_transactions` (id UUID, FK product/user, type IN/OUT, quantity CHECK>0, note, created_at — no updated_at)
  - **References:** `project-context/schema.md#table-data-05-stock-transactions`
  - **Traceability IDs:** `DATA-05` `FEAT-05` `FEAT-06` `FEAT-07` `BR-10`
  - **Acceptance Criteria:**
    - [ ] Migration berhasil dengan semua FK dan constraints
    - [ ] Tidak ada kolom `updated_at`
    - [ ] type hanya menerima 'IN' atau 'OUT'

- [ ] **Task 2.7: Seeder — Admin user default + sample data**
  - **Files:** `backend/src/seeders/XXXXXX-demo-data.js`
  - **Description:** Seed admin default (email: admin@mail.com, password terhash) + sample categories, suppliers, products
  - **References:** `project-context/rules.md#4-security-rules`
  - **Traceability IDs:** `FEAT-01` `BR-05`
  - **Acceptance Criteria:**
    - [ ] Admin user bisa login setelah seed
    - [ ] Password di-hash bcrypt (salt >= 10)
    - [ ] Sample data tercatat di DB

---

## Phase 3: Backend: Auth
> **Dependencies:** Phase 2 complete (Users model & seeder ready)
> **Goal:** Login JWT + middleware authenticate + RBAC authorize berfungsi

- [ ] **Task 3.1: Auth service & controller — Login**
  - **Files:** `backend/src/services/authService.js`, `backend/src/controllers/authController.js`, `backend/src/routes/auth.js`
  - **Description:** Implementasi POST /auth/login: validasi email/password → bcrypt verify → generate JWT (expiry 23:59) → return token + user info
  - **References:** `project-context/api.md#api-01-post-authlogin`, `project-context/PRD.md#br-11`
  - **Traceability IDs:** `API-01` `FEAT-01` `NFR-02` `NFR-03` `BR-11`
  - **Acceptance Criteria:**
    - [ ] Login dengan email & password valid → return 200 + JWT
    - [ ] Login dengan password salah → return 401
    - [ ] JWT expiry diatur hingga 23:59 hari yang sama
    - [ ] Token berisi payload: id, role, exp

- [ ] **Task 3.2: Middleware — Authenticate & Authorize**
  - **Files:** `backend/src/middleware/authenticate.js`, `backend/src/middleware/authorize.js`
  - **Description:** Middleware `authenticate`: verifikasi JWT dari Authorization Bearer header, attach user ke req. Middleware `authorize(['admin'])`: cek role dari user
  - **References:** `project-context/architecture.md#7-authentication--authorization`, `project-context/PRD.md#ac-03`
  - **Traceability IDs:** `FEAT-01` `NFR-03` `AC-03`
  - **Acceptance Criteria:**
    - [ ] Token valid → req.user terisi
    - [ ] Token invalid/expired → 401
    - [ ] Staff akses endpoint Admin → 403
    - [ ] Chain: `authenticate` → `authorize(['admin'])`

- [ ] **Task 3.3: Rate limiting on login endpoint**
  - **Files:** `backend/src/middleware/rateLimiter.js`, update `backend/src/routes/auth.js`
  - **Description:** Implementasi rate limiting dengan express-rate-limit: 5 attempts per 15 menit per IP di endpoint login
  - **References:** `project-context/api.md#rate-limiting`, `project-context/PRD.md#nfr-03`
  - **Traceability IDs:** `NFR-03` `API-01`
  - **Acceptance Criteria:**
    - [ ] >5 failed login attempts dalam 15 menit → 429
    - [ ] Rate limit message sesuai error catalog

---

## Phase 4: Backend: CRUD Master Data
> **Dependencies:** Phase 3 complete (auth middleware ready)
> **Goal:** CRUD Categories, Suppliers, Products berfungsi penuh dengan RBAC

- [ ] **Task 4.1: Categories — Service, Controller, Routes**
  - **Files:** `backend/src/services/categoryService.js`, `backend/src/controllers/categoryController.js`, `backend/src/routes/categories.js`
  - **Description:** CRUD Categories: GET /categories, POST /categories (Admin), GET /categories/:id, PUT /categories/:id (Admin), DELETE /categories/:id (Admin) — RESTRICT jika ada produk
  - **References:** `project-context/api.md#api-02-to-api-06`
  - **Traceability IDs:** `FEAT-02` `API-02` `API-03` `API-04` `API-05` `API-06`
  - **Acceptance Criteria:**
    - [ ] List semua kategori
    - [ ] Create kategori (Admin only) — validasi name unique
    - [ ] Update kategori (Admin only)
    - [ ] Delete kategori (Admin only) — gagal jika ada produk terkait
    - [ ] Response format sesuai standar

- [ ] **Task 4.2: Suppliers — Service, Controller, Routes**
  - **Files:** `backend/src/services/supplierService.js`, `backend/src/controllers/supplierController.js`, `backend/src/routes/suppliers.js`
  - **Description:** CRUD Suppliers: GET /suppliers, POST /suppliers (Admin), GET /suppliers/:id, PUT /suppliers/:id (Admin), DELETE /suppliers/:id (Admin) — RESTRICT jika ada produk
  - **References:** `project-context/api.md#api-07-to-api-11`
  - **Traceability IDs:** `FEAT-03` `API-07` `API-08` `API-09` `API-10` `API-11`
  - **Acceptance Criteria:**
    - [ ] CRUD lengkap dengan RBAC
    - [ ] Validasi input server-side
    - [ ] Delete RESTRICT jika ada produk terkait

- [ ] **Task 4.3: Products — Repository**
  - **Files:** `backend/src/repositories/productRepository.js`
  - **Description:** Repository layer untuk Products: findAll (dengan filter status: in_stock/low_stock/out_of_stock, search, pagination, soft delete filter), findById, create, update, softDelete
  - **References:** `project-context/schema.md#table-data-04-products`
  - **Traceability IDs:** `DATA-04` `FEAT-04` `BR-04`
  - **Acceptance Criteria:**
    - [ ] findAll exclude soft-deleted records
    - [ ] Filter status: in_stock (stock > minimum_stock), low_stock (stock <= minimum_stock AND > 0), out_of_stock (stock = 0)
    - [ ] Pagination + search by name/code

- [ ] **Task 4.4: Products — Service**
  - **Files:** `backend/src/services/productService.js`
  - **Description:** Business logic untuk Products: validasi unique code, category/supplier exists, soft delete logic
  - **References:** `project-context/api.md#resource-products`
  - **Traceability IDs:** `FEAT-04` `BR-06`
  - **Acceptance Criteria:**
    - [ ] Validasi code unique sebelum create
    - [ ] Tidak bisa edit stock langsung (hanya via transaksi)
    - [ ] Soft delete: set deleted_at, bukan hapus

- [ ] **Task 4.5: Products — Controller & Routes**
  - **Files:** `backend/src/controllers/productController.js`, `backend/src/routes/products.js`
  - **Description:** Controller + Routes: GET /products (Required), POST /products (Admin), GET /products/:id (Required), PUT /products/:id (Admin), DELETE /products/:id (Admin — soft delete)
  - **References:** `project-context/api.md#api-12-to-api-16`
  - **Traceability IDs:** `FEAT-04` `API-12` `API-13` `API-14` `API-15` `API-16`
  - **Acceptance Criteria:**
    - [ ] GET /products dengan pagination, search, filter status/kategori/supplier
    - [ ] GET /products/:id mengembalikan detail + transaction history
    - [ ] POST/PUT produk (Admin only)
    - [ ] DELETE soft delete (Admin only)

- [ ] **Task 4.6: Validasi server-side — Joi/Zod schemas**
  - **Files:** `backend/src/utils/validators.js`
  - **Description:** Buat schema validasi untuk semua input: login, category, supplier, product, transaction. Pakai Joi atau library validasi sederhana
  - **References:** `project-context/rules.md#4-security-rules`, `project-context/PRD.md#nfr-04`
  - **Traceability IDs:** `NFR-04`
  - **Acceptance Criteria:**
    - [ ] Setiap input request divalidasi sebelum masuk controller
    - [ ] Error response sesuai format (field + message)

- [ ] **Task 4.7: Global error handler middleware**
  - **Files:** `backend/src/middleware/errorHandler.js`
  - **Description:** Middleware penanganan error global: format response error sesuai standar (success: false, message, code, errors[])
  - **References:** `project-context/api.md#error-catalog`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] Semua error terformat sesuai standar
    - [ ] Error catalog codes (VALIDATION_ERROR, UNAUTHORIZED, FORBIDDEN, etc.)

---

## Phase 5: Backend: Transactions & Dashboard
> **Dependencies:** Phase 4 complete (Products CRUD + models ready)
> **Goal:** Stock In/Out, History, Dashboard, Reports berfungsi

- [ ] **Task 5.1: Stock In & Stock Out — Service, Controller, Routes**
  - **Files:** `backend/src/services/transactionService.js`, `backend/src/controllers/transactionController.js`, `backend/src/routes/transactions.js`
  - **Description:** POST /transactions/stock-in (Required) dan POST /transactions/stock-out (Required). Validasi: Stock In → product exists, qty > 0. Stock Out → product exists, qty > 0, stock cukup. Insert transaction + update product stock dalam 1 transaksi DB
  - **References:** `project-context/api.md#api-17-to-api-18`, `project-context/PRD.md#br-02` `br-03` `br-07` `br-10`
  - **Traceability IDs:** `FEAT-05` `FEAT-06` `API-17` `API-18` `BR-02` `BR-03` `BR-07` `BR-10`
  - **Acceptance Criteria:**
    - [ ] Stock In: stok bertambah, transaction tercatat
    - [ ] Stock Out: stok berkurang (jika cukup), transaction tercatat
    - [ ] Stock Out > stok → 422 (UNPROCESSABLE)
    - [ ] Semua dalam 1 DB transaction (atomic)
    - [ ] Mencatat user_id dari JWT

- [ ] **Task 5.2: Transaction History & Detail — Controller, Routes**
  - **Files:** Update `backend/src/controllers/transactionController.js`, update routes
  - **Description:** GET /transactions (Required) — list history dengan filter type, start_date, end_date, pagination. GET /transactions/product/:productId (Required) — history per produk
  - **References:** `project-context/api.md#api-19-to-api-20`
  - **Traceability IDs:** `FEAT-07` `API-19` `API-20`
  - **Acceptance Criteria:**
    - [ ] List transaksi dengan pagination
    - [ ] Filter by type (IN/OUT) dan date range
    - [ ] History per produk menampilkan semua transaksi produk tersebut

- [ ] **Task 5.3: Dashboard endpoint**
  - **Files:** `backend/src/services/dashboardService.js`, `backend/src/controllers/dashboardController.js`, `backend/src/routes/dashboard.js`
  - **Description:** GET /dashboard (Required): total_products, total_categories, stock_in_today, stock_out_today, low_stock_products, out_of_stock_products, chart_7_days (in/out per day), recent_activities (last 10)
  - **References:** `project-context/api.md#api-21-get-dashboard`
  - **Traceability IDs:** `FEAT-08` `API-21`
  - **Acceptance Criteria:**
    - [ ] Semua statistik akurat
    - [ ] Chart 7 hari berisi data 7 hari terakhir
    - [ ] Recent activities menampilkan 10 transaksi terakhir

- [ ] **Task 5.4: Reports endpoint**
  - **Files:** `backend/src/services/reportService.js`, `backend/src/controllers/reportController.js`, `backend/src/routes/reports.js`
  - **Description:** GET /reports (Admin only): filter start_date, end_date, type (stock_in, stock_out, all). Return data agregat
  - **References:** `project-context/api.md#api-22-get-reports`
  - **Traceability IDs:** `FEAT-09` `API-22`
  - **Acceptance Criteria:**
    - [ ] Admin bisa akses, Staff mendapat 403
    - [ ] Filter date range dan type berfungsi

---

## Phase 6: Backend: User Management
> **Dependencies:** Phase 3 complete (auth & RBAC ready)
> **Goal:** Admin bisa mengelola user CRUD

- [ ] **Task 6.1: User Service**
  - **Files:** `backend/src/services/userService.js`
  - **Description:** Business logic untuk Users CRUD: validasi email unique, hash password saat create/update, tidak bisa edit self (delete)
  - **References:** `project-context/api.md#resource-users`, `project-context/schema.md#table-data-01-users`
  - **Traceability IDs:** `DATA-01` `FEAT-10` `BR-05`
  - **Acceptance Criteria:**
    - [ ] Email unique validation
    - [ ] Password di-hash saat create/update
    - [ ] Cannot delete self

- [ ] **Task 6.2: User Controller & Routes**
  - **Files:** `backend/src/controllers/userController.js`, `backend/src/routes/users.js`
  - **Description:** GET /users (Admin), POST /users (Admin), PUT /users/:id (Admin), DELETE /users/:id (Admin — cannot delete self)
  - **References:** `project-context/api.md#api-23-to-api-26`
  - **Traceability IDs:** `FEAT-10` `API-23` `API-24` `API-25` `API-26`
  - **Acceptance Criteria:**
    - [ ] List all users (Admin only)
    - [ ] Create user dengan role admin/staff
    - [ ] Update user data/password
    - [ ] Delete user (tidak bisa hapus diri sendiri)

---

## Phase 6.5: Design Assets (Logo, Brand, Banner, Slides)
> **Dependencies:** Phase 6 complete (backend done, frontend not yet started)
> **Goal:** Semua aset visual siap sebelum styling frontend dimulai

- [ ] **Task 6.5.1: Generate Logo SVG**
  - **Files:** `assets/design/logo/logo.svg`, `assets/design/logo/logo-icon.svg`
  - **Description:** Buat logo aplikasi Inventory Management System dengan tema Mie Gacoan (magenta + cyan). Format SVG untuk scalability. Sediakan versi full (logo + teks) dan icon-only
  - **References:** `project-context/StyleGuide.md#brand-identity-mie-gacoan-inspired`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] Logo full (horizontal) siap digunakan di sidebar
    - [ ] Logo icon-only siap digunakan di favicon
    - [ ] Warna menggunakan magenta (#EC008C) dan cyan (#00B2D8)

- [ ] **Task 6.5.2: Brand Guidelines document**
  - **Files:** `assets/design/brand/brand-guidelines.md`
  - **Description:** Buat dokumen brand identity: logo usage, color palette dengan konteks penggunaan, typography system, tone of voice, contoh aplikasi di UI
  - **References:** `project-context/StyleGuide.md#brand-identity`, `project-context/StyleGuide.md#design-tokens`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] Dokumen mencakup logo, warna, tipografi, tone of voice
    - [ ] Contoh aplikasi di UI (sidebar, button, card)

- [ ] **Task 6.5.3: Banner Login Page**
  - **Files:** `assets/design/banner/login-banner.svg`
  - **Description:** Desain banner/ilustrasi untuk halaman login — gradasi magenta-ke-putih, icon inventory minimalis, bersih tanpa teks berlebih
  - **References:** `project-context/StyleGuide.md#login-page-spesifik`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] Banner responsif bisa dipakai di login page
    - [ ] Warna sesuai brand (magenta, cyan, putih)

- [ ] **Task 6.5.4: Presentation Slides HTML**
  - **Files:** `assets/design/slides/presentation.html`
  - **Description:** Buat HTML presentation (dengan Chart.js jika perlu) untuk proyek ini — bisa dipakai untuk demo/meeting
  - **References:** `project-context/StyleGuide.md#design-assets-location`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] Slides HTML bisa dibuka di browser
    - [ ] Berisi overview fitur, tech stack, arsitektur

---

## Phase 7: Frontend: Setup & Layout
> **Dependencies:** Phase 1 complete (frontend folder ready)
> **Goal:** Aplikasi frontend bisa jalan, login page + layout utama siap

- [ ] **Task 7.1: Install & config Tailwind CSS + shadcn/ui**
  - **Files:** `frontend/tailwind.config.js`, `frontend/src/index.css`
  - **Description:** Install Tailwind CSS v3, shadcn/ui (init), Google Fonts (Nunito + Inter). Setup custom colors sesuai StyleGuide: magenta (#EC008C), cyan (#00B2D8), sidebar hitam, dll
  - **References:** `project-context/StyleGuide.md#1-css-framework` `project-context/StyleGuide.md#2-color-palette`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] Tailwind classes berfungsi (test dengan bg-pink-600)
    - [ ] shadcn/ui components bisa diimport
    - [ ] Font Nunito & Inter terload

- [ ] **Task 7.2: Axios service + AuthContext**
  - **Files:** `frontend/src/services/api.js`, `frontend/src/context/AuthContext.jsx`
  - **Description:** Axios instance dengan baseURL, interceptor untuk attach JWT dari localStorage ke Authorization Bearer header. AuthContext: state user, token, login/logout functions, auto-check token expiry
  - **References:** `project-context/architecture.md#3-state-management`, `project-context/architecture.md#2-tech-stack`
  - **Traceability IDs:** `FEAT-01`
  - **Acceptance Criteria:**
    - [ ] Axios auto-attach token ke header
    - [ ] AuthContext menyimpan user + token
    - [ ] Auto logout jika token expired

- [ ] **Task 7.3: ProtectedRoute + role-based redirect**
  - **Files:** `frontend/src/components/layout/ProtectedRoute.jsx`
  - **Description:** Komponen wrapper untuk route protection: cek authentication, redirect ke login jika belum login. Opsional: role check untuk halaman Admin-only
  - **References:** `project-context/PRD.md#ac-03`
  - **Traceability IDs:** `FEAT-01` `AC-01` `AC-03`
  - **Acceptance Criteria:**
    - [ ] User belum login → redirect /login
    - [ ] Staff akses halaman Admin → redirect/403

- [ ] **Task 7.4: Login page**
  - **Files:** `frontend/src/pages/auth/LoginPage.jsx`
  - **Description:** Form login: email + password, tombol login magenta, card centered, logo di atas. Handle loading, error, redirect ke dashboard sesuai role
  - **References:** `project-context/StyleGuide.md#login-page-spesifik`, `project-context/api.md#api-01`
  - **Traceability IDs:** `FEAT-01` `AC-01` `AC-02`
  - **Acceptance Criteria:**
    - [ ] Form login muncul dengan branding magenta
    - [ ] Login sukses → redirect dashboard
    - [ ] Login gagal → tampilkan error message
    - [ ] Loading state pada tombol

- [ ] **Task 7.5: Sidebar component**
  - **Files:** `frontend/src/components/layout/Sidebar.jsx`
  - **Description:** Sidebar hitam fixed (desktop), drawer overlay (tablet/mobile via burger). Menu item dengan icon Lucide. Active state magenta. Role-based menu (Staff tidak lihat Reports & Users)
  - **References:** `project-context/StyleGuide.md#sidebar`, `project-context/StyleGuide.md#6-responsive--breakpoints`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] Desktop: sidebar 240px fixed kiri
    - [ ] Mobile/Tablet: drawer overlay + burger toggle
    - [ ] Menu berubah sesuai role (Admin vs Staff)
    - [ ] Active menu item magenta

- [ ] **Task 7.6: Header component**
  - **Files:** `frontend/src/components/layout/Header.jsx`
  - **Description:** Header putih dengan border-bottom magenta tipis. Right side: avatar user + dropdown profile (logout). Mobile: burger button
  - **References:** `project-context/StyleGuide.md#headernavbar`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] Header menampilkan nama user
    - [ ] Dropdown logout berfungsi
    - [ ] Burger button di mobile

- [ ] **Task 7.7: MainLayout + Router setup**
  - **Files:** `frontend/src/components/layout/MainLayout.jsx`, `frontend/src/App.jsx`
  - **Description:** Layout utama: Sidebar + Header + content area. Router: /login (public), / (dashboard), /products, /categories, /suppliers, /transactions/*, /reports, /users
  - **References:** `project-context/architecture.md#5-folder-structure`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] Layout merender sidebar + header + content
    - [ ] Router terdefinisi untuk semua halaman
    - [ ] Route protection via ProtectedRoute

---

## Phase 8: Frontend: Dashboard & Master Data
> **Dependencies:** Phase 7 complete (layout, auth, router ready)
> **Goal:** Dashboard + CRUD UI untuk Categories, Suppliers, Products

- [ ] **Task 8.1: Dashboard page**
  - **Files:** `frontend/src/pages/dashboard/DashboardPage.jsx`
  - **Description:** Stat cards (total produk, kategori, stock in/out today, low stock) + chart 7 hari (bisa pakai Chart.js atau baris sederhana) + recent activities list
  - **References:** `project-context/api.md#api-21-get-dashboard`, `project-context/StyleGuide.md#card`
  - **Traceability IDs:** `FEAT-08`
  - **Acceptance Criteria:**
    - [ ] Stat cards muncul dengan aksen magenta di border kiri
    - [ ] Chart 7 hari menampilkan in/out per hari
    - [ ] Recent activities update real-time (setelah refresh)

- [ ] **Task 8.2: Categories pages**
  - **Files:** `frontend/src/pages/categories/`
  - **Description:** List page (table dengan search + pagination) + Create/Edit modal/dialog + Delete confirmation. Admin-only untuk Create/Edit/Delete
  - **References:** `project-context/api.md#api-02-to-api-06`, `project-context/StyleGuide.md#table` `modal`
  - **Traceability IDs:** `FEAT-02`
  - **Acceptance Criteria:**
    - [ ] List categories dengan search
    - [ ] Create/Edit modal dengan validasi
    - [ ] Delete dengan confirm dialog
    - [ ] Tombol CRUD hanya untuk Admin

- [ ] **Task 8.3: Suppliers pages**
  - **Files:** `frontend/src/pages/suppliers/`
  - **Description:** List page + CRUD modal. Sama pattern dengan Categories
  - **References:** `project-context/api.md#api-07-to-api-11`
  - **Traceability IDs:** `FEAT-03`
  - **Acceptance Criteria:**
    - [ ] CRUD lengkap dengan validasi
    - [ ] Admin-only untuk mutasi data

- [ ] **Task 8.4: Products — List page**
  - **Files:** `frontend/src/pages/products/ProductList.jsx`
  - **Description:** Table produk dengan kolom: code, name, category, supplier, price, stock, status badge (In Stock/Low Stock/Out of Stock). Search, filter by kategori, pagination. Status badge warna sesuai StyleGuide
  - **References:** `project-context/api.md#api-12`, `project-context/StyleGuide.md#badge`
  - **Traceability IDs:** `FEAT-04`
  - **Acceptance Criteria:**
    - [ ] Table menampilkan semua field
    - [ ] Badge warna sesuai status (green/amber/red)
    - [ ] Search + filter by kategori berfungsi
    - [ ] Pagination

- [ ] **Task 8.5: Products — Create/Edit/Delete**
  - **Files:** `frontend/src/pages/products/ProductForm.jsx`, `frontend/src/pages/products/ProductDetail.jsx`
  - **Description:** Form create/edit (Admin only): code, name, category (select), supplier (select), description, price, minimum_stock. Detail page: info produk + transaction history. Delete with confirm
  - **References:** `project-context/api.md#api-13-to-api-16`
  - **Traceability IDs:** `FEAT-04` `BR-06`
  - **Acceptance Criteria:**
    - [ ] Form validasi (price > 0, code required)
    - [ ] Dropdown category & supplier terisi
    - [ ] Detail page menampilkan transaction history
    - [ ] Soft delete → produk hilang dari list

- [ ] **Task 8.6: UI shared components — shadcn/ui**
  - **Files:** `frontend/src/components/ui/` (dari shadcn)
  - **Description:** Add dan konfigurasi komponen shadcn yang dibutuhkan: Button, Card, Input, Select, Table, Dialog/Modal, Badge, Toast, Skeleton
  - **References:** `project-context/StyleGuide.md#component-inventory`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] Semua komponen terinstall via `npx shadcn@latest add`
    - [ ] Styling sesuai StyleGuide (warna magenta dll)

---

## Phase 9: Frontend: Transactions, Reports & Users
> **Dependencies:** Phase 8 complete (master data UI ready)
> **Goal:** Stock In/Out flow, History, Reports, User Management selesai

- [ ] **Task 9.1: Stock In page**
  - **Files:** `frontend/src/pages/transactions/StockInPage.jsx`
  - **Description:** Form: pilih produk (searchable dropdown), input quantity, note. Validasi quantity > 0. Submit → toast sukses → redirect history
  - **References:** `project-context/api.md#api-17`, `project-context/PRD.md#br-10`
  - **Traceability IDs:** `FEAT-05` `API-17` `AC-04`
  - **Acceptance Criteria:**
    - [ ] Produk bisa dipilih dari dropdown/search
    - [ ] Quantity > 0 tervalidasi
    - [ ] Submit sukses → toast + redirect

- [ ] **Task 9.2: Stock Out page**
  - **Files:** `frontend/src/pages/transactions/StockOutPage.jsx`
  - **Description:** Form: pilih produk, input quantity (menampilkan stok tersedia), note. Validasi quantity ≤ stock. Submit → toast → redirect history
  - **References:** `project-context/api.md#api-18`, `project-context/PRD.md#ac-05` `ac-06`
  - **Traceability IDs:** `FEAT-06` `API-18` `AC-05` `AC-06`
  - **Acceptance Criteria:**
    - [ ] Menampilkan stok saat ini saat pilih produk
    - [ ] Validasi qty ≤ stock (frontend + backend)
    - [ ] Error toast jika stok tidak cukup

- [ ] **Task 9.3: Transaction History page**
  - **Files:** `frontend/src/pages/transactions/HistoryPage.jsx`
  - **Description:** Table riwayat transaksi: date, product, type (IN/OUT badge), quantity, user, note. Filter by type, date range. Pagination
  - **References:** `project-context/api.md#api-19-to-api-20`
  - **Traceability IDs:** `FEAT-07` `API-19` `API-20`
  - **Acceptance Criteria:**
    - [ ] List history dengan pagination
    - [ ] Filter type (IN/OUT) dan date range
    - [ ] Badge IN (green) / OUT (red)

- [ ] **Task 9.4: Reports page**
  - **Files:** `frontend/src/pages/reports/ReportsPage.jsx`
  - **Description:** Admin-only page. Filter date range + type. Tampilkan ringkasan laporan dalam format tabel. Bisa untuk export (future)
  - **References:** `project-context/api.md#api-22`
  - **Traceability IDs:** `FEAT-09` `API-22`
  - **Acceptance Criteria:**
    - [ ] Hanya Admin yang bisa akses
    - [ ] Filter date range dan type berfungsi
    - [ ] Data laporan ditampilkan

- [ ] **Task 9.5: Loading, Empty, Error states**
  - **Files:** Update semua halaman
  - **Description:** Tambah skeleton loading (shadcn Skeleton), empty state ("Belum ada data"), error state (toast + retry)
  - **References:** `project-context/StyleGuide.md#skeleton-loading` `toast`
  - **Traceability IDs:** —
  - **Acceptance Criteria:**
    - [ ] Loading: skeleton muncul saat fetch data
    - [ ] Empty: pesan "Belum ada data"
    - [ ] Error: toast error + opsi retry

- [ ] **Task 9.6: User Management pages**
  - **Files:** `frontend/src/pages/users/`
  - **Description:** Admin-only. List users (table), Create/Edit user modal (name, email, password, role select), Delete confirmation (tidak bisa hapus self)
  - **References:** `project-context/api.md#api-23-to-api-26`
  - **Traceability IDs:** `FEAT-10` `API-23` `API-24` `API-25` `API-26`
  - **Acceptance Criteria:**
    - [ ] List user dengan role badge
    - [ ] Create user dengan pilihan role
    - [ ] Edit user (password opsional)
    - [ ] Delete user (confirm dialog, cannot delete self)
    - [ ] Hanya Admin yang bisa akses

- [ ] **Task 9.7: Logout + midnight auto-logout handling**
  - **Files:** Update `frontend/src/context/AuthContext.jsx`, update `frontend/src/components/layout/Header.jsx`
  - **Description:** Logout button → hapus token + redirect login. Auto-logout detection: cek JWT expiry setiap kali app mount atau interval. Jika expired/tengah malam → auto logout + toast
  - **References:** `project-context/PRD.md#br-11`, `project-context/api.md#api-01-notes`
  - **Traceability IDs:** `BR-11`
  - **Acceptance Criteria:**
    - [ ] Logout button berfungsi
    - [ ] Token expired → auto redirect ke login
    - [ ] Pesan toast "Sesi berakhir, silakan login ulang"

---

## Traceability Matrix
| Requirement ID | Source | Tasks That Cover It |
|----------------|--------|----------------------|
| FEAT-01 | `project-context/PRD.md` | 3.1, 3.2, 7.2, 7.3, 7.4 |
| FEAT-02 | `project-context/PRD.md` | 4.1, 8.2 |
| FEAT-03 | `project-context/PRD.md` | 4.2, 8.3 |
| FEAT-04 | `project-context/PRD.md` | 4.3, 4.4, 4.5, 8.4, 8.5 |
| FEAT-05 | `project-context/PRD.md` | 2.6, 5.1, 9.1 |
| FEAT-06 | `project-context/PRD.md` | 2.6, 5.1, 9.2 |
| FEAT-07 | `project-context/PRD.md` | 2.6, 5.2, 9.3 |
| FEAT-08 | `project-context/PRD.md` | 5.3, 8.1 |
| FEAT-09 | `project-context/PRD.md` | 5.4, 9.4 |
| FEAT-10 | `project-context/PRD.md` | 6.1, 6.2, 9.6 |
| BR-01 | `project-context/PRD.md` | 2.5 |
| BR-02 | `project-context/PRD.md` | 5.1 |
| BR-03 | `project-context/PRD.md` | 5.1 |
| BR-04 | `project-context/PRD.md` | 2.5, 4.3 |
| BR-05 | `project-context/PRD.md` | 2.2, 2.7, 6.1 |
| BR-06 | `project-context/PRD.md` | 2.5, 4.4, 8.5 |
| BR-07 | `project-context/PRD.md` | 5.1 |
| BR-08 | `project-context/PRD.md` | 3.2 |
| BR-09 | `project-context/PRD.md` | 2.5 |
| BR-10 | `project-context/PRD.md` | 2.6, 5.1, 9.1 |
| BR-11 | `project-context/PRD.md` | 3.1, 9.7 |
| NFR-02 | `project-context/PRD.md` | 2.7, 3.1 |
| NFR-03 | `project-context/PRD.md` | 3.1, 3.2 |
| NFR-04 | `project-context/PRD.md` | 4.6 |
| AC-01 | `project-context/PRD.md` | 3.1, 7.3, 7.4 |
| AC-02 | `project-context/PRD.md` | 3.1, 7.4 |
| AC-03 | `project-context/PRD.md` | 3.2, 7.3 |
| AC-04 | `project-context/PRD.md` | 5.1, 9.1 |
| AC-05 | `project-context/PRD.md` | 5.1, 9.2 |
| AC-06 | `project-context/PRD.md` | 5.1, 9.2 |
| API-01 | `project-context/api.md` | 3.1, 3.3 |
| API-02~06 | `project-context/api.md` | 4.1, 8.2 |
| API-07~11 | `project-context/api.md` | 4.2, 8.3 |
| API-12~16 | `project-context/api.md` | 4.3, 4.4, 4.5, 8.4, 8.5 |
| API-17 | `project-context/api.md` | 5.1, 9.1 |
| API-18 | `project-context/api.md` | 5.1, 9.2 |
| API-19~20 | `project-context/api.md` | 5.2, 9.3 |
| API-21 | `project-context/api.md` | 5.3, 8.1 |
| API-22 | `project-context/api.md` | 5.4, 9.4 |
| API-23~26 | `project-context/api.md` | 6.1, 6.2, 9.6 |
| DATA-01 | `project-context/schema.md` | 2.2, 6.1 |
| DATA-02 | `project-context/schema.md` | 2.3, 4.1 |
| DATA-03 | `project-context/schema.md` | 2.4, 4.2 |
| DATA-04 | `project-context/schema.md` | 2.5, 4.3 |
| DATA-05 | `project-context/schema.md` | 2.6, 5.1, 5.2 |

## Assumptions & Open Questions
- DB credentials (nama database, user, password, host) akan diberikan user saat Phase 2 dimulai — tercatat di `project-context/schema.md#pending-decisions`
- Testing manual untuk MVP — automated test menyusul (sesuai `project-context/rules.md#7`)
- TypeScript tidak digunakan di MVP (JavaScript ES2022+) — sesuai revisi terakhir
- Aset design (logo, banner, brand guidelines) akan digenerate setelah implementasi selesai
- Deployment manual — CI/CD belum diatur